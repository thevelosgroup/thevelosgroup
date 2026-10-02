/* Velos API layer. Loads after app-core.js.
   - Live catalog from Supabase (falls back to the built-in list if offline)
   - Proper checkout form (name, phone, email, delivery, payment method)
   - Orders, technician applications and inquiries saved to the database, WhatsApp opens as before */
(function(){
var SB = window.VELOS_SUPABASE;
function api(path, opt){
  opt = opt || {};
  return fetch(SB.url + '/rest/v1/' + path, {
    method: opt.method || 'GET',
    headers: Object.assign({apikey: SB.key, 'Content-Type': 'application/json'}, opt.headers || {}),
    body: opt.body ? JSON.stringify(opt.body) : undefined
  }).then(function(r){
    if(!r.ok) return r.text().then(function(t){ throw new Error(t); });
    return (r.status === 201 || r.status === 204) ? null : r.json();
  });
}
function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function toast(m, bad){
  var t = document.createElement('div'); t.id = 'vt'; t.textContent = m; if(bad) t.style.background = '#b3261e';
  document.body.appendChild(t); setTimeout(function(){ t.remove(); }, bad ? 6000 : 2800);
}

/* ---------- 1. LIVE CATALOG ---------- */
Promise.all([api('categories?select=*&order=sort_order'), api('products?select=*')]).then(function(res){
  var cs = res[0], ps = res[1];
  if(!cs || !cs.length || !ps || !ps.length) return;
  var order = {}; cs.forEach(function(c, i){ order[c.key] = i; });
  ps.sort(function(a, b){ return (order[a.category_key] - order[b.category_key]) || a.id.localeCompare(b.id, undefined, {numeric:true}); });
  CATEGORIES.length = 0;
  Object.keys(CATEGORY_NOTES).forEach(function(k){ delete CATEGORY_NOTES[k]; });
  cs.forEach(function(c){ CATEGORIES.push({key:c.key, label:c.label, thumb:c.thumb_url}); if(c.note) CATEGORY_NOTES[c.key] = c.note; });
  PRODUCTS.length = 0;
  ps.forEach(function(p){ PRODUCTS.push({id:p.id, cat:p.category_key, sub:p.subcategory || undefined, name:p.name, price:p.price_ugx, img:p.image_url, real:p.verified_photo, 'new':p.is_new}); });
  ['renderTabs', 'renderProducts', 'updateCartUI'].forEach(function(f){ try { if(window[f]) window[f](); } catch(e){} });
}).catch(function(e){ console.warn('Velos: using built-in catalog', e); });

/* ---------- 2. CHECKOUT ---------- */
function css(){
  if(document.getElementById('vx-css')) return;
  var s = document.createElement('style'); s.id = 'vx-css';
  s.textContent = `#vx{position:fixed;inset:0;background:rgba(4,8,20,.82);z-index:99999;display:flex;align-items:flex-end;justify-content:center}
#vx .bx{background:#0f1730;color:#f4f1ea;width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:20px;font:15px/1.45 Inter,system-ui,sans-serif}
#vx h3{margin:0 0 6px;color:#e8c766;font-family:Georgia,serif;font-size:22px}
#vx input,#vx textarea{width:100%;padding:12px;margin:5px 0;background:#080d1f;color:#f4f1ea;border:1px solid #2a3560;border-radius:8px;font:inherit;box-sizing:border-box}
#vx label.pm{display:flex;gap:10px;align-items:center;padding:10px;border:1px solid #2a3560;border-radius:8px;margin:5px 0}
#vx label.pm input{width:auto;margin:0}#vx .sum{color:#a9b1c9;font-size:13px;margin:8px 0}
#vx button{padding:13px;border:0;border-radius:8px;font-weight:700;width:100%;margin-top:8px;cursor:pointer;font-size:15px}
#vx .go{background:#e8c766;color:#080d1f}#vx .cx{background:none;border:1px solid #2a3560;color:#f4f1ea}
#vt{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1f7a3f;color:#fff;padding:10px 16px;border-radius:99px;z-index:99999;font:600 14px system-ui;max-width:90%;text-align:center}`;
  document.head.appendChild(s);
}
function lineText(items){
  var lines = [], total = 0;
  items.forEach(function(it){
    var p = PRODUCTS.find(function(x){ return x.id === it.product_id; }); if(!p) return;
    lines.push('• ' + p.name + ' (x' + it.qty + ') — ' + (p.price ? formatUGX(p.price * it.qty) : 'Quote requested'));
    if(p.price) total += p.price * it.qty;
  });
  return {lines: lines, total: total};
}
function checkout(items, onDone){
  css();
  var c = {}; try { c = JSON.parse(localStorage.getItem('velosContact') || '{}'); } catch(e){}
  var t = lineText(items);
  var d = document.createElement('div'); d.id = 'vx';
  d.innerHTML = '<div class="bx"><h3>Complete your order</h3><div class="sum">' + t.lines.map(esc).join('<br>') + '<br><b>Estimated total: ' + formatUGX(t.total) + '</b></div>'
    + '<input id="vx_n" placeholder="Full name *" value="' + esc(c.n) + '"><input id="vx_p" type="tel" placeholder="WhatsApp / phone number *" value="' + esc(c.p) + '">'
    + '<input id="vx_e" type="email" placeholder="Email (optional)" value="' + esc(c.e) + '"><input id="vx_a" placeholder="Delivery location / address *" value="' + esc(c.a) + '">'
    + '<div class="sum">Payment method</div>'
    + ['Cash on delivery', 'MTN Mobile Money', 'Airtel Money', 'Bank transfer'].map(function(m, i){ return '<label class="pm"><input type="radio" name="vxpm" value="' + m + '"' + (i === 0 ? ' checked' : '') + '> ' + m + '</label>'; }).join('')
    + '<div class="sum">Our team confirms payment details with you on WhatsApp. Online card payment is coming soon.</div>'
    + '<textarea id="vx_o" rows="2" placeholder="Notes (optional)"></textarea><button class="go" id="vx_go">Place order</button><button class="cx" id="vx_x">Cancel</button></div>';
  document.body.appendChild(d);
  document.getElementById('vx_x').onclick = function(){ d.remove(); };
  document.getElementById('vx_go').onclick = function(){
    var g = function(i){ return document.getElementById(i).value.trim(); };
    var n = g('vx_n'), p = g('vx_p'), e = g('vx_e'), a = g('vx_a'), o = g('vx_o');
    var pm = document.querySelector('input[name=vxpm]:checked').value;
    if(n.length < 2 || p.length < 7 || a.length < 3){ alert('Please enter your name, phone number and delivery location.'); return; }
    try { localStorage.setItem('velosContact', JSON.stringify({n:n, p:p, e:e, a:a})); } catch(x){}
    this.disabled = true; this.textContent = 'Placing order…';
    var win = window.open('', '_blank');
    var body = {p_name:n, p_phone:p, p_email:e || null, p_address:a, p_payment:pm, p_notes:o, p_items:items};
    api('rpc/place_order_v2', {method:'POST', body:body})
      .catch(function(){ return api('rpc/place_order', {method:'POST', body:{p_name:n, p_phone:p, p_notes:'Address: ' + a + ' | Payment: ' + pm + ' | Email: ' + e + ' | ' + o, p_items:items}}); })
      .catch(function(err){ console.warn('Order not saved', err); toast('Order could not be saved online — sending via WhatsApp', true); return null; })
      .then(function(no){
        var msg = 'Hello Velos Global Shop, I would like to order' + (no ? ' (Order #' + no + ')' : '') + ':\n\n' + t.lines.join('\n')
          + '\n\nEstimated Total: ' + formatUGX(t.total) + '\n\nName: ' + n + '\nPhone: ' + p + '\nDelivery: ' + a + '\nPayment: ' + pm + (o ? '\nNotes: ' + o : '') + '\n\nPlease confirm availability and delivery.';
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
        if(win) win.location = url; else window.location.href = url;
        d.remove();
        if(no){ toast('Order #' + no + ' received ✓'); onDone && onDone(); }
      });
  };
}

window.sendCartOrder = function(){
  var ids = Object.keys(cart);
  if(!ids.length){ alert('Your cart is empty.'); return; }
  checkout(ids.map(function(id){ return {product_id:id, qty:cart[id]}; }), function(){
    Object.keys(cart).forEach(function(k){ delete cart[k]; }); saveCart(); updateCartUI(); toggleCart(false);
  });
};
window.orderNow = function(id){ checkout([{product_id:id, qty:1}]); };

/* ---------- 3. FORMS (saved in the background; WhatsApp still opens instantly) ---------- */
function val(i){ var e = document.getElementById(i); return e ? e.value.trim() : ''; }
function chk(i){ var e = document.getElementById(i); return !!(e && e.checked); }
function save(table, row, label){
  api(table, {method:'POST', headers:{Prefer:'return=minimal'}, body:row})
    .then(function(){ toast(label + ' saved ✓'); })
    .catch(function(e){ console.warn('Not saved: ' + table, e); toast(label + ' not saved: ' + String(e.message).slice(0, 120), true); });
}
var origTech = window.sendTechRegistration;
if(origTech) window.sendTechRegistration = function(){
  var r = {full_name:val('techName'), phone:val('techPhone'), email:val('techEmail') || null, national_id:val('techNIN'), country:val('techCountry'),
           city:val('techCity'), area:val('techLoc'), trade:val('techTrade'), experience:val('techExp'), ref_name:val('techRefName'),
           ref_phone:val('techRefPhone'), notes:val('techNotes') || null, agreed_standard:true};
  var ok = ['full_name','phone','national_id','country','city','area','trade','experience','ref_name','ref_phone'].every(function(k){ return r[k]; })
           && chk('std1') && chk('std2') && chk('std3') && chk('std4');
  if(ok) save('technician_applications', r, 'Application');
  return origTech();
};
var origInq = window.sendInquiry;
if(origInq) window.sendInquiry = function(){
  var n = val('inqName'), m = val('inqMsg');
  if(n && m) save('inquiries', {name:n, phone:val('inqPhone') || null, division:val('inqDivision') || null, message:m}, 'Inquiry');
  return origInq();
};
})();
