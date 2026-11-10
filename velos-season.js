/* Velos Seasons: the public site dresses itself for the day.
   New Year gets fireworks and a welcome screen, Christmas gets snow and lights, national days get flag colours and
   confetti, Eid gets stars and a crescent, Valentine's gets hearts, and so on. It switches itself on and off by date
   (Kampala time) and costs almost nothing: effects run for a short while, pause when the tab is hidden, and respect
   "reduce motion". Preview any day:  add  ?season=newyear  to a page address (ids are listed in SEASONS below). */
(function(W, D){
  if(W.__vseason) return; W.__vseason = 1;
  var Q = new URLSearchParams(location.search).get('season') || '';
  var FLAGS = {
    ug: ['#000000', '#fcdc04', '#d90000'], ke: ['#000000', '#bb0000', '#006600', '#ffffff'], rw: ['#00a1de', '#fad201', '#20603d'], tz: ['#1eb53a', '#fcd116', '#00a3dd', '#000000']
  };
  function yr(){ var n = (W.VelosTheme && VelosTheme.kampalaNow) ? VelosTheme.kampalaNow() : {y:new Date().getFullYear(), m:new Date().getMonth() + 1, d:new Date().getDate()}; return n; }
  var Y = yr(), NY = (Y.m === 12 ? Y.y + 1 : Y.y);
  /* id -> look. fx: fireworks | snow | hearts | stars | confetti | petals | sparkle ; strip: top ribbon */
  var SEASONS = {
    newyear:   {t:'Happy New Year ' + NY, s:'Wishing you a prosperous year. Thank you for being part of The Velos Group.', e:'🎆', fx:'fireworks', accent:'#f3d37a', strip:'linear-gradient(90deg,#b8860b,#f3d37a,#fff3b0,#f3d37a,#b8860b)', splash:true, colors:['#ffd166','#ff6b6b','#4cc9f0','#b8f2e6','#f78c6b','#c77dff']},
    festive:   {t:'The festive season is here', s:'Thank you for growing with Velos this year.', e:'✨', fx:'sparkle', accent:'#e8c766', strip:'linear-gradient(90deg,#e8c766,#fff3b0,#e8c766)', colors:['#e8c766','#fff3b0']},
    christmas: {t:'Merry Christmas', s:'Wishing you and your family a joyful Christmas from all of us at Velos.', e:'🎄', fx:'snow', accent:'#ff6b6b', strip:'bulbs', splash:true},
    valentine: {t:"Happy Valentine's Day", s:'Spread some love today. Find a gift they will never forget.', e:'❤️', fx:'hearts', accent:'#ff8fa3', strip:'linear-gradient(90deg,#ff5d8f,#ffb3c6,#ff5d8f)', splash:false},
    women:     {t:"Happy International Women's Day", s:'Celebrating the women who power our network.', e:'💜', fx:'petals', accent:'#c58bff', strip:'linear-gradient(90deg,#7b2cbf,#c58bff,#7b2cbf)', colors:['#c58bff','#e0aaff','#f1d1ff']},
    labour:    {t:'Happy Labour Day', s:'Thank you for your hard work.', e:'🛠️', fx:'sparkle', accent:'#ffb04a', strip:'linear-gradient(90deg,#ff8c00,#ffd166,#ff8c00)', colors:['#ffb04a','#ffd166']},
    madaraka:  {t:'Happy Madaraka Day, Kenya', s:'Celebrating Kenya.', e:'🇰🇪', fx:'confetti', flag:'ke', accent:'#4bd17a'},
    martyrs:   {t:'Uganda Martyrs Day', s:'Blessings to you. Safe travels to everyone going to Namugongo.', e:'🕊️', fx:'sparkle', accent:'#f4f1ea', strip:'linear-gradient(90deg,#ffffff,#d9d9d9,#ffffff)', colors:['#ffffff','#f4f1ea']},
    heroes:    {t:'Happy Heroes Day, Uganda', s:'Honouring our heroes.', e:'🇺🇬', fx:'confetti', flag:'ug', accent:'#fcdc04'},
    liberation:{t:'Happy Liberation Day, Rwanda', s:'Celebrating Rwanda.', e:'🇷🇼', fx:'confetti', flag:'rw', accent:'#4aa8ff'},
    ugandaindep:{t:'Happy Independence Day, Uganda', s:'For God and my country. Happy Independence Day.', e:'🇺🇬', fx:'fireworks', flag:'ug', accent:'#fcdc04', splash:true},
    mashujaa:  {t:'Happy Mashujaa Day, Kenya', s:"Honouring Kenya's heroes.", e:'🇰🇪', fx:'confetti', flag:'ke', accent:'#4bd17a'},
    tzindep:   {t:'Happy Independence Day, Tanzania', s:'Celebrating Tanzania.', e:'🇹🇿', fx:'confetti', flag:'tz', accent:'#4bd17a'},
    jamhuri:   {t:'Happy Jamhuri Day, Kenya', s:"Celebrating Kenya's republic.", e:'🇰🇪', fx:'fireworks', flag:'ke', accent:'#4bd17a', splash:true},
    easter:    {t:'Blessed Easter', s:'Wishing you a peaceful Easter.', e:'🐣', fx:'petals', accent:'#f7e9a8', strip:'linear-gradient(90deg,#f7e9a8,#b8f2e6,#f1d1ff,#ffd6a5,#f7e9a8)', colors:['#f7e9a8','#b8f2e6','#f1d1ff','#ffd6a5','#ffc6d9'], splash:true},
    eid:       {t:'Eid Mubarak', s:'Wishing you and your family a blessed Eid.', e:'🌙', fx:'stars', accent:'#7fe0c0', strip:'linear-gradient(90deg,#0f7b6c,#7fe0c0,#0f7b6c)', splash:true},
    mothers:   {t:"Happy Mother's Day", s:'Celebrating every mother. Treat her today.', e:'💐', fx:'petals', accent:'#ff9fc2', strip:'linear-gradient(90deg,#ff7aa8,#ffc2d9,#ff7aa8)', colors:['#ff9fc2','#ffc2d9','#fff0f5']},
    fathers:   {t:"Happy Father's Day", s:'Celebrating every father.', e:'👔', fx:'sparkle', accent:'#7fb2ff', strip:'linear-gradient(90deg,#3a6fd8,#9ec5ff,#3a6fd8)', colors:['#7fb2ff','#cfe0ff']},
    blackfriday:{t:'Black Friday deals', s:'Our biggest offers of the year. Look for the red tags.', e:'🏷️', fx:'sparkle', accent:'#ff4d4d', strip:'linear-gradient(90deg,#000,#ff4d4d,#000)', colors:['#ff4d4d','#ffffff']}
  };
  function blackFriday(){ var d = new Date(Date.UTC(Y.y, 10, 30)); while(d.getUTCDay() !== 5) d.setUTCDate(d.getUTCDate() - 1); return Y.m === 11 && Y.d === d.getUTCDate(); }
  function pick(){ if(Q && SEASONS[Q]) return Q; if(Q === 'off') return null;
    var c = (W.VelosTheme && VelosTheme.current) ? VelosTheme.current() : null; if(c && SEASONS[c.id]) return c.id; if(blackFriday()) return 'blackfriday'; return null; }

  /* ---------- effects engine ---------- */
  var cv, cx, P = [], W0 = 0, H0 = 0, run = false, t0 = 0, last = 0, spawnAt = 0, kind = '', colors = [], stopAfter = 90000, dpr = 1;
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function size(){ dpr = Math.min(2, W.devicePixelRatio || 1); W0 = innerWidth; H0 = innerHeight; cv.width = W0 * dpr; cv.height = H0 * dpr; cv.style.width = W0 + 'px'; cv.style.height = H0 + 'px'; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function burst(x, y, col){ var n = W0 < 500 ? 46 : 78, hue = col || colors[(Math.random() * colors.length) | 0]; for(var i = 0; i < n; i++){ var a = Math.PI * 2 * i / n + rnd(-.05, .05), sp = rnd(1.2, 4.8) * (Math.random() < .25 ? .55 : 1); P.push({k:'p', x:x, y:y, vx:Math.cos(a) * sp, vy:Math.sin(a) * sp, life:rnd(55, 95), age:0, c:Math.random() < .2 ? '#ffffff' : hue, r:rnd(1.2, 2.4)}); } }
  function spawn(now){
    if(kind === 'fireworks'){ if(now > spawnAt){ spawnAt = now + rnd(500, 1300); P.push({k:'r', x:rnd(W0 * .12, W0 * .88), y:H0 + 10, vx:rnd(-.5, .5), vy:-rnd(7.5, 11), ty:rnd(H0 * .12, H0 * .5), c:colors[(Math.random() * colors.length) | 0]}); } }
    else if(kind === 'snow'){ while(P.length < (W0 < 500 ? 55 : 110)) P.push({k:'s', x:rnd(0, W0), y:rnd(-H0, 0), vy:rnd(.6, 1.8), vx:rnd(-.4, .4), r:rnd(1.4, 3.6), ph:rnd(0, 6.28)}); }
    else if(kind === 'hearts'){ if(now > spawnAt && P.length < 26){ spawnAt = now + rnd(250, 700); P.push({k:'h', x:rnd(0, W0), y:H0 + 20, vy:-rnd(.7, 1.6), vx:rnd(-.3, .3), s:rnd(14, 30), ph:rnd(0, 6.28), e:['❤️','💖','💕','🌹'][(Math.random() * 4) | 0]}); } }
    else if(kind === 'confetti'){ if(now > spawnAt && P.length < (W0 < 500 ? 70 : 130)){ spawnAt = now + 60; for(var i = 0; i < 2; i++) P.push({k:'c', x:rnd(0, W0), y:-12, vy:rnd(1.4, 3.2), vx:rnd(-1, 1), w:rnd(6, 11), h:rnd(9, 15), rot:rnd(0, 6.28), vr:rnd(-.2, .2), c:colors[(Math.random() * colors.length) | 0]}); }
      if(FW && now > spawnAt - 40 && Math.random() < .004) burst(rnd(W0 * .2, W0 * .8), rnd(H0 * .15, H0 * .4)); }
    else if(kind === 'petals'){ if(now > spawnAt && P.length < 60){ spawnAt = now + 140; P.push({k:'t', x:rnd(0, W0), y:-14, vy:rnd(.8, 1.9), vx:rnd(-.5, .7), a:rnd(5, 9), b:rnd(3, 5), rot:rnd(0, 6.28), vr:rnd(-.05, .05), c:colors[(Math.random() * colors.length) | 0], ph:rnd(0, 6.28)}); } }
    else if(kind === 'stars'){ while(P.length < (W0 < 500 ? 30 : 60)) P.push({k:'w', x:rnd(0, W0), y:rnd(0, H0 * .7), r:rnd(.8, 2.4), ph:rnd(0, 6.28), sp:rnd(.02, .06)}); }
    else if(kind === 'sparkle'){ if(now > spawnAt && P.length < 40){ spawnAt = now + 160; P.push({k:'x', x:rnd(0, W0), y:rnd(0, H0), life:rnd(40, 80), age:0, r:rnd(2, 6), c:colors[(Math.random() * colors.length) | 0]}); } }
  }
  var FW = false;
  function frame(now){ if(!run) return; requestAnimationFrame(frame); if(D.hidden){ last = now; return; }
    var dt = Math.min(2.2, (now - (last || now)) / 16.67); last = now;
    if(now - t0 > stopAfter){ fade = true; }
    cx.globalCompositeOperation = 'destination-out'; cx.fillStyle = kind === 'fireworks' ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,1)'; cx.fillRect(0, 0, W0, H0); cx.globalCompositeOperation = 'lighter';
    if(!fade) spawn(now);
    for(var i = P.length - 1; i >= 0; i--){ var p = P[i];
      if(p.k === 'r'){ p.x += p.vx * dt; p.y += p.vy * dt; p.vy *= .985; cx.fillStyle = p.c; cx.fillRect(p.x, p.y, 2, 6); if(p.y <= p.ty || p.vy > -1.2){ burst(p.x, p.y, p.c); P.splice(i, 1); } }
      else if(p.k === 'p'){ p.age += dt; p.vy += .045 * dt; p.vx *= .985; p.vy *= .985; p.x += p.vx * dt; p.y += p.vy * dt; var al = Math.max(0, 1 - p.age / p.life); cx.globalAlpha = al; cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); cx.globalAlpha = 1; if(p.age > p.life) P.splice(i, 1); }
      else if(p.k === 's'){ p.ph += .02 * dt; p.x += (p.vx + Math.sin(p.ph) * .5) * dt; p.y += p.vy * dt; cx.fillStyle = 'rgba(255,255,255,.9)'; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); if(p.y > H0 + 6){ if(fade) P.splice(i, 1); else { p.y = -6; p.x = rnd(0, W0); } } }
      else if(p.k === 'h'){ p.ph += .03 * dt; p.x += (p.vx + Math.sin(p.ph) * .6) * dt; p.y += p.vy * dt; cx.globalCompositeOperation = 'source-over'; cx.font = p.s + 'px serif'; cx.globalAlpha = .9; cx.fillText(p.e, p.x, p.y); cx.globalAlpha = 1; cx.globalCompositeOperation = 'lighter'; if(p.y < -40) P.splice(i, 1); }
      else if(p.k === 'c'){ p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; cx.globalCompositeOperation = 'source-over'; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore(); cx.globalCompositeOperation = 'lighter'; if(p.y > H0 + 20) P.splice(i, 1); }
      else if(p.k === 't'){ p.ph += .03 * dt; p.x += (p.vx + Math.sin(p.ph)) * dt * .7; p.y += p.vy * dt; p.rot += p.vr * dt; cx.globalCompositeOperation = 'source-over'; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c; cx.globalAlpha = .85; cx.beginPath(); cx.ellipse(0, 0, p.a, p.b, 0, 0, 6.283); cx.fill(); cx.restore(); cx.globalAlpha = 1; cx.globalCompositeOperation = 'lighter'; if(p.y > H0 + 20) P.splice(i, 1); }
      else if(p.k === 'w'){ p.ph += p.sp * dt; var tw = .35 + .65 * Math.abs(Math.sin(p.ph)); cx.globalAlpha = fade ? tw * .3 : tw; cx.fillStyle = '#fff6c9'; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill(); cx.globalAlpha = 1; if(fade) P.splice(i, 1); }
      else if(p.k === 'x'){ p.age += dt; var a2 = Math.sin(Math.PI * Math.min(1, p.age / p.life)); cx.globalAlpha = a2; cx.fillStyle = p.c; var r = p.r * a2; cx.fillRect(p.x - r, p.y - .6, r * 2, 1.2); cx.fillRect(p.x - .6, p.y - r, 1.2, r * 2); cx.globalAlpha = 1; if(p.age > p.life) P.splice(i, 1); }
    }
    if(kind === 'stars'){ cx.globalCompositeOperation = 'source-over'; var mx = W0 - Math.min(90, W0 * .2), my = 78, mr = Math.min(34, W0 * .08); cx.globalAlpha = fade ? .0 : .95; cx.fillStyle = '#ffe9a3'; cx.beginPath(); cx.arc(mx, my, mr, 0, 6.283); cx.fill(); cx.globalCompositeOperation = 'destination-out'; cx.beginPath(); cx.arc(mx + mr * .45, my - mr * .1, mr * .88, 0, 6.283); cx.fill(); cx.globalAlpha = 1; cx.globalCompositeOperation = 'lighter'; }
    if(fade && !P.length) stop(); }
  var fade = false;
  function start(k, cols, ms){ if(run) return; kind = k; colors = cols; stopAfter = ms || 90000; FW = (k === 'confetti');
    cv = D.createElement('canvas'); cv.id = 'vse-cv'; cv.setAttribute('aria-hidden', 'true'); cv.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:2147483100'; D.body.appendChild(cv); cx = cv.getContext('2d'); size(); addEventListener('resize', size);
    run = true; fade = false; t0 = performance.now(); requestAnimationFrame(frame); }
  function stop(){ run = false; fade = false; P = []; if(cv && cv.parentNode) cv.parentNode.removeChild(cv); cv = null; }

  /* ---------- decoration: ribbon, lights, splash ---------- */
  var CSS = '#vse-st{position:fixed;left:0;right:0;top:0;z-index:2147480000;pointer-events:none;height:6px;background-size:200% 100%;animation:vsesh 6s linear infinite}@keyframes vsesh{to{background-position:200% 0}}'
    + '#vse-st.bulbs{height:22px;background:none;animation:none;display:flex;justify-content:space-around;overflow:hidden}#vse-st.bulbs i{width:10px;height:14px;margin-top:4px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;position:relative;animation:vseb 1.6s ease-in-out infinite}#vse-st.bulbs i:before{content:"";position:absolute;left:3px;top:-5px;width:4px;height:5px;background:#555;border-radius:1px}'
    + '@keyframes vseb{0%,100%{opacity:.35;filter:none}50%{opacity:1;filter:drop-shadow(0 0 6px currentColor)}}'
    + '#vse-sp{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;text-align:center;padding:28px;background:radial-gradient(ellipse at 50% 40%,var(--vseg,#1a2352) 0%,#05081a 70%);color:#f4f1ea;font-family:system-ui,sans-serif;animation:vsef .5s ease-out}@keyframes vsef{from{opacity:0}to{opacity:1}}'
    + '#vse-sp.out{opacity:0;transition:opacity .6s}#vse-sp .em{font-size:68px;line-height:1;margin-bottom:10px}#vse-sp h1{margin:0;font:600 clamp(38px,9vw,84px)/1.05 "Cormorant Garamond","Fraunces",Georgia,serif;letter-spacing:.01em;background:linear-gradient(120deg,var(--vsea,#f3d37a),#fff,var(--vsea,#f3d37a));-webkit-background-clip:text;background-clip:text;color:transparent;background-size:200% 100%;animation:vsesh 4s linear infinite}'
    + '#vse-sp p{max-width:560px;margin:14px auto 22px;color:#c9d2f2;font-size:17px;line-height:1.5}#vse-sp button{border:0;background:var(--vsea,#e8c766);color:#080d1f;font:700 16px system-ui;padding:14px 30px;border-radius:99px;cursor:pointer}#vse-sp small{display:block;margin-top:14px;color:#8fa0d6;letter-spacing:.14em;text-transform:uppercase;font-size:11px}'
    + '@media(prefers-reduced-motion:reduce){#vse-st,#vse-sp h1{animation:none}#vse-st.bulbs i{animation:none;opacity:1}}';
  function deco(id, S){
    var st = D.createElement('style'); st.textContent = CSS + '#vth-fx{display:none!important}'; D.head.appendChild(st);
    D.documentElement.style.setProperty('--vth', S.accent); D.documentElement.classList.add('vse', 'vse-' + id);
    var s = D.createElement('div'); s.id = 'vse-st';
    if(S.strip === 'bulbs'){ s.className = 'bulbs'; var cols = ['#ff4d4d', '#ffd166', '#4cd964', '#4cc9f0', '#c77dff'], n = Math.min(40, Math.round(innerWidth / 26)), h = ''; for(var i = 0; i < n; i++) h += '<i style="background:' + cols[i % 5] + ';color:' + cols[i % 5] + ';animation-delay:' + (i % 5) * .3 + 's"></i>'; s.innerHTML = h; }
    else if(S.flag){ var f = FLAGS[S.flag], p = 100 / f.length; s.style.background = 'linear-gradient(90deg,' + f.map(function(c, i){ return c + ' ' + (i * p) + '% ' + ((i + 1) * p) + '%'; }).join(',') + ')'; s.style.animation = 'none'; s.style.height = '7px'; }
    else if(S.strip){ s.style.background = S.strip; }
    D.body.appendChild(s); }
  function splash(id, S){ var key = 'vse-sp-' + id + '-' + Y.y + '-' + Y.m + '-' + Y.d; if(!Q){ try { if(localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch(e){} }
    var d = D.createElement('div'); d.id = 'vse-sp'; d.style.setProperty('--vsea', S.accent); d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', S.t);
    d.innerHTML = '<div><div class="em">' + S.e + '</div><h1>' + S.t + '</h1><p>' + S.s + '</p><button type="button">Continue to Velos</button><small>The Velos Group</small></div>';
    D.body.appendChild(d); var close = function(){ if(!d.parentNode) return; d.classList.add('out'); setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); }, 650); };
    d.querySelector('button').onclick = close; d.addEventListener('click', function(e){ if(e.target === d) close(); }); setTimeout(close, 8000); }

  function go(){ var id = pick(); if(!id) return; var S = SEASONS[id];
    var cols = S.flag ? FLAGS[S.flag].map(function(c){ return c === '#000000' ? '#ffffff' : c; }) : (S.colors || ['#ffd166', '#ff6b6b', '#4cc9f0', '#b8f2e6', '#c77dff']);
    deco(id, S);
    try { var pv = {t:S.t, e:S.e, fx:S.fx, accent:S.accent}; localStorage.setItem('v_season', JSON.stringify({day:new Date().toISOString().slice(0,10), S:pv})); if(W.VelosSplashTheme) W.VelosSplashTheme(pv); } catch(e){}
    if(!D.getElementById('vth-bar') && W.VelosTheme){ try { VelosTheme.init({}); } catch(e){} }
    var reduce = W.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(S.splash && !reduce && !D.getElementById('vse-sp')) splash(id, S);
    if(!reduce) start(S.fx, cols, S.fx === 'fireworks' ? 70000 : 100000);
    W.VelosSeason = {id:id, stop:stop, replay:function(){ stop(); start(S.fx, cols, 60000); }}; }
  function ready(fn){ if(D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function(){ if(W.VelosTheme) return go(); var s = D.createElement('script'); s.src = 'velos-theme.js?v=2'; s.onload = go; s.onerror = go; D.body.appendChild(s); });
})(window, document);
