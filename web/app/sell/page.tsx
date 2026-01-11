"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

function isUWaterlooEmail(email: string) {
  return email.toLowerCase().endsWith("@uwaterloo.ca");
}

export default function AuthPage() {
  const supabase = createSupabaseBrowserClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const trimmed = email.trim();
    if (!trimmed || !password) return setMessage("Enter email and password.");
    if (!isUWaterlooEmail(trimmed)) return setMessage("Only @uwaterloo.ca emails are allowed.");

    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email: trimmed, password });
      setLoading(false);
      if (error) return setMessage(error.message);

      setMessage("Signup successful. You can log in now.");
      setMode("login");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password });
    setLoading(false);
    if (error) return setMessage(error.message);

    // refresh server components (Header/feed) so they re-read cookies
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">UW Marketplace</h1>
        <p className="mt-2 text-sm text-gray-600">
          Use your <span className="font-medium">@uwaterloo.ca</span> email.
        </p>

        <div className="mt-4 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-xl border px-3 py-1.5 ${mode === "login" ? "font-medium" : ""}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-xl border px-3 py-1.5 ${mode === "signup" ? "font-medium" : ""}`}
          >
            Signup
          </button>
        </div>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="email"
            placeholder="you@uwaterloo.ca"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full rounded-xl border px-3 py-2 font-medium" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>

          {message && <p className="text-sm text-gray-700">{message}</p>}
        </form>
      </div>
    </main>
  );
}
