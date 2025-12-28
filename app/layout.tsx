import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Toko Emas [Nama Toko]",
  description:
    "Cicil emas 24K Antam & UBS dengan akad murabahah, simulasi cicilan online, dan stok aman.",
  keywords: [
    "cicil emas antam",
    "toko emas cicilan syariah",
    "cicil emas 24k",
    "cicil emas ubs"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-sand text-ink">
        <Header />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
