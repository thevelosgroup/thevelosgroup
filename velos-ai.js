/* Velos Assistant, everywhere: a clear "Ask Velos" card on every public page, a menu entry, and a card on the landing page.
   It replaces the old small chat bubble and uses the same brain (velos-assistant.js), so answers stay consistent.
   Add one line to a page to get it:  <script src="velos-ai.js" defer></script> */
(function(){ var D = document, W = window;
  if(W.__velosAI) return; W.__velosAI = 1;
  var CSS = ''
  + '#vaL{position:fixed;right:14px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:2147482000;display:flex;align-items:center;gap:10px;border:0;cursor:pointer;padding:8px 18px 8px 8px;border-radius:99px;background:linear-gradient(135deg,#f3d981,#e8c766 55%,#cfa63a);color:#080d1f;font:700 15px/1.1 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.25) inset;transition:transform .15s}'
  + '#vaL:hover{transform:translateY(-2px)}#vaL small{display:block;font:600 11px system-ui;opacity:.75;margin-top:2px;letter-spacing:.02em}'
  + '#vaL .av{width:42px;height:42px;border-radius:50%;background:#080d1f;color:#e8c766;display:flex;align-items:center;justify-content:center;font-size:21px;position:relative;flex:none}'
  + '#vaL .av:after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(232,199,102,.65);animation:vap 2.2s ease-out infinite}@keyframes vap{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.35);opacity:0}}'
  + '#vaL .ai{position:absolute;top:-6px;right:-8px;background:#e8c766;color:#080d1f;border:2px solid #080d1f;border-radius:99px;font:800 9px system-ui;padding:1px 5px;letter-spacing:.06em}'
  + '#vaL.hide{display:none}'
  + '#vaB{position:fixed;right:16px;bottom:calc(86px + env(safe-area-inset-bottom));z-index:2147481999;max-width:240px;background:#fff;color:#14192b;border-radius:16px 16px 4px 16px;padding:11px 14px;font:600 14px/1.35 system-ui;box-shadow:0 10px 30px rgba(0,0,0,.35);display:none}'
  + '#vaB.on{display:block;animation:vai .35s ease-out}@keyframes vai{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}#vaB b{color:#8a6a10}#vaB i{position:absolute;top:2px;right:8px;font-style:normal;cursor:pointer;color:#6a7179;font-size:16px}'
  /* panel */
  + '#chatWindow.vai-win{position:fixed;z-index:2147483000;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));width:min(400px,calc(100vw - 20px));height:min(620px,calc(100vh - 28px));display:none;flex-direction:column;background:#0b1226;color:#f4f1ea;border:1px solid #2a3560;border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.6);overflow:hidden;font:15px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}'
  + '#chatWindow.vai-win.open{display:flex;animation:vai .25s ease-out}'
  + '@media(max-width:560px){#chatWindow.vai-win{right:0;left:0;bottom:0;width:100%;height:88vh;max-height:88vh;border-radius:22px 22px 0 0}}'
  + '#chatWindow .vh{display:flex;align-items:center;gap:11px;padding:13px 14px;background:linear-gradient(135deg,#16224f,#0f1a3d);border-bottom:1px solid #2a3560}'
  + '#chatWindow .vh .av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#f3d981,#cfa63a);color:#080d1f;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}'
  + '#chatWindow .vh b{display:block;font:700 16px system-ui}#chatWindow .vh span{display:flex;align-items:center;gap:6px;font:500 12px system-ui;color:#9fb0e0}#chatWindow .vh span:before{content:"";width:8px;height:8px;border-radius:50%;background:#46c882}'
  + '#chatWindow .vh .sp{flex:1;min-width:0}#chatWindow .vh button{background:rgba(255,255,255,.08);border:0;color:#f4f1ea;width:34px;height:34px;border-radius:50%;font-size:17px;cursor:pointer}#chatWindow .vh button:hover{background:rgba(255,255,255,.16)}'
  + '#chatBody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;gap:9px;background:#0b1226}'
  + '#chatWindow .chat-msg{max-width:88%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.45;word-break:break-word;align-self:flex-start;background:#17224a;color:#eef0f7;border:1px solid #26335f}'
  + '#chatWindow .chat-msg.user{align-self:flex-end;background:#e8c766;color:#080d1f;border-color:#e8c766;border-bottom-right-radius:5px;font-weight:600}'
  + '#chatWindow .chat-msg.bot{border-bottom-left-radius:5px}#chatWindow a.chat-msg{text-decoration:none;color:#e8c766;font-weight:600}#chatWindow a.chat-msg:hover{border-color:#e8c766}'
  + '#chatQuick{display:flex;gap:7px;overflow-x:auto;padding:8px 12px 2px;scrollbar-width:none;background:#0b1226}#chatQuick::-webkit-scrollbar{display:none}'
  + '#chatQuick button{flex:none;border:1px solid #33406f;background:#121c3f;color:#dfe5f7;border-radius:99px;padding:8px 13px;font:600 13px system-ui;cursor:pointer;white-space:nowrap}#chatQuick button:hover{border-color:#e8c766;color:#e8c766}'
  + '#chatWindow .vi{display:flex;gap:8px;padding:10px 12px calc(12px + env(safe-area-inset-bottom));background:#0b1226;border-top:1px solid #1d2850}'
  + '#chatInput{flex:1;min-width:0;border:1px solid #2a3866;background:#0a1130;color:#f4f1ea;border-radius:99px;padding:12px 16px;font:16px system-ui;outline:0}#chatInput:focus{border-color:#e8c766}'
  + '#chatWindow .vi button{border:0;background:#e8c766;color:#080d1f;width:46px;height:46px;border-radius:50%;font-size:19px;font-weight:800;cursor:pointer;flex:none}'
  /* landing card + menu */
  + '.vaC{max-width:1148px;margin:22px auto 6px;padding:0 16px}.vaC>div{display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-radius:26px;padding:20px 22px;background:linear-gradient(120deg,#16224f,#0f1a3d 55%,#2a2260);border:1px solid #2f3c74;box-shadow:0 14px 40px rgba(0,0,0,.35)}'
  + '.vaC .av{width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#f3d981,#cfa63a);color:#080d1f;display:flex;align-items:center;justify-content:center;font-size:28px;flex:none}'
  + '.vaC .tx{flex:1;min-width:220px}.vaC b{display:block;font:600 clamp(20px,3.6vw,28px)/1.15 "Cormorant Garamond",Georgia,serif;color:#f4f1ea}.vaC span{display:block;color:#b7c1e3;font:14px/1.4 system-ui;margin-top:3px}'
  + '.vaC .ch{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.vaC .ch a{color:#dfe5f7;text-decoration:none;border:1px solid #3a4880;background:rgba(255,255,255,.05);padding:7px 13px;border-radius:99px;font:600 13px system-ui;cursor:pointer}.vaC .ch a:hover{border-color:#e8c766;color:#e8c766}'
  + '.vaC button.go{border:0;background:#e8c766;color:#080d1f;font:700 15px system-ui;padding:14px 24px;border-radius:99px;cursor:pointer;white-space:nowrap}'
  + '.vaM{cursor:pointer}';
  var st = D.createElement('style'); st.textContent = CSS; D.head.appendChild(st);

  function ready(fn){ if(D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }
  function hasBrain(){ return !!D.querySelector('script[src*="velos-assistant"]') || W.__vaBrain; }

  ready(function(){
    /* 1. remove the old small chat bubble and window, so there is one assistant everywhere */
    ['chatWindow', 'chatFab'].forEach(function(id){ var e = D.getElementById(id); if(e && e.parentNode) e.parentNode.removeChild(e); });
    D.querySelectorAll('.chat-fab,.chat-window').forEach(function(e){ if(e.parentNode) e.parentNode.removeChild(e); });

    /* 2. our own panel, using the ids the brain expects */
    var w = D.createElement('div'); w.id = 'chatWindow'; w.className = 'vai-win'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Velos Assistant');
    w.innerHTML = '<div class="vh"><div class="av">✨</div><div class="sp"><b>Velos Assistant</b><span>Online · replies instantly</span></div><button type="button" title="Find places near me" aria-label="Near me" onclick="sendChat(\'near me\')">📍</button><button type="button" title="Start over" aria-label="Start over" onclick="vaReset()">↺</button><button type="button" aria-label="Close" onclick="toggleChat(false)">×</button></div>'
      + '<div id="chatBody"></div><div id="chatQuick"></div><div class="vi"><input id="chatInput" placeholder="Ask about products, food, services, places near you…" autocomplete="off" enterkeyhint="send"><button type="button" aria-label="Send" onclick="sendChat()">➤</button></div>';
    D.body.appendChild(w);
    D.getElementById('chatInput').addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); W.sendChat(); } });
    W.vaReset = function(){ var b = D.getElementById('chatBody'); if(b) b.innerHTML = ''; w.dataset.started = ''; try { sessionStorage.removeItem('va_loc'); } catch(e){} W.toggleChat(true); };

    /* 3. the launcher: a clear card with a name, not an anonymous bubble */
    var L = D.createElement('button'); L.id = 'vaL'; L.type = 'button'; L.setAttribute('aria-label', 'Open the Velos Assistant');
    L.innerHTML = '<span class="av">✨<span class="ai">AI</span></span><span>Ask Velos<small>Products · food · services · near you</small></span>';
    var lift = /(^|\/)(foods|marketplace)\.html$/.test(location.pathname); if(lift) L.style.bottom = 'calc(92px + env(safe-area-inset-bottom))';
    D.body.appendChild(L);
    var B = D.createElement('div'); B.id = 'vaB'; B.innerHTML = '<i aria-label="Close">×</i>Hi! I am the <b>Velos Assistant</b>. Ask me anything, or tap <b>near me</b> for ideas around you.'; if(lift) B.style.bottom = 'calc(162px + env(safe-area-inset-bottom))'; D.body.appendChild(B);
    var open = function(){ B.classList.remove('on'); L.classList.add('hide'); if(W.toggleChat) W.toggleChat(true); };
    L.onclick = open; B.onclick = function(e){ if(e.target.tagName === 'I'){ B.classList.remove('on'); try { sessionStorage.setItem('vaB', '1'); } catch(x){} } else open(); };
    try { new MutationObserver(function(){ L.classList.toggle('hide', w.classList.contains('open')); }).observe(w, {attributes:true, attributeFilter:['class']}); } catch(e){}
    try { if(!sessionStorage.getItem('vaB')){ setTimeout(function(){ if(!w.classList.contains('open')){ B.classList.add('on'); setTimeout(function(){ B.classList.remove('on'); }, 9000); } sessionStorage.setItem('vaB', '1'); }, 3500); } } catch(e){}

    /* 4. load the brain if this page does not have it yet */
    if(!hasBrain()){ var go = function(){ var s = D.createElement('script'); s.src = 'velos-assistant.js?v=2'; s.async = true; D.body.appendChild(s); }; if(!W.VELOS_SUPABASE){ var c = D.createElement('script'); c.src = 'supabase-config.js'; c.onload = go; c.onerror = go; D.body.appendChild(c); } else go(); }

    /* 5. menu entry: next to the other items in the drop-down and the phone menu */
    D.querySelectorAll('a[href="vendor.html"][data-page]').forEach(function(a){
      var rich = a.querySelector('.wm-label'), n = D.createElement('a'); n.href = '#'; n.className = 'vaM'; n.setAttribute('data-page', 'assistant');
      n.innerHTML = rich ? '<span class="wm-label">✨ Velos Assistant</span><span class="wm-sub">Ask anything, find places near you</span>' : '✨ Velos Assistant';
      n.onclick = function(e){ e.preventDefault(); open(); }; a.parentNode.insertBefore(n, a); });

    /* 6. landing page card, right under the search area */
    var run = D.querySelector('.hm-run'); if(run && /(^\/$|index\.html$)/.test(location.pathname) && !D.getElementById('vaCard')){
      var c = D.createElement('section'); c.id = 'vaCard'; c.className = 'vaC';
      c.innerHTML = '<div><div class="av">✨</div><div class="tx"><b>Meet the Velos Assistant</b><span>Ask anything without browsing the whole site. Find a product, a meal or a technician, get outfit ideas, and see stores and restaurants near you.</span><div class="ch"><a data-q="near me">📍 Near me</a><a data-q="I am hungry">🍽️ I am hungry</a><a data-q="Find a phone">📱 Find a phone</a><a data-q="Book a service">🛠️ Book a service</a><a data-q="Outfit help">👗 Outfit help</a></div></div><button class="go" type="button">Ask Velos ✨</button></div>';
      run.parentNode.insertBefore(c, run);
      c.querySelector('.go').onclick = open;
      c.querySelectorAll('.ch a').forEach(function(a){ a.onclick = function(){ open(); setTimeout(function(){ if(W.sendChat) W.sendChat(a.getAttribute('data-q')); }, 450); }; }); }
  });
})();
