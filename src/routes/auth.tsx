import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { sendLoginCode, verifyLoginCode } from "@/lib/email-login.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Subday Pizza" },
      { name: "description", content: "Sign in to Subday Pizza with Google or an email code." },
      { property: "og:title", content: "Sign in — Subday Pizza" },
      { property: "og:description", content: "Sign in with Google or an email code." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const send = useServerFn(sendLoginCode);
  const verify = useServerFn(verifyLoginCode);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (r.redirected) return;
    navigate({ to: "/account" });
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await send({ data: { email } }).catch(() => ({ ok: false, error: "Something went wrong." }) as const);
    setBusy(false);
    if (!r.ok) {
      toast.error(r.error);
      return;
    }
    toast.success("Code sent — check your inbox.");
    setStep("code");
  }

  async function verifyCode() {
    setBusy(true);
    const r = await verify({ data: { email, code } }).catch(() => ({ ok: false, error: "Something went wrong." }) as const);
    if (!r.ok) {
      setBusy(false);
      toast.error(r.error);
      return;
    }
    const { error } = await supabase.auth.verifyOtp({ token_hash: r.tokenHash, type: "magiclink" });
    setBusy(false);
    if (error) {
      toast.error("Sign-in failed. Request a new code.");
      return;
    }
    toast.success("Welcome to Subday Pizza!");
    navigate({ to: "/account" });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-[2rem] bg-card p-8 shadow-card fade-up">
        <p className="text-4xl">🍕</p>
        <h1 className="mt-3 text-3xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-muted-foreground">Sign in to save your details and faster ordering.</p>

        <Button variant="soft" size="xl" className="mt-8 w-full" onClick={google}>
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.67 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.68 3.7 14.55 2.75 12 2.75 6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25c5.34 0 8.88-3.75 8.88-9.04 0-.6-.07-1.06-.15-1.51z"/></svg>
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        {step === "email" ? (
          <form onSubmit={sendCode} className="space-y-3">
            <Input type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 rounded-full px-5" aria-label="Email" />
            <Button variant="hero" size="xl" className="w-full" disabled={busy}><Mail /> {busy ? "Sending…" : "Email me a code"}</Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to <b className="text-foreground">{email}</b></p>
            <InputOTP maxLength={6} value={code} onChange={setCode} onComplete={verifyCode}>
              <InputOTPGroup className="w-full justify-between">
                {Array.from({ length: 6 }).map((_, i) => <InputOTPSlot key={i} index={i} className="size-12 text-lg" />)}
              </InputOTPGroup>
            </InputOTP>
            <Button variant="hero" size="xl" className="w-full" disabled={busy || code.length !== 6} onClick={verifyCode}>
              {busy ? "Checking…" : "Sign in"}
            </Button>
            <button className="text-sm font-semibold text-muted-foreground underline" onClick={() => { setStep("email"); setCode(""); }}>
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
