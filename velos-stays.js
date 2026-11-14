/* Velos Stays: shared helpers for hotels.html, stay.html and my-booking.html */
(function(W){
  var AM = {wifi:['📶','Free WiFi'], ac:['❄️','Air conditioning'], parking:['🅿️','Parking'], pool:['🏊','Swimming pool'], restaurant:['🍽️','Restaurant'], bar:['🍸','Bar'], breakfast:['🥐','Breakfast available'],
    shuttle:['🚐','Airport shuttle'], gym:['🏋️','Gym'], spa:['💆','Spa'], reception:['🛎️','24-hour reception'], roomservice:['🧾','Room service'], laundry:['🧺','Laundry'], conference:['🎤','Conference rooms'],
    power:['🔌','Backup power'], security:['🛡️','24-hour security'], garden:['🌳','Garden'], view:['🌅','Lake or city view'], family:['👨‍👩‍👧','Family rooms'], pets:['🐾','Pets allowed'], access:['♿','Wheelchair accessible'], tv:['📺','TV'], kitchen:['🍳','Kitchen']};
  var TYPES = {hotel:'Hotel', lodge:'Lodge', guest_house:'Guest house', apartment:'Apartment', resort:'Resort', villa:'Villa', hostel:'Hostel', venue:'Event venue'};
  var POL = {flexible:['Flexible', 'Full refund of what you paid if you cancel at least 1 day before check-in. No refund after that.'],
    moderate:['Moderate', 'Full refund if you cancel at least 5 days before check-in. 50% refund from 2 to 4 days before. No refund after that.'],
    strict:['Strict', 'Full refund if you cancel at least 14 days before check-in. 50% refund from 7 to 13 days before. No refund after that.'],
    nonrefundable:['Non-refundable', 'This booking cannot be refunded once made.']};
  var ISO = {Uganda:'UG', Kenya:'KE', Tanzania:'TZ', Rwanda:'RW', Burundi:'BI', 'South Sudan':'SS', 'DR Congo':'CD', Ethiopia:'ET', Somalia:'SO'};
  var COUNTRIES = ['Uganda','Kenya','Tanzania','Rwanda','Burundi','South Sudan','DR Congo','Ethiopia','Somalia','South Africa','Nigeria','Ghana','Egypt','Morocco','United Kingdom','Ireland','France','Germany','Netherlands','Belgium','Italy','Spain','Switzerland','Sweden','Norway','Denmark','United States','Canada','Australia','New Zealand','India','Pakistan','China','Japan','South Korea','Singapore','United Arab Emirates','Saudi Arabia','Qatar','Kuwait','Oman','Bahrain','Turkey','Brazil','Mexico'];
  var FX = {UGX:1}, CUR = 'UGX';
  try { CUR = localStorage.getItem('velos_cur') || 'UGX'; } catch(e){}
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function loadFx(db){ return db.rpc('hotel_fx').then(function(r){ var d = r.data || {}; Object.keys(d).forEach(function(k){ FX[k] = Number(d[k]); }); if(!FX[CUR]) CUR = 'UGX'; return FX; }, function(){ return FX; }); }
  function ugx(n){ return 'UGX ' + Math.round(Number(n) || 0).toLocaleString('en-US'); }
  function money(n, cur){ cur = cur || CUR; n = Number(n) || 0; if(cur === 'UGX' || !FX[cur]) return ugx(n); var v = n / FX[cur]; return '≈ ' + cur + ' ' + (v >= 100 ? Math.round(v) : v.toFixed(2)).toLocaleString('en-US'); }
  function both(n){ return CUR === 'UGX' ? '<b>' + ugx(n) + '</b>' : '<b>' + money(n) + '</b><span class="mu"> (' + ugx(n) + ')</span>'; }
  function curSelect(id, onchange){ return '<select id="' + id + '" aria-label="Currency" onchange="' + onchange + '">' + Object.keys(FX).sort(function(a, b){ return a === 'UGX' ? -1 : b === 'UGX' ? 1 : a < b ? -1 : 1; }).map(function(c){ return '<option' + (c === CUR ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select>'; }
  function setCur(c){ CUR = FX[c] ? c : 'UGX'; try { localStorage.setItem('velos_cur', CUR); } catch(e){} }
  function stars(n){ n = Number(n) || 0; return n ? '<span class="gold" aria-label="' + n + ' star">' + '★'.repeat(n) + '</span>' : ''; }
  function ymd(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function today(){ return ymd(new Date(Date.now() + 3 * 3600000 - new Date().getTimezoneOffset() * -60000 * 0)); }
  function addDays(s, n){ var d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return ymd(d); }
  function nights(a, b){ return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); }
  function fd(s, long){ return s ? new Date(s + 'T00:00:00').toLocaleDateString('en-GB', long ? {weekday:'long', day:'numeric', month:'long', year:'numeric'} : {weekday:'short', day:'numeric', month:'short'}) : ''; }
  function amen(list, max){ return (list || []).slice(0, max || 99).map(function(k){ var a = AM[k]; return a ? '<span class="am">' + a[0] + ' ' + a[1] + '</span>' : ''; }).join(''); }
  function ld(obj){ var s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-dyn', '1'); s.textContent = JSON.stringify(obj); document.head.appendChild(s); }
  function meta(title, desc, img, url){ document.title = title; var set = function(sel, attr, v){ var e = document.querySelector(sel); if(e && v) e.setAttribute(attr, v); };
    set('meta[name=description]', 'content', desc); set('meta[property="og:title"]', 'content', title); set('meta[property="og:description"]', 'content', desc); set('meta[property="og:image"]', 'content', img); set('meta[property="og:url"]', 'content', url); set('link[rel=canonical]', 'href', url); }
  function sched(){ return '<script>'; }
  W.VelosStays = {AM:AM, TYPES:TYPES, POL:POL, ISO:ISO, COUNTRIES:COUNTRIES, FX:FX, esc:esc, loadFx:loadFx, ugx:ugx, money:money, both:both, curSelect:curSelect, setCur:setCur, cur:function(){ return CUR; }, stars:stars, ymd:ymd, today:today, addDays:addDays, nights:nights, fd:fd, amen:amen, ld:ld, meta:meta};
})(window);
