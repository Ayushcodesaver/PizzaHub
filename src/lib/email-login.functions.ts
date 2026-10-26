import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const emailSchema = z.object({ email: z.string().trim().toLowerCase().email().max(255) });

export const sendLoginCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => emailSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
    const RESEND_API_KEY = process.env["RESEND_API_KEY"];
    if (!LOVABLE_API_KEY || !RESEND_API_KEY) return { ok: false, error: "Email service is not configured." };

    // Basic throttle: max 1 code per 45s per email.
    const { data: recent } = await supabaseAdmin
      .from("email_login_codes")
      .select("created_at")
      .eq("email", data.email)
      .gte("created_at", new Date(Date.now() - 45_000).toISOString())
      .limit(1);
    if (recent && recent.length) return { ok: false, error: "Please wait a moment before requesting another code." };

    const code = String((crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) % 1_000_000).padStart(6, "0");
    await supabaseAdmin.from("email_login_codes").insert({
      email: data.email,
      code_hash: await sha256(`${data.email}:${code}`),
      expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
    });

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Subday Pizza <onboarding@resend.dev>",
        to: [data.email],
        subject: `${code} is your Subday Pizza login code`,
        html: `<div style="font-family:sans-serif;max-width:420px;margin:auto;padding:24px;background:#FFF7EC;border-radius:16px">
          <h2 style="color:#D94335;margin:0 0 8px">Subday Pizza</h2>
          <p style="color:#242320">Your login code is:</p>
          <p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#242320">${code}</p>
          <p style="color:#74736D;font-size:13px">It expires in 10 minutes. If you didn't request it, ignore this email.</p></div>`,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`Resend failed [${res.status}]: ${body}`);
      return { ok: false, error: `Could not send email (${res.status}). ${body.slice(0, 200)}` };
    }
    return { ok: true as const };
  });

export const verifyLoginCode = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    emailSchema.extend({ code: z.string().regex(/^\d{6}$/) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("email_login_codes")
      .select("*")
      .eq("email", data.email)
      .order("created_at", { ascending: false })
      .limit(1);
    const row = rows?.[0];
    if (!row || new Date(row.expires_at) < new Date()) return { ok: false, error: "Code expired. Request a new one." };
    if (row.attempts >= 5) return { ok: false, error: "Too many attempts. Request a new code." };
    if (row.code_hash !== (await sha256(`${data.email}:${data.code}`))) {
      await supabaseAdmin.from("email_login_codes").update({ attempts: row.attempts + 1 }).eq("id", row.id);
      return { ok: false, error: "That code is not correct." };
    }
    await supabaseAdmin.from("email_login_codes").delete().eq("email", data.email);

    // Ensure the account exists, then mint a one-time sign-in token.
    await supabaseAdmin.auth.admin.createUser({ email: data.email, email_confirm: true }).catch(() => null);
    const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email: data.email });
    if (error || !link.properties?.hashed_token) return { ok: false, error: "Could not sign you in. Try again." };
    return { ok: true as const, tokenHash: link.properties.hashed_token };
  });
