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
    <div className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-white/10">
      {/* Announcement Bar */}
      <div className="w-full bg-white text-black py-2 px-4 text-center text-[10px] md:text-xs font-bold tracking-widest uppercase truncate">
        NEW DROP • LIMITED PIECES • FREE SHIPPING ON ORDERS OVER ₹999
      </div>
      
      {/* Main Navbar */}
      <nav className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 -ml-2 text-white"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-lg md:text-2xl font-black tracking-tighter uppercase shrink-0">
          DEVIL CLOTHES
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-widest uppercase">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-gray-300 transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-gray-300 transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button className="hover:text-gray-300 transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/account" className="hover:text-gray-300 transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </Link>
          <Link href="/wishlist" className="hover:text-gray-300 transition-colors hidden sm:block">
            <Heart className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="hover:text-gray-300 transition-colors flex items-center"
          >
            <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
            <span className="ml-1.5 text-[10px] md:text-xs font-bold bg-white text-black rounded-full w-4 h-4 md:w-4 md:h-4 flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="text-lg font-black tracking-tighter uppercase">
              DEVIL CLOTHES
            </div>
            <button 
              className="p-2 -mr-2 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex flex-col p-6 space-y-8 text-xl font-black tracking-widest uppercase flex-1 overflow-y-auto">
            <Link href="/" className="hover:text-gray-400">Home</Link>
            <Link href="/shop" className="hover:text-gray-400">Shop All</Link>
            <Link href="/collections" className="hover:text-gray-400">Collections</Link>
            <Link href="/about" className="hover:text-gray-400">About Us</Link>
            <Link href="/contact" className="hover:text-gray-400">Contact</Link>
            
            <div className="pt-8 border-t border-white/10 flex flex-col space-y-6 text-sm font-bold text-gray-400">
              <Link href="/account" className="flex items-center gap-4 hover:text-white">
                <User className="w-5 h-5" /> Account
              </Link>
              <Link href="/wishlist" className="flex items-center gap-4 hover:text-white">
                <Heart className="w-5 h-5" /> Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
