/* Velos home page: live search across food, products, stores and services + the running service tiles. */
(function(){
  if(window.__vh) return; window.__vh = 1;
  function $(i){ return document.getElementById(i); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function ugx(n){ return 'UGX ' + Math.round(n || 0).toLocaleString('en-US'); }

  /* every service on the site: label, one-word line, link, keywords for search */
  var TILES = [
    ['🍽️','Foods','Restaurants','foods.html','food restaurant meal dish eat lunch dinner pizza chicken'],
    ['🛍️','Velos Shop','Electronics','shop.html','shop phone laptop tv electronics appliance'],
    ['👗','Fashion','Style & beauty','fashion.html','fashion dress suit wig perfume bag beauty shoes clothes'],
    ['🏪','Stores','Local vendors','marketplace.html','store vendor marketplace shop partner'],
    ['🛒','Retail','Single items','marketplace.html#/m/retail','retail single item'],
    ['📦','Wholesale','Bulk buying','marketplace.html#/m/wholesale','wholesale bulk carton sack'],
    ['🏨','Hotels','Rooms','marketplace.html#/c/hotels','hotel room accommodation stay book'],
    ['🏛️','Venues','Events','marketplace.html#/c/venues','venue hall event wedding conference'],
    ['🛠️','Services','Verified pros','services.html','service electrician plumber technician repair solar security cctv'],
    ['🎁','Gifts','Sourced for you','gifts.html','gift flowers present birthday'],
    ['🎨','Designs','Brand & web','designs.html','design logo branding website graphic'],
    ['🔎','Sourcing','Find anything','sourcing-request.html','source import find request abroad'],
    ['📍','Track','My orders','account.html','track order status account']
  ];
  var CSS = '#hm{--g:#e8c766;--n:#080d1f}'
  +'.hm-hero{padding:46px 16px 18px;text-align:center;background:radial-gradient(circle at 50% 0,#1a2d73 0,#0b1334 55%,#080d1f 100%)}'
  +'.hm-hero h1{font:600 clamp(32px,7vw,64px)/1.05 "Cormorant Garamond","Fraunces",Georgia,serif;color:#f4f1ea;margin:0 0 8px}'
  +'.hm-hero h1 em{color:#e8c766;font-style:normal}.hm-hero p{color:#b7c1e3;margin:0 0 20px;font-size:clamp(15px,2.4vw,19px)}'
  +'.hm-sw{position:relative;max-width:680px;margin:0 auto}.hm-sb{display:flex;background:#fff;border-radius:99px;padding:6px 6px 6px 18px;box-shadow:0 10px 30px rgba(0,0,0,.35);align-items:center;gap:8px}'
  +'.hm-sb input{flex:1;border:0;outline:0;font:500 16px system-ui;padding:12px 0;color:#14192b;background:transparent;min-width:0}.hm-sb button{border:0;background:#e8c766;color:#080d1f;font:700 15px system-ui;border-radius:99px;padding:12px 22px;cursor:pointer}'
  +'.hm-res{position:absolute;left:0;right:0;top:calc(100% + 8px);background:#0f1730;border:1px solid #2a3560;border-radius:18px;text-align:left;max-height:62vh;overflow:auto;z-index:50;box-shadow:0 18px 40px rgba(0,0,0,.5);display:none}'
  +'.hm-res.on{display:block}.hm-res h4{margin:0;padding:10px 16px 4px;font:700 11px system-ui;letter-spacing:.12em;color:#e8c766;text-transform:uppercase}'
  +'.hm-r{display:flex;gap:12px;align-items:center;padding:9px 16px;color:#f4f1ea;text-decoration:none;border-top:1px solid #1b2548}.hm-r:hover{background:#17224a}.hm-r i{font-style:normal;font-size:22px;width:34px;text-align:center}'
  +'.hm-r img{width:38px;height:38px;object-fit:cover;border-radius:8px;background:#fff}.hm-r b{display:block;font:600 14.5px system-ui}.hm-r small{color:#9fb0e0;font:13px system-ui}.hm-r em{margin-left:auto;font:700 12px system-ui;color:#e8c766;font-style:normal;white-space:nowrap}'
  +'.hm-none{padding:16px;color:#9fb0e0;font:14px system-ui}'
  +'.hm-chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:16px auto 0;max-width:720px}.hm-chips a{color:#dfe5f7;text-decoration:none;border:1px solid #33406f;background:rgba(255,255,255,.04);padding:8px 14px;border-radius:99px;font:600 13.5px system-ui}.hm-chips a:hover{border-color:#e8c766;color:#e8c766}'
  +'.hm-run{overflow:hidden;padding:18px 0 6px;background:#080d1f;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}'
  +'.hm-tr{display:flex;gap:14px;width:max-content;animation:hmrun 60s linear infinite}.hm-run:hover .hm-tr{animation-play-state:paused}@keyframes hmrun{to{transform:translateX(-50%)}}'
  +'.hm-t{flex:0 0 148px;height:164px;border-radius:22px;text-decoration:none;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:14px;position:relative;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.35);transition:transform .2s}.hm-t:hover{transform:translateY(-4px)}'
  +'.hm-t i{font-style:normal;font-size:58px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}.hm-t b{font:700 18px/1.1 system-ui}.hm-t small{display:block;font:500 12.5px system-ui;opacity:.85;margin-top:2px}'
  +'.hm-t:nth-child(6n+1){background:linear-gradient(145deg,#b3392f,#6e1c26)}.hm-t:nth-child(6n+2){background:linear-gradient(145deg,#2a47b8,#14216b)}.hm-t:nth-child(6n+3){background:linear-gradient(145deg,#a23a8a,#4b1a5c)}'
  +'.hm-t:nth-child(6n+4){background:linear-gradient(145deg,#1f8a6a,#0d4a42)}.hm-t:nth-child(6n+5){background:linear-gradient(145deg,#c2761c,#6d3a0e)}.hm-t:nth-child(6n+6){background:linear-gradient(145deg,#4a5a7a,#1d2640)}'
  +'.hm-w{max-width:1180px;margin:0 auto;padding:6px 16px}'
  +'.hm-sell{margin:26px auto 6px;max-width:1148px;border-radius:26px;padding:30px 24px;background:linear-gradient(120deg,#1b2f7a,#0f1a47 60%,#2a2260);display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:1px solid #2a3560}'
  +'.hm-sell b{display:block;font:600 clamp(24px,4vw,36px)/1.1 "Cormorant Garamond","Fraunces",Georgia,serif;color:#f4f1ea}.hm-sell span{color:#b7c1e3;font-size:15px}.hm-sell a{background:#e8c766;color:#080d1f;font:700 15px system-ui;padding:14px 26px;border-radius:99px;text-decoration:none;white-space:nowrap}'
  +'.hm-tr3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px auto 30px;max-width:1148px;padding:0 16px}.hm-tr3 div{text-align:center;padding:16px 8px;border:1px solid #2a3560;border-radius:18px;background:#0f1730;color:#f4f1ea}.hm-tr3 i{font-style:normal;font-size:30px;display:block;margin-bottom:6px}.hm-tr3 b{font:600 14px system-ui}'
  +'@media(prefers-reduced-motion:reduce){.hm-tr{animation:none}.hm-run{overflow-x:auto}}';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function tilesHtml(){ var h = TILES.map(function(t){ return '<a class="hm-t" href="' + t[3] + '"><i>' + t[0] + '</i><div><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></div></a>'; }).join(''); return h + h; }
  var tr = $('hm-tr'); if(tr) tr.innerHTML = tilesHtml();

  /* ---------- search ---------- */
  var box = $('hmq'), res = $('hmr'), timer = 0, seq = 0;
  function S(){ return window.VELOS_SUPABASE; }
  function rpc(name, body){ var c = S(); if(!c) return Promise.resolve(null); return fetch(c.url + '/rest/v1/rpc/' + name, {method:'POST', headers:{apikey:c.key, 'Content-Type':'application/json'}, body:JSON.stringify(body || {})}).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }); }
  function row(ic, t, sub, href, tag, img){ return '<a class="hm-r" href="' + href + '">' + (img ? '<img src="' + esc(img) + '" alt="" loading="lazy">' : '<i>' + ic + '</i>') + '<div><b>' + esc(t) + '</b><small>' + esc(sub) + '</small></div>' + (tag ? '<em>' + esc(tag) + '</em>' : '') + '</a>'; }
  function has(s, q){ return String(s || '').toLowerCase().indexOf(q) > -1; }
  async function run(q){
    var my = ++seq; q = q.trim().toLowerCase();
    if(q.length < 2){ res.className = 'hm-res'; return; }
    var out = '', n = 0;
    /* services and pages */
    var sv = TILES.filter(function(t){ return has(t[1], q) || has(t[4], q); }).slice(0, 4);
    if(sv.length){ out += '<h4>Go to</h4>' + sv.map(function(t){ n++; return row(t[0], t[1], t[2], t[3], 'Open'); }).join(''); }
    /* restaurants and dishes: the customer picks where to order */
    var food = window.__vlFood, dish = [], rest = [];
    if(food && food.vendors){ food.vendors.forEach(function(v){
      if(has(v.name, q)) rest.push(v);
      (v.categories || []).forEach(function(c){ (c.items || []).forEach(function(i){ if(i.available !== false && i.price && (has(i.name, q) || has(c.name, q) && q.length > 3)) dish.push({v:v, i:i}); }); }); }); }
    if(rest.length){ out += '<h4>Restaurants</h4>' + rest.slice(0, 4).map(function(v){ n++; return row('🍽️', v.name, v.address || 'Velos Foods', 'foods.html?v=' + encodeURIComponent(v.slug), 'Menu', v.logo_url); }).join(''); }
    if(dish.length){ dish.sort(function(a, b){ return a.i.price - b.i.price; }); out += '<h4>Dishes: choose where to order</h4>' + dish.slice(0, 8).map(function(x){ n++; return row('🍲', x.i.name, 'Order from ' + x.v.name, 'foods.html?v=' + encodeURIComponent(x.v.slug) + '&q=' + encodeURIComponent(x.i.name), ugx(x.i.price), x.i.image && x.i.image.indexOf('ph-') < 0 ? x.i.image : null); }).join(''); }
    /* shop and fashion products */
    try{ var P = (typeof PRODUCTS !== 'undefined' && PRODUCTS) || window.PRODUCTS || [], hit = P.filter(function(p){ return p.name && has(p.name, q) && p.inStock !== false; }).slice(0, 5);
      if(hit.length) out += '<h4>Velos Shop and Fashion</h4>' + hit.map(function(p){ n++; var f = /fashion|beauty|grooming/.test(p.cat || ''); return row('🛍️', p.name, f ? 'Velos Fashion' : 'Velos Shop', (f ? 'fashion' : 'shop') + '.html?p=' + encodeURIComponent(p.id), p.price ? ugx(p.price) : 'Quote', p.img && !/^data:/.test(p.img) ? p.img : null); }).join(''); }catch(e){}
    /* partner stores and their products (live) */
    var live = await Promise.all([rpc('public_partners', {p_q:q}), rpc('public_product_search', {p_q:q})]);
    if(my !== seq) return;
    var st = live[0] || [], pr = live[1] || [];
    if(st.length) out += '<h4>Stores</h4>' + st.slice(0, 4).map(function(p){ n++; return row('🏪', p.business_name, (p.city || '') + (p.country ? ', ' + p.country : ''), 'marketplace.html#/s/' + p.id, 'Visit', p.logo_url); }).join('');
    if(pr.length) out += '<h4>From our vendors</h4>' + pr.slice(0, 6).map(function(x){ n++; return row('🛒', x.name, 'Sold by ' + x.partner, 'marketplace.html#/s/' + x.partner_id, ugx(x.price_ugx), x.image_url); }).join('');
    if(!n) out = '<div class="hm-none">Nothing found for “' + esc(q) + '”. <a href="sourcing-request.html" style="color:#e8c766">Ask us to source it</a></div>';
    res.innerHTML = out; res.className = 'hm-res on';
  }
  window.hmGo = function(){ if(!box) return; var q = box.value.trim(); if(q.length >= 2) run(q); };
  if(box){
    box.addEventListener('input', function(){ clearTimeout(timer); timer = setTimeout(function(){ run(box.value); }, 220); });
    box.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); clearTimeout(timer); window.hmGo(); } });
    document.addEventListener('click', function(e){ if(!e.target.closest('.hm-sw')) res.className = 'hm-res'; });
  }
})();
