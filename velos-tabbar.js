/* Velos: app-style bottom navigation for phones (public pages only) */
(function(){
  var D = document, p = location.pathname.replace(/^.*\//, '') || 'index.html';
  var ON = {'index.html':'home', 'foods.html':'foods', 'marketplace.html':'shop', 'hotels.html':'stays', 'stay.html':'stays', 'my-booking.html':'stays', 'account.html':'me'};
  if(!ON[p] || D.getElementById('vtb')) return;
  var I = {
    home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    foods:'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
    shop:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',
    stays:'<path d="M3 19V6M3 14h18v5M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10" r="1.6"/>',
    me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'
  };
  var T = [['home','Home','index.html'], ['foods','Foods','foods.html'], ['shop','Shop','shop.html'], ['stays','Stays','hotels.html'], ['me','Account','account.html']];
  var css = D.createElement('style');
  css.textContent = '#vtb{display:none}@media(max-width:768px){#vtb{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:2147481000;background:rgba(8,13,31,.97);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid #2a3560;padding:6px 4px calc(6px + env(safe-area-inset-bottom))}'
    + '#vtb a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;text-decoration:none;color:#a3adc6;font:600 11px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;padding:4px 0;border-radius:10px}'
    + '#vtb svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}#vtb a.on{color:#e8c766}#vtb a.on svg{stroke-width:2.2}'
    + 'body.vtb{padding-bottom:72px!important}body.vtb #vwa{bottom:150px!important}body.vtb #vaL{bottom:calc(84px + env(safe-area-inset-bottom))!important}body.vtb #vlang{bottom:84px!important}body.vtb #vft{padding-bottom:20px}}';
  D.head.appendChild(css);
  function build(){
    var n = D.createElement('nav'); n.id = 'vtb'; n.setAttribute('aria-label', 'Main');
    n.innerHTML = T.map(function(t){ return '<a href="' + t[2] + '"' + (t[0] === ON[p] ? ' class="on" aria-current="page"' : '') + '><svg viewBox="0 0 24 24" aria-hidden="true">' + I[t[0]] + '</svg><span>' + t[1] + '</span></a>'; }).join('');
    D.body.appendChild(n); D.body.classList.add('vtb');
  }
  if(D.body) build(); else D.addEventListener('DOMContentLoaded', build);
})();
