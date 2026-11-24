/* Velos sign-before-download: the agreement is shown only inside this protected window, and the document is created only after the partner has signed.
   VelosSign.ask({title, subtitle, name, business, terms:[[heading,text],...], note}) -> Promise({sig: dataUrl PNG, name}) or rejects when cancelled.
   Honest limit: no website can stop a phone screenshot. The unsigned view carries a watermark with the business name, it cannot be printed or selected,
   and a document without the partner's signature has no force. */
(function (W) {
  var D = document;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function css() {
    if (D.getElementById('vs-css')) return; var s = D.createElement('style'); s.id = 'vs-css';
    s.textContent = '.vs-w{position:fixed;inset:0;background:rgba(4,8,20,.94);z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'
      + '.vs-b{background:#0f1730;color:#f4f1ea;width:100%;max-width:640px;max-height:96vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px;position:relative;font:15px/1.5 Inter,system-ui,sans-serif}@media(min-width:800px){.vs-w{align-items:center}.vs-b{border-radius:18px}}'
      + '.vs-b h2{margin:0 0 4px;font:700 20px Georgia,serif;color:#e8c766}.vs-m{color:#a3adc6;font-size:13px}.vs-t{border:1px solid #2a3560;border-radius:12px;padding:10px;margin:10px 0;max-height:34vh;overflow:auto;position:relative;background:#0b1226}'
      + '.vs-t p{margin:8px 0;font-size:13.5px}.vs-wm{position:absolute;inset:0;pointer-events:none;display:flex;flex-wrap:wrap;align-content:space-around;justify-content:space-around;opacity:.09;font:700 15px Helvetica;transform:rotate(-22deg);overflow:hidden}'
      + '.vs-b input[type=text]{width:100%;padding:12px;margin:5px 0;background:#080d1f;color:#f4f1ea;border:1px solid #2a3560;border-radius:8px;font:inherit;-webkit-user-select:text;user-select:text}'
      + '.vs-b canvas{width:100%;height:150px;background:#fff;border-radius:10px;touch-action:none;display:block}.vs-r{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}'
      + '.vs-b button{padding:12px;border:0;border-radius:8px;background:#e8c766;color:#080d1f;font-weight:700;font-size:15px;cursor:pointer}.vs-b button.g{background:none;border:1px solid #2a3560;color:#f4f1ea}.vs-e{color:#ff8a80;font-size:13px;min-height:18px}'
      + '@media print{.vs-w{display:none!important}}';
    D.head.appendChild(s);
  }
  function ask(o) {
    css();
    return new Promise(function (ok, no) {
      var w = D.createElement('div'); w.className = 'vs-w'; w.oncontextmenu = function (e) { e.preventDefault(); };
      var wm = ''; for (var i = 0; i < 24; i++) wm += '<span>UNSIGNED PREVIEW · ' + esc(o.business || '') + ' · THE VELOS GROUP</span>';
      w.innerHTML = '<div class="vs-b"><h2>' + esc(o.title || 'Sign your agreement') + '</h2><div class="vs-m">' + esc(o.subtitle || 'Read, then sign with your finger. The signed document downloads after you sign.') + '</div>'
        + '<div class="vs-t"><div class="vs-wm">' + wm + '</div>' + (o.terms || []).map(function (t, i) { return '<p><b>' + (i + 1) + '. ' + esc(t[0]) + '.</b> ' + esc(t[1]) + '</p>'; }).join('') + '</div>'
        + '<input type="text" id="vs-n" placeholder="Type your full name *" value="' + esc(o.name || '') + '" autocomplete="name"><div class="vs-m">Sign inside the box</div><canvas id="vs-c" width="640" height="240"></canvas>'
        + '<div class="vs-r"><button class="g" id="vs-x">Clear</button><span></span></div><label class="vs-m" style="display:flex;gap:8px;margin-top:8px;align-items:flex-start"><input type="checkbox" id="vs-a" style="width:auto;margin-top:4px"><span>I have read this agreement and I sign it' + (o.business ? ' for ' + esc(o.business) : '') + '.</span></label>'
        + '<div class="vs-e" id="vs-e"></div><div class="vs-r"><button id="vs-ok">✍️ Sign and continue</button><button class="g" id="vs-no">Cancel</button></div>' + (o.note ? '<div class="vs-m" style="margin-top:8px">' + esc(o.note) + '</div>' : '') + '</div>';
      D.body.appendChild(w);
      var c = w.querySelector('#vs-c'), x = c.getContext('2d'), ink = false, down = false; x.lineWidth = 3.2; x.lineCap = 'round'; x.strokeStyle = '#0a1230';
      var pos = function (ev) { var r = c.getBoundingClientRect(), t = ev.touches ? ev.touches[0] : ev; return [(t.clientX - r.left) * c.width / r.width, (t.clientY - r.top) * c.height / r.height]; };
      var st = function (ev) { ev.preventDefault(); down = true; var p = pos(ev); x.beginPath(); x.moveTo(p[0], p[1]); }, mv = function (ev) { if (!down) return; ev.preventDefault(); var p = pos(ev); x.lineTo(p[0], p[1]); x.stroke(); ink = true; }, en = function () { down = false; };
      c.addEventListener('touchstart', st, { passive: false }); c.addEventListener('touchmove', mv, { passive: false }); c.addEventListener('touchend', en); c.addEventListener('mousedown', st); c.addEventListener('mousemove', mv); W.addEventListener('mouseup', en);
      w.querySelector('#vs-x').onclick = function () { x.clearRect(0, 0, c.width, c.height); ink = false; };
      w.querySelector('#vs-no').onclick = function () { w.remove(); no(new Error('cancelled')); };
      w.querySelector('#vs-ok').onclick = function () {
        var n = w.querySelector('#vs-n').value.trim(), e = w.querySelector('#vs-e');
        if (n.length < 3) { e.textContent = 'Type your full name.'; return; } if (!ink) { e.textContent = 'Please sign inside the box.'; return; } if (!w.querySelector('#vs-a').checked) { e.textContent = 'Tick the box to confirm.'; return; }
        var sig = c.toDataURL('image/png'); w.remove(); ok({ sig: sig, name: n });
      };
    });
  }
  W.VelosSign = { ask: ask };
})(window);
