/* Tidy shop landing: shows a handful of categories, with an Explore button for the rest.
   Works on shop.html and fashion.html next to velos-shop-jumia.js. Nothing in the catalogue is changed. */
(function(){
  if(window.__vex) return; window.__vex = 1;
  var LIMIT = 8;
  var css = '#categoryTiles.vex-c>*:nth-child(n+' + (LIMIT + 1) + '){display:none}'
    + '.vex-btn{display:block;margin:14px auto 4px;background:#e8c766;color:#080d1f;border:0;border-radius:99px;padding:13px 28px;font:700 15px system-ui;cursor:pointer}'
    + '#tabBar.vex-h{display:none}'
    + '.vex-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#0f1730;border:1px solid #2a3560;border-radius:16px;padding:12px 16px;margin:10px 0 14px;color:#f4f1ea}'
    + '.vex-bar small{display:block;color:#9fb0e0;font:600 11px system-ui;letter-spacing:.12em;text-transform:uppercase}.vex-bar b{font:600 20px Georgia,serif}'
    + '.vex-bar button{background:none;border:1px solid #e8c766;color:#e8c766;border-radius:99px;padding:10px 18px;font:700 14px system-ui;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function $(i){ return document.getElementById(i); }
  function ready(){ return typeof CATEGORIES !== 'undefined' && CATEGORIES.length; }
  function tiles(){ var t = $('categoryTiles'); if(!t || !ready()) return; var n = t.children.length;
    if(n > LIMIT){ t.classList.add('vex-c'); if(!$('vex-more')){ var b = document.createElement('button'); b.id = 'vex-more'; b.className = 'vex-btn'; b.onclick = function(){ if(window.vjCats) window.vjCats(); }; t.parentNode.insertBefore(b, t.nextSibling); } $('vex-more').textContent = 'Explore all ' + CATEGORIES.length + ' categories'; }
    else { t.classList.remove('vex-c'); if($('vex-more')) $('vex-more').remove(); } }
  var PICKED = false, FASH = /fashion/i.test(location.pathname);
  function hook(){ if(window.__vexh || typeof window.setCat !== 'function') return; window.__vexh = 1; var o = window.setCat; window.setCat = function(){ PICKED = true; var r = o.apply(this, arguments); setTimeout(tick, 30); return r; }; }
  function bar(){ var tb = $('tabBar'); if(!tb || !ready() || CATEGORIES.length <= 6) return; tb.classList.add('vex-h'); hook();
    var cur = tb.querySelector('.tab-btn.active'), name = cur ? cur.textContent : '', word = 'Showing', main;
    if(PICKED && name){ main = name; word = /fashion|wear|shoe|bag|jewel|watch|beauty|groom|perfume|cloth|dress|suit/i.test(name) ? 'Shopping' : /food|grocer|drink/i.test(name) ? 'Ordering' : 'Browsing'; }
    else { main = FASH ? 'All of Velos Fashion' : 'Everything in the Velos Global Shop'; word = FASH ? 'Shopping' : 'Browsing'; }
    var x = $('vex-bar');
    if(!x){ x = document.createElement('div'); x.id = 'vex-bar'; x.className = 'vex-bar'; tb.parentNode.insertBefore(x, tb); }
    var h = '<div><small>' + word + '</small><b>' + String(main).replace(/[<>&]/g, '') + '</b></div><button onclick="vjCats&&vjCats()">Explore categories</button>'; if(x.__h !== h){ x.__h = h; x.innerHTML = h; } }
  function tick(){ try { tiles(); bar(); } catch(e){} }
  var n = 0, iv = setInterval(function(){ tick(); if(++n > 80) clearInterval(iv); }, 500);
  new MutationObserver(function(){ clearTimeout(window.__vext); window.__vext = setTimeout(tick, 80); }).observe(document.body, {childList:true, subtree:true});
})();
