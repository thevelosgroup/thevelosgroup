/* Velos shared payment box: MTN and Airtel (with logos and merchant steps) and optional card. */
(function(){
  function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var GOLD='#e8c766';
  function head(brand,icon){return '<div style="display:flex;align-items:center;gap:12px"><img src="'+icon+'" alt="'+brand+'" width="44" height="44" style="border-radius:8px;flex:none;background:#fff"><b>'+brand+'</b></div>'}
  function card(brand,icon,num,name,dial){
    var merch=/merchant/i.test(num||''),id=(String(num||'').match(/\d{4,}/)||[''])[0];
    if(merch&&id)return '<div class="c">'+head(brand,icon)+'<div class="m" style="margin-top:8px">Merchant ID</div><span style="font-size:26px;letter-spacing:2px;color:'+GOLD+'">'+esc(id)+'</span><br><span class="m">Name: '+esc(name||'')+'</span>'
      +'<ol class="m" style="margin:8px 0 0 18px;padding:0">'+(brand.indexOf('Airtel')===0?'<li>Dial <b>'+dial+'</b></li><li>Enter Merchant ID <b>'+esc(id)+'</b></li><li>Enter the amount, then your PIN</li><li>Keep the confirmation message and copy its Transaction ID</li>':'<li>Dial <b>'+dial+'</b></li><li>Choose <b>Pay Merchant</b> / Merchant Payment</li><li>Enter Merchant ID <b>'+esc(id)+'</b> and the amount</li><li>Enter your PIN, then keep the confirmation message</li>')+'</ol></div>';
    if(!num)return '';
    return '<div class="c">'+head(brand,icon)+'<span style="font-size:20px;color:'+GOLD+'">'+esc(num)+'</span><br><span class="m">Name: '+esc(name||'')+'</span></div>';
  }
  /* o: {mtn_number,mtn_name,airtel_number,airtel_name,card_link,amount,ref} */
  window.VelosPayBox={
    options:function(o){var a=[];if(o.mtn_number)a.push(['mtn','Paid with MTN Mobile Money']);if(o.airtel_number)a.push(['airtel','Paid with Airtel Money']);if(/^https:\/\//.test(o.card_link||''))a.push(['card','Paid by card']);if(!a.length)a.push(['mtn','Paid with MTN Mobile Money'],['airtel','Paid with Airtel Money']);return a},
    select:function(o,id){return '<select id="'+(id||'fm')+'">'+this.options(o).map(function(x){return '<option value="'+x[0]+'">'+x[1]+'</option>'}).join('')+'</select>'},
    html:function(o){
      var h=card('MTN Mobile Money','mtn-icon.png',o.mtn_number,o.mtn_name,'*165#')+card('Airtel Money','airtel-icon.png',o.airtel_number,o.airtel_name,'*185*9#');
      if(/^https:\/\//.test(o.card_link||''))h+='<div class="c"><b>💳 Pay by card (Visa / Mastercard)</b><p class="m">Open our secure card page and pay'+(o.amount?' <b style="color:'+GOLD+'">UGX '+Math.round(o.amount).toLocaleString('en-US')+'</b>':'')+(o.ref?', using <b>'+esc(o.ref)+'</b> as the reference':'')+'. Then come back and enter the card payment reference.</p><a class="b full" style="display:block;text-align:center;text-decoration:none" href="'+esc(o.card_link)+'" target="_blank" rel="noopener">Pay by card</a></div>';
      if(!h)h='<p class="m">Payment details are being set up. Please contact Velos on WhatsApp to pay.</p>';
      return h+'<div class="m">Check that the name matches before you pay. We never ask for your PIN.</div>';
    }
  };
})();
