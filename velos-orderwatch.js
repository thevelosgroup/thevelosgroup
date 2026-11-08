/* Velos order watch: if a store, restaurant or hotel has asked this customer to approve a change, show a clear banner on every page. */
(function(W, D){
  if(W.__vow) return; W.__vow = 1;
  if(/\/(admin|rider|agent|partner|vendor|restaurant|team|reset|order-change)\.html$/.test(location.pathname)) return;
  var LS = function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } };
  function phones(){ var out = [], add = function(p){ p = String(p || '').replace(/\D/g, ''); if(p.length >= 7 && out.indexOf(p) < 0) out.push(p); };
    ['velos_cust', 'velosContact', 'velosLastBooking'].forEach(function(k){ try { var j = JSON.parse(LS(k) || '{}'); add(j.p || j.phone); } catch(e){} }); add(LS('velos_ph')); return out; }
  function cfg(){ return W.VELOS_SUPABASE; }
  function load(){ return new Promise(function(ok){ if(cfg()) return ok(cfg()); var s = D.createElement('script'); s.src = 'supabase-config.js'; s.onload = function(){ ok(cfg()); }; s.onerror = function(){ ok(null); }; D.body.appendChild(s); }); }
  var KN = {food:'food order', partner:'order', booking:'table booking'};
  function show(list){ var old = D.getElementById('vow'); if(old) old.remove(); if(!list.length) return;
    var c = list[0], more = list.length > 1 ? ' (+' + (list.length - 1) + ' more)' : '';
    var el = D.createElement('a'); el.id = 'vow'; el.href = 'order-change.html?k=' + encodeURIComponent(c.kind) + '&o=' + c.order_no;
    el.style.cssText = 'position:fixed;left:10px;right:10px;top:calc(8px + env(safe-area-inset-top));z-index:2147482000;display:flex;align-items:center;gap:10px;background:#3a2a08;border:1px solid #e8c766;color:#ffe9b0;border-radius:16px;padding:12px 14px;text-decoration:none;font:600 14.5px/1.35 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5);max-width:620px;margin:0 auto';
    el.innerHTML = '<span style="font-size:22px">🔔</span><span style="flex:1"><b style="color:#fff">' + String(c.store || 'A store').replace(/[<>&]/g, '') + ' needs your answer</b><br><span style="font-weight:400">About your ' + (KN[c.kind] || 'order') + ' #' + c.order_no + '. Tap to review and accept or cancel.' + more + '</span></span><span style="background:#e8c766;color:#080d1f;border-radius:99px;padding:8px 14px;font-weight:700">Review</span>';
    D.body.appendChild(el); }
  function check(){ var ps = phones(); if(!ps.length) return; load().then(function(S){ if(!S) return; var all = [], n = 0;
    ps.slice(0, 3).forEach(function(p){ fetch(S.url + '/rest/v1/rpc/my_pending_changes', {method:'POST', headers:{apikey:S.key, Authorization:'Bearer ' + S.key, 'Content-Type':'application/json'}, body:JSON.stringify({p_phone:p})})
      .then(function(r){ return r.ok ? r.json() : []; }).catch(function(){ return []; }).then(function(j){ all = all.concat(j || []); if(++n === Math.min(ps.length, 3)) show(all); }); }); }); }
  setTimeout(check, 1500); setInterval(check, 45000);
  D.addEventListener('visibilitychange', function(){ if(!D.hidden) check(); });
})(window, document);
