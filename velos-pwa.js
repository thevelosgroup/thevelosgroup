(function(){var W=window;
if('serviceWorker'in navigator)addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
var dp=null;addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;bar()});
function bar(){if(document.getElementById('vpb')||matchMedia('(display-mode: standalone)').matches)return;
 var ios=/iphone|ipad/i.test(navigator.userAgent),b=document.createElement('div');b.id='vpb';
 b.style.cssText='position:fixed;left:10px;right:10px;bottom:10px;z-index:9999;background:#0f1730;border:1px solid #e8c766;color:#f4f1ea;border-radius:12px;padding:12px;font:14px system-ui;display:flex;gap:10px;align-items:center;justify-content:space-between';
 b.innerHTML='<span>'+(ios?'To install: tap Share, then Add to Home Screen.':'Install this app on your device')+'</span><span>'+(ios?'':'<button id="vpi" style="background:#e8c766;border:0;border-radius:8px;padding:8px 12px;font-weight:700">Install</button> ')+'<button id="vpx" style="background:none;border:0;color:#a3adc6;font-size:18px">✕</button></span>';
 document.body.appendChild(b);document.getElementById('vpx').onclick=function(){b.remove();try{localStorage.vpd=1}catch(e){}};
 var i=document.getElementById('vpi');if(i)i.onclick=function(){dp.prompt();dp.userChoice.then(function(){b.remove()})}}
addEventListener('load',function(){setTimeout(function(){try{if(localStorage.vpd)return}catch(e){}if(/iphone|ipad/i.test(navigator.userAgent))bar()},3000)});
W.VelosPWA={ask:function(){return 'Notification'in W?Notification.requestPermission():Promise.resolve('denied')},
 status:function(){return 'Notification'in W?Notification.permission:'unsupported'},
 notify:function(t,b,u){try{if(this.status()!=='granted')return;navigator.vibrate&&navigator.vibrate([200,100,200]);
  navigator.serviceWorker.ready.then(function(r){r.showNotification(t,{body:b,icon:'icon-192.png',badge:'icon-192.png',tag:'velos-'+t,data:{url:u||location.href}})})}catch(e){}},
 prompt:function(){if(this.status()!=='default'||document.getElementById('vpn'))return;var n=document.createElement('div');n.id='vpn';
  n.style.cssText='position:fixed;left:10px;right:10px;top:10px;z-index:9999;background:#0f1730;border:1px solid #e8c766;color:#f4f1ea;border-radius:12px;padding:12px;font:14px system-ui;display:flex;gap:10px;align-items:center;justify-content:space-between';
  n.innerHTML='<span>Get alerts for new orders and updates?</span><button style="background:#e8c766;border:0;border-radius:8px;padding:8px 12px;font-weight:700">Turn on</button>';
  n.querySelector('button').onclick=function(){VelosPWA.ask().then(function(){n.remove()})};document.body.appendChild(n)}};
})();
