/* =========================================================
   PRODUCT DATA — EDIT PRICES / NAMES / IMAGES RIGHT HERE.
   price: number in UGX, or null to show "Request Quote"
   img: replace with your own product photography whenever
        you have it, for full authenticity.
   ========================================================= */
const PRODUCTS = [
  // ============ SMARTPHONES — real product photography ============
  { id:'ph1', cat:'phones', sub:'Samsung', name:'Samsung Galaxy A55 5G', price:1350000, img:'phone-samsung-a55.jpg', real:true },
  { id:'ph2', cat:'phones', sub:'Samsung', name:'Samsung Galaxy S20 Ultra', price:1750000, img:'phone-samsung-s20ultra.jpg', real:true },
  { id:'ph3', cat:'phones', sub:'Samsung', name:'Samsung Galaxy S24 Ultra 256GB', price:5300000, img:'phone-samsung-s24ultra.jpg', real:true },
  { id:'ph4', cat:'phones', sub:'Apple', name:'iPhone 14', price:3300000, img:'phone-iphone14.jpg', real:true },
  { id:'ph5', cat:'phones', sub:'Apple', name:'iPhone 15 Pro', price:4600000, img:'phone-iphone15pro.jpg', real:true },
  { id:'ph6', cat:'phones', sub:'Apple', name:'iPhone 16 Pro', price:5800000, img:'phone-iphone16pro.jpg', real:true },
  { id:'ph7', cat:'phones', sub:'Infinix', name:'Infinix Note Series', price:780000, img:'phone-infinix.jpg', real:true },
  { id:'ph8', cat:'phones', sub:'Infinix', name:'Infinix Zero Series', price:1050000, img:'phone-infinix-zero.jpg', real:true },
  { id:'ph9', cat:'phones', sub:'Tecno', name:'Tecno Phantom X2 5G', price:1450000, img:'phone-tecno-phantomx2.jpg', real:true },
  { id:'ph10', cat:'phones', sub:'Tecno', name:'Tecno Camon Series', price:950000, img:'phone-tecno-camon.jpg', real:true },
  { id:'ph11', cat:'phones', sub:'Tecno', name:'Tecno Spark Series', price:520000, img:'phone-tecno-spark2.jpg', real:true },

  // ============ LAPTOPS — real product photography ============
  { id:'lp1', cat:'laptops', sub:'Everyday & Student', name:'Lenovo IdeaPad — Everyday Laptop', price:1450000, img:'laptop-lenovo.jpg', real:true },
  { id:'lp2', cat:'laptops', sub:'Creator / Gaming', name:'Gateway Gaming Laptop', price:2600000, img:'laptop-gateway.jpg', real:true },
  { id:'lp3', cat:'laptops', sub:'Business Ultrabook', name:'HP EliteBook — Business Ultrabook', price:3400000, img:'laptop-hp-elitebook.jpg', real:true },

  // ============ TELEVISIONS — real branded photography ============
  { id:'tv1', cat:'tvs', sub:'Samsung', name:'Samsung 43" Crystal UHD Smart TV', price:1100000, img:'tv-samsung-43.jpg', real:true },
  { id:'tv2', cat:'tvs', sub:'Samsung', name:'Samsung 50" Crystal UHD Smart TV', price:1650000, img:'tv-samsung-50.jpg', real:true },
  { id:'tv3', cat:'tvs', sub:'Samsung', name:'Samsung 55" Crystal UHD Smart TV', price:2000000, img:'tv-samsung-55.jpg', real:true },
  { id:'tv4', cat:'tvs', sub:'Samsung', name:'Samsung 49" Curved Full HD TV', price:1400000, img:'tv-samsung-curved-49.jpg', real:true },
  { id:'tv5', cat:'tvs', sub:'Hisense', name:'Hisense 43" VIDAA Smart TV', price:780000, img:'tv-hisense-43.jpg', real:true },
  { id:'tv6', cat:'tvs', sub:'Hisense', name:'Hisense 50" VIDAA Smart TV', price:1050000, img:'tv-hisense-50.jpg', real:true },
  { id:'tv7', cat:'tvs', sub:'Hisense', name:'Hisense 55" QLED 4K Smart TV', price:1600000, img:'tv-hisense-55.jpg', real:true },
  { id:'tv8', cat:'tvs', sub:'Hisense', name:'Hisense 65" VIDAA Smart TV', price:2300000, img:'tv-hisense-65.jpg', real:true },
  { id:'tv9', cat:'tvs', sub:'LG', name:'LG 43" Smart TV AI ThinQ', price:1150000, img:'tv-lg-43.jpg', real:true },
  { id:'tv10', cat:'tvs', sub:'LG', name:'LG 55" UHD 4K Smart TV', price:2000000, img:'tv-lg-55.jpg', real:true },
  { id:'tv11', cat:'tvs', sub:'LG', name:'LG 65" UHD 4K Smart TV', price:3300000, img:'tv-lg-65.jpg', real:true },
  { id:'tv12', cat:'tvs', sub:'TCL', name:'TCL 32" FHD HDR10 Android TV', price:420000, img:'tv-tcl-32.jpg', real:true },
  { id:'tv13', cat:'tvs', sub:'TCL', name:'TCL 43" Android Smart TV', price:700000, img:'tv-tcl-43.jpg', real:true },
  { id:'tv14', cat:'tvs', sub:'TCL', name:'TCL 55" UHD 4K Smart TV', price:1200000, img:'tv-tcl-55.jpg', real:true },
  { id:'tv15', cat:'tvs', sub:'Smartec', name:'Smartec 32" HD Digital TV', price:350000, img:'tv-smartec-32.jpg', real:true },
  { id:'tv16', cat:'tvs', sub:'Smartec', name:'Smartec 40" HD Smart TV', price:550000, img:'tv-smartec-40.jpg', real:true },

  // ============ HOME THEATER & AUDIO — real branded photography ============
  { id:'au1', cat:'audio', sub:'Portable Radios', name:'Portable FM/DAB Digital Radio', price:85000, img:'audio-dab-radio.jpg', real:true },
  { id:'au2', cat:'audio', sub:'Portable Radios', name:'Olsenmark 3-Band FM/AM/SW Radio with MP3 Player', price:120000, img:'audio-olsenmark-radio.jpg', real:true },
  { id:'au3', cat:'audio', sub:'Portable Radios', name:'Compact Digital FM Radio Speaker', price:65000, img:'audio-portable-radio.jpg', real:true },
  { id:'au4', cat:'audio', sub:'Soundbars', name:'Compact Bluetooth Soundbar', price:220000, img:'audio-soundbar-basic.jpg', real:true },
  { id:'au5', cat:'audio', sub:'Soundbars', name:'Riomois Soundbar & Subwoofer Combo', price:480000, img:'audio-riomois-soundbar.jpg', real:true },
  { id:'au6', cat:'audio', sub:'Subwoofers', name:'Monoprice Powered Home Theatre Subwoofer', price:380000, img:'audio-monoprice-subwoofer.jpg', real:true },
  { id:'au7', cat:'audio', sub:'Subwoofers', name:'JL Audio Premium Subwoofer', price:1200000, img:'audio-jlaudio-subwoofer.jpg', real:true },
  { id:'au8', cat:'audio', sub:'Full Home Theatre Systems', name:'5.1 Tower Speaker Home Theatre System', price:950000, img:'audio-tower-5.1.jpg', real:true },
  { id:'au9', cat:'audio', sub:'Full Home Theatre Systems', name:'Philips 5.1-Channel Home Theatre System', price:1450000, img:'audio-philips-5.1.jpg', real:true },

  // ============ PHONE ACCESSORIES — real product photography ============
  { id:'ac-chg1', cat:'accessories', sub:'Chargers', name:'Dual-Port Car Charger, Coiled USB-C Cable', price:45000, img:'accessory-charger-car-dual-coiled.jpg', real:true },
  { id:'ac-chg2', cat:'accessories', sub:'Chargers', name:'Anker Retractable Dual Car Charger', price:95000, img:'accessory-charger-car-anker-dual.jpg', real:true },
  { id:'ac-chg3', cat:'accessories', sub:'Chargers', name:'Multi-Port Desktop Fast Charging Station', price:120000, img:'accessory-charger-desktop-multiport.jpg', real:true },
  { id:'ac-chg4', cat:'accessories', sub:'Chargers', name:'Universal Travel Power Adapter, Multi-Outlet', price:135000, img:'accessory-charger-travel-adapter-nenji.jpg', real:true },
  { id:'ac-chg5', cat:'accessories', sub:'Chargers', name:'25W Super Fast Wall Charger + Cable', price:60000, img:'accessory-charger-wall-25w-usbc.jpg', real:true },
  { id:'ac-cbl1', cat:'accessories', sub:'Cables', name:'Xiaomi 120W USB-C to USB-C Braided Cable', price:55000, img:'accessory-cable-usbc-xiaomi-120w.jpg', real:true },
  { id:'ac-pb1', cat:'accessories', sub:'Power Banks', name:'Powerology High-Capacity Power Bank with Display', price:150000, img:'accessory-powerbank-powerology.jpg', real:true },
  { id:'ac-pb2', cat:'accessories', sub:'Power Banks', name:'SBS Dual-Port Power Bank with LED Indicator', price:140000, img:'accessory-powerbank-sbs.jpg', real:true },
  { id:'ac-pb3', cat:'accessories', sub:'Power Banks', name:'Slim Basic Power Bank', price:55000, img:'accessory-powerbank-slim-basic.jpg', real:true },
  { id:'ac-pb4', cat:'accessories', sub:'Power Banks', name:'50W Laptop-Charging Power Bank', price:260000, img:'accessory-powerbank-50w-laptop.jpg', real:true },
  { id:'ac-pb5', cat:'accessories', sub:'Power Banks', name:'Anker 165W High-Output Power Bank with Display', price:420000, img:'accessory-powerbank-anker-165w.jpg', real:true },
  { id:'ac-pb6', cat:'accessories', sub:'Power Banks', name:'Porodo Rugged Power Bank with Strap', price:220000, img:'accessory-powerbank-porodo-strap.jpg', real:true },
  { id:'ac-ear1', cat:'accessories', sub:'Earphones & Headphones', name:'Wired Earphones with Mic', price:20000, img:'accessory-earphones-wired.jpg', real:true },
  { id:'ac-ear2', cat:'accessories', sub:'Earphones & Headphones', name:'Open-Ear Wireless Earbuds with Case', price:110000, img:'accessory-earbuds-openear-case.jpg', real:true },
  { id:'ac-ear3', cat:'accessories', sub:'Earphones & Headphones', name:'Over-Ear Bluetooth Headphones', price:150000, img:'accessory-headphones-over-ear-jbl-style.jpg', real:true },
  { id:'ac-ear4', cat:'accessories', sub:'Earphones & Headphones', name:'Studio Monitor Headphones with Cable', price:180000, img:'accessory-headphones-studio-cable.jpg', real:true },
  { id:'ac-ear5', cat:'accessories', sub:'Earphones & Headphones', name:'Call Center Headset, Boom Mic', price:65000, img:'accessory-headset-callcenter-boommic.jpg', real:true },
  { id:'ac-ear6', cat:'accessories', sub:'Earphones & Headphones', name:'BETMI True Wireless Earbuds', price:90000, img:'accessory-earbuds-betmi.jpg', real:true },
  { id:'ac-ear7', cat:'accessories', sub:'Earphones & Headphones', name:'TEMPT True Wireless Earbuds', price:95000, img:'accessory-earbuds-tempt.jpg', real:true },
  { id:'ac-ear8', cat:'accessories', sub:'Earphones & Headphones', name:'AMAYA True Wireless Earbuds', price:95000, img:'accessory-earbuds-amaya.jpg', real:true },
  { id:'ac-ear9', cat:'accessories', sub:'Earphones & Headphones', name:'Wireless Earbuds with Battery Display Case', price:100000, img:'accessory-earbuds-display-case.jpg', real:true },
  { id:'ac-sp1', cat:'accessories', sub:'Screen Protectors', name:'Full-Coverage Screen Protector Kit', price:20000, img:'accessory-screenprotector-kit-curved.jpg', real:true },
  { id:'ac-sp2', cat:'accessories', sub:'Screen Protectors', name:'Camera Lens + Back Protector Set', price:18000, img:'accessory-lens-back-protector-iphone.jpg', real:true },
  { id:'ac-sp3', cat:'accessories', sub:'Screen Protectors', name:'Privacy Tempered Glass, Shatterproof', price:25000, img:'accessory-screenprotector-privacy-hammer.jpg', real:true },
  { id:'ac-sp4', cat:'accessories', sub:'Screen Protectors', name:'Full-Frame Tempered Glass Protector', price:20000, img:'accessory-screenprotector-iphone14style.jpg', real:true },
  { id:'ac-sp5', cat:'accessories', sub:'Screen Protectors', name:'Standard Tempered Glass Protector', price:15000, img:'accessory-screenprotector-plain-small.jpg', real:true },
  { id:'ac-sp6', cat:'accessories', sub:'Screen Protectors', name:'Privacy Screen Protector, Anti-Spy', price:28000, img:'accessory-screenprotector-privacy-orange-iphone.jpg', real:true },
  { id:'ac-sp7', cat:'accessories', sub:'Screen Protectors', name:'Privacy Screen Protector, Full Coverage', price:28000, img:'accessory-screenprotector-privacy-black-iphone15pro.jpg', real:true },
  { id:'ac-cs1', cat:'accessories', sub:'Phone Cases', name:'Silicone Phone Case, Pink', price:20000, img:'accessory-case-silicone-pink.jpg', real:true },
  { id:'ac-cs2', cat:'accessories', sub:'Phone Cases', name:'Silicone Phone Case with Camera Protection', price:22000, img:'accessory-case-pink-clearedge-closeup.jpg', real:true },
  { id:'ac-cs3', cat:'accessories', sub:'Phone Cases', name:'Clear Case, Butterfly Design', price:18000, img:'accessory-case-clear-butterfly-infinix.jpg', real:true },
  { id:'ac-cs4', cat:'accessories', sub:'Phone Cases', name:'Clear MagSafe Case, Floral Design', price:20000, img:'accessory-case-floral-magsafe-infinix.jpg', real:true },
  { id:'ac-cs5', cat:'accessories', sub:'Phone Cases', name:'Plain Silicone Case, Black', price:15000, img:'accessory-case-plain-black.jpg', real:true },
  { id:'ac-cs6', cat:'accessories', sub:'Phone Cases', name:'Carbon Fiber Textured Case', price:22000, img:'accessory-case-carbonfiber-black-tecno.jpg', real:true },
  { id:'ac-cs7', cat:'accessories', sub:'Phone Cases', name:'Silicone Case with Wrist Strap', price:20000, img:'accessory-case-black-wriststrap.jpg', real:true },
  { id:'ac-cs8', cat:'accessories', sub:'Phone Cases', name:'Leather Wallet Flip Case, Purple', price:38000, img:'accessory-case-leather-wallet-purple-motorola.jpg', real:true },
  { id:'ac-cs9', cat:'accessories', sub:'Phone Cases', name:'Slim Case, Diagonal Cutout Design', price:18000, img:'accessory-case-black-diagonal-cutout.jpg', real:true },
  { id:'ac-cs10', cat:'accessories', sub:'Phone Cases', name:'Imak Shockproof Case, Black', price:25000, img:'accessory-case-imak-shockproof-black.jpg', real:true },
  { id:'ac-cs11', cat:'accessories', sub:'Phone Cases', name:'Leather Wallet Flip Case, Blue', price:35000, img:'accessory-case-leather-wallet-blue-shantime.jpg', real:true },
  { id:'ac-cs12', cat:'accessories', sub:'Phone Cases', name:'Leather Wallet Flip Case, Brown, with Strap', price:38000, img:'accessory-case-leather-wallet-brown-strap.jpg', real:true },
  { id:'ac-cs13', cat:'accessories', sub:'Phone Cases', name:'Leather Card-Holder Kickstand Case', price:32000, img:'accessory-case-leather-kickstand-sutent.jpg', real:true },
  { id:'ac-cs14', cat:'accessories', sub:'Phone Cases', name:'MagSafe Leather Flip Case, Purple', price:45000, img:'accessory-case-leather-magsafe-purple-s23ultra.jpg', real:true },
  { id:'ac-cs15', cat:'accessories', sub:'Phone Cases', name:'Leather Flip Case with Kickstand, Brown', price:40000, img:'accessory-case-leather-nillkin-flip-kickstand.jpg', real:true },
  { id:'ac-cs16', cat:'accessories', sub:'Phone Cases', name:'Spigen Tough Armor Case with MagSafe Ring', price:65000, img:'accessory-case-spigen-tougharmor-black.jpg', real:true },

  // ============ DIGITAL CAMERAS — real product photography ============
  { id:'cm1', cat:'cameras', sub:'Digital Cameras', name:'Superzoom Compact Camera', price:480000, img:'camera-sony-cybershot-hx50.jpg', real:true },
  { id:'cm2', cat:'cameras', sub:'Digital Cameras', name:'Mirrorless Camera + G Master Lens', price:2200000, img:'camera-sony-a7r-lens-side.jpg', real:true },
  { id:'cm3', cat:'cameras', sub:'Digital Cameras', name:'DSLR with 18-55mm Lens', price:2600000, img:'camera-canon-eos-250d-front.jpg', real:true },
  { id:'cm4', cat:'cameras', sub:'Digital Cameras', name:'4K Pocket Gimbal Vlogging Camera Bundle', price:1450000, img:'camera-pocket-gimbal-4k.jpg', real:true },
  { id:'cm5', cat:'cameras', sub:'Digital Cameras', name:'Premium Compact Camera, ZEISS Lens', price:1950000, img:'camera-sony-rx100vi-front.jpg', real:true },

  // ============ PRINTERS, COPIERS & CABLES — real branded photography ============
  { id:'pr1', cat:'printers', sub:'Home & Personal', name:'Epson All-in-One Inkjet Printer (Print/Scan/Copy)', price:380000, img:'printer-epson-workforce-aio.jpg', real:true },
  { id:'pr2', cat:'printers', sub:'Office & Business', name:'Kyocera Monochrome Laser MFP', price:2850000, img:'printer-kyocera-mono-laser-mfp.jpg', real:true },
  { id:'pr3', cat:'printers', sub:'Commercial & Enterprise', name:'Sharp Commercial Multi-Function Copier', price:null, img:'printer-sharp-commercial-copier.jpg', real:true },
  { id:'pr4', cat:'printers', sub:'Office & Business', name:'Compact Office Multifunction Printer', price:520000, img:'printer-compact-office-mfp.jpg', real:true },
  { id:'pr5', cat:'printers', sub:'Home & Personal', name:'Epson Stylus Photo All-in-One Printer', price:420000, img:'printer-epson-stylus-photo-aio.jpg', real:true },
  { id:'pr6', cat:'printers', sub:'Cables', name:'VGA Cable, Standard', price:35000, img:'cable-vga-standard.jpg', real:true , new:true},
  { id:'pr7', cat:'printers', sub:'Cables', name:'4K UHD HDMI Cable', price:45000, img:'cable-hdmi-4k-uhd.jpg', real:true , new:true},
  { id:'pr8', cat:'printers', sub:'Cables', name:'4K HDMI Cable — Extra-Long (Coiled)', price:85000, img:'cable-hdmi-4k-coiled-long.jpg', real:true , new:true},
  { id:'pr9', cat:'printers', sub:'Cables', name:'4K HDMI Cable — Premium Braided', price:65000, img:'cable-hdmi-4k-braided-premium.jpg', real:true , new:true},

  // ============ KITCHEN & HOME APPLIANCES — real product photography ============
  { id:'kt1', cat:'appliances', sub:'Commercial Ovens', name:'Wood-Fired Commercial Pizza Oven', price:6800000, img:'appliance-wood-fired-pizza-oven.jpg', real:true },
  { id:'kt2', cat:'appliances', sub:'Commercial Ovens', name:'Commercial-Grade Convection Oven', price:5200000, img:'appliance-commercial-convection-oven.jpg', real:true },
  { id:'kt3', cat:'appliances', sub:'Commercial Ovens', name:'Double-Deck Commercial Pizza Oven', price:8200000, img:'appliance-pizza-oven-double-deck.jpg', real:true },
  { id:'kt4', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Freestanding Gas Cooker with Oven', price:1850000, img:'appliance-gas-cooker-hisense.jpg', real:true },
  { id:'kt5', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Built-In Induction Cooktop', price:1350000, img:'appliance-induction-cooktop-lecreuset-scene.jpg', real:true },
  { id:'kt5b', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Built-In Induction Cooktop — 5-Zone', price:1750000, img:'appliance-induction-cooktop-steel-fish-scene.jpg', real:true },
  { id:'kt6', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Digital Air Fryer Oven with Rotisserie', price:420000, img:'appliance-air-fryer-innoteck-rotisserie.jpg', real:true },
  { id:'kt6b', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Microwave Oven, Dial Control', price:340000, img:'appliance-microwave-dial-control.jpg', real:true },
  { id:'kt6c', cat:'appliances', sub:'Home Ovens & Cooktops', name:'Microwave Oven, Mirror-Finish Digital', price:480000, img:'appliance-microwave-hisense-mirror.jpg', real:true },
  { id:'kt7', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Digital Multi-Function Pressure Cooker', price:280000, img:'appliance-pressure-cooker-saachi.jpg', real:true },
  { id:'kt8', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Digital Multi-Function Pressure Cooker — Premium', price:420000, img:'appliance-pressure-cooker-kenwood.jpg', real:true },
  { id:'kt8b', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Digital Pressure Cooker, Stainless', price:350000, img:'appliance-pressure-cooker-digital-steel.jpg', real:true },
  { id:'kt9', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Stovetop Pressure Cooker (Stainless)', price:210000, img:'appliance-pressure-cooker-fissler.jpg', real:true },
  { id:'kt9b', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Electric Rice Cooker, Home', price:190000, img:'appliance-rice-cooker-ourplace.jpg', real:true },
  { id:'kt9c', cat:'appliances', sub:'Pressure & Rice Cookers', name:'Commercial Electric Rice Cooker, Large-Batch', price:520000, img:'appliance-rice-cooker-hendi-commercial.jpg', real:true },
  { id:'kt10', cat:'appliances', sub:'Freezers', name:'Chest Freezer', price:1650000, img:'appliance-chest-freezer-grey.jpg', real:true },
  { id:'kt10b', cat:'appliances', sub:'Freezers', name:'Chest Freezer, Large Capacity', price:1950000, img:'appliance-chest-freezer-aiwa.jpg', real:true },
  { id:'kt11', cat:'appliances', sub:'Freezers', name:'Upright Freezer, Frost-Free', price:2400000, img:'appliance-freezer-upright-white.jpg', real:true },
  { id:'kt11b', cat:'appliances', sub:'Freezers', name:'Upright Freezer, Stainless Finish', price:2650000, img:'appliance-freezer-upright-steel.jpg', real:true },
  { id:'kt13', cat:'appliances', sub:'Refrigeration & Laundry', name:'Smart Family Refrigerator with Touch Display', price:3400000, img:'appliance-samsung-smart-fridge.jpg', real:true },
  { id:'kt14', cat:'appliances', sub:'Refrigeration & Laundry', name:'Front-Load Smart Washing Machine', price:2100000, img:'appliance-lg-washing-machine.jpg', real:true },

  // ============ HOME FURNITURE & CUSTOM CARPENTRY — real product photography ============
  { id:'f1', cat:'furniture', sub:'Living & Dining', name:'5-Seater Modern Sofa Set', price:2800000, img:'https://images.pexels.com/photos/6438748/pexels-photo-6438748.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id:'f2', cat:'furniture', sub:'Living & Dining', name:'6-Seater Rectangular Dining Set', price:1600000, img:'furniture-dining-rectangular-six-chairs.jpg', real:true },
  { id:'f2b', cat:'furniture', sub:'Living & Dining', name:'Nesting Coffee Table Set (2-Piece)', price:380000, img:'furniture-coffee-table-nesting-round.jpg', real:true },
  { id:'f3', cat:'furniture', sub:'Bedroom', name:'Walk-In Wardrobe, White & Wood Finish', price:3200000, img:'furniture-wardrobe-walkin-white-wood.jpg', real:true },
  { id:'f3b', cat:'furniture', sub:'Bedroom', name:'Platform Bed, Light Wood', price:1450000, img:'furniture-bedroom-platform-light-wood.jpg', real:true },
  { id:'f3c', cat:'furniture', sub:'Bedroom', name:'Upholstered Bed, Beige Tufted Headboard', price:1950000, img:'furniture-bedroom-beige-tufted.jpg', real:true },
  { id:'f3d', cat:'furniture', sub:'Bedroom', name:'Bed with Feature Headboard, White Glossy', price:2600000, img:'furniture-bedroom-white-glossy-showroom.jpg', real:true },
  { id:'f3e', cat:'furniture', sub:'Bedroom', name:'Classic Bed, Ornate Wood with Bedside Lighting', price:2400000, img:'furniture-bedroom-brown-wood-ornate.jpg', real:true },
  { id:'f3f', cat:'furniture', sub:'Bedroom', name:'Platform Bed, Simple Wood', price:980000, img:'furniture-bed-platform-simple-wood.jpg', real:true },
  { id:'f3g', cat:'furniture', sub:'Bedroom', name:'Storage Bed with Pull-Out Drawers', price:1650000, img:'furniture-bed-wood-storage-drawers.jpg', real:true },
  { id:'f3h', cat:'furniture', sub:'Bedroom', name:'Upholstered Bed, Navy Tufted Headboard with LED', price:2900000, img:'furniture-bed-navy-tufted-lights.jpg', real:true },
  { id:'f3i', cat:'furniture', sub:'Bedroom', name:'Mosquito Net Canopy, Purple', price:180000, img:'furniture-mosquito-net-purple-canopy.jpg', real:true },
  { id:'f3j', cat:'furniture', sub:'Bedroom', name:'Mosquito Net Canopy, Gold', price:220000, img:'furniture-mosquito-net-gold-canopy.jpg', real:true },
  { id:'f3k', cat:'furniture', sub:'Bedroom', name:'Vanity Dresser with Mirror & Stool', price:1150000, img:'furniture-vanity-dresser-white.jpg', real:true },
  { id:'f4', cat:'furniture', sub:'Office & Media', name:'Executive Home Office Desk, White Gloss', price:950000, img:'furniture-office-desk-white-glossy.jpg', real:true },
  { id:'f4b', cat:'furniture', sub:'Office & Media', name:'Industrial Home Office Desk, Wood & Steel', price:850000, img:'furniture-office-desk-industrial-wood.jpg', real:true },
  { id:'f4c', cat:'furniture', sub:'Office & Media', name:'TV Wall Unit, White & Wood', price:1350000, img:'furniture-tv-wall-unit-white-wood.jpg', real:true },
  { id:'f4d', cat:'furniture', sub:'Office & Media', name:'TV Stand, White & Wood', price:680000, img:'furniture-tv-stand-white-wood.jpg', real:true },
  { id:'f5', cat:'furniture', sub:'Café & Restaurant', name:'Round Dining Table + 4 Upholstered Chairs Set', price:1450000, img:'furniture-dining-round-navy-chairs.jpg', real:true },
  { id:'f6', cat:'furniture', sub:'Café & Restaurant', name:'Café Table & Chair Set — Oak Finish (per 2-seater)', price:620000, img:'hotel-wooden-cafe-chairs-tables.jpg', real:true },
  { id:'f7', cat:'furniture', sub:'Custom Carpentry & Fit-Outs', name:'Custom Walk-In Wardrobe Fit-Out', price:null, img:'furniture-wardrobe-walkin-custom-fit.jpg', real:true },
  { id:'f7b', cat:'furniture', sub:'Custom Carpentry & Fit-Outs', name:'Custom Fitted Kitchen, L-Shape', price:null, img:'furniture-kitchen-cabinet-grey-lshape.jpg', real:true },
  { id:'f7c', cat:'furniture', sub:'Custom Carpentry & Fit-Outs', name:'Custom Fitted Kitchen, Linear', price:null, img:'furniture-kitchen-cabinet-grey-linear.jpg', real:true },
  { id:'f7d', cat:'furniture', sub:'Custom Carpentry & Fit-Outs', name:'Custom TV Feature Wall, Gold & Navy Panel', price:null, img:'furniture-tv-wall-unit-gold-panel.jpg', real:true },
  { id:'f3l', cat:'furniture', sub:'Bedroom', name:'Kids Bunk Bed with Storage Stairs', price:1850000, img:'furniture-bunk-bed-loft-storage-stairs.jpg', real:true },

  // ============ HOTEL FURNITURE & SUPPLY — real product photography ============
  { id:'h1', cat:'hotel', sub:'Rooms & Lobby', name:'Hotel Room Furniture Package — Light Oak (Bed + Wardrobe + Nightstands)', price:4500000, img:'hotel-bedroom-furniture-standard.jpg', real:true },
  { id:'h1b', cat:'hotel', sub:'Rooms & Lobby', name:'Hotel Room Furniture Package — Walnut Suite', price:5800000, img:'hotel-bedroom-furniture-executive.jpg', real:true , new:true},
  { id:'h2', cat:'hotel', sub:'Rooms & Lobby', name:'Lobby & Reception Furniture Set', price:null, img:'hotel-lobby-reception-furniture.jpg', real:true },
  { id:'h3', cat:'hotel', sub:'Linen & Restaurant', name:'Bulk Hotel Bedding & Linen Package (per 10 rooms)', price:null, img:'hotel-white-bedding-linen-set.jpg', real:true },
  { id:'h3b', cat:'hotel', sub:'Linen & Restaurant', name:'Premium Hotel Bedding Set, Assorted Tones', price:null, img:'hotel-premium-bedding-sheets-set.jpg', real:true },
  { id:'h4', cat:'hotel', sub:'Linen & Restaurant', name:'Hotel Restaurant Table & Chair Set (4-seater)', price:780000, img:'hotel-round-table-upholstered-chairs.jpg', real:true },
];

const CATEGORIES = [
  { key:'phones', label:'Smartphones', thumb:'phone-samsung-s24ultra.jpg' },
  { key:'laptops', label:'Laptops', thumb:'laptop-lenovo.jpg' },
  { key:'tvs', label:'Smart TVs', thumb:'tv-samsung-43.jpg' },
  { key:'audio', label:'Home Theater & Audio', thumb:'audio-tower-5.1.jpg' },
  { key:'accessories', label:'Phone Accessories', thumb:'accessory-earbuds-tempt.jpg' },
  { key:'cameras', label:'Cameras', thumb:'camera-sony-a7r-lens-side.jpg' },
  { key:'printers', label:'Printers, Copiers & Cables', thumb:'printer-kyocera-mono-laser-mfp.jpg' },
  { key:'appliances', label:'Kitchen & Home Appliances', thumb:'appliance-commercial-convection-oven.jpg' },
  { key:'furniture', label:'Home Furniture', thumb:'furniture-dining-rectangular-six-chairs.jpg' },
  { key:'hotel', label:'Hotel Furniture & Supply', thumb:'hotel-bedroom-furniture-executive.jpg' },
];

// Category-level notes shown above the product grid (bulk/wholesale terms as agreed).
const CATEGORY_NOTES = {
  laptops: 'Wholesale sourcing quotes for entry-level bulk units start from UGX 200,000 per unit for orders of 100+ pcs — send us your specs for a custom quote.',
  accessories: 'Phone covers available at UGX 2,000 per unit for bulk/wholesale orders of 500+ pieces — ask for a wholesale quote.',
  appliances: 'Commercial kitchen equipment ships with installation guidance. Ask about bulk pricing for hotel, restaurant and institutional kitchens.',
  furniture: 'Custom carpentry and fitted kitchen pieces are quoted per project based on measurements and finish — message us for a same-day quote.',
  hotel: 'Hotel and hospitality packages are quoted per project based on room count and finish level — message us your room count for a same-day proposal.',
};

const WHATSAPP_NUMBER = '256755215751';
let activeCat = 'phones';
let cart = {}; // { productId: qty }
try {
  const savedCart = localStorage.getItem('velosCart');
  if(savedCart) cart = JSON.parse(savedCart);
} catch(e) { /* localStorage unavailable — cart just won't persist across pages */ }
function saveCart(){
  try { localStorage.setItem('velosCart', JSON.stringify(cart)); } catch(e) {}
}

function formatUGX(n){
  if(n === null || n === undefined) return 'Request Quote';
  return 'UGX ' + n.toLocaleString('en-US');
}

function renderTabs(){
  const bar = document.getElementById('tabBar');
  if(!bar) return; // this page has no shop tab bar — nothing to render
  bar.innerHTML = CATEGORIES.map(c =>
    `<button class="tab-btn ${c.key===activeCat?'active':''}" onclick="setCat('${c.key}')">${c.label}</button>`
  ).join('');

  const tiles = document.getElementById('categoryTiles');
  if(tiles){
    tiles.innerHTML = CATEGORIES.map(c => `
      <button class="cat-tile" onclick="setCat('${c.key}')">
        <span class="cat-tile-img"><img src="${c.thumb}" alt="${c.label}" loading="lazy" onerror="this.parentElement.classList.add('cat-tile-noimg')"></span>
        <span class="cat-tile-label">${c.label}</span>
        <span class="cat-tile-go">Shop Now <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </button>`).join('');
  }
}

function setCat(key){
  activeCat = key;
  const searchInput = document.getElementById('shopSearchInput');
  if(searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('shopSortSelect');
  if(sortSelect) sortSelect.value = 'featured';
  renderTabs();
  renderProducts();
  // Tapping a "Shop Now" category tile (or a pill tab) should visibly do
  // something even when the tile grid sits above the fold — without this,
  // the filter updates instantly but the person is still looking at the
  // tile grid and it looks like nothing happened.
  const grid = document.getElementById('productGrid');
  if(grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function productCard(p){
  const badges = [];
  if(p.real) badges.push('<span class="product-badge verified">Verified Photo</span>');
  if(CATEGORY_NOTES[p.cat]) badges.push('<span class="product-badge wholesale">Wholesale Available</span>');
  const fallback = `this.closest('.img-wrap').classList.add('img-fallback'); this.replaceWith(Object.assign(document.createElement('div'), {className:'img-fallback-inner', innerHTML:'<svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.3\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'m21 15-5-5L5 21\\'/></svg><span>Photo coming soon</span>'}))`;
  return `
    <div class="product-card">
      <div class="img-wrap${p.real ? ' real-tile' : ''}">
        ${p.new ? '<span class="new-ribbon">New</span>' : ''}
        <button class="card-share-btn" onclick="shareProduct('${p.id}')" aria-label="Share ${p.name} to WhatsApp Status">${SHARE_ICON}</button>
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="${fallback}">
      </div>
      <div class="product-info">
        ${badges.length ? `<div class="badge-row">${badges.join('')}</div>` : ''}
        <span class="cat-tag">${p.sub || CATEGORIES.find(c=>c.key===p.cat).label}</span>
        <h4>${p.name}</h4>
        <span class="price">${formatUGX(p.price)}</span>
        <div class="product-actions">
          <button class="btn-mini add" onclick="addToCart('${p.id}', this)">+ Cart</button>
          <button class="btn-mini order" onclick="orderNow('${p.id}')">Order Now</button>
        </div>
      </div>
    </div>`;
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return; // shop grid isn't on this page
  const countEl = document.getElementById('shopResultsCount');
  const searchInput = document.getElementById('shopSearchInput');
  const sortSelect = document.getElementById('shopSortSelect');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const sortMode = sortSelect ? sortSelect.value : 'featured';

  let items = PRODUCTS.filter(p => p.cat === activeCat);
  if(query){
    items = items.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.sub && p.sub.toLowerCase().includes(query))
    );
  }

  const sorted = items.slice();
  if(sortMode === 'price-asc') sorted.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if(sortMode === 'price-desc') sorted.sort((a,b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  else if(sortMode === 'name-asc') sorted.sort((a,b) => a.name.localeCompare(b.name));

  if(countEl){
    const total = PRODUCTS.filter(p => p.cat === activeCat).length;
    countEl.textContent = query
      ? `${sorted.length} of ${total} products match "${searchInput.value.trim()}"`
      : `${total} product${total === 1 ? '' : 's'} in this category`;
  }

  let html = '';
  const note = CATEGORY_NOTES[activeCat];
  if(note){
    html += `<div class="shop-note" style="margin-bottom:28px;"><p>${note}</p></div>`;
  }

  if(sorted.length === 0){
    html += `<div class="shop-no-results"><b>No products match your search</b>Try a different keyword, or send us a custom sourcing inquiry below and we'll find it for you.</div>`;
  } else if(sortMode !== 'featured' || query){
    html += `<div class="product-grid">${sorted.map(productCard).join('')}</div>`;
  } else {
    const subs = [];
    sorted.forEach(p => { if(p.sub && !subs.includes(p.sub)) subs.push(p.sub); });
    if(subs.length){
      subs.forEach(sub => {
        html += `<div class="subcat-head">${sub}</div>`;
        html += `<div class="product-grid">${sorted.filter(p=>p.sub===sub).map(productCard).join('')}</div>`;
      });
    } else {
      html += `<div class="product-grid">${sorted.map(productCard).join('')}</div>`;
    }
  }
  grid.innerHTML = html;
}

function addToCart(id, btnEl){
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
  toggleCart(true);
  const btn = btnEl || (event && event.target && event.target.closest('.btn-mini.add'));
  if(btn){
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = original; btn.classList.remove('added'); }, 1400);
  }
  const countEl = document.getElementById('cartCount');
  if(countEl){ countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump'); }
}

function orderNow(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const msg = `Hello Velos Global Shop, I would like to order:\n\n${p.name} — ${formatUGX(p.price)}\n\nPlease confirm availability.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}

function removeFromCart(id){ delete cart[id]; saveCart(); updateCartUI(); }
function changeQty(id, delta){
  cart[id] = (cart[id]||0) + delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}

function updateCartUI(){
  const ids = Object.keys(cart);
  document.getElementById('cartCount').textContent = ids.reduce((s,id)=>s+cart[id],0);
  const itemsEl = document.getElementById('cartItems');
  if(ids.length === 0){
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Add items from the Electronics catalog.</div>';
    document.getElementById('cartTotal').textContent = 'UGX 0';
    return;
  }
  let total = 0;
  itemsEl.innerHTML = ids.map(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    const qty = cart[id];
    if(p.price) total += p.price * qty;
    return `
      <div class="cart-item">
        <div>
          <div class="ci-name">${p.name}</div>
          <div class="ci-price">${formatUGX(p.price)} ${p.price ? '× '+qty : ''}</div>
          <button class="ci-remove" onclick="removeFromCart('${id}')">Remove</button>
        </div>
        <div class="ci-qty">
          <button onclick="changeQty('${id}',-1)">−</button>
          <span>${qty}</span>
          <button onclick="changeQty('${id}',1)">+</button>
        </div>
      </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatUGX(total);
}

function toggleCart(open){
  document.getElementById('cartDrawer').classList.toggle('open', open);
  document.getElementById('cartOverlay').classList.toggle('open', open);
}

function sendCartOrder(){
  const ids = Object.keys(cart);
  if(ids.length === 0){ alert('Your cart is empty.'); return; }
  let lines = ['Hello Velos Global Shop, I would like to order:', ''];
  let total = 0;
  ids.forEach(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    const qty = cart[id];
    lines.push(`• ${p.name} (x${qty}) — ${p.price ? formatUGX(p.price*qty) : 'Quote requested'}`);
    if(p.price) total += p.price*qty;
  });
  lines.push('', `Estimated Total: ${formatUGX(total)}`, '', 'Please confirm availability and delivery.');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
}

/* =========================================================
   EAST AFRICA LOCATION DATA — country -> city -> suggested areas.
   Powers the cascading Country / City / Area fields in the
   technician application. Area field stays a free-text input
   with these as datalist suggestions, so any real neighborhood
   can still be typed even if it isn't in this starter list.
   ========================================================= */
const EA_LOCATIONS = {
  'Uganda': {
    'Kampala': ['Kawempe','Nakawa','Makindye','Rubaga','Central Division','Ntinda','Kololo','Bugolobi','Naguru','Nsambya','Kansanga','Bukoto','Ntinda-Kyambogo'],
    'Wakiso': ['Kira','Namugongo','Kasangati','Nansana','Entebbe Road','Kajjansi'],
    'Mukono': ['Mukono Town','Seeta','Goma','Namataba'],
    'Mubende': ['Mubende Town'],
    'Jinja': ['Jinja Town','Walukuba','Njeru'],
    'Mbarara': ['Mbarara Town'],
    'Gulu': ['Gulu Town'],
    'Other / Not Listed': [],
  },
  'Kenya': {
    'Nairobi': ['Westlands','Karen','CBD','Kilimani','Eastleigh','Kasarani','Embakasi','Lavington'],
    'Mombasa': ['Nyali','Bamburi','Old Town'],
    'Kisumu': ['Milimani','CBD'],
    'Nakuru': ['Nakuru Town'],
    'Other / Not Listed': [],
  },
  'Rwanda': {
    'Kigali': ['Kimironko','Nyamirambo','Kacyiru','Remera','Kiyovu','Gisozi'],
    'Huye': ['Huye Town'],
    'Musanze': ['Musanze Town'],
    'Other / Not Listed': [],
  },
  'Tanzania': {
    'Dar es Salaam': ['Kinondoni','Ilala','Temeke','Masaki'],
    'Dodoma': ['Dodoma Town'],
    'Arusha': ['Arusha Town'],
    'Other / Not Listed': [],
  },
  'South Sudan': {
    'Juba': ['Juba Town'],
    'Other / Not Listed': [],
  },
  'Burundi': {
    'Bujumbura': ['Bujumbura Town'],
    'Other / Not Listed': [],
  },
  'Other East African Country': {
    'Other / Not Listed': [],
  },
};

function updateCityOptions(){
  const country = document.getElementById('techCountry').value;
  const citySelect = document.getElementById('techCity');
  const cities = EA_LOCATIONS[country] ? Object.keys(EA_LOCATIONS[country]) : [];
  citySelect.innerHTML = '<option value="">— Select city / town —</option>' + cities.map(c => `<option>${c}</option>`).join('');
  document.getElementById('areaSuggestions').innerHTML = '';
  document.getElementById('techLoc').value = '';
}

function updateAreaOptions(){
  const country = document.getElementById('techCountry').value;
  const city = document.getElementById('techCity').value;
  const areas = (EA_LOCATIONS[country] && EA_LOCATIONS[country][city]) ? EA_LOCATIONS[country][city] : [];
  document.getElementById('areaSuggestions').innerHTML = areas.map(a => `<option value="${a}">`).join('');
  document.getElementById('techLoc').value = '';
}

function sendTechRegistration(){
  const name = document.getElementById('techName').value.trim();
  const phone = document.getElementById('techPhone').value.trim();
  const nin = document.getElementById('techNIN').value.trim();
  const country = document.getElementById('techCountry').value.trim();
  const city = document.getElementById('techCity').value.trim();
  const email = document.getElementById('techEmail').value.trim();
  const trade = document.getElementById('techTrade').value;
  const exp = document.getElementById('techExp').value;
  const loc = document.getElementById('techLoc').value.trim();
  const refName = document.getElementById('techRefName').value.trim();
  const refPhone = document.getElementById('techRefPhone').value.trim();
  const notes = document.getElementById('techNotes').value.trim();
  const std1 = document.getElementById('std1').checked;
  const std2 = document.getElementById('std2').checked;
  const std3 = document.getElementById('std3').checked;
  const std4 = document.getElementById('std4').checked;

  if(!name || !phone || !nin || !country || !city || !trade || !exp || !loc || !refName || !refPhone){
    alert('Please complete every required field before submitting.');
    return;
  }
  if(!std1 || !std2 || !std3 || !std4){
    alert('You must agree to all points of the Velos Standard, including the UGX 50,000 verification & ID processing fee, to submit your application.');
    return;
  }

  const msg = `Hello Velos Global Services, I would like to submit my Technician Application:\n\n`+
    `Full Legal Name: ${name}\nWhatsApp Number: ${phone}\nNational ID (NIN): ${nin}\n`+
    `Country: ${country}\nCity/Town: ${city}\nArea: ${loc}\n`+
    `Primary Trade: ${trade}\nExperience: ${exp}\n`+
    `Reference: ${refName} (${refPhone})\nEmail: ${email||'—'}\nNotes: ${notes||'—'}\n\n`+
    `I confirm I agree to all points of the Velos Standard.\n`+
    `I confirm I understand the mandatory UGX 50,000 credential & ID processing fee is deducted from my first payout, not paid upfront.\n`+
    `I will upload my ID, certifications and passport photo to the shared Drive folder.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}


/* =========================================================
   VELOS AI GIFT CONCIERGE
   Rule-based recommendation engine — matches occasion + budget
   to a suggested item drawn from the live catalog, then hands
   off to WhatsApp for confirmation and dispatch.
   To upgrade this to a true generative AI concierge, route this
   function through a server-side endpoint that calls an LLM API
   with the PRODUCTS catalog as context (API keys must never be
   exposed in this front-end file).
   ========================================================= */
const GIFT_MATRIX = {
  birthday:   { under50:'ac1', low:'ac9', mid:'au4', high:'ph1', lux:'ph3' },
  wedding:    { under50:'ac1', low:'ac6', mid:'kt7', high:'kt11', lux:'f1' },
  anniversary:{ under50:'ac1', low:'ac2', mid:'au5', high:'tv3', lux:'ph6' },
  surprise:   { under50:'ac1', low:'ac7', mid:'au4', high:'cm4', lux:'tv11' },
  corporate:  { under50:'ac1', low:'ac5', mid:'au6', high:'lp1', lux:'lp3' },
};
const GIFT_BLURB = {
  birthday: 'A birthday pick chosen to feel personal without overshooting the budget.',
  wedding: 'A practical, high-quality gift a new household will actually use.',
  anniversary: 'Something a little indulgent — a gesture, not just a gadget.',
  surprise: "For the 'just because' moment — light, easy to deliver, easy to love.",
  corporate: 'Professional, brand-appropriate, and easy to order in quantity for a client list.',
};
const UNDER50_NOTE = " Looking for something smaller and more personal — earrings, a nice glass, an engraved bottle? Those aren't in our online catalog yet, but we can source them too — just message dispatch with what you have in mind.";

function getGiftSuggestion(){
  const occasion = document.getElementById('giftOccasion').value;
  const budget = document.getElementById('giftBudget').value;
  const productId = GIFT_MATRIX[occasion][budget];
  const product = PRODUCTS.find(p => p.id === productId);
  if(!product) return;

  document.getElementById('giftName').textContent = product.name;
  document.getElementById('giftDesc').textContent = `${GIFT_BLURB[occasion]} ${formatUGX(product.price)}${product.price ? '' : ' — we\'ll confirm final pricing over WhatsApp.'}${budget === 'under50' ? UNDER50_NOTE : ''}`;
  const waMsg = `Hello Velos, the AI Gift Concierge suggested this for a ${occasion}: ${product.name} (${formatUGX(product.price)}). I'd like to order it.`;
  document.getElementById('giftWhatsApp').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;
  document.getElementById('giftResult').classList.add('show');
}

/* =========================================================
   OPEN-ENDED ASSET CONCIERGE — keyword-weighted estimator.
   This is a client-side heuristic, not a connected AI model:
   it buckets free-text requests into a broad category and
   returns an ILLUSTRATIVE UGX range so the person has a sense
   of scale before talking to a human. It never quotes a firm
   price — every request is handed to the dispatch desk on
   WhatsApp for real sourcing feasibility and final pricing.
   To upgrade this into a true generative concierge, route this
   function through a server-side endpoint that calls an LLM
   API (API keys must never be exposed in this front-end file).
   ========================================================= */
const ASSET_CATEGORIES = [
  { key:'vehicle', label:'Vehicle / Automobile', kw:['car','vehicle','mercedes','benz','toyota','land cruiser','landcruiser','range rover','suv','truck','pickup','motorbike','motorcycle','boda','van','bus'],
    low:35000000, high:450000000,
    note:"Vehicle pricing swings hugely by make, model, year and condition (new vs. import-used). This range is a rough scan across common segments — dispatch will confirm feasibility and a firm landed price for the exact make/model you want." },
  { key:'property', label:'Property / Real Estate', kw:['house','land','plot','apartment','property','villa','estate','building','acres','acre','duplex','bungalow'],
    low:60000000, high:1500000000,
    note:"Property varies enormously by location, size and title status. This is a broad market-scan range only — our team will need location and size details to give a meaningful estimate." },
  { key:'jewelry', label:'Jewelry & Watches', kw:['jewelry','jewellery','ring','necklace','gold','diamond','watch','bracelet','earrings','engagement'],
    low:800000, high:60000000,
    note:"Custom jewelry pricing depends on metal, carat/weight and craftsmanship. This range covers everything from a modest gold piece to a fully custom diamond commission." },
  { key:'electronics', label:'Electronics & Tech (Unlisted)', kw:['laptop','phone','tv','drone','camera','console','playstation','xbox','tablet','ipad','macbook','projector','server','computer'],
    low:300000, high:25000000,
    note:"If it's not already in our Electronics catalog above, we can still source it internationally — this range reflects typical retail-to-premium electronics pricing." },
  { key:'furniture', label:'Furniture & Interiors', kw:['sofa','furniture','table','chair','wardrobe','interior','decor','bed','office setup'],
    low:400000, high:20000000,
    note:"Furniture ranges from off-the-shelf pieces to fully custom, made-to-order sets — tell us seating count or room size for a tighter estimate." },
  { key:'corporate', label:'Corporate / Bulk Gifting', kw:['corporate','bulk','clients','staff','employees','branded','company gift'],
    low:1000000, high:80000000,
    note:"Corporate and bulk orders are priced per unit at volume — quantity and per-item budget drive the final number." },
];

function estimateAssetRange(text){
  const lower = text.toLowerCase();
  const hit = ASSET_CATEGORIES.find(c => c.kw.some(k => lower.includes(k)));
  if(hit) return hit;
  return { key:'general', label:'Custom / General Request', low:100000, high:50000000,
    note:"This request doesn't map neatly to one of our usual categories, so we're showing a wide general range. Send it to dispatch as-is — a human will assess sourcing feasibility and come back with a real quote." };
}

function getCustomConciergeEstimate(){
  const text = document.getElementById('customAsk').value.trim();
  const budget = document.getElementById('customBudget').value.trim();
  if(!text){ alert('Please describe what you\'re looking for first.'); return; }

  const cat = estimateAssetRange(text);
  document.getElementById('customCategory').textContent = cat.label;
  document.getElementById('customName').textContent = `"${text}"`;
  document.getElementById('customRange').textContent = `Indicative range: ${formatUGX(cat.low)} – ${formatUGX(cat.high)}`;
  document.getElementById('customDesc').textContent = `${cat.note} This is a starting estimate only, not a firm price — the dispatch desk will confirm real sourcing feasibility and an exact quote.`;

  const waLines = [
    'Hello Velos AI Gift & Asset Concierge, I have a custom request:',
    '',
    `Request: ${text}`,
    budget ? `My target budget: ${budget}` : `My target budget: not specified`,
    `Concierge category match: ${cat.label}`,
    `Concierge indicative range: ${formatUGX(cat.low)} – ${formatUGX(cat.high)}`,
    '',
    'Please confirm sourcing feasibility and a firm price.'
  ];
  document.getElementById('customWhatsApp').href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waLines.join('\n'))}`;
  document.getElementById('customResult').classList.add('show');
}

/* =========================================================
   VELOS AI CONCIERGE CHATBOT
   Lightweight rule-based FAQ assistant for instant answers on
   pricing structure, dispatch, and ordering — escalates to a
   real human on WhatsApp for anything it can't resolve.
   For a true LLM-powered assistant, connect this UI to a
   backend endpoint that calls an AI API server-side.
   ========================================================= */
const CHAT_FAQ = [
  { k:['payment','pay','deposit','upfront'], a:"Retail orders are Cash-on-Delivery — you inspect the sealed unit before paying. Wholesale/bulk orders need a 70% deposit to lock in pricing, with the remaining 30% due on verified delivery." },
  { k:['emergency','dispatch','repair','urgent'], a:'Emergency Dispatch runs 24/7. Tap "Instant Dispatch Request" in the Services section, or message our WhatsApp line directly and a verified technician will be assigned.' },
  { k:['technician','register','join','apply'], a:'Head to the "Register as a Verified Technician" section — the application covers your ID, trade, and the Velos Standard agreement. All fields are required.' },
  { k:['gift','present'], a:'Try the AI Gift & Asset Concierge above the Electronics catalog — pick an occasion and budget for a catalog match, or describe absolutely anything (a car, a house, custom jewelry) in the "ask for anything" box for an instant estimate and WhatsApp quote.' },
  { k:['website','design','branding','packaging','logo'], a:'Global Designs website packages start at UGX 200,000, currently on discount. Tell us about your business on WhatsApp for a custom quote.' },
  { k:['wholesale','bulk'], a:'Most categories support bulk pricing — check the note at the top of each catalog tab for minimum order quantities, or ask our dispatch desk directly.' },
  { k:['price','cost','how much'], a:'Prices are listed on every product card in UGX. Anything marked "Request Quote" needs a quick WhatsApp conversation to confirm.' },
  { k:['contact','whatsapp','phone','call'], a:'You can reach the dispatch desk any time on WhatsApp: +256 755 215 751, or by email — dispatch@thevelosgroup.com for order/dispatch matters, info@thevelosgroup.com for everything else.' },
];
const CHAT_QUICK_PROMPTS = ['Emergency dispatch', 'Payment terms', 'Become a technician', 'Source me anything'];
// Signals that the visitor is describing something they want sourced/bought/quoted,
// rather than asking a general FAQ question — triggers the open-ended concierge path.
const PURCHASE_INTENT_WORDS = ['want','need','looking for','source','sourcing','buy','get me','find me','quote for','how much for','price for','can you get','custom order','custom request'];

function chatAppend(text, who){
  const body = document.getElementById('chatBody');
  const div = document.createElement('div');
  div.className = `chat-msg ${who}`;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function chatAppendLink(url, label){
  const body = document.getElementById('chatBody');
  const a = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  a.className = 'chat-msg bot chat-link';
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm0 18c-1.6 0-3.1-.44-4.38-1.2l-.31-.18-3 .79.8-2.92-.2-.3A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8Z"/></svg><span>' + label + '</span>';
  body.appendChild(a);
  body.scrollTop = body.scrollHeight;
}

function chatRespond(text){
  const lower = text.toLowerCase();
  const hit = CHAT_FAQ.find(f => f.k.some(k => lower.includes(k)));
  if(hit) return { text: hit.a };

  const isPurchaseIntent = PURCHASE_INTENT_WORDS.some(k => lower.includes(k)) || text.length > 22;
  if(isPurchaseIntent){
    const cat = estimateAssetRange(text);
    const reply = `That sounds like a ${cat.label.toLowerCase()} request. Rough indicative range: ${formatUGX(cat.low)} – ${formatUGX(cat.high)}, but that's just a starting estimate — tap below to send it straight to our dispatch desk for a real sourcing check and firm quote.`;
    const waMsg = `Hello Velos AI Concierge (chat), I have a custom request:\n\nRequest: ${text}\nConcierge category match: ${cat.label}\nConcierge indicative range: ${formatUGX(cat.low)} – ${formatUGX(cat.high)}\n\nPlease confirm sourcing feasibility and a firm price.`;
    return { text: reply, waMsg };
  }

  return { text: "I can help with dispatch, pricing structure, technician applications, gifts, and Global Designs quotes — or describe absolutely anything you want sourced (a car, a house, jewelry, an unlisted gadget) and I'll estimate a budget range and route it to dispatch. What are you after?" };
}

function sendChat(prompt){
  const input = document.getElementById('chatInput');
  const text = (prompt || input.value).trim();
  if(!text) return;
  chatAppend(text, 'user');
  input.value = '';
  setTimeout(() => {
    const res = chatRespond(text);
    chatAppend(res.text, 'bot');
    if(res.waMsg){
      chatAppendLink(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(res.waMsg)}`, 'Request This on WhatsApp');
    }
  }, 300);
}

function toggleChat(open){
  const win = document.getElementById('chatWindow');
  win.classList.toggle('open', open);
  if(open && !win.dataset.started){
    win.dataset.started = '1';
    chatAppend("Hello — I'm the Velos AI Concierge. Ask me about dispatch, pricing, technician registration, or gifts — or just tell me what you want sourced, anything at all, and I'll estimate a range and route it to dispatch.", 'bot');
    const quick = document.getElementById('chatQuick');
    quick.innerHTML = CHAT_QUICK_PROMPTS.map(q => `<button onclick="sendChat('${q}')">${q}</button>`).join('');
  }
}

function sendInquiry(){
  const name = document.getElementById('inqName').value.trim();
  const phone = document.getElementById('inqPhone').value.trim();
  const division = document.getElementById('inqDivision').value;
  const message = document.getElementById('inqMsg').value.trim();
  if(!name || !message){ alert('Please enter your name and a short message.'); return; }
  const msg = `Hello Velos Group Dispatch Desk,\n\nName: ${name}\nPhone: ${phone}\nDivision: ${division}\n\nMessage: ${message}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* =========================================================
   SPOTLIGHT — auto-rotating cross-sector promotions.
   Mixes division promos with real individual product slides,
   plus an automatic Flash Deal (see below). Add/edit static
   slides here — built so real paid placements can be dropped
   in the same way later.
   ========================================================= */
const SPOTLIGHT_SLIDES_STATIC = [
  { tag:'Global Services — Active Division', title:'24/7 Emergency Dispatch', body:'Verified master technicians, zero compromise, anywhere in Kampala.', img:'services-hero-drone.jpg', media:'dark', cta:'Request Dispatch', link:'https://wa.me/256755215751?text=Hello%20Velos%2C%20I%20need%20emergency%20dispatch.' },
  { tag:'Global Designs — On Discount', title:'Branding & Packaging, On Discount', body:'Websites, logos, and product packaging — made to order, quoted individually.', img:'design-packaging-box.jpg', media:'light', cta:'Explore Designs', link:'designs.html' },
  { tag:'Gifts & Custom Sourcing', title:'Not Sure What to Get? Ask Velos.', body:'From a UGX 50,000 gift to a custom sourcing request — pre-ordered and prepared for you.', img:'https://images.pexels.com/photos/5725859/pexels-photo-5725859.jpeg?auto=compress&cs=tinysrgb&w=900', media:'dark', cta:'Find a Gift', link:'gifts.html' },
  { tag:'Partner Portal', title:'Join the Velos Elite Technician Network', body:'Formal application, verified network, fee deducted from your first payout.', img:'icon-facility-maintenance.jpg', media:'dark', cta:'Apply Now', link:'technicians.html' },
  { tag:'Velos Global Shop — Smartphones', productId:'ph3', title:null, body:null, media:'light', cta:'View in Store', link:'shop.html' },
  { tag:'Velos Global Shop — Home Entertainment', productId:'tv7', title:null, body:null, media:'light', cta:'View in Store', link:'shop.html' },
  { tag:'Velos Global Shop — Laptops', productId:'lp3', title:null, body:null, media:'light', cta:'View in Store', link:'shop.html' },
];

/* Flash Deal engine: every 4-hour window a different in-stock
   product gets an automatic -20% tag, synchronized for every
   visitor off the real clock — no backend required. */
const FLASH_DEAL_PERIOD_MS = 4 * 60 * 60 * 1000;
function getFlashDeal(){
  const eligible = PRODUCTS.filter(p => p.price);
  const periodIndex = Math.floor(Date.now() / FLASH_DEAL_PERIOD_MS);
  const product = eligible[periodIndex % eligible.length];
  const nextChange = (periodIndex + 1) * FLASH_DEAL_PERIOD_MS;
  return { product, discounted: Math.round(product.price * 0.8 / 1000) * 1000, nextChange };
}

function formatCountdown(ms){
  if(ms < 0) ms = 0;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

let spotlightIndex = 0;
let spotlightTimer = null;
let flashCountdownTimer = null;

function buildSpotlightSlides(){
  // Ads / promotions only — the countdown Flash Deal lives in its own
  // standalone block (renderFlashDeal) so the two never mix.
  const productSlides = SPOTLIGHT_SLIDES_STATIC.filter(s => s.productId).map(s => {
    const p = PRODUCTS.find(x => x.id === s.productId);
    return { ...s, title:p.name, body:`${CATEGORIES.find(c=>c.key===p.cat).label} — ${formatUGX(p.price)}`, img:p.img };
  });
  const otherSlides = SPOTLIGHT_SLIDES_STATIC.filter(s => !s.productId);
  return [...otherSlides.slice(0,2), productSlides[0], otherSlides[2], productSlides[1], otherSlides[3], productSlides[2]].filter(Boolean);
}

let SPOTLIGHT_SLIDES = [];

/* Builds an absolute URL back to the live site, regardless of whether
   it's currently hosted on github.io or a purchased domain later —
   used so shared WhatsApp Status posts link back correctly either way. */
function siteUrl(path){
  return window.location.origin + window.location.pathname.replace(/[^/]*$/, '') + path;
}

const SHARE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>';

/* Loads a same-origin image element, for drawing onto the promo canvas. */
function loadImage(src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/* Builds a single square promo graphic — product photo on top, a dark
   info panel below with the name/price, and two button-shaped visual
   elements ("Order on WhatsApp" / "Explore More"). WhatsApp Status and
   chat images can't carry real clickable buttons — no platform supports
   that on a plain shared photo — so this bakes the buttons into the
   image itself, Jumia-style, purely as a visual cue. The actual tap
   target is the real wa.me link carried in the caption text underneath.
   Returns a Blob (JPEG) or null if the source image can't be loaded
   (e.g. a missing product photo) — callers fall back to sharing the
   plain photo or text-only in that case. */
async function buildPromoImage({ imgSrc, title, priceText, oldPriceText, badgeText }){
  let photo;
  try { photo = await loadImage(imgSrc); } catch(e) { return null; }

  const W = 1080, H = 1080, PANEL_H = 340;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Photo area — cover-fit into the top region above the info panel.
  const photoH = H - PANEL_H;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, photoH);
  const scale = Math.max(W / photo.width, photoH / photo.height);
  const pw = photo.width * scale, ph = photo.height * scale;
  ctx.drawImage(photo, (W - pw) / 2, (photoH - ph) / 2, pw, ph);

  // Optional badge (e.g. "FLASH DEAL · -20%") top-left over the photo.
  if(badgeText){
    ctx.font = '600 26px Arial';
    const padX = 22;
    const tw = ctx.measureText(badgeText).width;
    ctx.fillStyle = '#e6493f';
    roundRect(ctx, 28, 28, tw + padX * 2, 52, 26);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, 28 + padX, 28 + 27);
  }

  // Info panel background.
  const panelY = photoH;
  const grad = ctx.createLinearGradient(0, panelY, 0, H);
  grad.addColorStop(0, '#0c1226');
  grad.addColorStop(1, '#080d1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, panelY, W, PANEL_H);

  // Velos wordmark, small, top-right of panel — brand recognition on reshare.
  ctx.font = '700 30px Georgia, serif';
  ctx.fillStyle = '#e8c766';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('THE VELOS GROUP', W - 32, panelY + 46);
  ctx.textAlign = 'left';

  // Product title (wrapped to 2 lines max).
  ctx.font = '600 42px Georgia, serif';
  ctx.fillStyle = '#f4f1ea';
  const lines = wrapText(ctx, title, W - 64, 2);
  lines.forEach((line, i) => ctx.fillText(line, 32, panelY + 100 + i * 50));
  const priceY = panelY + 100 + lines.length * 50 + 24;

  // Price (with strikethrough original if a discount is present).
  ctx.font = '700 46px Arial';
  ctx.fillStyle = '#7fd99a';
  ctx.fillText(priceText, 32, priceY);
  if(oldPriceText){
    const pw2 = ctx.measureText(priceText).width;
    ctx.font = '400 28px Arial';
    ctx.fillStyle = '#8a93ab';
    ctx.fillText(oldPriceText, 32 + pw2 + 20, priceY);
    const ow = ctx.measureText(oldPriceText).width;
    ctx.strokeStyle = '#8a93ab';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(32 + pw2 + 20, priceY - 10);
    ctx.lineTo(32 + pw2 + 20 + ow, priceY - 10);
    ctx.stroke();
  }

  // Two visual "buttons" — Order on WhatsApp (filled gold) / Explore More (outlined).
  const btnY = priceY + 34, btnH = 76, gap = 16;
  const btnW = (W - 64 - gap) / 2;
  roundRect(ctx, 32, btnY, btnW, btnH, 12);
  ctx.fillStyle = '#e8c766';
  ctx.fill();
  ctx.font = '700 28px Arial';
  ctx.fillStyle = '#080d1a';
  ctx.textAlign = 'center';
  ctx.fillText('🛒 Order on WhatsApp', 32 + btnW / 2, btnY + btnH / 2 + 10);

  roundRect(ctx, 32 + btnW + gap, btnY, btnW, btnH, 12);
  ctx.strokeStyle = '#e8c766';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#e8c766';
  ctx.fillText('🔍 Explore More', 32 + btnW + gap + btnW / 2, btnY + btnH / 2 + 10);
  ctx.textAlign = 'left';

  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
}

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth, maxLines){
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for(const word of words){
    const test = current ? current + ' ' + word : word;
    if(ctx.measureText(test).width > maxWidth && current){
      lines.push(current);
      current = word;
      if(lines.length === maxLines - 1){
        // last line — truncate with ellipsis if the remainder still overflows
        let rest = words.slice(words.indexOf(word)).join(' ');
        while(ctx.measureText(rest + '…').width > maxWidth && rest.length > 1){
          rest = rest.slice(0, -1);
        }
        lines.push(rest + (rest.length < text.length ? '…' : ''));
        return lines;
      }
    } else {
      current = test;
    }
  }
  if(current) lines.push(current);
  return lines.slice(0, maxLines);
}

/* Share a product, Flash Deal, or Ad slide — with a composited promo
   image (photo + price + visual buttons + branding) attached where the
   browser supports file sharing. Tries the native Web Share sheet first
   (this is what makes "WhatsApp Status" appear as a direct target on
   Android/iOS). Falls back to a WhatsApp forward link (text + URL, no
   image) on browsers without native share or file-sharing support —
   mainly desktop. */
async function shareContent(title, bodyText, waLink, pageLink, imgSrc, imgName, promoOpts){
  let shareText = bodyText + `\n\nOrder / Enquire on WhatsApp: ${waLink}`;
  if(pageLink) shareText += `\nView more at Velos Global Shop: ${pageLink}`;

  if(navigator.share){
    let file = null;
    if(promoOpts){
      const blob = await buildPromoImage(promoOpts);
      if(blob){
        file = new File([blob], imgName || 'velos-deal.jpg', { type: 'image/jpeg' });
        if(navigator.canShare && !navigator.canShare({ files: [file] })) file = null;
      }
    }
    if(!file && imgSrc){
      try {
        const res = await fetch(imgSrc);
        if(res.ok){
          const blob = await res.blob();
          const candidate = new File([blob], imgName || 'velos-deal.jpg', { type: blob.type || 'image/jpeg' });
          if(!navigator.canShare || navigator.canShare({ files: [candidate] })) file = candidate;
        }
      } catch(e) { /* fall through to text-only */ }
    }
    const payload = file ? { title, text: shareText, files: [file] } : { title, text: shareText };
    try { await navigator.share(payload); return; } catch(e) { /* user cancelled or share failed — fall through */ }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener');
}

function shareProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  const waLink = `https://wa.me/256755215751?text=${encodeURIComponent('Hello Velos, I would like to order: '+p.name+(p.price ? ' — '+formatUGX(p.price) : ''))}`;
  shareContent(
    p.name,
    `${p.name}\n${formatUGX(p.price)}`,
    waLink,
    siteUrl('shop.html'),
    p.img,
    'velos-product.jpg',
    { imgSrc: p.img, title: p.name, priceText: formatUGX(p.price) }
  );
}

let SPOTLIGHT_SHARE = [];

function renderSpotlight(){
  const track = document.getElementById('spotlightTrack');
  const dots = document.getElementById('spotlightDots');
  if(!track || !dots) return; // spotlight carousel only lives on the homepage
  SPOTLIGHT_SLIDES = buildSpotlightSlides();
  SPOTLIGHT_SHARE = SPOTLIGHT_SLIDES.map(s => ({
    title: s.tag,
    text: `${s.tag}\n${s.title}${s.body ? '\n'+s.body : ''}`,
    link: s.link,
    img: s.img
  }));
  track.innerHTML = SPOTLIGHT_SLIDES.map((s,i) => `
    <div class="spotlight-slide${i===0?' active':''}" data-i="${i}">
      <div class="spotlight-media ${s.media}">
        <img src="${s.img}" alt="${s.title}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="spotlight-text">
        <span class="sl-tag">${s.tag}</span>
        <h3>${s.title}</h3>
        <p>${s.body}</p>
        <div class="sl-actions">
          <a class="btn-primary" href="${s.link}" ${s.link.startsWith('http')?'target="_blank" rel="noopener"':''}>${s.cta}</a>
          <button class="btn-share" onclick="shareSpotlight(${i})" aria-label="Share this photo to WhatsApp Status">${SHARE_ICON}Share</button>
        </div>
      </div>
    </div>`).join('');
  dots.innerHTML = SPOTLIGHT_SLIDES.map((s,i) => `<button class="spotlight-dot${i===0?' active':''}" onclick="spotlightGoTo(${i})" aria-label="Slide ${i+1}"></button>`).join('');
  startSpotlightTimer();
}

function shareSpotlight(i){
  const s = SPOTLIGHT_SHARE[i];
  if(!s) return;
  const promoOpts = { imgSrc: s.img, title: s.title, priceText: s.tag };
  if(s.link.startsWith('http')){
    shareContent(s.title, s.text, s.link, null, s.img, 'velos-ad.jpg', promoOpts);
  } else {
    const waLink = `https://wa.me/256755215751?text=${encodeURIComponent('Hello Velos, I am interested in: '+s.title)}`;
    shareContent(s.title, s.text, waLink, siteUrl(s.link), s.img, 'velos-ad.jpg', promoOpts);
  }
}

/* Standalone Flash Deal — one countdown offer, its own block, never
   mixed into the rotating ads carousel above. Marketing copy stays
   honest: real savings math and real countdown urgency, no invented
   stock counts or fabricated scarcity claims. */
let currentFlashDeal = null;
let FLASH_DEAL_SHARE = null;

function renderFlashDeal(){
  const el = document.getElementById('flashDeal');
  if(!el) return; // flash deal block only lives on the homepage
  const deal = getFlashDeal();
  currentFlashDeal = deal;
  const savings = deal.product.price - deal.discounted;
  const link = `https://wa.me/256755215751?text=${encodeURIComponent('Hello Velos, I would like to order the Flash Deal: '+deal.product.name+' at the discounted price of '+formatUGX(deal.discounted)+'.')}`;
  FLASH_DEAL_SHARE = {
    title: 'Velos Flash Deal',
    text: `⚡ FLASH DEAL — ${deal.product.name}\nNow ${formatUGX(deal.discounted)} (was ${formatUGX(deal.product.price)}) — you save ${formatUGX(savings)}!\nLimited-time offer — resets in hours, not days.`,
    link
  };
  el.innerHTML = `
    <div class="fd-media"><img src="${deal.product.img}" alt="${deal.product.name}" loading="lazy" onerror="this.style.display='none'"></div>
    <div class="fd-text">
      <span class="fd-badge">⚡ FLASH DEAL · -20% · <span id="flashCountdown"></span></span>
      <h3>${deal.product.name}</h3>
      <div class="spotlight-price"><span class="was">${formatUGX(deal.product.price)}</span><span class="now">${formatUGX(deal.discounted)}</span></div>
      <div class="fd-save">You save ${formatUGX(savings)} — today only</div>
      <div class="fd-actions">
        <a class="btn-primary" href="${link}" target="_blank" rel="noopener">Order This Deal</a>
        <button class="btn-share" onclick="shareFlashDeal()" aria-label="Share this deal's photo to WhatsApp Status">${SHARE_ICON}Share</button>
      </div>
      <div class="fd-trust">Cash on delivery — inspect before you pay</div>
    </div>`;
  startFlashCountdown();
}

function shareFlashDeal(){
  if(!FLASH_DEAL_SHARE || !currentFlashDeal) return;
  const p = currentFlashDeal.product;
  shareContent(
    FLASH_DEAL_SHARE.title,
    FLASH_DEAL_SHARE.text,
    FLASH_DEAL_SHARE.link,
    siteUrl('shop.html'),
    p.img,
    'velos-flash-deal.jpg',
    { imgSrc: p.img, title: p.name, priceText: formatUGX(currentFlashDeal.discounted), oldPriceText: formatUGX(p.price), badgeText: '⚡ FLASH DEAL · -20%' }
  );
}

function startFlashCountdown(){
  clearInterval(flashCountdownTimer);
  if(!currentFlashDeal) return;
  const tick = () => {
    const el = document.getElementById('flashCountdown');
    if(!el) return;
    el.textContent = formatCountdown(currentFlashDeal.nextChange - Date.now());
  };
  tick();
  flashCountdownTimer = setInterval(tick, 1000);
}

function spotlightGoTo(i){
  spotlightIndex = (i + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length;
  document.querySelectorAll('.spotlight-slide').forEach((el,idx)=> el.classList.toggle('active', idx===spotlightIndex));
  document.querySelectorAll('.spotlight-dot').forEach((el,idx)=> el.classList.toggle('active', idx===spotlightIndex));
  startSpotlightTimer();
}

function spotlightStep(dir){ spotlightGoTo(spotlightIndex + dir); }

function startSpotlightTimer(){
  clearInterval(spotlightTimer);
  spotlightTimer = setInterval(()=> spotlightGoTo(spotlightIndex + 1), 5000);
}

const spotlightEl = document.getElementById('spotlight');
if(spotlightEl){
  spotlightEl.addEventListener('mouseenter', ()=> clearInterval(spotlightTimer));
  spotlightEl.addEventListener('mouseleave', startSpotlightTimer);
}

/* =========================================================
   SITE SEARCH — searches product names, service names, and
   division names across the whole catalog.
   ========================================================= */
/* Every "wing" now lives on its own page, so a search result either
   jumps to an anchor on THIS page (if it exists here) or navigates to
   the right page (optionally with a #anchor once there). */
const PAGE_MAP = { about:'about.html', policy:'about.html#policy', services:'services.html', shop:'shop.html', gifts:'gifts.html', designs:'designs.html', technicians:'technicians.html', contact:'contact.html' };
function goToSection(id){
  const local = document.getElementById(id);
  if(local){ local.scrollIntoView({behavior:'smooth'}); return; }
  const dest = PAGE_MAP[id];
  if(dest) window.location.href = dest;
}
function buildSearchIndex(){
  const index = [];
  const onShopPage = !!document.getElementById('productGrid');
  PRODUCTS.forEach(p => index.push({ label:p.name, sub:(p.sub||CATEGORIES.find(c=>c.key===p.cat).label), type:'Product', action:()=>{
    if(onShopPage){ setCat(p.cat); document.getElementById('shop').scrollIntoView({behavior:'smooth'}); toggleSearch(false); }
    else { window.location.href = `shop.html?cat=${p.cat}`; }
  } }));
  SPOTLIGHT_SLIDES.forEach(s => index.push({ label:s.title, sub:s.tag, type:'Section', action:()=>{ if(s.link.startsWith('#')){ goToSection(s.link.slice(1)); } else { window.open(s.link,'_blank','noopener'); } toggleSearch(false); } }));
  ['About & Governance','Global Services','Velos Global Shop','Gift Concierge','Global Designs','Technician Network','Acquisition Policy','Contact'].forEach((label,i) => {
    const ids = ['about','services','shop','gifts','designs','technicians','policy','contact'];
    index.push({ label, sub:'Explore Velos', type:'Section', action:()=>{ goToSection(ids[i]); toggleSearch(false); } });
  });
  return index;
}
let SEARCH_INDEX = [];
let CURRENT_MATCHES = [];

function toggleSearch(open){
  const el = document.getElementById('searchOverlay');
  el.classList.toggle('open', open);
  if(open){
    if(!SEARCH_INDEX.length) SEARCH_INDEX = buildSearchIndex();
    document.getElementById('searchInput').value = '';
    renderSearchResults('');
    setTimeout(()=> document.getElementById('searchInput').focus(), 50);
  }
}

function runSiteSearch(q){ renderSearchResults(q); }

function renderSearchResults(q){
  const results = document.getElementById('searchResults');
  const query = q.trim().toLowerCase();
  CURRENT_MATCHES = query ? SEARCH_INDEX.filter(i => i.label.toLowerCase().includes(query) || i.sub.toLowerCase().includes(query)) : SEARCH_INDEX.slice(0, 8);
  CURRENT_MATCHES = CURRENT_MATCHES.slice(0, 20);
  if(!CURRENT_MATCHES.length){
    results.innerHTML = '<div class="search-empty">No matches. Try a different word, or send us an inquiry — we source almost anything.</div>';
    return;
  }
  results.innerHTML = CURRENT_MATCHES.map((m,i) => `
    <button class="search-result" onclick="runSearchAction(${i})">
      <span class="sr-type">${m.type}</span>
      <span class="sr-label">${m.label}</span>
      <span class="sr-sub">${m.sub}</span>
    </button>`).join('');
}
function runSearchAction(i){ if(CURRENT_MATCHES[i]) CURRENT_MATCHES[i].action(); }

document.getElementById('burgerBtn').addEventListener('click', ()=>{
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a=>{
  a.addEventListener('click', ()=> document.getElementById('mobileMenu').classList.remove('open'));
});

/* Rotating hero banner for each wing page — purely atmospheric (a short
   tagline, not a duplicate headline; the real H1/description sit in the
   section-head just below). Every wing now has real photo rotation using
   supplied photography — note these are atmospheric/mood photos, not
   literal on-the-job photos of Velos crews yet; swap in real job-site
   photos as they become available and the rotation keeps working exactly
   the same way. */
const PAGE_HERO_CONFIG = {
  services: { tagline: 'Infrastructure you can trust, dispatched in hours — not days.', images: ['hero-services-velos-delivery-handoff.jpg','hero-services-masonry-construction.jpg','hero-services-electrical-datacenter.jpg','hero-services-drone-site-audit.jpg','hero-services-aerial-construction.jpg'] },
  shop: { tagline: 'Real products. Real photos. Real prices — order with confidence.', images: ['phone-samsung-s24ultra.jpg','laptop-lenovo.jpg','camera-sony-a7r-lens-side.jpg','tv-samsung-43.jpg','hero-shop-smart-kitchen.jpg'] },
  gifts: { tagline: "Tell us the moment — we'll find the gift.", images: ['phone-iphone16pro.jpg','camera-sony-a7r-lens-side.jpg','hero-gifts-luxury-interior.jpg'] },
  designs: { tagline: 'Brand, package, and launch — all under one roof.', images: ['hero-designs-smart-panel.jpg','hero-about-velos-villa-van.jpg'] },
  technicians: { tagline: 'Verified talent, vetted by Velos HQ.', images: ['hero-technician-plumber-repair.jpg','hero-technician-tools-diagnostic.jpg'] },
  about: { tagline: 'Built on radical transparency and zero compromise.', images: ['hero-about-velos-villa-van.jpg','hero-about-security-gated-estate.jpg'] },
  contact: { tagline: 'One message reaches the whole organization.', images: ['hero-services-velos-delivery-handoff.jpg'] },
};
let pageHeroTimer = null;

function initPageHero(){
  const el = document.getElementById('pageHero');
  if(!el) return; // only wing pages carry this banner
  const page = document.body.dataset.page;
  const cfg = PAGE_HERO_CONFIG[page];
  if(!cfg) return;

  if(cfg.images.length){
    el.innerHTML = cfg.images.map((img,i) => `<div class="ph-bg${i===0?' active':''}" style="background-image:url('${img}')"></div>`).join('')
      + `<div class="ph-content"><span class="ph-eyebrow">The Velos Group</span><p style="color:var(--ink); font-size:15px; max-width:420px;">${cfg.tagline}</p></div>`;
    if(cfg.images.length > 1){
      let i = 0;
      pageHeroTimer = setInterval(() => {
        const bgs = el.querySelectorAll('.ph-bg');
        bgs[i].classList.remove('active');
        i = (i + 1) % bgs.length;
        bgs[i].classList.add('active');
      }, 5000);
    }
  } else {
    el.innerHTML = `<div class="ph-content"><span class="ph-eyebrow">The Velos Group</span><p style="color:var(--ink); font-size:15px; max-width:420px;">${cfg.tagline}</p></div>`;
  }
}

/* Each init step runs independently — if one throws (e.g. an unexpected
   missing element on a given page), it's logged to the console but never
   prevents the others from running. No single bug should be able to take
   down the whole page's interactivity. */
function safeInit(fn, label){
  try { fn(); } catch(err) { console.error(`Velos init step failed: ${label}`, err); }
}
safeInit(initPageHero, 'initPageHero');
safeInit(renderSpotlight, 'renderSpotlight');
safeInit(renderFlashDeal, 'renderFlashDeal');
safeInit(renderTabs, 'renderTabs');
safeInit(renderProducts, 'renderProducts');
safeInit(updateCartUI, 'updateCartUI');

/* =========================================================
   MULTI-PAGE NAV — dropdown toggle, active-page highlighting,
   and a shop.html ?cat= handler so cross-page search results
   and wing cards can deep-link straight into a category.
   ========================================================= */
function toggleWingsMenu(force){
  const el = document.querySelector('.nav-dropdown');
  if(!el) return;
  el.classList.toggle('open', force !== undefined ? force : !el.classList.contains('open'));
}
document.addEventListener('click', (e) => {
  const dd = document.querySelector('.nav-dropdown');
  if(dd && dd.classList.contains('open') && !dd.contains(e.target)) toggleWingsMenu(false);
});

safeInit(function highlightActiveNav(){
  const page = document.body.dataset.page;
  if(!page) return;
  document.querySelectorAll('[data-page]').forEach(a => {
    if(a.dataset.page === page) a.classList.add('current');
  });
}, 'highlightActiveNav');

safeInit(function handleShopCategoryParam(){
  if(!document.getElementById('productGrid')) return;
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if(cat && CATEGORIES.some(c => c.key === cat)) activeCat = cat;
}, 'handleShopCategoryParam');
