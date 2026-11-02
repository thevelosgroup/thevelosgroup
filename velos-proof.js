/* Velos photo proof: riders (pick-up / hand-over) and technicians (before / after).
   VelosProof.require(db, {type, ref, stage, title, hint, optional}) -> Promise<boolean> (true = photo saved or already on file) */
(function(){ var W = window, D = document;
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function pos(){ return new Promise(function(ok){ if(!navigator.geolocation) return ok(null); navigator.geolocation.getCurrentPosition(function(p){ ok({lat:p.coords.latitude, lng:p.coords.longitude}); }, function(){ ok(null); }, {enableHighAccuracy:true, timeout:6000, maximumAge:20000}); }); }
  function shrink(file, label){ return new Promise(function(res, rej){ var u = URL.createObjectURL(file), im = new Image(); im.onload = function(){ var k = Math.min(1, 1280 / Math.max(im.width, im.height)), c = D.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); var x = c.getContext('2d'); x.drawImage(im, 0, 0, c.width, c.height);
      var h = Math.max(22, Math.round(c.width / 38)); x.fillStyle = 'rgba(8,13,31,.78)'; x.fillRect(0, c.height - h * 1.9, c.width, h * 1.9); x.fillStyle = '#e8c766'; x.font = 'bold ' + h + 'px sans-serif'; x.textBaseline = 'middle'; x.fillText(label, h * .6, c.height - h * .95);
      c.toBlob(function(b){ URL.revokeObjectURL(u); b ? res(b) : rej(Error('Could not read the photo')); }, 'image/jpeg', .82); }; im.onerror = function(){ rej(Error('That photo could not be read')); }; im.src = u; }); }
  function stamp(o){ var d = new Date(); return 'VELOS · ' + (o.type === 'service_request' ? 'Job ' : 'Order ') + o.ref + ' · ' + o.stage.toUpperCase() + ' · ' + d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}); }
  function require(db, o){ o = o || {}; return new Promise(function(done){
    function run(){ var m = D.createElement('div'); m.style.cssText = 'position:fixed;inset:0;z-index:2147483200;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:14px';
      m.innerHTML = '<div style="background:#0f1730;color:#f4f1ea;border:1px solid #e8c766;border-radius:16px;max-width:440px;width:100%;max-height:94vh;overflow:auto;padding:18px;font:14px/1.5 system-ui,sans-serif"><b style="font-size:17px;color:#e8c766">📸 ' + esc(o.title || 'Take a photo') + '</b>'
        + '<p style="color:#a3adc6;margin:6px 0 10px">' + esc(o.hint || 'Take a clear photo. It is saved with the time and place for transparency.') + '</p>'
        + '<label id="vpf-lab" style="display:block;border:2px dashed #e8c766;border-radius:12px;text-align:center;padding:26px 10px;cursor:pointer"><span id="vpf-t" style="font-size:16px;font-weight:700;color:#e8c766">📷 Tap to open the camera</span><input id="vpf-f" type="file" accept="image/*" capture="environment" style="display:none"></label>'
        + '<img id="vpf-i" style="display:none;width:100%;border-radius:12px;margin-top:10px"><input id="vpf-n" placeholder="Note (optional)" style="width:100%;margin-top:10px;padding:10px;border-radius:8px;border:1px solid #3a4770;background:#0b1229;color:#fff;box-sizing:border-box">'
        + '<p id="vpf-m" style="min-height:18px;margin:8px 0;color:#a3adc6"></p><button id="vpf-ok" disabled style="width:100%;padding:13px;border:0;border-radius:10px;background:#e8c766;color:#080d1a;font-weight:700;opacity:.5">Upload and continue</button>'
        + (o.optional ? '<button id="vpf-skip" style="width:100%;margin-top:8px;padding:11px;border:1px solid #3a4770;border-radius:10px;background:none;color:#a3adc6">Skip</button>' : '') + '<button id="vpf-x" style="width:100%;margin-top:8px;padding:11px;border:0;background:none;color:#a3adc6">Cancel</button></div>';
      D.body.appendChild(m); var $ = function(i){ return m.querySelector('#' + i); }, blob = null, pos0 = pos();
      function fin(v){ m.remove(); done(v); }
      $('vpf-f').onchange = function(e){ var f = e.target.files[0]; if(!f) return; $('vpf-m').textContent = 'Preparing photo…'; shrink(f, stamp(o)).then(function(b){ blob = b; var i = $('vpf-i'); i.src = URL.createObjectURL(b); i.style.display = 'block'; $('vpf-t').textContent = '🔄 Retake photo'; $('vpf-m').textContent = ''; var bt = $('vpf-ok'); bt.disabled = false; bt.style.opacity = 1; }).catch(function(x){ $('vpf-m').style.color = '#f87171'; $('vpf-m').textContent = x.message; }); };
      $('vpf-x').onclick = function(){ fin(false); }; if($('vpf-skip')) $('vpf-skip').onclick = function(){ fin(true); };
      $('vpf-ok').onclick = async function(){ var bt = this; if(!blob) return; bt.disabled = true; bt.textContent = 'Uploading…'; try {
          var ss = (await db.auth.getSession()).data.session, p = await pos0, path = o.stage + '/' + o.type + '-' + o.ref + '/' + ss.user.id + '-' + Date.now() + '.jpg';
          var up = await db.storage.from('proof-photos').upload(path, blob, {contentType:'image/jpeg', upsert:true}); if(up.error) throw up.error;
          var r = await db.rpc('proof_add', {p_ref_type:o.type, p_ref:String(o.ref), p_stage:o.stage, p_path:path, p_lat:p ? p.lat : null, p_lng:p ? p.lng : null, p_note:$('vpf-n').value}); if(r.error) throw r.error; fin(true);
        } catch(e){ bt.disabled = false; bt.textContent = 'Try again'; $('vpf-m').style.color = '#f87171'; $('vpf-m').textContent = (/function|schema cache/i.test(e.message || '') ? 'Velos is still switching this on. Please tell Velos support. ' : '') + (e.message || 'Upload failed. Check your internet and try again.'); } };
    }
    db.rpc('proof_has', {p_ref_type:o.type, p_ref:String(o.ref), p_stage:o.stage}).then(function(r){ if(r.data === true) done(true); else run(); }, run);
  }); }
  W.VelosProof = {require:require};
})(window);
