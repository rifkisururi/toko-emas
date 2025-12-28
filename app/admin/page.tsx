import Link from "next/link";

export default function AdminHome() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 pb-24">
      <h1 className="text-3xl font-semibold text-ink">Dashboard Admin</h1>
      <p className="mt-2 text-sm text-ink/60">
        Kelola produk, stok, dan pengaturan cicilan.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { href: "/admin/products", label: "Produk" },
          { href: "/admin/stocks", label: "Stok" },
          { href: "/admin/settings", label: "Settings Cicilan" }
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-emerald/20 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1"
          >
            <p className="text-lg font-semibold text-ink">{card.label}</p>
            <p className="mt-2 text-sm text-ink/60">
              Kelola data {card.label.toLowerCase()} secara real-time.
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
