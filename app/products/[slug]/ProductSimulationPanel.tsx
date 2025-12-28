"use client";

import { useMemo, useState } from "react";
import { CicilanSettings, Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import SimulationForm from "@/app/components/SimulationForm";

type Props = {
  product: Product;
  settings: CicilanSettings;
};

export default function ProductSimulationPanel({ product, settings }: Props) {
  const minDp = (settings.dpMin / 100) * product.price;
  const [dpAmount, setDpAmount] = useState(minDp);
  const [tenor, setTenor] = useState(settings.tenorOptions[0] ?? 12);

  const summary = useMemo(() => {
    const principal = Math.max(product.price - dpAmount, 0);
    const marginTotal =
      principal * settings.marginAnnual * (tenor / 12);
    const adminFeeAmount =
      principal * settings.adminFeeRate * (tenor / 12);
    const acquisitionPrice = product.price + marginTotal;
    const totalPay =
      principal + marginTotal;
    const monthlyInstallment = tenor > 0 ? totalPay / tenor : 0;
    const totalInitialCost = dpAmount + adminFeeAmount + settings.stampDuty;

    return {
      acquisitionPrice,
      marginTotal,
      adminFeeAmount,
      monthlyInstallment,
      totalInitialCost
    };
  }, [product.price, dpAmount, tenor, settings]);

  const waNumber = process.env.NEXT_PUBLIC_WANUMBER ?? "";
  const waMessage = encodeURIComponent(
    [
      `Hai, saya mau mengajukan cicilan emas ${product.brand.toLowerCase()} ${product.weight}g`,
      `Harga perolehan emas`,
      `${formatRupiah(summary.acquisitionPrice)}`,
      `Margin`,
      `${settings.marginAnnual * 100}% · ${formatRupiah(summary.marginTotal)}`,
      `Biaya admin`,
      `${formatRupiah(summary.adminFeeAmount)}`,
      `Materai`,
      `${formatRupiah(settings.stampDuty)}`,
      `Kewajiban pembiayaan`,
      `${formatRupiah(summary.monthlyInstallment)} / bulan`,
      `Total biaya awal`,
      `${formatRupiah(summary.totalInitialCost)}`
    ].join("\n")
  );

  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${waMessage}`
    : "#";

  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-ink">Simulasi Cicilan</h3>
        <p className="mt-2 text-sm text-ink/60">
          Pilih produk, DP, dan tenor untuk menghitung angsuran murabahah.
        </p>
      </div>
      <div className="mt-6">
        <SimulationForm
          initialProductId={product.id}
          products={[product]}
          settings={settings}
          hideProductSelect
          hideHeader
          hideSummary
          layout="stack"
          onValuesChange={({ dpAmount, tenor }) => {
            setDpAmount(dpAmount);
            setTenor(tenor);
          }}
        />
      </div>
      <div className="mt-6 rounded-2xl border border-emerald/10 bg-emerald/5 p-5 text-sm text-ink/70">
        <p className="text-base font-semibold text-ink">Rincian Biaya</p>
        <div className="mt-4 space-y-2 text-base">
          <div className="flex items-center justify-between">
            <span>Harga perolehan emas</span>
            <span className="font-semibold text-ink">
              {formatRupiah(summary.acquisitionPrice)}
            </span>
          </div>
          <div className="hidden items-center justify-between">
            <span>Margin</span>
            <span className="font-semibold text-ink">
              {settings.marginAnnual * 100}% · {formatRupiah(summary.marginTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Biaya admin</span>
            <span className="font-semibold text-ink">
              {formatRupiah(summary.adminFeeAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Materai</span>
            <span className="font-semibold text-ink">
              {formatRupiah(settings.stampDuty)}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald/20 bg-white/70 px-4 py-2 text-base font-semibold text-ink">
          <span>Kewajiban pembiayaan</span>
          <span>{formatRupiah(summary.monthlyInstallment)} / bulan</span>
        </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald/20 bg-white/70 px-4 py-3 text-base font-semibold text-emerald">
        <span>Total biaya awal</span>
        <span>{formatRupiah(summary.totalInitialCost)}</span>
      </div>
    </div>
    <a
      href={waLink}
      className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${
        waNumber
          ? "bg-emerald text-white"
          : "cursor-not-allowed bg-emerald/40 text-white/70"
      }`}
      target="_blank"
      rel="noreferrer"
    >
      Ajukan Cicilan
    </a>
    </>
  );
}
