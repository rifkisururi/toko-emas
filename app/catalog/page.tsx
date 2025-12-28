import { getProducts } from "@/lib/db";
import ProductCard from "../components/ProductCard";

export default async function CatalogPage() {
  const products = await getProducts();
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 pb-24">
      <div>
        <h1 className="text-3xl font-semibold text-ink">Katalog Emas 24K</h1>
        <p className="mt-2 text-sm text-ink/60">
          Filter produk Antam & UBS sesuai berat dan harga.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-xs">
        {["Antam", "UBS", "0.5g-5g", "10g-50g", "100g+"].map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-emerald/20 bg-emerald/5 px-3 py-1 text-emerald"
          >
            {filter}
          </span>
        ))}
      </div>
      {products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/70 bg-white/70 p-6 text-sm text-ink/60">
          Produk belum tersedia. Silakan tunggu admin memperbarui katalog.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
