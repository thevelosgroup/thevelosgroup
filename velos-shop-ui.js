(function(){var sig='',n=0;
function pick(){var out=[],by={};CATEGORIES.forEach(function(c){by[c.key]=PRODUCTS.filter(function(p){return p.cat===c.key&&p.price&&p.inStock!==false})});
 for(var i=0;i<5&&out.length<8;i++)CATEGORIES.forEach(function(c){var l=by[c.key];if(l[i]&&out.length<8)out.push(l[i])});
 return out.sort(function(a,b){return (/^data:/.test(a.img||'')?1:0)-(/^data:/.test(b.img||'')?1:0)})}
function go(){var box=document.getElementById('bestSellers');if(!box||typeof PRODUCTS==='undefined'||typeof CATEGORIES==='undefined'||typeof productCard!=='function')return;
 var s=PRODUCTS.length+':'+CATEGORIES.length;if(s===sig)return;sig=s;var o=pick();var h=document.getElementById('featuredWrap');if(h)h.style.display=o.length?'':'none';box.innerHTML=o.map(productCard).join('')}
var iv=setInterval(function(){go();if(++n>40)clearInterval(iv)},500);addEventListener('load',go);})();
