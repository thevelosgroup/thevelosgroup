/* Velos people documents: standard agreements (already counter-signed by Velos) and photo ID cards
   for riders, sales agents and technicians. Uses jsPDF, signature.png and icon-512.png.
   VelosPeople.agreement(kind, p)  -> {doc, file, name, no}
   VelosPeople.idCard(kind, p)     -> {doc, file, name, no}
   VelosPeople.save(r)  VelosPeople.share(r)
   kind: 'rider' | 'agent' | 'technician'
   p: {name, phone, id_number, ref, city, vehicle, plate, trade, commission_pct, issued_at, photo (data URL, optional)} */
(function (W) {
  var NV = [3, 17, 62], GD = [212, 175, 55], TX = [30, 35, 50], GR = [110, 118, 140], LT = [244, 246, 251];
  var SITE = 'https://thevelosgroup.com', PHONE = '+256 755 215 751';
  var ROLE = { rider: 'Delivery Rider', agent: 'Sales Agent', technician: 'Technician' };
  var CARDROLE = { rider: 'RIDER', agent: 'SALES AGENT', technician: 'TECHNICIAN' };
  var TITLE = { rider: 'RIDER SERVICE AGREEMENT', agent: 'SALES AGENT AGREEMENT', technician: 'TECHNICIAN PARTNER AGREEMENT' };

  function loadFirst(urls, ready, ms) { return new Promise(function (ok, bad) { if (ready()) return ok(); var i = 0; (function next() { if (i >= urls.length) return bad(Error('The document tool could not load. Check your internet connection and try again.')); var s = document.createElement('script'), done = false, t = setTimeout(function () { if (!done) { done = true; s.remove(); next(); } }, ms || 12000); s.src = urls[i++]; s.onload = function () { if (done) return; done = true; clearTimeout(t); ready() ? ok() : next(); }; s.onerror = function () { if (done) return; done = true; clearTimeout(t); next(); }; document.head.appendChild(s); })(); }); }
  var PDFURLS = ['https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'];
  var QRURLS = ['https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js', 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js', 'https://unpkg.com/qrcode-generator@1.4.4/qrcode.js'];
  function lib() { return loadFirst(PDFURLS, function () { return !!W.jspdf; }, 12000); }
  function qrlib() { return loadFirst(QRURLS, function () { return !!W.qrcode; }, 8000).then(function () { return true; }, function () { return false; }); }
  setTimeout(function () { lib().catch(function () {}); }, 2500); /* warm up in the background so documents open fast */
  function img(src, type, size) { return new Promise(function (res) { var i = new Image(); i.onload = function () { try { var c = document.createElement('canvas'); c.width = size ? size : i.naturalWidth; c.height = size ? size : i.naturalHeight; var x = c.getContext('2d'); if (type === 'jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); } x.drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL(type === 'jpeg' ? 'image/jpeg' : 'image/png', .92)); } catch (e) { res(null); } }; i.onerror = function () { res(null); }; i.src = src; }); }
  function clean(s) { return String(s == null ? '' : s).replace(/[^\x20-\x7E -ÿ]/g, '').trim(); }
  function dmy(d) { try { return new Date(d || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }); } catch (e) { return ''; } }
  function ref(kind, p) { return clean(p.ref) || ((kind === 'rider' ? 'VR-' : kind === 'agent' ? 'VA-' : 'VT-') + String(p.id || '').replace(/-/g, '').slice(0, 6).toUpperCase()); }
  function pic(doc, data, x, y, w, h) { try { doc.addImage(data, /^data:image\/png/.test(data) ? 'PNG' : 'JPEG', x, y, w, h); return true; } catch (e) { return false; } }
  function qrData(text) { try { var q = W.qrcode(0, 'M'); q.addData(text); q.make(); var n = q.getModuleCount(), s = 8, c = document.createElement('canvas'); c.width = c.height = (n + 2) * s; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.fillStyle = '#000'; for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + 1) * s, (r + 1) * s, s, s); return c.toDataURL('image/png'); } catch (e) { return null; } }

  /* ---------------- Standard clauses ---------------- */
  var COMMON_A = [
    ['Relationship', 'The Contractor works with The Velos Group ("Velos") as an independent contractor. Nothing in this agreement makes the Contractor an employee, partner or legal representative of Velos, and the Contractor is responsible for their own taxes and statutory contributions.'],
    ['Term and ending', 'This agreement starts on the approval date shown above and continues until either side ends it by giving 7 days\' notice. Velos may suspend or end it immediately for fraud, theft, abuse of customers, serious safety breaches or a false statement on the application.']
  ];
  var COMMON_B = [
    ['ID card and Velos property', 'The Velos ID card, and any branded items issued (such as jackets, delivery bags or shirts), remain the property of Velos. They must be worn or carried while working, kept in good condition, never lent to another person, and returned within 7 days of the agreement ending. Loss must be reported to Velos immediately.'],
    ['Customer data and confidentiality', 'The Contractor will use customer names, phone numbers and addresses only to complete the job at hand, will not copy, store or share them, and will keep Velos prices, rates and business information confidential. This follows the Data Protection and Privacy Act, 2019 of Uganda.'],
    ['Conduct', 'The Contractor will be polite and honest with customers, restaurants, partners and Velos staff, will not harass or discriminate against anyone, and will not work under the influence of alcohol or drugs.'],
    ['Payments', 'Customers pay Velos only through the official Velos payment numbers and channels. The Contractor must never ask a customer to send money to a personal number, and any money received on behalf of Velos must be handed over the same day.'],
    ['Liability', 'The Contractor is responsible for loss or damage caused by their own negligence or dishonesty. Velos is not liable for the Contractor\'s own vehicle, tools, phone or personal injury, except where the law requires otherwise.'],
    ['General', 'This agreement is governed by the laws of Uganda and is read together with the Velos Terms of Service and the rates and rules published in the Velos app. Changes must be in writing or announced in the app with reasonable notice. Any dispute will first be discussed in good faith before any other step is taken.']
  ];
  var CLAUSES = {
    rider: [
      ['Role', 'The Contractor will collect and deliver Velos shop orders and Velos Foods orders that they accept through the Velos rider app, and will hand customers their orders in good condition.'],
      ['Requirements', 'The Contractor confirms they hold a valid riding permit and a registered motorcycle or bicycle, will obey all traffic laws, will wear a helmet and the Velos reflector jacket on every job, and will never carry passengers while on a delivery.'],
      ['Pay', 'The rider is paid the per-kilometre rate shown in the rider app for each completed delivery. Rates may change with notice in the app. Earnings are paid on the regular schedule, currently weekly, to the payout number registered with Velos.'],
      ['Handling orders', 'Orders must be collected on time, kept sealed in the Velos delivery bag, never opened, eaten, tampered with or left unattended, and delivered only to the customer or the person they name. A pick-up code or the customer\'s name must be confirmed before handing over.'],
      ['Reliability', 'The Contractor will accept jobs only when ready to complete them, will update the order status honestly in the app, and will tell Velos at once if a delivery cannot be completed. Repeated lateness or cancelled jobs may lead to fewer jobs or suspension.']
    ].concat(COMMON_A).concat(COMMON_B),
    agent: [
      ['Role', 'The Contractor will promote Velos to customers, restaurants and shops, and submit leads through the Velos agent app using their personal agent code and link.'],
      ['Commission', 'The agent earns the commission percentage shown above on completed and paid sales credited to their code or link. No commission is earned on cancelled, unpaid or refunded orders, and Velos may reverse commission paid on an order that is later refunded.'],
      ['Payouts', 'Commission is paid to the payout number registered with Velos once it has been confirmed in the agent app. The agent can see sales, commission and payouts in the app at any time.'],
      ['Honest selling', 'The agent will describe Velos products, prices, fees and delivery truthfully, will not promise discounts, refunds or terms that Velos has not approved, and will not sign up fake customers or restaurants to earn commission.'],
      ['Representing Velos', 'The agent will show their Velos ID card at every visit, use only approved Velos materials and the official Velos name and logo, and will not open any shop, account or social media page in the name of Velos.']
    ].concat(COMMON_A).concat(COMMON_B),
    technician: [
      ['Role', 'The Contractor will carry out service jobs that Velos assigns and the Contractor accepts through the Velos partner app, to the standard of a skilled tradesperson in their stated trade.'],
      ['Pay', 'For each job Velos shows the agreed payout before the job is accepted. Payouts are made after the job is marked complete and confirmed by the customer or Velos, on the regular payout schedule, to the payout details registered with Velos.'],
      ['Quality and safety', 'The Contractor will use their own tools, work safely, leave the site clean, and redo faulty work caused by their workmanship free of charge within 7 days. Any danger or extra cost found on site must be reported to Velos before work continues.'],
      ['Customers introduced by Velos', 'For 6 months after a job, the Contractor will not take further work from that customer outside the Velos platform. Customers remain free to deal with whoever they wish, but fees due to Velos on jobs it introduced must not be avoided.'],
      ['Authority and licences', 'The Contractor confirms their stated trade, experience and identity are true, and will hold any licence or certificate the work requires. Velos may ask for proof at any time.']
    ].concat(COMMON_A).concat(COMMON_B)
  };

  /* ---------------- Agreement ---------------- */
  async function agreement(kind, p) {
    await lib();
    var J = W.jspdf.jsPDF, doc = new J({ unit: 'mm', format: 'a4' }), page = 1;
    var logo = await img('icon-512.png', 'jpeg', 256), sig = await img('signature.png', 'png');
    var no = ref(kind, p), name = clean(p.name) || ROLE[kind], issued = dmy(p.issued_at);
    function foot(n) { doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 284, 210, 13, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 284, 210, .8, 'F'); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(232, 199, 102); doc.text('The Velos Group  |  Anything. Anywhere. Precisely.', 105, 291, { align: 'center' }); doc.setTextColor(180, 190, 215); doc.text('Page ' + n, 195, 291, { align: 'right' }); }
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 0, 210, 40, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 40, 210, 1.4, 'F');
    if (logo) pic(doc, logo, 15, 8, 24, 24);
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.text('The Velos Group', 44, 17);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(232, 199, 102); doc.text('Anything. Anywhere. Precisely.', 44, 23);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(190, 200, 225); doc.text('Kampala, Uganda', 44, 29); doc.text('Tel / WhatsApp: ' + PHONE + '  |  ' + SITE.replace('https://', ''), 44, 33);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(232, 199, 102); doc.text(doc.splitTextToSize(TITLE[kind], 70), 195, 13, { align: 'right' });
    doc.setFontSize(10); doc.setTextColor(255, 255, 255); doc.text('Ref ' + no, 195, 31, { align: 'right' }); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.text('Approved ' + issued, 195, 36, { align: 'right' });
    var y = 54; doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(TX[0], TX[1], TX[2]);
    doc.splitTextToSize('This agreement is between The Velos Group, Kampala, Uganda ("Velos") and the person named below ("the Contractor"). Velos has already signed it. Please read it carefully, and if you agree, sign and date it and return a copy to Velos.', 180).forEach(function (l) { doc.text(l, 15, y); y += 5; });
    y += 4; doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('CONTRACTOR DETAILS', 15, y); y += 4;
    var rows = [['Full name', name], ['Role', ROLE[kind]], ['Velos ID number', no], ['Phone / WhatsApp', clean(p.phone)], ['National ID number', clean(p.id_number)], ['Town / area', clean(p.city)],
      kind === 'rider' ? ['Vehicle', [clean(p.vehicle), clean(p.plate)].filter(Boolean).join(' - ')] : null,
      kind === 'technician' ? ['Trade', clean(p.trade)] : null,
      kind === 'agent' && p.commission_pct != null ? ['Commission', p.commission_pct + '% of completed and paid sales'] : null,
      ['Approval date', issued]].filter(function (r) { return r && r[1]; });
    rows.forEach(function (r, i) { var h = 7.5; if (i % 2 === 0) { doc.setFillColor(LT[0], LT[1], LT[2]); doc.rect(15, y, 180, h, 'F'); } doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(r[0], 18, y + 5); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(doc.splitTextToSize(r[1], 118)[0], 72, y + 5); y += h; });
    y += 7; doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('TERMS', 15, y); y += 5;
    doc.setFontSize(9);
    CLAUSES[kind].forEach(function (c, i) {
      var ls = doc.splitTextToSize((i + 1) + '. ' + c[0] + '. ' + c[1], 180);
      if (y + ls.length * 4.4 > 268) { foot(page); doc.addPage(); page++; y = 22; }
      doc.setFont('helvetica', 'normal'); doc.setTextColor(TX[0], TX[1], TX[2]); ls.forEach(function (l) { doc.text(l, 15, y); y += 4.4; }); y += 1.8;
    });
    y += 4; if (y > 215) { foot(page); doc.addPage(); page++; y = 30; }
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(GR[0], GR[1], GR[2]);
    doc.splitTextToSize('By signing, the Contractor confirms that the details above are true, that they have read and understood this agreement, and that they agree to it. Signed copies are kept by both sides.', 180).forEach(function (l) { doc.text(l, 15, y); y += 4.2; });
    var sy = y + 32; if (sy > 258) { foot(page); doc.addPage(); page++; sy = 60; }
    if (sig) fit(doc, sig, 17, sy - 25, 56, 24);
    try { if (W.VelosStamp) await W.VelosStamp.place(doc, 75, sy - 34, 32, { label: 'APPROVED', date: p.issued_at }); } catch (e) {}
    doc.setDrawColor(GR[0], GR[1], GR[2]); doc.setLineWidth(.3); doc.line(15, sy, 75, sy); doc.line(135, sy, 195, sy);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text('The Velos Group (signed)', 15, sy + 4.5); doc.text(name + ' (Contractor)', 135, sy + 4.5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('Authorised signature', 15, sy + 8.8); doc.text('Date: ' + issued, 15, sy + 13.5); doc.text('Contractor signature', 135, sy + 8.8); doc.text(p.holderSig ? 'Date: ' + dmy(Date.now()) : 'Date: ........ / ........ / ............', 135, sy + 13.5);
    if (p.holderSig) { fit(doc, p.holderSig, 137, sy - 17, 56, 16); doc.setFontSize(6.5); doc.text('Signed online on ' + new Date().toLocaleString('en-GB') + ' from the Velos app', 135, sy + 17.5); }
    doc.text('Witness name and signature: ______________________________', 135, sy + 22);
    foot(page);
    var fname = ('Velos-' + ROLE[kind].replace(/ /g, '') + '-Agreement-' + no + '-' + name).replace(/[^\w-]+/g, '-').replace(/-+/g, '-') + '.pdf';
    return { doc: doc, no: no, file: new File([doc.output('blob')], fname, { type: 'application/pdf' }), name: fname };
  }

  /* ---------------- ID card (85.6 x 54 mm, front and back) ---------------- */
  async function idCard(kind, p) {
    await lib(); var hasQr = await qrlib();
    var J = W.jspdf.jsPDF, doc = new J({ unit: 'mm', format: [85.6, 54], orientation: 'landscape' });
    var logo = await img('icon-512.png', 'jpeg', 256);
    var no = ref(kind, p), name = clean(p.name) || ROLE[kind], issued = new Date(p.issued_at || Date.now()), until = new Date(issued); until.setFullYear(until.getFullYear() + 1);
    var mm = function (d) { return ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); };
    /* front */
    doc.setFillColor(255, 255, 255); doc.rect(0, 0, 85.6, 54, 'F');
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 0, 85.6, 14, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 14, 85.6, .9, 'F');
    if (logo) pic(doc, logo, 3.5, 2, 10, 10);
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('THE VELOS GROUP', 16, 7.2);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(5.8); doc.setTextColor(232, 199, 102); doc.text('Anything. Anywhere. Precisely.', 16, 10.8);
    doc.setFillColor(GD[0], GD[1], GD[2]); doc.roundedRect(61, 4.2, 21, 5.6, 1.2, 1.2, 'F'); doc.setTextColor(NV[0], NV[1], NV[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(5.8); doc.text(CARDROLE[kind], 71.5, 8.1, { align: 'center' });
    var px = 5, py = 19, pw = 24, ph = 28;
    doc.setFillColor(LT[0], LT[1], LT[2]); doc.setDrawColor(GD[0], GD[1], GD[2]); doc.setLineWidth(.4); doc.rect(px, py, pw, ph, 'FD');
    if (!(p.photo && pic(doc, p.photo, px, py, pw, ph))) { var ini = name.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); doc.setTextColor(GR[0], GR[1], GR[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(ini, px + pw / 2, py + ph / 2 + 2, { align: 'center' }); doc.setFontSize(4.5); doc.setFont('helvetica', 'normal'); doc.text('PHOTO', px + pw / 2, py + ph - 2, { align: 'center' }); }
    doc.setTextColor(TX[0], TX[1], TX[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.splitTextToSize(name, 50).slice(0, 2).forEach(function (l, i) { doc.text(l, 33, 23.5 + i * 4.6); });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(6.2); doc.setTextColor(GR[0], GR[1], GR[2]);
    var info = [['ID No', no], ['Role', ROLE[kind] + (kind === 'technician' && p.trade ? ' - ' + clean(p.trade) : '')], ['Issued', mm(issued)], ['Valid until', mm(until)]];
    info.forEach(function (r, i) { var yy = 33 + i * 4.4; doc.setFont('helvetica', 'normal'); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(r[0], 33, yy); doc.setFont('helvetica', 'bold'); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(doc.splitTextToSize(r[1], 40)[0], 47, yy); });
    doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 52.6, 85.6, 1.4, 'F');
    /* back */
    doc.addPage([85.6, 54], 'landscape');
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 0, 85.6, 54, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 0, 85.6, 1.4, 'F');
    doc.setTextColor(232, 199, 102); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.text('VERIFIED VELOS TEAM MEMBER', 6, 9);
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'normal'); doc.setFontSize(5.8);
    ['This card is the property of The Velos Group and must', 'be shown on request. It is not transferable.', 'If found, please call or WhatsApp ' + PHONE + '.', 'Report misuse to support@thevelosgroup.com.'].forEach(function (l, i) { doc.text(l, 6, 15 + i * 3.8); });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.setTextColor(232, 199, 102); doc.text(SITE.replace('https://', ''), 6, 31.5);
    var hs = p.signature || null, as = await img('signature.png', 'png');
    var q = hasQr ? qrData(SITE + '/?ref=' + encodeURIComponent(no)) : null;
    if (q) { doc.setFillColor(255, 255, 255); doc.roundedRect(60, 9, 21, 21, 1.5, 1.5, 'F'); pic(doc, q, 60.8, 9.8, 19.4, 19.4); doc.setFont('helvetica', 'normal'); doc.setFontSize(4.6); doc.setTextColor(190, 200, 225); doc.text('Scan to open Velos', 70.5, 32.6, { align: 'center' }); }
    /* signature panels: holder (left) and Velos authorised signatory (right) */
    doc.setFillColor(255, 255, 255); doc.roundedRect(5, 37, 36, 10, 1, 1, 'F'); doc.roundedRect(46, 37, 36, 10, 1, 1, 'F');
    if (hs) fit(doc, hs, 6.5, 37.6, 33, 8.8);
    if (as) fit(doc, as, 47.5, 37.6, 33, 8.8);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(4.6); doc.setTextColor(190, 200, 225); doc.text('Holder signature', 5, 49.6); doc.text('Authorised signature - The Velos Group', 46, 49.6);
    var fname = ('Velos-ID-Card-' + no + '-' + name).replace(/[^\w-]+/g, '-').replace(/-+/g, '-') + '.pdf';
    return { doc: doc, no: no, file: new File([doc.output('blob')], fname, { type: 'application/pdf' }), name: fname };
  }

  function save(r) { var u = URL.createObjectURL(r.file), a = document.createElement('a'); a.href = u; a.download = r.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }
  async function share(r) { try { if (navigator.canShare && navigator.canShare({ files: [r.file] })) { await navigator.share({ files: [r.file], title: r.name, text: 'Velos document ' + r.no }); return true; } save(r); return false; } catch (e) { if (e.name !== 'AbortError') throw e; return true; } }
  function photo(file) { return new Promise(function (ok) { if (!file) return ok(null); var fr = new FileReader(); fr.onload = function () { img(fr.result, 'jpeg').then(ok); }; fr.onerror = function () { ok(null); }; fr.readAsDataURL(file); }); }



  /* draw an image inside a box without stretching it */
  function fit(doc, data, x, y, w, h) { try { var pr = doc.getImageProperties(data), k = Math.min(w / pr.width, h / pr.height), dw = pr.width * k, dh = pr.height * k; doc.addImage(data, /^data:image\/png/.test(data) ? 'PNG' : 'JPEG', x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); return true; } catch (e) { return false; } }

  /* turn a photo or scan of a signature on paper into a clean transparent signature (ink only, no paper) */
  function ink(src) {
    return new Promise(function (ok, bad) {
      function go(url) {
        var i = new Image(); i.onload = function () {
          var k = Math.min(1, 1100 / Math.max(i.naturalWidth, i.naturalHeight)), w = Math.max(10, Math.round(i.naturalWidth * k)), h = Math.max(10, Math.round(i.naturalHeight * k));
          var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'); x.drawImage(i, 0, 0, w, h);
          var d = x.getImageData(0, 0, w, h), px = d.data, lum = new Float32Array(w * h), hist = new Uint32Array(256), n = w * h, a;
          for (a = 0; a < n; a++) { var l = .299 * px[a * 4] + .587 * px[a * 4 + 1] + .114 * px[a * 4 + 2]; lum[a] = l; hist[l | 0]++; }
          var cum = 0, bg = 255; for (a = 0; a < 256; a++) { cum += hist[a]; if (cum >= n * .85) { bg = a; break; } }
          var lo = bg * .55, minx = w, miny = h, maxx = 0, maxy = 0, cnt = 0;
          for (var yy = 0; yy < h; yy++) for (var xx = 0; xx < w; xx++) {
            var idx = yy * w + xx, al = (bg - lum[idx]) / Math.max(1, bg - lo); al = al < 0 ? 0 : al > 1 ? 1 : al; al = al < .15 ? 0 : Math.min(1, al * 1.15);
            px[idx * 4] = 14; px[idx * 4 + 1] = 22; px[idx * 4 + 2] = 64; px[idx * 4 + 3] = Math.round(al * 255);
            if (al > .4) { cnt++; if (xx < minx) minx = xx; if (xx > maxx) maxx = xx; if (yy < miny) miny = yy; if (yy > maxy) maxy = yy; }
          }
          if (cnt < 40) return bad(Error('We could not see a signature in that picture. Sign in dark ink on plain white paper, in good light, and try again.'));
          x.putImageData(d, 0, 0); var p = 6; minx = Math.max(0, minx - p); miny = Math.max(0, miny - p); maxx = Math.min(w - 1, maxx + p); maxy = Math.min(h - 1, maxy + p);
          var o = document.createElement('canvas'); o.width = maxx - minx + 1; o.height = maxy - miny + 1; o.getContext('2d').drawImage(c, minx, miny, o.width, o.height, 0, 0, o.width, o.height);
          o.toBlob(function (b) { if (!b) return bad(Error('Could not process the signature.')); ok({ blob: b, file: new File([b], 'signature.png', { type: 'image/png' }), w: o.width, h: o.height }); }, 'image/png');
        }; i.onerror = function () { bad(Error('That file is not a picture we can read.')); }; i.src = url;
      }
      if (typeof src === 'string') return go(src);
      var fr = new FileReader(); fr.onload = function () { go(fr.result); }; fr.onerror = function () { bad(Error('Could not read the file.')); }; fr.readAsDataURL(src);
    });
  }
  function blobData(b) { return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.readAsDataURL(b); }); }

  /* on-screen signature pad: finger or mouse. cb receives {blob, file, data} or null */
  function pad(title, cb) {
    var o = document.createElement('div'); o.style.cssText = 'position:fixed;inset:0;z-index:2147483002;background:rgba(2,8,28,.9);display:flex;align-items:center;justify-content:center;padding:14px;font:15px system-ui';
    o.innerHTML = '<div style="background:#0f1730;border:1px solid #e8c766;border-radius:16px;padding:16px;width:100%;max-width:520px;color:#f4f1ea"><b>' + esc(title || 'Sign here') + '</b><p style="margin:6px 0 10px;opacity:.8;font-size:13px">Use your finger or mouse. Sign the same way you sign on paper.</p><canvas style="width:100%;height:200px;background:#fff;border-radius:10px;touch-action:none;display:block"></canvas><div style="display:flex;gap:8px;margin-top:10px"><button id="sp-c" style="flex:1;padding:12px;border-radius:10px;border:1px solid #e8c766;background:none;color:#e8c766;font-weight:700">Clear</button><button id="sp-x" style="flex:1;padding:12px;border-radius:10px;border:1px solid #888;background:none;color:#ccc">Cancel</button><button id="sp-o" style="flex:2;padding:12px;border-radius:10px;border:0;background:#e8c766;color:#03113e;font-weight:700">Use this signature</button></div><div id="sp-e" style="color:#ff9b93;font-size:13px;margin-top:6px"></div></div>';
    document.body.appendChild(o);
    var cv = o.querySelector('canvas'), r = cv.getBoundingClientRect(), dpr = Math.max(1, W.devicePixelRatio || 1); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    var g = cv.getContext('2d'); g.scale(dpr, dpr); g.lineWidth = 2.6; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#0e1640'; var dr = false, lx = 0, ly = 0, inkd = false;
    function pos(e) { var b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; }
    cv.onpointerdown = function (e) { dr = true; inkd = true; var p = pos(e); lx = p[0]; ly = p[1]; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + .01, ly + .01); g.stroke(); try { cv.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); };
    cv.onpointermove = function (e) { if (!dr) return; var p = pos(e); g.beginPath(); g.moveTo(lx, ly); g.lineTo(p[0], p[1]); g.stroke(); lx = p[0]; ly = p[1]; e.preventDefault(); };
    cv.onpointerup = cv.onpointercancel = function () { dr = false; };
    function done(v) { o.remove(); cb(v); }
    o.querySelector('#sp-c').onclick = function () { g.clearRect(0, 0, r.width, r.height); inkd = false; };
    o.querySelector('#sp-x').onclick = function () { done(null); };
    o.querySelector('#sp-o').onclick = function () {
      if (!inkd) { o.querySelector('#sp-e').textContent = 'Please sign in the box first.'; return; }
      ink(cv.toDataURL('image/png')).then(function (res) { blobData(res.blob).then(function (d) { res.data = d; done(res); }); }, function (e) { o.querySelector('#sp-e').textContent = e.message; });
    };
  }

  /* ---------------- Uploads and onboarding steps ---------------- */
  var ME = null, BUCKET = 'people-docs'; function DB() { return typeof db !== 'undefined' ? db : W.db; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shrink(file) { return new Promise(function (ok) { if (!file || !/^image\//.test(file.type) || /heic|heif/.test(file.type)) return ok(file); var fr = new FileReader(); fr.onload = function () { var i = new Image(); i.onload = function () { var m = 1600, k = Math.min(1, m / Math.max(i.naturalWidth, i.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(i.naturalWidth * k); c.height = Math.round(i.naturalHeight * k); var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(i, 0, 0, c.width, c.height); c.toBlob(function (b) { ok(b ? new File([b], 'scan.jpg', { type: 'image/jpeg' }) : file); }, 'image/jpeg', .85); }; i.onerror = function () { ok(file); }; i.src = fr.result; }; fr.onerror = function () { ok(file); }; fr.readAsDataURL(file); }); }
  async function sendFile(kind, field, f) {
    var me = await DB().rpc('people_docs_me', { p_kind: kind }); if (me.error || !me.data) throw Error((me.error && me.error.message) || 'Your login is not linked to a profile yet. Please tell Velos.');
    var ext = f.type === 'application/pdf' ? 'pdf' : (f.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg'), path = kind + '/' + me.data.person_id + '/' + field + '-' + Date.now() + '.' + ext;
    var u = await DB().storage.from(BUCKET).upload(path, f, { contentType: f.type, upsert: false }); if (u.error) throw u.error;
    var r = await DB().rpc('people_docs_set', { p_kind: kind, p_field: field, p_path: path }); if (r.error) throw r.error;
  }
  async function upload(kind, field, inputId) {
    try {
      var el = document.getElementById(inputId), f = el && el.files && el.files[0]; if (!f) return W.toast && W.toast('Choose a file first', true);
      if (f.size > 12 * 1024 * 1024) return W.toast && W.toast('That file is too large. Use a photo under 8 MB.', true);
      W.toast && W.toast('Uploading…');
      if (field === 'sig') f = (await ink(f)).file; else f = await shrink(f);
      await sendFile(kind, field, f); W.toast && W.toast('Received ✓'); fill();
    } catch (e) { W.toast && W.toast(e.message || String(e), true); }
  }
  /* draw the signature on screen, then either keep it as my signature, or sign my agreement with it */
  function draw(field) {
    var kind = ME && ME.kind; if (!kind) return;
    pad(field === 'signed' ? 'Sign your agreement' : 'Your signature', async function (res) {
      if (!res) return;
      try {
        W.toast && W.toast('Saving…');
        if (field === 'signed') { await lib(); var r = await agreement(kind, Object.assign({}, ME.p, { holderSig: res.data })); await sendFile(kind, 'signed', r.file); }
        else await sendFile(kind, 'sig', res.file);
        W.toast && W.toast('Received ✓'); fill();
      } catch (e) { W.toast && W.toast(e.message || String(e), true); }
    });
  }
  function ok(t) { return '<span style="color:#7ee2a8">✓ ' + t + '</span>'; }
  function dt(x) { try { return new Date(x).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
  async function fill() {
    var box = document.getElementById('vpd'); if (!box || !ME) return;
    var k = ME.kind, d = { data: null }, fail = null; try { d = await DB().rpc('people_docs_me', { p_kind: k }); if (d.error) fail = d.error.message; } catch (e) { fail = e.message || String(e); }
    if (fail || !d || d.data == null) { box.innerHTML = '<div class="c"><p>We could not load your documents just now.' + (fail ? ' <span class="m">(' + esc(fail).slice(0, 140) + ')</span>' : ' Your login may not be linked to a profile yet. Please tell Velos.') + '</p><button class="full" onclick="VelosPeople.retry()">Try again</button></div>'; return; }
    d = d.data || {};
    var inp = 'display:block;width:100%;margin:8px 0;padding:10px;border:1px dashed rgba(212,175,55,.5);border-radius:10px;background:rgba(255,255,255,.04);color:inherit';
    var h = '';
    if (!ME.active) {
      h = '<h2>Complete your application</h2>' +
        '<div class="c"><p><b>Step 1 · Download your agreement.</b> Velos has already signed it. Read it carefully and sign it by hand.</p><button class="full" onclick="VelosPeople.mine(\'agreement\')">📄 Download my agreement</button></div>' +
        '<div class="c"><p><b>Step 2 · Send the signed copy back.</b> Take a clear photo or scan of every signed page and upload it here (photo or PDF).</p>' +
        (d.signed_at ? '<p>' + ok('Signed agreement received on ' + dt(d.signed_at)) + '. Velos is reviewing your application. You can upload again to replace it.</p>' : '<p class="m">Your account stays <b>pending</b> until this is received.</p>') +
        '<button class="full" onclick="VelosPeople.draw(\'signed\')">✍️ Sign on screen (fastest)</button><p class="m" style="text-align:center">or upload your signed paper copy</p><input id="vpd-s" type="file" accept="image/*,application/pdf" style="' + inp + '"><button class="full" onclick="VelosPeople.up(\'signed\',\'vpd-s\')">⬆️ Upload signed agreement</button></div>' +
        '<div class="c"><p><b>Step 3 · After approval.</b> You will upload your passport-size photo and your signature here, and Velos will prepare your ID card.</p></div>';
    } else {
      var done = d.photo_at && d.sig_at;
      h = '<h2>Documents</h2>' +
        '<div class="c"><p><b>Your agreement.</b> Velos has already signed it. You can open your copy at any time.</p><button class="full" onclick="VelosPeople.mine(\'agreement\')">📄 Open my agreement</button></div>' +
        '<div class="c"><p><b>Your ID card.</b> ' + (d.issued_at ? ok('Issued on ' + dt(d.issued_at)) + ' Show it on every job. This is your digital copy; Velos prints the physical card.' : done ? 'Photo and signature received ✓. Velos is preparing your card. It will appear here once issued.' : 'To get your card, upload the two items below.') + '</p>' +
        (d.issued_at ? '<button class="full" onclick="VelosPeople.mine(\'card\')">🪪 Open my ID card</button>' : '') + '</div>' +
        '<div class="c"><p><b>Passport-size photo.</b> Plain light background, face clearly visible, no hat or sunglasses. ' + (d.photo_at ? ok('Received') : '') + '</p><input id="vpd-p" type="file" accept="image/*" style="' + inp + '"><button class="full" onclick="VelosPeople.up(\'photo\',\'vpd-p\')">⬆️ Upload photo</button></div>' +
        '<div class="c"><p><b>Your signature.</b> Sign your name in dark ink on plain white paper, then photograph or scan it flat and well lit. ' + (d.sig_at ? ok('Received') : '') + '</p><input id="vpd-g" type="file" accept="image/*" style="' + inp + '"><button class="full" onclick="VelosPeople.draw(\'sig\')">✍️ Draw my signature on screen</button><p class="m" style="text-align:center">or upload a photo of it</p><button class="full" onclick="VelosPeople.up(\'sig\',\'vpd-g\')">⬆️ Upload signature photo</button></div>';
    }
    box.innerHTML = h;
  }
  /* panel(kind, p, active): HTML for the Documents page. p needs the person's details (see top). Works before and after approval. */
  function reqCard(kind, active) {
    if (active) return '';
    return '<div class="c"><h3 style="margin:0 0 6px">📋 Step 1: upload your documents</h3><p class="m">Velos verifies every ' + (kind === 'agent' ? 'sales agent' : kind === 'rider' ? 'rider' : 'technician') + ' before approval. Upload your ID, passport photo, account proof' + (kind === 'agent' ? ', qualification certificate, LC1 / local leader letter and CV' : kind === 'rider' ? ', riding permit, referees and residence letter' : ', trade certificate and good-conduct certificate') + '. Your documents are private.</p><a class="b" href="apply.html?kind=' + kind + '">Open my requirements checklist</a></div>';
  }
  function panel(kind, p, active) { ME = { kind: kind, p: p, active: !!active }; setTimeout(fill, 30); return reqCard(kind, active) + '<div id="vpd"><div class="c"><p>Loading…</p></div></div>'; }
  async function mine(what) {
    try {
      if (!ME) return; var p = ME.p;
      if (what === 'card') { var me = await DB().rpc('people_docs_me', { p_kind: ME.kind }); if (!me.data || !me.data.issued_at) throw Error('Your card has not been issued yet.'); var tok = await pull(ME.kind, me.data.person_id); p = Object.assign({}, p, tok); }
      var r = what === 'card' ? await idCard(ME.kind, p) : await agreement(ME.kind, p); if (W.toast) W.toast('Ready'); try { await share(r); } catch (e) { save(r); }
    } catch (e) { if (W.toast) W.toast(e.message || String(e), true); }
  }
  /* staff: fetch the stored photo and signature as images for the card */
  async function pull(kind, id) {
    var row = null, out = {};
    try { var r = await DB().rpc('admin_people_docs', { p_kind: kind }); row = ((r.data || []).filter(function (x) { return String(x.person_id) === String(id); }))[0]; } catch (e) {}
    async function get(path, type) { if (!path) return null; var d = await DB().storage.from(BUCKET).download(path); if (d.error || !d.data) return null; return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { (type === 'png' ? Promise.resolve(fr.result) : img(fr.result, 'jpeg')).then(res); }; fr.onerror = function () { res(null); }; fr.readAsDataURL(d.data); }); }
    if (row) { out.photo = await get(row.photo_path, 'jpeg'); out.signature = await get(row.sig_path, 'png'); }
    return out;
  }
  async function signedUrl(kind, id) { var r = await DB().rpc('admin_people_docs', { p_kind: kind }); var row = ((r.data || []).filter(function (x) { return String(x.person_id) === String(id); }))[0]; if (!row || !row.signed_path) throw Error('No signed agreement uploaded yet'); var u = await DB().storage.from(BUCKET).createSignedUrl(row.signed_path, 600); if (u.error) throw u.error; return u.data.signedUrl; }

  W.VelosPeople = { retry: function () { fill(); }, panel: panel, mine: mine, draw: draw, ink: ink, pad: pad, signedUrl2: null, up: function (f, id) { return upload(ME && ME.kind, f, id); }, pull: pull, signedUrl: signedUrl, agreement: agreement, idCard: idCard, save: save, share: share, photo: photo };
})(window);
