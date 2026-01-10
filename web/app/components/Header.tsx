"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";


export default function Header() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-semibold">
        UW Marketplace
      </Link>

      <nav className="flex items-center gap-3 text-sm">
        <Link className="rounded-xl border px-3 py-1.5" href="/">
          Feed
        </Link>
        <Link className="rounded-xl border px-3 py-1.5" href="/sell">
          Sell
        </Link>

        {email ? (
          <>
            <span className="text-gray-600">{email}</span>
            <button
              onClick={logout}
              className="rounded-xl border px-3 py-1.5"
            >
              Log out
            </button>
          </>
        ) : (
          <Link className="rounded-xl border px-3 py-1.5" href="/auth">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
