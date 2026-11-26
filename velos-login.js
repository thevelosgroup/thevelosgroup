/* Velos sign-in helper: sign in with email OR the phone number / exact business name registered with Velos.
   VelosLogin.signIn(db, idValue, password) -> same result shape as db.auth.signInWithPassword
   VelosLogin.signUp(db, email, password)   -> same as db.auth.signUp, with a clear message when the email already has a login */
(function (W) {
  async function resolve(db, v) {
    v = String(v || '').trim(); if (v.indexOf('@') > -1) return v;
    var r = await db.rpc('login_email_for', { p_id: v });
    if (r.error) throw new Error(/function|schema cache/i.test(r.error.message) ? 'Please sign in with your email address for now.' : r.error.message);
    if (!r.data) throw new Error('We could not find an account with that phone number or name. Try your email address.');
    return r.data;
  }
  async function signIn(db, id, pw) {
    var email; try { email = await resolve(db, id); } catch (e) { return { data: null, error: { message: e.message } }; }
    var r = await db.auth.signInWithPassword({ email: email, password: pw });
    if (r.error && /invalid login/i.test(r.error.message || '')) r.error = { message: 'The email, phone number or password is not right. Tap "Forgot password?" to choose a new one.' };
    return r;
  }
  async function signUp(db, email, pw) {
    email = String(email || '').trim();
    if (email.indexOf('@') < 0) return { data: null, error: { message: 'To create a login, type your email address.' } };
    var r = await db.auth.signUp({ email: email, password: pw });
    if (!r.error && r.data && r.data.user && Array.isArray(r.data.user.identities) && r.data.user.identities.length === 0) return { data: r.data, error: { message: 'This email already has a login. Tap Sign in, or "Forgot password?" to choose a new password.' } };
    return r;
  }
  W.VelosLogin = { signIn: signIn, signUp: signUp, resolve: resolve };
})(window);
