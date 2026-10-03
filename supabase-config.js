// Safe to publish: the URL and publishable key are designed to be public.
// NEVER put the secret / service_role key or the database password in this file.
window.VELOS_SUPABASE = {
  url: 'https://ptmedfjkapzqxltntynf.supabase.co',
  key: 'sb_publishable_LlKhxab2IeWTKm3Ojy3S2Q_rGO6jp7u'
};
// Sales-agent referral links (?ref=AG-1001) are remembered for 30 days so the sale is credited to the agent
(function(){ try { var q = new URLSearchParams(location.search).get('ref'); if(q && /^AG-\d{3,8}$/i.test(q)) localStorage.setItem('velosRef', JSON.stringify({c:q.toUpperCase(), t:Date.now()})); } catch(e){} })();
window.velosAttachRef = function(kind, no){
  try {
    var r = JSON.parse(localStorage.getItem('velosRef') || 'null'); if(!r || Date.now() - r.t > 2592000000) return;
    var S = window.VELOS_SUPABASE;
    fetch(S.url + '/rest/v1/rpc/attach_ref', {method:'POST', headers:{apikey:S.key, 'Content-Type':'application/json'}, body:JSON.stringify({p_kind:kind, p_no:Number(no), p_ref:r.c})});
  } catch(e){}
};
