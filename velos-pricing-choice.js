/* Velos pricing choice: commission OR +10% on listed prices. Used at registration (restaurants, partners, hotels). */
(function(){
  var P = window.VelosPricing = {};
  P.html = function(o){
    o = o || {}; var pct = o.pct || 'the commission stated for your business';
    var card = function(v, t, d, b){ return '<label class="vpc" id="vpc-' + v + '"><input type="radio" name="vpm" value="' + v + '" onchange="VelosPricing.sync()"><span><b>' + t + '</b><small>' + d + '</small><em>' + b + '</em></span></label>'; };
    return '<style>.vpw{margin:12px 0}.vpw h3{margin:0 0 4px;font-size:16px}.vpw .m{font-size:13px;opacity:.8;margin:0 0 8px}'
      + '.vpc{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--line,rgba(255,255,255,.18));border-radius:12px;padding:12px;margin:8px 0;cursor:pointer;background:var(--card,rgba(255,255,255,.04))}'
      + '.vpc input{margin-top:4px;width:auto;flex:none}.vpc span{display:block;flex:1}.vpc b{display:block;font-size:15px}.vpc small{display:block;font-size:13px;opacity:.85;margin-top:3px;line-height:1.4}'
      + '.vpc em{display:block;font-style:normal;font-size:12px;margin-top:6px;color:var(--gold,#d4a73a);font-weight:600}.vpc.on{border-color:var(--gold,#d4a73a);box-shadow:0 0 0 2px rgba(212,167,58,.25)}</style>'
      + '<div class="vpw"><h3>How do you want to work with Velos? *</h3><p class="m">Choose one. You can ask Velos to review this later.</p>'
      + card('commission', 'Pay Velos a commission', 'Your prices stay exactly as you set them. Velos takes ' + pct + ' of each completed order.', 'Customers see your prices, no increase')
      + card('markup', 'No commission: prices go up 10%', 'You pay Velos nothing per order. Customers see every price +10%, and you are paid the price you set.', 'You keep 100% of your own prices')
      + '<p id="vpe" class="m" style="color:#e66"></p></div>';
  };
  P.get = function(){ var r = document.querySelector('input[name=vpm]:checked'); return r ? r.value : ''; };
  P.sync = function(){ ['commission', 'markup'].forEach(function(v){ var e = document.getElementById('vpc-' + v); if(e) e.className = 'vpc' + (e.querySelector('input').checked ? ' on' : ''); }); };
  P.need = function(){ if(P.get()) return false; var e = document.getElementById('vpe'); if(e) e.textContent = 'Please choose how you want to work with Velos.'; var w = document.querySelector('.vpw'); if(w && w.scrollIntoView) w.scrollIntoView({block:'center'}); return true; };
  P.save = async function(db, kind, model){
    model = model || P.get(); if(!model) return;
    for(var i = 0; i < 3; i++){ try{ var r = await db.rpc('choose_pricing_model', {p_kind:kind, p_model:model}); if(!r.error) return true; }catch(e){} await new Promise(function(z){ setTimeout(z, 600); }); }
    return false;
  };
  P.note = async function(db){
    try{ var r = await db.rpc('my_pricing_model'); var d = r.data || {}; if(!d.model || d.model === 'legacy') return '';
      return '<div class="c"><b>Your pricing option: ' + (d.model === 'markup' ? 'No commission, prices +' + d.markup + '%' : 'Commission ' + (d.commission != null ? d.commission + '%' : '')) + '</b><p class="m">' + (d.model === 'markup'
        ? 'Customers see your prices plus ' + d.markup + '%. You are paid the price you set. Velos takes no commission.'
        : 'Customers see your prices exactly as you set them. Velos takes its commission from each completed order.') + '</p></div>'; }catch(e){ return ''; }
  };
})();
