/* Velos App Settings: turns every dashboard into a proper installable app with its own Settings screen.
   Install, connection check, sound and volume, vibration, permissions, device storage, offline copy, text size,
   keep-screen-awake and app updates. Free: runs inside the browser, no store needed.
   Used by the Admin, Restaurant, Rider, Agent, Partner and Vendor apps. */
(function(W, D){
  if(W.VelosApp) return;
  var LS = function(k, v){ try { if(v === undefined) return localStorage.getItem(k); if(v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch(e){} return null; };
  var IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var STANDALONE = (function(){ try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch(e){ return false; } })();
  var deferred = null, wake = null;
  addEventListener('beforeinstallprompt', function(e){ deferred = e; });
  addEventListener('appinstalled', function(){ deferred = null; toast('Velos is installed on this device'); });
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function mb(n){ return n >= 1073741824 ? (n / 1073741824).toFixed(1) + ' GB' : (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB'; }
  function toast(t){ var e = D.getElementById('vapt'); if(!e){ e = D.createElement('div'); e.id = 'vapt'; e.setAttribute('data-nolang', '1'); e.style.cssText = 'position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147482000;background:#111;color:#fff;border:1px solid #e8c766;border-radius:99px;padding:10px 16px;font:600 14px system-ui,sans-serif;max-width:90vw;text-align:center'; D.body.appendChild(e); } e.textContent = t; e.style.display = 'block'; clearTimeout(e._t); e._t = setTimeout(function(){ e.style.display = 'none'; }, 2600); }

  /* ---- settings that apply on every page load ---- */
  function applyDisplay(){
    var z = parseFloat(LS('vap_zoom') || '1'); if(!(z >= .8 && z <= 1.4)) z = 1; try { D.body.style.zoom = z === 1 ? '' : String(z); } catch(e){}
    var rm = LS('vap_calm') === '1'; var s = D.getElementById('vap-calm'); if(rm && !s){ s = D.createElement('style'); s.id = 'vap-calm'; s.textContent = '*,*:before,*:after{animation-duration:.001s!important;animation-iteration-count:1!important;transition-duration:.001s!important;scroll-behavior:auto!important}'; D.head.appendChild(s); } else if(!rm && s) s.remove();
    if(LS('vap_awake') === '1') keepAwake(true);
  }
  function keepAwake(on){ try { if(!on){ if(wake){ wake.release(); wake = null; } return; } if(!('wakeLock' in navigator)) return; navigator.wakeLock.request('screen').then(function(l){ wake = l; l.addEventListener('release', function(){ wake = null; }); }).catch(function(){}); } catch(e){} }
  D.addEventListener('visibilitychange', function(){ if(!D.hidden && LS('vap_awake') === '1' && !wake) keepAwake(true); });

  /* ---- sound helpers (shares the same saved choices as the order alarms) ---- */
  var TONES = [['bell','Golden bell'],['chime','Soft chime'],['kaching','Ka-ching (new order)'],['marimba','Marimba'],['door','Doorbell'],['pulse','Urgent pulse']];
  function testSound(){ if(W.VelosAlerts && VelosAlerts.beep){ try { VelosAlerts.beep(); } catch(e){} } else { try { var c = new (W.AudioContext || W.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination); g.gain.value = .3 * parseFloat(LS('va_vol') || '1'); o.start(); o.stop(c.currentTime + .4); } catch(e){} } }

  /* ---- panel ---- */
  var CSS = '#vap{position:fixed;inset:0;z-index:2147481000;background:rgba(2,8,28,.78);display:flex;align-items:flex-end;justify-content:center;font:15px/1.45 system-ui,sans-serif}'
  + '#vap .sh{width:min(640px,100%);max-height:92vh;overflow:auto;background:#0b1226;color:#f4f1ea;border:1px solid #2a3560;border-radius:22px 22px 0 0;padding:0 0 calc(24px + env(safe-area-inset-bottom))}'
  + '@media(min-width:700px){#vap{align-items:center}#vap .sh{border-radius:22px}}'
  + '#vap .hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:#0b1226;border-bottom:1px solid #2a3560}#vap .hd h2{margin:0;font:700 20px Georgia,serif;color:#e8c766}'
  + '#vap .x{border:0;background:#1b2550;color:#fff;border-radius:99px;width:36px;height:36px;font-size:18px;cursor:pointer}'
  + '#vap section{margin:14px 16px 0;background:#111a38;border:1px solid #243061;border-radius:16px;padding:14px 16px}#vap h3{margin:0 0 8px;font-size:16px;color:#f1d98a}'
  + '#vap .r{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid #1d2850}#vap .r:first-of-type{border-top:0}#vap .m{color:#9fb0e6;font-size:13px}'
  + '#vap button.b{border:0;border-radius:10px;background:#e8c766;color:#111;font:700 13px system-ui;padding:9px 13px;cursor:pointer;white-space:nowrap}#vap button.g{background:#1f2b5c;color:#fff}'
  + '#vap .pl{font-size:12px;font-weight:700;border-radius:99px;padding:3px 10px}#vap .ok{background:#16482b;color:#8df0b0}#vap .no{background:#5a1c1c;color:#ffb3ac}#vap .md{background:#4a3d10;color:#f1d98a}'
  + '#vap input[type=range]{width:150px;accent-color:#e8c766}#vap select{background:#1b2550;color:#fff;border:1px solid #2a3560;border-radius:8px;padding:8px}'
  + '#vap .bar{height:8px;border-radius:99px;background:#1b2550;overflow:hidden;margin:6px 0}#vap .bar i{display:block;height:100%;background:#e8c766}'
  + '#vap .sw{position:relative;width:46px;height:26px;flex:none}#vap .sw input{opacity:0;position:absolute;inset:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:1}#vap .sw s{position:absolute;inset:0;border-radius:99px;background:#34407a;transition:.2s}#vap .sw s:after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s}#vap .sw input:checked+s{background:#e8c766}#vap .sw input:checked+s:after{transform:translateX(20px);background:#111}'
  + '#vap-gear{background:#1b2550;color:#e8c766;border:1px solid #2a3560;border-radius:10px;padding:8px 11px;font:700 14px system-ui;cursor:pointer}#vap-gear.fl{position:fixed;right:12px;top:calc(10px + env(safe-area-inset-top));z-index:2147480000;box-shadow:0 4px 14px rgba(0,0,0,.4)}';
  function css(){ if(D.getElementById('vap-css')) return; var s = D.createElement('style'); s.id = 'vap-css'; s.textContent = CSS; D.head.appendChild(s); }
  function sw(id, on){ return '<label class="sw"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><s></s></label>'; }
  function pill(t, c){ return '<span class="pl ' + c + '">' + t + '</span>'; }

  async function permState(name){ try { if(name === 'notifications' && 'Notification' in W && !(navigator.permissions && navigator.permissions.query)) return Notification.permission === 'default' ? 'prompt' : Notification.permission; var r = await navigator.permissions.query({name: name}); return r.state; } catch(e){ if(name === 'notifications' && 'Notification' in W) return Notification.permission === 'default' ? 'prompt' : Notification.permission; return 'unknown'; } }
  function permPill(s){ return s === 'granted' ? pill('Allowed', 'ok') : s === 'denied' ? pill('Blocked', 'no') : s === 'prompt' ? pill('Not asked yet', 'md') : pill('Not supported', 'md'); }

  async function open(){
    css(); close(); var o = D.createElement('div'); o.id = 'vap'; o.setAttribute('data-nolang', '1'); o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'App settings');
    var ps = await Promise.all(['notifications', 'geolocation', 'camera', 'microphone'].map(permState));
    var est = null; try { est = navigator.storage && navigator.storage.estimate ? await navigator.storage.estimate() : null; } catch(e){}
    var persisted = false; try { persisted = navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : false; } catch(e){}
    var cks = []; try { cks = await caches.keys(); } catch(e){}
    var con = navigator.connection || {}, online = navigator.onLine;
    var vol = parseFloat(LS('va_vol') || '1'); if(isNaN(vol)) vol = 1; var tone = LS('va_sound') || 'bell', zoom = parseFloat(LS('vap_zoom') || '1') || 1;
    var ver = (cks.filter(function(k){ return /^velos-v\d+/.test(k); })[0] || 'velos-v?').replace('velos-', '');
    var used = est && est.usage ? est.usage : 0, quota = est && est.quota ? est.quota : 0;
    var inst = STANDALONE ? '<div class="r"><span>Velos is installed on this device</span>' + pill('Installed', 'ok') + '</div>'
      : deferred ? '<div class="r"><span>Install Velos as an app. It opens full screen from your home screen.</span><button class="b" id="vap-inst">Install</button></div>'
      : IOS ? '<div class="m">On iPhone or iPad: tap the Share button in Safari, then <b>Add to Home Screen</b>.</div>'
      : '<div class="m">To install: open the browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</div>';
    o.innerHTML = '<div class="sh"><div class="hd"><h2>⚙ App settings</h2><button class="x" aria-label="Close">✕</button></div>'
    + '<section><h3>Install</h3>' + inst + '</section>'
    + '<section><h3>Internet</h3><div class="r"><span>Connection</span><span id="vap-on">' + (online ? pill('Online', 'ok') : pill('Offline', 'no')) + '</span></div>'
    + '<div class="r"><span>Network</span><span class="m">' + esc((con.effectiveType ? con.effectiveType.toUpperCase() : 'Unknown') + (con.downlink ? ' · about ' + con.downlink + ' Mbps' : '') + (con.saveData ? ' · data saver on' : '')) + '</span></div>'
    + '<div class="r"><span id="vap-pt" class="m">Test how fast Velos responds</span><button class="b g" id="vap-ping">Test</button></div></section>'
    + '<section><h3>Sound and vibration</h3>'
    + '<div class="r"><span>Sound on</span>' + sw('vap-snd', LS('va_mute') !== '1') + '</div>'
    + '<div class="r"><span>Volume</span><input type="range" id="vap-vol" min="10" max="100" step="5" value="' + Math.round(vol * 100) + '" aria-label="Volume"></div>'
    + '<div class="r"><span>Alert tone</span><select id="vap-tone">' + TONES.map(function(t){ return '<option value="' + t[0] + '"' + (t[0] === tone ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></div>'
    + '<div class="r"><span>Vibrate on alerts</span>' + sw('vap-vib', LS('va_vibe') !== '0') + '</div>'
    + '<div class="r"><span class="m">Hear how it sounds</span><button class="b" id="vap-test">▶ Play</button></div></section>'
    + '<section><h3>Permissions</h3>'
    + [['Notifications', 'Alerts for new orders and updates', ps[0], 'vap-p-n'], ['Location', 'Pin and find places, rider tracking', ps[1], 'vap-p-g'], ['Camera', 'Photo proof and scanning', ps[2], 'vap-p-c'], ['Microphone', 'Voice features', ps[3], 'vap-p-m']].map(function(p){ return '<div class="r"><span>' + p[0] + '<br><span class="m">' + p[1] + '</span></span><span>' + permPill(p[2]) + (p[2] === 'prompt' ? ' <button class="b" id="' + p[3] + '">Allow</button>' : '') + '</span></div>'; }).join('')
    + '<div class="m" style="margin-top:6px">If something is blocked, open your browser or phone settings for this app and switch it to Allow.</div></section>'
    + '<section><h3>Device storage</h3>'
    + (quota ? '<div class="m">Velos is using ' + mb(used) + ' of ' + mb(quota) + ' available</div><div class="bar"><i style="width:' + Math.max(1, Math.min(100, used / quota * 100)) + '%"></i></div>' : '<div class="m">Storage details are not available on this device.</div>')
    + '<div class="r"><span>Keep my data on this device<br><span class="m">Stops the phone from clearing Velos when space is low</span></span><span>' + (persisted ? pill('On', 'ok') : '<button class="b" id="vap-per">Turn on</button>') + '</span></div>'
    + '<div class="r"><span>Use offline<br><span class="m">Save this app on the device so it opens without internet</span></span><button class="b" id="vap-off">Save</button></div>'
    + '<div class="r"><span>Free up space<br><span class="m">Clears saved pictures and files. You stay signed in.</span></span><button class="b g" id="vap-clr">Clear</button></div></section>'
    + '<section><h3>Display</h3>'
    + '<div class="r"><span>Text size</span><input type="range" id="vap-zoom" min="85" max="135" step="5" value="' + Math.round(zoom * 100) + '" aria-label="Text size"></div>'
    + '<div class="r"><span>Keep screen awake<br><span class="m">Handy while waiting for orders</span></span>' + sw('vap-awk', LS('vap_awake') === '1' && 'wakeLock' in navigator) + '</div>'
    + '<div class="r"><span>Calmer screen<br><span class="m">Fewer moving effects</span></span>' + sw('vap-calm', LS('vap_calm') === '1') + '</div></section>'
    + '<section><h3>About this app</h3><div class="r"><span>Version</span><span class="m">' + esc(ver) + '</span></div>'
    + '<div class="r"><span>Latest version</span><button class="b" id="vap-upd">Update now</button></div>'
    + '<div class="r"><span>Language</span><span class="m">' + esc(W.VelosLang ? ({en:'English', lg:'Luganda', sw:'Kiswahili'})[VelosLang.get()] : 'English') + '</span></div>'
    + '<div class="m" style="margin-top:8px">The Velos Group · Anything. Anywhere. Precisely.</div></section></div>';
    D.body.appendChild(o);
    var $ = function(i){ return D.getElementById(i); }, on = function(i, ev, fn){ var e = $(i); if(e) e.addEventListener(ev, fn); };
    o.querySelector('.x').onclick = close; o.addEventListener('click', function(e){ if(e.target === o) close(); });
    on('vap-inst', 'click', function(){ if(deferred){ deferred.prompt(); deferred.userChoice && deferred.userChoice.then(function(){ deferred = null; open(); }); } });
    on('vap-ping', 'click', async function(){ var p = $('vap-pt'); p.textContent = 'Testing…'; var t = performance.now(); try { var S = W.VELOS_SUPABASE; await fetch((S && S.url ? S.url + '/rest/v1/' : location.origin + '/favicon.png') + '?t=' + Date.now(), {method:'GET', headers: S && S.key ? {apikey:S.key} : {}, cache:'no-store'}); var ms = Math.round(performance.now() - t); p.textContent = ms + ' ms · ' + (ms < 400 ? 'fast' : ms < 1200 ? 'okay' : 'slow connection'); } catch(e){ p.textContent = 'Could not reach Velos. Check your internet.'; } });
    on('vap-snd', 'change', function(e){ LS('va_mute', e.target.checked ? null : '1'); });
    on('vap-vol', 'input', function(e){ LS('va_vol', String(e.target.value / 100)); });
    on('vap-vol', 'change', testSound);
    on('vap-tone', 'change', function(e){ LS('va_sound', e.target.value); testSound(); });
    on('vap-vib', 'change', function(e){ LS('va_vibe', e.target.checked ? null : '0'); if(e.target.checked && navigator.vibrate) navigator.vibrate(200); });
    on('vap-test', 'click', testSound);
    on('vap-p-n', 'click', function(){ (W.VelosPWA && VelosPWA.ask ? VelosPWA.ask() : Notification.requestPermission()).then(function(){ open(); }); });
    on('vap-p-g', 'click', function(){ navigator.geolocation.getCurrentPosition(function(){ open(); }, function(){ open(); }); });
    on('vap-p-c', 'click', function(){ navigator.mediaDevices.getUserMedia({video:true}).then(function(s){ s.getTracks().forEach(function(t){ t.stop(); }); open(); }).catch(function(){ open(); }); });
    on('vap-p-m', 'click', function(){ navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){ s.getTracks().forEach(function(t){ t.stop(); }); open(); }).catch(function(){ open(); }); });
    on('vap-per', 'click', function(){ navigator.storage.persist().then(function(ok){ toast(ok ? 'Done. Velos will keep its data on this device.' : 'Your browser decided not to. Installing the app usually helps.'); open(); }); });
    on('vap-off', 'click', async function(e){ e.target.textContent = 'Saving…'; try { var names = await caches.keys(), cn = names.filter(function(k){ return /^velos-v\d+/.test(k); })[0] || 'velos-offline', c = await caches.open(cn), urls = [location.href.split('#')[0]]; [].forEach.call(D.querySelectorAll('script[src],link[rel=stylesheet],link[rel=manifest],link[rel=icon],img[src]'), function(n){ var u = n.src || n.href; if(u && u.indexOf(location.origin) === 0) urls.push(u); }); ['logo.png','logo-mark.png','icon-192.png','index.html'].forEach(function(f){ urls.push(location.origin + '/' + f); }); var n = 0; await Promise.all(Array.from(new Set(urls)).map(function(u){ return fetch(u).then(function(r){ if(r.ok){ n++; return c.put(u, r); } }).catch(function(){}); })); toast('Saved ' + n + ' files for offline use'); } catch(x){ toast('Could not save for offline use'); } e.target.textContent = 'Save'; });
    on('vap-clr', 'click', async function(){ if(!confirm('Clear saved pictures and files? You will stay signed in.')) return; try { var ks = await caches.keys(); await Promise.all(ks.filter(function(k){ return /^velos-img/.test(k); }).map(function(k){ return caches.delete(k); })); toast('Space freed'); open(); } catch(e){ toast('Could not clear'); } });
    on('vap-zoom', 'input', function(e){ LS('vap_zoom', String(e.target.value / 100)); applyDisplay(); });
    on('vap-awk', 'change', function(e){ if(!('wakeLock' in navigator)){ e.target.checked = false; return toast('This device does not support it'); } LS('vap_awake', e.target.checked ? '1' : null); keepAwake(e.target.checked); });
    on('vap-calm', 'change', function(e){ LS('vap_calm', e.target.checked ? '1' : null); applyDisplay(); });
    on('vap-upd', 'click', async function(e){ e.target.textContent = 'Checking…'; try { var r = await navigator.serviceWorker.getRegistration(); if(r) await r.update(); var ks = await caches.keys(); await Promise.all(ks.filter(function(k){ return /^velos-v\d+/.test(k); }).map(function(k){ return caches.delete(k); })); } catch(x){} location.reload(); });
    W.addEventListener('online', refreshNet); W.addEventListener('offline', refreshNet);
  }
  function refreshNet(){ var e = D.getElementById('vap-on'); if(e) e.innerHTML = navigator.onLine ? pill('Online', 'ok') : pill('Offline', 'no'); }
  function close(){ var o = D.getElementById('vap'); if(o) o.remove(); }

  /* ---- the gear button ---- */
  function gear(){ if(D.getElementById('vap-gear')) return; css(); var b = D.createElement('button'); b.id = 'vap-gear'; b.type = 'button'; b.setAttribute('aria-label', 'App settings'); b.setAttribute('data-nolang', '1'); b.textContent = '⚙'; b.onclick = open;
    var r = D.querySelector('#vs-top .r'); if(r){ r.insertBefore(b, r.firstChild); } else { b.className = 'fl'; D.body.appendChild(b); } }
  function boot(){ applyDisplay(); gear(); var tries = 0, t = setInterval(function(){ tries++; var g = D.getElementById('vap-gear'), r = D.querySelector('#vs-top .r'); if(g && g.className === 'fl' && r){ g.remove(); gear(); } if(!g) gear(); if(tries > 40) clearInterval(t); }, 500); }
  W.VelosApp = {open:open, close:close, toast:toast};
  if(D.body) boot(); else D.addEventListener('DOMContentLoaded', boot);
})(window, document);
