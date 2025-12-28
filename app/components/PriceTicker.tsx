import { formatRupiah } from "@/lib/format";

type Props = {
  antam: number;
  ubs: number;
  updatedAt: string;
};

export default function PriceTicker({ antam, ubs, updatedAt }: Props) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
          Harga Emas Live
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald/20 bg-emerald/5 p-4">
            <p className="text-sm font-semibold text-ink">Antam</p>
            <p className="mt-2 text-2xl font-semibold text-emerald">
              {formatRupiah(antam)} / gram
            </p>
          </div>
          <div className="rounded-xl border border-gold/20 bg-gold/10 p-4">
            <p className="text-sm font-semibold text-ink">UBS</p>
            <p className="mt-2 text-2xl font-semibold text-gold">
              {formatRupiah(ubs)} / gram
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink/50">
          Update terakhir: {updatedAt}
        </p>
      </div>
    </section>
  );
}
