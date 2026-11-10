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
    ['🧸','Velos Little Stars','Kids, toys & baby','kids.html','kids children baby toys toy school clothes shoes diapers nappy'],
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
  +'.hm-hero{position:relative;z-index:40;padding:46px 16px 18px;text-align:center;background:radial-gradient(circle at 50% 0,#1a2d73 0,#0b1334 55%,#080d1f 100%)}'
  +'.hm-hero h1{font:600 clamp(32px,7vw,64px)/1.05 "Cormorant Garamond","Fraunces",Georgia,serif;color:#f4f1ea;margin:0 0 8px}'
  +'.hm-hero h1 em{color:#e8c766;font-style:normal}.hm-hero p{color:#b7c1e3;margin:0 0 20px;font-size:clamp(15px,2.4vw,19px)}'
  +'.hm-sw{position:relative;max-width:680px;margin:0 auto}.hm-sb{display:flex;background:#fff;border-radius:99px;padding:6px 6px 6px 18px;box-shadow:0 10px 30px rgba(0,0,0,.35);align-items:center;gap:8px}'
  +'.hm-sb input{flex:1;border:0;outline:0;font:500 16px system-ui;padding:12px 0;color:#14192b;background:transparent;min-width:0}.hm-sb button{border:0;background:#e8c766;color:#080d1f;font:700 15px system-ui;border-radius:99px;padding:12px 22px;cursor:pointer}'
  +'.hm-res{position:absolute;left:0;right:0;top:calc(100% + 8px);background:#0f1730;border:1px solid #2a3560;border-radius:18px;text-align:left;max-height:62vh;overflow:auto;z-index:60;box-shadow:0 18px 40px rgba(0,0,0,.5);display:none}'
  +'.hm-res.on{display:block}.hm-res h4{margin:0;padding:10px 16px 4px;font:700 11px system-ui;letter-spacing:.12em;color:#e8c766;text-transform:uppercase}'
  +'.hm-r{display:flex;gap:12px;align-items:center;padding:9px 16px;color:#f4f1ea;text-decoration:none;border-top:1px solid #1b2548}.hm-r:hover{background:#17224a}.hm-r i{font-style:normal;font-size:22px;width:34px;text-align:center}'
  +'.hm-r img{width:38px;height:38px;object-fit:cover;border-radius:8px;background:#fff}.hm-r b{display:block;font:600 14.5px system-ui}.hm-r small{color:#9fb0e0;font:13px system-ui}.hm-r em{margin-left:auto;font:700 12px system-ui;color:#e8c766;font-style:normal;white-space:nowrap}'
  +'.hm-none{padding:16px;color:#9fb0e0;font:14px system-ui}'
  +'.hm-chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:16px auto 0;max-width:720px}.hm-chips a{color:#dfe5f7;text-decoration:none;border:1px solid #33406f;background:rgba(255,255,255,.04);padding:8px 14px;border-radius:99px;font:600 13.5px system-ui}.hm-chips a:hover{border-color:#e8c766;color:#e8c766}'
  +'.hm-run{position:relative;z-index:1;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;cursor:grab;padding:18px 0 6px;background:#080d1f;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}'
  +'.hm-run::-webkit-scrollbar{display:none}.hm-run.drag{cursor:grabbing}.hm-run.drag a{pointer-events:none}.hm-tr{display:flex;gap:14px;width:max-content}'
  +'.hm-t{flex:0 0 148px;height:164px;border-radius:22px;text-decoration:none;color:#fff;display:flex;flex-direction:column;justify-content:space-between;padding:14px;position:relative;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.35);transition:transform .2s}.hm-t:hover{transform:translateY(-4px)}'
  +'.hm-t i{font-style:normal;font-size:58px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}.hm-t b{font:700 18px/1.1 system-ui}.hm-t small{display:block;font:500 12.5px system-ui;opacity:.85;margin-top:2px}'
  +'.hm-t:nth-child(6n+1){background:linear-gradient(145deg,#b3392f,#6e1c26)}.hm-t:nth-child(6n+2){background:linear-gradient(145deg,#2a47b8,#14216b)}.hm-t:nth-child(6n+3){background:linear-gradient(145deg,#a23a8a,#4b1a5c)}'
  +'.hm-t:nth-child(6n+4){background:linear-gradient(145deg,#1f8a6a,#0d4a42)}.hm-t:nth-child(6n+5){background:linear-gradient(145deg,#c2761c,#6d3a0e)}.hm-t:nth-child(6n+6){background:linear-gradient(145deg,#4a5a7a,#1d2640)}'
  +'.hm-t.ph{background-size:cover!important;background-position:center!important}.hm-t.ph i{display:none}.hm-t.ph>div{text-shadow:0 2px 8px rgba(0,0,0,.7)}'
  +'.hm-t.ph:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,13,31,.05) 30%,rgba(8,13,31,.82))}.hm-t.ph>*{position:relative}'
  +'.hm-w{max-width:1180px;margin:0 auto;padding:6px 16px}'
  +'.hm-sell{margin:26px auto 6px;max-width:1148px;border-radius:26px;padding:30px 24px;background:linear-gradient(120deg,#1b2f7a,#0f1a47 60%,#2a2260);display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap;border:1px solid #2a3560}'
  +'.hm-sell b{display:block;font:600 clamp(24px,4vw,36px)/1.1 "Cormorant Garamond","Fraunces",Georgia,serif;color:#f4f1ea}.hm-sell span{color:#b7c1e3;font-size:15px}.hm-sell a{background:#e8c766;color:#080d1f;font:700 15px system-ui;padding:14px 26px;border-radius:99px;text-decoration:none;white-space:nowrap}'
  +'.hm-jh{background:#080d1f;margin:34px 0 0;padding:34px max(16px,calc((100% - 1148px)/2)) 0}.hm-jh h2{margin:0;font:600 clamp(26px,4.4vw,40px)/1.1 "Cormorant Garamond","Fraunces",Georgia,serif;color:#f4f1ea}.hm-jh p{margin:4px 0 0;color:#b7c1e3;font-size:15px}.hm-jh .k{font:700 11px system-ui;letter-spacing:.14em;color:#e8c766;text-transform:uppercase}'
  +'.hm-j{flex:0 0 268px;min-height:168px;border-radius:24px;text-decoration:none;color:#fff;display:flex;flex-direction:column;justify-content:space-between;gap:10px;padding:18px;border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 26px rgba(0,0,0,.3)}'
  +'.hm-j i{font-style:normal;font-size:44px;line-height:1}.hm-j b{display:block;font:700 19px/1.15 system-ui}.hm-j small{display:block;font:500 13px/1.35 system-ui;opacity:.88;margin-top:4px}.hm-j u{text-decoration:none;font:700 13px system-ui;background:rgba(255,255,255,.18);border-radius:99px;padding:8px 14px;align-self:flex-start}'
  +'.hm-jc1{background:linear-gradient(145deg,#1b2f7a,#0f1a47)}.hm-jc2{background:linear-gradient(145deg,#1f8a6a,#0d4a42)}.hm-jc3{background:linear-gradient(145deg,#c2761c,#6d3a0e)}.hm-jc4{background:linear-gradient(145deg,#8a2a6a,#451a4a)}.hm-jc5{background:linear-gradient(145deg,#b3392f,#6e1c26)}'
  +'.hm-jtr{display:flex;gap:16px;width:max-content}'
    +'.hm-tr3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px auto 30px;max-width:1148px;padding:0 16px}.hm-tr3 div{text-align:center;padding:16px 8px;border:1px solid #2a3560;border-radius:18px;background:#0f1730;color:#f4f1ea}.hm-tr3 i{font-style:normal;font-size:30px;display:block;margin-bottom:6px}.hm-tr3 b{font:600 14px system-ui}'
  +'';
  var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

  function tilesHtml(){ var h = TILES.map(function(t){ return '<a class="hm-t" data-k="' + esc(t[1]) + '" href="' + t[3] + '"><i>' + t[0] + '</i><div><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></div></a>'; }).join(''); return h + h + h + h; }
  var tr = $('hm-tr'); if(tr) tr.innerHTML = tilesHtml();
  var JOIN = [['🏪','Become a Velos Partner','Open your own store and sell to all of East Africa','vendor.html','Open my store','hm-jc1'],['🛵','Become a Rider','Earn on every delivery you complete','rider.html','Start riding','hm-jc2'],['🛠️','Become a Technician','Get verified jobs from customers near you','technicians.html','Join the network','hm-jc3'],['🍽️','List your restaurant','Reach more hungry customers with Velos Foods','restaurant.html','Add my restaurant','hm-jc4']];
  var CAREERS = [['📣','Sales Agent, Uganda','Represent Velos and earn commission on every sale','careers.html#agents','See requirements','hm-jc5'],['🇰🇪','Sales Executive, Kenya','We are appointing a sales executive to represent Velos in Kenya','careers.html#agents','Apply for Kenya','hm-jc1'],['🛠️','Technician','Skilled trades wanted across Kampala','technicians.html','Apply now','hm-jc3'],['💼','More careers','Operations, support and technology roles','careers.html#openings','View open roles','hm-jc2']];
  function joinHtml(L){ var h = L.map(function(t){ return '<a class="hm-j ' + t[5] + '" href="' + t[3] + '"><i>' + t[0] + '</i><div><b>' + esc(t[1]) + '</b><small>' + esc(t[2]) + '</small></div><u>' + esc(t[4]) + ' →</u></a>'; }).join(''); return h + h + h + h; }
  var jn = $('hm-join'); if(jn) jn.innerHTML = joinHtml(JOIN);
  var cr = $('hm-careers'); if(cr) cr.innerHTML = joinHtml(CAREERS);


  /* ---------- running cards: they drift by themselves, but you can always swipe, drag or scroll them ---------- */
  function runner(box, speed, dir){ if(!box) return; var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pos = 0, last = 0, hold = 0, hover = false, down = false, moved = 0, sx = 0, sl = 0, unit = 0;
    function measure(){ var tk = box.firstElementChild; unit = tk ? tk.scrollWidth / 4 : 0; if(unit && (box.scrollLeft < unit || box.scrollLeft >= unit * 2)) box.scrollLeft = unit + (box.scrollLeft % unit); pos = box.scrollLeft; }
    function user(ms){ hold = Date.now() + (ms || 2600); }
    function wrap(){ if(!unit) return; if(box.scrollLeft >= unit * 2) box.scrollLeft -= unit; else if(box.scrollLeft < unit) box.scrollLeft += unit; }
    function tick(t){ var dt = Math.min(60, t - last) || 16; last = t;
      if(!reduce && unit && !down && !hover && Date.now() > hold && !document.hidden){ if(Math.abs(box.scrollLeft - pos) > 2) pos = box.scrollLeft; pos += dir * speed * dt / 1000; box.scrollLeft = pos; wrap(); pos = box.scrollLeft; }
      requestAnimationFrame(tick); }
    box.addEventListener('scroll', function(){ if(Date.now() > hold && Math.abs(box.scrollLeft - pos) > 3) user(); wrap(); }, {passive:true});
    ['touchstart','touchmove','wheel'].forEach(function(e){ box.addEventListener(e, function(){ user(3200); }, {passive:true}); });
    box.addEventListener('touchend', function(){ user(3200); }, {passive:true});
    box.addEventListener('mouseenter', function(){ hover = true; }); box.addEventListener('mouseleave', function(){ hover = false; });
    box.addEventListener('pointerdown', function(e){ if(e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = 0; sx = e.clientX; sl = box.scrollLeft; });
    window.addEventListener('pointermove', function(e){ if(!down) return; var d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); if(moved > 6) box.classList.add('drag'); box.scrollLeft = sl - d; });
    window.addEventListener('pointerup', function(){ if(!down) return; down = false; user(3200); setTimeout(function(){ box.classList.remove('drag'); }, 0); });
    box.addEventListener('click', function(e){ if(moved > 6){ e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    window.addEventListener('resize', measure); window.addEventListener('load', measure); setTimeout(measure, 300); setTimeout(measure, 1500); measure(); requestAnimationFrame(tick); }
  document.querySelectorAll('.hm-run').forEach(function(box){ var k = box.firstElementChild; if(!k) return; runner(box, k.id === 'hm-tr' ? 38 : 34, k.classList.contains('slow') ? -1 : 1); });

  /* ---------- real pictures on the running cards ---------- */
  function setPhoto(label, url){ if(!url) return; var im = new Image(); im.onload = function(){ document.querySelectorAll('.hm-t[data-k="' + label + '"]').forEach(function(a){ a.classList.add('ph'); a.style.backgroundImage = 'url("' + String(url).replace(/"/g, '%22') + '")'; }); }; im.src = url; }
  function realImg(u){ u = String(u || ''); return u && !/^data:/.test(u) && u.indexOf('ph-') < 0 && !/(^|\/)(logo|icon|favicon)[^\/]*\.(png|svg)/i.test(u); }
  function photos(){
    /* 1. a file you upload yourself wins: tile-foods.jpg, tile-services.jpg ... (name = card title, lowercase, no spaces) */
    TILES.forEach(function(t){ setPhoto(t[1], 'tile-' + t[1].toLowerCase().replace(/[^a-z]/g, '') + '.jpg'); });
    var c = S(); if(!c) return;
    function get(path){ return fetch(c.url + '/rest/v1/' + path, {headers:{apikey:c.key}}).then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }); }
    var FASH = /^(women-fashion|women-beauty|men-fashion|men-grooming)/;
    Promise.all([get('products?select=category_key,image_url&in_stock=eq.true&image_url=not.is.null&limit=300'), rpc('food_menu_v2', {}), rpc('public_partners', {p_q:''})]).then(function(a){
      var P = (a[0] || []).filter(function(p){ return realImg(p.image_url); }), shop = P.filter(function(p){ return !FASH.test(p.category_key); }), fash = P.filter(function(p){ return FASH.test(p.category_key); });
      var food = [], m = a[1]; if(m && m.vendors) m.vendors.forEach(function(v){ if(realImg(v.cover_url)) food.push(v.cover_url); (v.categories || []).forEach(function(k){ (k.items || []).forEach(function(i){ if(realImg(i.image) && food.length < 30) food.push(i.image); }); }); });
      var st = (a[2] || []).filter(function(p){ return realImg(p.cover_url) || realImg(p.logo_url); });
      function any(L, n){ return L.length ? L[n % L.length] : null; }
      if(food.length) setPhoto('Foods', any(food, 0));
      if(shop.length) setPhoto('Velos Shop', any(shop, 0).image_url);
      if(fash.length) setPhoto('Fashion', any(fash, 0).image_url);
      var cv = function(p){ return realImg(p.cover_url) ? p.cover_url : p.logo_url; };
      if(st.length){ setPhoto('Stores', cv(any(st, 0))); setPhoto('Retail', cv(any(st, 1))); setPhoto('Wholesale', cv(any(st, 2)));
        var h = st.filter(function(p){ return /hotel/i.test(p.category || ''); }), v = st.filter(function(p){ return /venue/i.test(p.category || ''); }); if(h.length) setPhoto('Hotels', cv(h[0])); if(v.length) setPhoto('Venues', cv(v[0])); }
    });
  }
  if(S()) photos(); else addEventListener('load', photos);

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
