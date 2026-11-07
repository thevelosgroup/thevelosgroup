/* Velos UI kit: tidy, professional records for every dashboard.
   One file does two jobs:
   1) it polishes the look of cards, stat tiles, tables, badges, buttons and forms in all back offices;
   2) it gives pages ready-made pieces: VelosUI.order(), .stats(), .table(), .empty(), .head(), .kv(), .steps().
   Works on every portal (vendor, restaurant, rider, agent, partner, admin). */
(function(){ var W = window, D = document;
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var ugx = function(n){ return 'UGX ' + Math.round(+n || 0).toLocaleString('en-US'); };
  var date = function(d, t){ if(!d) return ''; var x = new Date(d); if(isNaN(x)) return esc(d);
    var s = x.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}); return t ? s + ', ' + x.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}) : s; };

  var CSS = ''
  /* ---- base polish for existing classes ---- */
  + '.c,.card{background:linear-gradient(180deg,#101a3a,#0d1630)!important;border:1px solid #26335f!important;border-radius:16px!important;padding:16px!important;margin:0 0 12px!important;box-shadow:0 1px 0 rgba(255,255,255,.04) inset,0 6px 18px rgba(0,0,0,.18)}'
  + '.stats{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important;gap:10px!important;margin:0 0 14px!important}'
  + '.stat{display:flex!important;flex-direction:column!important;gap:4px!important;position:relative;overflow:hidden;margin:0!important;padding:14px 16px!important}'
  + '.stat:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--gold,#e8c766)}'
  + '.stat b{font-size:24px!important;line-height:1.15;color:var(--gold,#e8c766);font-family:Georgia,serif;letter-spacing:.2px}'
  + '.stat .m,.stat span{font-size:12px!important;letter-spacing:.06em;text-transform:uppercase;color:var(--mut,#a3adc6)}'
  + 'h2{font-family:Georgia,serif;letter-spacing:.2px}'
  + 'table{width:100%;border-collapse:separate!important;border-spacing:0!important;font-size:14px;background:transparent}'
  + 'table th{position:sticky;top:0;text-align:left;font-size:11px!important;letter-spacing:.09em;text-transform:uppercase;color:var(--mut,#a3adc6)!important;font-weight:700;background:#0c1431;padding:10px 12px!important;border-bottom:1px solid #26335f!important;white-space:nowrap}'
  + 'table td{padding:12px!important;border-bottom:1px solid #1b2650!important;vertical-align:middle}'
  + 'table tr:last-child td{border-bottom:0!important}table tbody tr:hover td,table tr:hover td{background:rgba(232,199,102,.04)}'
  + 'table th:first-child{border-top-left-radius:10px}table th:last-child{border-top-right-radius:10px}'
  + 'input,select,textarea{background:#0a1130!important;border:1px solid #2a3866!important;border-radius:10px!important;color:var(--txt,#f4f1ea)!important;padding:11px 12px!important;font-size:15px;transition:border-color .15s,box-shadow .15s}'
  + 'input:focus,select:focus,textarea:focus{outline:0;border-color:var(--gold,#e8c766)!important;box-shadow:0 0 0 3px rgba(232,199,102,.18)}'
  + 'input::placeholder,textarea::placeholder{color:#74809f}'
  + 'button{border-radius:10px;font-weight:700;transition:transform .08s,filter .15s}button:active{transform:scale(.98)}button:hover{filter:brightness(1.07)}'
  + '.pill{display:inline-flex;align-items:center;gap:5px;border-radius:99px!important;padding:3px 10px!important;font-size:12px!important;font-weight:700;letter-spacing:.02em;white-space:nowrap}'
  /* ---- status badges ---- */
  + '.vu-b{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:4px 11px;font-size:12px;font-weight:700;letter-spacing:.02em;white-space:nowrap;border:1px solid transparent}'
  + '.vu-b:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}'
  + '.vu-b.blue{background:rgba(90,150,255,.14);color:#8db8ff;border-color:rgba(90,150,255,.35)}'
  + '.vu-b.amber{background:rgba(255,193,69,.14);color:#ffcf6b;border-color:rgba(255,193,69,.35)}'
  + '.vu-b.green{background:rgba(70,200,130,.14);color:#6fdc9f;border-color:rgba(70,200,130,.35)}'
  + '.vu-b.red{background:rgba(255,95,85,.14);color:#ff8a80;border-color:rgba(255,95,85,.35)}'
  + '.vu-b.grey{background:rgba(160,170,200,.12);color:#b9c1da;border-color:rgba(160,170,200,.3)}'
  /* ---- section head ---- */
  + '.vu-h{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:6px 0 12px}'
  + '.vu-h h2{margin:0;font-size:22px}.vu-h p{margin:3px 0 0;color:var(--mut,#a3adc6);font-size:13px;max-width:60ch}'
  + '.vu-cnt{background:#1a2550;color:var(--gold,#e8c766);border-radius:99px;font-size:12px;font-weight:800;padding:2px 9px;margin-left:6px;vertical-align:middle}'
  /* ---- order / record card ---- */
  + '.vu-o{background:linear-gradient(180deg,#101a3a,#0d1630);border:1px solid #26335f;border-radius:16px;margin:0 0 14px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.2)}'
  + '.vu-o.new{border-color:var(--gold,#e8c766);box-shadow:0 0 0 1px rgba(232,199,102,.35),0 8px 24px rgba(232,199,102,.08)}'
  + '.vu-oh{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:13px 16px;background:#0c1431;border-bottom:1px solid #1f2b57}'
  + '.vu-no{font:800 18px Georgia,serif;color:var(--gold,#e8c766)}.vu-no small{display:block;font:600 12px system-ui,sans-serif;color:var(--mut,#a3adc6);margin-top:1px}'
  + '.vu-ob{padding:14px 16px;display:flex;flex-direction:column;gap:12px}'
  + '.vu-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'
  + '.vu-meta div{background:#0a1130;border:1px solid #1f2b57;border-radius:10px;padding:8px 11px}'
  + '.vu-meta span{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut,#a3adc6);margin-bottom:2px}'
  + '.vu-meta b{font-size:14px;font-weight:600;word-break:break-word}'
  + '.vu-items{border:1px solid #1f2b57;border-radius:12px;overflow:hidden}'
  + '.vu-it{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid #1b2650;font-size:14px}.vu-it:last-child{border-bottom:0}'
  + '.vu-q{min-width:34px;text-align:center;background:#1a2550;color:var(--gold,#e8c766);border-radius:8px;font-weight:800;font-size:13px;padding:3px 6px}'
  + '.vu-n{flex:1;min-width:0;word-break:break-word}.vu-a{color:var(--mut,#a3adc6);font-size:13px;white-space:nowrap}'
  + '.vu-tot{border-top:1px dashed #2a3866;padding-top:10px;display:flex;flex-direction:column;gap:5px}'
  + '.vu-tr{display:flex;justify-content:space-between;gap:10px;font-size:14px;color:var(--mut,#a3adc6)}.vu-tr.s{color:var(--txt,#f4f1ea);font-weight:800;font-size:17px}.vu-tr.s b{color:var(--gold,#e8c766)}'
  + '.vu-tr.neg b{color:#ff8a80}.vu-tr.pos b{color:#6fdc9f}'
  + '.vu-note{background:rgba(255,193,69,.08);border:1px solid rgba(255,193,69,.28);border-radius:10px;padding:9px 12px;font-size:13px;color:#ffe1a1}'
  + '.vu-bad{background:rgba(255,95,85,.1);border:1px solid rgba(255,95,85,.35);border-radius:10px;padding:9px 12px;font-size:13px;color:#ffb0a8}'
  + '.vu-act{display:flex;gap:8px;flex-wrap:wrap;padding:12px 16px;border-top:1px solid #1f2b57;background:#0b1230}.vu-act button{flex:1 1 150px}'
  /* ---- progress steps ---- */
  + '.vu-st{display:flex;align-items:center;gap:0;margin:2px 0}.vu-st i{flex:1;height:3px;background:#26335f}.vu-st i.d{background:var(--gold,#e8c766)}'
  + '.vu-st b{width:24px;height:24px;border-radius:50%;background:#1a2550;color:#8a95b8;font-size:11px;display:flex;align-items:center;justify-content:center;flex:none;border:2px solid #26335f}'
  + '.vu-st b.d{background:var(--gold,#e8c766);color:#080d1f;border-color:var(--gold,#e8c766)}.vu-st b.n{border-color:var(--gold,#e8c766);color:var(--gold,#e8c766)}'
  + '.vu-sl{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut,#a3adc6);margin-top:3px}'
  /* ---- tables as responsive cards ---- */
  + '.vu-tw{border:1px solid #26335f;border-radius:14px;overflow:auto;background:#0d1630;margin:0 0 14px;-webkit-overflow-scrolling:touch}'
  + '.vu-tw table{min-width:560px}.vu-tw td.r,.vu-tw th.r{text-align:right}.vu-tw td.mn{font-variant-numeric:tabular-nums;white-space:nowrap}'
  + '.vu-tw tfoot td{background:#0c1431;font-weight:800;border-top:1px solid #2a3866!important}'
  + '@media(max-width:640px){.vu-tw{border:0;background:transparent;overflow:visible}.vu-tw table{min-width:0}.vu-tw thead{display:none}'
  + '.vu-tw tr{display:block;background:#0d1630;border:1px solid #26335f;border-radius:14px;margin:0 0 10px;padding:6px 4px}.vu-tw td{display:flex;justify-content:space-between;gap:12px;border:0!important;padding:7px 12px!important;text-align:right!important}'
  + '.vu-tw td:before{content:attr(data-l);color:var(--mut,#a3adc6);font-size:11px;letter-spacing:.08em;text-transform:uppercase;text-align:left;flex:none;padding-top:2px}.vu-tw tfoot tr{background:#0c1431}}'
  /* ---- key/value panel + empty state ---- */
  + '.vu-kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 18px}.vu-kv span{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut,#a3adc6);margin-bottom:2px}.vu-kv b{font-weight:600;word-break:break-word}'
  + '.vu-em{text-align:center;padding:34px 18px;border:1px dashed #2a3866;border-radius:16px;background:rgba(13,22,48,.6);margin:0 0 14px}.vu-em .i{font-size:34px;margin-bottom:6px}.vu-em b{display:block;font-size:16px;margin-bottom:4px}.vu-em p{margin:0;color:var(--mut,#a3adc6);font-size:13px;max-width:44ch;margin-inline:auto}'
  + '.vu-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.vu-form .w2{grid-column:1/-1}.vu-form label{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut,#a3adc6);margin:0 0 4px;font-weight:700}.vu-form input,.vu-form select,.vu-form textarea{width:100%;margin:0!important}'
  + '.vu-sec{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold,#e8c766);font-weight:800;margin:18px 0 8px;display:flex;align-items:center;gap:10px}.vu-sec:after{content:"";flex:1;height:1px;background:#26335f}'
  + '.vu-tw tfoot td:empty{display:none}@media print{.vu-act,#vs-top,#vs-bar{display:none!important}}';

  function inject(){ if(D.getElementById('vu-css')) return; var s = D.createElement('style'); s.id = 'vu-css'; s.textContent = CSS; (D.head || D.documentElement).appendChild(s); }
  inject();

  /* status words -> label + colour */
  var MAP = {
    placed:['New order','blue'], pending:['Pending','amber'], awaiting_payment:['Awaiting payment','amber'], awaiting:['Awaiting','amber'], quote_pending:['Awaiting quote','amber'],
    confirmed:['Accepted','blue'], accepted:['Accepted','blue'], preparing:['Preparing','amber'], packed:['Packed','green'], ready:['Ready','green'],
    assigned:['Rider assigned','blue'], picked_up:['Picked up','blue'], out_for_delivery:['On the way','blue'], in_transit:['On the way','blue'],
    delivered:['Delivered','green'], collected:['Collected','green'], completed:['Completed','green'], paid:['Paid','green'], approved:['Approved','green'], active:['Active','green'], confirmed_paid:['Paid','green'],
    cancelled:['Cancelled','red'], canceled:['Cancelled','red'], rejected:['Rejected','red'], failed:['Failed','red'], refunded:['Refunded','grey'], expired:['Expired','grey'], draft:['Draft','grey'], suspended:['Suspended','red']
  };
  function badge(st, label){ var k = String(st || '').toLowerCase().replace(/[\s-]+/g, '_'), m = MAP[k] || [String(st || '').replace(/_/g, ' ').replace(/^./, function(c){ return c.toUpperCase(); }), 'grey'];
    return '<span class="vu-b ' + m[1] + '">' + esc(label || m[0]) + '</span>'; }

  function head(title, sub, count, right){ return '<div class="vu-h"><div><h2>' + esc(title) + (count != null ? '<span class="vu-cnt">' + esc(count) + '</span>' : '') + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (right || '') + '</div>'; }
  function sec(t){ return '<div class="vu-sec">' + esc(t) + '</div>'; }
  function empty(icon, title, text){ return '<div class="vu-em"><div class="i">' + (icon || '📭') + '</div><b>' + esc(title) + '</b>' + (text ? '<p>' + text + '</p>' : '') + '</div>'; }
  function stats(list){ return '<div class="stats">' + list.map(function(s){ return '<div class="c stat"><b' + (s.tone ? ' style="color:' + ({good:'#6fdc9f', bad:'#ff8a80', warn:'#ffcf6b'}[s.tone] || '') + '"' : '') + '>' + esc(s.value) + '</b><span class="m">' + esc(s.label) + '</span>' + (s.hint ? '<span class="m" style="text-transform:none;letter-spacing:0;font-size:12px!important">' + esc(s.hint) + '</span>' : '') + '</div>'; }).join('') + '</div>'; }
  function kv(pairs){ return '<div class="vu-kv">' + pairs.filter(function(p){ return p && p[1] != null && p[1] !== ''; }).map(function(p){ return '<div><span>' + esc(p[0]) + '</span><b>' + (p[2] === 'html' ? p[1] : esc(p[1])) + '</b></div>'; }).join('') + '</div>'; }

  /* progress steps: steps = ['Accepted','Preparing','Ready','Delivered'], at = index of current (0-based), -1 none */
  function steps(list, at){ var h = '<div class="vu-st">'; list.forEach(function(s, i){ h += (i ? '<i class="' + (i <= at ? 'd' : '') + '"></i>' : '') + '<b class="' + (i < at ? 'd' : i === at ? 'n' : '') + '">' + (i < at ? '✓' : i + 1) + '</b>'; });
    h += '</div><div class="vu-sl">' + list.map(function(s){ return '<span>' + esc(s) + '</span>'; }).join('') + '</div>'; return h; }

  /* table: cols [{k,label,r:true,money:true,date:true,html:true,badge:true,fn:function(row)}], rows [], opt {foot:[...], empty:{icon,title,text}} */
  function table(cols, rows, opt){ opt = opt || {};
    if(!rows || !rows.length){ var e = opt.empty || {}; return empty(e.icon || '📄', e.title || 'Nothing here yet', e.text || ''); }
    var cell = function(c, r){ var v = c.fn ? c.fn(r) : r[c.k]; if(c.badge) return badge(v); if(c.money) return esc(ugx(v)); if(c.date) return esc(date(v, c.time)); return c.html ? (v == null ? '' : v) : esc(v == null ? '' : v); };
    var h = '<div class="vu-tw"><table><thead><tr>' + cols.map(function(c){ return '<th class="' + (c.r || c.money ? 'r' : '') + '">' + esc(c.label) + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function(r){ h += '<tr>' + cols.map(function(c){ return '<td data-l="' + esc(c.label) + '" class="' + (c.r || c.money ? 'r ' : '') + (c.money ? 'mn' : '') + '">' + cell(c, r) + '</td>'; }).join('') + '</tr>'; });
    h += '</tbody>'; if(opt.foot) h += '<tfoot><tr>' + opt.foot.map(function(f, i){ return '<td data-l="' + esc(cols[i] ? cols[i].label : '') + '" class="' + (cols[i] && (cols[i].r || cols[i].money) ? 'r' : '') + '">' + (f == null ? '' : f) + '</td>'; }).join('') + '</tr></tfoot>';
    return h + '</table></div>'; }

  /* order card:
     {no, prefix:'#', status, statusLabel, isNew, sub:'Placed 07 Nov, 10:42',
      meta:[['Customer','Sarah'],['Phone','07…'],['Pay','MTN MoMo'], ['Where','…','html']],
      items:[{qty, name, amount}], totals:[['Subtotal',12000],['Delivery',4000],['Total',16000,'s']] (3rd: 's' strong, 'neg', 'pos'),
      steps:{list:[...], at:1}, note, warn, extra:'<html>', actions:'<button>…</button>'} */
  function order(o){ var h = '<div class="vu-o' + (o.isNew ? ' new' : '') + '"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '><div class="vu-oh"><div class="vu-no">' + esc(o.prefix == null ? '#' : o.prefix) + esc(o.no) + (o.sub ? '<small>' + esc(o.sub) + '</small>' : '') + '</div>' + (o.status != null && !o.headRight ? badge(o.status, o.statusLabel) : '') + (o.headRight || '') + '</div><div class="vu-ob">';
    if(o.steps) h += steps(o.steps.list, o.steps.at);
    if(o.meta && o.meta.length) h += '<div class="vu-meta">' + o.meta.filter(function(m){ return m && m[1] != null && m[1] !== ''; }).map(function(m){ return '<div><span>' + esc(m[0]) + '</span><b>' + (m[2] === 'html' ? m[1] : esc(m[1])) + '</b></div>'; }).join('') + '</div>';
    if(o.items && o.items.length) h += '<div class="vu-items">' + o.items.map(function(i){ return '<div class="vu-it"><span class="vu-q">' + esc(i.qty) + (i.unit === 'kg' ? ' kg' : '×') + '</span><span class="vu-n">' + esc(i.name) + (i.sub ? '<br><small style="color:var(--mut,#a3adc6)">' + esc(i.sub) + '</small>' : '') + '</span>' + (i.amount != null ? '<span class="vu-a">' + esc(ugx(i.amount)) + '</span>' : '') + '</div>'; }).join('') + '</div>';
    if(o.note) h += '<div class="vu-note">📝 ' + esc(o.note) + '</div>';
    if(o.warn) h += '<div class="vu-bad">' + o.warn + '</div>';
    if(o.extra) h += o.extra;
    if(o.totals && o.totals.length) h += '<div class="vu-tot">' + o.totals.map(function(t){ return '<div class="vu-tr ' + (t[2] || '') + '"><span>' + esc(t[0]) + '</span><b>' + (typeof t[1] === 'number' ? esc(ugx(t[1])) : esc(t[1])) + '</b></div>'; }).join('') + '</div>';
    h += '</div>' + (o.actions ? '<div class="vu-act">' + o.actions + '</div>' : '') + '</div>'; return h; }

  W.VelosUI = { esc: esc, ugx: ugx, date: date, badge: badge, head: head, sec: sec, empty: empty, stats: stats, kv: kv, steps: steps, table: table, order: order, inject: inject };
})();
