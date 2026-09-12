import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";
export default function NewProduct(){return <><div className="mb-8"><div className="eyebrow mb-3">Catalog</div><h1 className="text-5xl font-black tracking-[-.05em]">NEW PRODUCT</h1></div><ProductForm action={createProductAction}/></>}
