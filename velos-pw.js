/* Velos login helpers: Show/Hide on every password box, and a "Forgot password?" link on sign-in boxes.
   Just include <script src="velos-pw.js" defer></script> on any page that has a login. */
(function(){
  function css(){ if(document.getElementById('vpw-css'))return; var s=document.createElement('style'); s.id='vpw-css';
    s.textContent='.vpw-wrap{position:relative;display:block}.vpw-wrap>input{padding-right:62px!important;width:100%;box-sizing:border-box}.vpw-t{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none!important;border:0!important;box-shadow:none!important;color:#d4af37!important;font:600 12px/1 system-ui,sans-serif;padding:8px 6px!important;margin:0!important;width:auto!important;min-height:0!important;cursor:pointer}.vpw-f{display:block;text-align:right;margin:2px 2px 8px;font:13px system-ui,sans-serif}.vpw-f a{color:#e8c766;text-decoration:underline;cursor:pointer}';
    document.head.appendChild(s); }
  function client(){ try{ if(typeof db!=='undefined'&&db&&db.auth) return db; }catch(e){} if(window.db&&window.db.auth) return window.db; return null; }
  function toast(m,bad){ if(typeof window.toast==='function'){ try{ window.toast(m,bad); return; }catch(e){} } alert(m); }
  function wrap(inp){
    if(inp.dataset.vpw) return; inp.dataset.vpw='1'; css();
    var w=document.createElement('span'); w.className='vpw-wrap'; inp.parentNode.insertBefore(w,inp); w.appendChild(inp);
    var b=document.createElement('button'); b.type='button'; b.className='vpw-t'; b.textContent='Show'; b.setAttribute('aria-label','Show or hide password');
    b.onclick=function(){ var s=inp.type==='password'; inp.type=s?'text':'password'; b.textContent=s?'Hide':'Show'; inp.focus(); };
    w.appendChild(b);
    if(inp.getAttribute('autocomplete')==='current-password'){
      var f=document.createElement('div'); f.className='vpw-f'; f.innerHTML='<a>Forgot password?</a>';
      f.firstChild.onclick=function(){ forgot(inp); }; w.parentNode.insertBefore(f,w.nextSibling);
    }
  }
  async function forgot(inp){
    var scope=inp.closest('form,.c,.box,.card,div')||document, em=null, all=document.querySelectorAll('input[type=email],input[autocomplete=username]');
    for(var i=0;i<all.length;i++){ if(scope.contains(all[i])){ em=all[i]; break; } } if(!em&&all.length) em=all[0];
    var email=(em&&em.value||'').trim();
    if(!email){ email=(prompt('Enter the email address of your account. We will send you a link to choose a new password.')||'').trim(); }
    if(!email) return; var c=client(); if(!c) return toast('Cannot reach the server. Try again.',true);
    var r=await c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/reset.html'});
    if(r.error) toast(r.error.message,true); else toast('If that email has an account, a reset link is on its way. Check your inbox and spam folder.');
  }
  function scan(){ document.querySelectorAll('input[type=password]').forEach(function(i){ if(!i.closest('.vpw-wrap')&&!i.dataset.nopw) wrap(i); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan); else scan();
  new MutationObserver(function(){ scan(); }).observe(document.documentElement,{childList:true,subtree:true});
})();
