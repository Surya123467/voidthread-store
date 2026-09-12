import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/store";
import { formatINR } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="product-card group">
      <div className="image-wrap relative">
        <Image src={product.images[0]?.url || "/placeholder.svg"} alt={product.images[0]?.alt || product.name} fill sizes="(max-width:900px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 z-10 badge bg-black/70">{product.collection.split("—")[0]}</span>
      </div>
      <div className="product-meta">
        <div><div className="text-sm font-bold">{product.name}</div><div className="mt-1 text-xs text-white/45">{product.subtitle}</div></div>
        <div className="text-sm">{formatINR(product.priceInPaise)}</div>
      </div>
    </Link>
  );
}
