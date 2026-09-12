import { listProducts } from "@/lib/store/products";
import { formatINR } from "@/lib/format";

export default async function AdminDashboard() {
  const products = await listProducts();
  const variants = products.flatMap(p=>p.variants);
  const stock = variants.reduce((s,v)=>s+v.stockQuantity,0);
  const low = variants.filter(v=>v.stockQuantity<=3).length;
  return <>
    <div className="mb-10"><div className="eyebrow mb-3">Control room</div><h1 className="text-5xl font-black tracking-[-.05em]">DASHBOARD</h1></div>
    <div className="kpi-grid">
      <div className="kpi"><div className="eyebrow">Live products</div><div className="mt-5 text-3xl font-bold">{products.length}</div></div>
      <div className="kpi"><div className="eyebrow">Units in stock</div><div className="mt-5 text-3xl font-bold">{stock}</div></div>
      <div className="kpi"><div className="eyebrow">Low-stock variants</div><div className="mt-5 text-3xl font-bold">{low}</div></div>
      <div className="kpi"><div className="eyebrow">Catalog value</div><div className="mt-5 text-3xl font-bold">{formatINR(products.reduce((sum,p)=>sum+p.priceInPaise*p.variants.reduce((s,v)=>s+v.stockQuantity,0),0))}</div></div>
    </div>
    <div className="mt-12"><div className="eyebrow mb-4">Launch readiness</div><div className="grid gap-3 md:grid-cols-2"><div className="border border-white/10 p-5 text-sm"><strong>Storefront</strong><p className="mt-2 text-white/45">Product, cart and checkout flows are wired.</p></div><div className="border border-white/10 p-5 text-sm"><strong>Cloud services</strong><p className="mt-2 text-white/45">Connect Supabase + Razorpay before accepting live orders.</p></div></div></div>
  </>;
}
