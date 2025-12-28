import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-sand to-emerald/10">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-12 pt-16 md:flex-row md:items-center md:justify-between md:pt-24">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald">
            Aman Syariah - Akad Murabahah
          </span>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-ink md:text-5xl">
            Cicil Emas 24K Mulai{" "}
            <span className="text-gold">Rp50rb</span>/bulan
          </h1>
          <p className="mt-4 text-base font-medium text-ink/70 md:text-lg">
            Simulasi cicilan instan, harga real-time Antam & UBS, dan stok
            dijaga aman hingga lunas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/catalog"
              className="rounded-full border border-emerald/40 px-6 py-3 text-center text-sm font-semibold text-emerald transition hover:bg-emerald/10"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
        <div className="glass w-full rounded-3xl border border-white/60 p-6 shadow-soft md:max-w-sm">
          <h3 className="text-lg font-semibold text-ink">
            Keunggulan Cicil Emas
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-ink/70">
            <li>Harga fix saat akad, cicilan flat.</li>
            <li>Emas disimpan aman sampai lunas.</li>
            <li>Bisa digadaikan untuk kebutuhan mendesak.</li>
            <li>Proses cepat & transparan.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
