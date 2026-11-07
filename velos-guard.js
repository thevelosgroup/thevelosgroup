/* Velos Guard: Cloudflare Turnstile bot check for sign-up, sign-in and password reset.
   - Load it right after supabase-config.js and BEFORE the page script that calls supabase.createClient.
   - It stays switched OFF until you put your Turnstile *site key* in velos-guard-config.js.
   - When ON, every sign-in / sign-up / reset sends a fresh Turnstile token to Supabase, which checks it
     (Supabase > Authentication > Bot and Abuse Protection > Enable CAPTCHA, provider Turnstile + secret key).
   - Real people almost never see a puzzle: the check runs quietly and only asks when it is unsure. */
(function(){ var W = window, D = document;
  var KEY = function(){ return (W.VELOS_GUARD && W.VELOS_GUARD.siteKey) || ''; };
  var loading = null, wid = null, box = null;
  function load(){ if(loading) return loading;
    loading = new Promise(function(ok, no){ if(W.turnstile) return ok();
      var s = D.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true; s.defer = true;
      s.onload = function(){ ok(); }; s.onerror = function(){ loading = null; no(new Error('Could not load the security check. Check your internet and try again.')); };
      D.head.appendChild(s); });
    return loading; }
  function holder(){ if(box) return box; box = D.createElement('div'); box.id = 'vg-box';
    box.style.cssText = 'position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:2147483000;display:none;padding:10px;background:#0b1226;border:1px solid #2a3560;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.5)';
    (D.body || D.documentElement).appendChild(box); return box; }
  /* get one fresh token (single use) */
  function token(){ if(!KEY()) return Promise.resolve(null);
    return load().then(function(){ return new Promise(function(ok, no){ var b = holder(), done = false;
      var finish = function(fn, v){ if(done) return; done = true; b.style.display = 'none'; try{ W.turnstile.remove(wid); }catch(e){} wid = null; fn(v); };
      b.innerHTML = ''; b.style.display = 'block';
      /* "interaction-only" keeps the box invisible unless the visitor must tick it */
      var shown = setTimeout(function(){ if(!done) b.style.display = 'block'; }, 0);
      wid = W.turnstile.render(b, { sitekey: KEY(), appearance: 'interaction-only', theme: 'dark',
        callback: function(t){ clearTimeout(shown); finish(ok, t); },
        'error-callback': function(){ clearTimeout(shown); finish(no, new Error('Security check failed. Refresh the page and try again.')); },
        'timeout-callback': function(){ clearTimeout(shown); finish(no, new Error('Security check timed out. Try again.')); },
        'before-interactive-callback': function(){ b.style.display = 'block'; },
        'after-interactive-callback': function(){ b.style.display = 'none'; } });
      setTimeout(function(){ if(!done && b.firstChild && b.offsetHeight < 20) b.style.display = 'none'; }, 400);
      setTimeout(function(){ finish(no, new Error('Security check took too long. Try again.')); }, 45000); }); }); }

  function guard(client){ if(!client || !client.auth || client.auth.__vg) return client; client.auth.__vg = 1;
    var wrap = function(name, build){ var orig = client.auth[name]; if(typeof orig !== 'function') return;
      client.auth[name] = function(a, b){ var self = this;
        if(!KEY()) return orig.call(self, a, b);
        return token().then(function(t){ return build(orig, self, a, b, t); }, function(e){ return { data: { user: null, session: null }, error: { message: e.message } }; }); }; };
    wrap('signInWithPassword', function(orig, self, a, b, t){ a = Object.assign({}, a); a.options = Object.assign({}, a.options, { captchaToken: t }); return orig.call(self, a); });
    wrap('signUp', function(orig, self, a, b, t){ a = Object.assign({}, a); a.options = Object.assign({}, a.options, { captchaToken: t }); return orig.call(self, a); });
    wrap('resetPasswordForEmail', function(orig, self, email, opts, t){ return orig.call(self, email, Object.assign({}, opts, { captchaToken: t })); });
    return client; }

  /* make every supabase.createClient() in the page protected, without editing each page */
  function patch(){ if(!W.supabase || !W.supabase.createClient || W.supabase.__vg) return; W.supabase.__vg = 1; var cc = W.supabase.createClient;
    W.supabase.createClient = function(){ return guard(cc.apply(this, arguments)); }; }
  patch(); D.addEventListener('DOMContentLoaded', patch);
  W.VelosGuard = { token: token, guard: guard, on: function(){ return !!KEY(); } };
})();
