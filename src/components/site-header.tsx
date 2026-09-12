"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "./store/cart-provider";

export function SiteHeader() {
  const { count } = useCart();
  const brand = process.env.NEXT_PUBLIC_SITE_NAME || "VOID//THREAD";
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between">
        <Link href="/" className="text-sm font-black tracking-[-.04em]">{brand}</Link>
        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[.16em] md:flex">
          <Link href="/shop">Shop</Link>
          <Link href="/#drop">Drop 001</Link>
          <Link href="/#manifesto">Manifesto</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/cart" aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center border border-white/15">
            <ShoppingBag size={17} />
            {count > 0 && <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#d8ff3e] px-1 text-center text-[10px] font-bold leading-5 text-black">{count}</span>}
          </Link>
          <button className="flex h-10 w-10 items-center justify-center border border-white/15 md:hidden" aria-label="Open menu"><Menu size={17}/></button>
        </div>
      </div>
    </header>
  );
}
