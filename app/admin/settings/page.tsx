"use client";

import { useEffect, useState } from "react";
import { CicilanSettings } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { supabase } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CicilanSettings | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("/api/admin/settings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Gagal memuat pengaturan.");
        return;
      }
      setSettings(payload.data ?? null);
    };

    load();
  }, []);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-10 pb-24">
      <h1 className="text-3xl font-semibold text-ink">Pengaturan Cicilan</h1>
      <p className="mt-2 text-sm text-ink/60">
        Atur margin, materai, DP, tenor, dan denda keterlambatan.
      </p>
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      {!settings ? (
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-ink/60">
          Pengaturan belum tersedia.
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">Margin tahunan</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {settings.marginAnnual * 100}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">Biaya admin</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {settings.adminFeeRate * 100}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">Materai</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {formatRupiah(settings.stampDuty)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">DP min/max</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {settings.dpMin}% - {settings.dpMax}%
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">Tenor</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {settings.tenorOptions.join(", ")} bulan
            </p>
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm text-ink/60">Denda harian</p>
            <p className="mt-2 text-xl font-semibold text-ink">
              {settings.lateFeeDaily * 100}% / hari
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
