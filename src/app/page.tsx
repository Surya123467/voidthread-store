import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { listProducts } from "@/lib/store/products";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const products = (await listProducts()).filter(p=>p.featured).slice(0,3);
  return (
    <main>
      <section className="noise relative flex min-h-[calc(100vh-72px)] flex-col justify-between overflow-hidden border-b border-white/10 px-0 py-8 md:py-12">
        <div className="shell flex items-start justify-between">
          <div className="eyebrow">Independent streetwear / Bengaluru / 2026</div>
          <div className="hidden text-right text-[10px] uppercase tracking-[.2em] text-white/40 md:block">Drop 001<br/>Limited run</div>
        </div>
        <div className="shell py-20">
          <div className="max-w-5xl">
            <p className="mb-5 max-w-md text-sm leading-6 text-white/55">Clothes built from aftermath, myth and consequence. No borrowed heroes. No obvious references.</p>
            <h1 className="display">AFTER<br/>LIGHT</h1>
          </div>
        </div>
        <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-sm leading-6 text-white/60">DROP 001 explores power, responsibility and impact through original symbols, heavyweight fabric and restrained graphics.</p>
          <Link href="/shop" className="btn btn-primary">Enter the drop <ArrowDownRight size={15}/></Link>
        </div>
      </section>

      <section id="drop" className="py-20 md:py-28">
        <div className="shell mb-10 flex items-end justify-between gap-8">
          <div><div className="eyebrow mb-3">Current release</div><h2 className="section-title">DROP 001</h2></div>
          <Link href="/shop" className="hidden items-center gap-2 text-xs uppercase tracking-[.14em] md:flex">View all <ArrowUpRight size={14}/></Link>
        </div>
        <div className="shell"><div className="grid-products">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></div>
      </section>

      <section id="manifesto" className="rule py-24 md:py-36">
        <div className="shell grid gap-10 md:grid-cols-[1fr_2fr]">
          <div className="eyebrow">Manifesto / 001</div>
          <div>
            <h2 className="section-title max-w-5xl">WE DON&apos;T PRINT CHARACTERS. WE BUILD SYMBOLS.</h2>
            <div className="mt-12 grid gap-8 text-sm leading-7 text-white/55 md:grid-cols-2">
              <p>Every piece starts with a human idea: the cost of power, the weight of responsibility, the violence of change, the seduction of chaos. The artwork comes after.</p>
              <p>Limited runs keep the work deliberate. Heavy cotton, considered silhouettes and original imagery make each garment stand without needing someone else&apos;s universe.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12">
        <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="text-3xl font-black tracking-[-.06em]">VOID//THREAD</div>
          <div className="text-[10px] uppercase tracking-[.18em] text-white/35">Original garments · India · © 2026</div>
        </div>
      </footer>
    </main>
  );
}
