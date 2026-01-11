import Link from "next/link";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

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

        {user ? (
          <>
            <span className="text-gray-600">{user.email}</span>
            <Link className="rounded-xl border px-3 py-1.5" href="/auth/logout">
              Log out
            </Link>
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
