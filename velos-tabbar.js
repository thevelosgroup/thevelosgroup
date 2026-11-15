/* Velos: app-style bottom navigation for phones (public pages only) */
(function(){
  var D = document, W = window, p = location.pathname.replace(/^.*\//, '') || 'index.html';
  var ON = {'index.html':'home', 'foods.html':'foods', 'marketplace.html':'shop', 'hotels.html':'stays', 'stay.html':'stays', 'my-booking.html':'stays', 'account.html':'me'}, CARTP = {'foods.html':1, 'marketplace.html':1};
  if(!ON[p] || D.getElementById('vtb')) return;
  var I = {
    home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    foods:'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
    shop:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',
    stays:'<path d="M3 19V6M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10" r="1.6"/>',
    me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'
  };
  var T = [['home','Home','index.html'], ['foods','Foods','foods.html'], ['shop','Shop','shop.html'], CARTP[p] ? ['cart','Cart','#cart'] : ['stays','Stays','hotels.html'], ['me','Account','account.html']];
  var css = D.createElement('style');
  css.textContent = '#vtb{display:none}@media(max-width:768px){#vtb{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:2147481000;background:rgba(8,13,31,.97);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid #2a3560;padding:6px 4px calc(6px + env(safe-area-inset-bottom))}'
    + '#vtb a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#a3adc6;font:600 11px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;padding:4px 0;border-radius:10px}'
    + '#vtb svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}#vtb a.on{color:#e8c766}#vtb a.on svg{stroke-width:2.2}'
    + 'body.vtb{padding-bottom:72px!important}body.vtb #vwa{bottom:150px!important}body.vtb #vaL{bottom:calc(84px + env(safe-area-inset-bottom))!important}body.vtb #vlang{bottom:84px!important}body.vtb #vft{padding-bottom:20px}.sh,.sheet{bottom:var(--vtbh,64px)!important}.sh .bx,.sheet .bx{max-height:calc(100vh - var(--vtbh,64px) - 10px);max-height:calc(100dvh - var(--vtbh,64px) - 10px);padding-bottom:18px!important;-webkit-overflow-scrolling:touch}body.vtb .cartbtn{bottom:calc(var(--vtbh,64px) + 10px)!important}#vtb a{position:relative}#vtb .bg{position:absolute;top:0;left:calc(50% + 6px);min-width:17px;height:17px;border-radius:9px;background:#e8c766;color:#080d1f;font:700 10px/17px system-ui;text-align:center;padding:0 4px}#vtb a.has{color:#e8c766}#vtb a.has svg{fill:rgba(232,199,102,.22);stroke-width:2.2;animation:vtbp 1.8s ease-in-out infinite}@keyframes vtbp{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}}';
  D.head.appendChild(css);
  if(!window.__vfl){ var fs = D.createElement('script'); fs.src = 'velos-float.js?v=1'; fs.async = true; (D.body || D.documentElement).appendChild(fs); }
  function build(){
    var n = D.createElement('nav'); n.id = 'vtb'; n.setAttribute('aria-label', 'Main');
    n.innerHTML = T.map(function(t){ return '<a ' + (t[0] === 'cart' ? 'id="vtb-cart" ' : '') + 'href="' + t[2] + '"' + (t[0] === ON[p] ? ' class="on" aria-current="page"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + I[t[0]] + '</svg><span>' + t[1] + '</span></a>'; }).join('');
    D.body.appendChild(n); D.body.classList.add('vtb');
  }
  /* cart tab: shows how many items are in the basket, turns gold when it is not empty, and opens the page's own cart */
  function count(){ try { if(p === 'foods.html') return Object.keys(window.cart || {}).length; if(p === 'marketplace.html' && typeof lines === 'function') return lines().reduce(function(a, l){ return a + (l.q || 1); }, 0); } catch(e){} return 0; }
  function openC(){ try { if(!count()){ tip('Your cart is empty. Add something first.'); return; } if(p === 'foods.html') openCart(); else cart(); } catch(e){} }
  function tip(t){ var x = D.createElement('div'); x.textContent = t; x.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--vtbh,64px) + 14px);z-index:2147481500;background:#0f1730;color:#f4f1ea;border:1px solid #e8c766;border-radius:12px;padding:10px 14px;font:600 13px system-ui'; D.body.appendChild(x); setTimeout(function(){ x.remove(); }, 2200); }
  function paintCart(){ var a = D.getElementById('vtb-cart'); if(!a) return; var n = count(), b = a.querySelector('.bg'); a.classList.toggle('has', n > 0); if(n > 0){ if(!b){ b = D.createElement('span'); b.className = 'bg'; a.appendChild(b); } b.textContent = n; } else if(b) b.remove(); }
  function measure(){ var n = D.getElementById('vtb'); if(!n || n.offsetHeight === 0) { D.documentElement.style.removeProperty('--vtbh'); return; } D.documentElement.style.setProperty('--vtbh', n.offsetHeight + 'px'); }
  function watch(){ var c = D.getElementById('vtb-cart'); if(c) c.onclick = function(e){ e.preventDefault(); openC(); }; paintCart(); measure(); setInterval(paintCart, 700); W.addEventListener('resize', measure); }
  if(D.body) { build(); watch(); } else D.addEventListener('DOMContentLoaded', function(){ build(); watch(); });
})();
