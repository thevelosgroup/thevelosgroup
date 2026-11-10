/* Velos customer documents: Receipt, Invoice or Quotation (PDF) with the official dated stamp and signature.
   The customer's details are filled in automatically from the order.
   VelosDocs.sheet(order, {draft})   opens the "Choose a document" window
   VelosDocs.make(kind, order)       -> Promise<{doc, file}>   kind: 'receipt' | 'invoice' | 'quotation'
   order = {no, date, store, mode:'delivery'|'pickup', customer:{name,phone,email,address},
            lines:[{name, qty, unit, price}], delivery, km, paid, method, ref, note}
   Needs velos-stamp.js (stamp) and loads jsPDF by itself.                                                    */
(function (W) {
  var NV = [3, 17, 62], GD = [212, 175, 55], TX = [30, 35, 50], GR = [110, 118, 140], LT = [244, 246, 251];
  var URLS = ['https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'];
  var KINDS = { receipt: { title: 'RECEIPT', pre: 'RC', stamp: 'PAID' }, invoice: { title: 'INVOICE', pre: 'INV', stamp: 'INVOICED' }, quotation: { title: 'QUOTATION', pre: 'QT', stamp: 'QUOTED' } };
  function lib() { return new Promise(function (ok, bad) { if (W.jspdf) return ok(); var i = 0; (function next() { if (i >= URLS.length) return bad(Error('The document tool could not load. Check your internet and try again.')); var s = document.createElement('script'); s.src = URLS[i++]; s.onload = function () { W.jspdf ? ok() : next(); }; s.onerror = next; document.head.appendChild(s); })(); }); }
  function img(src, type, size) { return new Promise(function (res) { var i = new Image(); i.onload = function () { try { var c = document.createElement('canvas'); c.width = size || i.naturalWidth; c.height = size || i.naturalHeight; var x = c.getContext('2d'); if (type === 'jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); } x.drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL(type === 'jpeg' ? 'image/jpeg' : 'image/png', .92)); } catch (e) { res(null); } }; i.onerror = function () { res(null); }; i.src = src; }); }
  function clean(s) { return String(s == null ? '' : s).replace(/[^\x20-\x7E -ÿ]/g, '').trim(); }
  function ugx(n) { return 'UGX ' + Math.round(Number(n) || 0).toLocaleString('en-US'); }
  function dmy(d) { try { return new Date(d || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Africa/Kampala' }); } catch (e) { return ''; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function totals(o) { var sub = 0; (o.lines || []).forEach(function (l) { sub += (Number(l.price) || 0) * (Number(l.qty) || 0); }); var del = o.mode === 'pickup' ? 0 : (Number(o.delivery) || 0), total = sub + del, paid = Math.min(Number(o.paid) || 0, total || Infinity); return { sub: sub, del: del, total: total, paid: paid, bal: Math.max(0, total - (Number(o.paid) || 0)) }; }
  function docNo(kind, o) { var K = KINDS[kind]; if (o.no) return K.pre + '-' + clean(o.no).replace(/[^A-Za-z0-9-]/g, ''); var d = new Date(); function z(n) { return ('0' + n).slice(-2); } return K.pre + '-' + String(d.getFullYear()).slice(2) + z(d.getMonth() + 1) + z(d.getDate()) + z(d.getHours()) + z(d.getMinutes()); }
  function payInfo() { var c = W.VELOS_SUPABASE; if (!c) return Promise.resolve({}); return fetch(c.url + '/rest/v1/settings?select=key,value&key=like.site_pay_*', { headers: { apikey: c.key } }).then(function (r) { return r.ok ? r.json() : []; }).then(function (a) { var P = {}; (a || []).forEach(function (x) { P[x.key] = x.value; }); return P; }).catch(function () { return {}; }); }

  async function make(kind, o) {
    var K = KINDS[kind]; if (!K) throw Error('Unknown document');
    await lib(); var J = W.jspdf.jsPDF, doc = new J({ unit: 'mm', format: 'a4' }), Wd = 210, T = totals(o), c = o.customer || {}, date = o.date || new Date();
    var logo = await img('logo-doc.png', 'jpeg', 256), sig = await img('signature.png', 'png'), P = kind === 'receipt' ? {} : await payInfo(), no = docNo(kind, o);
    function head() {
      doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 0, Wd, 40, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 40, Wd, 1.4, 'F');
      if (logo) { try { doc.addImage(logo, 'JPEG', 15, 8, 24, 24); } catch (e) {} }
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.text('The Velos Group', 44, 17);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(232, 199, 102); doc.text('Anything. Anywhere. Precisely.', 44, 23);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(190, 200, 225); doc.text('Uganda', 44, 29); doc.text('info@thevelosgroup.com  |  thevelosgroup.com', 44, 33);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(232, 199, 102); doc.text(K.title, 195, 18, { align: 'right' });
      doc.setFontSize(10); doc.setTextColor(255, 255, 255); doc.text('No. ' + no, 195, 26, { align: 'right' }); doc.setFont('helvetica', 'normal'); doc.text('Date: ' + dmy(date), 195, 32, { align: 'right' });
    }
    head();
    var y = 54;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(kind === 'quotation' ? 'PREPARED FOR' : 'BILLED TO', 15, y);
    doc.setFontSize(13); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(clean(c.name) || '-', 15, y + 6.5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(GR[0], GR[1], GR[2]);
    var cl = []; if (c.phone) cl.push('Phone: ' + clean(c.phone)); if (c.email) cl.push('Email: ' + clean(c.email)); if (c.address) cl.push(doc.splitTextToSize((o.mode === 'pickup' ? 'Collection: ' : 'Deliver to: ') + clean(c.address), 90)); cl = [].concat.apply([], cl);
    cl.forEach(function (l, i) { doc.text(l, 15, y + 12 + i * 5); });
    var rx = 120, ry = y; doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('DETAILS', rx, ry);
    var det = []; if (o.no) det.push(['Order no.', '#' + clean(o.no)]); if (o.store) det.push(['Supplied by', clean(o.store)]); det.push(['Delivery', o.mode === 'pickup' ? 'Pick-up' : 'Delivery' + (o.km ? ' (' + o.km + ' km)' : '')]);
    if (kind === 'quotation') { var v = new Date(date); v.setDate(v.getDate() + 7); det.push(['Valid until', dmy(v)]); } if (kind === 'invoice') det.push(['Payment due', T.bal > 0 ? (o.method && /cash/i.test(o.method) ? 'On delivery or collection' : 'On receipt') : 'Paid']); if (kind === 'receipt' && o.method) det.push(['Paid by', clean(o.method)]); if (kind === 'receipt' && o.ref) det.push(['Transaction ID', clean(o.ref)]);
    det.forEach(function (d, i) { doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(d[0], rx, ry + 6 + i * 5.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(doc.splitTextToSize(d[1], 62)[0], rx + 30, ry + 6 + i * 5.5); });
    y = Math.max(y + 14 + cl.length * 5, ry + 8 + det.length * 5.5) + 8;
    function th() { doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(15, y, 180, 9, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(255, 255, 255); doc.text('Description', 18, y + 6); doc.text('Qty', 120, y + 6, { align: 'right' }); doc.text('Unit price', 152, y + 6, { align: 'right' }); doc.text('Amount', 192, y + 6, { align: 'right' }); y += 9; }
    th();
    (o.lines || []).forEach(function (l, i) {
      var nm = doc.splitTextToSize(clean(l.name) + (l.unit && l.unit !== 'piece' ? ' (' + clean(l.unit) + ')' : ''), 92), h = Math.max(9, nm.length * 4.6 + 4);
      if (y + h > 245) { doc.addPage(); y = 20; th(); }
      if (i % 2 === 0) { doc.setFillColor(LT[0], LT[1], LT[2]); doc.rect(15, y, 180, h, 'F'); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(TX[0], TX[1], TX[2]); nm.forEach(function (t, k) { doc.text(t, 18, y + 6 + k * 4.6); });
      doc.text(String(l.qty), 120, y + 6, { align: 'right' }); doc.text(ugx(l.price), 152, y + 6, { align: 'right' }); doc.text(ugx(l.price * l.qty), 192, y + 6, { align: 'right' }); y += h;
    });
    y += 4; if (y > 215) { doc.addPage(); y = 20; }
    function row(a, b, bold) { doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(10); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(a, 130, y + 5); doc.text(b, 192, y + 5, { align: 'right' }); y += 7; }
    row('Items', ugx(T.sub)); row(o.mode === 'pickup' ? 'Delivery (pick-up)' : 'Delivery' + (o.km ? ' (' + o.km + ' km)' : ''), o.mode === 'pickup' ? 'None' : (T.del ? ugx(T.del) : 'To be confirmed'));
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(125, y, 70, 11, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(232, 199, 102); doc.text(kind === 'quotation' ? 'TOTAL QUOTED' : 'TOTAL', 129, y + 7.3); doc.setTextColor(255, 255, 255); doc.text(ugx(T.total), 192, y + 7.3, { align: 'right' }); y += 15;
    if (kind !== 'quotation') { row('Amount paid', ugx(Number(o.paid) || 0)); row(T.bal > 0 ? 'Balance due' : 'Balance', T.bal > 0 ? ugx(T.bal) : 'UGX 0 · Paid in full', true); }
    y += 2;
    if (kind !== 'receipt') {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text('How to pay', 15, y); y += 5; doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(GR[0], GR[1], GR[2]);
      var pl = []; if (P.site_pay_mtn_number) pl.push('MTN Mobile Money: ' + clean(P.site_pay_mtn_number) + ' (' + clean(P.site_pay_mtn_name) + ')'); if (P.site_pay_airtel_number) pl.push('Airtel Money: ' + clean(P.site_pay_airtel_number) + ' (' + clean(P.site_pay_airtel_name) + ')'); pl.push('Pay only to the official Velos numbers above and keep your transaction ID.');
      pl.forEach(function (t) { doc.splitTextToSize(t, 175).forEach(function (l) { doc.text(l, 15, y); y += 4.6; }); }); y += 2;
    }
    var terms = kind === 'quotation' ? 'This quotation is valid for 7 days from the date above. Prices are in Uganda Shillings. The delivery fee is calculated from the distance to your pinned location. Goods are subject to availability.' : kind === 'invoice' ? 'Please pay the balance due as shown. Goods are released after payment is confirmed, or as agreed for orders paid on delivery.' : 'Thank you for your payment.';
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(TX[0], TX[1], TX[2]); doc.splitTextToSize(clean(o.note) ? clean(o.note) + ' ' + terms : terms, 178).forEach(function (l) { doc.text(l, 15, y); y += 4.6; });
    var sy = Math.max(y + 36, 232); if (sy > 262) { doc.addPage(); sy = 60; }
    if (sig) { try { doc.addImage(sig, 'PNG', 20, sy - 25, 36, 24.2); } catch (e) {} }
    try { if (W.VelosStamp) await W.VelosStamp.place(doc, 62, sy - 34, 34, { label: kind === 'receipt' ? (T.bal > 0 ? 'RECEIVED' : 'PAID') : K.stamp, date: date }); } catch (e) {}
    doc.setDrawColor(GR[0], GR[1], GR[2]); doc.setLineWidth(.3); doc.line(15, sy, 75, sy);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text('The Velos Group', 15, sy + 4.5); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('Authorised signatory', 15, sy + 9);
    doc.setFontSize(8); doc.text('This is a computer-generated ' + K.title.toLowerCase() + '. It is valid with the official Velos stamp and signature.', 15, 277);
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 284, Wd, 13, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 284, Wd, .8, 'F');
    doc.setFontSize(8); doc.setTextColor(232, 199, 102); doc.text('Thank you for choosing The Velos Group  |  support@thevelosgroup.com', Wd / 2, 291, { align: 'center' });
    return { doc: doc, file: 'Velos-' + K.title[0] + K.title.slice(1).toLowerCase() + '-' + no.replace(/[^A-Za-z0-9-]/g, '') + '.pdf' };
  }
  function save(r) { r.doc.save(r.file); }

  var CSS = '#vdoc{position:fixed;inset:0;z-index:100000;background:rgba(4,8,20,.86);display:flex;align-items:flex-end;justify-content:center;font:15px/1.45 system-ui,sans-serif}#vdoc .bx{background:#0f1730;color:#f4f1ea;width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:18px;border:1px solid #2a3560}@media(min-width:700px){#vdoc{align-items:center}#vdoc .bx{border-radius:18px}}'
    + '#vdoc h3{margin:0 0 4px;color:#e8c766;font:600 22px Georgia,serif}#vdoc .who{font-size:13px;color:#b7c1e3;margin:2px 0 12px}'
    + '#vdoc .o{display:flex;gap:12px;align-items:center;border:1px solid #2a3560;border-radius:14px;padding:12px;margin:8px 0;background:#0b1226}#vdoc .o i{font-style:normal;font-size:28px}#vdoc .o div{flex:1}#vdoc .o b{display:block}#vdoc .o small{color:#9fb0e0}'
    + '#vdoc button{border:0;border-radius:10px;padding:11px 14px;font:700 14px system-ui;cursor:pointer;background:#e8c766;color:#080d1f}#vdoc button[disabled]{opacity:.4;cursor:not-allowed}#vdoc .x{width:100%;margin-top:6px;background:none;border:1px solid #2a3560;color:#f4f1ea}#vdoc .er{color:#ffb4a8;font-size:13px;margin-top:6px}';
  function sheet(o, opts) {
    opts = opts || {}; var old = document.getElementById('vdoc'); if (old) old.remove();
    if (!document.getElementById('vdoc-css')) { var st = document.createElement('style'); st.id = 'vdoc-css'; st.textContent = CSS; document.head.appendChild(st); }
    var T = totals(o), c = o.customer || {}, canR = (Number(o.paid) || 0) > 0 && !opts.draft, d = document.createElement('div'); d.id = 'vdoc';
    function opt(k, ic, t, sub, ok) { return '<div class="o"><i>' + ic + '</i><div><b>' + t + '</b><small>' + sub + '</small></div><button data-k="' + k + '"' + (ok ? '' : ' disabled') + '>PDF</button></div>'; }
    d.innerHTML = '<div class="bx"><h3>Your documents</h3><div class="who">For <b>' + esc(c.name || 'you') + '</b>' + (c.phone ? ' · ' + esc(c.phone) : '') + (o.no ? ' · Order #' + esc(o.no) : '') + ' · Total ' + ugx(T.total) + '<br>Your details are filled in automatically.</div>'
      + opt('quotation', '📝', 'Quotation', 'A priced offer, valid for 7 days. No payment needed.', true)
      + opt('invoice', '🧾', 'Invoice', 'The bill to pay, with how to pay Velos.', !opts.draft)
      + opt('receipt', '✅', 'Receipt', canR ? 'Proof of the payment of ' + ugx(Number(o.paid) || 0) + '.' : 'Issued once your payment is confirmed.', canR)
      + '<div class="er" id="vdoc-er"></div><button class="x" id="vdoc-x">Close</button></div>';
    document.body.appendChild(d); d.onclick = function (e) { if (e.target === d) d.remove(); }; document.getElementById('vdoc-x').onclick = function () { d.remove(); };
    d.querySelectorAll('button[data-k]').forEach(function (b) { b.onclick = function () { var er = document.getElementById('vdoc-er'); er.textContent = ''; b.disabled = true; b.textContent = '…'; make(b.getAttribute('data-k'), o).then(save).catch(function (e) { er.textContent = e.message || 'Could not create the document.'; }).then(function () { b.disabled = false; b.textContent = 'PDF'; }); }; });
  }
  W.VelosDocs = { make: make, save: save, sheet: sheet };
})(window);
