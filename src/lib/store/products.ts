import { mockProducts } from "./mock-data";
import type { Product } from "@/types/store";

export async function listProducts(): Promise<Product[]> {
  // Production adapter switches to Supabase once project credentials are present.
  // Keeping a deterministic fallback allows local development, CI and design review
  // before cloud credentials exist.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return mockProducts;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    story: row.story ?? "",
    priceInPaise: row.price_in_paise,
    compareAtPriceInPaise: row.compare_at_price_in_paise ?? undefined,
    status: row.status,
    collection: row.collection_name ?? "Archive",
    featured: row.featured,
    images: (row.product_images ?? []).sort((a: any,b: any)=>a.position-b.position).map((i: any)=>({ id:i.id, url:i.url, alt:i.alt_text ?? row.name, position:i.position })),
    variants: (row.product_variants ?? []).map((v: any)=>({ id:v.id, size:v.size, color:v.color, sku:v.sku, stockQuantity:v.stock_quantity }))
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await listProducts();
  return products.find((product) => product.slug === slug) ?? null;
}
