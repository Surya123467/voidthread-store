import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductRaw } from "@/lib/store/admin-products";
import { updateProductAction } from "../actions";
export default async function EditProduct({params}:{params:Promise<{id:string}>}){const {id}=await params; const product=await getAdminProductRaw(id); const action=updateProductAction.bind(null,id); return <><div className="mb-8"><div className="eyebrow mb-3">Catalog / edit</div><h1 className="text-5xl font-black tracking-[-.05em]">{product.name}</h1></div><ProductForm action={action} product={product}/></>}
