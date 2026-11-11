/* Velos languages: English, Luganda and Swahili.
   A small, free translator. It swaps the words on the page for the chosen language and remembers the choice.
   It never touches prices, names, phone numbers or your product names.
   To fix or add a phrase, edit a line in ROWS below: ['English', 'Luganda', 'Swahili'].
   The Luganda and Swahili lines are a first draft that should be checked by native speakers. */
(function(W, D){
  if(W.VelosLang) return;
  var ROWS = [
  ['Home','Awaka','Nyumbani'],
  ['Menu','Menu','Menyu'],
  ['Search','Noonya','Tafuta'],
  ['Cart','Ekikapu','Kikapu'],
  ['Close','Ggala','Funga'],
  ['Send','Weereza','Tuma'],
  ['Shop','Edduuka','Duka'],
  ['Shop now','Gula kati','Nunua sasa'],
  ['Food','Emmere','Chakula'],
  ['Fashion','Eby’okwambala','Mavazi'],
  ['Kids','Abaana','Watoto'],
  ['Stores','Amadduuka','Maduka'],
  ['Services','Obuweereza','Huduma'],
  ['Careers','Emirimu','Kazi'],
  ['About','Ebitukwatako','Kuhusu sisi'],
  ['Contact','Tukwate','Wasiliana nasi'],
  ['Get in touch','Tukwate','Wasiliana nasi'],
  ['Support','Obuyambi','Msaada'],
  ['Company','Kampuni','Kampuni'],
  ['Terms','Amateeka','Masharti'],
  ['Privacy policy','Enkola y’ekyama','Sera ya faragha'],
  ['My account','Akawunti yange','Akaunti yangu'],
  ['My Account','Akawunti yange','Akaunti yangu'],
  ['Track order','Goberera oda yo','Fuatilia oda yako'],
  ['Your Order','Oda yo','Oda yako'],
  ['Order now','Oda kati','Agiza sasa'],
  ['Order','Oda','Agiza'],
  ['Place order','Teeka oda','Weka oda'],
  ['Add to cart','Teeka mu kikapu','Weka kikapuni'],
  ['Checkout','Sasula','Lipa'],
  ['Payment','Okusasula','Malipo'],
  ['Secure payment','Okusasula okw’obukuumi','Malipo salama'],
  ['Safe payments','Okusasula okw’obukuumi','Malipo salama'],
  ['Subtotal','Omugatte ogusooka','Jumla ndogo'],
  ['Total','Omugatte','Jumla'],
  ['Delivery','Okutuusa','Usafirishaji'],
  ['Free delivery','Okutuusa ku bwereere','Usafirishaji bure'],
  ['Distance','Ebanga','Umbali'],
  ['Full name *','Erinnya lyo lyonna *','Jina kamili *'],
  ['Full name','Erinnya lyo lyonna','Jina kamili'],
  ['Name','Erinnya','Jina'],
  ['Phone','Essimu','Simu'],
  ['Phone / WhatsApp','Essimu / WhatsApp','Simu / WhatsApp'],
  ['Email','Email','Barua pepe'],
  ['Address','Endagiriro','Anwani'],
  ['Loading…','Kuteekebwa…','Inapakia…'],
  ['Loading menu…','Menu eteekebwa…','Menyu inapakia…'],
  ['Thank you','Weebale','Asante'],
  ['Welcome','Tukusanyukidde','Karibu'],
  ['Back','Ddayo','Rudi'],
  ['Next','Eddako','Endelea'],
  ['Cancel','Sazaamu','Ghairi'],
  ['Save','Kuuma','Hifadhi'],
  ['Yes','Yee','Ndiyo'],
  ['No','Nedda','Hapana'],
  ['Sort','Tegeka','Panga'],
  ['Price: Low to High','Omuwendo: wansi okudda waggulu','Bei: Chini hadi juu'],
  ['Price: High to Low','Omuwendo: waggulu okudda wansi','Bei: Juu hadi chini'],
  ['Name: A–Z','Erinnya: A–Z','Jina: A–Z'],
  ['Featured','Ebyalondeddwa','Zilizoangaziwa'],
  ['Featured products','Ebintu ebyalondeddwa','Bidhaa zilizoangaziwa'],
  ['Shop by category','Gula ng’okozesa ebika','Nunua kwa kategoria'],
  ['Browse all categories','Laba ebika byonna','Tazama kategoria zote'],
  ['Everything in one place','Byonna mu kifo kimu','Kila kitu mahali pamoja'],
  ['Delivered with care','Bituusibwa n’obwegendereza','Tunawasilisha kwa uangalifu'],
  ['Verified people','Abantu abakakasiddwa','Watu waliothibitishwa'],
  ['Photo-proof delivery','Okutuusa n’ekifaananyi ekikakasa','Uwasilishaji wenye uthibitisho wa picha'],
  ['Live order tracking','Okugoberera oda butereevu','Ufuatiliaji wa oda moja kwa moja'],
  ['Food, shopping, services and delivery. One tap.','Emmere, okugula, obuweereza n’okutuusa. Okukuba omulundi gumu.','Chakula, ununuzi, huduma na usafirishaji. Mguso mmoja.'],
  ['Search Velos','Noonya mu Velos','Tafuta Velos'],
  ['Search the site','Noonya ku mukutu','Tafuta kwenye tovuti'],
  ['Search the menu…','Noonya mu menu…','Tafuta kwenye menyu…'],
  ['🔍  Search restaurants, dishes or groceries','🔍  Noonya wooteeri, emmere oba ebyokulya','🔍  Tafuta mikahawa, vyakula au mboga'],
  ['Search food, products, stores, services…','Noonya emmere, ebintu, amadduuka, obuweereza…','Tafuta chakula, bidhaa, maduka, huduma…'],
  ['Search products, services, designs...','Noonya ebintu, obuweereza, dizayini...','Tafuta bidhaa, huduma, miundo...'],
  ['Velos Foods','Velos Foods','Velos Foods'],
  ['Explore Velos Foods','Kebera Velos Foods','Gundua Velos Foods'],
  ['Restaurants on Velos Foods','Wooteeri ku Velos Foods','Mikahawa kwenye Velos Foods'],
  ['‹ All restaurants','‹ Wooteeri zonna','‹ Mikahawa yote'],
  ['🔥 Featured and flash deals','🔥 Ebyalondeddwa n’ebiweebwa amangu','🔥 Zilizoangaziwa na ofa za haraka'],
  ['Restaurants, groceries and fresh supplies · delivered','Wooteeri, ebyokulya n’ebibala ebibisi · bituusibwa','Mikahawa, mboga na bidhaa mpya · zinaletwa'],
  ['Delivery is calculated from the map pin on the next step.','Okutuusa kubalirwa okuva ku kifo ky’oteeka ku maapu mu kitundu ekiddako.','Gharama ya usafirishaji hukokotolewa kutoka kwenye pini ya ramani hatua inayofuata.'],
  ['Drop the pin on your delivery spot to see the delivery fee.','Teeka pini ku kifo gye twakutuusiza olabe ensimbi z’okutuusa.','Weka pini mahali pa kuletewa ili uone gharama ya usafirishaji.'],
  ['Mobile money','Mobile money','Pesa ya simu'],
  ['Cash on delivery','Ssente nga bituuse','Lipa unapopokea'],
  ['Pick-up','Okukima','Kuchukua mwenyewe'],
  ['Lunch deal','Ekyemisana eky’enjawulo','Ofa ya chakula cha mchana'],
  ['FREE soda','Soda ya bwereere','Soda BURE'],
  ['Velos Little Stars','Velos Little Stars','Velos Little Stars'],
  ['Little Stars favourites','Ebyagalibwa ebya Little Stars','Vipendwa vya Little Stars'],
  ['Kids Clothing','Engoye z’abaana','Nguo za watoto'],
  ['Kids Shoes','Engatto z’abaana','Viatu vya watoto'],
  ['Toys & Games','Ebizannyo','Vitu vya kuchezea'],
  ['Baby Essentials','Ebyetaagisa omwana omuto','Mahitaji ya mtoto'],
  ['School & Learning','Essomero n’okusoma','Shule na kujifunza'],
  ['Chosen with care','Bironde n’obwegendereza','Vimechaguliwa kwa uangalifu'],
  ['For every age','Eri buli myaka','Kwa kila umri'],
  ['Safe and gentle','Bya bukuumi era bya ssanyu','Salama na laini'],
  ['Ask us to help you choose','Tusabe tukuyambe okulonda','Tuombe tukusaidie kuchagua'],
  ['Fashions & Beauty','Eby’okwambala n’obulungi','Mavazi na urembo'],
  ['Chat with a stylist','Yogera n’omukugu mu by’okwambala','Ongea na mshauri wa mitindo'],
  ['Velos Global Shop','Velos Global Shop','Velos Global Shop'],
  ['Gift Concierge','Obuyambi mu birabo','Huduma ya zawadi'],
  ['Find a Gift Idea','Noonya ekirabo','Pata wazo la zawadi'],
  ['Birthday','Olunaku lw’okuzaalibwa','Siku ya kuzaliwa'],
  ['Wedding','Embaga','Harusi'],
  ['Anniversary','Emyaka egy’obufumbo','Maadhimisho'],
  ['Sell on Velos','Tunda ku Velos','Uza kwenye Velos'],
  ['Open your own store','Ggulawo edduuka lyo','Fungua duka lako'],
  ['Join Velos','Yingira mu Velos','Jiunge na Velos'],
  ['Careers at Velos','Emirimu mu Velos','Kazi Velos'],
  ['Grow with Velos','Kula ne Velos','Kua na Velos'],
  ['Build your business on Velos','Zimba bizinensi yo ku Velos','Jenga biashara yako kwenye Velos'],
  ['Technician Network','Ekibinja ky’abakugu','Mtandao wa mafundi'],
  ['Talk to the desk','Yogera n’ekitongole','Ongea na dawati'],
  ['Talk to a specialist','Yogera n’omukugu','Ongea na mtaalamu'],
  ['Chat with us','Twogerereko','Ongea nasi'],
  ['Send an Inquiry','Weereza ekibuuzo','Tuma swali'],
  ['Get a quote','Funa ekifaananyi ky’omuwendo','Pata nukuu'],
  ['Phone / WhatsApp','Essimu / WhatsApp','Simu / WhatsApp'],
  ['Kampala, Uganda','Kampala, Uganda','Kampala, Uganda'],
  ['Velos AI Assistant','Omuyambi wa Velos AI','Msaidizi wa Velos AI'],
  ['Ask about services, prices, orders...','Buuza ku buweereza, emiwendo, oda...','Uliza kuhusu huduma, bei, oda...'],
  ['Looking for something specific?','Onoonya ekintu ekigere?','Unatafuta kitu maalum?'],
  ['Can’t find what you’re looking for?','Tolaba ky’oyagala?','Huoni unachotafuta?'],
  ['Tell us what you need...','Tubuulire by’oyagala...','Tuambie unachohitaji...'],
  ['Rate your experience','Gerageranya obumanyirivu bwo','Tathmini uzoefu wako'],
  ['Thank you for your order!','Weebale ku oda yo!','Asante kwa oda yako!'],
  ['Your cart is empty','Ekikapu kyo kikalu','Kikapu chako kiko tupu'],
  ['Continue to Velos','Weeyongereyo ku Velos','Endelea kwa Velos'],
  ['Language','Olulimi','Lugha']
  ];
  var LANGS = {en:'English', lg:'Luganda', sw:'Kiswahili'}, IDX = {en:0, lg:1, sw:2}, cur = 'en', MAP = {}, SKIP = {SCRIPT:1, STYLE:1, TEXTAREA:1, NOSCRIPT:1, CODE:1};
  function norm(s){ return String(s).replace(/\s+/g, ' ').trim(); }
  function build(l){ MAP = {}; if(l === 'en') return; ROWS.forEach(function(r){ var k = norm(r[0]); if(r[IDX[l]]) MAP[k] = r[IDX[l]]; }); }
  function lookup(t){ var k = norm(t); if(!k) return null; if(MAP[k]) return MAP[k]; var m = k.match(/^([^A-Za-z0-9]+)(.+)$/); if(m && MAP[m[2]]) return m[1] + MAP[m[2]]; return null; }
  var ATTRS = ['placeholder', 'aria-label', 'title'];
  function textNode(n){ var p = n.parentNode; if(!p || SKIP[p.nodeName] || (p.closest && p.closest('[data-nolang],#vlang'))) return;
    if(n.__vo === undefined){ n.__vo = null; }
    var src = n.__vo !== null ? n.__vo : n.data;
    if(n.__vo !== null && n.data !== n.__vt){ n.__vo = n.data; src = n.data; } /* page changed it: treat as new English text */
    if(cur === 'en'){ if(n.__vo !== null && n.data === n.__vt){ n.data = n.__vo; } n.__vo = null; return; }
    var out = lookup(src); if(out === null){ return; }
    var lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0]; var val = lead + out + trail;
    if(n.__vo === null) n.__vo = src; n.__vt = val; if(n.data !== val) n.data = val; }
  function attrs(el){ if(!el.getAttribute || (el.closest && el.closest('[data-nolang],#vlang'))) return; ATTRS.forEach(function(a){ var v = el.getAttribute(a); if(v === null) return; var key = 'data-vo-' + a, o = el.getAttribute(key), t = el.getAttribute('data-vt-' + a);
      if(o !== null && v !== t){ o = null; el.removeAttribute(key); }
      var src = o !== null ? o : v;
      if(cur === 'en'){ if(o !== null){ el.setAttribute(a, o); el.removeAttribute(key); el.removeAttribute('data-vt-' + a); } return; }
      var out = lookup(src); if(out === null) return; if(o === null) el.setAttribute(key, src); el.setAttribute('data-vt-' + a, out); if(v !== out) el.setAttribute(a, out); }); }
  function walk(root){ if(!root) return; if(root.nodeType === 3){ textNode(root); return; } if(root.nodeType !== 1 || SKIP[root.nodeName]) return;
    attrs(root); var w = D.createTreeWalker(root, 5, null), n; while((n = w.nextNode())){ if(n.nodeType === 3) textNode(n); else if(!SKIP[n.nodeName]) attrs(n); } }
  var mo = null, pending = [], raf = 0;
  function flush(){ raf = 0; var list = pending; pending = []; mo.disconnect(); try { list.forEach(walk); } catch(e){} watch(); }
  function watch(){ if(mo) mo.observe(D.body, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS}); }
  function start(){ mo = new MutationObserver(function(ms){ ms.forEach(function(m){ if(m.type === 'childList') [].forEach.call(m.addedNodes, function(n){ pending.push(n); }); else pending.push(m.target); }); if(!raf) raf = requestAnimationFrame(flush); }); watch(); }
  function set(l){ if(!LANGS[l]) l = 'en'; cur = l; build(l); try { localStorage.setItem('v_lang', l); } catch(e){} D.documentElement.lang = l; if(mo) mo.disconnect(); walk(D.body); watch(); paint(); }
  var CSS = '#vlang{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:8000;font:600 13px system-ui,sans-serif}'
    + '#vlang>button{display:flex;align-items:center;gap:6px;border:1px solid rgba(232,199,102,.6);background:#03113e;color:#f6f3ea;border-radius:99px;padding:8px 13px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.3)}'
    + '#vlang .pp{position:absolute;left:0;bottom:46px;background:#03113e;border:1px solid rgba(232,199,102,.5);border-radius:14px;padding:6px;min-width:150px;box-shadow:0 12px 30px rgba(0,0,0,.4)}'
    + '#vlang .pp button{display:block;width:100%;text-align:left;background:transparent;border:0;color:#f6f3ea;padding:10px 12px;border-radius:10px;font:600 14px system-ui,sans-serif;cursor:pointer}#vlang .pp button.on{background:#e8c766;color:#03113e}';
  var box = null;
  function paint(){ if(!box) return; box.querySelector('.lb').textContent = LANGS[cur]; [].forEach.call(box.querySelectorAll('.pp button'), function(b){ b.className = b.getAttribute('data-l') === cur ? 'on' : ''; }); }
  function ui(){ if(D.getElementById('vlang')) return; var s = D.createElement('style'); s.textContent = CSS; D.head.appendChild(s);
    box = D.createElement('div'); box.id = 'vlang'; box.setAttribute('data-nolang', '1');
    box.innerHTML = '<button type="button" aria-label="Language" aria-haspopup="true">🌐 <span class="lb"></span></button><div class="pp" hidden>' + Object.keys(LANGS).map(function(k){ return '<button type="button" data-l="' + k + '">' + LANGS[k] + '</button>'; }).join('') + '</div>';
    D.body.appendChild(box); var pp = box.querySelector('.pp');
    box.firstChild.onclick = function(e){ e.stopPropagation(); pp.hidden = !pp.hidden; };
    pp.onclick = function(e){ var b = e.target.closest('button'); if(b){ set(b.getAttribute('data-l')); pp.hidden = true; } };
    D.addEventListener('click', function(){ pp.hidden = true; }); paint(); }
  W.VelosLang = {set:set, get:function(){ return cur; }, rows:ROWS};
  function init(){ var l = 'en'; try { l = localStorage.getItem('v_lang') || 'en'; } catch(e){} if(!LANGS[l]) l = 'en'; ui(); start(); if(l !== 'en') set(l); }
  if(D.body) init(); else D.addEventListener('DOMContentLoaded', init);
})(window, document);
