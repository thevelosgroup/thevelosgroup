/* Velos background alerts (Web Push). Works on Android, Windows, Mac and iPhone/iPad (iOS 16.4+, installed app). */
(function(){ var W = window, D = document; function SB(){ return W.VELOS_SUPABASE || {}; }
  var UA = navigator.userAgent, IOS = /iphone|ipad|ipod/i.test(UA) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function standalone(){ try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch(e){ return false; } }
  function supported(){ return 'serviceWorker' in navigator && 'PushManager' in W && 'Notification' in W; }
  function u8(b64){ var p = '='.repeat((4 - b64.length % 4) % 4), s = (b64 + p).replace(/-/g, '+').replace(/_/g, '/'), r = atob(s), a = new Uint8Array(r.length); for(var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i); return a; }
  function rpc(n, b){ return fetch(SB().url + '/rest/v1/rpc/' + n, {method:'POST', headers:{apikey:SB().key, 'Content-Type':'application/json'}, body:JSON.stringify(b || {})}).then(function(r){ return r.json().then(function(j){ if(!r.ok) throw new Error(j.message || 'Request failed'); return j; }); }); }
  function getKey(){ return rpc('push_public_key').catch(function(){ return null; }); }
  function subscribe(key){ return navigator.serviceWorker.ready.then(function(reg){ return reg.pushManager.getSubscription().then(function(s){ return s || reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:u8(key)}); }); }); }
  function parts(sub){ var j = sub.toJSON(); return {e:j.endpoint, p:j.keys.p256dh, a:j.keys.auth}; }
  function say(m, bad){ var t = D.getElementById('toast'); if(t && t.hidden !== undefined){ t.textContent = m; t.hidden = false; t.style.background = bad ? '#b3261e' : ''; setTimeout(function(){ t.hidden = true; }, 3500); } else if(W.VelosAlerts && VelosAlerts.toast) VelosAlerts.toast(m); else alert(m); }
  function chip(html, onclick, id){ var old = D.getElementById('vpush'); if(old) old.remove(); if(!html) return; var c = D.createElement('div'); c.id = 'vpush';
    c.style.cssText = 'position:fixed;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top));z-index:9990;background:#0f1730;border:1px solid #e8c766;color:#f4f1ea;border-radius:12px;padding:10px 12px;font:14px -apple-system,system-ui;display:flex;gap:10px;align-items:center;justify-content:space-between;box-shadow:0 6px 24px rgba(0,0,0,.4)';
    c.innerHTML = '<span>' + html + '</span><span style="white-space:nowrap">' + (onclick ? '<button id="vpgo" style="background:#e8c766;color:#080d1a;border:0;border-radius:8px;padding:8px 12px;font-weight:700">Turn on</button> ' : '') + '<button id="vpno" style="background:none;border:0;color:#a3adc6;font-size:18px">✕</button></span>';
    D.body.appendChild(c); D.getElementById('vpno').onclick = function(){ c.remove(); try { localStorage.vpushNo = String(Date.now()); } catch(e){} };
    if(onclick) D.getElementById('vpgo').onclick = onclick; }
  function snoozed(){ try { return Date.now() - Number(localStorage.vpushNo || 0) < 864e5; } catch(e){ return false; } }

  /* Staff, restaurant and rider apps: call VelosPush.mount(db) once the person is signed in */
  function mount(db){
    if(snoozed() && !(W.Notification && Notification.permission === 'granted')) return;
    if(!supported()){ if(IOS && !standalone()) chip('To get alerts when the app is closed: tap Share, then <b>Add to Home Screen</b>, open the Velos app from your home screen and sign in again.'); return; }
    getKey().then(function(key){
      if(!key){
        db.rpc('is_manager').then(function(r){ if(r.data === true && !snoozed()) chip('One-time setup: turn on background alerts for Velos.', function(){ init(db); }); });
        return; }
      if(Notification.permission === 'granted'){ subscribe(key).then(function(s){ var x = parts(s); return db.rpc('push_subscribe', {p_endpoint:x.e, p_p256dh:x.p, p_auth:x.a, p_ua:UA.slice(0, 150)}); }).catch(function(){}); return; }
      if(Notification.permission === 'denied'){ return; }
      if(snoozed()) return;
      chip('Get alerts even when the app is closed.', function(){ enable(db, key); }); });
  }
  function enable(db, key){
    Notification.requestPermission().then(function(p){
      if(p !== 'granted'){ chip('Alerts are blocked. Open your phone or browser settings for this app and allow notifications.'); return; }
      return subscribe(key).then(function(s){ var x = parts(s); return db.rpc('push_subscribe', {p_endpoint:x.e, p_p256dh:x.p, p_auth:x.a, p_ua:UA.slice(0, 150)}); }).then(function(r){ if(r.error) throw r.error; chip(''); say('Background alerts are ON ✓'); try { VelosPWA.notify('Velos alerts are on', 'You will now get alerts even when the app is closed.'); } catch(e){} }); }).catch(function(e){ say(e.message || 'Could not turn on alerts', true); }); }
  function init(db){
    db.auth.getSession().then(function(r){ var tok = r.data.session && r.data.session.access_token; if(!tok) return say('Please sign in again.', true);
      fetch(SB().url + '/functions/v1/velos-push?init=1', {method:'POST', headers:{Authorization:'Bearer ' + tok, apikey:SB().key}}).then(function(x){ return x.json().then(function(j){ if(!x.ok) throw new Error(j.error || 'The velos-push function is not deployed yet.'); return j; }); })
        .then(function(){ say('Set up ✓. Now turn on alerts on this phone.'); chip(''); mount(db); }).catch(function(e){ say(e.message, true); }); }); }

  /* Customers: after an order or booking, offer updates on this phone. kind = food | shop | booking */
  function enableCustomer(phone, kind, no){
    if(!supported()) return Promise.reject(new Error(IOS && !standalone() ? 'On iPhone: tap Share, then Add to Home Screen, open the Velos app from your home screen, then try again.' : 'This browser cannot receive background alerts.'));
    return getKey().then(function(key){ if(!key) throw new Error('Alerts are not switched on yet.');
      return Notification.requestPermission().then(function(p){ if(p !== 'granted') throw new Error('Alerts are blocked in your browser settings.');
        return subscribe(key).then(function(s){ var x = parts(s); return rpc('push_subscribe_customer', {p_endpoint:x.e, p_p256dh:x.p, p_auth:x.a, p_phone:phone, p_kind:kind, p_no:Number(no)}); }); }); }); }
  /* Small button to drop into a "thank you" screen */
  function custBtn(phone, kind, no, cls){ return '<button class="' + (cls || 'g full') + '" id="vpc" onclick="VelosPush.cust(\'' + String(phone).replace(/[^0-9+]/g, '') + '\',\'' + kind + '\',' + Number(no) + ')">🔔 Get updates on this phone</button>'; }
  function cust(phone, kind, no){ var b = D.getElementById('vpc'); if(b){ b.disabled = true; b.textContent = 'Turning on…'; }
    enableCustomer(phone, kind, no).then(function(){ if(b){ b.textContent = '🔔 Updates are ON ✓'; } }).catch(function(e){ if(b){ b.disabled = false; b.textContent = '🔔 Get updates on this phone'; } alert(e.message); }); }
  W.VelosPush = {supported:supported, mount:mount, enableCustomer:enableCustomer, custBtn:custBtn, cust:cust};
})();
