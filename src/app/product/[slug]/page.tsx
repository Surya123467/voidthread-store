import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/store/products";
import { formatINR } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <main className="shell py-10 md:py-16">
    <div className="grid gap-12 lg:grid-cols-[1.25fr_.75fr]">
      <div className="grid gap-2 md:grid-cols-2">
        {product.images.map((image, i)=><div key={image.id} className={`relative overflow-hidden bg-[#141414] ${i===0&&product.images.length===1?"md:col-span-2":""}`} style={{aspectRatio:"4/5"}}><Image src={image.url} alt={image.alt} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority={i===0}/></div>)}
      </div>
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="eyebrow">{product.collection}</div>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em] md:text-7xl">{product.name}</h1>
        <div className="mt-5 flex items-center gap-3 text-lg"><span>{formatINR(product.priceInPaise)}</span>{product.compareAtPriceInPaise&&<span className="text-sm text-white/35 line-through">{formatINR(product.compareAtPriceInPaise)}</span>}</div>
        <p className="mt-8 text-sm leading-7 text-white/58">{product.description}</p>
        <AddToCart product={product}/>
        <div className="mt-10 border-t border-white/10 pt-7"><div className="eyebrow mb-3">The story</div><p className="text-sm leading-7 text-white/50">{product.story}</p></div>
        <div className="mt-7 border-t border-white/10 pt-7 text-xs leading-6 text-white/45">Ships across India. Prepaid and Cash on Delivery available where serviceable. Final availability is confirmed at checkout.</div>
      </aside>
    </div>
  </main>;
}
