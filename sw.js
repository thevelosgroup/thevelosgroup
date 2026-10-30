const V='velos-v18',IMG='velos-img-v1',SHELL=['./foods.css','./supabase-config.js','./icon-192.png','./logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function trim(n,max){const c=await caches.open(n),k=await c.keys();if(k.length>max)for(let i=0;i<k.length-max;i++)await c.delete(k[i])}
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 if(u.hostname.endsWith('supabase.co')){
  if(u.pathname.indexOf('/storage/v1/object/public/')>-1){e.respondWith(caches.open(IMG).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){c.put(r,x.clone());trim(IMG,200)}return x}))))}
  return}
 if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{const f=fetch(r).then(x=>{if(x.ok||x.type==='opaque')c.put(r,x.clone());return x}).catch(()=>m);return m||f})));return}
 const ok=u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'||u.hostname==='cdnjs.cloudflare.com';if(!ok)return;
 e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(_){}const hi=d.kind==='vendor'||d.kind==='rider'||d.kind==='admin';e.waitUntil(self.registration.showNotification(d.title||'Velos',{body:d.body||'You have a new update',icon:'icon-192.png',badge:'icon-192.png',vibrate:hi?[300,150,300,150,600]:[200,100,200],tag:(d.kind||'velos')+':'+(d.title||''),renotify:true,requireInteraction:!!hi,data:{url:d.url||'./'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=(e.notification.data&&e.notification.data.url)||'./';e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus'in c){try{if('navigate'in c&&u&&u!=='./'&&c.url.indexOf(u.split('?')[0])<0)c.navigate(u)}catch(_){}return c.focus()}}return clients.openWindow(u)}))});
