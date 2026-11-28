/* Velos watermark for every generated PDF (agreements, receipts, invoices, quotations).
   VelosWM.apply(doc)  -> faint diagonal "THE VELOS GROUP" with a small tagline on every page. */
(function (W) {
  function apply(doc) {
    try {
      var n = doc.getNumberOfPages(), w = doc.internal.pageSize.getWidth(), h = doc.internal.pageSize.getHeight(), a = 38, r = a * Math.PI / 180;
      for (var i = 1; i <= n; i++) {
        doc.setPage(i); doc.saveGraphicsState(); doc.setGState(new doc.GState({ opacity: 0.065 }));
        doc.setTextColor(3, 17, 62); doc.setFont('times', 'bold'); doc.setFontSize(Math.round(w * 0.34 / 2.6));
        var t = 'THE VELOS GROUP', tw = doc.getTextWidth(t);
        doc.text(t, w / 2 - Math.cos(r) * tw / 2, h / 2 + Math.sin(r) * tw / 2, { angle: a });
        doc.setFont('helvetica', 'bold'); doc.setFontSize(Math.round(w * 0.07 / 2.6)); var s = 'ANYTHING. ANYWHERE. PRECISELY.', sw = doc.getTextWidth(s), d = 22;
        doc.text(s, w / 2 - Math.cos(r) * sw / 2 + Math.sin(r) * d, h / 2 + Math.sin(r) * sw / 2 + Math.cos(r) * d, { angle: a });
        doc.restoreGraphicsState();
      }
    } catch (e) {}
  }
  W.VelosWM = { apply: apply };
})(window);
