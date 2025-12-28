"use client";

import { useEffect, useMemo, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { CicilanSettings, Product } from "@/lib/types";

type Props = {
  initialProductId?: string;
  hideProductSelect?: boolean;
  hideHeader?: boolean;
  layout?: "grid" | "stack";
  hideSummary?: boolean;
  products: Product[];
  settings: CicilanSettings;
  onValuesChange?: (values: { dpAmount: number; tenor: number }) => void;
};

export default function SimulationForm({
  initialProductId,
  hideProductSelect,
  hideHeader,
  layout = "grid",
  hideSummary,
  products,
  settings,
  onValuesChange
}: Props) {
  const [productId, setProductId] = useState(
    initialProductId ?? products[0]?.id ?? ""
  );
  const [dpAmount, setDpAmount] = useState(0);
  const [tenor, setTenor] = useState(settings.tenorOptions[0] ?? 12);

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId, products]
  );
  const principal = product ? Math.max(product.price - dpAmount, 0) : 0;
  const marginTotal = product
    ? principal * settings.marginAnnual * (tenor / 12)
    : 0;
  const adminFeeAmount = product
    ? principal * settings.adminFeeRate * (tenor / 12)
    : 0;
  const acquisitionPrice = product ? product.price + marginTotal : 0;
  const totalPay = principal + marginTotal;
  const monthlyInstallment = tenor > 0 ? totalPay / tenor : 0;

  useEffect(() => {
    if (initialProductId) {
      setProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (!product) return;
    const minDp = (settings.dpMin / 100) * product.price;
    const maxDp = (settings.dpMax / 100) * product.price;
    setDpAmount((prev) => {
      if (prev === 0 || prev < minDp || prev > maxDp) return minDp;
      return prev;
    });
  }, [product, settings.dpMin, settings.dpMax]);

  useEffect(() => {
    if (!onValuesChange) return;
    onValuesChange({ dpAmount, tenor });
  }, [dpAmount, tenor, onValuesChange]);

  return (
    <div className={layout === "stack" ? "grid gap-6" : "grid gap-6"}>
      <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft">
        {!hideHeader && (
          <>
            <h2 className="text-xl font-semibold text-ink">Simulasi Cicilan</h2>
            <p className="mt-2 text-sm text-ink/60">
              Pilih produk, DP, dan tenor untuk menghitung angsuran murabahah.
            </p>
          </>
        )}

        <div className={`${hideHeader ? "mt-0" : "mt-6"} space-y-4 text-sm`}>
          {!hideProductSelect && (
            <label className="block">
              Produk
              <select
                className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3 text-sm"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
              >
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {formatRupiah(item.price)}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block">
            DP (Rp)
            <input
              type="number"
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3 text-sm"
              value={dpAmount}
              min={product ? (settings.dpMin / 100) * product.price : 0}
              max={product ? (settings.dpMax / 100) * product.price : 0}
              onChange={(event) => setDpAmount(Number(event.target.value))}
            />
            <p className="mt-1 text-xs text-ink/50">
              Min{" "}
              {product
                ? formatRupiah((settings.dpMin / 100) * product.price)
                : "-"}{" "}
              - Max{" "}
              {product
                ? formatRupiah((settings.dpMax / 100) * product.price)
                : "-"}
            </p>
          </label>

          <label className="block">
            Tenor (bulan)
            <select
              className="mt-2 w-full rounded-xl border border-emerald/20 bg-white px-4 py-3 text-sm"
              value={tenor}
              onChange={(event) => setTenor(Number(event.target.value))}
            >
              {settings.tenorOptions.map((option) => (
                <option key={option} value={option}>
                  {option} bulan
                </option>
              ))}
            </select>
          </label>
        </div>

        {product && !hideSummary && (
          <div className="mt-6 rounded-xl border border-emerald/10 bg-emerald/5 p-4 text-xs text-ink/60">
            <p>Harga perolehan emas: {formatRupiah(acquisitionPrice)}</p>
            <p>Biaya admin: {formatRupiah(adminFeeAmount)}</p>
            <p>Materai: {formatRupiah(settings.stampDuty)}</p>
            <p>
              Total biaya awal:{" "}
              {formatRupiah(dpAmount + adminFeeAmount + settings.stampDuty)}
            </p>
            <p>
              Kewajiban pembiayaan: {formatRupiah(monthlyInstallment)} / bulan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
