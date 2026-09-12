"use client";

import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { formatINR } from "@/lib/format";

type Method = "prepaid" | "cod";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const [method,setMethod]=useState<Method>("prepaid");
  const [status,setStatus]=useState("");
  const codFee = 4900;

  useEffect(() => {
    if (document.querySelector('script[data-razorpay]')) return;
    const script=document.createElement("script"); script.src="https://checkout.razorpay.com/v1/checkout.js"; script.async=true; script.dataset.razorpay="true"; document.body.appendChild(script);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("Creating order…");
    const form = new FormData(e.currentTarget);
    const payload = {
      paymentMethod: method,
      customer: Object.fromEntries(form.entries()),
      lines: lines.map(l=>({variantId:l.variantId,quantity:l.quantity})),
    };
    const res = await fetch("/api/checkout/create-order",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
    const data = await res.json();
    if (!res.ok) { setStatus(data.error || "Could not create order"); return; }
    if (method === "cod") { clear(); setStatus(`Order ${data.orderNumber} confirmed for Cash on Delivery.`); return; }
    if (!data.razorpayOrderId || !data.keyId) { setStatus("Prepaid checkout is ready, but Razorpay credentials are not connected yet."); return; }
    if (!window.Razorpay) { setStatus("Payment window is still loading. Please try again."); return; }
    const customer=payload.customer as Record<string,string>;
    const rz=new window.Razorpay({
      key:data.keyId, amount:data.amountInPaise, currency:"INR", name:process.env.NEXT_PUBLIC_SITE_NAME||"VOID//THREAD", description:"Streetwear order", order_id:data.razorpayOrderId,
      prefill:{name:customer.name,email:customer.email,contact:customer.phone},
      theme:{color:"#d8ff3e"},
      handler:async (response:any)=>{
        setStatus("Verifying payment…");
        const verify=await fetch("/api/payments/verify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...response,internalOrderId:data.orderId})});
        if(!verify.ok){setStatus("Payment received but verification failed. Please contact support with your payment ID.");return;}
        clear(); setStatus(`Payment successful. Order ${data.orderNumber} is confirmed.`);
      }
    });
    rz.open();
  }

  if (!lines.length) return <main className="shell py-20"><h1 className="section-title">CHECKOUT</h1><p className="mt-8 text-white/50">Your bag is empty.</p></main>;

  return <main className="shell py-14 md:py-20"><div className="mb-10"><div className="eyebrow mb-3">Secure checkout</div><h1 className="section-title">CHECKOUT</h1></div>
    <form onSubmit={submit} className="grid gap-14 lg:grid-cols-[1fr_380px]">
      <div className="space-y-9">
        <section><div className="eyebrow mb-4">Contact</div><div className="grid gap-3 md:grid-cols-2"><input required name="name" className="input" placeholder="Full name"/><input required name="phone" inputMode="tel" className="input" placeholder="Phone number"/><input required type="email" name="email" className="input md:col-span-2" placeholder="Email"/></div></section>
        <section><div className="eyebrow mb-4">Shipping address</div><div className="grid gap-3 md:grid-cols-2"><input required name="address1" className="input md:col-span-2" placeholder="Address"/><input name="address2" className="input md:col-span-2" placeholder="Apartment / landmark (optional)"/><input required name="city" className="input" placeholder="City"/><input required name="state" className="input" placeholder="State"/><input required name="pincode" className="input" placeholder="PIN code" inputMode="numeric"/><input name="country" className="input" defaultValue="India"/></div></section>
        <section><div className="eyebrow mb-4">Payment</div><div className="grid gap-3"><label className={`flex cursor-pointer items-start gap-4 border p-5 ${method==="prepaid"?"border-white":"border-white/15"}`}><input type="radio" checked={method==="prepaid"} onChange={()=>setMethod("prepaid")} className="mt-1"/><span><strong className="text-sm">UPI / Cards / Netbanking</strong><span className="mt-1 block text-xs text-white/45">Google Pay, PhonePe and other supported UPI apps through Razorpay.</span></span></label><label className={`flex cursor-pointer items-start gap-4 border p-5 ${method==="cod"?"border-white":"border-white/15"}`}><input type="radio" checked={method==="cod"} onChange={()=>setMethod("cod")} className="mt-1"/><span><strong className="text-sm">Cash on Delivery</strong><span className="mt-1 block text-xs text-white/45">₹49 COD handling fee. Serviceability can be restricted by PIN code later.</span></span></label></div></section>
      </div>
      <aside className="h-fit border border-white/12 p-6 lg:sticky lg:top-28"><div className="eyebrow mb-6">Order</div>{lines.map(l=><div key={l.variantId} className="mb-4 flex justify-between gap-5 text-xs"><span className="text-white/65">{l.name} / {l.size} × {l.quantity}</span><span>{formatINR(l.unitPriceInPaise*l.quantity)}</span></div>)}<div className="mt-6 border-t border-white/10 pt-5"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>{method==="cod"&&<div className="mt-3 flex justify-between text-sm"><span>COD fee</span><span>₹49</span></div>}<div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-lg font-bold"><span>Total</span><span>{formatINR(subtotal+(method==="cod"?codFee:0))}</span></div></div><button className="btn btn-primary mt-6 w-full" type="submit">{method==="cod"?"Place COD order":"Continue to payment"}</button>{status&&<p className="mt-4 text-xs leading-5 text-[#d8ff3e]">{status}</p>}</aside>
    </form></main>;
}
