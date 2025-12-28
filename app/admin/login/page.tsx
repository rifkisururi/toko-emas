"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin");
      }
    };
    check();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError("Email atau password tidak valid.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
  };

  return (
    <section className="mx-auto w-full max-w-md px-6 py-16">
      <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-ink">Login Admin</h1>
        <p className="mt-2 text-sm text-ink/60">
          Masuk untuk mengelola produk, stok, dan pengaturan cicilan.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <label className="block">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block">
            Password
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
