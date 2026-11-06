/* Safe delete dialog for every dashboard.
   VelosSafe.confirmDelete({name, what, permanent, extra, onConfirm(typedWord)})
   - the person must type DELETE; the dialog says clearly that it cannot be undone and that the item disappears
     from the Velos site AND from their own dashboard.
   - permanent:true shows the stronger "permanently unavailable" warning.
   onConfirm may throw / reject: the message is shown in the dialog and nothing is closed. */
(function (W) {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function confirmDelete(o) {
    var old = document.getElementById('vsafe'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'vsafe';
    d.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,20,.88);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif';
    d.innerHTML = '<div role="alertdialog" aria-modal="true" style="max-width:460px;width:100%;background:#0f1730;color:#f4f1ea;border:2px solid #b3261e;border-radius:16px;padding:20px;box-shadow:0 20px 60px rgba(0,0,0,.6)">'
      + '<div style="font-size:34px">⚠️</div><h3 style="margin:6px 0;font-family:Georgia,serif;font-size:22px;color:#ff8a80">Delete ' + esc(o.what || 'this item') + ' for good?</h3>'
      + '<p style="margin:6px 0;font-size:16px"><b>' + esc(o.name || '') + '</b></p>'
      + (o.permanent ? '<div style="background:#3a1210;border:1px solid #b3261e;border-radius:10px;padding:10px;margin:8px 0;font-size:14px"><b>This item is marked permanently unavailable.</b> Deleting it removes it from the Velos site and from your dashboard, and Velos cannot bring it back.</div>'
        : '<div style="background:#2b1d0b;border:1px solid #8a6a1f;border-radius:10px;padding:10px;margin:8px 0;font-size:14px">Deleting removes it from the Velos site <b>and</b> from your dashboard. If you only want to stop selling it for now, cancel and use <b>Out of stock</b> or <b>Temporarily unavailable</b> instead.</div>')
      + (o.extra ? '<p style="font-size:14px;color:#a3adc6">' + esc(o.extra) + '</p>' : '')
      + '<p style="font-size:14px;margin:10px 0 4px"><b>This cannot be undone.</b> Type <b style="color:#ff8a80">DELETE</b> to confirm.</p>'
      + '<input id="vsafe-in" autocomplete="off" autocapitalize="characters" placeholder="Type DELETE" style="width:100%;padding:12px;border-radius:8px;border:1px solid #2a3560;background:#080d1f;color:#f4f1ea;font:inherit;text-transform:uppercase">'
      + '<p id="vsafe-er" style="color:#ff8a80;font-size:13px;min-height:18px;margin:6px 0"></p>'
      + '<div style="display:flex;gap:10px"><button id="vsafe-no" style="flex:1;padding:12px;border-radius:8px;border:1px solid #2a3560;background:none;color:#f4f1ea;font:inherit;font-weight:700;cursor:pointer">Keep it</button>'
      + '<button id="vsafe-ok" disabled style="flex:1;padding:12px;border-radius:8px;border:0;background:#b3261e;color:#fff;font:inherit;font-weight:700;cursor:pointer;opacity:.45">Delete forever</button></div></div>';
    document.body.appendChild(d);
    var inp = d.querySelector('#vsafe-in'), ok = d.querySelector('#vsafe-ok'), er = d.querySelector('#vsafe-er');
    inp.oninput = function () { var g = inp.value.trim().toUpperCase() === 'DELETE'; ok.disabled = !g; ok.style.opacity = g ? 1 : .45; };
    d.querySelector('#vsafe-no').onclick = function () { d.remove(); };
    ok.onclick = function () {
      ok.disabled = true; ok.textContent = 'Deleting…'; er.textContent = '';
      Promise.resolve().then(function () { return o.onConfirm(inp.value.trim().toUpperCase()); }).then(function () { d.remove(); }, function (e) { er.textContent = (e && e.message) || String(e); ok.disabled = false; ok.textContent = 'Delete forever'; });
    };
    setTimeout(function () { inp.focus(); }, 50);
  }
  W.VelosSafe = { confirmDelete: confirmDelete };
})(window);
