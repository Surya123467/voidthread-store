"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router=useRouter(); const params=useSearchParams(); const [message,setMessage]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault(); const fd=new FormData(e.currentTarget); try { const supabase=createClient(); const {error}=await supabase.auth.signInWithPassword({email:String(fd.get("email")),password:String(fd.get("password"))}); if(error){setMessage(error.message);return;} router.push(params.get("next")||"/admin"); router.refresh(); } catch { setMessage("Supabase is not connected yet."); }}
  return <main className="shell flex min-h-[70vh] items-center justify-center py-20"><form onSubmit={submit} className="w-full max-w-md border border-white/10 p-7"><div className="eyebrow mb-3">Team access</div><h1 className="text-4xl font-black tracking-[-.05em]">ADMIN LOGIN</h1><div className="mt-8 grid gap-3"><input name="email" type="email" required className="input" placeholder="Email"/><input name="password" type="password" required className="input" placeholder="Password"/><button className="btn btn-primary" type="submit">Sign in</button>{message&&<p className="text-xs text-[#d8ff3e]">{message}</p>}</div></form></main>;
}
