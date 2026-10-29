/* Velos Foods Partner Approval & Agreement (PDF). Used by admin.html and restaurant.html.
   VelosApproval.build(data, opts) -> {doc, no, file, name}   VelosApproval.save(r)   VelosApproval.share(r)
   data: {name, owner, phone, email, address, lat, lng, commission_pct, approval_no, approved_at, kind} */
(function(W){
  var NV=[3,17,62],GD=[212,175,55],TX=[30,35,50],GR=[110,118,140],LT=[244,246,251],PW=210;
  var DEF_CO={name:'The Velos Group',tag:'Anything. Anywhere. Precisely.',lines:['Kampala, Uganda','Tel / WhatsApp: +256 755 215 751'],foot:'Thank you for partnering with The Velos Group'};
  function lib(){return new Promise(function(ok,bad){if(W.jspdf)return ok();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';s.onload=ok;s.onerror=function(){bad(Error('Could not load the PDF tool. Check your internet and try again.'))};document.head.appendChild(s)})}
  function img(src,type,size){return new Promise(function(res){var i=new Image();i.onload=function(){try{var c=document.createElement('canvas');c.width=size?size:i.naturalWidth;c.height=size?size:i.naturalHeight;var x=c.getContext('2d');if(type==='jpeg'){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height)}x.drawImage(i,0,0,c.width,c.height);res(c.toDataURL(type==='jpeg'?'image/jpeg':'image/png',.92))}catch(e){res(null)}};i.onerror=function(){res(null)};i.src=src})}
  function dmy(d){try{return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}catch(e){return ''}}
  function clean(s){return String(s==null?'':s).replace(/[^\x20-\x7E -ÿ]/g,'').trim()}
  async function build(d,o){
    o=o||{};var CO=o.co||DEF_CO;await lib();
    var logo=await img('icon-512.png','jpeg',256),sig=await img('signature.png','png');
    var J=W.jspdf.jsPDF,doc=new J({unit:'mm',format:'a4'}),page=1;
    var no=d.approval_no||'DRAFT',name=clean(d.name)||'Restaurant',owner=clean(d.owner)||'Authorised representative';
    function foot(p){doc.setFillColor(NV[0],NV[1],NV[2]);doc.rect(0,284,PW,13,'F');doc.setFillColor(GD[0],GD[1],GD[2]);doc.rect(0,284,PW,.8,'F');doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(232,199,102);doc.text((CO.foot||DEF_CO.foot)+(CO.tag?'  |  '+CO.tag:''),PW/2,291,{align:'center'});doc.setTextColor(180,190,215);doc.text('Page '+p,195,291,{align:'right'})}
    doc.setFillColor(NV[0],NV[1],NV[2]);doc.rect(0,0,PW,40,'F');doc.setFillColor(GD[0],GD[1],GD[2]);doc.rect(0,40,PW,1.4,'F');if(logo){try{doc.addImage(logo,'JPEG',15,8,24,24)}catch(e){}}
    doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(17);doc.text(CO.name,44,17);doc.setFont('helvetica','italic');doc.setFontSize(9);doc.setTextColor(232,199,102);doc.text(CO.tag||'',44,23);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(190,200,225);(CO.lines||[]).slice(0,4).forEach(function(l,i){doc.text(l,44,29+i*3.8)});
    doc.setFont('helvetica','bold');doc.setFontSize(11);doc.setTextColor(232,199,102);doc.text(doc.splitTextToSize('VELOS FOODS PARTNER APPROVAL & AGREEMENT',70),195,13,{align:'right'});doc.setFontSize(10);doc.setTextColor(255,255,255);doc.text('Ref '+no,195,31,{align:'right'});doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.text('Approved '+(d.approved_at?dmy(d.approved_at):dmy(new Date())),195,36,{align:'right'});
    var y=54;doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(TX[0],TX[1],TX[2]);
    doc.splitTextToSize('The Velos Group is pleased to confirm that the restaurant named below has been approved as a partner on Velos Foods, and may now receive and fulfil customer orders through the Velos platform, subject to the terms in this agreement.',180).forEach(function(l){doc.text(l,15,y);y+=5});
    y+=4;doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(GR[0],GR[1],GR[2]);doc.text('PARTNER DETAILS',15,y);y+=4;
    var rows=[['Restaurant name',name],['Owner / authorised person',owner],['Phone / WhatsApp',clean(d.phone)],['Email',clean(d.email)],['Location',clean(d.address)],['Map position',(d.lat!=null&&d.lng!=null)?(Number(d.lat).toFixed(5)+', '+Number(d.lng).toFixed(5)):''],['Approval number',no],['Approval date',d.approved_at?dmy(d.approved_at):dmy(new Date())],['Velos commission',d.commission_pct!=null?d.commission_pct+'% of completed order value':'']].filter(function(r){return r[1]});
    rows.forEach(function(r,i){var ls=doc.splitTextToSize(r[1],118),h=Math.max(7.5,ls.length*4.6+3.4);if(i%2===0){doc.setFillColor(LT[0],LT[1],LT[2]);doc.rect(15,y,180,h,'F')}doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(GR[0],GR[1],GR[2]);doc.text(r[0],18,y+5);doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.setTextColor(TX[0],TX[1],TX[2]);ls.forEach(function(l,k){doc.text(l,72,y+5+k*4.6)});y+=h});
    y+=7;doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(GR[0],GR[1],GR[2]);doc.text('TERMS OF PARTNERSHIP',15,y);y+=5;
    var T=['Orders and preparation. The restaurant will respond to new orders promptly, set realistic preparation times and have orders ready on time. Repeated lateness may attract penalties.',
      'Availability. The restaurant will keep item availability up to date. Cancelling a confirmed order because an item is out of stock may attract a penalty.',
      'Prices and commission. Menu prices are managed by The Velos Group in agreement with the restaurant. Velos deducts the commission shown above from completed orders.',
      'Payouts. Earnings are paid to the restaurant on a regular schedule, currently weekly, to the payout account registered with Velos.',
      'Registration fee. The one-time registration fee is non-refundable once the restaurant has been approved.',
      'Food quality and safety. The restaurant will follow food hygiene standards, hold any licences required by law and prepare orders exactly as listed.',
      'Customer information. Customer details are used only to fulfil and support the order and must not be shared or used for any other purpose.',
      'Suspension. Velos may switch off or suspend a restaurant that breaches these terms or that receives repeated serious customer complaints.',
      'General. This agreement is governed by the laws of Uganda and is read together with the Velos Terms of Service published on the Velos website.'];
    doc.setFontSize(9);T.forEach(function(t,i){var ls=doc.splitTextToSize((i+1)+'. '+t,180);if(y+ls.length*4.4>268){foot(page);doc.addPage();page++;y=22}doc.setFont('helvetica','normal');doc.setTextColor(TX[0],TX[1],TX[2]);ls.forEach(function(l){doc.text(l,15,y);y+=4.4});y+=1.6});
    y+=4;if(y>225){foot(page);doc.addPage();page++;y=30}
    doc.setFont('helvetica','normal');doc.setFontSize(8.5);doc.setTextColor(GR[0],GR[1],GR[2]);doc.splitTextToSize('By signing below, the restaurant representative confirms that the details above are correct and agrees to these terms. Please sign, and send a signed copy to The Velos Group on WhatsApp or email.',180).forEach(function(l){doc.text(l,15,y);y+=4.2});
    var sy=y+30;if(sy>262){foot(page);doc.addPage();page++;sy=60}
    if(sig){try{doc.addImage(sig,'PNG',20,sy-25,36,24.2)}catch(e){}}
    doc.setDrawColor(GR[0],GR[1],GR[2]);doc.setLineWidth(.3);doc.line(15,sy,75,sy);doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(TX[0],TX[1],TX[2]);doc.text(CO.name,15,sy+4.5);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(GR[0],GR[1],GR[2]);doc.text('Authorised signature',15,sy+8.8);doc.text('Date: '+(d.approved_at?dmy(d.approved_at):dmy(new Date())),15,sy+13.5);
    doc.line(135,sy,195,sy);doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(TX[0],TX[1],TX[2]);doc.text(owner+' ('+name+')',135,sy+4.5);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(GR[0],GR[1],GR[2]);doc.text('Restaurant representative signature',135,sy+8.8);doc.text('Date: ........ / ........ / ............',135,sy+13.5);
    foot(page);
    var fname=('Velos-Partner-Approval-'+no+'-'+name).replace(/[^\w-]+/g,'-').replace(/-+/g,'-')+'.pdf',file=new File([doc.output('blob')],fname,{type:'application/pdf'});
    return {doc:doc,no:no,file:file,name:fname};
  }
  function save(r){var u=URL.createObjectURL(r.file),a=document.createElement('a');a.href=u;a.download=r.name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)}
  async function share(r){try{if(navigator.canShare&&navigator.canShare({files:[r.file]})){await navigator.share({files:[r.file],title:r.name,text:'Velos Foods Partner Approval '+r.no});return true}save(r);return false}catch(e){if(e.name!=='AbortError')throw e;return true}}
  W.VelosApproval={build:build,save:save,share:share};
})(window);
