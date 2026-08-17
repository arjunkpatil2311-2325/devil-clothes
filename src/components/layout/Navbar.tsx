"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 md:bg-black/90 backdrop-blur-md border-b border-black/10 md:border-white/10 transition-colors duration-300">
      {/* Announcement Bar */}
      <div className="w-full bg-black text-white py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 md:gap-16 items-center text-[9px] md:text-xs font-bold tracking-widest uppercase">
          <span>NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span>NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span>NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
          <span>NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999</span>
        </div>
      </div>
      {/* Main Navbar */}
      <nav className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Mobile Left: Hamburger */}
        <div className="flex md:hidden flex-1 items-center justify-start">
          <button 
            className="p-2 -ml-2 text-black"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Logo - Centered on Mobile, Left on Desktop */}
        <div className="flex flex-1 md:flex-none justify-center md:justify-start">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter uppercase text-black md:text-white">
            DEVIL CLOTHES
          </Link>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-widest uppercase text-white">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-gray-300 transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-gray-300 transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        </div>

        {/* Right Icons */}
        <div className="flex flex-1 justify-end items-center space-x-4 md:space-x-6 text-black md:text-white">
          <button className="hover:text-gray-500 transition-colors">
            <Search className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          <Link href="/account" className="hover:text-gray-500 transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/wishlist" className="hover:text-gray-500 transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-gray-500 transition-colors flex items-center"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="ml-1.5 text-[10px] md:text-xs font-bold bg-black md:bg-white text-white md:text-black rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Premium Fullscreen Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-white z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-black/5 bg-white">
          <div className="text-xl font-black tracking-tighter uppercase text-black ml-2">
            DEVIL CLOTHES
          </div>
          <button 
            className="p-2 mr-2 text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col px-6 py-8 flex-1 overflow-y-auto bg-[#fafafa]">
          {/* Main Links */}
          <div className="flex flex-col space-y-6 text-3xl font-black tracking-tighter uppercase text-black mb-12">
            <Link href="/" className="hover:translate-x-2 transition-transform">Home</Link>
            <Link href="/shop" className="hover:translate-x-2 transition-transform">Shop</Link>
            <Link href="/collections" className="hover:translate-x-2 transition-transform">Collections</Link>
            <Link href="/about" className="hover:translate-x-2 transition-transform">About</Link>
            <Link href="/contact" className="hover:translate-x-2 transition-transform">Contact</Link>
          </div>
          
          {/* Secondary Links */}
          <div className="pt-8 border-t border-black/10 flex flex-col space-y-6 text-sm font-bold uppercase tracking-widest text-gray-500">
            <Link href="/account" className="flex items-center gap-4 hover:text-black transition-colors">
              <User className="w-5 h-5" /> My Account
            </Link>
            <Link href="/wishlist" className="flex items-center gap-4 hover:text-black transition-colors">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="flex items-center gap-4 hover:text-black transition-colors"
            >
              <ShoppingBag className="w-5 h-5" /> Cart ({cartCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
