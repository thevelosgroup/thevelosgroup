/* Velos agreement terms by product type.
   A seller of honey signs honey terms, a fish seller signs fish terms, and so on: no one signs generic terms
   that do not fit their goods.  VelosTerms.pick(text) -> {label, clauses:[[title, text], ...]}
   `text` = anything that describes the business (category, shop name, description, product names). */
(function (W) {
  var LAW = 'applicable Ugandan law and the standards of the Uganda National Bureau of Standards (UNBS) and the relevant health authorities';
  var P = [
    { k: 'honey', re: /honey|bee ?keep|apiar|beeswax|propolis/i, label: 'Honey and bee products', c: [
      ['Product standard', 'The Partner will sell only pure honey and bee products from its own or known suppliers. Honey must not be adulterated with sugar, syrup, water or colouring, and must meet ' + LAW + '.'],
      ['Packing and labelling', 'Each pack must be clean, food-grade, sealed, and labelled with the product name, net weight or volume, harvest or packing date, best-before date, and the Partner\'s name and contact. Raw and processed honey must be described honestly.'],
      ['Origin and claims', 'The Partner will not claim medical, organic or "forest" origin unless it can prove it on request. Velos may ask for samples or supplier details at any time.'],
      ['Returns', 'Opened honey cannot be returned unless it is not as described, contaminated or spoiled. The Partner will replace or refund such items.']] },
    { k: 'fish', re: /fish|tilapia|nile perch|mukene|silver ?fish|omena|catfish|mud ?fish|seafood|prawn/i, label: 'Fresh, smoked and dried fish', c: [
      ['Freshness and cold chain', 'Fresh fish must be sold only if it is fresh, kept on ice or refrigerated until hand-over, and packed in clean, leak-proof, food-safe packaging. Fish that is slimy, smelly, discoloured or held without cooling must not be offered.'],
      ['Source and legality', 'The Partner will buy and sell only fish caught and traded lawfully, in line with ' + LAW + ', and will not sell undersized or illegally caught fish.'],
      ['Weight and description', 'Fish will be weighed honestly. Species, size, weight, and whether it is fresh, smoked, fried or dried must be stated truthfully in the listing.'],
      ['Time-sensitive orders', 'Because fish spoils quickly, the Partner will have orders packed and ready for the rider at the agreed time. If an order is late or spoiled because of the Partner, the Partner bears the cost of the order and its delivery.']] },
    { k: 'meat', re: /beef|meat|butcher|goat|pork|mutton|chicken|poultry|sausage|bacon|ribs|steak|livestock/i, label: 'Meat and poultry', c: [
      ['Licensed source', 'Meat must come from animals slaughtered at an approved facility and inspected as required by ' + LAW + '. The Partner will show its trading licence and inspection or health certificate to Velos on request.'],
      ['Hygiene and cold chain', 'Meat must be handled by clean staff with clean tools, kept chilled or frozen until hand-over, and packed in food-safe, sealed packaging. Spoiled, smelly or discoloured meat must not be sold.'],
      ['Cuts and weight', 'Cuts and weight must be exactly as listed. Bones, fat and trimmings will be described honestly, and the price per kilogram will be stated clearly.'],
      ['Time-sensitive orders', 'Orders will be packed and ready for the rider at the agreed time. If meat is rejected because it was spoiled or not as described, the Partner bears the cost of the order and its delivery.']] },
    { k: 'dairy', re: /milk|yog(h)?urt|cheese|butter|ghee|dairy|eggs?\b/i, label: 'Dairy and eggs', c: [
      ['Safety', 'Milk, yoghurt, cheese, butter, ghee and eggs must be produced, stored and handled hygienically and kept cool until hand-over, in line with ' + LAW + '. Raw milk must be sold only where the law allows and must be described as raw.'],
      ['Dates and labels', 'Packed products must show the product name, quantity, production or packing date and best-before date. Eggs must be clean and not cracked.'],
      ['Returns', 'Spoiled, expired, broken or wrongly described items will be replaced or refunded by the Partner.']] },
    { k: 'produce', re: /fruit|vegetable|veg\b|tomato|onion|matoke|banana|potato|cassava|yam|cabbage|avocado|pineapple|mango|greens|produce/i, label: 'Fresh fruit, vegetables and farm produce', c: [
      ['Quality', 'Produce must be fresh, clean, free from rot, pests and harmful chemical residue, and graded as listed. Pesticide and fertiliser use must follow the law and the product label.'],
      ['Weight and packing', 'Produce will be weighed honestly and packed in clean bags, crates or boxes that protect it in transit. The Partner will not hide poor produce under good produce.'],
      ['Seasonality and stock', 'The Partner will mark items unavailable when out of season or out of stock, and will replace spoiled items or refund the customer.']] },
    { k: 'grains', re: /rice|maize|posho|flour|beans|millet|sorghum|cereal|grain|groundnut|peanut|sim ?sim|sesame|lentil|peas/i, label: 'Grains, flour, pulses and nuts', c: [
      ['Quality', 'Grains, flour, beans, nuts and similar goods must be clean, dry, free from mould, weevils, stones and aflatoxin risk, and meet ' + LAW + '.'],
      ['Packing and weight', 'Goods will be sold in clean, sealed, correctly weighed bags with the product name, weight and packing date. Bulk quantities will be stated in kilograms or bags as listed.'],
      ['Returns', 'Goods that are damp, mouldy, infested or not as described will be replaced or refunded by the Partner.']] },
    { k: 'coffee', re: /coffee|tea\b|cocoa|vanilla|spice|herb|ginger|turmeric/i, label: 'Coffee, tea and spices', c: [
      ['Quality and origin', 'Coffee, tea, cocoa, vanilla and spices must be as described in grade, roast, origin and weight. The Partner will not blend lower grades into a higher-grade listing.'],
      ['Packing and labels', 'Products must be sealed in clean, food-safe packaging, labelled with the product name, net weight, packing date and best-before date, in line with ' + LAW + '.']] },
    { k: 'cooked', re: /bakery|bread|cake|pastry|cookie|snack|samosa|rolex|catering|cooked|juice|drink|beverage|water\b|soda|wine|spirit|beer|liquor/i, label: 'Prepared food and drinks', c: [
      ['Licence and hygiene', 'The Partner will hold every licence and health certificate needed to prepare and sell food or drinks, keep its premises and staff clean, and follow ' + LAW + '. Alcohol may be sold only where the law and the Partner\'s licence allow, and never to anyone under 18.'],
      ['Ingredients and allergens', 'The Partner will list major allergens and will not misstate ingredients. Drinks must be sealed or covered for delivery.'],
      ['Freshness', 'Food must be prepared fresh, packed hot or cold as appropriate, and ready for the rider at the agreed time. Spoiled or wrongly prepared orders are replaced or refunded by the Partner.']] },
    { k: 'beauty', re: /cosmetic|skin|beauty|make ?up|lotion|cream|soap|perfume|fragrance|hair|wig|salon|shea|herbal/i, label: 'Beauty, skin and hair care', c: [
      ['Safety and ingredients', 'Products must be safe for skin and hair, within date, and made or sourced in line with ' + LAW + '. Ingredients must be listed truthfully, and banned or harmful substances (such as skin-bleaching agents) must not be sold.'],
      ['Claims', 'The Partner will not promise medical results or cures. "Natural", "organic" or "herbal" may be used only if true.'],
      ['Hygiene and returns', 'Opened or used products cannot be returned unless they are faulty, damaged or not as described. Counterfeit or diluted goods are not allowed.']] },
    { k: 'medical', re: /pharmacy|drug|medicine|medical|clinic|supplement|vitamin/i, label: 'Health and pharmacy products', c: [
      ['Licence', 'Only licensed pharmacies and dealers may list medicines or regulated health products on Velos. The Partner will provide its current licence on request and will list only products it is lawfully allowed to sell.'],
      ['Prescription items', 'Prescription-only medicines will not be sold without a valid prescription, and will not be listed for delivery unless Velos has approved the process in writing.'],
      ['Storage and expiry', 'Products must be stored as directed, be within expiry date, and be sealed. Counterfeit, expired or unregistered products will lead to immediate removal.']] },
    { k: 'electronics', re: /electronic|phone|laptop|computer|tv\b|television|camera|speaker|charger|battery|solar|gadget|appliance|cooker|fridge|freezer|microwave/i, label: 'Electronics and appliances', c: [
      ['Genuine goods and warranty', 'Goods must be genuine and as described (brand, model, specification, new or used). The Partner will state any warranty period and honour it, and will not sell stolen, counterfeit or blacklisted devices.'],
      ['Testing before dispatch', 'The Partner will test each item before hand-over, include all listed accessories, and keep the original packaging where possible. Serial or IMEI numbers will be given to Velos on request.'],
      ['Faults and returns', 'Items that are dead on arrival, faulty or not as described will be repaired, replaced or refunded by the Partner within 7 days of delivery.']] },
    { k: 'fashion', re: /cloth|fashion|dress|shirt|shoe|sneaker|bag\b|handbag|tailor|fabric|kitenge|jewel|watch|wear|uniform|suit|gomesi|kanzu/i, label: 'Fashion, clothing and accessories', c: [
      ['Description and sizing', 'Items must match the photos, fabric, colour and size chart in the listing. The Partner will list sizes accurately and say clearly whether an item is new or second-hand.'],
      ['Made-to-order work', 'For tailored or made-to-order items the Partner will agree measurements, price and delivery date in writing before starting, and will deliver on time and to the agreed quality.'],
      ['Returns', 'Wrong size, wrong item or faulty items will be exchanged or refunded by the Partner within 7 days. Worn, washed or altered items cannot be returned.']] },
    { k: 'furniture', re: /furniture|sofa|bed\b|mattress|wardrobe|table|chair|cabinet|decor|carpet|curtain|kitchen unit/i, label: 'Furniture and home decor', c: [
      ['Materials and finish', 'Furniture must be made of the materials stated, with sound joints and a clean finish. Dimensions, colour and material in the listing must be accurate.'],
      ['Made-to-order lead time', 'For made-to-order pieces the Partner will state a lead time, agree a deposit with Velos, and deliver on the promised date. Delay or poor workmanship will be put right at the Partner\'s cost.'],
      ['Delivery and assembly', 'Large items will be packed and protected for transport. The Partner will say whether assembly is needed and who will do it.']] },
    { k: 'hardware', re: /hardware|cement|timber|wood|iron ?sheet|paint|pipe|steel|brick|tile|roof|building|plumb|electrical|cable|tools?\b/i, label: 'Hardware and building materials', c: [
      ['Standards and quantities', 'Cement, steel, timber, pipes, paint and other materials must meet ' + LAW + ' and be of the grade, size and quantity listed. Short supply or substandard goods will be replaced at the Partner\'s cost.'],
      ['Safe loading', 'Heavy and bulk items will be loaded safely, and any special transport needs will be stated before the order is accepted.'],
      ['Quotations for bulk', 'Bulk orders may be quoted by Velos with the Partner\'s agreement. A quotation the Partner has confirmed must be honoured for its validity period.']] },
    { k: 'auto', re: /auto|car\b|spare ?part|tyre|tire|motor|vehicle|engine|battery|boda/i, label: 'Auto parts and accessories', c: [
      ['Genuine parts', 'Parts must be genuine or clearly described as aftermarket or used. Fitment (make, model, year) must be listed truthfully.'],
      ['Fault and return', 'Parts that do not fit as listed or are faulty will be replaced or refunded within 7 days if unused and uninstalled.']] },
    { k: 'stationery', re: /stationery|book|paper|office|school|print|pen\b|uniform/i, label: 'Stationery, books and office supplies', c: [
      ['Quality and counts', 'Items must be as described in brand, size and quantity (for example reams, boxes, sets). Printed or customised items will be proofed with the customer before production.'],
      ['Returns', 'Damaged or wrong items will be replaced or refunded. Custom-printed items cannot be returned unless they differ from the approved proof.']] },
    { k: 'hotel', re: /hotel|lodge|guest ?house|\brooms?\b|apartment|airbnb|accommodation|resort|hostel|\bstays?\b/i, label: 'Hotels, rooms and accommodation', c: [
      ['Availability and rates', 'The Partner will keep room availability and rates up to date and will honour every confirmed booking at the booked rate. Overbooking is the Partner\'s responsibility: the Partner will move the guest to an equal or better room or refund in full.'],
      ['Licence and safety', 'The Partner will hold every licence the business needs and keep rooms clean, safe and as described, with working locks, water and power or a stated backup.'],
      ['Guests and cancellations', 'Guest details will be used only for the booking. Cancellations and refunds follow the policy published on the listing, which must be fair and clear.']] },
    { k: 'venue', re: /venue|hall|garden|event|conference|wedding|party/i, label: 'Venues and event halls', c: [
      ['Bookings and capacity', 'The Partner will keep the calendar up to date, honour confirmed bookings, and state capacity, included items and extra charges truthfully.'],
      ['Safety and licences', 'The venue must hold the permits it needs and meet fire and safety requirements. Noise, curfew and alcohol rules must be stated before booking.'],
      ['Deposits and cancellations', 'Deposits and cancellations follow the policy on the listing. If the Partner cancels, the customer is refunded in full.']] }
  ];

  function pick(text) {
    var t = String(text || ''), hits = P.filter(function (x) { return x.re.test(t); });
    /* most specific first (earlier in the list), keep at most two so the agreement stays focused */
    hits = hits.slice(0, 2);
    if (!hits.length) return { label: 'Your goods and services', clauses: [
      ['Accuracy of listings', 'The Partner will describe what it sells truthfully (name, size, quantity, condition, price) and will sell only items it is lawfully allowed to sell, meeting ' + LAW + '.'],
      ['Condition and packing', 'Goods will be clean, undamaged, correctly packed for transport and as described. The Partner will replace or refund anything that is not.']] };
    var label = hits.map(function (h) { return h.label; }).join(' and '), clauses = [];
    hits.forEach(function (h) { clauses = clauses.concat(h.c); });
    return { label: label, clauses: clauses };
  }
  W.VelosTerms = { pick: pick };

  /* ---- Terms written for the individual: riders, sales agents and technicians ---- */
  var TRADES = [
    { re: /electric|wiring|solar|cctv|alarm|generator/i, label: 'Electrical, solar and security installation', c: [
      ['Safe electrical work', 'The Contractor will switch off and isolate power before working, will not work on live circuits, will use correctly rated cables, breakers and earthing, and will hold any licence or certificate the work requires under applicable Ugandan law.'],
      ['Test and warranty', 'Every installation or repair will be tested before the customer is asked to sign off. The Contractor will correct faulty workmanship free of charge for 30 days and will give the customer a short written note of what was installed.']] },
    { re: /plumb|pipe|water|drain|tank|sanit/i, label: 'Plumbing and water systems', c: [
      ['Leak-free work', 'The Contractor will pressure-test or run-test every joint before leaving, protect floors and fittings, and clear away waste water and offcuts.'],
      ['Warranty and materials', 'The Contractor will use quality fittings of the type agreed with the customer and will repair leaks caused by their workmanship free of charge for 30 days.']] },
    { re: /mechanic|garage|auto|vehicle|car\b|motorcycle|boda|panel|tyre|tire|engine/i, label: 'Vehicle repair and servicing', c: [
      ['Honest diagnosis', 'The Contractor will diagnose honestly, give the customer a price before work starts, and will not add or replace parts that are not needed.'],
      ['Parts and returns', 'Parts will be genuine or described as aftermarket or used. Replaced parts will be shown or returned to the customer on request, and the vehicle will be road-tested before hand-over. Faults from the repair will be put right free of charge for 14 days.']] },
    { re: /phone|laptop|computer|tv\b|television|gadget|electronics repair|screen|ipad|tablet/i, label: 'Phone, computer and electronics repair', c: [
      ['Customer data', 'The Contractor will not open, copy, share or delete a customer\'s messages, photos, accounts or files, and will not keep a device longer than needed for the job.'],
      ['Parts and warranty', 'Replacement parts will be described honestly (original, compatible or used). The Contractor will not swap good parts for worse ones, and will give a repair warranty of at least 14 days.']] },
    { re: /carpent|furniture|joiner|wood|cabinet|roof|ceiling|mason|brick|build|construct|tile|weld|metal|fabricat|gate|window/i, label: 'Carpentry, building and metalwork', c: [
      ['Agreed scope and materials', 'The Contractor will agree the scope, materials, measurements, price and finishing date with the customer through Velos before starting, and will not change them without the customer\'s consent.'],
      ['Site safety', 'The Contractor will use sound tools and safe methods (including safe working at height and safe welding), protect other people on site, and leave the site clean and safe.']] },
    { re: /paint|decorat|plaster|interior|floor/i, label: 'Painting and finishing', c: [
      ['Preparation and finish', 'The Contractor will protect floors and furniture, prepare surfaces properly, use the paint agreed with the customer, and correct patchy or peeling work caused by poor workmanship free of charge for 30 days.']] },
    { re: /clean|laundry|garden|landscap|pest|fumigat|housekeep|nanny|cook|chef|catering/i, label: 'Cleaning, home and garden services', c: [
      ['Trust in the home', 'The Contractor will treat customers\' homes and belongings with respect, will not take, move or photograph anything without permission, and will not bring anyone else to the job unless Velos has approved them.'],
      ['Products and safety', 'Cleaning products, chemicals and pesticides will be used safely and as directed, and the customer will be told of any precautions.']] },
    { re: /photo|video|dj\b|mc\b|music|band|decor|event|plann|tailor|seamstress|hair|makeup|beaut|barber|massage/i, label: 'Events, beauty and creative services', c: [
      ['Booking and time', 'The Contractor will confirm date, place, time and price through Velos, arrive on time and prepared, and will not double-book a date that has been confirmed through Velos.'],
      ['Quality and hygiene', 'The Contractor will deliver to the standard shown in their portfolio, keep tools and products clean and safe for clients, and deliver agreed files or items by the promised date.']] }
  ];
  var VEH = [
    { re: /boda|motor|scooter|moped|bajaj|\bbike\b/i, label: 'Motorcycle delivery', c: [['Motorcycle, permit and insurance', 'The Contractor will ride only a roadworthy motorcycle registered in their name or used with the owner\'s permission, hold a valid riding permit, wear a helmet and the Velos reflector jacket at all times, keep third-party insurance where the law requires it, and pay for their own fuel, servicing and fines.']] },
    { re: /\bbicycles?\b|\bpedal/i, label: 'Bicycle delivery', c: [['Distance and safety', 'Because the Contractor delivers by bicycle, they will accept jobs only within a distance they can ride safely and in good time, will ride with lights and reflective gear after dark, and will tell Velos if weather or distance makes a delivery unsafe.']] },
    { re: /tuk|tricycle|three.?wheel/i, label: 'Tricycle delivery', c: [['Vehicle and loading', 'The Contractor will use a roadworthy, properly registered tricycle, load goods safely and within its capacity, and never carry passengers with an order.']] },
    { re: /car\b|van\b|truck|pick.?up|lorry|vehicle/i, label: 'Car, van and truck delivery', c: [['Vehicle, licence and loads', 'The Contractor will drive only a roadworthy, registered and insured vehicle with the correct driving licence class, secure every load, never exceed the vehicle\'s capacity, and keep to lawful speed and parking.']] }
  ];
  function first(list, text) { for (var i = 0; i < list.length; i++) if (list[i].re.test(text)) return list[i]; return null; }
  function plain(s) { return String(s == null ? '' : s).replace(/[^\x20-\x7E]/g, '').trim(); }
  /* VelosTerms.person(kind, p) -> {label, clauses} extra clauses written for this person */
  function person(kind, p) {
    p = p || {}; var out = [], label = '';
    if (kind === 'rider') {
      var v = plain(p.vehicle), pl = plain(p.plate), h = first(VEH, v + ' ' + pl);
      out.push(['Declared vehicle', 'The Contractor declares that they will make deliveries using' + (v ? ' a ' + v : ' the vehicle registered with Velos') + (pl ? ' (registration ' + pl + ')' : '') + (p.city ? ', working in the ' + plain(p.city) + ' area' : '') + '. They will tell Velos before using any other vehicle, and Velos may stop jobs if the vehicle is not roadworthy or not the one declared.']);
      if (h) { label = h.label; out = out.concat(h.c); }
    } else if (kind === 'agent') {
      var city = plain(p.city);
      out.push(['Area and conduct', 'The Contractor will promote Velos mainly in ' + (city || 'the area registered with Velos') + ' and will respect the privacy of customers and shops, never pressure anyone to sign up, and never collect money on behalf of Velos except through the Velos app.']);
      if (p.commission_pct != null && p.commission_pct !== '') out.push(['Commission rate', 'The commission agreed with this Contractor is ' + p.commission_pct + '% of completed and paid sales credited to their code. It is paid only on sales that are completed and paid, and Velos will tell the Contractor before any change takes effect.']);
      label = 'Sales agent' + (city ? ' - ' + city : '');
    } else if (kind === 'technician') {
      var tr = plain(p.trade), t = first(TRADES, tr + ' ' + plain(p.name));
      out.push(['Declared trade', 'The Contractor declares that their trade is "' + (tr || 'as registered with Velos') + '"' + (p.city ? ' and that they work in the ' + plain(p.city) + ' area' : '') + '. They will accept only jobs within that trade and their skill, and will tell Velos honestly when a job is beyond it.']);
      if (t) { label = t.label; out = out.concat(t.c); }
      else out.push(['Quality of work', 'The Contractor will do the work to the standard of a skilled person in their trade, with sound tools and safe methods, and will correct faulty workmanship free of charge for 14 days.']);
    }
    return { label: label, clauses: out };
  }
  W.VelosTerms.person = person;
})(window);
