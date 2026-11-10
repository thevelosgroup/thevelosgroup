/* Velos Share: one professional share sheet for every product, combo, promotion, dish and store.
   - Makes a clear branded picture (photo, name, price, offer badge, Velos name) and a neat message.
   - The link opens the exact item. A second option opens it already added to the customer's cart.
   - On phones it shares the picture and message together; on computers it copies, downloads or opens WhatsApp.
   Use:  VelosShare.reg('key', {...}); then a button with onclick="VelosShare.go('key')"  or  VelosShare.open({...}). */
(function(){ var W = window, D = document;
  if(W.VelosShare) return;
  if(!W.VELOS_SITE){ try { var cs = D.createElement('script'); cs.src = 'velos-site-config.js'; D.head.appendChild(cs); } catch(e){} }
  var REG = {}, LAST = null;
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var money = function(n){ return 'UGX ' + Math.round(+n || 0).toLocaleString('en-US'); };
  var ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>';

  var CSS = '#vshB{position:fixed;inset:0;z-index:2147483200;background:rgba(2,8,28,.72);display:flex;align-items:flex-end;justify-content:center;animation:vshf .18s}@keyframes vshf{from{opacity:0}to{opacity:1}}'
  + '#vsh{width:min(520px,100%);max-height:94vh;overflow:auto;background:#0b1226;color:#f4f1ea;border:1px solid #2a3560;border-radius:22px 22px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font:15px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;animation:vshu .25s ease-out}@keyframes vshu{from{transform:translateY(40px)}to{transform:none}}'
  + '@media(min-width:640px){#vshB{align-items:center}#vsh{border-radius:22px}}'
  + '#vsh .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}#vsh .hd b{font:700 18px Georgia,serif;color:#e8c766}#vsh .x{background:rgba(255,255,255,.08);border:0;color:#f4f1ea;width:34px;height:34px;border-radius:50%;font-size:18px;cursor:pointer}'
  + '#vsh .pv{background:#fff;border-radius:14px;min-height:120px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px}#vsh .pv img{width:100%;display:block;max-height:46vh;object-fit:contain}#vsh .pv span{color:#6a7179;padding:30px;font-size:13px}'
  + '#vsh .lk{display:grid;gap:7px;margin:0 0 10px}#vsh .lk label{display:flex;gap:10px;align-items:flex-start;border:1px solid #2a3866;border-radius:12px;padding:9px 11px;cursor:pointer;background:#0a1130}#vsh .lk input{margin-top:3px;accent-color:#e8c766}#vsh .lk b{display:block;font-size:14px}#vsh .lk small{color:#9fb0e0;font-size:12px}#vsh .lk label.on{border-color:#e8c766;background:#141c3c}'
  + '#vsh textarea{width:100%;min-height:150px;resize:vertical;background:#0a1130;color:#f4f1ea;border:1px solid #2a3866;border-radius:12px;padding:11px 12px;font:14px/1.5 system-ui;margin-bottom:10px;box-sizing:border-box}'
  + '#vsh .bt{display:grid;grid-template-columns:1fr 1fr;gap:8px}#vsh .bt button{border:1px solid #33406f;background:#121c3f;color:#f4f1ea;border-radius:12px;padding:12px 8px;font:700 14px system-ui;cursor:pointer;display:flex;gap:7px;align-items:center;justify-content:center}'
  + '#vsh .bt button.pr{grid-column:1/-1;background:#e8c766;color:#080d1f;border-color:#e8c766;font-size:16px;padding:14px}#vsh .bt button.wa{background:#1f8a4c;border-color:#1f8a4c}#vsh .bt button:hover{filter:brightness(1.1)}'
  + '#vsh .nt{color:#9fb0e0;font-size:12px;margin-top:9px;text-align:center}'
  + '.vsh-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid currentColor;background:transparent;color:inherit;border-radius:99px;padding:6px 12px;font:700 13px system-ui;cursor:pointer;opacity:.92}.vsh-btn:hover{opacity:1}'
  + '.vsh-fab{position:absolute;top:8px;right:8px;z-index:3;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.94);color:#14192b;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.3);cursor:pointer}';
  var st = D.createElement('style'); st.textContent = CSS; (D.head || D.documentElement).appendChild(st);

  function abs(u){ try { return new URL(u, location.href).href; } catch(e){ return u; } }
  function loadImg(src){ return new Promise(function(ok, no){ if(!src) return no(); var tryIt = function(cors){ var i = new Image(); if(cors) i.crossOrigin = 'anonymous'; i.onload = function(){ ok(i); }; i.onerror = function(){ if(cors) tryIt(false); else no(); }; i.src = abs(src); }; tryIt(true); }); }
  function wrap(x, t, w, max){ var words = String(t || '').split(/\s+/), lines = [], cur = ''; words.forEach(function(wd){ var tt = cur ? cur + ' ' + wd : wd; if(x.measureText(tt).width > w && cur){ lines.push(cur); cur = wd; } else cur = tt; }); if(cur) lines.push(cur); if(lines.length > max){ lines = lines.slice(0, max); lines[max - 1] = lines[max - 1].replace(/\s*\S*$/, '') + '…'; } return lines; }
  function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }

  /* the picture: a clear photo on white, with a dark Velos band that carries the facts */
  function makeImage(o){ return loadImg(o.image).catch(function(){ return null; }).then(function(photo){ return loadImg('logo-mark.png').catch(function(){ return null; }).then(function(logo){
    var Wd = 1080, Ht = 1350, band = 380, ph = Ht - band, c = D.createElement('canvas'); c.width = Wd; c.height = Ht; var x = c.getContext('2d');
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, Wd, ph);
    if(photo){ var sc = Math.min((Wd - 90) / photo.width, (ph - 110) / photo.height); var dw = photo.width * sc, dh = photo.height * sc; x.imageSmoothingQuality = 'high'; x.drawImage(photo, (Wd - dw) / 2, (ph - dh) / 2 + 10, dw, dh); }
    else { x.fillStyle = '#f1efe8'; x.fillRect(0, 0, Wd, ph); x.fillStyle = '#b9b3a2'; x.font = '700 120px Georgia'; x.textAlign = 'center'; x.fillText((o.title || 'V').charAt(0).toUpperCase(), Wd / 2, ph / 2 + 40); x.textAlign = 'left'; }
    var tag = o.discount ? '-' + o.discount + '% OFF' : (o.tag || ''); if(tag){ x.font = '800 32px Arial'; var tw = x.measureText(tag).width; x.fillStyle = o.discount ? '#e6493f' : '#080d1f'; rr(x, 30, 30, tw + 52, 64, 32); x.fill(); x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.fillText(tag, 56, 63); x.textBaseline = 'alphabetic'; }
    var g = x.createLinearGradient(0, ph, 0, Ht); g.addColorStop(0, '#101a3d'); g.addColorStop(1, '#080d1f'); x.fillStyle = g; x.fillRect(0, ph, Wd, band);
    x.fillStyle = '#e8c766'; x.fillRect(0, ph, Wd, 5);
    x.font = '600 50px Georgia, serif'; x.fillStyle = '#f4f1ea'; var ls = wrap(x, o.title, Wd - 70, 2); ls.forEach(function(l, i){ x.fillText(l, 36, ph + 78 + i * 58); });
    var y = ph + 78 + (ls.length - 1) * 58 + 78;
    if(o.price != null){ x.font = '800 66px Arial'; x.fillStyle = '#7fd99a'; var pt = money(o.price); x.fillText(pt, 36, y); if(o.oldPrice){ var pw = x.measureText(pt).width; x.font = '400 34px Arial'; x.fillStyle = '#8a93ab'; var ot = money(o.oldPrice); x.fillText(ot, 36 + pw + 22, y); var ow = x.measureText(ot).width; x.strokeStyle = '#8a93ab'; x.lineWidth = 3; x.beginPath(); x.moveTo(36 + pw + 22, y - 12); x.lineTo(36 + pw + 22 + ow, y - 12); x.stroke(); } }
    else { x.font = '700 44px Arial'; x.fillStyle = '#e8c766'; x.fillText('Request a quote', 36, y); }
    if(o.store){ x.font = '600 30px Arial'; x.fillStyle = '#b7c1e3'; x.fillText(wrap(x, 'Sold by ' + o.store, Wd - 300, 1)[0], 36, y + 52); }
    x.font = '700 28px Georgia, serif'; x.fillStyle = '#e8c766'; x.fillText('THE VELOS GROUP', 36, Ht - 42); x.font = '500 24px Arial'; x.fillStyle = '#9fb0e0'; x.textAlign = 'right'; x.fillText('Order online · pay safely · track it', Wd - 36, Ht - 42); x.textAlign = 'left';
    if(logo){ var lh = 78, lw = logo.width * lh / logo.height; x.drawImage(logo, Wd - lw - 34, ph + 22, lw, lh); }
    return new Promise(function(res){ try { c.toBlob(function(b){ res(b); }, 'image/jpeg', 0.92); } catch(e){ res(null); } }); }); }); }

  var KIND = {product:'', combo:'🎁 Combo deal', promo:'🔥 Special offer', dish:'🍽️ Fresh from Velos Foods', store:'🏪 Shop with us', restaurant:'🍽️ Order from us'};
  function message(o, url){ var L = [], k = KIND[o.kind || 'product'];
    L.push((o.kind === 'dish' ? '🍽️' : o.kind === 'store' || o.kind === 'restaurant' ? '🏪' : o.kind === 'combo' ? '🎁' : '🛍️') + ' *' + o.title + '*');
    if(k) L.push(k + (o.discount ? ' · *' + o.discount + '% OFF*' : '')); else if(o.discount) L.push('🔥 *' + o.discount + '% OFF*');
    if(o.price != null) L.push('💰 *' + money(o.price) + '*' + (o.oldPrice ? '  ~' + money(o.oldPrice) + '~' : '')); else if(o.kind !== 'store' && o.kind !== 'restaurant') L.push('💰 Request a quote');
    if(o.store) L.push('📍 ' + o.store);
    if(o.ends) L.push('⏳ Until ' + o.ends);
    if(o.desc) L.push('', String(o.desc).replace(/\s+/g, ' ').slice(0, 160));
    L.push('', '✅ Order online, pay safely and track every step.', '👉 ' + url, '', '_The Velos Group · Anything. Anywhere. Precisely._');
    return L.join('\n'); }

  function urlFor(o, add){ var u = (add && o.addUrl) ? o.addUrl : o.url; u = abs(u || location.href); try { var ref = new URLSearchParams(location.search).get('ref'); if(ref && !/[?&]ref=/.test(u)){ var h = u.split('#'), q = h[0].indexOf('?') > -1 ? '&' : '?'; u = h[0] + q + 'ref=' + encodeURIComponent(ref) + (h[1] != null ? '#' + h[1] : ''); } } catch(e){}
    try { var sb = (W.VELOS_SITE && VELOS_SITE.shareBase) || ''; if(sb && o.kind !== 'store' && !o.noBrand){ var P = ['u=' + encodeURIComponent(u), 't=' + encodeURIComponent(o.title || '')]; if(o.image) P.push('i=' + encodeURIComponent(abs(o.image))); if(o.price) P.push('p=' + encodeURIComponent(o.price)); if(o.desc) P.push('d=' + encodeURIComponent(String(o.desc).slice(0, 150))); u = sb.replace(/\/+$/, '') + '/s?' + P.join('&'); } } catch(e){}
    return u; }

  function close(){ var b = D.getElementById('vshB'); if(b) b.remove(); if(LAST && LAST.obj) try { URL.revokeObjectURL(LAST.obj); } catch(e){} LAST = null; }
  function toast(t){ var e = D.getElementById('vshT'); if(!e){ e = D.createElement('div'); e.id = 'vshT'; e.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#e8c766;color:#080d1f;font:700 14px system-ui;padding:10px 18px;border-radius:99px;z-index:2147483300;box-shadow:0 8px 24px rgba(0,0,0,.4)'; D.body.appendChild(e); } e.textContent = t; e.style.display = 'block'; clearTimeout(e._t); e._t = setTimeout(function(){ e.style.display = 'none'; }, 2200); }
  function copy(t, ok){ var done = function(){ toast(ok || 'Copied ✓'); }; if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function(){ fb(); }); else fb(); function fb(){ var a = D.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; D.body.appendChild(a); a.select(); try { D.execCommand('copy'); done(); } catch(e){ prompt('Copy this', t); } a.remove(); } }


  /* the exact photo of the item, untouched (only shrunk if it is very large) */
  function exactPhoto(src){ if(!src) return Promise.resolve(null);
    return fetch(abs(src), {mode:'cors'}).then(function(r){ if(!r.ok) throw 0; return r.blob(); }).then(function(b){ if(!/^image\//.test(b.type)) throw 0;
      if(b.size <= 2500000) return b;
      return createImageBitmap(b).then(function(bm){ var k = Math.min(1, 1800 / Math.max(bm.width, bm.height)), c = D.createElement('canvas'); c.width = Math.round(bm.width * k); c.height = Math.round(bm.height * k); c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height); return new Promise(function(res){ c.toBlob(function(x){ res(x || b); }, 'image/jpeg', 0.92); }); }); })
    .catch(function(){ return loadImg(src).then(function(i){ var c = D.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight; c.getContext('2d').drawImage(i, 0, 0); return new Promise(function(res){ try { c.toBlob(function(x){ res(x); }, 'image/jpeg', 0.92); } catch(e){ res(null); } }); }).catch(function(){ return null; }); }); }
  function extOf(b){ return /png/.test(b.type) ? 'png' : /webp/.test(b.type) ? 'webp' : /gif/.test(b.type) ? 'gif' : 'jpg'; }

  function open(o){ close();
    var S = LAST = {o:o, add:false, blob:null, obj:null, card:false, photo:null}, B = D.createElement('div'); B.id = 'vshB';
    var hasAdd = !!o.addUrl;
    B.innerHTML = '<div id="vsh" role="dialog" aria-label="Share"><div class="hd"><b>Share this ' + esc(o.kind === 'combo' ? 'combo' : o.kind === 'promo' ? 'offer' : o.kind === 'store' || o.kind === 'restaurant' ? 'store' : o.kind === 'dish' ? 'dish' : 'product') + '</b><button class="x" type="button" aria-label="Close">×</button></div>'
      + '<div class="pv" id="vshP"><span>Loading the photo…</span></div>'
      + (hasAdd ? '<div class="lk" id="vshL"><label class="on"><input type="radio" name="vshl" value="0" checked><span><b>Link to this item</b><small>Opens it so the customer can read, add to cart or order.</small></span></label><label><input type="radio" name="vshl" value="1"><span><b>Add-to-cart link</b><small>Opens with the item already in the customer\'s cart, ready to order.</small></span></label></div>' : '')
      + '<textarea id="vshM" aria-label="Message"></textarea>'
      + '<div class="bt"><button class="pr" type="button" id="vshS">' + ICON + ' Share picture and message</button><button class="wa" type="button" id="vshW">💬 WhatsApp</button><button type="button" id="vshC">📋 Copy message</button><button type="button" id="vshK">🔗 Copy link</button><button type="button" id="vshD">⬇️ Save picture</button></div>'
      + '<div class="nt" id="vshN"></div><div class="nt"><a href="#" id="vshT2" style="color:#e8c766"></a></div></div>';
    D.body.appendChild(B);
    var $ = function(i){ return D.getElementById(i); }, msg = $('vshM');
    var refresh = function(){ msg.value = message(o, urlFor(o, S.add)); }; refresh();
    B.addEventListener('click', function(e){ if(e.target === B || e.target.className === 'x') close(); });
    if(hasAdd) $('vshL').addEventListener('change', function(e){ S.add = e.target.value === '1'; refresh(); [].forEach.call($('vshL').children, function(l){ l.className = l.querySelector('input').checked ? 'on' : ''; }); });
    var url = function(){ return urlFor(o, S.add); };
    var baseName = (String(o.title || 'velos').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'velos'), nameOf = function(b){ return baseName + '.' + (b ? extOf(b) : 'jpg'); };
    var show = function(bl, fallbackSrc){ S.blob = bl; if(S.obj){ try { URL.revokeObjectURL(S.obj); } catch(e){} S.obj = null; } var pv = $('vshP'); if(!pv) return; if(bl){ S.obj = URL.createObjectURL(bl); pv.innerHTML = '<img alt="Preview" src="' + S.obj + '">'; } else if(fallbackSrc){ pv.innerHTML = '<img alt="" src="' + esc(abs(fallbackSrc)) + '">'; } else pv.innerHTML = '<span>No picture for this item yet. The message and link still work.</span>'; };
    var t2 = $('vshT2');
    var setMode = function(card){ S.card = card; t2.textContent = card ? 'Use the plain product photo instead' : 'Use a branded picture card instead'; t2.style.display = o.image ? '' : 'none';
      if(card){ $('vshP').innerHTML = '<span>Preparing your picture…</span>'; makeImage(o).then(function(bl){ if(S.card) show(bl, o.image); }); }
      else { show(S.photo, o.image); } };
    t2.onclick = function(e){ e.preventDefault(); setMode(!S.card); };
    exactPhoto(o.image).then(function(bl){ S.photo = bl; if(bl){ setMode(false); } else { setMode(true); } });
    $('vshP').innerHTML = '<span>Loading the photo…</span>';
    var asFile = function(){ return S.blob ? new File([S.blob], nameOf(S.blob), {type:S.blob.type || 'image/jpeg'}) : null; };
    $('vshS').onclick = function(){ var f = asFile(), data = {title:o.title, text:msg.value}; if(!navigator.share){ copy(msg.value, 'Message copied. Paste it in WhatsApp, Facebook or SMS ✓'); $('vshN').textContent = 'Tip: tap Save picture and attach it to your post.'; return; }
      if(f && navigator.canShare && navigator.canShare({files:[f]})) data.files = [f];
      navigator.share(data).catch(function(e){ if(e && e.name === 'AbortError') return; copy(msg.value, 'Message copied ✓'); }); };
    $('vshW').onclick = function(){ var f = asFile(); if(f && navigator.canShare && navigator.canShare({files:[f]}) && /Android|iPhone|iPad/i.test(navigator.userAgent)){ navigator.share({title:o.title, text:msg.value, files:[f]}).catch(function(e){ if(!e || e.name !== 'AbortError') window.open('https://wa.me/?text=' + encodeURIComponent(msg.value), '_blank', 'noopener'); }); return; }
      window.open('https://wa.me/?text=' + encodeURIComponent(msg.value), '_blank', 'noopener'); $('vshN').textContent = 'WhatsApp opens with your message. Tap Save picture to attach the photo too.'; };
    $('vshC').onclick = function(){ copy(msg.value, 'Message copied ✓'); };
    $('vshK').onclick = function(){ copy(url(), 'Link copied ✓'); };
    $('vshD').onclick = function(){ if(!S.blob){ toast('No picture to save'); return; } var a = D.createElement('a'); a.href = S.obj; a.download = nameOf(S.blob); D.body.appendChild(a); a.click(); a.remove(); toast('Picture saved ✓'); };
  }

  function reg(key, o){ REG[key] = o; return key; }
  function go(key){ var o = REG[key]; if(o) open(o); return false; }
  /* share button HTML: kind 'fab' sits on a photo corner, 'pill' is a text button */
  function btn(key, kind, label){ return kind === 'fab' ? '<button type="button" class="vsh-fab" onclick="event.stopPropagation();VelosShare.go(\'' + esc(key) + '\')" aria-label="Share">' + ICON + '</button>' : '<button type="button" class="vsh-btn" onclick="event.stopPropagation();VelosShare.go(\'' + esc(key) + '\')" aria-label="Share">' + ICON + ' ' + esc(label || 'Share') + '</button>'; }
  function site(){ open({kind:'store', title:'The Velos Group', image:'og-image.jpg', desc:'Shop electronics, fashion and home goods, order food from top restaurants, book verified technicians and more. Delivered across Uganda, with Kenya and Rwanda coming.', url:location.origin && /^http/.test(location.origin) ? location.origin + '/' : 'https://thevelosgroup.com/', noBrand:true}); }
  W.VelosShare = {site:site, open:open, reg:reg, go:go, btn:btn, message:message, makeImage:makeImage, close:close, icon:ICON};
})();
