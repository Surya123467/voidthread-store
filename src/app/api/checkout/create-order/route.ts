import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { mockProducts } from "@/lib/store/mock-data";

const schema = z.object({
  paymentMethod: z.enum(["prepaid","cod"]),
  customer: z.record(z.string(), z.any()),
  lines: z.array(z.object({ variantId:z.string(), quantity:z.number().int().min(1).max(10) })).min(1),
});

function demoPrice(lines:{variantId:string;quantity:number}[]) {
  let total=0;
  for(const line of lines){
    const product=mockProducts.find(p=>p.variants.some(v=>v.id===line.variantId));
    const variant=product?.variants.find(v=>v.id===line.variantId);
    if(!product||!variant||variant.stockQuantity<line.quantity) throw new Error("One or more items are unavailable.");
    total += product.priceInPaise*line.quantity;
  }
  return total;
}

export async function POST(request: Request) {
  try {
    const input=schema.parse(await request.json());
    const cloud=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    let amountInPaise=demoPrice(input.lines);
    let orderNumber=`VT-${Date.now().toString().slice(-8)}`;
    let dbOrderId:string|undefined;

    if(cloud){
      const { createAdminClient }=await import("@/lib/supabase/admin");
      const supabase=createAdminClient();
      const {data,error}=await supabase.rpc("create_checkout_order",{
        p_payment_method:input.paymentMethod,
        p_customer:input.customer,
        p_lines:input.lines,
        p_cod_fee_in_paise:input.paymentMethod==="cod"?Number(process.env.COD_FEE_INR||49)*100:0,
      });
      if(error) throw new Error(error.message);
      const row=Array.isArray(data)?data[0]:data;
      amountInPaise=row.total_in_paise;
      orderNumber=row.order_number;
      dbOrderId=row.order_id;
    } else if(input.paymentMethod==="cod") {
      amountInPaise += Number(process.env.COD_FEE_INR||49)*100;
    }

    if(input.paymentMethod==="cod") return NextResponse.json({ok:true,orderNumber,orderId:dbOrderId,demo:!cloud});

    if(!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET){
      return NextResponse.json({ok:true,orderNumber,orderId:dbOrderId,amountInPaise,razorpayOrderId:null,demo:true});
    }
    const razorpay=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
    const rz=await razorpay.orders.create({amount:amountInPaise,currency:"INR",receipt:orderNumber,notes:{internal_order_id:dbOrderId||"demo"}});
    if(cloud && dbOrderId){
      const { createAdminClient }=await import("@/lib/supabase/admin");
      await createAdminClient().from("orders").update({gateway_order_id:rz.id}).eq("id",dbOrderId);
    }
    return NextResponse.json({ok:true,orderNumber,orderId:dbOrderId,amountInPaise,razorpayOrderId:rz.id,keyId:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID||process.env.RAZORPAY_KEY_ID});
  } catch(error){
    const message=error instanceof Error?error.message:"Invalid checkout request";
    return NextResponse.json({error:message},{status:400});
  }
}
