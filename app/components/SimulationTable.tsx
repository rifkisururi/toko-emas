import { SimulationRow } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

type Props = {
  rows: SimulationRow[];
};

export default function SimulationTable({ rows }: Props) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-soft">
      <h3 className="text-base font-semibold text-ink">Rincian Angsuran</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div
            key={row.tenor}
            className="rounded-xl border border-emerald/10 bg-emerald/5 p-4 text-sm"
          >
            <div className="flex items-center justify-between text-xs text-ink/60">
              <span>Tenor</span>
              <span>{row.tenor} bulan</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-ink/60">Angsuran/Bulan</span>
              <span className="text-sm font-semibold text-emerald">
                {formatRupiah(row.monthlyInstallment)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-ink/60">
              <span>Total Bayar</span>
              <span>{formatRupiah(row.totalPay)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-ink/60">
              <span>Admin</span>
              <span>{formatRupiah(row.adminFee)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-ink/60">
              <span>Materai</span>
              <span>{formatRupiah(row.stampDuty)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
