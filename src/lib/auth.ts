import { redirect } from "next/navigation";

export async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return { id: "demo", email: "local-preview", role: "owner" as const, demo: true };
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !["owner","admin","staff"].includes(profile.role)) redirect("/");
  return { id: user.id, email: user.email ?? "", role: profile.role as "owner"|"admin"|"staff", demo: false };
}
