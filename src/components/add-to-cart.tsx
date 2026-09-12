"use client";

import { useState } from "react";
import type { Product } from "@/types/store";
import { useCart } from "./store/cart-provider";

export function AddToCart({ product }: { product: Product }) {
  const available = product.variants.filter(v => v.stockQuantity > 0);
  const [variantId, setVariantId] = useState(available[0]?.id || "");
  const { add } = useCart();
  const variant = product.variants.find(v => v.id === variantId);

  function handleAdd() {
    if (!variant) return;
    add({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || "",
      size: variant.size,
      color: variant.color,
      quantity: 1,
      unitPriceInPaise: product.priceInPaise,
    });
  }

  return (
    <div className="mt-8">
      <div className="eyebrow mb-3">Select size</div>
      <div className="grid grid-cols-5 gap-2">
        {product.variants.map((v) => (
          <button key={v.id} disabled={v.stockQuantity === 0} onClick={()=>setVariantId(v.id)}
            className={`h-12 border text-xs ${variantId===v.id?"border-white bg-white text-black":"border-white/20"} ${v.stockQuantity===0?"cursor-not-allowed opacity-25 line-through":""}`}>
            {v.size}
          </button>
        ))}
      </div>
      {variant && variant.stockQuantity <= 3 && <p className="mt-3 text-xs text-[#d8ff3e]">Only {variant.stockQuantity} left in {variant.size}</p>}
      <button onClick={handleAdd} disabled={!variant} className="btn btn-primary mt-5 w-full">Add to bag</button>
    </div>
  );
}
