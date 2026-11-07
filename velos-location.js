/* Velos exact-location picker (OpenStreetMap, free).
   VelosLoc.field(elementId, {lat, lng, text})  -> {get(): {lat,lng,text}|null}      for registration forms
   VelosLoc.card(elementId, {title, get, save}) -> shows the saved pin and lets the owner update it
       get():  Promise<{lat,lng,text}|null>      save(lat,lng,text): Promise                                          */
(function(W){
  var CSS = '.vl{border:1px solid #2a3560;border-radius:14px;padding:12px;margin:10px 0;background:rgba(232,199,102,.04)}.vl b.t{color:#e8c766}'
    + '.vl .r{display:flex;gap:6px;margin:8px 0}.vl .r input{margin:0;flex:1;min-width:0}.vl .r button{width:auto;margin:0;white-space:nowrap}'
    + '.vl .mp{height:250px;border-radius:12px;border:1px solid #2a3560;margin:8px 0}.vl .st{font-size:13px;margin:4px 0}.vl .ok{color:#6ee7a0}.vl .no{color:#ffb4a8}';
  var K = [0.3163, 32.5822];
  function $(i){ return document.getElementById(i); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function leaflet(cb){
    if(W.L) return cb();
    if(!document.getElementById('vl-css-l')){ var l = document.createElement('link'); l.id = 'vl-css-l'; l.rel = 'stylesheet'; l.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'; document.head.appendChild(l); }
    var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'; s.onload = cb; s.onerror = function(){ cb(true); }; document.head.appendChild(s);
  }
  function css(){ if(document.getElementById('vl-css')) return; var s = document.createElement('style'); s.id = 'vl-css'; s.textContent = CSS; document.head.appendChild(s); }
  var uid = 0;
  function build(box, o){
    css(); var n = ++uid, id = function(x){ return 'vl' + x + n; };
    box.innerHTML = '<div class="vl"><b class="t">📍 ' + esc(o.title || 'Exact location') + '</b><div class="m" style="font-size:13px;opacity:.85">Search your area, use GPS, or drag the pin to your exact door. Customers and Velos riders use this pin to work out the distance and the delivery fee.</div>'
      + '<div class="r"><input id="' + id('q') + '" placeholder="Search e.g. Nakasero Market, Kampala"><button type="button" id="' + id('s') + '" class="g">Search</button><button type="button" id="' + id('g') + '" class="g">📍 GPS</button></div>'
      + '<div class="mp" id="' + id('m') + '"></div><input id="' + id('t') + '" placeholder="Building, floor, landmark or directions *" value="' + esc(o.text || '') + '"><div class="st no" id="' + id('x') + '">Not pinned yet. Tap the map or use GPS.</div></div>';
    var st = {lat: o.lat != null ? +o.lat : null, lng: o.lng != null ? +o.lng : null}, map, pin;
    function status(){ var e = $(id('x')); if(!e) return; if(st.lat == null){ e.className = 'st no'; e.textContent = 'Not pinned yet. Tap the map or use GPS.'; } else { e.className = 'st ok'; e.textContent = '✔ Pinned at ' + st.lat.toFixed(5) + ', ' + st.lng.toFixed(5); } if(o.onChange) o.onChange(st); }
    function put(a, b, zoom, quiet){ st.lat = a; st.lng = b; pin.setLatLng([a, b]); map.setView([a, b], zoom || map.getZoom()); status();
      if(!quiet && !$(id('t')).value){ fetch('https://nominatim.openstreetmap.org/reverse?format=json&zoom=17&lat=' + a + '&lon=' + b).then(function(r){ return r.json(); }).then(function(j){ if(j && j.display_name && !$(id('t')).value) $(id('t')).value = j.display_name.split(',').slice(0, 3).join(',').trim(); }).catch(function(){}); } }
    leaflet(function(bad){
      var m = $(id('m')); if(!m) return; if(bad || !W.L){ m.innerHTML = '<p class="m" style="padding:12px">The map could not load. Check your internet and reload this page.</p>'; return; }
      map = L.map(m).setView(st.lat != null ? [st.lat, st.lng] : K, st.lat != null ? 17 : 12); L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap'}).addTo(map);
      pin = L.marker(st.lat != null ? [st.lat, st.lng] : K, {draggable:true}).addTo(map); pin.on('dragend', function(){ var p = pin.getLatLng(); put(p.lat, p.lng, null); }); map.on('click', function(e){ put(e.latlng.lat, e.latlng.lng, null); });
      setTimeout(function(){ map.invalidateSize(); }, 300); status();
      $(id('g')).onclick = function(){ if(!navigator.geolocation){ alert('GPS is not available. Search or tap the map.'); return; } navigator.geolocation.getCurrentPosition(function(p){ put(p.coords.latitude, p.coords.longitude, 18); }, function(){ alert('Could not get your location. Search or tap the map.'); }, {enableHighAccuracy:true, timeout:15000}); };
      $(id('s')).onclick = function(){ var q = $(id('q')).value.trim(); if(!q) return; fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ug,ke,tz,rw,bi,ss,cd,et,so&q=' + encodeURIComponent(q)).then(function(r){ return r.json(); }).then(function(j){ if(j[0]) put(+j[0].lat, +j[0].lon, 17, true); else alert('Place not found. Try another name or tap the map.'); }).catch(function(){ alert('Search is unavailable. Tap the map instead.'); }); };
      $(id('q')).addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); $(id('s')).click(); } });
    });
    return { get: function(){ if(st.lat == null) return null; return {lat: st.lat, lng: st.lng, text: ($(id('t')) || {}).value ? $(id('t')).value.trim() : ''}; }, text: function(){ var e = $(id('t')); return e ? e.value.trim() : ''; } };
  }
  W.VelosLoc = {
    field: function(elId, o){ var box = $(elId); if(!box) return null; return build(box, o || {}); },
    card: function(elId, o){ var box = $(elId); if(!box) return; box.innerHTML = '<div class="c"><p class="m">Loading location…</p></div>';
      Promise.resolve(o.get ? o.get() : null).catch(function(){ return null; }).then(function(cur){ cur = cur || {};
        box.innerHTML = '<div class="c"><div id="' + elId + '-in"></div><button type="button" class="full" id="' + elId + '-sv">Save exact location</button><p class="m" id="' + elId + '-er"></p></div>';
        var ctl = build($(elId + '-in'), {title: o.title, lat: cur.lat, lng: cur.lng, text: cur.text || cur.address || ''});
        $(elId + '-sv').onclick = function(){ var v = ctl.get(), e = $(elId + '-er'); if(!v){ e.className = 'm bad'; e.textContent = 'Please pin your location on the map first.'; return; } if(v.text.length < 3){ e.className = 'm bad'; e.textContent = 'Add a building or landmark so riders can find you.'; return; }
          e.className = 'm'; e.textContent = 'Saving…'; Promise.resolve(o.save(v.lat, v.lng, v.text)).then(function(){ e.className = 'm ok'; e.textContent = 'Saved ✓ Customers now see delivery fees from this pin.'; }).catch(function(x){ e.className = 'm bad'; e.textContent = (x && x.message) || 'Could not save'; }); };
      }); }
  };
})(window);
