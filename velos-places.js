/* Velos Places: find any address, area or landmark by typing, like Google Maps, with live suggestions.
   Works for ordering for someone else: type their area (for example "Bukoto, Kampala"), paste a location link they shared, or type coordinates.
   - With a Google Maps key in velos-maps-config.js (velos-maps-config.js) it uses Google Places (best accuracy).
   - Without a key it uses OpenStreetMap data (free) with Kampala-first ranking.
   VelosPlaces.attach(inputEl, {onPick:function(lat, lng, label){}, center:[lat,lng]})      VelosPlaces.search(q)->Promise<[{label,sub,lat,lng}]>
   VelosPlaces.parse(text)->{lat,lng}|null      VelosPlaces.reverse(lat,lng)->Promise<string>      VelosPlaces.receiver(containerEl)->{get():{name,phone,on}} */
(function(W, D){
  var KLA = [0.3476, 32.5825], BBOX = '29.4,-1.6,35.1,4.4';
  var CSS = '.vpl{position:relative}.vpl-dd{position:absolute;left:0;right:0;top:100%;z-index:2147480000;background:#0b1226;border:1px solid #2f3c74;border-radius:12px;margin-top:4px;box-shadow:0 14px 34px rgba(0,0,0,.55);max-height:300px;overflow:auto}'
    + '.vpl-dd div{padding:10px 12px;border-bottom:1px solid #1c2750;cursor:pointer;font-size:14.5px;line-height:1.3;color:#f4f1ea}.vpl-dd div:last-child{border:0}.vpl-dd div:hover,.vpl-dd div.on{background:#16224b}.vpl-dd small{display:block;color:#9fb0e0;font-size:12.5px;margin-top:2px}'
    + '.vpl-dd .vh{cursor:default;color:#9fb0e0;font-size:12.5px}.vpl-dd .vh:hover{background:transparent}.vpl-rc{border:1px dashed #3a4a85;border-radius:12px;padding:10px;margin:8px 0}.vpl-rc label{display:flex;gap:8px;align-items:center;font-size:14px;color:#e8c766}.vpl-rc input[type=checkbox]{width:auto;margin:0}';
  function css(){ if(D.getElementById('vpl-css')) return; var s = D.createElement('style'); s.id = 'vpl-css'; s.textContent = CSS; D.head.appendChild(s); }
  function key(){ return W.VELOS_MAPS_KEY || (W.VELOS_SITE && W.VELOS_SITE.googleMapsKey) || ''; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function ok(a, b){ return isFinite(a) && isFinite(b) && Math.abs(a) <= 90 && Math.abs(b) <= 180 && !(a === 0 && b === 0); }

  /* shared links and coordinates (WhatsApp / Google Maps locations) */
  function parse(t){ t = decodeURIComponent(String(t || '').trim()).replace(/\+/g, ' '); var m;
    if((m = t.match(/^\s*(-?\d{1,2}\.\d+)\s*[, ]\s*(-?\d{1,3}\.\d+)\s*$/)) && ok(+m[1], +m[2])) return {lat:+m[1], lng:+m[2]};
    if(!/https?:\/\/|maps|goo\.gl/i.test(t)) return null;
    var pats = [/[?&](?:q|ll|query|destination|center)=(-?\d{1,2}\.\d+)[,%2C\s]+(-?\d{1,3}\.\d+)/i, /@(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/, /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/, /\/place\/(-?\d{1,2}\.\d+),(-?\d{1,3}\.\d+)/, /[\/=](-?\d{1,2}\.\d{3,}),(-?\d{1,3}\.\d{3,})/];
    for(var i = 0; i < pats.length; i++){ m = t.match(pats[i]); if(m && ok(+m[1], +m[2])) return {lat:+m[1], lng:+m[2]}; }
    return null; }

  function j(url, opt){ return fetch(url, opt).then(function(r){ if(!r.ok) throw new Error('http ' + r.status); return r.json(); }); }
  function uniq(list){ var seen = {}, out = []; list.forEach(function(x){ var k = (x.label + '|' + x.lat.toFixed(3) + '|' + x.lng.toFixed(3)).toLowerCase(); if(!seen[k]){ seen[k] = 1; out.push(x); } }); return out; }
  function kmTo(c, x){ var dx = (x.lng - c[1]) * 111 * Math.cos(c[0] * Math.PI / 180), dy = (x.lat - c[0]) * 111; return Math.sqrt(dx * dx + dy * dy); }

  function google(q, c){ var K = key(); if(!K) return Promise.reject();
    return j('https://places.googleapis.com/v1/places:autocomplete', {method:'POST', headers:{'Content-Type':'application/json', 'X-Goog-Api-Key':K, 'X-Goog-FieldMask':'suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat'},
      body:JSON.stringify({input:q, includedRegionCodes:['ug', 'ke', 'rw', 'tz'], locationBias:{circle:{center:{latitude:c[0], longitude:c[1]}, radius:40000}}})}).then(function(r){
      return (r.suggestions || []).filter(function(s){ return s.placePrediction; }).slice(0, 6).map(function(s){ var p = s.placePrediction, f = p.structuredFormat || {}; return {label:(f.mainText && f.mainText.text) || '', sub:(f.secondaryText && f.secondaryText.text) || '', pid:p.placeId}; }); }); }
  function googleDetail(pid){ return j('https://places.googleapis.com/v1/places/' + encodeURIComponent(pid), {headers:{'X-Goog-Api-Key':key(), 'X-Goog-FieldMask':'location,displayName,formattedAddress'}}).then(function(r){ return {lat:r.location.latitude, lng:r.location.longitude, label:(r.displayName && r.displayName.text) || '', sub:r.formattedAddress || ''}; }); }
  function photon(q, c){ return j('https://photon.komoot.io/api/?limit=8&lang=en&bbox=' + BBOX + '&lat=' + c[0] + '&lon=' + c[1] + '&q=' + encodeURIComponent(q)).then(function(r){
    return (r.features || []).map(function(f){ var p = f.properties || {}, g = f.geometry && f.geometry.coordinates; if(!g) return null; var name = p.name || [p.housenumber, p.street].filter(Boolean).join(' ') || p.suburb || p.district || p.city || '';
      var sub = [p.street && p.name ? p.street : '', p.suburb || p.district, p.city || p.county, p.country].filter(Boolean).join(', '); return name ? {label:name, sub:sub, lat:g[1], lng:g[0]} : null; }).filter(Boolean); }); }
  function nomi(q, c){ return j('https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&countrycodes=ug,ke,tz,rw,bi,ss,cd&viewbox=32.35,0.55,32.85,0.05&q=' + encodeURIComponent(q)).then(function(r){
    return (r || []).map(function(x){ var a = x.address || {}, parts = (x.display_name || '').split(','); return {label:parts[0].trim(), sub:parts.slice(1, 4).join(',').trim(), lat:+x.lat, lng:+x.lon}; }); }); }

  function search(q, center){ q = String(q || '').trim(); var c = center || KLA; if(q.length < 2) return Promise.resolve([]);
    var p = parse(q); if(p) return Promise.resolve([{label:'Shared location', sub:p.lat.toFixed(5) + ', ' + p.lng.toFixed(5), lat:p.lat, lng:p.lng, exact:true}]);
    var jobs = key() ? [google(q, c)] : [photon(q, c), /kampala|entebbe|wakiso|mukono|jinja|nairobi|kigali/i.test(q) ? Promise.resolve([]) : photon(q + ' Kampala', c), nomi(q, c)];
    return Promise.all(jobs.map(function(x){ return x.catch(function(){ return []; }); })).then(function(rs){ var all = uniq([].concat.apply([], rs));
      if(!key()) all.sort(function(a, b){ return kmTo(c, a) - kmTo(c, b); }); return all.slice(0, 7); }); }
  function pick(x){ return x.pid ? googleDetail(x.pid).then(function(d){ return d; }) : Promise.resolve(x); }
  function reverse(a, b){ var K = key();
    if(K) return j('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + a + ',' + b + '&key=' + K).then(function(r){ return (r.results && r.results[0] && r.results[0].formatted_address || '').split(',').slice(0, 3).join(',').trim(); }).catch(function(){ return ''; });
    return j('https://nominatim.openstreetmap.org/reverse?format=json&zoom=18&lat=' + a + '&lon=' + b).then(function(r){ return (r && r.display_name || '').split(',').slice(0, 3).join(',').trim(); }).catch(function(){ return ''; }); }

  function attach(inp, o){ if(!inp || inp.__vpl) return; inp.__vpl = 1; o = o || {}; css();
    var wrap = D.createElement('div'); wrap.className = 'vpl'; inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp); var dd = D.createElement('div'); dd.className = 'vpl-dd'; dd.style.display = 'none'; wrap.appendChild(dd);
    inp.setAttribute('autocomplete', 'off'); var T, seq = 0, cur = [], sel = -1;
    function hide(){ dd.style.display = 'none'; sel = -1; }
    function choose(x){ hide(); pick(x).then(function(d){ if(!d) return; inp.value = d.exact ? '' : (d.label + (d.sub ? ', ' + d.sub.split(',').slice(0, 2).join(',') : '')); if(o.onPick) o.onPick(d.lat, d.lng, d.label, d); }).catch(function(){ if(o.onError) o.onError('We could not open that place. Try another name or tap the map.'); }); }
    function render(list, q){ cur = list; sel = -1; if(!list.length && /goo\.gl|maps\.app/i.test(q)){ dd.innerHTML = '<div class="vh">This short link cannot be read here. Ask them to use WhatsApp &gt; Share &gt; <b>Location</b> and copy the long link, or search their area name instead.</div>'; dd.style.display = ''; return; }
      if(!list.length){ dd.innerHTML = '<div class="vh">No match yet. Try the area name, a nearby landmark or shop, or paste a shared location link.</div>'; dd.style.display = ''; return; }
      dd.innerHTML = list.map(function(x, i){ return '<div data-i="' + i + '">📍 <b>' + esc(x.label) + '</b>' + (x.sub ? '<small>' + esc(x.sub) + '</small>' : '') + '</div>'; }).join('') + '<div class="vh">Not the right place? Add more detail, or drag the pin on the map.</div>'; dd.style.display = '';
      dd.querySelectorAll('[data-i]').forEach(function(e){ e.onmousedown = e.ontouchstart = function(ev){ ev.preventDefault(); choose(cur[+e.getAttribute('data-i')]); }; }); }
    function run(){ var q = inp.value.trim(), my = ++seq; if(q.length < 3 && !parse(q)){ hide(); return; } search(q, o.center && (typeof o.center === 'function' ? o.center() : o.center)).then(function(l){ if(my === seq) render(l, q); }); }
    inp.addEventListener('input', function(){ clearTimeout(T); T = setTimeout(run, 320); });
    inp.addEventListener('focus', function(){ if(cur.length && inp.value.trim().length >= 3) dd.style.display = ''; });
    inp.addEventListener('blur', function(){ setTimeout(hide, 180); });
    inp.addEventListener('keydown', function(e){ var it = dd.querySelectorAll('[data-i]');
      if(e.key === 'ArrowDown' && it.length){ e.preventDefault(); sel = Math.min(it.length - 1, sel + 1); it.forEach(function(x, i){ x.className = i === sel ? 'on' : ''; }); }
      else if(e.key === 'ArrowUp' && it.length){ e.preventDefault(); sel = Math.max(0, sel - 1); it.forEach(function(x, i){ x.className = i === sel ? 'on' : ''; }); }
      else if(e.key === 'Enter'){ e.preventDefault(); if(sel >= 0 && cur[sel]) choose(cur[sel]); else search(inp.value, o.center && (typeof o.center === 'function' ? o.center() : o.center)).then(function(l){ if(l[0]) choose(l[0]); else if(o.onError) o.onError('Place not found. Try the area or a landmark, or tap the map.'); }); } });
    return {go:function(){ inp.dispatchEvent(new KeyboardEvent('keydown', {key:'Enter'})); }}; }

  /* "this order is for someone else" */
  function receiver(box){ css(); if(!box) return null; box.innerHTML = '<div class="vpl-rc"><label><input type="checkbox" id="vpr-on"> This order is for someone else</label><div id="vpr-f" style="display:none"><input id="vpr-n" placeholder="Receiver\'s name *"><input id="vpr-p" type="tel" placeholder="Receiver\'s phone *"><div style="font-size:12.5px;color:#9fb0e0">The rider will call the receiver at this address.</div></div></div>';
    var on = box.querySelector('#vpr-on'); on.onchange = function(){ box.querySelector('#vpr-f').style.display = on.checked ? '' : 'none'; };
    return {get:function(){ return {on:on.checked, name:box.querySelector('#vpr-n').value.trim(), phone:box.querySelector('#vpr-p').value.trim()}; },
      label:function(){ var r = this.get(); return r.on ? 'For ' + r.name + ' (' + r.phone + ')' : ''; },
      error:function(){ var r = this.get(); if(!r.on) return ''; if(r.name.length < 2 || r.phone.replace(/\D/g, '').length < 7) return 'Please add the receiver\'s name and phone number.'; return ''; }}; }
  W.VelosPlaces = {attach:attach, search:search, parse:parse, reverse:reverse, receiver:receiver, hasGoogle:function(){ return !!key(); }};
})(window, document);
