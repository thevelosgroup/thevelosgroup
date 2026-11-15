/* Velos floating helpers (phones): keeps the assistant, WhatsApp, language and tab bar from ever covering buttons.
   - hides them whenever a cart, sheet or pop-up is open (so Checkout / Pay / Book are always visible)
   - fades them out while the page is scrolling, so Add to cart buttons are never blocked
   - language becomes a small globe icon (the language list still opens as a drop-down menu) */
(function(){ if(window.__vfl) return; window.__vfl = 1; var D = document, W = window;
  var css = D.createElement('style');
  css.textContent = '@media(max-width:768px){'
    + '#vlang>button{padding:0!important;width:40px;height:40px;justify-content:center;font-size:18px!important;gap:0!important}#vlang .lb{display:none}'
    + '#vlang{left:10px!important}#vlang .pp{bottom:48px!important}'
    + '#vaL,#vwa,#vlang,#vtb{transition:opacity .2s ease,transform .2s ease}'
    + 'body.vfl-hide #vaL,body.vfl-hide #vwa,body.vfl-hide #vlang,body.vfl-hide #vtb,body.vfl-hide .cartbtn.vfl-x{opacity:0!important;pointer-events:none!important;visibility:hidden}'
    + 'body.vfl-scroll #vaL,body.vfl-scroll #vwa,body.vfl-scroll #vlang{opacity:0;pointer-events:none}'
    + 'body.vfl-hide{padding-bottom:0!important}}';
  D.head.appendChild(css);
  var SEL = '.sheet,.sh,.vj-sheet,.cart-drawer.open,.modal.open,.vj-modal,[role=dialog]:not([hidden])', tm = null;
  function sync(){ var b = D.body; if(!b) return; var o = D.querySelector(SEL); b.classList.toggle('vfl-hide', !!o); }
  function start(){ sync(); try { new MutationObserver(sync).observe(D.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','hidden']}); } catch(e){}
    W.addEventListener('scroll', function(){ if(W.innerWidth > 768) return; D.body.classList.add('vfl-scroll'); clearTimeout(tm); tm = setTimeout(function(){ D.body.classList.remove('vfl-scroll'); }, 700); }, {passive:true}); }
  if(D.body) start(); else D.addEventListener('DOMContentLoaded', start);
})();
