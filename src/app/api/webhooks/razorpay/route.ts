import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(req:Request){
  const secret=process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret) return NextResponse.json({error:"Webhook secret not configured"},{status:503});
  const raw=await req.text();
  const signature=req.headers.get("x-razorpay-signature")||"";
  const expected=crypto.createHmac("sha256",secret).update(raw).digest("hex");
  const a=Buffer.from(expected); const b=Buffer.from(signature);
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b)) return NextResponse.json({error:"Invalid signature"},{status:401});
  const event=JSON.parse(raw);
  if(event.event==="payment.captured" && process.env.SUPABASE_SERVICE_ROLE_KEY){
    const payment=event.payload?.payment?.entity;
    const internalId=payment?.notes?.internal_order_id;
    if(internalId && internalId!=="demo"){
      const {createAdminClient}=await import("@/lib/supabase/admin");
      await createAdminClient().rpc("mark_order_paid",{p_order_id:internalId,p_payment_id:payment.id});
    }
  }
  return NextResponse.json({ok:true});
}
