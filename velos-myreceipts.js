/* "My receipts": lists a person's own fee receipts and lets them download the stamped PDF.
   VelosMyReceipts.mount(db, elementId)  - needs velos-stamp.js and velos-receipts.js */
(function (W) {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  W.VelosMyReceipts = {
    rows: [],
    mount: function (db, id) {
      var el = document.getElementById(id); if (!el) return;
      db.rpc('my_fee_receipts').then(function (r) {
        var L = (r && r.data) || []; W.VelosMyReceipts.rows = L;
        if (!L.length) { el.innerHTML = '<p class="m">Your stamped receipts will appear here after each payment is confirmed.</p>'; return; }
        el.innerHTML = '<h3 style="margin:10px 0 4px">My receipts</h3>' + L.map(function (x, i) {
          return '<div class="row" style="padding:6px 0;border-top:1px solid var(--line,#2a3560)"><span><b>' + esc(x.receipt_no || '') + '</b><br><span class="m">' + (x.kind === 'monthly' ? 'Monthly fee ' + esc(x.period || '') : 'Registration fee') + ' · UGX ' + Math.round(x.amount_ugx).toLocaleString('en-US') + ' · ' + new Date(x.paid_at).toLocaleDateString('en-GB') + '</span></span><button class="g" onclick="VelosMyReceipts.get(' + i + ')">Download receipt</button></div>';
        }).join('');
      }, function () {});
    },
    get: function (i) { var x = this.rows[i]; if (!x) return; VelosReceipt.fee(x).then(function (r) { VelosReceipt.save(r); }, function (e) { alert(e.message || e); }); }
  };
})(window);
