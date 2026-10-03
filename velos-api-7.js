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
var catP = Promise.all([api('categories?select=*&order=sort_order'), api('products?select=*')]);
catP.then(function(res){
  var cs = res[0], ps = res[1];
  if(!cs || !cs.length || !ps || !ps.length) return;
  var order = {}; cs.forEach(function(c, i){ order[c.key] = i; });
  ps.sort(function(a, b){ return (order[a.category_key] - order[b.category_key]) || a.id.localeCompare(b.id, undefined, {numeric:true}); });
  CATEGORIES.length = 0;
  Object.keys(CATEGORY_NOTES).forEach(function(k){ delete CATEGORY_NOTES[k]; });
  cs.forEach(function(c){ CATEGORIES.push({key:c.key, label:c.label, thumb:c.thumb_url}); if(c.note) CATEGORY_NOTES[c.key] = c.note; });
  PRODUCTS.length = 0;
  ps.forEach(function(p){ PRODUCTS.push({id:p.id, cat:p.category_key, sub:p.subcategory || undefined, name:p.name, price:p.price_ugx, img:p.image_url, real:p.verified_photo, 'new':p.is_new, inStock:p.in_stock !== false}); });
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
    lines.push('• ' + p.name + ' (x' + it.qty + ') — ' + (effPrice(p) ? formatUGX(effPrice(p) * it.qty) : 'Quote requested'));
    if(effPrice(p)) total += effPrice(p) * it.qty;
  });
  return {lines: lines, total: total};
}
function checkout(items, onDone){
  var oos = items.filter(function(it){ var p = PRODUCTS.find(function(x){ return x.id === it.product_id; }); return p && p.inStock === false; });
  if(oos.length){ alert('Sorry, an item in your order is currently out of stock. Please remove it or contact us.'); return; }
  var c = {}; try { c = JSON.parse(localStorage.getItem('velosContact') || '{}'); } catch(e){}
  var t = lineText(items), dep = t.total > 1000000 ? Math.round(t.total * 0.3) : 0;
  var d = modal('Complete your order',
    '<div class="sum">' + t.lines.map(esc).join('<br>') + '<br><b>Estimated total: ' + formatUGX(t.total) + '</b>'
    + (dep ? '<br><b style="color:#e8c766">30% deposit to confirm: ' + formatUGX(dep) + ' · Balance on delivery: ' + formatUGX(t.total - dep) + '</b>' : '') + '</div>'
    + '<input id="vx_n" placeholder="Full name *" value="' + esc(c.n) + '"><input id="vx_p" type="tel" placeholder="WhatsApp / phone number *" value="' + esc(c.p) + '">'
    + '<input id="vx_e" type="email" placeholder="Email (optional)" value="' + esc(c.e) + '"><input id="vx_a" placeholder="Delivery location / address *" value="' + esc(c.a) + '">'
    + '<div class="sum">Payment method</div>'
    + ['Cash on delivery', 'MTN Mobile Money', 'Airtel Money', 'Bank transfer'].map(function(m, i){ return '<label class="pm"><input type="radio" name="vxpm" value="' + m + '"' + (i === 0 ? ' checked' : '') + '> ' + m + '</label>'; }).join('')
    + '<div class="sum">Our team confirms payment details with you after you order. Online card payment is coming soon.<br>By ordering you agree to our <a href="terms.html" target="_blank" style="color:#e8c766">Terms</a> and <a href="privacy.html" target="_blank" style="color:#e8c766">Privacy Policy</a>.</div>'
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
        d.remove(); try { window.velosAttachRef('order', no); } catch(x){}
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
function loadSB(cb){
  if(window.supabase) return cb();
  var e = document.createElement('script'); e.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  e.onload = function(){ cb(); }; e.onerror = function(){ cb(new Error('Upload library failed to load')); }; document.head.appendChild(e);
}
function docFiles(){
  return [['fdIdF','id-front'],['fdIdB','id-back'],['fdPhoto','photo'],['fdCert','certificate']].map(function(x){
    var e = document.getElementById(x[0]); return e && e.files && e.files[0] ? {f:e.files[0], k:x[1]} : null; }).filter(Boolean);
}
window.v_sendTechRegistration = window.sendTechRegistration = function(){
  var r = {name:val('techName'), phone:val('techPhone'), nin:val('techNIN'), country:val('techCountry'), city:val('techCity'), email:val('techEmail'), trade:val('techTrade'),
           exp:val('techExp'), loc:val('techLoc'), rn:val('techRefName'), rp:val('techRefPhone'), notes:val('techNotes')};
  if(!r.name || !r.phone || !r.nin || !r.country || !r.city || !r.trade || !r.exp || !r.loc || !r.rn || !r.rp){ alert('Please complete every required field before submitting.'); return; }
  if(!(chk('std1') && chk('std2') && chk('std3') && chk('std4'))){ alert('You must agree to all points of the Velos Standard, including the UGX 50,000 verification & ID processing fee, to submit your application.'); return; }
  var fl = docFiles();
  if(!fl.some(function(x){ return x.k === 'id-front'; }) || !fl.some(function(x){ return x.k === 'photo'; })){ alert('Please upload your National ID (front) and a passport photo.'); return; }
  if(fl.some(function(x){ return x.f.size > 5 * 1024 * 1024; })){ alert('Each document must be under 5 MB.'); return; }
  var btn = document.querySelector('[onclick*="v_sendTechRegistration("]'); if(btn){ btn.disabled = true; btn.textContent = 'Submitting…'; }
  var wa = 'Hello Velos Global Services, I submitted my Technician Application online.\n\nName: ' + r.name + '\nWhatsApp: ' + r.phone + '\nTrade: ' + r.trade + '\nCity: ' + r.city;
  api('rpc/submit_technician', {method:'POST', body:{p_full_name:r.name, p_phone:r.phone, p_email:r.email, p_national_id:r.nin, p_country:r.country, p_city:r.city, p_area:r.loc,
      p_trade:r.trade, p_experience:r.exp, p_ref_name:r.rn, p_ref_phone:r.rp, p_notes:r.notes}})
  .then(function(res){ return new Promise(function(ok){
    loadSB(function(err){
      if(err || !window.supabase) return ok(false);
      var cl = window.supabase.createClient(SB.url, SB.key);
      Promise.all(fl.map(function(x, i){
        var ext = (x.f.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, ''), p = res.id + '/' + x.k + '-' + Date.now() + '-' + i + '.' + ext;
        return cl.storage.from('technician-docs').upload(p, x.f, {contentType:x.f.type}).then(function(u){ if(u.error) throw u.error; return p; });
      })).then(function(paths){ return api('rpc/attach_technician_docs', {method:'POST', body:{p_id:res.id, p_token:res.token, p_paths:paths}}); })
        .then(function(){ ok(true); }).catch(function(e){ console.warn(e); ok(false); });
    });
  }); })
  .then(function(up){
    modal('Application received ✓', '<div class="sum" style="font-size:15px;color:#f4f1ea">Thank you, ' + esc(r.name) + '. Our team will review your application and contact you on ' + esc(r.phone) + '.'
      + (up ? '<br><br>Your documents were uploaded securely.' : '<br><br><b style="color:#e8c766">Some documents did not upload.</b> Please send them to us on WhatsApp so we can complete your file.') + '</div>',
      '<a class="vb cx" target="_blank" rel="noopener" href="' + waLink(wa) + '">Message us on WhatsApp (optional)</a>');
    if(btn){ btn.disabled = false; btn.textContent = 'Submit application'; }
  })
  .catch(function(e){ if(btn){ btn.disabled = false; btn.textContent = 'Submit application'; } failModal(e, wa); });
};

/* ---------- 5. STOREFRONT UPGRADE ---------- */
var PROMO = {}, PINFO = {};
function effPrice(p){ var d = PROMO[p.id]; return (p.price && d) ? Math.round(p.price * (100 - d) / 100) : p.price; }
var promoP = api('promotions?select=product_id,discount_percent,starts_at,ends_at&is_active=eq.true');
promoP.then(function(rows){
  var n = Date.now();
  (rows || []).forEach(function(r){ if(new Date(r.starts_at).getTime() <= n && new Date(r.ends_at).getTime() >= n){ PROMO[r.product_id] = Math.max(PROMO[r.product_id] || 0, r.discount_percent); PINFO[r.product_id] = {end:new Date(r.ends_at).getTime()}; } });
  try { renderProducts(); updateCartUI(); } catch(e){}
}).catch(function(){});

window.productCard = function(p){
  var disc = PROMO[p.id], eff = effPrice(p), oos = p.inStock === false, b = [];
  b.push(oos ? '<span class="product-badge" style="background:#b3261e;color:#fff">Out of stock</span>' : '<span class="product-badge verified">In stock</span>');
  if(disc) b.push('<span class="product-badge" style="background:#e6493f;color:#fff">-' + disc + '% OFF</span>');
  if(p.real) b.push('<span class="product-badge verified">Verified Photo</span>');
  if(CATEGORY_NOTES[p.cat]) b.push('<span class="product-badge wholesale">Wholesale Available</span>');
  var cat = CATEGORIES.find(function(c){ return c.key === p.cat; });
  var price = disc ? '<span class="price">' + formatUGX(eff) + ' <s style="opacity:.55;font-size:.78em">' + formatUGX(p.price) + '</s></span>' : '<span class="price">' + formatUGX(p.price) + '</span>';
  return '<div class="product-card"' + (oos ? ' style="opacity:.8"' : '') + '><div class="img-wrap' + (p.real ? ' real-tile' : '') + '">' + (p['new'] ? '<span class="new-ribbon">New</span>' : '')
    + '<button class="card-share-btn" onclick="shareProduct(\'' + p.id + '\')" aria-label="Share ' + esc(p.name) + '">' + SHARE_ICON + '</button>'
    + '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.closest(\'.img-wrap\').classList.add(\'img-fallback\');this.outerHTML=\'<div class=img-fallback-inner><span>Photo coming soon</span></div>\'"></div>'
    + '<div class="product-info"><div class="badge-row">' + b.join('') + '</div><span class="cat-tag">' + esc(p.sub || (cat ? cat.label : '')) + '</span><h4>' + esc(p.name) + '</h4>' + price
    + '<div class="product-actions">' + (oos ? '<button class="btn-mini order" disabled style="opacity:.55;cursor:not-allowed">Out of stock</button>'
      : '<button class="btn-mini add" onclick="addToCart(\'' + p.id + '\', this)">+ Cart</button><button class="btn-mini order" onclick="orderNow(\'' + p.id + '\')">Order Now</button>') + '</div></div></div>';
};

/* Sharing: the link opens the product so the customer can order and track it, exactly like on the website */
window.buildPromoImage = async function(o){
  var photo; try { photo = await loadImage(o.imgSrc); } catch(e){ return null; }
  var W = 1080, H = 1080, PH = 300, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d'), ph = H - PH;
  x.fillStyle = '#fff'; x.fillRect(0, 0, W, ph);
  var sc = Math.min((W - 80) / photo.width, (ph - 80) / photo.height); x.drawImage(photo, (W - photo.width * sc) / 2, (ph - photo.height * sc) / 2, photo.width * sc, photo.height * sc);
  if(o.badgeText){ x.font = '700 28px Arial'; var tw = x.measureText(o.badgeText).width; x.fillStyle = '#e6493f'; roundRect(x, 28, 28, tw + 44, 56, 28); x.fill(); x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.fillText(o.badgeText, 50, 57); }
  var g = x.createLinearGradient(0, ph, 0, H); g.addColorStop(0, '#0c1226'); g.addColorStop(1, '#080d1a'); x.fillStyle = g; x.fillRect(0, ph, W, PH);
  x.textBaseline = 'alphabetic'; x.font = '700 28px Georgia, serif'; x.fillStyle = '#e8c766'; x.textAlign = 'right'; x.fillText('THE VELOS GROUP', W - 32, ph + 44); x.textAlign = 'left';
  x.font = '600 42px Georgia, serif'; x.fillStyle = '#f4f1ea'; var ls = wrapText(x, o.title, W - 64, 2); ls.forEach(function(l, i){ x.fillText(l, 32, ph + 100 + i * 50); });
  var py = ph + 100 + ls.length * 50 + 26; x.font = '700 46px Arial'; x.fillStyle = '#7fd99a'; x.fillText(o.priceText, 32, py);
  if(o.oldPriceText){ var pw = x.measureText(o.priceText).width; x.font = '400 28px Arial'; x.fillStyle = '#8a93ab'; x.fillText(o.oldPriceText, 52 + pw, py); var ow = x.measureText(o.oldPriceText).width; x.strokeStyle = '#8a93ab'; x.lineWidth = 2; x.beginPath(); x.moveTo(52 + pw, py - 10); x.lineTo(52 + pw + ow, py - 10); x.stroke(); }
  x.font = 'italic 600 26px Arial'; x.fillStyle = '#e8c766'; x.fillText('Tap the link below to order and track it online', 32, H - 32);
  return new Promise(function(r){ c.toBlob(r, 'image/jpeg', 0.9); });
};
window.shareContent = async function(title, bodyText, waLink, pageLink, imgSrc, imgName, promoOpts){
  var text = bodyText + (pageLink ? '\n\nOrder online and track your order: ' + pageLink : '');
  if(navigator.share){
    var file = null;
    if(promoOpts){ var bl = await window.buildPromoImage(promoOpts); if(bl){ file = new File([bl], imgName || 'velos-deal.jpg', {type:'image/jpeg'}); if(navigator.canShare && !navigator.canShare({files:[file]})) file = null; } }
    try { await navigator.share(file ? {title:title, text:text, files:[file]} : {title:title, text:text}); return; } catch(e){}
  }
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
};
window.shareProduct = function(id){
  var p = PRODUCTS.find(function(x){ return x.id === id; }); if(!p) return;
  var eff = effPrice(p), d = PROMO[id];
  window.shareContent(p.name, p.name + '\n' + (eff ? formatUGX(eff) : 'Request a quote') + (d ? '  (-' + d + '% offer)' : ''), '', siteUrl('shop.html') + '?p=' + encodeURIComponent(id), p.img, 'velos-product.jpg',
    {imgSrc:p.img, title:p.name, priceText:eff ? formatUGX(eff) : 'Request a quote', oldPriceText:d ? formatUGX(p.price) : null, badgeText:d ? '-' + d + '% OFF' : null});
};

/* Open a shared product link (?p=ID) with real ordering */
window.openProductSheet = function(id){
  var p = PRODUCTS.find(function(x){ return x.id === id; }); if(!p) return;
  var eff = effPrice(p), d = PROMO[id], oos = p.inStock === false, close = "document.getElementById('vx').remove();";
  modal(esc(p.name),
    '<img src="' + esc(p.img) + '" alt="" style="width:100%;max-height:260px;object-fit:contain;background:#fff;border-radius:10px;margin:6px 0" onerror="this.style.display=\'none\'">'
    + '<div style="font-size:22px;font-weight:700;color:#7fd99a">' + (eff ? formatUGX(eff) : 'Request a quote') + (d ? ' <s style="font-size:14px;color:#8a93ab">' + formatUGX(p.price) + '</s> <span style="color:#e6493f;font-size:14px">-' + d + '%</span>' : '') + '</div>'
    + '<div class="sum">' + (oos ? '<b style="color:#ff8a80">Currently out of stock</b>' : '<b style="color:#7fd99a">In stock</b> · Order online, pay as agreed, track every step.') + '</div>',
    (oos ? '' : '<button class="go" onclick="' + close + 'orderNow(\'' + id + '\')">Order now</button><button class="cx" onclick="' + close + 'addToCart(\'' + id + '\')">Add to cart</button>')
    + '<a class="vb cx" href="shop.html">Browse the shop</a>');
};
window.vProd = function(id){ openProductSheet(id); return false; };
function openFromUrl(){ var id = new URLSearchParams(location.search).get('p'); if(id) openProductSheet(id); }
catP.catch(function(){}).then(function(){ setTimeout(openFromUrl, 400); });


/* Home page: real flash deal and a rotating, varied carousel built from the live catalog */
function pad2(n){ return (n < 10 ? '0' : '') + n; }
function vFlash(f, d){
  try { clearInterval(flashCountdownTimer); } catch(e){}
  window.renderFlashDeal = function(){};
  if(!d){ f.style.display = 'none'; return; }
  f.style.display = '';
  var p = d.p;
  f.innerHTML = '<div class="fd-media"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '"></div><div class="fd-text"><span class="fd-badge">⚡ FLASH DEAL · -' + d.d + '%</span><h3>' + esc(p.name) + '</h3>'
    + '<div class="spotlight-price"><span class="was">' + formatUGX(p.price) + '</span><span class="now">' + formatUGX(effPrice(p)) + '</span></div><div class="spotlight-countdown" id="vCd"></div>'
    + '<a class="btn-primary" href="shop.html?p=' + p.id + '" onclick="return vProd(\'' + p.id + '\')">Order now</a></div>';
  function tick(){
    var s = Math.max(0, Math.floor((d.end - Date.now()) / 1000)), el = document.getElementById('vCd'); if(!el) return;
    el.textContent = s <= 0 ? 'Offer ended' : 'Ends in ' + (s >= 86400 ? Math.floor(s / 86400) + 'd ' : '') + pad2(Math.floor(s % 86400 / 3600)) + ':' + pad2(Math.floor(s % 3600 / 60)) + ':' + pad2(s % 60);
  }
  tick(); setInterval(tick, 1000);
}
function vCarousel(sp, promos){
  try { clearInterval(spotlightTimer); } catch(e){}
  var seed = Math.floor(Date.now() / 3600000), rnd = function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  var pool = PRODUCTS.filter(function(p){ return p.inStock !== false && p.price && p.img; }), byCat = {}, used = {}, picks = [];
  pool.forEach(function(p){ (byCat[p.cat] = byCat[p.cat] || []).push(p); });
  var cats = Object.keys(byCat).sort(function(){ return rnd() - 0.5; });
  promos.slice(0, 3).forEach(function(d){ picks.push({p:d.p, d:d.d}); used[d.p.id] = 1; });
  for(var i = 0; picks.length < 9 && i < 80 && cats.length; i++){
    var arr = byCat[cats[i % cats.length]], p = arr[Math.floor(rnd() * arr.length)];
    if(!used[p.id]){ used[p.id] = 1; picks.push({p:p, d:PROMO[p.id] || 0}); }
  }
  function prod(x){
    var p = x.p, cat = CATEGORIES.find(function(c){ return c.key === p.cat; });
    return '<div class="spotlight-slide"><div class="spotlight-media light">' + (x.d ? '<span class="flash-badge">-' + x.d + '%</span>' : '') + '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></div>'
      + '<div class="spotlight-text"><span class="sl-tag">' + (x.d ? 'Limited offer' : 'Featured') + ' · ' + esc(cat ? cat.label : '') + '</span><h3>' + esc(p.name) + '</h3><p>' + (CATEGORY_NOTES[p.cat] ? 'Wholesale pricing available. Order online and track every step.' : 'In stock. Order online and track every step.') + '</p>'
      + '<div class="spotlight-price">' + (x.d ? '<span class="was">' + formatUGX(p.price) + '</span>' : '') + '<span class="now">' + formatUGX(effPrice(p)) + '</span></div>'
      + '<a class="btn-primary" href="shop.html?p=' + p.id + '" onclick="return vProd(\'' + p.id + '\')">Order now</a></div></div>';
  }
  function st(img, tag, title, text, href, cta){
    return '<div class="spotlight-slide"><div class="spotlight-media dark"><img src="' + img + '" alt="" loading="lazy"></div><div class="spotlight-text"><span class="sl-tag">' + tag + '</span><h3>' + title + '</h3><p>' + text + '</p><a class="btn-primary" href="' + href + '">' + cta + '</a></div></div>';
  }
  var statics = [
    st('services-hero-drone.jpg', 'Global Services', 'Verified technicians, anywhere in East Africa', 'Describe the problem and we send the nearest ID-verified technician.', 'book-service.html', 'Book a service'),
    st('hero-cargo-ship.jpg', 'Sourcing &amp; shipping', 'Can’t find it? We source it for you', 'Any product, any budget, from Uganda or abroad. Get a clear quote first.', 'sourcing-request.html', 'Request a quote'),
    st('dispatch-van.jpg', '24/7 emergency dispatch', 'Electrical, plumbing or structural emergency?', 'Our dispatch desk assigns a verified technician fast.', 'book-service.html?s=3&u=emergency', 'Request emergency help')
  ];
  var slides = [], k = 0;
  picks.forEach(function(x, n){ slides.push(prod(x)); if((n + 1) % 3 === 0 && k < statics.length) slides.push(statics[k++]); });
  while(k < statics.length) slides.push(statics[k++]);
  slides = slides.slice(0, 11);
  var chev = function(d){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>'; };
  sp.innerHTML = '<div class="spotlight-track">' + slides.join('') + '</div><div class="spotlight-nav"><button class="spotlight-arrow" id="vP" aria-label="Previous">' + chev('M15 18l-6-6 6-6') + '</button><div class="spotlight-dots">'
    + slides.map(function(_, i){ return '<button class="spotlight-dot" data-i="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>'; }).join('') + '</div><button class="spotlight-arrow" id="vN" aria-label="Next">' + chev('M9 18l6-6-6-6') + '</button></div>';
  var sl = sp.querySelectorAll('.spotlight-slide'), dots = sp.querySelectorAll('.spotlight-dot'), cur = 0, t;
  function show(i){ cur = (i + sl.length) % sl.length; sl.forEach(function(s, j){ s.classList.toggle('active', j === cur); }); dots.forEach(function(d, j){ d.classList.toggle('active', j === cur); }); }
  function auto(){ clearInterval(t); t = setInterval(function(){ show(cur + 1); }, 6500); }
  document.getElementById('vP').onclick = function(){ show(cur - 1); auto(); };
  document.getElementById('vN').onclick = function(){ show(cur + 1); auto(); };
  dots.forEach(function(d){ d.onclick = function(){ show(parseInt(d.getAttribute('data-i'), 10)); auto(); }; });
  sp.addEventListener('mouseenter', function(){ clearInterval(t); }); sp.addEventListener('mouseleave', auto);
  show(0); auto();
}
function home(){
  var sp = document.querySelector('.spotlight'), fd = document.querySelector('.flash-deal'); if(!sp && !fd) return;
  var promos = Object.keys(PINFO).map(function(id){ return {p:PRODUCTS.find(function(x){ return x.id === id; }), d:PROMO[id], end:PINFO[id].end}; })
    .filter(function(x){ return x.p && x.p.inStock !== false && x.p.price && x.end > Date.now(); }).sort(function(a, b){ return a.end - b.end; });
  if(fd) vFlash(fd, promos[0]); if(sp) vCarousel(sp, promos);
}
Promise.all([catP.catch(function(){}), promoP.catch(function(){})]).then(function(){ setTimeout(home, 50); });

/* Gift finder: live catalog, any occasion, any budget */
var GIFT_CATS = {birthday:['phones','accessories','audio','cameras'], wedding:['appliances','furniture','audio','tvs'], anniversary:['audio','tvs','phones','cameras','accessories'], surprise:['accessories','audio','cameras','phones'], corporate:['laptops','printers','accessories','audio']};
var GIFT_RANGE = {under50:[0, 50000], low:[50000, 150000], mid:[150000, 500000], high:[500000, 2500000], lux:[2500000, 1e12]};
window.getGiftSuggestion = function(){
  var occ = document.getElementById('giftOccasion').value, bk = document.getElementById('giftBudget').value, r = GIFT_RANGE[bk] || [0, 1e12], cats = GIFT_CATS[occ] || [];
  var pool = PRODUCTS.filter(function(p){ var e = effPrice(p); return e && e >= r[0] && e <= r[1] && p.inStock !== false && cats.indexOf(p.cat) > -1; });
  pool.sort(function(a, b){ return (cats.indexOf(a.cat) - cats.indexOf(b.cat)) || (effPrice(b) - effPrice(a)); });
  var seen = {}, pick = [];
  pool.forEach(function(p){ if(pick.length < 3 && !seen[p.cat]){ seen[p.cat] = 1; pick.push(p); } });
  pool.forEach(function(p){ if(pick.length < 3 && pick.indexOf(p) < 0) pick.push(p); });
  var box = document.getElementById('giftResult'), more = 'gift-request.html?occasion=' + occ + '&bk=' + bk;
  box.innerHTML = '<div style="padding:4px 0"><b style="font-family:Georgia,serif;font-size:19px">' + (pick.length ? 'Our picks for you' : 'Let us find the perfect gift') + '</b>'
    + (pick.length ? pick.map(function(p){ return '<div style="display:flex;gap:12px;align-items:center;margin:12px 0;padding:10px;border:1px solid rgba(232,199,102,.35);border-radius:12px"><img src="' + esc(p.img) + '" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:8px;background:#fff" onerror="this.style.display=\'none\'"><div style="flex:1"><div style="font-weight:600">' + esc(p.name) + '</div><div style="color:#7fd99a">' + formatUGX(effPrice(p)) + '</div></div><button class="btn-mini order" onclick="orderNow(\'' + p.id + '\')">Order</button></div>'; }).join('')
      : '<p style="opacity:.85">Nothing in our shop fits that exact mix, but we can source it for you.</p>')
    + '<a href="' + more + '" style="display:block;text-align:center;margin-top:10px;padding:13px;border-radius:8px;background:#e8c766;color:#080d1f;font-weight:700;text-decoration:none">Not quite right? We\'ll source any gift for you →</a></div>';
  box.classList.add('show');
};
window.getCustomConciergeEstimate = function(){
  var t = document.getElementById('customAsk').value.trim(), b = document.getElementById('customBudget').value.trim();
  if(!t){ alert('Please describe what you are looking for first.'); return; }
  var box = document.getElementById('customResult'), url = 'gift-request.html?idea=' + encodeURIComponent(t) + (b ? '&budget=' + encodeURIComponent(b) : '');
  box.innerHTML = '<div style="padding:4px 0"><b style="font-family:Georgia,serif;font-size:19px">We can source that</b><p style="opacity:.85">"' + esc(t) + '"<br>Send us the details and our concierge will come back with options and a clear quote. You pay nothing until you approve.</p>'
    + '<a href="' + url + '" style="display:block;text-align:center;padding:13px;border-radius:8px;background:#e8c766;color:#080d1f;font-weight:700;text-decoration:none">Send my request →</a></div>';
  box.classList.add('show');
};

/* Assistant: answers from the live catalog and routes to the right flow */
function chatLink(url, label, wa){
  var b = document.getElementById('chatBody'), a = document.createElement('a'); a.href = url; a.className = 'chat-msg bot chat-link'; if(/^http/.test(url)){ a.target = '_blank'; a.rel = 'noopener'; }
  a.textContent = (wa ? '💬 ' : '→ ') + label; b.appendChild(a); b.scrollTop = b.scrollHeight;
}
function parseBudget(t){
  var m = t.match(/(under|below|less than|within|up to|max)\s*(?:ugx\s*)?(\d[\d,\.]*)\s*(m|million|k|thousand)?/); if(!m) return null;
  var n = parseFloat(m[2].replace(/,/g, '')); if(m[3] === 'm' || m[3] === 'million') n *= 1e6; else if(m[3] === 'k' || m[3] === 'thousand') n *= 1e3; return n;
}
function searchCatalog(t){
  var stop = {the:1, and:1, for:1, with:1, any:1, have:1, you:1, are:1, can:1, get:1, want:1, need:1, buy:1, looking:1, find:1, show:1, under:1, below:1, price:1, much:1, how:1, what:1, which:1, best:1, cheap:1, good:1, your:1, ugx:1};
  var toks = t.replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function(w){ return w.length > 2 && !stop[w] && !/^\d/.test(w); }), bud = parseBudget(t);
  if(!toks.length && !bud) return [];
  var syn = {phone:'phones', phones:'phones', smartphone:'phones', iphone:'phones', tv:'tvs', television:'tvs', fridge:'appliances', freezer:'appliances', cooker:'appliances', oven:'appliances', sofa:'furniture', bed:'furniture', couch:'furniture'};
  return PRODUCTS.map(function(p){
    var cat = CATEGORIES.find(function(c){ return c.key === p.cat; }), hay = (p.name + ' ' + (p.sub || '') + ' ' + (cat ? cat.label : '') + ' ' + p.cat).toLowerCase(), s = 0;
    toks.forEach(function(w){ if(hay.indexOf(w) > -1) s += 2; else if(syn[w] && p.cat === syn[w]) s += 1.5; else if(w.length > 4 && hay.indexOf(w.slice(0, -1)) > -1) s += 1; });
    var e = effPrice(p); if(bud && (!e || e > bud)) s = 0;
    return {p:p, s:s};
  }).filter(function(x){ return x.s > 0 && x.p.inStock !== false; }).sort(function(a, b){ return b.s - a.s; }).slice(0, 4).map(function(x){ return x.p; });
}
window.chatRespond = function(text){
  var t = text.toLowerCase();
  if(/track|where is my|order status|my order|progress/.test(t)) return {text:'You can follow any order, service request, gift request or design project with its reference number and your phone number.', links:[['track.html', 'Track my order or request']]};
  if(/pay|deposit|momo|mobile money|airtel|mtn|cash|install/.test(t)) return {text:'Orders above UGX 1,000,000 (including bulk) need a 30% deposit to confirm, with the balance on delivery. Smaller orders can be cash on delivery or mobile money. Our team confirms payment details with you after you order, so never pay a number you did not get from us.', links:[]};
  if(/security|guard|patrol|watchman|bodyguard/.test(t)) return {text:'We provide security cover, casual or on contract. Tell us what you need to safeguard, how many guards and which shifts, and we send a clear proposal after assessing the site.', links:[['book-service.html?s=10', 'Request security services']]};
  if(/agent|commission|earn money|sell for/.test(t)) return {text:'Become a Velos sales agent: refer customers, earn commission on every completed sale, and track your performance on your own dashboard.', links:[['agent.html', 'Agent sign in or apply']]};
  if(/technician|apply|join|register|vacanc/.test(t)) return {text:'You can apply to join our verified technician network online and upload your documents securely.', links:[['technicians.html', 'Apply as a technician']]};
  if(/gift|present|surprise|birthday|wedding|anniversary/.test(t)) return {text:'Tell us the occasion and budget, or the gift you have in mind. We can source almost anything, locally or from abroad.', links:[['gifts.html', 'Open the Gift Concierge'], ['gift-request.html', 'Request a gift']]};
  if(/design|website|logo|brand|packag|footwear|corporate gift/.test(t)) return {text:'Global Designs makes websites, branding, packaging and custom products to order. Send us a short brief and get a quote.', links:[['design-request.html', 'Start a design project']]};
  if(/repair|fix|electric|plumb|solar|generator|install|clean|inspect|security|wifi|wi-fi|emergency|dispatch|technic/.test(t)) return {text:'Book a service in a minute: describe the problem, your location, when you are free and how urgent it is, and we send the nearest verified technician.', links:[['book-service.html', 'Book a service']]};
  if(/deliver|ship|how long/.test(t)) return {text:'We deliver across Uganda and arrange shipping elsewhere in East Africa. Delivery details are confirmed when we contact you about your order.', links:[]};
  if(/return|refund|warrant|guarantee/.test(t)) return {text:'Returns and warranty are agreed in writing at the time of sale, in line with Ugandan consumer law. See our Terms for details.', links:[['terms.html', 'Read the Terms']]};
  if(/contact|whatsapp|phone|call|email|reach|office|location/.test(t)) return {text:'Our dispatch desk is on WhatsApp +256 755 215 751, or email dispatch@thevelosgroup.com (orders) or info@thevelosgroup.com (everything else). We are based in Kampala.', links:[['contact.html', 'Contact page']]};
  var hits = searchCatalog(t);
  if(hits.length) return {text:'Here is what we have in stock:', products:hits};
  return {text:'I could not find that in our catalog, but we can probably source it for you. Tell us what you need and your budget and our concierge will come back with options and a quote.', links:[['sourcing-request.html?idea=' + encodeURIComponent(text), 'Request this item']]};
};
window.sendChat = function(prompt){
  var inp = document.getElementById('chatInput'), text = (typeof prompt === 'string' ? prompt : inp.value).trim(); if(!text) return;
  chatAppend(text, 'user'); inp.value = '';
  setTimeout(function(){
    var r = window.chatRespond(text); chatAppend(r.text, 'bot');
    (r.products || []).forEach(function(p){ var e = effPrice(p); chatLink('shop.html?p=' + p.id, p.name + ' · ' + (e ? formatUGX(e) : 'Quote') + (PROMO[p.id] ? ' (-' + PROMO[p.id] + '%)' : '')); });
    (r.links || []).forEach(function(l){ chatLink(l[0], l[1]); });
    chatLink('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hello Velos, I need help: ' + text), 'Talk to a person on WhatsApp', true);
  }, 350);
};
window.toggleChat = function(open){
  var w = document.getElementById('chatWindow'); w.classList.toggle('open', open);
  if(open && !w.dataset.started){
    w.dataset.started = '1';
    chatAppend('Hello, I am the Velos Assistant. I can find products in our shop, help you book a service, source a gift, start a design project or track your order. What do you need?', 'bot');
    document.getElementById('chatQuick').innerHTML = ['Track my order', 'Find a phone', 'Book a service', 'Gift ideas', 'Payment terms'].map(function(q){ return '<button onclick="sendChat(\'' + q + '\')">' + q + '</button>'; }).join('');
  }
};

/* ---------- 4. PAGE TWEAKS ---------- */
function dom(){
  if(!document.getElementById('vx-desk')){
    var cs = document.createElement('style'); cs.id = 'vx-desk';
    cs.textContent = ':root{--slate:#b9c2da;--slate-dim:#98a3c1}body{-webkit-font-smoothing:antialiased}.brand img,.logo img{filter:drop-shadow(0 0 1px rgba(255,255,255,.75)) drop-shadow(0 0 10px rgba(232,199,102,.55))}'
      + '@media(min-width:1024px){body{font-size:16.5px}.brand img,.logo img{height:48px;width:auto}.wrap,.container{max-width:1280px}.product-grid{grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}}';
    document.head.appendChild(cs);
  }
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
    var gr = document.querySelector('.services-grid');
    if(gr && !document.getElementById('vSec')){
      var sc = document.createElement('div'); sc.className = 'service-card'; sc.id = 'vSec';
      sc.innerHTML = '<span class="svc-num">10</span><h4>Security Services</h4><p>Guards, patrols and event security, casual or on contract. Tell us what to safeguard and we design the right cover.</p><a class="svc-link btn-whatsapp" href="book-service.html?s=10"><span>Book this service</span></a>';
      gr.appendChild(sc);
    }
  }
  document.querySelectorAll('a[href*="drive.google.com"]').forEach(function(a){ a.remove(); });
  var sn = document.querySelector('.shop-note a.btn-secondary'); if(sn){ sn.href = 'sourcing-request.html'; sn.removeAttribute('target'); sn.textContent = 'Request a sourcing quote'; }
  if(document.body.getAttribute('data-page') === 'designs'){
    document.querySelectorAll('.design-card a.btn-whatsapp').forEach(function(a, i){ a.href = 'design-request.html?d=' + i; a.removeAttribute('target'); var v = a.querySelector('svg'); if(v) v.remove(); });
    var db = document.querySelector('.dispatch-banner a.btn-primary'); if(db){ db.href = 'design-request.html?d=6'; db.removeAttribute('target'); }
  }
  setTimeout(function(){
    try { document.querySelectorAll('.spotlight-slide').forEach(function(sl){
      var s = SPOTLIGHT_SLIDES[parseInt(sl.getAttribute('data-i'), 10)]; if(!s || !s.productId) return;
      sl.querySelectorAll('a[href*="shop.html"]').forEach(function(a){ a.href = 'shop.html?p=' + s.productId; a.textContent = 'Order now'; a.removeAttribute('target'); });
    }); } catch(e){}
  }, 900);
  var tb = document.querySelector('[onclick*="sendTechRegistration("]');
  if(tb && document.getElementById('techName') && !document.getElementById('fdIdF')){
    var bx = document.createElement('div'), L = 'display:block;margin:10px 0 2px;font-size:14px', I = 'width:100%;margin-top:4px';
    bx.innerHTML = '<div style="margin:18px 0;padding:14px;border:1px solid rgba(232,199,102,.45);border-radius:12px"><b>Upload your documents</b>'
      + '<div style="font-size:13px;opacity:.8;margin:4px 0 6px">Stored securely and seen only by Velos verification staff. Photo or PDF, max 5 MB each.</div>'
      + '<label style="' + L + '">National ID — front *<input id="fdIdF" type="file" accept="image/*,application/pdf" style="' + I + '"></label>'
      + '<label style="' + L + '">National ID — back<input id="fdIdB" type="file" accept="image/*,application/pdf" style="' + I + '"></label>'
      + '<label style="' + L + '">Passport photo *<input id="fdPhoto" type="file" accept="image/*" style="' + I + '"></label>'
      + '<label style="' + L + '">Certificate / licence (optional)<input id="fdCert" type="file" accept="image/*,application/pdf" style="' + I + '"></label></div>';
    tb.parentNode.insertBefore(bx, tb);
  }
  if(document.body.getAttribute('data-page') === 'gifts'){
    var host = document.querySelector('main') || document.querySelector('.container') || document.body, g = document.createElement('a');
    g.href = 'gift-request.html';
    g.innerHTML = '<b style="font-size:17px;font-family:Georgia,serif">🎁 Any gift, any budget</b><br><span style="font-size:14px">Tell us the occasion and budget, or the gift you have in mind. We source it for you, anywhere. Tap to start →</span>';
    g.style.cssText = 'display:block;margin:16px;padding:16px;border:1px solid #e8c766;border-radius:14px;background:#0f1730;color:#f4f1ea;text-decoration:none';
    host.insertBefore(g, host.firstChild);
  }
  var ft = document.querySelector('footer');
  if(ft){ var lk = document.createElement('div'); lk.style.cssText = 'text-align:center;padding:10px;font-size:13px'; lk.innerHTML = '<a href="terms.html" style="color:#e8c766">Terms &amp; Conditions</a> · <a href="privacy.html" style="color:#e8c766">Privacy Policy</a> · <a href="agent.html" style="color:#e8c766">Sales agents</a>'; ft.appendChild(lk); }
  var last = null; try { last = localStorage.getItem('velosLast'); } catch(x){}
  if(last && !/track\.html|book-service/.test(location.pathname)){
    var a = document.createElement('a'); a.href = 'track.html?o=' + last; a.textContent = 'Track ' + (last[0] === 'S' ? 'request ' : 'order #') + last.slice(1) + ' →';
    a.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:9999;background:#0f1730;color:#e8c766;border:1px solid #2a3560;border-radius:99px;padding:9px 14px;font:600 13px system-ui;text-decoration:none';
    document.body.appendChild(a);
  }
}
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dom); else dom();
})();
