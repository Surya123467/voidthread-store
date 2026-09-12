import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/store/cart-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "VOID//THREAD — Independent Streetwear",
  description: "Original high-concept streetwear. Limited drops. Built from myth, consequence and aftermath.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
