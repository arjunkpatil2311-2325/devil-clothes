"use client";

import Link from "next/link";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <div className="sticky top-0 z-50 w-full bg-[#F5F3EE]/95 md:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#171717]/10 md:border-[#F5F3EE]/10 transition-colors duration-300">
      {/* Announcement Bar */}
      <div className="w-full bg-[#0A0A0A] text-[#F5F3EE] py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 md:gap-16 items-center text-[9px] md:text-xs font-bold tracking-widest uppercase">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#C9BDAA] rounded-full" /> NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#C9BDAA] rounded-full" /> NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#C9BDAA] rounded-full" /> NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#C9BDAA] rounded-full" /> NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
        </div>
      </div>
      {/* Main Navbar */}
      <nav className="container mx-auto px-4 md:px-6 h-[56px] md:h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex flex-1 md:flex-none justify-start">
          <Link href="/" className="text-[20px] md:text-2xl font-black tracking-tighter uppercase text-[#0A0A0A] md:text-[#F5F3EE]">
            DEVIL CLOTHES
          </Link>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-widest uppercase text-[#F5F3EE]">
          <Link href="/" className="hover:text-[#C9BDAA] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#C9BDAA] transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-[#C9BDAA] transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-[#C9BDAA] transition-colors">About</Link>
        </div>

        {/* Right side Icons */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <button className="p-2 md:p-3 text-[#0A0A0A] md:text-[#F5F3EE] hover:text-[#171717] transition-colors hidden md:block">
            <User className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Wishlist (visible on both mobile and desktop) */}
          <Link href="/wishlist" className="p-2 md:p-3 text-[#0A0A0A] md:text-[#F5F3EE] hover:text-[#171717] transition-colors">
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          
          {/* Search (visible on both mobile and desktop) */}
          <button className="p-2 md:p-3 text-[#0A0A0A] md:text-[#F5F3EE] hover:text-[#171717]/60 md:hover:text-[#F5F3EE]/60 transition-colors">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Cart (Desktop only, mobile handles it in bottom nav) */}
          <Link href="/cart" className="p-2 md:p-3 -mr-2 md:mr-0 text-[#0A0A0A] md:text-[#F5F3EE] hover:text-[#171717]/60 md:hover:text-[#F5F3EE]/60 transition-colors relative hidden md:flex">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            <span className="ml-1.5 text-[10px] md:text-xs font-bold bg-[#0A0A0A] md:bg-[#F5F3EE] text-[#F5F3EE] md:text-[#0A0A0A] rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
