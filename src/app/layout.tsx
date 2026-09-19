import type { Metadata } from "next";
import { Manrope, Bebas_Neue } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { restaurantConfig } from "@/data/restaurant";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Bold condensed poster face used for headlines — carries the diner/roadside
// restaurant personality that the body sans can't.
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${restaurantConfig.name} — ${restaurantConfig.tagline}`,
  description: restaurantConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${manrope.variable} ${bebasNeue.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-ink-900 font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1 pb-16 pt-16 sm:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
