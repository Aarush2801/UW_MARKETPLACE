"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function isUWaterlooEmail(email: string) {
  return email.toLowerCase().endsWith("@uwaterloo.ca");
}

export default function AuthPage() {
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Enter your Waterloo email.");
      return;
    }
    if (!isUWaterlooEmail(trimmed)) {
      setStatus("error");
      setMessage("Only @uwaterloo.ca emails are allowed.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
    setMessage("Magic link sent. Check your inbox.");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">UW Marketplace</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in with your <span className="font-medium">@uwaterloo.ca</span> email.
        </p>

        <form className="mt-6 space-y-3" onSubmit={sendMagicLink}>
          <input
            className="w-full rounded-xl border px-3 py-2"
            type="email"
            placeholder="you@uwaterloo.ca"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full rounded-xl border px-3 py-2 font-medium"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Send magic link"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-gray-700"}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
