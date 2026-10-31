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

  function lib() { return new Promise(function (ok, bad) { if (W.jspdf) return ok(); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'; s.onload = ok; s.onerror = function () { bad(Error('Could not load the PDF tool. Check your internet and try again.')); }; document.head.appendChild(s); }); }
  function qrlib() { return new Promise(function (ok) { if (W.qrcode) return ok(true); var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'; s.onload = function () { ok(!!W.qrcode); }; s.onerror = function () { ok(false); }; document.head.appendChild(s); }); }
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
    if (sig) pic(doc, sig, 20, sy - 25, 36, 24.2);
    doc.setDrawColor(GR[0], GR[1], GR[2]); doc.setLineWidth(.3); doc.line(15, sy, 75, sy); doc.line(135, sy, 195, sy);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text('The Velos Group (signed)', 15, sy + 4.5); doc.text(name + ' (Contractor)', 135, sy + 4.5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('Authorised signature', 15, sy + 8.8); doc.text('Date: ' + issued, 15, sy + 13.5); doc.text('Contractor signature', 135, sy + 8.8); doc.text('Date: ........ / ........ / ............', 135, sy + 13.5);
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
    ['This card is the property of The Velos Group and must', 'be shown on request. It is not transferable.', 'If found, please call or WhatsApp ' + PHONE + '.', 'Report misuse to info@thevelosgroup.com.'].forEach(function (l, i) { doc.text(l, 6, 15 + i * 3.8); });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6); doc.setTextColor(232, 199, 102); doc.text(SITE.replace('https://', ''), 6, 36);
    doc.setDrawColor(190, 200, 225); doc.setLineWidth(.25); doc.line(6, 46.5, 40, 46.5); doc.setFont('helvetica', 'normal'); doc.setFontSize(5); doc.setTextColor(190, 200, 225); doc.text('Holder signature', 6, 49.2);
    var q = hasQr ? qrData(SITE + '/?ref=' + encodeURIComponent(no)) : null;
    if (q) { doc.setFillColor(255, 255, 255); doc.roundedRect(52, 11, 28, 28, 1.5, 1.5, 'F'); pic(doc, q, 53, 12, 26, 26); doc.setFontSize(5); doc.setTextColor(190, 200, 225); doc.text('Scan to open Velos', 66, 43, { align: 'center' }); }
    var fname = ('Velos-ID-Card-' + no + '-' + name).replace(/[^\w-]+/g, '-').replace(/-+/g, '-') + '.pdf';
    return { doc: doc, no: no, file: new File([doc.output('blob')], fname, { type: 'application/pdf' }), name: fname };
  }

  function save(r) { var u = URL.createObjectURL(r.file), a = document.createElement('a'); a.href = u; a.download = r.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 4000); }
  async function share(r) { try { if (navigator.canShare && navigator.canShare({ files: [r.file] })) { await navigator.share({ files: [r.file], title: r.name, text: 'Velos document ' + r.no }); return true; } save(r); return false; } catch (e) { if (e.name !== 'AbortError') throw e; return true; } }
  function photo(file) { return new Promise(function (ok) { if (!file) return ok(null); var fr = new FileReader(); fr.onload = function () { img(fr.result, 'jpeg').then(ok); }; fr.onerror = function () { ok(null); }; fr.readAsDataURL(file); }); }


  /* Self-service panel for the rider, agent and partner apps */
  var ME = null;
  function panel(kind, p, active) {
    ME = { kind: kind, p: p };
    if (!p || !active) return '<h2>Documents</h2><div class="c"><p>Your agreement and ID card will appear here once Velos has approved you.</p></div>';
    return '<h2>Documents</h2><div class="c"><p><b>Your agreement.</b> Velos has already signed it. Read it, sign it, and send a copy back to Velos on WhatsApp.</p><button class="full" onclick="VelosPeople.mine(\'agreement\')">📄 Open my agreement</button></div>' +
      '<div class="c"><p><b>Your ID card.</b> Show it on every job. Velos prints the physical card for you; this is your digital copy.</p><button class="full" onclick="VelosPeople.mine(\'card\')">🪪 Open my ID card</button></div>';
  }
  async function mine(what) { try { if (!ME) return; var r = what === 'card' ? await idCard(ME.kind, ME.p) : await agreement(ME.kind, ME.p); if (W.toast) W.toast('Ready'); try { await share(r); } catch (e) { save(r); } } catch (e) { if (W.toast) W.toast(e.message || String(e), true); } }

  W.VelosPeople = { panel: panel, mine: mine, agreement: agreement, idCard: idCard, save: save, share: share, photo: photo };
})(window);
