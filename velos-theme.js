/* Velos festive and birthday themes for dashboards and the landing page.
   <script src="velos-theme.js"></script>  then  VelosTheme.init({db: supabaseClient, role: 'agent', name: 'Ann'})
   - Festive seasons (Uganda, Kenya, Rwanda and common holidays) change the colour accent and show a greeting strip with light decorations.
   - On a person's birthday the dashboard switches to a birthday theme with confetti and a personal greeting.
   - Signed-in people who have not shared their birthday are asked once (they can skip; asked again after 30 days).
   Eid dates are approximate (moon sighting): the greeting runs for two days around them. */
(function (W) {
  var MON_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function kampalaNow() { var p; try { p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kampala', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).formatToParts(new Date()); } catch (e) { var n = new Date(); return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate(), wd: n.getDay() }; } var o = {}; p.forEach(function (q) { o[q.type] = q.value; }); return { y: +o.year, m: +o.month, d: +o.day, wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday) }; }
  function dayNo(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
  function easter(y) { var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return { m: mo, d: da }; }
  var EID = { 2027: { fitr: [3, 9], adha: [5, 16] }, 2028: { fitr: [2, 26], adha: [5, 5] }, 2029: { fitr: [2, 14], adha: [4, 24] }, 2030: { fitr: [2, 4], adha: [4, 13] } };
  function nthSunday(y, m, n) { var first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay(), d = 1 + ((7 - first) % 7) + (n - 1) * 7; return d; }

  // each: [from [m,d], to [m,d], id, emoji, greeting, accent, decor emojis, sub]
  function occasions(t) {
    var y = t.y, L = [
      [[12, 1], [12, 17], 'festive', '🎁', 'The festive season is here', '#e8c766', ['🎁', '✨'], 'Thank you for growing with Velos this year.'],
      [[12, 31], [12, 31], 'newyear', '🎆', 'Happy New Year from The Velos Group', '#f3d37a', ['🎆', '✨', '🎉'], 'Wishing you a prosperous year ahead.'],
      [[1, 1], [1, 2], 'newyear', '🎆', 'Happy New Year from The Velos Group', '#f3d37a', ['🎆', '✨', '🎉'], 'Wishing you a prosperous year ahead.'],
      [[2, 13], [2, 14], 'valentine', '❤️', "Happy Valentine's Day", '#ff8fa3', ['❤️', '💕', '🌹'], 'Spread some love today.'],
      [[3, 8], [3, 8], 'women', '💜', "Happy International Women's Day", '#c58bff', ['💜', '🌸', '✨'], 'Celebrating the women who power our network.'],
      [[5, 1], [5, 1], 'labour', '🛠️', 'Happy Labour Day', '#ffb04a', ['🛠️', '⭐'], 'Thank you for your hard work.'],
      [[6, 1], [6, 1], 'madaraka', '🇰🇪', 'Happy Madaraka Day, Kenya', '#4bd17a', ['🇰🇪', '⭐'], 'Celebrating Kenya.'],
      [[6, 3], [6, 3], 'martyrs', '🕊️', 'Uganda Martyrs Day: blessings to you', '#f4f1ea', ['🕊️'], 'Wishing everyone traveling to Namugongo a safe journey.'],
      [[6, 9], [6, 9], 'heroes', '🇺🇬', 'Happy Heroes Day, Uganda', '#fcdc04', ['🇺🇬', '⭐'], 'Honouring our heroes.'],
      [[7, 4], [7, 4], 'liberation', '🇷🇼', 'Happy Liberation Day, Rwanda', '#4aa8ff', ['🇷🇼', '⭐'], 'Celebrating Rwanda.'],
      [[10, 8], [10, 9], 'ugandaindep', '🇺🇬', 'Happy Independence Day, Uganda', '#fcdc04', ['🇺🇬', '🎉', '⭐'], 'For God and my country. Happy Independence Day.'],
      [[10, 20], [10, 20], 'mashujaa', '🇰🇪', 'Happy Mashujaa Day, Kenya', '#4bd17a', ['🇰🇪', '⭐'], 'Honouring Kenya\'s heroes.'],
      [[12, 9], [12, 9], 'tzindep', '🇹🇿', 'Happy Independence Day, Tanzania', '#4bd17a', ['🇹🇿'], ''],
      [[12, 12], [12, 12], 'jamhuri', '🇰🇪', 'Happy Jamhuri Day, Kenya', '#4bd17a', ['🇰🇪', '🎉', '⭐'], 'Celebrating Kenya\'s republic.'],
      [[12, 18], [12, 26], 'christmas', '🎄', 'Merry Christmas from The Velos Group', '#ff6b6b', ['🎄', '❄️', '🎁', '⭐'], 'Wishing you and your family a joyful Christmas.']
    ];
    var e = easter(y), ed = dayNo(y, e.m, e.d), td = dayNo(y, t.m, t.d);
    if (td >= ed - 2 && td <= ed + 1) L.push([[t.m, t.d], [t.m, t.d], 'easter', '✝️', 'Blessed Easter from The Velos Group', '#f7e9a8', ['✝️', '🐣', '🌷'], 'Wishing you a peaceful Easter.']);
    var E = EID[y]; if (E) {
      var f = dayNo(y, E.fitr[0], E.fitr[1]), a = dayNo(y, E.adha[0], E.adha[1]);
      if (td >= f - 1 && td <= f + 1) L.push([[t.m, t.d], [t.m, t.d], 'eid', '🌙', 'Eid Mubarak from The Velos Group', '#7fe0c0', ['🌙', '⭐', '✨'], 'Wishing you and your family a blessed Eid.']);
      if (td >= a - 1 && td <= a + 1) L.push([[t.m, t.d], [t.m, t.d], 'eid', '🌙', 'Eid Mubarak from The Velos Group', '#7fe0c0', ['🌙', '⭐', '✨'], 'Wishing you and your family a blessed Eid al-Adha.']);
    }
    if (t.m === 5 && t.d === nthSunday(y, 5, 2)) L.push([[5, t.d], [5, t.d], 'mothers', '💐', "Happy Mother's Day", '#ff9fc2', ['💐', '💖'], 'Celebrating every mother.']);
    if (t.m === 6 && t.d === nthSunday(y, 6, 3)) L.push([[6, t.d], [6, t.d], 'fathers', '👔', "Happy Father's Day", '#7fb2ff', ['👔', '⭐'], 'Celebrating every father.']);
    return L;
  }
  function inRange(r, t) { var v = t.m * 100 + t.d; return v >= r[0][0] * 100 + r[0][1] && v <= r[1][0] * 100 + r[1][1]; }
  function current(t) { t = t || kampalaNow(); var L = occasions(t), hit = null; L.forEach(function (r) { if (inRange(r, t)) hit = r; }); /* the most specific (last matching) wins */ return hit ? { id: hit[2], emoji: hit[3], title: hit[4], accent: hit[5], decor: hit[6], sub: hit[7] } : null; }

  function css() {
    if (document.getElementById('vth-css')) return;
    var s = document.createElement('style'); s.id = 'vth-css';
    s.textContent = '#vth-bar{position:relative;z-index:50;display:flex;align-items:center;justify-content:center;gap:10px;padding:9px 40px 9px 14px;text-align:center;font:600 14px/1.35 Inter,system-ui,sans-serif;color:#10162f;background:var(--vth,#e8c766);}'
      + '#vth-bar small{font-weight:500;opacity:.85;display:block}#vth-x{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;font-size:20px;color:#10162f;cursor:pointer;padding:6px 10px}'
      + '#vth-fx{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:40}#vth-fx i{position:absolute;top:-8vh;font-style:normal;animation:vthfall linear forwards}'
      + '@keyframes vthfall{to{transform:translate3d(var(--dx,0),112vh,0) rotate(var(--r,360deg));opacity:.9}}'
      + '@media(prefers-reduced-motion:reduce){#vth-fx{display:none}}'
      + '#vth-bd{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;max-width:420px;margin:0 auto;background:#0f1730;color:#f4f1ea;border:1px solid #e8c766;border-radius:14px;padding:14px;font:15px/1.45 Inter,system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)}'
      + '#vth-bd select,#vth-bd input{padding:10px;border-radius:8px;border:1px solid #2a3560;background:#080d1f;color:#f4f1ea;font:inherit;margin:4px 4px 4px 0}#vth-bd button{padding:10px 14px;border-radius:8px;border:0;background:#e8c766;color:#080d1f;font:700 14px Inter,sans-serif;cursor:pointer;margin-right:6px}#vth-bd button.g{background:none;border:1px solid #2a3560;color:#f4f1ea}';
    document.head.appendChild(s);
  }
  function fall(list, n) {
    var fx = document.createElement('div'); fx.id = 'vth-fx'; document.body.appendChild(fx);
    for (var i = 0; i < n; i++) { var e = document.createElement('i'); e.textContent = list[i % list.length]; e.style.left = Math.random() * 100 + 'vw'; e.style.fontSize = (14 + Math.random() * 18) + 'px'; e.style.animationDuration = (5 + Math.random() * 5) + 's'; e.style.animationDelay = (Math.random() * 3) + 's'; e.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); e.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg'); fx.appendChild(e); }
    setTimeout(function () { if (fx.parentNode) fx.parentNode.removeChild(fx); }, 14000);
  }
  function show(o, key, where) {
    try { if (sessionStorage.getItem('vth-' + key)) return; } catch (e) {}
    css(); var bar = document.createElement('div'); bar.id = 'vth-bar'; bar.style.setProperty('--vth', o.accent);
    bar.innerHTML = '<span style="font-size:22px">' + o.emoji + '</span><span>' + o.title + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span><button id="vth-x" aria-label="Close">×</button>';
    var host = document.body; host.insertBefore(bar, host.firstChild);
    document.getElementById('vth-x').onclick = function () { bar.remove(); try { sessionStorage.setItem('vth-' + key, '1'); } catch (e) {} };
    document.documentElement.style.setProperty('--gold', o.accent);
    fall(o.decor, 26);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function askBirthday(opts) {
    var db = opts.db; try { var t = +localStorage.getItem('vth-asked'); if (t && Date.now() - t < 30 * 864e5) return; } catch (e) {}
    css(); var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var d = document.createElement('div'); d.id = 'vth-bd';
    d.innerHTML = '<b>🎂 When is your birthday?</b><div style="color:#a3adc6;font-size:13px;margin:4px 0">Velos celebrates its people. We will send you a birthday card and decorate your dashboard on the day. Only the day and month are needed.</div>'
      + '<select id="vb-d">' + Array.apply(null, Array(31)).map(function (_, i) { return '<option>' + (i + 1) + '</option>'; }).join('') + '</select><select id="vb-m">' + m.map(function (x, i) { return '<option value="' + (i + 1) + '">' + x + '</option>'; }).join('') + '</select>'
      + '<input id="vb-e" type="email" placeholder="Email for your birthday card (optional)" style="width:100%"><div id="vb-er" style="color:#ff8a80;font-size:13px"></div><button id="vb-ok">Save</button><button class="g" id="vb-no">Not now</button>';
    document.body.appendChild(d);
    d.querySelector('#vb-no').onclick = function () { try { localStorage.setItem('vth-asked', Date.now()); } catch (e) {} d.remove(); };
    d.querySelector('#vb-ok').onclick = function () {
      db.rpc('set_my_birthday', { p_role: opts.role || '', p_name: NM(opts) || '', p_email: d.querySelector('#vb-e').value.trim() || null, p_month: +d.querySelector('#vb-m').value, p_day: +d.querySelector('#vb-d').value }).then(function (r) {
        if (r.error) { d.querySelector('#vb-er').textContent = r.error.message; return; }
        try { localStorage.setItem('vth-bday', JSON.stringify({ m: +d.querySelector('#vb-m').value, d: +d.querySelector('#vb-d').value, n: NM(opts) || '' })); } catch (e) {}
        d.innerHTML = '<b>Thank you 🎉</b><div style="color:#a3adc6;font-size:13px">We will celebrate with you on the day.</div>'; setTimeout(function () { d.remove(); }, 2200);
      });
    };
  }
  function NM(o) { try { return typeof o.name === 'function' ? o.name() : o.name; } catch (e) { return ''; } }
  function birthdayToday(b, t) { return b && +b.m === t.m && +b.d === t.d; }
  function init(opts) {
    opts = opts || {}; var t = kampalaNow(), db = opts.db, bday = null;
    try { bday = JSON.parse(localStorage.getItem('vth-bday') || 'null'); } catch (e) {}
    var festive = current(t);
    function apply(b) {
      if (birthdayToday(b, t)) { show({ emoji: '🎂', title: 'Happy birthday' + ((b.n || NM(opts)) ? ', ' + esc((b.n || NM(opts)).split(' ')[0]) : '') + '! 🎉', sub: 'Everyone at The Velos Group is celebrating you today.', accent: '#ff9fd0', decor: ['🎉', '🎊', '🎈', '🎂', '✨'] }, 'bday'); return; }
      if (festive) show(festive, festive.id);
    }
    apply(bday);
    if (db && opts.role) {
      db.auth.getSession().then(function (r) { if (!r.data || !r.data.session) return;
        db.rpc('my_birthday').then(function (x) {
          if (x.error) return; var b = x.data;
          if (b) { var nb = { m: b.month, d: b.day, n: b.name || NM(opts) || '' }; try { localStorage.setItem('vth-bday', JSON.stringify(nb)); } catch (e) {} if (!bday || bday.m !== nb.m || bday.d !== nb.d) apply(nb); }
          else setTimeout(function () { askBirthday(opts); }, 2500);
        });
      }, function () {});
    }
  }
  W.VelosTheme = { init: init, current: current, occasions: occasions, kampalaNow: kampalaNow };
})(window);
