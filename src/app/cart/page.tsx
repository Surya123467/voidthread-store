"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove } = useCart();
  return <main className="shell py-14 md:py-20">
    <div className="mb-10"><div className="eyebrow mb-3">Your selection</div><h1 className="section-title">BAG</h1></div>
    {lines.length===0 ? <div className="border-t border-white/10 py-20"><p className="mb-6 text-white/50">Your bag is empty.</p><Link className="btn" href="/shop">Shop the drop</Link></div> :
    <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
      <div>{lines.map(line=><div key={line.variantId} className="grid grid-cols-[110px_1fr] gap-5 border-t border-white/10 py-5 md:grid-cols-[140px_1fr_auto]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#151515]"><Image src={line.image} alt={line.name} fill className="object-cover"/></div>
        <div><Link href={`/product/${line.slug}`} className="font-bold">{line.name}</Link><div className="mt-2 text-xs text-white/45">{line.color} / {line.size}</div><div className="mt-4 text-sm">{formatINR(line.unitPriceInPaise)}</div>
          <div className="mt-5 inline-flex items-center border border-white/15"><button className="p-2" onClick={()=>setQuantity(line.variantId,line.quantity-1)}><Minus size={13}/></button><span className="min-w-8 text-center text-xs">{line.quantity}</span><button className="p-2" onClick={()=>setQuantity(line.variantId,line.quantity+1)}><Plus size={13}/></button></div>
        </div>
        <button onClick={()=>remove(line.variantId)} className="self-start justify-self-end p-2 text-white/40 hover:text-white"><X size={16}/></button>
      </div>)}</div>
      <aside className="h-fit border border-white/12 p-6 lg:sticky lg:top-28"><div className="eyebrow mb-6">Summary</div><div className="flex justify-between border-b border-white/10 pb-5 text-sm"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div><p className="py-5 text-xs leading-5 text-white/40">Shipping and COD fee, if applicable, are calculated at checkout.</p><Link href="/checkout" className="btn btn-primary w-full">Checkout</Link></aside>
    </div>}
  </main>;
}
