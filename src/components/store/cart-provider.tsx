"use client";

import type { CartLine } from "@/types/store";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: CartLine) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "voidthread-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setLines([]); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.quantity * line.unitPriceInPaise, 0),
    add(line) {
      setLines((current) => {
        const found = current.find((item) => item.variantId === line.variantId);
        return found
          ? current.map((item) => item.variantId === line.variantId ? { ...item, quantity: item.quantity + line.quantity } : item)
          : [...current, line];
      });
    },
    remove(variantId) { setLines((current) => current.filter((item) => item.variantId !== variantId)); },
    setQuantity(variantId, quantity) { setLines((current) => quantity <= 0 ? current.filter((item)=>item.variantId!==variantId) : current.map((item)=>item.variantId===variantId?{...item,quantity}:item)); },
    clear() { setLines([]); },
  }), [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
