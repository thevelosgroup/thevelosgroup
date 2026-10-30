/* Velos app shell: a clean top bar, a ☰ Menu drawer, a bottom bar on phones, and a page title.
   Used by the Rider, Restaurant, Agent and Partner apps so every back office feels the same. */
(function(){ var W = window, D = document;
  var CSS = '#vs-top{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:8px;margin:-16px -14px 10px;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;background:rgba(8,13,31,.96);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid var(--line,#2a3560)}'
  + '#vs-top .l{display:flex;align-items:center;gap:10px;min-width:0}#vs-menu{background:var(--gold,#e8c766);color:#080d1f;border:0;border-radius:10px;padding:9px 13px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap}'
  + '#vs-top .br{font:700 13px Georgia,serif;letter-spacing:.08em;color:var(--gold,#e8c766);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#vs-top .r{display:flex;align-items:center;gap:8px}#vs-so{background:none;border:1px solid var(--line,#2a3560);color:var(--txt,#f4f1ea);border-radius:10px;padding:8px 11px;font-size:13px;cursor:pointer}'
  + '#vs-id{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:4px 0 10px}#vs-id h1{margin:0;font-size:22px}#vs-id .pl{display:flex;gap:6px;flex-wrap:wrap}'
  + '#vs-crumb{color:var(--mut,#a3adc6);font-size:13px;margin:0 0 6px}#vs-crumb b{color:var(--gold,#e8c766)}'
  + '#vs-scrim{position:fixed;inset:0;background:rgba(2,8,28,.7);z-index:900}#vs-dr{position:fixed;top:0;left:0;bottom:0;width:min(86vw,330px);background:#0b1226;border-right:1px solid var(--line,#2a3560);z-index:901;overflow:auto;-webkit-overflow-scrolling:touch;padding:calc(14px + env(safe-area-inset-top)) 12px calc(20px + env(safe-area-inset-bottom));animation:vsl .18s ease-out}'
  + '@keyframes vsl{from{transform:translateX(-28px);opacity:0}to{transform:none;opacity:1}}#vs-dr .hd{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:12px}#vs-dr .hd b{color:var(--gold,#e8c766);font-family:Georgia,serif;font-size:17px}#vs-dr .hd div span{display:block;color:var(--mut,#a3adc6);font-size:13px}'
  + '.vs-i{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:transparent;border:1px solid transparent;border-radius:12px;padding:11px 12px;margin:3px 0;color:var(--txt,#f4f1ea);font-size:16px;cursor:pointer}.vs-i .ic{font-size:20px;width:26px;text-align:center}.vs-i .tx{flex:1;display:flex;flex-direction:column}.vs-i small{color:var(--mut,#a3adc6);font-size:12px}.vs-i:hover{background:#141d3b}.vs-i.on{background:var(--gold,#e8c766);color:#080d1f}.vs-i.on small{color:#3a3a2a}'
  + '.vs-bd{background:#b3261e;color:#fff;border-radius:99px;font-size:12px;font-weight:700;padding:1px 8px}.vs-ft{margin-top:14px;border-top:1px solid var(--line,#2a3560);padding-top:10px}'
  + '#vs-bar{position:fixed;left:0;right:0;bottom:0;z-index:55;display:flex;background:rgba(8,13,31,.97);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-top:1px solid var(--line,#2a3560);padding:6px 4px calc(6px + env(safe-area-inset-bottom))}'
  + '#vs-bar button{flex:1;background:none;border:0;color:var(--mut,#a3adc6);display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px;padding:4px 2px;position:relative;cursor:pointer}#vs-bar button .ic{font-size:20px}#vs-bar button.on{color:var(--gold,#e8c766)}#vs-bar .vs-bd{position:absolute;top:0;right:22%;font-size:10px;padding:0 6px}'
  + '#vs-page{padding-bottom:84px}@media(min-width:900px){#vs-bar{display:none}#vs-page{padding-bottom:30px}}';
  var st = {items:[], cur:'', opts:null};
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function css(){ if(D.getElementById('vs-css')) return; var s = D.createElement('style'); s.id = 'vs-css'; s.textContent = CSS; D.head.appendChild(s); }
  function find(id){ for(var i = 0; i < st.items.length; i++) if(st.items[i].id === id) return st.items[i]; return null; }
  function paint(){
    var it = find(st.cur) || st.items[0] || {}; var cr = D.getElementById('vs-crumb'); if(cr) cr.innerHTML = (it.icon || '') + ' <b>' + esc(it.label || '') + '</b>';
    var dr = D.getElementById('vs-list'); if(dr) dr.innerHTML = st.items.map(function(x){ return '<button class="vs-i ' + (x.id === st.cur ? 'on' : '') + '" onclick="VS.go(\'' + x.id + '\',true)"><span class="ic">' + (x.icon || '•') + '</span><span class="tx">' + esc(x.label) + (x.note ? '<small>' + esc(x.note) + '</small>' : '') + '</span>' + (x.badge ? '<span class="vs-bd">' + x.badge + '</span>' : '') + '</button>'; }).join('');
    var br = D.getElementById('vs-bar'); if(br) br.innerHTML = st.items.slice(0, 5).map(function(x){ return '<button class="' + (x.id === st.cur ? 'on' : '') + '" onclick="VS.go(\'' + x.id + '\')"><span class="ic">' + (x.icon || '•') + '</span>' + esc(x.short || x.label) + (x.badge ? '<span class="vs-bd">' + x.badge + '</span>' : '') + '</button>'; }).join(''); }
  function open(){ D.getElementById('vs-scrim').hidden = false; D.getElementById('vs-dr').hidden = false; D.body.style.overflow = 'hidden'; paint(); }
  function close(){ var a = D.getElementById('vs-scrim'), b = D.getElementById('vs-dr'); if(a) a.hidden = true; if(b) b.hidden = true; D.body.style.overflow = ''; }
  function go(id, fromMenu){ close(); if(id === st.cur && !fromMenu){ if(st.opts && st.opts.pick) st.opts.pick(id, true); return; } st.cur = id; paint(); W.scrollTo(0, 0); if(st.opts && st.opts.pick) st.opts.pick(id, false); }
  /* frame: build the shell once. opts = {root, brand, title, pills, items:[{id,icon,label,note,short}], pick, signout, bodyId} */
  function frame(o){ css(); st.opts = o; st.items = o.items; var keep = st.cur && find(st.cur) ? st.cur : (o.start || o.items[0].id); st.cur = keep; var root = D.getElementById(o.root || 'v'), bid = o.bodyId || 'vs-body';
    var bar = o.items.length > 1 && o.items.length <= 5;
    root.innerHTML = '<div id="vs-top"><div class="l"><button id="vs-menu" onclick="VS.open()" aria-label="Open menu">☰ Menu</button><span class="br">' + esc(o.brand || 'VELOS') + '</span></div><div class="r"><span id="vs-net"></span><button id="vs-so" onclick="' + (o.signout || 'out()') + '">Sign out</button></div></div>'
      + '<div id="vs-id"><div><h1>' + esc(o.title || '') + '</h1></div><div class="pl">' + (o.pills || '') + '</div></div><div id="vs-crumb"></div><div id="vs-page"><div id="' + bid + '"></div></div>'
      + (bar ? '<nav id="vs-bar"></nav>' : '') + '<div id="vs-scrim" hidden onclick="VS.close()"></div><aside id="vs-dr" hidden><div class="hd"><div><b>' + esc(o.brand || 'VELOS') + '</b><span>' + esc(o.who || '') + '</span></div><button class="g" onclick="VS.close()" style="padding:8px 12px">✕</button></div><div id="vs-list"></div><div class="vs-ft">'
      + '<button class="vs-i" onclick="VS.close();try{VelosPWA.install()}catch(e){}"><span class="ic">📲</span><span class="tx">Install this app<small>Add it to your home screen</small></span></button>'
      + '<button class="vs-i" onclick="VS.close();' + (o.signout || 'out()') + '"><span class="ic">🚪</span><span class="tx">Sign out</span></button></div></aside>';
    paint(); }
  function active(id){ st.cur = id; paint(); }
  function badge(id, n){ var x = find(id); if(x){ x.badge = n || ''; paint(); } }
  /* page: for apps that render their whole screen as HTML. pages = [{id,icon,label,note,short,html,badge}] */
  function page(pages, o){ var ids = pages.map(function(p){ return p.id; }).join(','), mounted = D.getElementById('vs-page') && st.sig === ids + '|' + (o.title || '') + '|' + (o.pills || '');
    if(!mounted){ st.sig = ids + '|' + (o.title || '') + '|' + (o.pills || ''); var oo = {}; for(var k in o) oo[k] = o[k]; oo.items = pages.map(function(p){ return {id:p.id, icon:p.icon, label:p.label, note:p.note, short:p.short, badge:p.badge}; }); oo.pick = function(id){ drawPage(); }; frame(oo); st.pages = pages; }
    else { st.pages = pages; pages.forEach(function(p){ var x = find(p.id); if(x) x.badge = p.badge || ''; }); }
    if(!find(st.cur)) st.cur = pages[0].id; drawPage(); paint(); }
  function drawPage(){ var b = D.getElementById('vs-body'); if(!b || !st.pages) return; var p = null; st.pages.forEach(function(x){ if(x.id === st.cur) p = x; }); if(p){ var sy = W.scrollY; b.innerHTML = p.html; } }
  W.VS = {frame:frame, page:page, go:go, open:open, close:close, active:active, badge:badge, cur:function(){ return st.cur; }};
  D.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
})();
