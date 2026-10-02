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
#vx button,#vx a.vb{display:block;text-align:center;box-sizing:border-box;padding:13px;border:0;border-radius:8px;font-weight:700;width:100%;margin-top:8px;cursor:pointer;font-size:15px;text-decoration:none}
#vx .go{background:#e8c766;color:#080d1f}#vx .cx{background:none;border:1px solid #2a3560;color:#f4f1ea}
#vt{position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1f7a3f;color:#fff;padding:10px 16px;border-radius:99px;z-index:99999;font:600 14px system-ui;max-width:90%;text-align:center}`;
  document.head.appendChild(s);
}
function modal(title, html, buttons){
  css();
  var d = document.createElement('div'); d.id = 'vx';
  d.innerHTML = '<div class="bx"><h3>' + title + '</h3>' + html + (buttons || '') + '<button class="cx" id="vx_c">Close</button></div>';
  document.body.appendChild(d);
  document.getElementById('vx_c').onclick = function(){ d.remove(); };
  return d;
}
function waLink(text){ return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text); }
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
  var c = {}; try { c = JSON.parse(localStorage.getItem('velosContact') || '{}'); } catch(e){}
  var t = lineText(items), dep = t.total > 1000000 ? Math.round(t.total * 0.3) : 0;
  var d = modal('Complete your order',
    '<div class="sum">' + t.lines.map(esc).join('<br>') + '<br><b>Estimated total: ' + formatUGX(t.total) + '</b>'
    + (dep ? '<br><b style="color:#e8c766">30% deposit to confirm: ' + formatUGX(dep) + ' · Balance on delivery: ' + formatUGX(t.total - dep) + '</b>' : '') + '</div>'
    + '<input id="vx_n" placeholder="Full name *" value="' + esc(c.n) + '"><input id="vx_p" type="tel" placeholder="WhatsApp / phone number *" value="' + esc(c.p) + '">'
    + '<input id="vx_e" type="email" placeholder="Email (optional)" value="' + esc(c.e) + '"><input id="vx_a" placeholder="Delivery location / address *" value="' + esc(c.a) + '">'
    + '<div class="sum">Payment method</div>'
    + ['Cash on delivery', 'MTN Mobile Money', 'Airtel Money', 'Bank transfer'].map(function(m, i){ return '<label class="pm"><input type="radio" name="vxpm" value="' + m + '"' + (i === 0 ? ' checked' : '') + '> ' + m + '</label>'; }).join('')
    + '<div class="sum">Our team confirms payment details with you after you order. Online card payment is coming soon.</div>'
    + '<textarea id="vx_o" rows="2" placeholder="Notes (optional)"></textarea>',
    '<button class="go" id="vx_go">Place order</button>');
  document.getElementById('vx_go').onclick = function(){
    var g = function(i){ return document.getElementById(i).value.trim(); };
    var n = g('vx_n'), p = g('vx_p'), e = g('vx_e'), a = g('vx_a'), o = g('vx_o');
    var pm = document.querySelector('input[name=vxpm]:checked').value;
    if(n.length < 2 || p.length < 7 || a.length < 3){ alert('Please enter your name, phone number and delivery location.'); return; }
    try { localStorage.setItem('velosContact', JSON.stringify({n:n, p:p, e:e, a:a})); } catch(x){}
    this.disabled = true; this.textContent = 'Placing order…';
    api('rpc/place_order_v2', {method:'POST', body:{p_name:n, p_phone:p, p_email:e || null, p_address:a, p_payment:pm, p_notes:o, p_items:items}})
      .then(function(no){
        d.remove();
        var msg = 'Hello Velos Global Shop, I placed Order #' + no + ' on the website.\n\n' + t.lines.join('\n') + '\n\nEstimated Total: ' + formatUGX(t.total)
          + (dep ? '\n30% deposit: ' + formatUGX(dep) : '') + '\nName: ' + n + '\nPhone: ' + p + '\nDelivery: ' + a + '\nPayment: ' + pm;
        modal('Order #' + no + ' received ✓',
          '<div class="sum" style="font-size:15px;color:#f4f1ea">Thank you, ' + esc(n) + '. Your order is in and our team will contact you on ' + esc(p) + ' to confirm.'
          + (dep ? '<br><br><b style="color:#e8c766">Deposit to confirm: ' + formatUGX(dep) + '</b> (30%). The balance of ' + formatUGX(t.total - dep) + ' is paid on delivery.' : '')
          + '<br><br>Keep your order number <b>#' + no + '</b> to track progress.</div>',
          '<a class="vb go" href="track.html?o=' + no + '">Track my order</a><a class="vb cx" target="_blank" rel="noopener" href="' + waLink(msg) + '">Also message us on WhatsApp (optional)</a>');
        try { localStorage.setItem('velosLast', 'O' + no); } catch(x){}
        onDone && onDone();
      })
      .catch(function(err){
        d.remove(); console.warn(err);
        var msg = 'Hello Velos Global Shop, I would like to order:\n\n' + t.lines.join('\n') + '\n\nEstimated Total: ' + formatUGX(t.total) + '\nName: ' + n + '\nPhone: ' + p + '\nDelivery: ' + a + '\nPayment: ' + pm;
        modal('We could not save your order online',
          '<div class="sum" style="font-size:15px;color:#f4f1ea">Please send it to us on WhatsApp instead so nothing is lost.<br><span style="font-size:12px;color:#8a93ab">' + esc(String(err.message).slice(0, 140)) + '</span></div>',
          '<a class="vb go" target="_blank" rel="noopener" href="' + waLink(msg) + '">Send order on WhatsApp</a>');
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

/* ---------- 3. FORMS: saved first, confirmation on screen, WhatsApp optional ---------- */
function val(i){ var e = document.getElementById(i); return e ? e.value.trim() : ''; }
function chk(i){ var e = document.getElementById(i); return !!(e && e.checked); }
function failModal(err, wa){
  modal('We could not send that online',
    '<div class="sum" style="font-size:15px;color:#f4f1ea">Please use WhatsApp so nothing is lost.<br><span style="font-size:12px;color:#8a93ab">' + esc(String(err.message).slice(0, 140)) + '</span></div>',
    '<a class="vb go" target="_blank" rel="noopener" href="' + waLink(wa) + '">Send on WhatsApp</a>');
}
window.v_sendInquiry = window.sendInquiry = function(){
  var n = val('inqName'), ph = val('inqPhone'), dv = val('inqDivision'), m = val('inqMsg');
  if(!n || !m){ alert('Please enter your name and a short message.'); return; }
  var wa = 'Hello Velos Group Dispatch Desk,\n\nName: ' + n + '\nPhone: ' + ph + '\nDivision: ' + dv + '\n\nMessage: ' + m;
  api('rpc/submit_inquiry', {method:'POST', body:{p_name:n, p_phone:ph, p_division:dv, p_message:m}}).then(function(){
    modal('Message received ✓', '<div class="sum" style="font-size:15px;color:#f4f1ea">Thank you, ' + esc(n) + '. Our dispatch desk will reply shortly.</div>',
      '<a class="vb cx" target="_blank" rel="noopener" href="' + waLink(wa) + '">Also message us on WhatsApp (optional)</a>');
    var f = document.getElementById('inqMsg'); if(f) f.value = '';
  }).catch(function(e){ failModal(e, wa); });
};
window.v_sendTechRegistration = window.sendTechRegistration = function(){
  var r = {name:val('techName'), phone:val('techPhone'), nin:val('techNIN'), country:val('techCountry'), city:val('techCity'), email:val('techEmail'), trade:val('techTrade'),
           exp:val('techExp'), loc:val('techLoc'), rn:val('techRefName'), rp:val('techRefPhone'), notes:val('techNotes')};
  if(!r.name || !r.phone || !r.nin || !r.country || !r.city || !r.trade || !r.exp || !r.loc || !r.rn || !r.rp){ alert('Please complete every required field before submitting.'); return; }
  if(!(chk('std1') && chk('std2') && chk('std3') && chk('std4'))){ alert('You must agree to all points of the Velos Standard, including the UGX 50,000 verification & ID processing fee, to submit your application.'); return; }
  var wa = 'Hello Velos Global Services, I have submitted my Technician Application online.\n\nName: ' + r.name + '\nWhatsApp: ' + r.phone + '\nTrade: ' + r.trade + '\nCity: ' + r.city + '\nArea: ' + r.loc
         + '\n\nI will upload my ID, certifications and passport photo to the shared Drive folder.';
  api('rpc/submit_technician', {method:'POST', body:{p_full_name:r.name, p_phone:r.phone, p_email:r.email, p_national_id:r.nin, p_country:r.country, p_city:r.city, p_area:r.loc,
      p_trade:r.trade, p_experience:r.exp, p_ref_name:r.rn, p_ref_phone:r.rp, p_notes:r.notes}}).then(function(){
    modal('Application received ✓', '<div class="sum" style="font-size:15px;color:#f4f1ea">Thank you, ' + esc(r.name) + '. Our team will review your application and contact you on ' + esc(r.phone) + '.</div>',
      '<a class="vb cx" target="_blank" rel="noopener" href="' + waLink(wa) + '">Also message us on WhatsApp (optional)</a>');
  }).catch(function(e){ failModal(e, wa); });
};
/* ---------- 4. PAGE TWEAKS ---------- */
function dom(){
  [['sendInquiry','Send inquiry'],['sendTechRegistration','Submit application']].forEach(function(p){
    document.querySelectorAll('[onclick*="' + p[0] + '("]').forEach(function(e){
      e.setAttribute('onclick', e.getAttribute('onclick').replace(p[0] + '(', 'v_' + p[0] + '(')); e.textContent = p[1];
    });
  });
  document.querySelectorAll('[onclick*="sendCartOrder("]').forEach(function(e){ e.textContent = 'Place order'; });
  if(document.body.getAttribute('data-page') === 'services'){
    document.querySelectorAll('.service-card').forEach(function(c){
      var n = (c.querySelector('.svc-num') || {}).textContent || '', m = n.match(/\d+/), a = c.querySelector('a.svc-link');
      if(a && m){ a.href = 'book-service.html?s=' + parseInt(m[0], 10); a.removeAttribute('target'); var sp = a.querySelector('span'); if(sp) sp.textContent = 'Book this service'; var ic = a.querySelector('svg'); if(ic) ic.remove(); }
    });
    var b = document.querySelector('.dispatch-banner a.btn-primary');
    if(b){ b.href = 'book-service.html?s=3&u=emergency'; b.removeAttribute('target'); }
  }
  var last = null; try { last = localStorage.getItem('velosLast'); } catch(x){}
  if(last && !/track\.html|book-service/.test(location.pathname)){
    var a = document.createElement('a'); a.href = 'track.html?o=' + last; a.textContent = 'Track ' + (last[0] === 'S' ? 'request ' : 'order #') + last.slice(1) + ' →';
    a.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;background:#0f1730;color:#e8c766;border:1px solid #2a3560;border-radius:99px;padding:9px 14px;font:600 13px system-ui;text-decoration:none';
    document.body.appendChild(a);
  }
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dom); else dom();
})();
