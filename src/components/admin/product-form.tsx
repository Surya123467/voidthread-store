import type { ProductStatus } from "@/types/store";

type Raw = any;
export function ProductForm({action,product}:{action:(fd:FormData)=>void|Promise<void>;product?:Raw}){
 const getVariant=(size:string)=>product?.product_variants?.find((v:any)=>v.size===size);
 return <form action={action} className="grid gap-8">
   <section className="grid gap-4 border border-white/10 p-5 md:grid-cols-2">
    <div className="md:col-span-2"><div className="eyebrow mb-2">Product identity</div></div>
    <label className="text-xs text-white/55">Name<input className="input mt-2" name="name" required defaultValue={product?.name}/></label>
    <label className="text-xs text-white/55">Slug<input className="input mt-2" name="slug" defaultValue={product?.slug} placeholder="auto-from-name"/></label>
    <label className="text-xs text-white/55 md:col-span-2">Subtitle<input className="input mt-2" name="subtitle" defaultValue={product?.subtitle}/></label>
    <label className="text-xs text-white/55 md:col-span-2">Description<textarea className="input mt-2 min-h-28" name="description" defaultValue={product?.description}/></label>
    <label className="text-xs text-white/55 md:col-span-2">Story<textarea className="input mt-2 min-h-28" name="story" defaultValue={product?.story}/></label>
   </section>
   <section className="grid gap-4 border border-white/10 p-5 md:grid-cols-3">
    <label className="text-xs text-white/55">Price ₹<input className="input mt-2" name="price" type="number" min="0" step="1" required defaultValue={product?product.price_in_paise/100:1499}/></label>
    <label className="text-xs text-white/55">Compare-at ₹<input className="input mt-2" name="compareAt" type="number" min="0" step="1" defaultValue={product?.compare_at_price_in_paise?product.compare_at_price_in_paise/100:""}/></label>
    <label className="text-xs text-white/55">Status<select className="input mt-2" name="status" defaultValue={(product?.status||"draft") as ProductStatus}><option value="draft">Draft</option><option value="active">Active</option><option value="archived">Archived</option></select></label>
    <label className="text-xs text-white/55 md:col-span-2">Collection<input className="input mt-2" name="collection" defaultValue={product?.collection_name||"DROP 001 — AFTERLIGHT"}/></label>
    <label className="flex items-center gap-2 self-end p-4 text-xs"><input name="featured" type="checkbox" defaultChecked={Boolean(product?.featured)}/> Featured on home</label>
   </section>
   <section className="border border-white/10 p-5"><div className="eyebrow mb-5">Variants & stock</div><label className="mb-5 block max-w-md text-xs text-white/55">Color<input className="input mt-2" name="color" defaultValue={product?.product_variants?.[0]?.color||"Default"}/></label><div className="grid gap-3 md:grid-cols-5">{["S","M","L","XL","XXL"].map(size=><div key={size} className="border border-white/10 p-3"><strong className="text-sm">{size}</strong>{!product&&<input className="input mt-3" name={`sku_${size}`} placeholder="SKU"/>}<input className="input mt-2" name={`stock_${size}`} type="number" min="0" defaultValue={getVariant(size)?.stock_quantity??0} placeholder="Stock"/></div>)}</div></section>
   <section className="border border-white/10 p-5"><div className="eyebrow mb-4">Product images</div><input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-xs text-white/55"/><p className="mt-3 text-xs text-white/35">JPG, PNG, WebP or AVIF. Maximum 10 MB each. Stored in Supabase Storage.</p></section>
   <button className="btn btn-primary w-fit" type="submit">{product?"Save changes":"Create product"}</button>
 </form>
}
