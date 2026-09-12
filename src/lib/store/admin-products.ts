import { createAdminClient } from "@/lib/supabase/admin";

export async function listAdminProductsRaw() {
  const supabase=createAdminClient();
  const {data,error}=await supabase.from("products").select("*,product_variants(*),product_images(*)").order("created_at",{ascending:false});
  if(error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminProductRaw(id:string){
  const supabase=createAdminClient();
  const {data,error}=await supabase.from("products").select("*,product_variants(*),product_images(*)").eq("id",id).single();
  if(error) throw new Error(error.message);
  return data;
}
