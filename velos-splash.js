(function(){var W=window,hid=0,CSS='#vsp{--ac:#e8c766;position:fixed;inset:0;z-index:2147483000;background:radial-gradient(circle at 50% 40%,#0a1f6b 0,#02103a 60%,#010a24 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;transition:opacity .7s;overflow:hidden}'
+'#vsp .ry{position:absolute;left:50%;top:40%;width:900px;height:900px;margin:-450px 0 0 -450px;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.07) 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 62%);mask:radial-gradient(circle,#000 0,transparent 62%);animation:vr 9s linear infinite,vf 1s ease both}'
+'#vsp .st{position:relative;width:230px;height:230px;display:flex;align-items:center;justify-content:center}'
+'#vsp .or{position:absolute;inset:0;animation:vr 5s linear infinite}#vsp .or i{position:absolute;left:50%;top:50%;width:9px;height:9px;margin:-4.5px;border-radius:50%;background:var(--ac);box-shadow:0 0 12px var(--ac)}'
+'#vsp .or i:nth-child(1){transform:rotate(0) translateY(-108px)}#vsp .or i:nth-child(2){transform:rotate(90deg) translateY(-108px);opacity:.7}#vsp .or i:nth-child(3){transform:rotate(180deg) translateY(-108px);opacity:.5}#vsp .or i:nth-child(4){transform:rotate(270deg) translateY(-108px);opacity:.7}'
+'#vsp .lg{position:relative;width:170px;height:170px;border-radius:34px;overflow:hidden;box-shadow:0 0 0 0 rgba(232,199,102,.5);animation:vz 1.1s cubic-bezier(.2,.9,.3,1.2) both,vg 2.2s ease-in-out .9s 2}#vsp .lg{background:#02103a}#vsp .lg img{width:100%;height:100%;display:block;object-fit:contain;padding:18px 14px;box-sizing:border-box}'
+'#vsp .lg:after{content:"";position:absolute;top:0;bottom:0;width:60%;left:-80%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);animation:vs 1.3s ease .9s forwards}'
+'#vsp .em{position:absolute;right:6px;top:4px;font-size:34px;opacity:0;animation:vp .7s cubic-bezier(.2,.9,.3,1.4) 1s forwards}'
+'#vsp b{color:#f4f1ea;font:700 22px Georgia,serif;letter-spacing:1px;opacity:0;animation:vu .7s ease forwards}#vsp b i{font-style:normal;color:var(--ac)}'
+'#vsp small{color:#9fb0e6;font:12px system-ui;letter-spacing:3px;opacity:0;animation:vu .7s ease 1.7s forwards}#vsp .gr{color:var(--ac);font:600 15px Georgia,serif;letter-spacing:.5px;opacity:0;animation:vu .7s ease 1.2s forwards;text-align:center;padding:0 24px}'
+'#vsp .fl{position:absolute;top:-40px;font-size:22px;animation:vd 4s linear infinite;opacity:.85}'
+'@keyframes vr{to{transform:rotate(360deg)}}@keyframes vf{from{opacity:0}}@keyframes vp{from{opacity:0;transform:scale(.2) rotate(-30deg)}to{opacity:1;transform:none}}@keyframes vd{to{transform:translateY(110vh) rotate(40deg)}}'
+'@keyframes vz{from{opacity:0;transform:scale(.4) rotate(-10deg)}to{opacity:1;transform:none}}@keyframes vg{50%{box-shadow:0 0 60px 14px rgba(232,199,102,.45)}}@keyframes vs{to{left:140%}}@keyframes vu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}'
+'@media(prefers-reduced-motion:reduce){#vsp *{animation:none!important;opacity:1!important}}';
var FLOAT={fireworks:'✨',snow:'❄️',hearts:'💗',stars:'⭐',confetti:'🎊',petals:'🌸',sparkle:'✨'};
function theme(S){var d=document.getElementById('vsp');if(!d||!S||d.getAttribute('data-t'))return;d.setAttribute('data-t',1);
 d.style.setProperty('--ac',S.accent||'#e8c766');var st=d.querySelector('.st');
 if(S.e){var e=document.createElement('span');e.className='em';e.textContent=S.e;st.appendChild(e)}
 var g=document.createElement('div');g.className='gr';g.textContent=S.t||'';var sm=d.querySelector('small');sm.parentNode.insertBefore(g,sm);
 var f=FLOAT[S.fx]||'✨';for(var i=0;i<12;i++){var s=document.createElement('span');s.className='fl';s.textContent=f;s.style.left=(4+i*8)+'%';s.style.animationDelay=(i*.3)+'s';s.style.animationDuration=(3+i%4)+'s';d.appendChild(s)}}
W.VelosSplashTheme=theme;
function show(){if(document.getElementById('vsp'))return;if(!document.getElementById('vsps')){var s=document.createElement('style');s.id='vsps';s.textContent=CSS;(document.head||document.documentElement).appendChild(s)}
 var d=document.createElement('div');d.id='vsp';d.innerHTML='<div class="ry"></div><div class="st"><div class="or"><i></i><i></i><i></i><i></i></div><div class="lg"><img src="logo-mark.png" alt="The Velos Group"></div></div><b style="animation-delay:.35s">Anything.</b><b style="animation-delay:.6s">Anywhere.</b><b style="animation-delay:.85s"><i>Precisely.</i></b><small>THE VELOS GROUP</small>';
 document.documentElement.appendChild(d);
 try{var c=JSON.parse(localStorage.v_season||'null');var n=new Date().toISOString().slice(0,10);if(c&&c.day===n)theme(c.S)}catch(e){}
 setTimeout(function(){d.style.opacity=0;setTimeout(function(){d.remove();W.dispatchEvent(new Event('velos-splash-done'))},450)},2300)}
var back=false;try{var nv=performance.getEntriesByType('navigation')[0];back=!!(nv&&nv.type==='back_forward')}catch(e){}
var fresh=true;try{if(sessionStorage.v_sp)fresh=false;sessionStorage.v_sp=1}catch(e){}
if(fresh&&!back)show();
document.addEventListener('visibilitychange',function(){if(document.hidden)hid=Date.now();else if(hid&&Date.now()-hid>180000){hid=0;show()}});
})();

/* Velos speed helper: load images only when they are about to be seen */
(function(){var D=document;function f(i){if(!i.getAttribute('loading')&&!i.closest('#vsp')){var r=i.getBoundingClientRect();if(r.top>(innerHeight||800)*1.2)i.setAttribute('loading','lazy');}if(!i.getAttribute('decoding'))i.setAttribute('decoding','async');}
function all(){var l=D.images;for(var k=0;k<l.length;k++)f(l[k]);}
try{new MutationObserver(function(m){for(var a=0;a<m.length;a++)for(var n=0;n<m[a].addedNodes.length;n++){var e=m[a].addedNodes[n];if(e.nodeType!==1)continue;if(e.tagName==='IMG')f(e);else if(e.querySelectorAll){var q=e.querySelectorAll('img');for(var k=0;k<q.length;k++)f(q[k]);}}}).observe(D.documentElement,{childList:true,subtree:true});}catch(x){}
D.addEventListener('DOMContentLoaded',all);})();
