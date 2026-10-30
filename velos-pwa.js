(function(){var W=window;
var UA=navigator.userAgent,IOS=/iphone|ipad|ipod/i.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),SAF=IOS&&!/crios|fxios|edgios|opios/i.test(UA),STANDALONE=(function(){try{return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}})();
if(IOS){try{document.documentElement.className+=' ios'}catch(e){}}
function lz(n){if(n.tagName==='IMG'){if(!n.hasAttribute('loading'))n.setAttribute('loading','lazy');if(!n.hasAttribute('decoding'))n.setAttribute('decoding','async')}else if(n.querySelectorAll)n.querySelectorAll('img').forEach(lz)}
try{new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(lz)})}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
addEventListener('DOMContentLoaded',function(){document.querySelectorAll('img').forEach(lz)});
if('serviceWorker'in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
var dp=null;addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;bar()});
function bar(){if(document.getElementById('vpb')||STANDALONE)return;
 var ios=IOS,b=document.createElement('div');b.id='vpb';
 b.style.cssText='position:fixed;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:9999;background:#0f1730;border:1px solid #e8c766;color:#f4f1ea;border-radius:12px;padding:12px;font:14px -apple-system,system-ui;display:flex;gap:10px;align-items:center;justify-content:space-between';
 b.innerHTML='<span>'+(ios?(SAF?'To install: tap the Share icon, then Add to Home Screen.':'To install: tap Share (or the ⋯ menu), then Add to Home Screen. If you do not see it, open this page in Safari.'):'Install this app on your device')+'</span><span>'+(ios?'':'<button id="vpi" style="background:#e8c766;border:0;border-radius:8px;padding:8px 12px;font-weight:700">Install</button> ')+'<button id="vpx" style="background:none;border:0;color:#a3adc6;font-size:18px">✕</button></span>';
 document.body.appendChild(b);document.getElementById('vpx').onclick=function(){b.remove();try{localStorage.vpd=1}catch(e){}};
 var i=document.getElementById('vpi');if(i)i.onclick=function(){dp.prompt();dp.userChoice.then(function(){b.remove()})}}
addEventListener('load',function(){setTimeout(function(){try{if(localStorage.vpd)return}catch(e){}if(IOS)bar()},3000)});
(function(){function m(n,c){if(!document.querySelector('meta[name="'+n+'"]')){var e=document.createElement('meta');e.name=n;e.content=c;document.head.appendChild(e)}}
 m('apple-mobile-web-app-capable','yes');m('mobile-web-app-capable','yes');var p=location.pathname.toLowerCase(),t='Velos';if(/admin/.test(p))t='Velos Admin';else if(/restaurant/.test(p))t='Velos Restaurant';else if(/rider/.test(p))t='Velos Rider';else if(/agent/.test(p))t='Velos Agent';else if(/partner/.test(p))t='Velos Partner';else if(/foods/.test(p))t='Velos Foods';else if(/fashion/.test(p))t='Velos Fashion';else if(/shop/.test(p))t='Velos Shop';
 m('apple-mobile-web-app-title',t);m('apple-mobile-web-app-status-bar-style','black');m('format-detection','telephone=no');
 (function(){var v=document.querySelector('meta[name=viewport]');if(v&&v.content.indexOf('viewport-fit')<0)v.content+=',viewport-fit=cover'})();
 if(!document.querySelector('link[rel=apple-touch-icon]')){var l=document.createElement('link');l.rel='apple-touch-icon';l.href='icon-192.png';document.head.appendChild(l)}})();
W.VelosPWA={install:function(){if(dp){dp.prompt();return}var ua=navigator.userAgent,ios=IOS,ch=!SAF,t;
  if(ios)t='<b>Install on iPhone / iPad</b><ol style="padding-left:20px;margin:8px 0"><li>'+(ch?'Tap the <b>Share</b> button (square with an arrow, next to the address bar or in the ⋯ menu). On iOS 16.4 or newer this works in Chrome, Firefox and Edge too. If you do not see <b>Add to Home Screen</b>, open this page in <b>Safari</b> instead.':'Tap the <b>Share</b> button (square with an arrow) at the bottom of Safari.')+'</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>. The Velos icon appears on your home screen.</li></ol>';
  else if(/android/i.test(ua))t='<b>Install on Android</b><ol style="padding-left:20px;margin:8px 0"><li>Tap the <b>⋮</b> menu at the top right of Chrome.</li><li>Tap <b>Install app</b> (or Add to Home screen).</li><li>Tap <b>Install</b>.</li></ol>';
  else t='<b>Install on your computer</b><ol style="padding-left:20px;margin:8px 0"><li>Click the install icon at the right end of the address bar (Chrome or Edge).</li><li>Click <b>Install</b>.</li></ol>';
  var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:2147483001;background:rgba(2,8,28,.85);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.5 system-ui';o.innerHTML='<div style="background:#0f1730;border:1px solid #e8c766;border-radius:16px;padding:18px;max-width:420px;color:#f4f1ea">'+t+'<button style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#e8c766;font-weight:700">Got it</button></div>';o.querySelector('button').onclick=function(){o.remove()};document.body.appendChild(o)},ask:function(){return 'Notification'in W?Notification.requestPermission():Promise.resolve('denied')},
 status:function(){return 'Notification'in W?Notification.permission:'unsupported'},isIOS:IOS,isInstalled:STANDALONE,
 notify:function(t,b,u){try{if(this.status()!=='granted')return;navigator.vibrate&&navigator.vibrate([200,100,200]);
  navigator.serviceWorker.ready.then(function(r){r.showNotification(t,{body:b,icon:'icon-192.png',badge:'icon-192.png',tag:'velos-'+t,data:{url:u||location.href}})})}catch(e){}},
 prompt:function(){if(this.status()!=='default'||document.getElementById('vpn'))return;var n=document.createElement('div');n.id='vpn';
  n.style.cssText='position:fixed;left:10px;right:10px;top:10px;z-index:9999;background:#0f1730;border:1px solid #e8c766;color:#f4f1ea;border-radius:12px;padding:12px;font:14px system-ui;display:flex;gap:10px;align-items:center;justify-content:space-between';
  n.innerHTML='<span>Get alerts for new orders and updates?</span><button style="background:#e8c766;border:0;border-radius:8px;padding:8px 12px;font-weight:700">Turn on</button>';
  n.querySelector('button').onclick=function(){VelosPWA.ask().then(function(){n.remove()})};document.body.appendChild(n)}};
})();
