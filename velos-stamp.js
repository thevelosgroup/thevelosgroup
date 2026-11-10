/* Velos official stamp: a dated, circular company stamp drawn on a canvas (no image file needed).
   VelosStamp.png({date, label, size})  -> Promise<dataURL>   (date: Date, ISO string or omitted = today)
   VelosStamp.place(doc, x, y, mm, opts) -> adds the stamp to a jsPDF page (x,y = top-left, mm = width)
   VelosStamp.html(opts, px)             -> Promise<'<img ...>'> for on-screen receipts
   label: 'OFFICIAL' (default) | 'PAID' | 'RECEIVED' | 'APPROVED' | 'VERIFIED' */
(function (W) {
  var INK = '#1b2f86', cache = {};
  /* the real Velos emblem (logo-mark.png) is turned into a one-colour ink mark, so the stamp carries the logo instead of a letter */
  var MARK = null, MARKP = null;
  function loadMark() { if (MARKP) return MARKP;
    MARKP = new Promise(function (ok) { var im = new Image(); im.onload = function () { try {
      var w = 360, h = Math.round(360 * im.naturalHeight / im.naturalWidth), cv = document.createElement('canvas'); cv.width = w; cv.height = h; var x = cv.getContext('2d'); x.drawImage(im, 0, 0, w, h);
      var d = x.getImageData(0, 0, w, h), p = d.data, i, r = 27, g = 47, b = 134;
      for (i = 0; i < p.length; i += 4) { var a = p[i + 3]; if (!a) continue; var white = p[i] > 190 && p[i + 1] > 190 && p[i + 2] > 190; p[i] = r; p[i + 1] = g; p[i + 2] = b; p[i + 3] = white ? a : Math.round(a * 0.5); }
      x.putImageData(d, 0, 0); MARK = cv; } catch (e) { MARK = null; } ok(); };
      im.onerror = function () { ok(); }; im.src = 'logo-mark.png'; });
    return MARKP; }
  var MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function when(d) {
    var x = d ? new Date(d) : new Date(); if (isNaN(x)) x = new Date();
    var p; try { p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', day: '2-digit', month: 'numeric', year: 'numeric' }).formatToParts(x); } catch (e) { p = null; }
    if (p) { var o = {}; p.forEach(function (q) { o[q.type] = q.value; }); return o.day + ' ' + MON[Number(o.month) - 1] + ' ' + o.year; }
    return ('0' + x.getDate()).slice(-2) + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear();
  }
  function arc(c, text, cx, cy, r, mid, flip, size, spacing) {
    c.save(); c.font = '700 ' + size + 'px Arial, Helvetica, sans-serif'; c.fillStyle = INK; c.textAlign = 'center'; c.textBaseline = 'middle';
    var n = text.length, span = (n - 1) * spacing, start = mid - (flip ? -1 : 1) * span / 2;
    for (var i = 0; i < n; i++) {
      var a = start + (flip ? -1 : 1) * i * spacing;
      c.save(); c.translate(cx + r * Math.cos(a), cy + r * Math.sin(a)); c.rotate(a + (flip ? -Math.PI / 2 : Math.PI / 2)); c.fillText(text[i], 0, 0); c.restore();
    }
    c.restore();
  }
  function draw(opts) {
    opts = opts || {}; var S = opts.size || 640, label = (opts.label || 'OFFICIAL').toUpperCase(), ds = when(opts.date);
    var key = S + '|' + label + '|' + ds; if (cache[key]) return cache[key];
    var cv = document.createElement('canvas'); cv.width = cv.height = S; var c = cv.getContext('2d'), m = S / 2, u = S / 640;
    c.translate(m, m); c.rotate(-7 * Math.PI / 180); c.translate(-m, -m);
    c.strokeStyle = INK; c.fillStyle = INK; c.lineCap = 'round';
    c.lineWidth = 12 * u; c.beginPath(); c.arc(m, m, 300 * u, 0, 7); c.stroke();
    c.lineWidth = 3 * u; c.beginPath(); c.arc(m, m, 282 * u, 0, 7); c.stroke();
    c.lineWidth = 3 * u; c.beginPath(); c.arc(m, m, 178 * u, 0, 7); c.stroke();
    arc(c, 'THE VELOS GROUP', m, m, 232 * u, -Math.PI / 2, false, 50 * u, 0.153);
    arc(c, 'UGANDA', m, m, 244 * u, Math.PI / 2, true, 44 * u, 0.2);
    [-Math.PI, 0].forEach(function (a) { c.save(); c.translate(m + 232 * u * Math.cos(a), m + 232 * u * Math.sin(a)); c.beginPath(); for (var i = 0; i < 5; i++) { var t = -Math.PI / 2 + i * 4 * Math.PI / 5; c.lineTo(Math.cos(t) * 20 * u, Math.sin(t) * 20 * u); } c.closePath(); c.fill(); c.restore(); });
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if (MARK) { var lw = 168 * u, lh = lw * MARK.height / MARK.width; c.drawImage(MARK, m - lw / 2, m - 96 * u - lh / 2, lw, lh); }
    else { c.font = '700 ' + 92 * u + 'px Georgia, "Times New Roman", serif'; c.fillText('V', m, m - 92 * u); }
    c.fillRect(m - 120 * u, m - 38 * u, 240 * u, 5 * u);
    c.font = '700 ' + (label.length > 8 ? 40 : 50) * u + 'px Arial, Helvetica, sans-serif'; c.fillText(label, m, m + 4 * u);
    c.fillRect(m - 120 * u, m + 38 * u, 240 * u, 5 * u);
    c.font = '700 ' + 44 * u + 'px "Courier New", monospace'; c.fillText(ds, m, m + 90 * u);
    // light ink texture
    c.globalCompositeOperation = 'destination-out';
    for (var i = 0; i < 160; i++) { c.beginPath(); c.arc(Math.random() * S, Math.random() * S, (1 + Math.random() * 2.2) * u, 0, 7); c.fillStyle = 'rgba(0,0,0,' + (0.25 + Math.random() * 0.4) + ')'; c.fill(); }
    cache[key] = cv.toDataURL('image/png'); return cache[key];
  }
  function png(o) { return loadMark().then(function () { try { return draw(o); } catch (e) { return null; } }); }
  function place(doc, x, y, mm, o) { return png(o).then(function (d) { if (!d) return false; try { doc.addImage(d, 'PNG', x, y, mm || 32, mm || 32); return true; } catch (e) { return false; } }); }
  function html(o, px) { return png(o).then(function (d) { return d ? '<img alt="Velos official stamp" src="' + d + '" style="width:' + (px || 130) + 'px;height:' + (px || 130) + 'px;opacity:.92">' : ''; }); }
  W.VelosStamp = { png: png, place: place, html: html, dateText: when };
})(window);
