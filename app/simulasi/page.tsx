import SimulationForm from "../components/SimulationForm";
import { getProducts, getSettings } from "@/lib/db";

export default async function SimulasiPage() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 pb-24">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink">
          Simulasi Cicilan Murabahah
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Hitung angsuran sesuai tenor yang kamu pilih. Harga fix saat akad.
        </p>
      </div>
      <div className="mt-8">
        {!settings || products.length === 0 ? (
          <div className="rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-ink/60">
            Data simulasi belum siap. Pastikan produk dan pengaturan cicilan sudah
            tersedia.
          </div>
        ) : (
          <SimulationForm products={products} settings={settings} />
        )}
      </div>
    </section>
  );
}
