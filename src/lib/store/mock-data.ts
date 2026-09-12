import type { Product } from "@/types/store";

export const mockProducts: Product[] = [
  {
    id: "power-001",
    name: "POWER / 001",
    slug: "power-001",
    subtitle: "Heavyweight oversized tee",
    description: "240 GSM combed cotton. Drop shoulder. Enzyme washed. Built for structure, not softness alone.",
    story: "A study in restraint: power shown through weight, fracture and silence rather than a borrowed symbol.",
    priceInPaise: 149900,
    compareAtPriceInPaise: 169900,
    status: "active",
    collection: "DROP 001 — AFTERLIGHT",
    featured: true,
    images: [
      { id: "p1a", url: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1600&q=90", alt: "Dark oversized streetwear tee", position: 0 },
      { id: "p1b", url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1600&q=90", alt: "Premium streetwear detail", position: 1 }
    ],
    variants: ["S","M","L","XL","XXL"].map((size, i) => ({ id: `p1-${size}`, size, color: "Forest Void", sku: `VT-PWR-${size}`, stockQuantity: [6,12,10,4,2][i] }))
  },
  {
    id: "thread-002",
    name: "THREAD / 002",
    slug: "thread-002",
    subtitle: "Washed crimson oversized tee",
    description: "230 GSM cotton jersey. Garment washed. Abstract thread artwork across the upper chest.",
    story: "Everything touches something else. A piece about consequence, connection and the weight of choosing.",
    priceInPaise: 139900,
    status: "active",
    collection: "DROP 001 — AFTERLIGHT",
    featured: true,
    images: [
      { id: "p2a", url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1600&q=90", alt: "Crimson fashion tee", position: 0 }
    ],
    variants: ["S","M","L","XL"].map((size, i) => ({ id: `p2-${size}`, size, color: "Crimson Ash", sku: `VT-THR-${size}`, stockQuantity: [3,8,7,0][i] }))
  },
  {
    id: "thunder-003",
    name: "THUNDER / 003",
    slug: "thunder-003",
    subtitle: "Charcoal heavyweight tee",
    description: "250 GSM cotton. High rib neck. Distressed original hammer-and-lightning artwork on back.",
    story: "Not mythology copied. Mythology rebuilt: force, fracture and the second before impact.",
    priceInPaise: 159900,
    status: "active",
    collection: "DROP 001 — AFTERLIGHT",
    featured: true,
    images: [
      { id: "p3a", url: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1600&q=90", alt: "Charcoal streetwear tee", position: 0 }
    ],
    variants: ["M","L","XL","XXL"].map((size, i) => ({ id: `p3-${size}`, size, color: "Storm Charcoal", sku: `VT-THU-${size}`, stockQuantity: [9,9,5,1][i] }))
  }
];
