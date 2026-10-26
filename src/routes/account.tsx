import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Subday Pizza" },
      { name: "description", content: "Your Subday Pizza account details." },
      { property: "og:title", content: "My account — Subday Pizza" },
      { property: "og:description", content: "Your Subday Pizza account details." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const user = useSessionUser();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-[2rem] bg-card p-8 shadow-card fade-up">
        <p className="text-4xl">🍕</p>
        <h1 className="mt-3 text-3xl font-extrabold">My account</h1>
        <p className="mt-1 text-muted-foreground">You're signed in to Subday Pizza.</p>

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
          <Mail className="size-4 text-muted-foreground" aria-hidden />
          <span className="truncate text-sm font-semibold">{user?.email ?? "Loading…"}</span>
        </div>

        <Button variant="hero" size="xl" className="mt-6 w-full" asChild>
          <Link to="/menu">Browse the menu</Link>
        </Button>
        <Button variant="soft" size="xl" className="mt-3 w-full" onClick={signOut}>
          <LogOut /> Sign out
        </Button>
      </div>
    </div>
  );
}
