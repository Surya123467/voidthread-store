import { ProductCard } from "@/components/product-card";
import { listProducts } from "@/lib/store/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listProducts();
  return <main className="py-16 md:py-24">
    <div className="shell mb-12"><div className="eyebrow mb-3">Archive / Store</div><h1 className="section-title">ALL PIECES</h1></div>
    <div className="shell"><div className="grid-products">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></div>
  </main>;
}
