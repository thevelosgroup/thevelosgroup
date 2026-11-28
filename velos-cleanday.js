/* Velos National Cleaning Day (Uganda): the last Saturday of every month, from midnight to 10:30 AM (East Africa Time).
   - Customers (every public page): a "service unavailable" screen with a short animation. It reopens by itself.
   - Partners (vendor, restaurant, partner, events, security): stay fully working, with a small notice bar.
   - Riders and sales agents: blocked during the window.
   - Staff (admin, team): only admin, manager and supervisor can enter during the window.
   Settings (optional, table `settings`): site_cleanday = 'off' (never block) | 'auto' (default).
   Preview any time: add ?cleanday=preview to a page address (customer screen and partner bar only). */
(function (W, D) {
  if (W.__vcd) return; W.__vcd = 1;
  var TZ = 'Africa/Kampala', END_H = 10, END_M = 30, RETURN_TXT = '10:35 AM';
  var PATH = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var EXEMPT = /^(terms|privacy|refund-policy|verify|reset|maps-test|[1-6]-.*)\.html$/;
  var PARTNER = /^(vendor|restaurant|partner|events-pro|security-partners)\.html$/;
  var WORKER = /^(agent|rider)\.html$/;
  var STAFF = /^(admin|team)\.html$/;
  var ALLOWED_STAFF = ['admin', 'manager', 'supervisor'];
  var MODE = EXEMPT.test(PATH) ? 'exempt' : PARTNER.test(PATH) ? 'partner' : WORKER.test(PATH) ? 'worker' : STAFF.test(PATH) ? 'staff' : 'public';
  var preview = /[?&]cleanday=preview/.test(location.search), off = false, skew = 0, shown = null;

  function parts(ms) {
    try {
      var f = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date(ms)), o = {};
      f.forEach(function (p) { o[p.type] = p.value; });
      return { wd: o.weekday, y: +o.year, m: +o.month, d: +o.day, h: (+o.hour) % 24, mi: +o.minute };
    } catch (e) { var d = new Date(ms + 3 * 3600000); return { wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()], y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes() }; }
  }
  function now() { return Date.now() + skew; }
  /* true while it is the last Saturday of the month and before 10:30 AM in Uganda */
  function isWindow(ms) {
    var p = parts(ms == null ? now() : ms), dim = new Date(Date.UTC(p.y, p.m, 0)).getUTCDate();
    if (p.wd !== 'Sat' || p.d + 7 <= dim) return false;
    return p.h < END_H || (p.h === END_H && p.mi < END_M);
  }
  function active() { return preview && (MODE === 'public' || MODE === 'partner') ? true : (!off && isWindow()); }

  var CSS = '#vcd{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at 50% 20%,#14224f 0%,#080d1f 62%,#050816 100%);color:#f4f1ea;font:16px/1.55 Inter,system-ui,-apple-system,Segoe UI,sans-serif;text-align:center;overflow:auto}'
    + '#vcd *{box-sizing:border-box}#vcd .c{max-width:520px;width:100%}#vcd img.lg{width:74px;height:74px;object-fit:contain;margin:0 auto 6px;display:block}'
    + '#vcd .k{letter-spacing:.22em;text-transform:uppercase;font:700 11px system-ui;color:#e8c766;margin:4px 0 14px}'
    + '#vcd h1{font:700 clamp(26px,6.4vw,38px)/1.18 Georgia,serif;margin:0 0 12px;color:#fff}#vcd p{margin:0 0 12px;color:#c9d1e6}#vcd p b{color:#fff}'
    + '#vcd .t{display:inline-block;margin:6px 0 4px;padding:12px 22px;border:1px solid #e8c766;border-radius:999px;color:#e8c766;font:700 17px system-ui;background:rgba(232,199,102,.08)}'
    + '#vcd .n{font-size:13px;color:#8f9bb8;margin-top:16px}#vcd a.w{display:inline-block;margin-top:14px;color:#e8c766;font:600 14px system-ui;text-decoration:none;border-bottom:1px solid rgba(232,199,102,.5)}'
    + '#vcd .st{position:relative;height:120px;margin:0 auto 4px;width:260px}#vcd svg{overflow:visible}'
    + '#vcd .br{transform-origin:150px 22px;animation:vcdsw 2.6s ease-in-out infinite}@keyframes vcdsw{0%,100%{transform:rotate(-17deg)}50%{transform:rotate(17deg)}}'
    + '#vcd .sp{opacity:0;transform-origin:center;animation:vcdtw 2.6s ease-in-out infinite}@keyframes vcdtw{0%{opacity:0;transform:scale(.2)}35%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.3) translateY(-8px)}}'
    + '#vcd .bar{height:4px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden;margin:18px auto 0;max-width:260px}#vcd .bar i{display:block;height:100%;width:40%;border-radius:4px;background:linear-gradient(90deg,transparent,#e8c766,transparent);animation:vcdsh 1.8s linear infinite}@keyframes vcdsh{from{transform:translateX(-100%)}to{transform:translateX(260%)}}'
    + '#vcdb{position:sticky;top:0;z-index:2147483000;background:linear-gradient(90deg,#0f1730,#17234d);color:#f4f1ea;border-bottom:2px solid #e8c766;padding:9px 40px 9px 14px;font:600 13px/1.4 system-ui;text-align:center}#vcdb b{color:#e8c766}#vcdb span{position:absolute;right:0;top:0;bottom:0;padding:0 14px;cursor:pointer;display:flex;align-items:center;color:#a3adc6}'
    + '@media(prefers-reduced-motion:reduce){#vcd .br,#vcd .sp,#vcd .bar i{animation:none}}';

  function svg() {
    var sp = '', pts = [[60, 78, 0], [96, 96, .5], [134, 84, 1.1], [176, 98, .3], [208, 80, 1.4], [118, 104, 1.8], [158, 70, .8]];
    pts.forEach(function (p) { sp += '<path class="sp" style="animation-delay:' + p[2] + 's" transform="translate(' + p[0] + ' ' + p[1] + ')" d="M0-6 L1.6-1.6 6 0 1.6 1.6 0 6-1.6 1.6-6 0-1.6-1.6Z" fill="#e8c766"/>'; });
    return '<svg viewBox="0 0 300 120" width="260" height="104" aria-hidden="true"><ellipse cx="150" cy="108" rx="96" ry="4" fill="rgba(232,199,102,.18)"/>' + sp
      + '<g class="br"><rect x="147" y="2" width="6" height="64" rx="3" fill="#c9a227"/><path d="M128 66 H172 L184 104 H116 Z" fill="#e8c766"/><path d="M122 86 H178 M124 94 H176" stroke="#9a7b17" stroke-width="2" fill="none"/>'
      + '<g stroke="#b78f1c" stroke-width="2" stroke-linecap="round"><path d="M122 104 v8 M130 104 v10 M138 104 v8 M146 104 v10 M154 104 v10 M162 104 v8 M170 104 v10 M178 104 v8"/></g></g></svg>';
  }
  function logoSrc() { return 'logo-mark.png'; }
  function build(kind) {
    var who = kind === 'worker' ? { h: 'Deliveries and sales are paused', p: 'Riders and sales agents rest today so that everyone can take part in the clean-up. Please do not take new jobs until the service reopens.' }
      : kind === 'staff' ? { h: 'The team portal is closed this morning', p: 'During National Cleaning Day only the administrator, managers and supervisors can use the portal. Staff can sign in again after the service reopens.' }
        : { h: 'Service temporarily unavailable', p: 'Today is <b>National Cleaning Day</b> in Uganda, held on the last Saturday of every month. Like the rest of the country, we are taking part, and our services are paused for a few hours.' };
    var d = D.createElement('div'); d.id = 'vcd'; d.setAttribute('role', 'alertdialog'); d.setAttribute('aria-live', 'polite');
    d.innerHTML = '<div class="c"><img class="lg" src="' + logoSrc() + '" alt="The Velos Group" onerror="this.style.display=\'none\'"><div class="k">The Velos Group</div><div class="st">' + svg() + '</div><h1>' + who.h + '</h1><p>' + who.p + '</p>'
      + '<div class="t">Please try again at ' + RETURN_TXT + '</div><div class="bar" aria-hidden="true"><i></i></div>'
      + '<p class="n">This page reopens automatically. Your orders, bookings and payments are safe. Thank you for keeping Uganda clean.</p><a class="w" href="https://wa.me/256755215751" target="_blank" rel="noopener">Urgent? Message us on WhatsApp</a></div>';
    return d;
  }
  function lock(on) { try { D.documentElement.style.overflow = on ? 'hidden' : ''; if (D.body) { if (on) D.body.setAttribute('inert', ''); else D.body.removeAttribute('inert'); } } catch (e) {} }
  function show(kind) {
    if (shown === kind) return; hide();
    shown = kind;
    if (kind === 'banner') {
      var b = D.createElement('div'); b.id = 'vcdb'; b.innerHTML = '🧹 <b>National Cleaning Day.</b> Customers are paused until ' + RETURN_TXT + '. You can keep updating your catalogue and stock.<span aria-label="Close">✕</span>';
      b.querySelector('span').onclick = function () { b.remove(); };
      (D.body || D.documentElement).insertBefore(b, (D.body || D.documentElement).firstChild); return;
    }
    var d = build(kind); (D.body || D.documentElement).appendChild(d); lock(true);
    try { D.title = 'National Cleaning Day | The Velos Group'; } catch (e) {}
  }
  function hide() { var a = D.getElementById('vcd'), b = D.getElementById('vcdb'), c = D.getElementById('vcd-pre'); if (a) a.remove(); if (b) b.remove(); if (c) c.remove(); lock(false); shown = null; }

  var staffOk = null;
  function apply() {
    if (MODE === 'exempt') return;
    var on = active();
    if (!on) { if (shown) { hide(); if (!preview) location.reload(); } return; }
    if (MODE === 'partner') show('banner');
    else if (MODE === 'worker') show('worker');
    else if (MODE === 'staff') { if (staffOk === false) show('staff'); else if (staffOk === null) checkStaff(); }
    else show('public');
  }
  function checkStaff() {
    if (checkStaff.busy) return; checkStaff.busy = 1;
    var tries = 0; (function poll() {
      var cl = null; try { cl = typeof db !== 'undefined' ? db : W.db; } catch (e) {}
      if (!cl || !cl.auth) { if (++tries < 40) return setTimeout(poll, 500); checkStaff.busy = 0; return; }
      cl.auth.getSession().then(function (r) {
        var s = r && r.data && r.data.session; if (!s) { if (++tries < 40) return setTimeout(poll, 1500); checkStaff.busy = 0; return; }
        cl.from('profiles').select('role').eq('id', s.user.id).maybeSingle().then(function (q) {
          var role = q && q.data && q.data.role; staffOk = ALLOWED_STAFF.indexOf(role) > -1; checkStaff.busy = 0; if (!staffOk) show('staff');
        }, function () { checkStaff.busy = 0; });
      }, function () { checkStaff.busy = 0; });
    })();
  }
  /* admin page calls this once it knows the role, so the block is instant */
  W.VelosCleanday = { active: active, isWindow: isWindow, gateRole: function (role) { staffOk = ALLOWED_STAFF.indexOf(role) > -1; apply(); }, mode: MODE };

  function ready(fn) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    apply();
    try { /* trusted clock: use the server time so a wrong phone clock cannot open or close the service */
      fetch('version.txt?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' }).then(function (r) { var h = r.headers.get('Date'); if (h) { skew = new Date(h).getTime() - Date.now(); apply(); } }).catch(function () {});
    } catch (e) {}
    try {
      var S = W.VELOS_SUPABASE; if (S) fetch(S.url + '/rest/v1/settings?key=eq.site_cleanday&select=value', { headers: { apikey: S.key } }).then(function (r) { return r.json(); }).then(function (a) { off = !!(a && a[0] && String(a[0].value).toLowerCase() === 'off'); apply(); }).catch(function () {});
    } catch (e) {}
    setInterval(apply, 20000);
  });
  /* hide the page content immediately on cleaning day so nothing flashes before the screen appears */
  try { if (MODE === 'public' || MODE === 'worker') { if (active()) { var st = D.createElement('style'); st.id = 'vcd-pre'; st.textContent = 'body{visibility:hidden}#vcd{visibility:visible}'; D.head.appendChild(st); ready(function () { var s = D.getElementById('vcd-pre'); if (s && D.getElementById('vcd')) { s.textContent = 'body>*:not(#vcd){visibility:hidden}'; } else if (s) s.remove(); }); } } } catch (e) {}
  try { var cs = D.createElement('style'); cs.textContent = CSS; D.head.appendChild(cs); } catch (e) {}
})(window, document);
