"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CicilanSettings, Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

type Props = {
  products: Product[];
  settings: CicilanSettings;
};

export default function ApplicationForm({ products, settings }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    productId: products[0]?.id ?? "",
    dpAmount: 0,
    tenor: settings.tenorOptions[0] ?? 12
  });

  const product = useMemo(
    () => products.find((item) => item.id === form.productId),
    [form.productId, products]
  );

  const minDp = product ? (settings.dpMin / 100) * product.price : 0;
  const maxDp = product ? (settings.dpMax / 100) * product.price : 0;
  const principal = product ? Math.max(product.price - form.dpAmount, 0) : 0;
  const marginTotal = product
    ? principal * settings.marginAnnual * (form.tenor / 12)
    : 0;
  const adminFeeAmount = product
    ? principal * settings.adminFeeRate * (form.tenor / 12)
    : 0;
  const acquisitionPrice = product ? product.price + marginTotal : 0;
  const totalPay = principal + marginTotal;
  const monthlyInstallment = form.tenor > 0 ? totalPay / form.tenor : 0;

  useEffect(() => {
    if (!product) return;
    const minDpLocal = (settings.dpMin / 100) * product.price;
    const maxDpLocal = (settings.dpMax / 100) * product.price;
    setForm((prev) => ({
      ...prev,
      dpAmount:
        prev.dpAmount === 0 ||
        prev.dpAmount < minDpLocal ||
        prev.dpAmount > maxDpLocal
          ? minDpLocal
          : prev.dpAmount
    }));
  }, [product, settings.dpMin, settings.dpMax]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!product) return;
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: product.price,
        uploadUrl: "https://example.com/ktp-placeholder.png"
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Gagal mengajukan cicilan.");
      return;
    }

    setStatus("success");
    const applicationId = data.applicationId as string | undefined;
    if (applicationId) {
      router.push(`/ajukan/pembayaran/${applicationId}`);
      return;
    }
    setMessage("Pengajuan tersimpan. Tim kami akan menghubungi Anda.");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft"
    >
      <h2 className="text-xl font-semibold text-ink">Ajukan Cicilan</h2>
      <p className="mt-2 text-sm text-ink/60">
        Isi data singkat, unggah KTP, dan kami proses pengajuan Anda.
      </p>

      <div className="mt-6 space-y-4 text-sm">
        <label className="block">
          Nama Lengkap
          <input
            className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
            value={form.customerName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, customerName: event.target.value }))
            }
            required
          />
        </label>

        <label className="block">
          Nomor HP
          <input
            className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            required
          />
        </label>

        <label className="block">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            required
          />
        </label>

        <label className="block">
          Produk
          <select
            className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
            value={form.productId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, productId: event.target.value }))
            }
          >
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {formatRupiah(item.price)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            DP (Rp)
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
              value={form.dpAmount}
              min={minDp}
              max={maxDp}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  dpAmount: Number(event.target.value)
                }))
              }
            />
          </label>
          <label className="block">
            Tenor (bulan)
            <select
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3"
              value={form.tenor}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  tenor: Number(event.target.value)
                }))
              }
            >
              {settings.tenorOptions.map((option) => (
                <option key={option} value={option}>
                  {option} bulan
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {product && (
        <div className="mt-5 rounded-xl border border-emerald/10 bg-emerald/5 p-4 text-xs text-ink/60">
          <p>Harga perolehan emas: {formatRupiah(acquisitionPrice)}</p>
          <p>DP minimum: {formatRupiah(minDp)}</p>
          <p>Tenor tersedia: {settings.tenorOptions.join(", ")} bulan</p>
          <p>
            Kewajiban pembiayaan: {formatRupiah(monthlyInstallment)} / bulan
          </p>
          <p>
            Total biaya awal:{" "}
            {formatRupiah(form.dpAmount + adminFeeAmount + settings.stampDuty)}
          </p>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-sm font-semibold ${
            status === "success" ? "text-emerald" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Memproses..." : "Ajukan Cicilan"}
      </button>
    </form>
  );
}
