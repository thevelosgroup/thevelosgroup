/* Velos Order Change: a vendor/restaurant/hotel says "this item is not available", proposes a change, and the customer decides.
   VelosChange.open({db, kind:'food'|'partner'|'booking', no, items:[{name,qty,price,unit}]})   VelosChange.history(db) */
(function(W, D){
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var ugx = function(n){ return 'UGX ' + Math.round(Number(n) || 0).toLocaleString('en-US'); };
  var CSS = '#vcw{position:fixed;inset:0;z-index:2147483000;background:rgba(3,6,18,.78);display:flex;align-items:flex-end;justify-content:center;font:15px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}@media(min-width:700px){#vcw{align-items:center}}'
   + '#vcw .bx{background:#0b1226;color:#f4f1ea;border:1px solid #2f3c74;width:min(560px,100%);max-height:92vh;overflow:auto;border-radius:22px 22px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom))}@media(min-width:700px){#vcw .bx{border-radius:22px}}'
   + '#vcw h2{margin:0 0 4px;font:600 22px Georgia,serif;color:#e8c766}#vcw .m{color:#9fb0e0;font-size:13px}#vcw .ln{border:1px solid #243158;border-radius:14px;padding:10px;margin:8px 0;background:#0a1130}#vcw .ln.off{opacity:.55}#vcw .ln b{display:block}'
   + '#vcw .r{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:6px}#vcw input,#vcw select,#vcw textarea{background:#080d22;color:#f4f1ea;border:1px solid #2a3866;border-radius:10px;padding:9px 10px;font:15px system-ui;box-sizing:border-box}#vcw textarea{width:100%;min-height:64px}'
   + '#vcw .q{width:74px}#vcw .pn{width:110px}#vcw .nm{flex:1;min-width:120px}#vcw button,#vcw a.bt{border:0;border-radius:99px;padding:12px 16px;font:700 14.5px system-ui;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}#vcw .p{background:#e8c766;color:#080d1f}#vcw .g{background:transparent;color:#9fb0e0;border:1px solid #33406f}#vcw .w{background:#25d366;color:#04210f}'
   + '#vcw .tot{display:flex;justify-content:space-between;margin:10px 0;padding:10px 12px;border-radius:12px;background:#121c40}#vcw .warn{background:#3a2410;border:1px solid #7a4a1c;color:#ffd9a0;border-radius:12px;padding:10px;margin:8px 0;font-size:13.5px}#vcw .bad{color:#ff8a80}#vcw .ok{color:#7fd99a}';
  function shell(html){ if(!D.getElementById('vcs')){ var s = D.createElement('style'); s.id = 'vcs'; s.textContent = CSS; D.head.appendChild(s); }
    var o = D.getElementById('vcw'); if(o && o.parentNode){ try { o.parentNode.removeChild(o); } catch(e){} } o = D.createElement('div'); o.id = 'vcw'; o.innerHTML = '<div class="bx">' + html + '</div>'; o.addEventListener('click', function(e){ if(e.target === o) o.remove(); }); D.body.appendChild(o); D.querySelectorAll('#vcw').forEach(function(x){ if(x !== o && x.parentNode) x.parentNode.removeChild(x); }); return o; }
  function link(kind, no){ return location.origin + '/order-change.html?k=' + kind + '&o=' + no; }

  function open(o){ var items = (o.items || []).map(function(i){ return {name:i.name, qty:Number(i.qty) || 1, price:Number(i.price) || 0, unit:i.unit || '', old:Number(i.qty) || 1}; });
    var priced = items.some(function(i){ return i.price > 0; });
    var st = {items:items, extra:[], din:'', dout:''}, nights0 = Math.max(1, Number(o.nights) || 1), today = new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
    function nts(){ if(st.din && st.dout){ var n = Math.round((new Date(st.dout) - new Date(st.din)) / 864e5); return n > 0 ? n : nights0; } return nights0; }
    function draw(){ var h = '<h2>Item not available?</h2><p class="m">Order <b>#' + esc(o.no) + '</b>. Offer the customer a change instead of cancelling. If the customer refuses and cancels, a <b>penalty applies to you</b>, so please contact them politely.</p>'
      + st.items.map(function(i, k){ return '<div class="ln' + (i.qty === 0 ? ' off' : '') + '"><b>' + esc(i.name) + '</b><div class="r"><span class="m">Qty ordered ' + i.old + '</span><label class="m">Can supply</label><input class="q" type="number" min="0" max="' + i.old + '" value="' + i.qty + '" data-k="' + k + '">' + (priced ? '<span class="m">' + ugx(i.price) + ' each</span>' : '') + (i.qty === 0 ? '<span class="bad">Not available</span>' : '') + '</div></div>'; }).join('')
      + (o.stay ? '<div class="m" style="margin-top:8px">Offer different dates (optional). Booked: <b>' + esc(o.stay.in) + ' to ' + esc(o.stay.out) + '</b> · ' + nights0 + ' night(s)</div><div class="r"><input type="date" id="vsin" min="' + today + '" value="' + st.din + '"><input type="date" id="vsout" min="' + today + '" value="' + st.dout + '"></div>' : '')
      + '<div class="m" style="margin-top:8px">' + (o.stay ? 'Offer another room (optional)' : 'Offer a replacement (optional)') + '</div>'
      + st.extra.map(function(e, k){ return '<div class="ln"><div class="r"><input class="nm" placeholder="Replacement item" value="' + esc(e.name) + '" data-en="' + k + '"><input class="q" type="number" min="1" value="' + e.qty + '" data-eq="' + k + '">' + (priced ? '<input class="pn" type="number" min="0" placeholder="Price each" value="' + (e.price || '') + '" data-ep="' + k + '">' : '') + '<button class="g" data-ed="' + k + '">✕</button></div></div>'; }).join('')
      + '<button class="g" id="vcadd" style="margin-top:4px">+ Add replacement</button>'
      + (priced ? '<div class="tot"><span>New total' + (o.stay ? ' for the stay' : ' for items') + '</span><b id="vct"></b></div>' : '<div class="warn">Prices for this order are managed by Velos. Velos will confirm the final total after the customer agrees.</div>')
      + '<select id="vcr" style="width:100%;margin-top:6px"><option value="out_of_stock">Item is out of stock</option><option value="unavailable">Item temporarily unavailable</option><option value="price_changed">Price has changed</option><option value="other">Other</option></select>'
      + '<textarea id="vcm" placeholder="Short message to the customer (for example: Chicken has finished. We can offer fish at the same price.)" style="margin-top:8px"></textarea>'
      + '<div id="vce" class="bad"></div><div class="r" style="margin-top:10px"><button class="p" id="vcs2">Send to customer</button><button class="g" id="vcx">Close</button></div><p class="m">The customer has about 45 minutes to answer. If they do not, the order is cancelled and you are not penalised.</p>';
      var b = shell(h); sums(b);
      b.querySelectorAll('.q[data-k]').forEach(function(e){ e.oninput = function(){ var k = +e.dataset.k, v = Math.max(0, Math.min(st.items[k].old, +e.value || 0)); st.items[k].qty = v; sums(b); }; e.onchange = draw; });
      b.querySelectorAll('[data-en]').forEach(function(e){ e.oninput = function(){ st.extra[+e.dataset.en].name = e.value; }; });
      b.querySelectorAll('[data-eq]').forEach(function(e){ e.oninput = function(){ st.extra[+e.dataset.eq].qty = Math.max(1, +e.value || 1); sums(b); }; });
      b.querySelectorAll('[data-ep]').forEach(function(e){ e.oninput = function(){ st.extra[+e.dataset.ep].price = +e.value || 0; sums(b); }; });
      b.querySelectorAll('[data-ed]').forEach(function(e){ e.onclick = function(){ st.extra.splice(+e.dataset.ed, 1); draw(); }; });
      var di = b.querySelector('#vsin'), dou = b.querySelector('#vsout'); if(di){ di.onchange = function(){ st.din = di.value; if(st.dout && st.dout <= st.din){ st.dout = ''; dou.value = ''; } sums(b); }; dou.onchange = function(){ st.dout = dou.value; sums(b); }; }
      b.querySelector('#vcadd').onclick = function(){ st.extra.push({name:'', qty:1, price:0}); draw(); };
      b.querySelector('#vcx').onclick = function(){ b.remove(); };
      b.querySelector('#vcs2').onclick = function(){ send(b); }; }
    function lines(){ var out = []; st.items.forEach(function(i){ if(i.qty > 0) out.push({name:i.name, qty:i.qty, price:i.price, unit:i.unit}); }); st.extra.forEach(function(e){ if(e.name.trim() && e.qty > 0) out.push({name:e.name.trim(), qty:e.qty, price:e.price || 0, note:'Replacement offered'}); }); return out; }
    function sums(b){ var t = b.querySelector('#vct'); if(t) t.textContent = ugx(lines().reduce(function(a, l){ return a + l.qty * l.price * nts(); }, 0)); }
    function send(b){ var e = b.querySelector('#vce'), btn = b.querySelector('#vcs2'); e.textContent = ''; var L = lines(); if(!L.length){ e.textContent = 'Nothing left in the order. To cancel the whole order, close this and use Cancel (a penalty may apply).'; return; }
      var same = !(st.din && st.dout) && L.length === st.items.length && L.every(function(l, k){ return l.name === st.items[k].name && l.qty === st.items[k].old; }) && !st.extra.length; if(same){ e.textContent = 'Reduce a quantity, mark an item as not available, or add a replacement first.'; return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      o.db.rpc('vendor_change_propose', {p_kind:o.kind, p_no:o.no, p_old_items:st.items.map(function(i){ return {name:i.name, qty:i.old, price:i.price, unit:i.unit}; }), p_new_items:L, p_reason:b.querySelector('#vcr').value, p_message:b.querySelector('#vcm').value, p_stay_in:(o.stay && st.din && st.dout) ? st.din : null, p_stay_out:(o.stay && st.din && st.dout) ? st.dout : null}).then(function(r){
        if(r.error){ btn.disabled = false; btn.textContent = 'Send to customer'; e.textContent = r.error.message; return; }
        var d = r.data;
        shell('<h2>Request sent ✓</h2><p class="m">' + esc(d.customer_name || 'The customer') + ' has been notified on their Velos track page and phone. Their answer appears on your dashboard within seconds, and you will hear an alert. They have ' + esc(d.wait_min || 45) + ' minutes to answer.</p><div class="tot"><span>Customer</span><b>' + esc(d.customer_name || '') + '</b></div><div class="r"><a class="bt p" href="tel:' + esc(d.customer_phone) + '">📞 Call ' + esc(d.customer_phone) + '</a><button class="g" id="vcd">Done</button></div>');
        D.getElementById('vcd').onclick = function(){ D.getElementById('vcw').remove(); if(o.done) o.done(); };
      }); }
    draw(); }

  function history(db){ shell('<h2>Change requests</h2><p class="m">Loading…</p>');
    db.rpc('vendor_changes_mine').then(function(r){ var rows = r.data || [], S = {pending:'Waiting for customer', accepted:'Customer accepted', declined:'Customer cancelled', expired:'No answer: order cancelled'}, C = {pending:'', accepted:'ok', declined:'bad', expired:''};
      var h = '<h2>Change requests</h2><p class="m">Every time you ask a customer to accept a change.</p>' + (r.error ? '<p class="bad">' + esc(/function|schema cache/i.test(r.error.message) ? 'Ask Velos to finish the Order Change update.' : r.error.message) + '</p>' : '')
        + (rows.length ? rows.map(function(c){ return '<div class="ln"><b>#' + esc(c.order_no) + ' · ' + esc(({food:'Food order', partner:'Store order', booking:'Table booking'})[c.kind]) + '</b><div class="' + (C[c.status] || '') + '">' + S[c.status] + '</div><div class="m">' + new Date(c.created_at).toLocaleString('en-GB') + '</div>' + (c.penalty_ugx > 0 ? '<div class="bad">Penalty: ' + ugx(c.penalty_ugx) + ' (' + ({open:'to be deducted', waived:'waived by Velos', settled:'settled'})[c.penalty_status] + ')</div>' : '') + '</div>'; }).join('') : (r.error ? '' : '<p class="m">None yet.</p>'))
        + '<button class="g" id="vcx" style="margin-top:8px">Close</button>';
      var b = shell(h); b.querySelector('#vcx').onclick = function(){ b.remove(); }; }); }
  var seen = null;
  function watch(db){ if(seen) return; seen = {}; function tick(){ db.rpc('vendor_changes_mine').then(function(r){ if(r.error || !r.data) return; var first = !Object.keys(seen).length;
      r.data.forEach(function(c){ var was = seen[c.id]; seen[c.id] = c.status; if(first || was === c.status || c.status === 'pending') return;
        var m = c.status === 'accepted' ? '✅ Customer accepted the change on order #' + c.order_no : c.status === 'declined' ? '❌ Customer cancelled order #' + c.order_no + (c.penalty_ugx > 0 ? ' · penalty ' + ugx(c.penalty_ugx) : '') : 'Change request on #' + c.order_no + ' expired, order cancelled';
        try { if(W.VelosAlerts && W.VelosAlerts.beep) W.VelosAlerts.beep(c.status === 'accepted' ? 'info' : 'warn'); } catch(e){}
        if(W.toast) W.toast(m); else alert(m); }); }); }
    tick(); setInterval(tick, 20000); }
  W.VelosChange = {open:open, history:history, link:link, watch:watch};
})(window, document);
