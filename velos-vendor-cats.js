/* Velos partner (vendor) categories. One list shared by the vendor app, the marketplace and the admin. */
window.VCATS = [
  {k:'electronics', l:'Electronics', i:'📱', kind:'goods', units:['piece','set']},
  {k:'fashion', l:'Fashion & beauty', i:'👗', kind:'goods', units:['piece','pair','set']},
  {k:'home_appliances', l:'Home appliances', i:'🍳', kind:'goods', units:['piece','set','carton']},
  {k:'hardware', l:'Hardware & building materials', i:'🧱', kind:'goods', units:['piece','bag','bundle','metre','carton']},
  {k:'groceries', l:'Groceries & supermarket', i:'🛒', kind:'goods', units:['piece','kg','litre','bag','carton']},
  {k:'stationery', l:'Stationery & office', i:'📚', kind:'goods', units:['piece','pack','ream','carton']},
  {k:'furniture', l:'Furniture & decor', i:'🛋️', kind:'goods', units:['piece','set']},
  {k:'automotive', l:'Auto parts & accessories', i:'🚗', kind:'goods', units:['piece','set']},
  {k:'agriculture', l:'Farm produce & inputs', i:'🌾', kind:'goods', units:['kg','bag','litre','piece']},
  {k:'hotels', l:'Hotels & rooms', i:'🏨', kind:'hotel', units:['night','room','day']},
  {k:'venues', l:'Venues & event halls', i:'🏛️', kind:'venue', units:['day','event','hour']},
  {k:'general', l:'Other', i:'🏪', kind:'goods', units:['piece','set','kg','carton']}
];
window.vcat = function(k){ for(var i = 0; i < VCATS.length; i++) if(VCATS[i].k === k) return VCATS[i]; return VCATS[VCATS.length - 1]; };
