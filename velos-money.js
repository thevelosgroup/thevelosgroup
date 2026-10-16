/* Velos currency: shows prices in the visitor's local currency (display only). All payments are made in UGX. */
(function(){
  var CC = {UG:'UGX',KE:'KES',TZ:'TZS',RW:'RWF',BI:'BIF',SS:'SSP',ET:'ETB',CD:'CDF',SO:'SOS',US:'USD',GB:'GBP',CA:'CAD',AU:'AUD',ZA:'ZAR',NG:'NGN',GH:'GHS',AE:'AED',SA:'SAR',IN:'INR',CN:'CNY',JP:'JPY',CH:'CHF',SE:'SEK',NO:'NOK',DK:'DKK',
    DE:'EUR',FR:'EUR',IT:'EUR',ES:'EUR',NL:'EUR',BE:'EUR',IE:'EUR',PT:'EUR',AT:'EUR',FI:'EUR',GR:'EUR'};
  var LIST = ['UGX','KES','TZS','RWF','USD','EUR','GBP','CAD','AUD','ZAR','AED','INR','CNY'];
  var ZERO = {UGX:1,KES:1,TZS:1,RWF:1,BIF:1,CDF:1,SOS:1,JPY:1,NGN:1}, rates = null, cur = 'UGX';
  function ugx(n){ return 'UGX ' + Math.round(n || 0).toLocaleString('en-US'); }
  function money(n){
    n = Number(n) || 0; if(cur === 'UGX' || !rates || !rates[cur]) return ugx(n);
    var v = n * rates[cur]; try { return new Intl.NumberFormat('en-US', {style:'currency', currency:cur, maximumFractionDigits:ZERO[cur] ? 0 : 2, minimumFractionDigits:ZERO[cur] ? 0 : 2}).format(v); } catch(e){ return cur + ' ' + v.toFixed(2); }
  }
  function both(n){ return cur === 'UGX' || !rates || !rates[cur] ? ugx(n) : ugx(n) + ' (≈ ' + money(n) + ')'; }
  function changed(){ try { if(window.renderProducts) window.renderProducts(); if(window.updateCartUI) window.updateCartUI(); } catch(e){} window.dispatchEvent(new Event('velos-currency')); }
  function set(c){ cur = c; try { localStorage.setItem('velosCur', c); } catch(e){} if(c !== 'UGX' && !rates) loadRates(changed); else changed(); }
  function loadRates(cb){
    try { var c = JSON.parse(localStorage.getItem('velosFx') || 'null'); if(c && Date.now() - c.t < 43200000){ rates = c.r; return cb && cb(); } } catch(e){}
    fetch('https://open.er-api.com/v6/latest/UGX').then(function(r){ return r.json(); }).then(function(j){ if(j && j.rates){ rates = j.rates; try { localStorage.setItem('velosFx', JSON.stringify({t:Date.now(), r:rates})); } catch(e){} } cb && cb(); }).catch(function(){ cb && cb(); });
  }
  function detect(cb){
    var saved = null; try { saved = localStorage.getItem('velosCur'); } catch(e){} if(saved){ cur = saved; return cb(); }
    function fromTz(){ var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch(e){}
      var m = {'Africa/Kampala':'UG','Africa/Nairobi':'KE','Africa/Dar_es_Salaam':'TZ','Africa/Kigali':'RW','Africa/Bujumbura':'BI','Africa/Juba':'SS','Africa/Addis_Ababa':'ET','Africa/Lagos':'NG','Africa/Johannesburg':'ZA','Europe/London':'GB','Asia/Dubai':'AE','Asia/Kolkata':'IN'};
      var cc = m[tz] || ((navigator.language || '').split('-')[1] || '').toUpperCase(); return CC[cc] || (/^Europe\//.test(tz) ? 'EUR' : /^America\//.test(tz) ? 'USD' : 'UGX'); }
    fetch('https://api.country.is/').then(function(r){ return r.json(); }).then(function(j){ cur = CC[j.country] || fromTz(); cb(); }).catch(function(){ cur = fromTz(); cb(); });
  }
  function picker(){
    var s = document.createElement('select'); s.setAttribute('aria-label', 'Currency'); s.style.cssText = 'background:#0f1730;color:#e8c766;border:1px solid #2a3560;border-radius:8px;padding:4px 6px;font:600 12px system-ui';
    var opts = LIST.slice(); if(opts.indexOf(cur) < 0) opts.unshift(cur); s.innerHTML = opts.map(function(c){ return '<option' + (c === cur ? ' selected' : '') + '>' + c + '</option>'; }).join(''); s.onchange = function(){ set(s.value); }; return s;
  }
  window.velosMoney = money; window.velosBoth = both; window.velosUGX = ugx; window.velosCurrencyPicker = picker; window.velosCurrency = function(){ return cur; };
  detect(function(){ if(cur !== 'UGX') loadRates(changed); else changed(); });
})();
