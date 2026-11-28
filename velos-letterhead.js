/* Velos headed paper for generated PDF documents (jsPDF).
   White paper, dark Velos logo (readable on white and when printed), navy and gold rules, footer with page numbers.
   Usage:  await VelosLH.load();  y = VelosLH.first(doc);  ...  doc.addPage(); y = VelosLH.next(doc);  ...  VelosLH.finish(doc, 'Agreement no. X');  */
(function () {
  var NV = [3, 17, 62], GD = [201, 162, 39], GR = [110, 118, 140], GDK = [150, 112, 20], logo = null;
  var CONTACT = 'Uganda  |  info@thevelosgroup.com', SITE = 'thevelosgroup.com  |  WhatsApp +256 755 215 751';
  function load() {
    if (logo) return Promise.resolve();
    return fetch('logo-mark-dark.png').then(function (r) { return r.blob(); }).then(function (b) {
      return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { logo = f.result; ok(); }; f.readAsDataURL(b); });
    }).catch(function () { logo = null; });
  }
  function first(doc) {
    if (logo) { try { doc.addImage(logo, 'PNG', 15, 9, 30, 18); } catch (e) {} }
    doc.setFont('times', 'bold'); doc.setFontSize(16); doc.setTextColor(NV[0], NV[1], NV[2]); doc.text('THE VELOS GROUP', 195, 16, { align: 'right' });
    doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(GDK[0], GDK[1], GDK[2]); doc.text('Anything. Anywhere. Precisely.', 195, 21.5, { align: 'right' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(GR[0], GR[1], GR[2]); doc.text(CONTACT, 195, 27, { align: 'right' }); doc.text(SITE, 195, 31, { align: 'right' });
    doc.setDrawColor(NV[0], NV[1], NV[2]); doc.setLineWidth(.7); doc.line(15, 36, 195, 36);
    doc.setDrawColor(GD[0], GD[1], GD[2]); doc.setLineWidth(.35); doc.line(15, 37.6, 195, 37.6);
    return 48;
  }
  function next(doc) {
    if (logo) { try { doc.addImage(logo, 'PNG', 15, 7, 15, 9); } catch (e) {} }
    doc.setFont('times', 'bold'); doc.setFontSize(10); doc.setTextColor(NV[0], NV[1], NV[2]); doc.text('THE VELOS GROUP', 195, 13, { align: 'right' });
    doc.setDrawColor(NV[0], NV[1], NV[2]); doc.setLineWidth(.5); doc.line(15, 19, 195, 19); doc.setDrawColor(GD[0], GD[1], GD[2]); doc.setLineWidth(.25); doc.line(15, 20.4, 195, 20.4);
    return 30;
  }
  /* Velos watermark: faint diagonal brand name, drawn on every page of every Velos document */
  function watermark(doc, pages) {
    try {
      var n = doc.getNumberOfPages(), W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
      for (var i = 1; i <= n; i++) {
        doc.setPage(i); doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.07 }));
        doc.setTextColor(NV[0], NV[1], NV[2]); doc.setFont('times', 'bold'); doc.setFontSize(Math.round(W * 0.34 / 2.6));
        var a = 38, rad = a * Math.PI / 180, txt = 'THE VELOS GROUP', tw = doc.getTextWidth(txt);
        doc.text(txt, W / 2 - Math.cos(rad) * tw / 2, H / 2 + Math.sin(rad) * tw / 2, { angle: a });
        if (logo) { try { doc.addImage(logo, 'PNG', W / 2 - 22, H / 2 + 28, 44, 26); } catch (e) {} }
        doc.restoreGraphicsState();
      }
    } catch (e) {}
  }
  function finish(doc, label) {
    watermark(doc);
    var n = doc.getNumberOfPages();
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); doc.setDrawColor(GD[0], GD[1], GD[2]); doc.setLineWidth(.35); doc.line(15, 284, 195, 284);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(GR[0], GR[1], GR[2]);
      doc.text('The Velos Group  |  Uganda  |  info@thevelosgroup.com  |  thevelosgroup.com', 15, 289);
      doc.text((label ? label + '  |  ' : '') + 'Page ' + i + ' of ' + n, 195, 289, { align: 'right' });
    }
  }
  window.VelosLH = { load: load, first: first, next: next, finish: finish, watermark: watermark };
})();
