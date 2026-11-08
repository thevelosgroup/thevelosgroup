/* Velos feedback: asks "How was your experience?" after someone has browsed for a while or placed an order.
   4 and 5 stars are invited to review Velos on Google; 1 to 3 stars are asked what went wrong and can leave a number so the team can reply.
   Everything is stored in the admin under Customer feedback. People are asked rarely: at most once a week (once every 2 days after an order). */
(function(W, D){
  if(W.__vfb) return; W.__vfb = 1;
  if(/\/(admin|rider|agent|partner|vendor|restaurant|team|reset)\.html$/.test(location.pathname)) return;
  var LS = function(k, v){ try { if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch(e){} return null; };
  var SS = function(k, v){ try { if(v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch(e){} return null; };
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var pv = (+SS('vfb_pv') || 0) + 1; SS('vfb_pv', pv); if(!SS('vfb_t0')) SS('vfb_t0', Date.now());
  var shown = false, state = {rating:0, ctx:'browse', sent:false};

  var CSS = '#vfb{position:fixed;left:12px;bottom:calc(86px + env(safe-area-inset-bottom));z-index:2147482500;width:min(360px,calc(100vw - 24px));background:#0b1226;color:#f4f1ea;border:1px solid #2f3c74;border-radius:20px;box-shadow:0 18px 50px rgba(0,0,0,.55);padding:16px 16px 14px;font:14.5px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;animation:vfbu .35s ease-out}@keyframes vfbu{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}'
  + '@media(min-width:700px){#vfb{bottom:calc(22px + env(safe-area-inset-bottom));left:18px}}'
  + '#vfb h3{margin:0 24px 2px 0;font:600 20px Georgia,serif;color:#e8c766}#vfb p{margin:2px 0 10px;color:#b7c1e3;font-size:13.5px}#vfb .x{position:absolute;right:10px;top:8px;background:none;border:0;color:#9fb0e0;font-size:22px;cursor:pointer;line-height:1}'
  + '#vfb .st{display:flex;gap:4px;justify-content:center;margin:6px 0 8px}#vfb .st button{background:none;border:0;font-size:38px;line-height:1;color:#3b4676;cursor:pointer;padding:0 2px;transition:transform .1s,color .1s}#vfb .st button.on{color:#f3c74a}#vfb .st button:hover{transform:scale(1.15)}'
  + '#vfb textarea,#vfb input{width:100%;box-sizing:border-box;background:#0a1130;color:#f4f1ea;border:1px solid #2a3866;border-radius:12px;padding:10px 12px;font:15px system-ui;margin:0 0 8px}#vfb textarea{min-height:76px;resize:vertical}'
  + '#vfb .b{display:flex;gap:8px;flex-wrap:wrap}#vfb .b button,#vfb .b a{flex:1 1 130px;text-align:center;border:0;border-radius:99px;padding:12px 14px;font:700 14.5px system-ui;cursor:pointer;text-decoration:none}#vfb .p{background:#e8c766;color:#080d1f}#vfb .g{background:#fff;color:#14192b}#vfb .s{background:transparent;color:#9fb0e0;border:1px solid #33406f!important}'
  + '#vfb .lb{display:flex;justify-content:space-between;color:#7f8bb5;font-size:11px;letter-spacing:.06em;text-transform:uppercase;margin:-4px 8px 8px}';
  var st = D.createElement('style'); st.textContent = CSS; (D.head || D.documentElement).appendChild(st);

  function cfg(){ return W.VELOS_SITE || {}; }
  function reviewUrl(){ return cfg().googleReviewUrl || 'https://www.google.com/search?q=' + encodeURIComponent('The Velos Group Kampala reviews'); }
  function sb(){ return new Promise(function(ok){ if(W.VELOS_SUPABASE) return ok(W.VELOS_SUPABASE); var s = D.createElement('script'); s.src = 'supabase-config.js'; s.onload = function(){ ok(W.VELOS_SUPABASE); }; s.onerror = function(){ ok(null); }; D.body.appendChild(s); }); }
  function send(msg, name, phone){ if(state.sent || !state.rating) return Promise.resolve(); state.sent = true;
    return sb().then(function(S){ if(!S) return; var ref = ''; try { ref = new URLSearchParams(location.search).get('ref') || ''; } catch(e){}
      return fetch(S.url + '/rest/v1/rpc/submit_site_feedback', {method:'POST', headers:{apikey:S.key, Authorization:'Bearer ' + S.key, 'Content-Type':'application/json'}, body:JSON.stringify({p_rating:state.rating, p_message:msg || null, p_context:state.ctx, p_page:location.pathname + location.search.slice(0, 60), p_ref:ref || null, p_name:name || null, p_phone:phone || null})}).catch(function(){}); }); }
  function close(){ var c = D.getElementById('vfb'); if(c) c.remove(); }
  function cool(days){ LS('vfb_until', String(Date.now() + days * 864e5)); }

  function ask(ctx){ if(shown) return; var until = +LS('vfb_until') || 0; if(Date.now() < until && ctx !== 'force') return;
    if(D.getElementById('vse-sp') || D.getElementById('vsps') || D.getElementById('vsp')) return setTimeout(function(){ ask(ctx); }, 4000);
    var cw = D.getElementById('chatWindow'); if(cw && cw.classList.contains('open')) return setTimeout(function(){ ask(ctx); }, 6000);
    shown = true; state = {rating:0, ctx:ctx === 'force' ? 'manual' : ctx, sent:false};
    var c = D.createElement('div'); c.id = 'vfb'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', 'Rate your experience');
    var head = state.ctx === 'order' ? 'Thank you for your order!' : 'How is your experience?';
    c.innerHTML = '<button class="x" aria-label="Close">×</button><h3>' + head + '</h3><p>Tap a star. Your honest feedback helps us improve Velos.</p><div class="st">' + [1, 2, 3, 4, 5].map(function(n){ return '<button type="button" data-n="' + n + '" aria-label="' + n + ' star' + (n > 1 ? 's' : '') + '">★</button>'; }).join('') + '</div><div class="lb"><span>Poor</span><span>Excellent</span></div>';
    D.body.appendChild(c);
    var stars = c.querySelectorAll('.st button');
    var paint = function(n){ stars.forEach(function(b){ b.classList.toggle('on', +b.getAttribute('data-n') <= n); }); };
    stars.forEach(function(b){ b.onmouseenter = function(){ paint(+b.getAttribute('data-n')); }; b.onmouseleave = function(){ paint(state.rating); }; b.onclick = function(){ state.rating = +b.getAttribute('data-n'); paint(state.rating); step2(c); }; });
    c.querySelector('.x').onclick = function(){ send(); cool(state.rating ? 7 : 3); close(); }; }

  function step2(c){ var r = state.rating, happy = r >= 4;
    c.innerHTML = '<button class="x" aria-label="Close">×</button><h3>' + (happy ? 'Thank you! 🎉' : 'We are sorry we missed the mark') + '</h3><p>' + (happy ? 'We are glad you enjoyed Velos. A quick Google review helps other people find a trusted local business.' : 'Please tell us what went wrong. A real person will read it and put it right.') + '</p>'
      + '<textarea id="vfbm" placeholder="' + (happy ? 'Anything we can do even better? (optional)' : 'What happened? How can we improve?') + '"></textarea>'
      + (happy ? '' : '<input id="vfbp" type="tel" placeholder="Your phone or WhatsApp, if you want us to reply (optional)">')
      + '<div class="b">' + (happy ? '<a class="g" id="vfbg" target="_blank" rel="noopener">⭐ Rate us on Google</a>' : '') + '<button class="p" id="vfbs" type="button">' + (happy ? 'Send to Velos' : 'Send feedback') + '</button></div>';
    var val = function(i){ var e = c.querySelector(i); return e ? e.value.trim() : ''; };
    c.querySelector('.x').onclick = function(){ send(val('#vfbm'), '', val('#vfbp')); cool(7); close(); };
    if(happy){ var g = c.querySelector('#vfbg'); g.href = reviewUrl(); g.onclick = function(){ send(val('#vfbm')); cool(60); setTimeout(close, 400); }; }
    c.querySelector('#vfbs').onclick = function(){ send(val('#vfbm'), '', val('#vfbp')); cool(30); c.innerHTML = '<button class="x" aria-label="Close">×</button><h3>Thank you 🙏</h3><p>Your feedback reached the Velos team.</p>'; c.querySelector('.x').onclick = close; setTimeout(close, 2600); }; }

  /* when to ask */
  var iv = setInterval(function(){ var t0 = +SS('vfb_t0') || Date.now(); if(Date.now() - t0 > 75000 && pv >= 3){ clearInterval(iv); ask('browse'); } }, 5000);
  var RE = /Thank you for shopping|Order (placed|received|confirmed)|Booking (received|confirmed|request)|Payment received|Request (received|sent)|Application received/i, queued = false;
  try { new MutationObserver(function(ms){ if(queued) return; for(var i = 0; i < ms.length; i++){ var a = ms[i].addedNodes; for(var j = 0; j < a.length; j++){ var n = a[j]; if(n.nodeType === 1 && n.id !== 'vfb' && (n.textContent || '').length < 5000 && RE.test(n.textContent || '')){ queued = true; var until = +LS('vfb_until') || 0; if(Date.now() < until - 0 && until - Date.now() > 2 * 864e5) return; setTimeout(function(){ ask('order'); }, 6000); return; } } } }).observe(D.body, {childList:true, subtree:true}); } catch(e){}
  /* script for the sheet of Google review link settings */
  var sc = D.createElement('script'); sc.src = 'velos-site-config.js'; sc.onerror = function(){}; D.body.appendChild(sc);
  W.VelosFeedback = {ask:function(c){ ask(c || 'force'); }};
})(window, document);
