import { listProducts } from "@/lib/store/products";

export default async function InventoryPage() {
  const products = await listProducts();
  return <><div className="mb-8"><div className="eyebrow mb-3">Stock ledger</div><h1 className="text-5xl font-black tracking-[-.05em]">INVENTORY</h1></div><div className="overflow-x-auto"><table className="table"><thead><tr><th>SKU</th><th>Piece</th><th>Size</th><th>Color</th><th>Available</th><th>Signal</th></tr></thead><tbody>{products.flatMap(p=>p.variants.map(v=><tr key={v.id}><td>{v.sku}</td><td>{p.name}</td><td>{v.size}</td><td>{v.color}</td><td>{v.stockQuantity}</td><td><span className="badge">{v.stockQuantity===0?"Sold out":v.stockQuantity<=3?"Low":"Healthy"}</span></td></tr>))}</tbody></table></div></>;
}
