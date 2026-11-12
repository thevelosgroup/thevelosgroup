/* Velos daily summary: once a day, a friendly card (and a phone notification if allowed) with yesterday's results.
   Used by the Restaurant, Agent and Partner apps. Needs SQL 54. */
(function(W, D){
  if(W.VelosDaily) return;
  function ugx(n){ return 'UGX ' + Math.round(Number(n) || 0).toLocaleString('en-US'); }
  function today(){ try { return new Date().toLocaleDateString('en-CA', {timeZone:'Africa/Kampala'}); } catch(e){ return new Date().toISOString().slice(0, 10); } }
  function hour(){ try { return +new Date().toLocaleString('en-GB', {timeZone:'Africa/Kampala', hour:'2-digit', hour12:false}); } catch(e){ return new Date().getHours(); } }
  function lines(s){ var L = [];
    if(s.restaurant){ var r = s.restaurant; L.push('Orders delivered: ' + r.delivered + (r.cancelled ? ' (' + r.cancelled + ' cancelled)' : ''), 'Your sales: ' + ugx(r.value)); if(r.open_now) L.push(r.open_now + ' order' + (r.open_now > 1 ? 's' : '') + ' open right now'); }
    if(s.partner){ var p = s.partner; L.push('Orders delivered: ' + p.delivered, 'Your sales: ' + ugx(p.value)); if(p.open_now) L.push(p.open_now + ' order' + (p.open_now > 1 ? 's' : '') + ' still to finish'); }
    if(s.agent){ var a = s.agent; L.push('Sales completed: ' + a.sales + ' (' + ugx(a.revenue) + ')', 'Commission earned: ' + ugx(a.commission)); if(a.business_orders) L.push('Orders from your businesses: ' + a.business_orders); if(a.leads_waiting) L.push(a.leads_waiting + ' lead' + (a.leads_waiting > 1 ? 's' : '') + ' waiting for approval'); }
    return L; }
  function card(s, L){ if(D.getElementById('vdy')) return; var c = D.createElement('div'); c.id = 'vdy'; c.setAttribute('data-nolang', '1');
    c.style.cssText = 'position:fixed;left:12px;right:12px;top:calc(12px + env(safe-area-inset-top));z-index:99980;max-width:520px;margin:0 auto;background:linear-gradient(135deg,#0b2a7a,#03113e);color:#f4f1ea;border:1px solid #e8c766;border-radius:18px;padding:16px 18px;font:15px/1.5 system-ui,sans-serif;box-shadow:0 14px 34px rgba(0,0,0,.45)';
    c.innerHTML = '<button aria-label="Close" style="position:absolute;right:10px;top:8px;border:0;background:transparent;color:#fff;font-size:20px;cursor:pointer">✕</button><div style="font:700 12px system-ui;letter-spacing:2px;color:#f1d98a">YESTERDAY · ' + s.day.toUpperCase() + '</div><div style="font:700 19px Georgia,serif;margin:4px 0 8px">Good ' + (hour() < 12 ? 'morning' : 'day') + '! Here is how you did.</div>' + L.map(function(x){ return '<div>• ' + x + '</div>'; }).join('');
    c.querySelector('button').onclick = function(){ c.remove(); }; D.body.appendChild(c); setTimeout(function(){ if(c.parentNode) c.remove(); }, 20000); }
  function note(L){ try { if(!('Notification' in W) || Notification.permission !== 'granted' || !navigator.serviceWorker) return; navigator.serviceWorker.ready.then(function(r){ r.showNotification('Your Velos summary for yesterday', {body: L.join(' · '), icon:'icon-192.png', tag:'velos-daily'}); }); } catch(e){} }
  function run(){ var db = W.db; if(!db || !db.rpc) return false; var key = 'vdy_' + today(); try { if(localStorage.getItem(key)) return true; } catch(e){} if(hour() < 6) return true;
    db.auth.getSession().then(function(r){ if(!r || !r.data || !r.data.session) return; return db.rpc('my_daily_summary').then(function(x){ var s = x && x.data; if(!s) return; var L = lines(s); if(!L.length) return; try { localStorage.setItem(key, '1'); } catch(e){} card(s, L); note(L); }); }).catch(function(){}); return true; }
  W.VelosDaily = {run:run};
  var tries = 0, t = setInterval(function(){ tries++; if(tries > 12){ clearInterval(t); return; } var s = null; try { s = W.db && W.db.auth ? 1 : null; } catch(e){} if(s){ clearInterval(t); setTimeout(run, 2500); } }, 1000);
})(window, document);
