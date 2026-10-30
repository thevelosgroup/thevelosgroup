/* Velos shop experience: search bar, banner slider, category row, wishlist, bottom navigation,
   product cards. Works on shop.html and fashion.html; sits on top of app-core.js (nothing there is changed). */
(function(){
  if(window.__vj) return; window.__vj = 1;
  var WK = 'velosWish', FASH = !!window.WING_CATS;
  function $(i){ return document.getElementById(i); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function wish(){ try { return JSON.parse(localStorage.getItem(WK) || '[]'); } catch(e){ return []; } }
  function setWish(a){ try { localStorage.setItem(WK, JSON.stringify(a)); } catch(e){} badges(); }
  function ready(){ return typeof PRODUCTS !== 'undefined' && typeof CATEGORIES !== 'undefined' && CATEGORIES.length; }
  var PH = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6b779c" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>');

  /* ---------- product card ---------- */
  window.productCard = function(p){
    var cat = (CATEGORIES.filter(function(c){ return c.key === p.cat; })[0] || {}).label || '', on = wish().indexOf(String(p.id)) > -1, share = typeof SHARE_ICON !== 'undefined' ? SHARE_ICON : '↗';
    var wh = (typeof CATEGORY_NOTES !== 'undefined' && CATEGORY_NOTES[p.cat]) ? '<span class="vj-tag">Wholesale available</span>' : '';
    return '<div class="product-card vj-card"><div class="img-wrap' + (p.real ? ' real-tile' : '') + '">' + (p.new ? '<span class="new-ribbon">New</span>' : '')
      + '<button class="vj-heart' + (on ? ' on' : '') + '" onclick="vjHeart(\'' + esc(p.id) + '\',this)" aria-label="Save to wishlist">♥</button>'
      + '<button class="card-share-btn" onclick="shareProduct(\'' + esc(p.id) + '\')" aria-label="Share ' + esc(p.name) + '">' + share + '</button>'
      + '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + PH + '\';this.classList.add(\'vj-ph\')"></div>'
      + '<div class="product-info"><span class="cat-tag">' + esc(p.sub || cat) + '</span><h4>' + esc(p.name) + '</h4><span class="price">' + formatUGX(p.price) + '</span>'
      + '<div class="vj-meta">' + (p.real ? '<span class="vj-ver">✔ Verified photo</span>' : '') + wh + '</div>'
      + '<div class="product-actions"><button class="btn-mini add" onclick="addToCart(\'' + esc(p.id) + '\',this)">Add to cart</button><button class="btn-mini order" onclick="orderNow(\'' + esc(p.id) + '\')">Order now</button></div></div></div>';
  };

  /* ---------- wishlist ---------- */
  window.vjHeart = function(id, b){ var a = wish(), i = a.indexOf(String(id)); if(i > -1) a.splice(i, 1); else a.push(String(id)); setWish(a); if(b) b.classList.toggle('on', i < 0);
    document.querySelectorAll('.vj-heart').forEach(function(x){ if(x.getAttribute('onclick').indexOf("'" + id + "'") > -1) x.classList.toggle('on', i < 0); }); if($('vj-wish')) vjWish(true); };
  window.vjWish = function(keep){ var m = $('vj-wish'); if(m && !keep){ m.remove(); return; } if(m) m.remove();
    var ids = wish(), items = ids.map(function(id){ return PRODUCTS.filter(function(p){ return String(p.id) === id; })[0]; }).filter(Boolean);
    m = document.createElement('div'); m.id = 'vj-wish'; m.className = 'vj-sheet'; m.onclick = function(e){ if(e.target === m) m.remove(); };
    m.innerHTML = '<div class="vj-box"><div class="vj-bh"><b>♥ My wishlist (' + items.length + ')</b><button onclick="vjWish()" aria-label="Close">×</button></div>' + (items.length ? items.map(function(p){
      return '<div class="vj-wi"><img src="' + esc(p.img) + '" alt="" onerror="this.src=\'' + PH + '\'"><div><b>' + esc(p.name) + '</b><div class="price">' + formatUGX(p.price) + '</div><div class="vj-wb"><button class="btn-mini add" onclick="addToCart(\'' + esc(p.id) + '\',this)">Add to cart</button><button class="btn-mini order" onclick="vjHeart(\'' + esc(p.id) + '\')">Remove</button></div></div></div>'; }).join('')
      : '<p class="vj-empty">Tap the ♥ on any product to save it here for later.</p>') + '</div>'; document.body.appendChild(m); };

  /* ---------- categories sheet ---------- */
  window.vjCats = function(){ var m = $('vj-cs'); if(m){ m.remove(); return; } m = document.createElement('div'); m.id = 'vj-cs'; m.className = 'vj-sheet'; m.onclick = function(e){ if(e.target === m) m.remove(); };
    m.innerHTML = '<div class="vj-box"><div class="vj-bh"><b>All categories</b><button onclick="vjCats()" aria-label="Close">×</button></div><div class="vj-cg">' + CATEGORIES.map(function(c){ return '<button onclick="vjGo(\'' + esc(c.key) + '\')"><span><img src="' + esc(c.thumb) + '" alt="" loading="lazy" onerror="this.remove()"></span>' + esc(c.label) + '</button>'; }).join('') + '</div></div>'; document.body.appendChild(m); };
  window.vjGo = function(k){ var m = $('vj-cs'); if(m) m.remove(); clearSearch(); setCat(k); };

  /* ---------- search ---------- */
  var st;
  function clearSearch(){ var i = $('vj-q'); if(i) i.value = ''; var r = $('vj-res'); if(r){ r.hidden = true; r.innerHTML = ''; } }
  function search(){ var q = ($('vj-q').value || '').trim().toLowerCase(), r = $('vj-res'); if(!q){ r.hidden = true; r.innerHTML = ''; return; }
    var keys = {}, labels = {}; CATEGORIES.forEach(function(c){ keys[c.key] = 1; labels[c.key] = c.label.toLowerCase(); }); var toks = q.split(/\s+/);
    var hits = PRODUCTS.filter(function(p){ if(!keys[p.cat]) return false; var hay = (p.name + ' ' + (p.sub || '') + ' ' + labels[p.cat]).toLowerCase(); return toks.every(function(t){ return hay.indexOf(t) > -1; }); });
    hits.sort(function(a, b){ return (b.price ? 1 : 0) - (a.price ? 1 : 0); });
    r.hidden = false; r.innerHTML = '<div class="vs-head"><h2>' + hits.length + ' result' + (hits.length === 1 ? '' : 's') + ' for “' + esc($('vj-q').value.trim()) + '”</h2><a href="#" onclick="vjClear();return false">Clear</a></div>'
      + (hits.length ? '<div class="product-grid">' + hits.slice(0, 48).map(productCard).join('') + '</div>' : '<div class="shop-no-results"><b>Nothing found</b>Try another word, or ask us on WhatsApp and we will source it for you.<br><a class="btn-secondary" style="margin-top:12px;display:inline-block" target="_blank" rel="noopener" href="https://wa.me/256755215751?text=' + encodeURIComponent('Hello Velos, I am looking for: ' + $('vj-q').value.trim()) + '">Ask on WhatsApp</a></div>');
    var y = r.getBoundingClientRect().top + scrollY - (($('vj-bar') || {}).offsetHeight || 60) - (document.querySelector('header') || {offsetHeight: 0}).offsetHeight - 8; if(y < scrollY - 4 || y > scrollY + 40) scrollTo({top: y, behavior: 'smooth'}); }
  window.vjClear = function(){ clearSearch(); };

  /* ---------- banner slider ---------- */
  function slides(){ var wa = 'https://wa.me/256755215751?text=' + encodeURIComponent('Hello Velos, I would like help sourcing a product.');
    return [
      {k:'a', img:FASH ? 'fashion-hero.jpg' : 'shop-hero.jpg', t:FASH ? 'Fashion & beauty, curated' : 'Premium products. Sourced with precision.', s:FASH ? 'Dresses, wigs, perfumes, bags, suits and grooming for ladies and men.' : 'Verified suppliers, transparent prices and reliable delivery across Kampala.', b:'Shop now', h:'#vj-cats'},
      {k:'b', img:FASH ? 'shop-hero.jpg' : 'fashion-hero.jpg', t:FASH ? 'Looking for electronics?' : 'Fashion & beauty', s:FASH ? 'Phones, laptops, TVs and home appliances in Velos Global Shop.' : 'Ladies and men: dresses, wigs, perfumes, bags, suits and grooming.', b:FASH ? 'Visit the shop' : 'Explore fashion', h:FASH ? 'shop.html' : 'fashion.html'},
      {k:'c', t:'Buying from abroad?', s:'We handle sourcing, shipping, customs and delivery for you.', b:'Ask on WhatsApp', h:wa, x:1},
      {k:'d', food:1, t:'Hungry? Velos Foods delivers', s:'Restaurants, groceries and fresh supplies to your door.', b:'Order food', h:'foods.html'}]; }
  function slider(){ var S = slides(); return '<div class="vj-sl" id="vj-sl">' + S.map(function(x, i){ return '<a class="vj-s vj-s-' + x.k + '"' + (x.food ? ' id="vj-food"' : '') + ' href="' + esc(x.h) + '"' + (x.x ? ' target="_blank" rel="noopener"' : '') + (x.img ? ' style="background-image:linear-gradient(90deg,rgba(2,8,28,.9) 0,rgba(2,8,28,.5) 60%,rgba(2,8,28,.15) 100%),url(\'' + x.img + '\');background-size:cover;background-position:center"' : '') + '><div><b>' + esc(x.t) + '</b><span>' + esc(x.s) + '</span><i>' + esc(x.b) + ' ›</i></div></a>'; }).join('') + '</div><div class="vj-dots" id="vj-dots">' + S.map(function(_, i){ return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('') + '</div>'; }
  function autoplay(){ var el = $('vj-sl'); if(!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return; var n = 0, ds = $('vj-dots').children, hold = 0;
    el.addEventListener('pointerdown', function(){ hold = 1; }); el.addEventListener('pointerup', function(){ setTimeout(function(){ hold = 0; }, 3000); });
    el.addEventListener('scroll', function(){ var i = Math.round(el.scrollLeft / el.clientWidth); for(var k = 0; k < ds.length; k++) ds[k].className = k === i ? 'on' : ''; n = i; });
    setInterval(function(){ if(hold || document.hidden) return; n = (n + 1) % ds.length; el.scrollTo({left: n * el.clientWidth, behavior: 'smooth'}); }, 5200); }

function fetchMenu(S){ function rp(n){ return fetch(S.url + '/rest/v1/rpc/' + n, {method:'POST', headers:{apikey:S.key, 'Content-Type':'application/json'}, body:'{}'}).then(function(r){ return r.ok ? r.json() : null; }).catch(function(){ return null; }); } return Promise.all([rp('food_menu_v2'), rp('food_vendor_profiles')]).then(function(a){ var m = a[0]; if(!m || !m.vendors) return m; (a[1] || []).forEach(function(p){ var v = m.vendors.filter(function(x){ return x.id === p.id; })[0]; if(v){ ['logo_url', 'cover_url', 'description'].forEach(function(k){ if(p[k]) v[k] = p[k]; }); if(p.promos && p.promos.length) v.promos = p.promos; } }); return m; }); }

  function fashPics(){ var a = ['fashion-hero.jpg']; try { var P = (typeof PRODUCTS !== 'undefined' && PRODUCTS) || window.PRODUCTS || []; P.forEach(function(p){ var c = String(p.cat || p.category || ''); if(/^(women-fashion|women-beauty|men-fashion|men-grooming)/.test(c) && p.img && String(p.img).indexOf('ph-') < 0 && !/^data:/.test(p.img) && a.length < 12) a.push(p.img); }); } catch(e){} return a; }
  function rotateFash(sel){ var el = document.querySelector(sel); if(!el) return; var k = 0; setInterval(function(){ var a = fashPics(); if(a.length < 2) return; k = (k + 1) % a.length; el.style.backgroundImage = 'linear-gradient(90deg,rgba(2,8,28,.9) 0,rgba(2,8,28,.5) 60%,rgba(2,8,28,.15) 100%)' + ',url("' + String(a[k]).replace(/"/g, '%22') + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = k ? 'center top' : 'center'; }, 5000); }
  function foodBg(){ var S = window.VELOS_SUPABASE; if(!S) return; fetchMenu(S).then(function(m){ var a = []; if(!m || !m.vendors) return; m.vendors.forEach(function(v){ if(v.cover_url) a.push(v.cover_url); v.categories.forEach(function(c){ c.items.forEach(function(i){ if(i.image && i.image.indexOf('ph-') < 0 && !/^data:/.test(i.image)) a.push(i.image); }); }); }); if(!a.length) return; var k = 0, el = $('vj-food'); function go(){ if(!el) return; el.style.backgroundImage = 'linear-gradient(90deg,rgba(2,8,28,.9) 0,rgba(2,8,28,.5) 60%,rgba(2,8,28,.15) 100%),url("' + a[k++ % a.length].replace(/"/g, '%22') + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; } go(); setInterval(go, 6000); }).catch(function(){}); }
  /* ---------- category row ---------- */
  var catSig = '';
  function catRow(){ var box = $('vj-cats'); if(!box || !ready()) return; var sig = CATEGORIES.map(function(c){ return c.key; }).join(','); if(sig === catSig) return; catSig = sig;
    box.innerHTML = CATEGORIES.map(function(c){ return '<button onclick="vjGo(\'' + esc(c.key) + '\')"><span><img src="' + esc(c.thumb) + '" alt="" loading="lazy" onerror="this.remove()"></span><em>' + esc(c.label) + '</em></button>'; }).join(''); }

  /* ---------- bottom navigation ---------- */
  function nav(){ if($('vj-nav')) return; var n = document.createElement('nav'); n.id = 'vj-nav'; n.setAttribute('aria-label', 'Shop navigation');
    n.innerHTML = '<button onclick="scrollTo({top:0,behavior:\'smooth\'});vjClear()"><svg viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>Home</button>'
      + '<button onclick="vjCats()"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Categories</button>'
      + '<button onclick="toggleCart(true)"><svg viewBox="0 0 24 24"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="20" r="1"/><circle cx="17" cy="20" r="1"/></svg>Cart<span class="vj-bg" id="vj-bc" hidden></span></button>'
      + '<button onclick="vjWish()"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.700-8 11-8 11z"/></svg>Wishlist<span class="vj-bg" id="vj-bw" hidden></span></button>'
      + '<a href="account.html"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>Account</a>'; document.body.appendChild(n); document.body.classList.add('vj-has-nav'); }
  function badges(){ var c = $('cartCount'), bc = $('vj-bc'), bw = $('vj-bw'), w = wish().length; if(bc){ var n = c ? parseInt(c.textContent, 10) || 0 : 0; bc.hidden = !n; bc.textContent = n; } if(bw){ bw.hidden = !w; bw.textContent = w; } }

  /* ---------- build ---------- */
  function build(){ var sec = $('shop'); if(!sec || $('vj-bar')) return;
    var hh = (document.querySelector('header') || {offsetHeight: 0}).offsetHeight; document.documentElement.style.setProperty('--vj-hh', hh + 'px');
    var bar = document.createElement('div'); bar.id = 'vj-bar'; bar.innerHTML = '<div class="wrap"><div class="vj-sb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="vj-q" type="search" placeholder="' + (FASH ? 'Search dresses, wigs, perfumes, suits…' : 'Search phones, laptops, TVs, appliances…') + '" autocomplete="off" aria-label="Search the shop"><button id="vj-x" onclick="vjClear()" aria-label="Clear">×</button></div></div>';
    var top = document.createElement('div'); top.className = 'wrap vj-top'; top.innerHTML = slider() + '<div class="vj-cats" id="vj-cats"></div><div id="vj-res" hidden></div>';
    sec.insertBefore(top, sec.firstChild); sec.insertBefore(bar, sec.firstChild);
    $('vj-q').addEventListener('input', function(){ clearTimeout(st); st = setTimeout(search, 140); }); $('vj-q').addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); clearTimeout(st); search(); this.blur(); } });
    nav(); autoplay(); catRow(); badges(); foodBg(); if(FASH) setTimeout(function(){ rotateFash('.vj-s-a'); }, 2500); }
  function boot(){ build(); catRow(); badges(); }
  var tries = 0, iv = setInterval(function(){ if(ready()) boot(); if(++tries > 60) clearInterval(iv); }, 500);
  addEventListener('load', function(){ setTimeout(function(){ if(ready()){ boot(); if(typeof renderProducts === 'function'){ try { renderProducts(); } catch(e){} } } }, 400); });
  setInterval(badges, 1200);
})();
