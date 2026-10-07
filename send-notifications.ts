// Supabase Edge Function: send-notifications
// Sends queued customer messages by email (Brevo) and, if configured, SMS (Africa's Talking).
// Secrets are stored in Supabase (Edge Functions > Secrets), never in GitHub.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const BREVO = Deno.env.get('BREVO_API_KEY'), FROM = Deno.env.get('SENDER_EMAIL'), FROM_NAME = Deno.env.get('SENDER_NAME') ?? 'Velos Global';
const AT_USER = Deno.env.get('AT_USERNAME'), AT_KEY = Deno.env.get('AT_API_KEY'), AT_FROM = Deno.env.get('AT_SENDER');
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function normPhone(p: string | null): string | null {
  if (!p) return null;
  const d = p.replace(/[^\d+]/g, '');
  if (d.startsWith('+')) return d;
  if (d.startsWith('00')) return '+' + d.slice(2);
  if (d.startsWith('0')) return '+256' + d.slice(1);
  if (d.startsWith('256')) return '+' + d;
  if (d.length === 9) return '+256' + d;
  return null;
}

async function sendEmail(to: string, kind: string, ref: string, message: string) {
  const [text, link] = message.split(' Track: ');
  const label = kind === 'order' ? 'order #' + ref.slice(1) : kind === 'service' ? 'service request ' + ref : kind === 'gift' ? 'request ' + ref : 'design project ' + ref;
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#0f1730;color:#f4f1ea;border-radius:12px">
    <h2 style="color:#e8c766;font-family:Georgia,serif;margin:0 0 12px">The Velos Group</h2><p style="font-size:16px;line-height:1.5">${esc(text.replace(/^Velos: /, ''))}</p>
    ${link ? `<p><a href="${esc(link)}" style="display:inline-block;background:#e8c766;color:#080d1f;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Track your ${esc(label)}</a></p>` : ''}
    <p style="font-size:12px;color:#8a93ab">You are receiving this because you placed a request with Velos. Reply to this email or message us on WhatsApp if you need help.</p></div>`;
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST', headers: { 'api-key': BREVO!, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: FROM_NAME, email: FROM }, to: [{ email: to }], subject: `Update on your Velos ${label}`, htmlContent: html }),
  });
  if (!r.ok) throw new Error('Email: ' + (await r.text()).slice(0, 200));
}

async function sendSms(to: string, message: string) {
  const host = AT_USER === 'sandbox' ? 'api.sandbox.africastalking.com' : 'api.africastalking.com';
  const body = new URLSearchParams({ username: AT_USER!, to, message });
  if (AT_FROM) body.set('from', AT_FROM);
  const r = await fetch(`https://${host}/version1/messaging`, { method: 'POST', headers: { apiKey: AT_KEY!, accept: 'application/json', 'content-type': 'application/x-www-form-urlencoded' }, body });
  if (!r.ok) throw new Error('SMS: ' + (await r.text()).slice(0, 200));
}

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) return new Response('Unauthorized', { status: 401 });
  const { data: rows, error } = await sb.from('notifications').select('*').eq('status', 'pending').order('created_at').limit(30);
  if (error) return new Response(error.message, { status: 500 });
  const out: Record<string, number> = { sent: 0, failed: 0, skipped: 0 };
  for (const n of rows ?? []) {
    const done: string[] = []; let err = '';
    try {
      if (n.email && BREVO && FROM) { await sendEmail(n.email, n.kind, n.ref, n.message); done.push('email'); }
      const ph = normPhone(n.phone);
      if (ph && AT_KEY && AT_USER) { await sendSms(ph, n.message); done.push('sms'); }
    } catch (e) { err = String(e).slice(0, 300); }
    const hasChannel = (n.email && BREVO && FROM) || (normPhone(n.phone) && AT_KEY && AT_USER);
    const status = done.length ? 'sent' : err ? 'failed' : hasChannel ? 'failed' : 'skipped';
    await sb.from('notifications').update({ status, channels: done.join('+') || null, error: err || (status === 'skipped' ? 'No email or SMS channel available' : null), sent_at: done.length ? new Date().toISOString() : null }).eq('id', n.id);
    out[status] = (out[status] ?? 0) + 1;
  }
  return new Response(JSON.stringify(out), { headers: { 'content-type': 'application/json' } });
});
