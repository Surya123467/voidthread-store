import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema=z.object({razorpay_order_id:z.string(),razorpay_payment_id:z.string(),razorpay_signature:z.string(),internalOrderId:z.string().uuid().optional()});

export async function POST(req:Request){
  try{
    const body=schema.parse(await req.json());
    const secret=process.env.RAZORPAY_KEY_SECRET;
    if(!secret) throw new Error("Razorpay is not configured");
    const expected=crypto.createHmac("sha256",secret).update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`).digest("hex");
    const valid=crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(body.razorpay_signature));
    if(!valid) return NextResponse.json({error:"Invalid payment signature"},{status:400});
    if(body.internalOrderId && process.env.SUPABASE_SERVICE_ROLE_KEY){
      const {createAdminClient}=await import("@/lib/supabase/admin");
      const supabase=createAdminClient();
      const {error}=await supabase.rpc("mark_order_paid",{p_order_id:body.internalOrderId,p_payment_id:body.razorpay_payment_id});
      if(error) throw new Error(error.message);
    }
    return NextResponse.json({ok:true});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Verification failed"},{status:400});}
}
