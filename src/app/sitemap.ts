import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/store/products";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"; const products=await listProducts(); return [{url:base,lastModified:new Date(),changeFrequency:"weekly",priority:1},{url:`${base}/shop`,lastModified:new Date(),changeFrequency:"daily",priority:.9},...products.map(p=>({url:`${base}/product/${p.slug}`,lastModified:new Date(),changeFrequency:"weekly" as const,priority:.8}))];}
