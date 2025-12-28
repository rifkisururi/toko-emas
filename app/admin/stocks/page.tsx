"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

export default function AdminStocksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("/api/admin/products", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Gagal memuat stok.");
        return;
      }
      setProducts(payload.data ?? []);
    };

    load();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 pb-24">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Stok & Mutasi</h1>
        <p className="mt-2 text-sm text-ink/60">
          Pantau stok real-time dan riwayat mutasi.
        </p>
      </div>
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-ink">{product.name}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.stock < 5
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald/10 text-emerald"
                }`}
              >
                {product.stock < 5 ? "Low Stock" : "Aman"}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink/60">
              Stok tersedia: {product.stock}
            </p>
            <button className="mt-4 rounded-full border border-emerald/40 px-4 py-2 text-xs font-semibold text-emerald">
              Lihat Mutasi
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
