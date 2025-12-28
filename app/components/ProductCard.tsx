import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatGram, formatRupiah } from "@/lib/format";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden bg-emerald/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-ink/40">
            Gambar belum tersedia
          </div>
        )}
      </div>
      <div className="flex items-center justify-between bg-emerald/10 px-4 py-2 text-xs font-semibold text-ink/60">
        <span>{product.brand}</span>
        <span>{formatGram(product.weight)}</span>
      </div>
      <div className="flex flex-1 flex-col px-4 py-5">
        <h3 className="text-lg font-semibold text-ink">{product.name}</h3>
        <p className="mt-2 text-sm text-ink/60">Kode: {product.code}</p>
        <p className="mt-4 text-xl font-semibold text-emerald">
          {formatRupiah(product.price)}
        </p>
        <p className="mt-2 text-xs text-ink/50">
          Stok tersedia: {product.stock}
        </p>
        <div className="mt-5 flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-full border border-emerald/40 px-4 py-2 text-center text-xs font-semibold text-emerald transition group-hover:bg-emerald/10"
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
