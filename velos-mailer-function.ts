// VELOS MAILER FUNCTION. Paste ALL of this into Supabase > Edge Functions > velos-mailer (the code editor), then Deploy.
// It sends the automatic emails (approvals, payment receipts, fee receipts, birthdays) from info@thevelosgroup.com.
// Secrets to add first (Edge Functions > Secrets): SMTP_USER, SMTP_PASS  (and optionally SMTP_HOST, SMTP_PORT, MAIL_FROM_NAME).
import { createClient } from "npm:@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-velos-secret" };
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

const SITE = "https://thevelosgroup.com";
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const ugx = (n: unknown) => "UGX " + Math.round(Number(n) || 0).toLocaleString("en-US");
const ROLE: Record<string, string> = { rider: "Rider", agent: "Sales Agent", technician: "Technician", restaurant: "Restaurant partner", vendor: "Restaurant partner", partner: "Velos Partner", security: "Security partner" };
const PORTAL: Record<string, string> = { rider: "rider.html", agent: "agent.html", technician: "partner.html", restaurant: "restaurant.html", vendor: "restaurant.html", partner: "vendor.html" };
const fdate = (d?: string) => { try { return new Date(d || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "Africa/Kampala" }); } catch { return ""; } };
const stampDate = (d?: string) => { try { return new Date(d || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Kampala" }).toUpperCase(); } catch { return ""; } };

function layout(title: string, inner: string, opts: { accent?: string; top?: string } = {}) {
  const gold = opts.accent || "#e8c766";
  return `<!doctype html><html><body style="margin:0;background:#eef0f7;font-family:Arial,Helvetica,sans-serif;color:#1e2332">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f7;padding:24px 10px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(8,13,31,.12)">
<tr><td style="background:#080d1f;padding:22px 26px"><table width="100%"><tr><td><img src="${SITE}/logo-mark.png" alt="The Velos Group" height="46" style="display:block;height:46px"></td><td align="right" style="color:${gold};font-size:12px;letter-spacing:3px;font-weight:bold">${esc(opts.top || "THE VELOS GROUP")}</td></tr></table></td></tr>
<tr><td style="background:${gold};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:30px 28px 10px"><h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:26px;color:#080d1f">${title}</h1>${inner}</td></tr>
<tr><td style="padding:18px 28px 28px"><p style="margin:0;color:#4a5268;font-size:14px;line-height:1.6">With appreciation,<br><b style="color:#080d1f">The Velos Group</b><br><span style="color:#6a7179">Anything. Anywhere. Precisely.</span></p></td></tr>
<tr><td style="background:#080d1f;padding:18px 26px;color:#a9b4d6;font-size:12px;line-height:1.7;text-align:center">The Velos Group · Uganda<br><a href="mailto:info@thevelosgroup.com" style="color:#e8c766">info@thevelosgroup.com</a> · <a href="${SITE}" style="color:#e8c766">thevelosgroup.com</a><br>This is an automatic message from Velos. Please keep it for your records.</td></tr>
</table></td></tr></table></body></html>`;
}
const p = (t: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#2b3147">${t}</p>`;
const btn = (href: string, label: string) => `<p style="margin:18px 0"><a href="${href}" style="display:inline-block;background:#080d1f;color:#e8c766;text-decoration:none;font-weight:bold;padding:13px 24px;border-radius:99px;font-size:15px">${label}</a></p>`;
const rows = (r: [string, string][]) => `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e3e6f1;border-radius:10px;overflow:hidden;margin:6px 0 16px">${r.map((x, i) => `<tr style="background:${i % 2 ? "#ffffff" : "#f6f7fb"}"><td style="padding:11px 14px;color:#6a7179;font-size:13px;width:38%">${esc(x[0])}</td><td style="padding:11px 14px;font-size:14px;font-weight:bold;color:#1e2332">${esc(x[1])}</td></tr>`).join("")}</table>`;
const seal = (label: string, date?: string) => `<table role="presentation" align="right" style="margin:-4px 0 10px 10px"><tr><td style="width:116px;height:116px;border:3px double #1b2f86;border-radius:58px;text-align:center;color:#1b2f86;font-family:Georgia,serif;transform:rotate(-7deg)"><div style="font-size:9px;letter-spacing:2px;font-weight:bold">THE VELOS GROUP</div><div style="font-size:19px;font-weight:bold;margin:3px 0;border-top:2px solid #1b2f86;border-bottom:2px solid #1b2f86;padding:2px 0">${esc(label)}</div><div style="font-size:10px;font-family:Courier New,monospace;font-weight:bold">${esc(stampDate(date))}</div><div style="font-size:8px;letter-spacing:1px">KAMPALA · UGANDA</div></td></tr></table>`;

function approved(d: any) {
  const r = String(d.role || "partner"), role = ROLE[r] || "Partner", name = esc(d.name || "there");
  const next: Record<string, string> = {
    rider: "Open the rider app, go online, and accept your first delivery. Always wear your Velos ID and keep photo proof of every pick-up and drop-off.",
    agent: "Sign in to your agent portal to find your personal sales link and ID. Share your link and earn commission on every completed sale. Commission is paid monthly.",
    technician: "Sign in to the partner app to receive verified jobs. Upload your passport photo and signature so we can issue your Velos ID card.",
    restaurant: "Sign in to your restaurant dashboard to manage orders, bookings and menu availability. Keep prep times honest: customers rely on them.",
    partner: "Your store is live on the Velos marketplace. Sign in to manage your products, promotions and orders. Customers pay Velos, and we pay you after delivery, minus our commission.",
  };
  return { subject: `Welcome to The Velos Group: you are approved`, html: layout(`Congratulations, ${name}`, seal("APPROVED") + p(`We are delighted to confirm that your application as a <b>${esc(role)}</b> with The Velos Group has been <b>verified and approved</b>.`) + p(esc(next[r] || next.partner)) + p(`<b>How to sign in:</b> open your dashboard below and sign in with the email you registered with, or with your registered phone number. If you forget your password, tap <i>Forgot password?</i> and we will email you a link.`) + (d.attach_path ? p(`Your <b>signed agreement</b> is attached to this email as a PDF. Please keep it safe.`) : "") + btn(`${SITE}/${PORTAL[r] || "index.html"}`, "Open my dashboard") + p("If anything is unclear, reply to this email or contact us on WhatsApp. We are glad to have you with us."), { top: "OFFICIAL APPROVAL" }) };
}
function payment(d: any) {
  const role = ROLE[String(d.role)] || "Partner", name = esc(d.name || "Partner");
  const note = d.note ? p(`<i>${esc(d.note)}</i>`) : p(`Thank you for your work with The Velos Group. Your effort and reliability help us serve customers across East Africa, and we truly appreciate it.`);
  return { subject: `Payment receipt ${d.receipt_no || ""}: ${ugx(d.amount)}`, html: layout(`Payment receipt`, seal("PAID", d.paid_at) + p(`Dear ${name},`) + p(`The Velos Group has paid you. Here are the details for your records.`) + rows([["Receipt no.", String(d.receipt_no || "-")], ["Paid to", `${d.name || ""} (${role})`], ["Amount paid", ugx(d.amount)], ["Reference", String(d.reference || "-")], ["Date", fdate(d.paid_at)], ["Status", "PAID"]]) + note + p(`You can see all your payments in your Velos dashboard.`), { top: "PAYMENT RECEIPT" }) };
}
function feeReceipt(d: any) {
  const monthly = d.fee_kind === "monthly", name = esc(d.name || "Partner");
  return { subject: `Receipt ${d.receipt_no}: ${monthly ? "monthly fee" : "registration fee"} received`, html: layout(`Thank you, we have received your payment`, seal("RECEIVED", d.paid_at) + p(`Dear ${name},`) + p(`This confirms that The Velos Group has received your ${monthly ? "monthly maintenance fee" : "one-time registration fee"}.`) + rows([["Receipt no.", String(d.receipt_no || "-")], ["Received from", String(d.name || "")], ["For", monthly ? `Monthly fee${d.period ? " (" + d.period + ")" : ""}` : "One-time registration fee"], ["Amount received", ugx(d.amount)], ["Reference", String(d.reference || "-")], ["Date", fdate(d.paid_at)], ["Status", "PAID IN FULL"]]) + p(`Your fee keeps your account active and supports marketing, maintenance and customer support. You can download your stamped, signed PDF receipt any time from your dashboard under <b>My receipts</b>.`), { top: "OFFICIAL RECEIPT" }) };
}
function birthday(d: any) {
  const name = esc(String(d.name || "friend").split(" ")[0]);
  const conf = "🎉 🎊 🎈 🎂 🎈 🎊 🎉";
  return { subject: `Happy birthday, ${String(d.name || "").split(" ")[0] || "friend"}! 🎂`, html: layout(`Happy birthday, ${name}!`, `<div style="text-align:center;font-size:30px;letter-spacing:6px;margin:0 0 12px">${conf}</div><div style="background:linear-gradient(135deg,#fff4d6,#ffe1ef);border-radius:14px;padding:24px;text-align:center;margin:0 0 16px"><div style="font-size:54px">🎂</div><p style="font-family:Georgia,serif;font-size:22px;color:#080d1f;margin:8px 0">Today is all about you.</p><p style="margin:0;color:#4a5268;font-size:15px;line-height:1.6">Everyone at The Velos Group is celebrating you. Thank you for being part of our family and for everything you do.</p></div>` + p(`We wish you good health, joy and success in the year ahead. Enjoy your day!`) + `<div style="text-align:center;font-size:26px;letter-spacing:6px">🎈 🎁 🎈 🎁 🎈</div>`, { accent: "#ff9fd0", top: "HAPPY BIRTHDAY" }) };
}
function render(row: any) {
  const d = row.data || {};
  if (row.kind === "approved") return approved(d);
  if (row.kind === "payment") return payment(d);
  if (row.kind === "fee_receipt") return feeReceipt(d);
  if (row.kind === "birthday") return birthday(d);
  return { subject: row.subject, html: layout(esc(row.subject), p(esc(d.message || ""))) };
}

async function sendBatch() {
  const user = Deno.env.get("SMTP_USER"), pass = Deno.env.get("SMTP_PASS");
  if (!user || !pass) return { sent: 0, error: "SMTP_USER and SMTP_PASS secrets are not set yet." };
  const { data } = await db.rpc("velos_email_take", { p_n: 20 });
  const rowsQ = (data || []) as any[];
  if (!rowsQ.length) return { sent: 0 };
  const client = new SMTPClient({ connection: { hostname: Deno.env.get("SMTP_HOST") || "smtp.spacemail.com", port: Number(Deno.env.get("SMTP_PORT") || 465), tls: true, auth: { username: user, password: pass } } });
  let sent = 0;
  const from = `${Deno.env.get("MAIL_FROM_NAME") || "The Velos Group"} <${user}>`;
  for (const row of rowsQ) {
    try {
      const m = render(row);
      let attachments: any[] | undefined;
      try { const d0 = row.data || {}; if (d0.attach_path && d0.attach_bucket) { const f = await db.storage.from(String(d0.attach_bucket)).download(String(d0.attach_path)); if (f.data) attachments = [{ filename: "Velos-Signed-Agreement.pdf", content: new Uint8Array(await f.data.arrayBuffer()), contentType: "application/pdf", encoding: "binary" }]; } } catch { /* send without the attachment */ }
      await client.send({ from, to: row.to_name ? `${String(row.to_name).replace(/[<>",]/g, "")} <${row.to_email}>` : row.to_email, subject: m.subject, content: "Please view this email in an HTML-capable mail app.", html: m.html, replyTo: "info@thevelosgroup.com", ...(attachments ? { attachments } : {}) });
      await db.rpc("velos_email_mark", { p_id: row.id, p_ok: true, p_err: null });
      sent++;
    } catch (e) {
      await db.rpc("velos_email_mark", { p_id: row.id, p_ok: false, p_err: String((e as Error).message || e) });
    }
  }
  try { await client.close(); } catch { /* ignore */ }
  return { sent };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { data: s } = await db.from("push_config").select("value").eq("key", "hook_secret").maybeSingle();
    if (!s || req.headers.get("x-velos-secret") !== s.value) return json({ error: "forbidden" }, 403);
    let body: any = {}; try { body = await req.json(); } catch { /* empty */ }
    if (body.job === "daily") { const { data } = await db.rpc("velos_daily_jobs"); const r = await sendBatch(); return json({ birthdays: data, ...r }); }
    return json(await sendBatch());
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
