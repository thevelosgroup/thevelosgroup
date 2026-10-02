/* Velos API layer. Loads after app-core.js.
   - Shop reads the live catalog from Supabase (falls back to the built-in list if offline)
   - Orders, technician applications and inquiries are saved to the database,
     then WhatsApp opens exactly as before. If saving fails, WhatsApp still opens. */
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

/* ---------- 2. ORDERS ---------- */
function who(){
  var c = {}; try { c = JSON.parse(localStorage.getItem('velosContact') || '{}'); } catch(e){}
  var n = c.n || prompt('Your name for this order:'); if(!n) return null;
  var p = c.p || prompt('Your phone / WhatsApp number:'); if(!p) return null;
  try { localStorage.setItem('velosContact', JSON.stringify({n:n, p:p})); } catch(e){}
  return {n:n.trim(), p:p.trim()};
}
function saveOrder(items){
  var c = who(); if(!c) return Promise.resolve(null);
  return api('rpc/place_order', {method:'POST', body:{p_name:c.n, p_phone:c.p, p_notes:'', p_items:items}})
    .catch(function(e){ console.warn('Order not saved', e); return null; });
}
function openWA(win, text){
  var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  if(win) win.location = url; else window.location.href = url;
}

window.sendCartOrder = function(){
  var ids = Object.keys(cart);
  if(!ids.length){ alert('Your cart is empty.'); return; }
  var win = window.open('', '_blank');
  saveOrder(ids.map(function(id){ return {product_id:id, qty:cart[id]}; })).then(function(no){
    var lines = ['Hello Velos Global Shop, I would like to order' + (no ? ' (Order #' + no + ')' : '') + ':', ''], total = 0;
    ids.forEach(function(id){
      var p = PRODUCTS.find(function(x){ return x.id === id; }); if(!p) return;
      var q = cart[id];
      lines.push('• ' + p.name + ' (x' + q + ') — ' + (p.price ? formatUGX(p.price * q) : 'Quote requested'));
      if(p.price) total += p.price * q;
    });
    lines.push('', 'Estimated Total: ' + formatUGX(total), '', 'Please confirm availability and delivery.');
    openWA(win, lines.join('\n'));
    if(no){ ids.forEach(function(k){ delete cart[k]; }); saveCart(); updateCartUI(); toggleCart(false); }
  });
};

window.orderNow = function(id){
  var p = PRODUCTS.find(function(x){ return x.id === id; }); if(!p) return;
  var win = window.open('', '_blank');
  saveOrder([{product_id:id, qty:1}]).then(function(no){
    openWA(win, 'Hello Velos Global Shop, I would like to order' + (no ? ' (Order #' + no + ')' : '') + ':\n\n' + p.name + ' — ' + formatUGX(p.price) + '\n\nPlease confirm availability.');
  });
};

/* ---------- 3. FORMS (save in background, WhatsApp opens instantly as before) ---------- */
function val(i){ var e = document.getElementById(i); return e ? e.value.trim() : ''; }
function chk(i){ var e = document.getElementById(i); return !!(e && e.checked); }
function save(table, row){ api(table, {method:'POST', headers:{Prefer:'return=minimal'}, body:row}).catch(function(e){ console.warn('Not saved: ' + table, e); }); }

var origTech = window.sendTechRegistration;
if(origTech) window.sendTechRegistration = function(){
  var r = {full_name:val('techName'), phone:val('techPhone'), email:val('techEmail') || null, national_id:val('techNIN'), country:val('techCountry'),
           city:val('techCity'), area:val('techLoc'), trade:val('techTrade'), experience:val('techExp'), ref_name:val('techRefName'),
           ref_phone:val('techRefPhone'), notes:val('techNotes') || null, agreed_standard:true};
  var ok = ['full_name','phone','national_id','country','city','area','trade','experience','ref_name','ref_phone'].every(function(k){ return r[k]; })
           && chk('std1') && chk('std2') && chk('std3') && chk('std4');
  if(ok) save('technician_applications', r);
  return origTech();
};

var origInq = window.sendInquiry;
if(origInq) window.sendInquiry = function(){
  var n = val('inqName'), m = val('inqMsg');
  if(n && m) save('inquiries', {name:n, phone:val('inqPhone') || null, division:val('inqDivision') || null, message:m});
  return origInq();
};
})();
