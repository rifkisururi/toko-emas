import Hero from "./components/Hero";
import PriceTicker from "./components/PriceTicker";
import ProductCard from "./components/ProductCard";
import { getProducts } from "@/lib/db";

const getBrandPrice = (products: { brand: string; price: number; weight: number }[], brand: string) => {
  const items = products.filter((item) => item.brand === brand);
  if (items.length === 0) return 0;
  const perGram = items.map((item) => item.price / item.weight);
  return Math.round(perGram.reduce((a, b) => a + b, 0) / perGram.length);
};

export default async function HomePage() {
  const products = await getProducts();
  const antam = getBrandPrice(products, "Antam");
  const ubs = getBrandPrice(products, "UBS");
  return (
    <div className="space-y-12 pb-20 md:pb-12">
      <Hero />
      <PriceTicker
        antam={antam}
        ubs={ubs}
        updatedAt={new Date().toLocaleString("id-ID")}
      />
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">
              Produk Unggulan
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Stok real-time untuk cicil emas cepat.
            </p>
          </div>
        </div>
        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-ink/60">
            Data produk belum tersedia. Silakan lengkapi produk di dashboard admin.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <section className="mx-auto w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-soft md:p-10">
          <h3 className="text-2xl font-semibold text-ink">
            Mengapa Cicil di Toko Emas [Nama Toko]?
          </h3>
          <div className="mt-6 grid gap-4 text-sm text-ink/70 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald/10 bg-emerald/5 p-4">
              <p className="font-semibold text-ink">Akad Murabahah</p>
              <p className="mt-2">
                Transparan, tanpa bunga, cicilan flat sesuai syariah.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald/10 bg-emerald/5 p-4">
              <p className="font-semibold text-ink">Harga Real-time</p>
              <p className="mt-2">
                Update harian Antam & UBS dari sumber resmi.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald/10 bg-emerald/5 p-4">
              <p className="font-semibold text-ink">Stok Aman</p>
              <p className="mt-2">
                Emas disimpan rapi hingga cicilan selesai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
