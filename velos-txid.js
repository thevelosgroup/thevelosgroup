/* Mobile Money transaction ID check. The allowed number of digits is set by Velos in Admin > Food rules. */
(function(W){
  var R = { min: 9, max: 12 };
  function load(){ try { var S = W.VELOS_SUPABASE; if(!S) return; fetch(S.url + '/rest/v1/rpc/velos_txid_rule', { method: 'POST', headers: { apikey: S.key, 'Content-Type': 'application/json' }, body: '{}' }).then(function(r){ return r.json(); }).then(function(j){ if(j && j.min) R = j; }).catch(function(){}); } catch(e){} }
  W.VelosTx = {
    rule: function(){ return R; },
    check: function(v){
      v = String(v || '').replace(/\s/g, '');
      if(!v) return 'Enter the transaction ID from your Mobile Money message.';
      if(!/^[0-9]+$/.test(v)) return 'The transaction ID must contain digits only.';
      if(v.length < R.min || v.length > R.max) return 'The transaction ID should have ' + (R.min === R.max ? R.min : R.min + ' to ' + R.max) + ' digits (you typed ' + v.length + '). Please check your Mobile Money message.';
      return null;
    }
  };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load); else load();
})(window);
