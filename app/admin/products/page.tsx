"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    code: "",
    name: "",
    brand: "Antam",
    weight: 1,
    price: 0,
    imageUrl: "",
    certificate: "",
    stock: 0
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const loadProducts = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const response = await fetch("/api/admin/products", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error ?? "Gagal memuat produk.");
      return;
    }
    setProducts(payload.data ?? []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const payload = {
      code: form.code,
      name: form.name,
      brand: form.brand,
      weight: Number(form.weight),
      price: Number(form.price),
      image_url: form.imageUrl || null,
      certificate: form.certificate || null,
      stock: Number(form.stock)
    };

    const response = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Gagal menyimpan produk.");
      return;
    }

    setForm({
      code: "",
      name: "",
      brand: "Antam",
      weight: 1,
      price: 0,
      imageUrl: "",
      certificate: "",
      stock: 0
    });
    setEditingId(null);
    setIsOpen(false);
    loadProducts();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      code: product.code,
      name: product.name,
      brand: product.brand,
      weight: product.weight,
      price: product.price,
      imageUrl: product.imageUrl ?? "",
      certificate: product.certificate ?? "",
      stock: product.stock ?? 0
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    setError("");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error ?? "Gagal menghapus produk.");
      return;
    }
    loadProducts();
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Produk</h1>
          <p className="mt-2 text-sm text-ink/60">
            CRUD produk emas Antam & UBS.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white"
          onClick={() => {
            setEditingId(null);
            setForm({
              code: "",
              name: "",
              brand: "Antam",
              weight: 1,
              price: 0,
              imageUrl: "",
              certificate: "",
              stock: 0
            });
            setIsOpen(true);
          }}
        >
          Tambah Produk
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6 py-10">
          <div className="w-full max-w-2xl rounded-3xl border border-white/60 bg-white/95 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <button
                type="button"
                className="rounded-full border border-emerald/30 px-3 py-1 text-xs text-emerald"
                onClick={() => setIsOpen(false)}
              >
                Tutup
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  Kode Produk
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.code}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, code: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="text-sm">
                  Nama Produk
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                  />
                </label>
                <label className="text-sm">
                  Merek
                  <select
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.brand}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, brand: event.target.value }))
                    }
                  >
                    <option value="Antam">Antam</option>
                    <option value="UBS">UBS</option>
                  </select>
                </label>
                <label className="text-sm">
                  Berat (gram)
                  <input
                    type="number"
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.weight}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        weight: Number(event.target.value)
                      }))
                    }
                    min={0.5}
                    step={0.5}
                    required
                  />
                </label>
                <label className="text-sm">
                  Harga
                  <input
                    type="number"
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        price: Number(event.target.value)
                      }))
                    }
                    required
                  />
                </label>
                <label className="text-sm">
                  Stok Awal
                  <input
                    type="number"
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.stock}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: Number(event.target.value)
                      }))
                    }
                    min={0}
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  URL Gambar
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.imageUrl}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                    }
                  />
                </label>
                <label className="text-sm md:col-span-2">
                  Sertifikat
                  <input
                    className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
                    value={form.certificate}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, certificate: event.target.value }))
                    }
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white"
                >
                  {editingId ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="rounded-full border border-emerald/40 px-6 py-3 text-sm font-semibold text-emerald"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        code: "",
                        name: "",
                        brand: "Antam",
                        weight: 1,
                        price: 0,
                        imageUrl: "",
                        certificate: "",
                        stock: 0
                      });
                      setIsOpen(false);
                    }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-ink">{product.name}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {product.brand} - {product.code}
                </p>
              </div>
              <div className="text-right text-sm text-ink/70">
                <p>{formatRupiah(product.price)}</p>
                <p>Stok: {product.stock}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-emerald/40 px-4 py-2 text-emerald"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-red-300 px-4 py-2 text-red-500"
                onClick={() => handleDelete(product.id)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
