import Link from "next/link";
import { listProducts } from "@/lib/store/products";
import { formatINR } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await listProducts();
  const cloud = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return <>
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><div className="eyebrow mb-3">Catalog</div><h1 className="text-5xl font-black tracking-[-.05em]">PRODUCTS</h1></div><Link aria-disabled={!cloud} href={cloud?"/admin/products/new":"#"} className={`btn btn-primary ${!cloud?"pointer-events-none opacity-40":""}`}>Add product</Link></div>
    {!cloud&&<div className="mb-7 border border-[#d8ff3e]/35 bg-[#d8ff3e]/5 p-4 text-xs leading-5 text-[#d8ff3e]">Local preview is read-only. Product create/edit and image upload unlock when the Supabase project is connected.</div>}
    <div className="overflow-x-auto"><table className="table"><thead><tr><th>Product</th><th>Collection</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><Link href={`/product/${p.slug}`} className="font-semibold">{p.name}</Link><div className="mt-1 text-xs text-white/35">{p.slug}</div></td><td>{p.collection}</td><td>{formatINR(p.priceInPaise)}</td><td>{p.variants.reduce((s,v)=>s+v.stockQuantity,0)}</td><td><span className="badge">{p.status}</span></td></tr>)}</tbody></table></div>
  </>;
}
