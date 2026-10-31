// VELOS PUSH FUNCTION. Paste ALL of this into Supabase > Edge Functions > velos-push (the code editor), then Deploy.
// It sends the alerts. It makes its own secret keys the first time you press "Set up background alerts" in the Velos Admin.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const db = createClient(SB_URL, SB_SERVICE, { auth: { persistSession: false } });
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-velos-secret",
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function cfg(key: string): Promise<string | null> {
  const { data } = await db.from("push_config").select("value").eq("key", key).maybeSingle();
  return data?.value ?? null;
}
async function setCfg(key: string, value: string) {
  await db.from("push_config").upsert({ key, value });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = new URL(req.url);

    // ---- One-time setup, pressed by the admin in the Velos Admin ----
    if (url.searchParams.get("init")) {
      const userDb = createClient(SB_URL, SB_ANON, {
        global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
        auth: { persistSession: false },
      });
      const { data: isMgr } = await userDb.rpc("is_manager");
      if (!isMgr) return json({ error: "Only a Velos manager can do this." }, 403);
      let pub = await cfg("vapid_public");
      let priv = await cfg("vapid_private");
      if (!pub || !priv) {
        const k = webpush.generateVAPIDKeys();
        pub = k.publicKey; priv = k.privateKey;
        await setCfg("vapid_public", pub); await setCfg("vapid_private", priv);
      }
      await setCfg("fn_url", `${SB_URL}/functions/v1/velos-push`);
      const anon = req.headers.get("apikey"); if (anon) await setCfg("anon_key", anon);
      await db.from("settings").upsert({ key: "site_vapid_public", value: pub });
      return json({ ok: true, message: "Background alerts are set up." });
    }

    // ---- Sending (called by the database) ----
    const secret = await cfg("hook_secret");
    if (!secret || req.headers.get("x-velos-secret") !== secret) return json({ error: "Not allowed" }, 401);
    const { kind, ref, title, body, url: link } = await req.json();
    const pub = await cfg("vapid_public"), priv = await cfg("vapid_private");
    if (!pub || !priv) return json({ error: "Not set up yet" }, 400);
    webpush.setVapidDetails("https://thevelosgroup.com/", pub, priv);

    const refs = ref === "all" ? ["all"] : [String(ref), "all"];
    const { data: subs } = await db.from("push_subscriptions").select("id,endpoint,p256dh,auth").eq("kind", kind).in("ref", refs);
    const payload = JSON.stringify({ title, body, url: link, kind });
    let sent = 0, dead: string[] = [];
    await Promise.all((subs ?? []).map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload, { TTL: 3600, urgency: "high" });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) dead.push(s.id);
      }
    }));
    if (dead.length) await db.from("push_subscriptions").delete().in("id", dead);
    return json({ ok: true, sent, removed: dead.length });
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
