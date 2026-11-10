/* Velos official receipts (PDF) with the dated stamp and signature.
   VelosReceipt.fee(row)      row from my_fee_receipts() or fee_ledger: {receipt_no, kind, amount_ugx, period, ref, paid_at, name}
   VelosReceipt.pay(o)        {no, name, role, amount, reference, note, paid_at}   (payout receipt)
   Both return Promise<{doc,file}>;  VelosReceipt.save(r) downloads it.  Needs velos-stamp.js. */
(function (W) {
  var NV = [3, 17, 62], GD = [212, 175, 55], TX = [30, 35, 50], GR = [110, 118, 140], LT = [244, 246, 251];
  var URLS = ['https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'];
  function lib() { return new Promise(function (ok, bad) { if (W.jspdf) return ok(); var i = 0; (function next() { if (i >= URLS.length) return bad(Error('The document tool could not load. Check your internet and try again.')); var s = document.createElement('script'); s.src = URLS[i++]; s.onload = function () { W.jspdf ? ok() : next(); }; s.onerror = next; document.head.appendChild(s); })(); }); }
  function img(src, type, size) { return new Promise(function (res) { var i = new Image(); i.onload = function () { try { var c = document.createElement('canvas'); c.width = size || i.naturalWidth; c.height = size || i.naturalHeight; var x = c.getContext('2d'); if (type === 'jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); } x.drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL(type === 'jpeg' ? 'image/jpeg' : 'image/png', .9)); } catch (e) { res(null); } }; i.onerror = function () { res(null); }; i.src = src; }); }
  function clean(s) { return String(s == null ? '' : s).replace(/[^\x20-\x7E -ÿ]/g, '').trim(); }
  function ugx(n) { return 'UGX ' + Math.round(Number(n) || 0).toLocaleString('en-US'); }
  function dmy(d) { try { return new Date(d || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Africa/Kampala' }); } catch (e) { return ''; } }
  var ROLE = { rider: 'Rider', agent: 'Sales Agent', technician: 'Technician', restaurant: 'Restaurant', vendor: 'Restaurant', partner: 'Velos Partner', security: 'Security Partner' };

  async function build(o) {
    await lib();
    var J = W.jspdf.jsPDF, doc = new J({ unit: 'mm', format: 'a4' }), Wd = 210;
    var logo = await img('logo-doc.png', 'jpeg', 256), sig = await img('signature.png', 'png');
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 0, Wd, 40, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 40, Wd, 1.4, 'F');
    if (logo) { try { doc.addImage(logo, 'JPEG', 15, 8, 24, 24); } catch (e) {} }
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.text('The Velos Group', 44, 17);
    doc.setFont('helvetica', 'italic'); doc.setFontSize(9); doc.setTextColor(232, 199, 102); doc.text('Anything. Anywhere. Precisely.', 44, 23);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(190, 200, 225); doc.text('Kampala, Uganda', 44, 29); doc.text('info@thevelosgroup.com  |  thevelosgroup.com', 44, 33);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(232, 199, 102); doc.text('RECEIPT', 195, 18, { align: 'right' });
    doc.setFontSize(10); doc.setTextColor(255, 255, 255); doc.text('No. ' + clean(o.no), 195, 26, { align: 'right' }); doc.setFont('helvetica', 'normal'); doc.text('Date: ' + dmy(o.date), 195, 32, { align: 'right' });
    var y = 58;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(o.direction === 'out' ? 'PAID TO' : 'RECEIVED FROM', 15, y);
    doc.setFontSize(14); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(clean(o.name) || '-', 15, y + 7);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(GR[0], GR[1], GR[2]); if (o.role) doc.text(clean(o.role), 15, y + 13);
    y += 24;
    var rows = o.lines || [];
    rows.forEach(function (r, i) { if (i % 2 === 0) { doc.setFillColor(LT[0], LT[1], LT[2]); doc.rect(15, y, 180, 9, 'F'); } doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(clean(r[0]), 18, y + 6); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text(clean(r[1]) || '-', 75, y + 6); y += 9; });
    y += 6; doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(15, y, 180, 16, 'F'); doc.setTextColor(232, 199, 102); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(o.direction === 'out' ? 'AMOUNT PAID' : 'AMOUNT RECEIVED', 20, y + 10);
    doc.setFontSize(15); doc.setTextColor(255, 255, 255); doc.text(ugx(o.amount), 190, y + 10.5, { align: 'right' });
    y += 26;
    if (o.note) { doc.setFont('helvetica', 'italic'); doc.setFontSize(10); doc.setTextColor(TX[0], TX[1], TX[2]); doc.splitTextToSize(clean(o.note), 175).forEach(function (l, i) { doc.text(l, 15, y + i * 5); }); y += 16; }
    var sy = Math.max(y + 30, 200);
    if (sig) { try { doc.addImage(sig, 'PNG', 20, sy - 25, 36, 24.2); } catch (e) {} }
    try { if (W.VelosStamp) await W.VelosStamp.place(doc, 62, sy - 34, 34, { label: o.direction === 'out' ? 'PAID' : 'RECEIVED', date: o.date }); } catch (e) {}
    doc.setDrawColor(GR[0], GR[1], GR[2]); doc.setLineWidth(.3); doc.line(15, sy, 75, sy);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(TX[0], TX[1], TX[2]); doc.text('The Velos Group', 15, sy + 4.5); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text('Authorised signatory', 15, sy + 9);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text('This is a computer-generated receipt. It is valid with the official Velos stamp and signature.', 15, 276);
    doc.setFillColor(NV[0], NV[1], NV[2]); doc.rect(0, 284, Wd, 13, 'F'); doc.setFillColor(GD[0], GD[1], GD[2]); doc.rect(0, 284, Wd, .8, 'F');
    doc.setFontSize(8); doc.setTextColor(232, 199, 102); doc.text('Thank you for being part of The Velos Group', Wd / 2, 291, { align: 'center' });
    return { doc: doc, file: 'Velos-Receipt-' + clean(o.no).replace(/[^A-Za-z0-9-]/g, '') + '.pdf' };
  }
  function fee(r) {
    var monthly = r.kind === 'monthly', kind = r.subject_kind;
    return build({ no: r.receipt_no || ('VR-' + String(r.id || '').slice(0, 6).toUpperCase()), date: r.paid_at, name: r.name, role: ROLE[kind === 'vendor' ? 'restaurant' : kind] || '', direction: 'in', amount: r.amount_ugx,
      lines: [['Payment for', monthly ? 'Monthly maintenance fee' + (r.period ? ' (' + r.period + ')' : '') : (kind === 'rider' ? 'Rider joining fee' : 'One-time registration fee')], ['Reference', r.ref || '-'], ['Received on', dmy(r.paid_at)], ['Status', 'PAID IN FULL']],
      note: 'Thank you. This fee keeps your Velos account active and supports marketing, maintenance and customer support for your business.' });
  }
  function pay(o) {
    return build({ no: o.no, date: o.paid_at, name: o.name, role: ROLE[o.role] || '', direction: 'out', amount: o.amount,
      lines: [['Payment type', o.kind || 'Earnings payout'], ['Reference', o.reference || '-'], ['Paid on', dmy(o.paid_at)], ['Status', 'PAID']], note: o.note || 'Thank you for your work with The Velos Group.' });
  }
  function save(r) { r.doc.save(r.file); }
  W.VelosReceipt = { fee: fee, pay: pay, save: save, build: build };
})(window);
