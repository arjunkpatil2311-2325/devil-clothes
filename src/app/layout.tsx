import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClientProviders } from "@/components/layout/ClientProviders";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

import MobileBottomNav from "@/components/layout/MobileBottomNav";

export const metadata: Metadata = {
  title: "DEVIL CLOTHES | Premium Streetwear",
  description: "Wear your attitude. Premium streetwear built for your style.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} bg-black text-white antialiased`}>
      <body className="min-h-screen flex flex-col selection:bg-white selection:text-black">
        <ClientProviders>
          <Navbar />
          <main className="flex-1 flex flex-col pb-24 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </ClientProviders>
      </body>
    </html>
  );
}
