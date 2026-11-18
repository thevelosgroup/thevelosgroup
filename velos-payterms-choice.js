/* Velos: how does your business want customers to pay? (pay first, or pay on delivery). Goods sellers only. */
(function(){
  var P = window.VelosPayTerms = {};
  P.html = function(){
    var card = function(v, t, d, b, on){ return '<label class="vpc' + (on ? ' on' : '') + '" id="vptc-' + v + '"><input type="radio" name="vpt" value="' + v + '"' + (on ? ' checked' : '') + ' onchange="VelosPayTerms.sync()"><span><b>' + t + '</b><small>' + d + '</small><em>' + b + '</em></span></label>'; };
    return '<div class="vpw" id="ptBox"><h3>When should customers pay? *</h3><p class="m">Choose how your orders are paid. Customers see this before they order.</p>'
      + card('prepaid', 'Customer pays first (recommended)', 'Velos collects the full payment before you prepare the order. You only pack orders that are already paid.', 'Safest for you: no unpaid or refused orders', true)
      + card('cod', 'Pay on delivery', 'You receive the order straight away and the customer pays when it arrives.', 'Higher risk: customers may refuse or be unreachable', false)
      + '<p class="m">Velos pays you after the order is delivered, minus the agreed commission or price option. For pay-on-delivery orders, Velos pays you once the money from the customer has been received.</p></div>';
  };
  P.sync = function(){ ['prepaid', 'cod'].forEach(function(v){ var e = document.getElementById('vptc-' + v); if(e) e.className = 'vpc' + (e.querySelector('input').checked ? ' on' : ''); }); };
  P.get = function(){ var b = document.getElementById('ptBox'); if(!b || b.style.display === 'none') return ''; var r = document.querySelector('input[name=vpt]:checked'); return r ? r.value : 'prepaid'; };
  P.save = async function(db){ var m = P.get(); if(!m) return true;
    for(var i = 0; i < 3; i++){ try{ var r = await db.rpc('choose_payment_terms', {p_terms:m}); if(!r.error) return true; }catch(e){} await new Promise(function(z){ setTimeout(z, 600); }); } return false; };
  P.note = async function(db){ try{ var r = await db.rpc('my_payment_terms'); var m = r.data; if(!m) return '';
    return '<div class="c"><b>Customer payment: ' + (m === 'cod' ? 'Pay on delivery' : 'Customer pays first') + '</b><p class="m">' + (m === 'cod' ? 'Orders reach you straight away. Velos pays you after the customer\'s money has been received.' : 'Orders reach you only after Velos has verified the customer\'s full payment, so you can prepare with confidence.') + '</p></div>'; }catch(e){ return ''; } };
})();
