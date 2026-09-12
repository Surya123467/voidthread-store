"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function val(fd:FormData,key:string){return String(fd.get(key)??"").trim();}

async function uploadImages(productId:string, files:File[]){
  const supabase=createAdminClient();
  let position=0;
  for(const file of files){
    if(!file.size) continue;
    if(file.size>10*1024*1024) throw new Error("Each image must be 10MB or smaller.");
    if(!["image/jpeg","image/png","image/webp","image/avif"].includes(file.type)) throw new Error("Unsupported image type.");
    const ext=file.name.split(".").pop()?.toLowerCase()||"jpg";
    const path=`${productId}/${crypto.randomUUID()}.${ext}`;
    const {error}=await supabase.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});
    if(error) throw new Error(error.message);
    const {data}=supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("product_images").insert({product_id:productId,url:data.publicUrl,alt_text:val(new FormData(),"none")||"Product image",position:position++});
  }
}

export async function createProductAction(fd:FormData){
  const user=await requireAdmin(); if(user.demo) throw new Error("Connect Supabase before creating products.");
  const supabase=createAdminClient();
  const name=val(fd,"name"); const slug=slugify(val(fd,"slug")||name);
  const price=Math.round(Number(val(fd,"price"))*100);
  if(!name||!slug||!Number.isFinite(price)||price<0) throw new Error("Name, slug and valid price are required.");
  const {data:product,error}=await supabase.from("products").insert({
    name,slug,subtitle:val(fd,"subtitle"),description:val(fd,"description"),story:val(fd,"story"),price_in_paise:price,
    compare_at_price_in_paise:val(fd,"compareAt")?Math.round(Number(val(fd,"compareAt"))*100):null,
    status:val(fd,"status")||"draft",collection_name:val(fd,"collection")||"Archive",featured:fd.get("featured")==="on"
  }).select("id").single();
  if(error) throw new Error(error.message);
  const sizes=["S","M","L","XL","XXL"];
  const rows=sizes.map(size=>({product_id:product.id,size,color:val(fd,"color")||"Default",sku:val(fd,`sku_${size}`)||`${slug.toUpperCase()}-${size}`,stock_quantity:Math.max(0,Number(val(fd,`stock_${size}`)||0))})).filter(r=>r.stock_quantity>0 || val(fd,`sku_${r.size}`));
  if(rows.length){const {error:ve}=await supabase.from("product_variants").insert(rows); if(ve) throw new Error(ve.message);}
  const files=fd.getAll("images").filter((f):f is File=>f instanceof File && f.size>0); await uploadImages(product.id,files);
  await supabase.from("audit_log").insert({actor_id:user.id,action:"product.create",entity_type:"product",entity_id:product.id,metadata:{name,slug}});
  revalidatePath("/shop"); revalidatePath("/admin/products"); redirect(`/admin/products/${product.id}`);
}

export async function updateProductAction(id:string,fd:FormData){
  const user=await requireAdmin(); if(user.demo) throw new Error("Connect Supabase before editing products.");
  const supabase=createAdminClient(); const name=val(fd,"name"); const slug=slugify(val(fd,"slug")||name);
  const {error}=await supabase.from("products").update({name,slug,subtitle:val(fd,"subtitle"),description:val(fd,"description"),story:val(fd,"story"),price_in_paise:Math.round(Number(val(fd,"price"))*100),compare_at_price_in_paise:val(fd,"compareAt")?Math.round(Number(val(fd,"compareAt"))*100):null,status:val(fd,"status"),collection_name:val(fd,"collection"),featured:fd.get("featured")==="on",updated_at:new Date().toISOString()}).eq("id",id);
  if(error) throw new Error(error.message);
  const {data:variants}=await supabase.from("product_variants").select("id,size").eq("product_id",id);
  for(const v of variants??[]){const stock=Math.max(0,Number(val(fd,`stock_${v.size}`)||0)); await supabase.from("product_variants").update({stock_quantity:stock}).eq("id",v.id);}
  const files=fd.getAll("images").filter((f):f is File=>f instanceof File && f.size>0); if(files.length) await uploadImages(id,files);
  await supabase.from("audit_log").insert({actor_id:user.id,action:"product.update",entity_type:"product",entity_id:id,metadata:{name,slug}});
  revalidatePath("/shop"); revalidatePath(`/product/${slug}`); revalidatePath("/admin/products"); revalidatePath(`/admin/products/${id}`);
}
