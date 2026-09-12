import Link from "next/link";
import { Boxes, LayoutDashboard, ReceiptText, Shirt } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return <div className="admin-grid">
    <aside className="admin-side">
      <div className="eyebrow mb-7">Operations</div>
      <nav className="grid gap-1 text-sm">
        <Link href="/admin" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5"><LayoutDashboard size={16}/>Dashboard</Link>
        <Link href="/admin/products" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5"><Shirt size={16}/>Products</Link>
        <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5"><Boxes size={16}/>Inventory</Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-3 hover:bg-white/5"><ReceiptText size={16}/>Orders</Link>
      </nav>
      <div className="mt-10 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[.15em] text-white/35">{user.demo?"Local preview":"Authenticated"}<br/>{user.role}</div>
    </aside>
    <section className="admin-main">{children}</section>
  </div>;
}
