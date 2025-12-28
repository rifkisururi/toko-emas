import Link from "next/link";
import { getProductById, getSettings } from "@/lib/db";
import { formatGram, formatRupiah } from "@/lib/format";
import ProductSimulationPanel from "./ProductSimulationPanel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductById(slug);
  const settings = await getSettings();

  if (!settings) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink">
          Pengaturan cicilan belum tersedia
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Admin perlu melengkapi pengaturan terlebih dahulu.
        </p>
      </section>
    );
  }

  const minDp = product ? (settings.dpMin / 100) * product.price : 0;

  if (!product) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-ink">Produk tidak ditemukan</h1>
        <Link href="/catalog" className="mt-4 inline-block text-emerald">
          Kembali ke katalog
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10 pb-24">
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold text-ink/60">
            <span>{product.brand}</span>
            <span>{formatGram(product.weight)}</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-emerald/5">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-xs text-ink/40">
                Gambar belum tersedia
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-ink">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink/60">Kode: {product.code}</p>
          <p className="mt-6 text-2xl font-semibold text-emerald">
            {formatRupiah(product.price)}
          </p>
          <p className="mt-2 text-xs text-ink/50">
            Stok tersedia: {product.stock}
          </p>

          <div className="mt-6 rounded-2xl border border-emerald/10 bg-emerald/5 p-4 text-sm text-ink/70">
            <p>Sertifikat: {product.certificate ?? "Sertifikat resmi"}</p>
            <p className="mt-2">Penyimpanan aman hingga lunas.</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink">Simulasi Cepat</h2>
          <p className="mt-2 text-sm text-ink/60">
            DP minimal {formatRupiah(minDp)} dengan tenor hingga{" "}
            {settings.tenorOptions.at(-1)} bulan.
          </p>
          <ProductSimulationPanel product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
