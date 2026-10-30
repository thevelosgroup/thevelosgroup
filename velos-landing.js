/* Velos landing page: a banner slider and a "Hot right now" row of running cards, right under the header.
   Cards use live products and live food offers; the division cards show instantly while the live ones load. */
(function(){
  if(window.__vl) return; window.__vl = 1;
  function $(i){ return document.getElementById(i); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var WING = ['women-fashion','women-beauty','men-fashion','men-grooming'];
  var CSS = '#vl{padding:14px 0 6px}#vl .vlw{max-width:1180px;margin:0 auto;padding:0 16px}'
  +'.vl-sl{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;border-radius:22px;scrollbar-width:none}.vl-sl::-webkit-scrollbar{display:none}'
  +'.vl-s{flex:0 0 100%;scroll-snap-align:start;min-height:200px;display:flex;align-items:center;padding:26px 24px;color:#fff;text-decoration:none;position:relative;overflow:hidden}'
  +'.vl-s::after{content:"";position:absolute;right:-50px;top:-50px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,.07)}'
  +'.vl-s div{position:relative;z-index:2;max-width:480px}.vl-s b{display:block;font:600 clamp(24px,4.6vw,42px)/1.08 "Cormorant Garamond","Playfair Display",Georgia,serif;margin-bottom:8px}'
  +'.vl-s span{display:block;color:#dfe5f7;font-size:14.5px;line-height:1.5;margin-bottom:14px}.vl-s i{font-style:normal;display:inline-block;background:#e8c766;color:#080d1f;font-weight:700;border-radius:99px;padding:10px 20px;font-size:14px}'
  +'.vl-s em{position:absolute;right:22px;bottom:8px;font-size:84px;font-style:normal;opacity:.9;z-index:1;filter:drop-shadow(0 6px 12px rgba(0,0,0,.35))}'
  +'.vl-s{transition:background-image .6s}.vl-a{background:linear-gradient(120deg,#1b2f7a,#0f1a47 65%,#2a2260)}.vl-b{background:linear-gradient(120deg,#4a1d5a,#2a1240 65%,#5a1f3a)}.vl-c{background:linear-gradient(120deg,#8a3a14,#4a1c10 65%,#7a1f2a)}.vl-d{background:linear-gradient(120deg,#0e5a4a,#0a2f3a 65%,#123a6a)}'
  +'.vl-dots{display:flex;justify-content:center;gap:6px;margin:10px 0 0}.vl-dots i{width:7px;height:7px;border-radius:99px;background:#33406f;transition:all .25s}.vl-dots i.on{width:20px;background:#e8c766}'
  +'.vl-h{display:flex;justify-content:space-between;align-items:baseline;margin:20px 0 10px}.vl-h h2{margin:0;font:600 clamp(20px,3.4vw,28px) "Cormorant Garamond","Playfair Display",Georgia,serif;color:#f4f1ea}.vl-h h2::before{content:"";display:inline-block;width:5px;height:1em;background:#e8c766;border-radius:3px;margin-right:10px;vertical-align:-2px}.vl-h span{font:12px system-ui;color:#8f9bbb;letter-spacing:.14em;text-transform:uppercase}'
  +'.vl-run{display:flex;gap:12px;overflow-x:auto;scrollbar-width:none;padding:2px 0 8px;-webkit-overflow-scrolling:touch}.vl-run::-webkit-scrollbar{display:none}'
  +'.vl-c1{flex:0 0 156px;background:#0f1730;border:1px solid #2a3560;border-radius:16px;overflow:hidden;text-decoration:none;color:#f4f1ea;display:flex;flex-direction:column;position:relative;transition:border-color .15s}.vl-c1:hover{border-color:#e8c766}'
  +'.vl-c1 .im{height:120px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}.vl-c1 .im img{width:100%;height:100%;object-fit:contain}.vl-c1 .im.dv{background:linear-gradient(135deg,#243a8a,#0f1730);font-size:46px}'
  +'.vl-c1 .tx{padding:9px 11px 11px;display:flex;flex-direction:column;gap:3px}.vl-c1 b{font:600 13.5px/1.3 system-ui;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}.vl-c1 s{text-decoration:none;font:800 14.5px system-ui;color:#e8c766}.vl-c1 small{font:11px system-ui;color:#8f9bbb}'
  +'.vl-c1 .tg{position:absolute;left:8px;top:8px;background:rgba(8,13,31,.85);color:#e8c766;font:700 10.5px system-ui;padding:3px 8px;border-radius:99px;letter-spacing:.04em}.vl-c1 .tg.hot{background:#d7263d;color:#fff}'
  +'.vl-c1.pr{flex-basis:210px;background:linear-gradient(135deg,#7a1f2a,#b3392f);border:0}.vl-c1.pr .tx{padding:14px;justify-content:center;min-height:150px}.vl-c1.pr b{font-size:16px;-webkit-line-clamp:3}.vl-c1.pr small{color:#ffe3df}.vl-c1.pr s{color:#fff}'
  +'@media(max-width:560px){.vl-s em{font-size:54px;opacity:.45;right:14px}}@media(prefers-reduced-motion:reduce){.vl-dots i,.vl-c1{transition:none}}';
  var OV = 'linear-gradient(90deg,rgba(2,8,28,.9) 0,rgba(2,8,28,.55) 55%,rgba(2,8,28,.15) 100%)';
  function slides(){ return [
    {k:'a',t:'Anything. Anywhere. Precisely.',s:'Shop, order food, book a verified technician, source a gift or start a design project, all in one place.',b:'Explore the shop',h:'shop.html',e:'🛍️',img:'shop-hero.jpg'},
    {k:'c',t:'Hungry? Velos Foods delivers',s:'Restaurant meals, fresh groceries, fish and meat to your door with live tracking.',b:'Order food',h:'foods.html',e:'🍽️',food:1},
    {k:'b',t:'Fashion & beauty, curated',s:'Dresses, wigs, perfumes, bags, suits and grooming for ladies and men.',b:'Shop fashion',h:'fashion.html',e:'👗',img:'fashion-hero.jpg'},
    {k:'d',t:'Need something fixed?',s:'Book a verified technician in a minute: electrical, plumbing, solar, security and more.',b:'Book a service',h:'book-service.html',e:'🛠️'}]; }
  function dv(){ return [['🛍️','Velos Global Shop','Phones, laptops, TVs, appliances','shop.html'],['🍽️','Velos Foods','Restaurants and fresh groceries','foods.html'],['👗','Fashion & Beauty','Dresses, wigs, perfumes, suits','fashion.html'],['🛠️','Book a service','Verified technicians','book-service.html'],['🎁','Gift Concierge','We source and deliver gifts','gifts.html'],['🎨','Global Designs','Branding, packaging, websites','designs.html']].map(function(d){
    return '<a class="vl-c1" href="' + d[3] + '"><div class="im dv">' + d[0] + '</div><div class="tx"><b>' + esc(d[1]) + '</b><small>' + esc(d[2]) + '</small></div></a>'; }).join(''); }
  function money(n){ return typeof formatUGX === 'function' ? formatUGX(n) : 'UGX ' + Math.round(n).toLocaleString('en-US'); }
  function prodCards(){ if(typeof PRODUCTS === 'undefined' || typeof CATEGORIES === 'undefined') return ''; var by = {}, out = [];
    CATEGORIES.forEach(function(c){ by[c.key] = PRODUCTS.filter(function(p){ return p.cat === c.key && p.price && p.inStock !== false && p.img && !/^data:/.test(p.img); }); });
    for(var i = 0; i < 3 && out.length < 12; i++) CATEGORIES.forEach(function(c){ var p = by[c.key][i]; if(p && out.length < 12) out.push(p); });
    return out.map(function(p){ var f = WING.indexOf(p.cat) > -1; return '<a class="vl-c1" href="' + (f ? 'fashion' : 'shop') + '.html?p=' + encodeURIComponent(p.id) + '"><span class="tg">' + (f ? 'Fashion' : 'Shop') + '</span><div class="im"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.parentNode.classList.add(\'dv\');this.remove()"></div><div class="tx"><b>' + esc(p.name) + '</b><s>' + money(p.price) + '</s></div></a>'; }).join(''); }
  function foodCards(m){ var h = ''; if(!m || !m.vendors) return h;
    m.vendors.forEach(function(v){ (v.promos || []).forEach(function(p){ h += '<a class="vl-c1 pr" href="foods.html?v=' + encodeURIComponent(v.slug) + '"><div class="tx"><span class="tg hot" style="position:static;align-self:flex-start;margin-bottom:6px">🔥 OFFER</span><b>' + esc(p.title) + (p.discount_pct ? ' · ' + p.discount_pct + '% off' : '') + '</b><small>' + esc(v.name) + '</small></div></a>'; }); });
    var items = []; m.vendors.forEach(function(v){ v.categories.forEach(function(c){ c.items.forEach(function(i){ if(i.available && i.price && i.image && i.image.indexOf('ph-') < 0) items.push({v: v, i: i}); }); }); });
    items.sort(function(a, b){ return (b.i.promo ? 1 : 0) - (a.i.promo ? 1 : 0); });
    items.slice(0, 10).forEach(function(x){ h += '<a class="vl-c1" href="foods.html?v=' + encodeURIComponent(x.v.slug) + '&q=' + encodeURIComponent(x.i.name) + '"><span class="tg' + (x.i.promo ? ' hot' : '') + '">' + (x.i.promo ? '-' + x.i.promo + '%' : 'Food') + '</span><div class="im"><img src="' + esc(x.i.image) + '" alt="' + esc(x.i.name) + '" loading="lazy" onerror="this.parentNode.classList.add(\'dv\');this.remove()"></div><div class="tx"><b>' + esc(x.i.name) + '</b><s>' + money(x.i.price) + '</s><small>' + esc(x.v.name) + '</small></div></a>'; });
    return h; }
  function autoscroll(el){ if(!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return; var hold = 0, last = 0, acc = 0;
    ['pointerdown', 'mouseenter', 'touchstart', 'focusin'].forEach(function(e){ el.addEventListener(e, function(){ hold = 1; }); });
    ['pointerup', 'mouseleave', 'touchend', 'focusout'].forEach(function(e){ el.addEventListener(e, function(){ setTimeout(function(){ hold = 0; }, e === 'mouseleave' ? 200 : 2500); }); });
    var dir = 1; function step(t){ if(!last) last = t; var dt = t - last; last = t; if(!hold && !document.hidden && el.scrollWidth > el.clientWidth){ acc += dt * 0.03 * dir; if(Math.abs(acc) >= 1){ var d = Math.trunc(acc); el.scrollLeft += d; acc -= d; if(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) dir = -1; else if(el.scrollLeft <= 0) dir = 1; } } requestAnimationFrame(step); } requestAnimationFrame(step); }
  function build(){ var hdr = document.querySelector('header'); if(!hdr || $('vl')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var S = slides(), sec = document.createElement('section'); sec.id = 'vl';
    sec.innerHTML = '<div class="vlw"><div class="vl-sl" id="vl-sl">' + S.map(function(x){ return '<a class="vl-s vl-' + x.k + '"' + (x.food ? ' id="vl-food"' : '') + ' href="' + x.h + '"' + (x.img ? ' style="background-image:' + OV + ',url(\'' + x.img + '\');background-size:cover;background-position:center"' : '') + '><div><b>' + esc(x.t) + '</b><span>' + esc(x.s) + '</span><i>' + esc(x.b) + ' ›</i></div><em aria-hidden="true">' + x.e + '</em></a>'; }).join('') + '</div><div class="vl-dots" id="vl-dots">' + S.map(function(_, i){ return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('') + '</div>'
      + '<div class="vl-h"><h2>Hot right now</h2><span>Live from Velos</span></div><div class="vl-run" id="vl-run">' + dv() + '</div></div>';
    hdr.parentNode.insertBefore(sec, hdr.nextSibling);
    var sl = $('vl-sl'), ds = $('vl-dots').children, n = 0, hold = 0;
    sl.addEventListener('pointerdown', function(){ hold = 1; }); sl.addEventListener('pointerup', function(){ setTimeout(function(){ hold = 0; }, 3500); });
    sl.addEventListener('scroll', function(){ var i = Math.round(sl.scrollLeft / sl.clientWidth); for(var k = 0; k < ds.length; k++) ds[k].className = k === i ? 'on' : ''; n = i; });
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(function(){ if(hold || document.hidden) return; n = (n + 1) % ds.length; sl.scrollTo({left: n * sl.clientWidth, behavior: 'smooth'}); }, 5200);
    autoscroll($('vl-run')); fill(); }
  var food = null, filled = 0, pics = [], pi = 0;
  function foodPics(m){ var a = []; if(!m || !m.vendors) return a; m.vendors.forEach(function(v){ if(v.cover_url) a.push(v.cover_url); });
    m.vendors.forEach(function(v){ v.categories.forEach(function(c){ c.items.forEach(function(i){ if(i.image && i.image.indexOf('ph-') < 0 && !/^data:/.test(i.image)) a.push(i.image); }); }); }); return a; }
  function rotateFood(){ var el = $('vl-food'); if(!el || !pics.length) return; var u = pics[pi++ % pics.length]; el.style.backgroundImage = OV + ',url("' + u.replace(/"/g, '%22') + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
  function fill(){ var run = $('vl-run'); if(!run) return; var h = foodCards(food), p = prodCards(); if(!h && !p) return; var key = (h ? 1 : 0) + ':' + (p ? 1 : 0); if(filled === key) return; filled = key; run.innerHTML = h + p + dv(); }
function fetchMenu(S){ function rp(n){ return fetch(S.url + '/rest/v1/rpc/' + n, {method:'POST', headers:{apikey:S.key, 'Content-Type':'application/json'}, body:'{}'}).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }); } return Promise.all([rp('food_menu_v2'), rp('food_vendor_profiles')]).then(function(a){ var m = a[0]; if(!m || !m.vendors) return m; (a[1] || []).forEach(function(p){ var v = m.vendors.filter(function(x){ return x.id === p.id; })[0]; if(v){ ['logo_url', 'cover_url', 'description'].forEach(function(k){ if(p[k]) v[k] = p[k]; }); if(p.promos && p.promos.length) v.promos = p.promos; } }); return m; }); }

  function fashPics(){ var a = ['fashion-hero.jpg']; try { var P = (typeof PRODUCTS !== 'undefined' && PRODUCTS) || window.PRODUCTS || []; P.forEach(function(p){ var c = String(p.cat || p.category || ''); if(/^(women-fashion|women-beauty|men-fashion|men-grooming)/.test(c) && p.img && String(p.img).indexOf('ph-') < 0 && !/^data:/.test(p.img) && a.length < 12) a.push(p.img); }); } catch(e){} return a; }
  function rotateFash(sel){ var el = document.querySelector(sel); if(!el) return; var k = 0; setInterval(function(){ var a = fashPics(); if(a.length < 2) return; k = (k + 1) % a.length; el.style.backgroundImage = OV + ',url("' + String(a[k]).replace(/"/g, '%22') + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = k ? 'center top' : 'center'; }, 5000); }
  function load(){ var S = window.VELOS_SUPABASE; if(!S) return; setTimeout(function(){ rotateFash('.vl-s[href="fashion.html"]'); }, 2500); fetchMenu(S).then(function(m){ food = m; pics = foodPics(m); rotateFood(); setInterval(rotateFood, 6000); fill(); }).catch(function(){}); }
  function boot(){ build(); load(); var n = 0, iv = setInterval(function(){ fill(); if(++n > 40) clearInterval(iv); }, 600); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
