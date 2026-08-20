import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClientProviders } from "@/components/layout/ClientProviders";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "DEVIL CLOTHES | Premium Streetwear",
  description: "Wear your attitude. Premium streetwear engineered for the streets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} bg-[#D8D5DB] text-[#2D3142] antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#D8D5DB] text-[#2D3142] selection:bg-[#2D3142] selection:text-[#D8D5DB]">
        <ClientProviders>
          <Navbar />
          <main className="flex-1 flex flex-col pb-28 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
