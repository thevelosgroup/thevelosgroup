(function(){var W=window,S=W.VELOS_SUPABASE,ld=null;
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function food(){if(ld)return ld;S=W.VELOS_SUPABASE;ld=!S?Promise.resolve([]):fetch(S.url+'/rest/v1/rpc/food_menu',{method:'POST',headers:{apikey:S.key,'Content-Type':'application/json'},body:'{}'}).then(function(r){return r.json()}).then(function(m){var a=[];((m&&m.vendors)||[]).forEach(function(v){v.categories.forEach(function(c){c.items.forEach(function(i){a.push({n:i.name,v:v.name,s:v.slug,p:i.price})})})});return a}).catch(function(){return[]});return ld}
function addFood(v){var q=String(v||'').trim().toLowerCase(),box=document.getElementById('searchResults');if(!box)return;var old=document.getElementById('vsf');if(old)old.remove();if(q.length<2)return;
 food().then(function(list){var m=list.filter(function(i){return(i.n+' '+i.v).toLowerCase().indexOf(q)>-1}).slice(0,6);var cur=document.getElementById('vsf');if(cur)cur.remove();if(!m.length)return;
  var d=document.createElement('div');d.id='vsf';d.style.cssText='padding:10px 14px;border-top:1px solid rgba(212,175,55,.22)';
  d.innerHTML='<div style="color:#e8c766;font-weight:700;margin-bottom:6px">🍽️ Velos Foods</div>'+m.map(function(i){return'<a href="foods.html?v='+encodeURIComponent(i.s)+'&q='+encodeURIComponent(i.n)+'" style="display:block;padding:7px 0;color:inherit">'+esc(i.n)+' <span style="opacity:.7">· '+esc(i.v)+(i.p?' · UGX '+Math.round(i.p).toLocaleString('en-US'):'')+'</span></a>'}).join('');box.appendChild(d)})}
function wrap(){var o=W.runSiteSearch;if(!o||o._w)return false;W.runSiteSearch=function(v){var r=o.apply(this,arguments);try{addFood(v)}catch(e){}return r};W.runSiteSearch._w=1;return true}
function bar(){if(!document.body||document.body.getAttribute('data-page')!=='home'||document.getElementById('vhs'))return;var h=document.querySelector('.hero');if(!h)return;
 var d=document.createElement('div');d.id='vhs';d.style.cssText='padding:14px 16px 0;background:var(--navy-0,#080d1f)';
 d.innerHTML='<input id="vhi" type="search" placeholder="🔍 Search products, services, foods…" aria-label="Search the website" style="display:block;width:100%;max-width:680px;margin:0 auto;padding:14px 18px;border-radius:999px;border:1px solid #e8c766;background:rgba(255,255,255,.06);color:#fff;font:16px system-ui;outline:0">';
 h.parentNode.insertBefore(d,h);var i=document.getElementById('vhi');
 i.addEventListener('focus',function(){var t=i.value;if(typeof toggleSearch==='function')toggleSearch(true);setTimeout(function(){var s=document.getElementById('searchInput');if(s){s.focus();if(t){s.value=t;if(typeof runSiteSearch==='function')runSiteSearch(t)}}i.blur();i.value=''},60)})}
function init(){bar();if(!wrap()){var n=0,t=setInterval(function(){if(wrap()||++n>20)clearInterval(t)},300)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
