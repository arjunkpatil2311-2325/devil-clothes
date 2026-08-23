"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { LoginGate } from "@/components/ui/LoginGate";
import SearchOverlay from "@/components/layout/SearchOverlay";

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const { isAuthenticated, profile } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginGate(true);
    } else {
      router.push('/wishlist');
    }
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-300">
      {/* Announcement Bar */}
      <div className="w-full bg-[#2D3142] text-[#D8D5DB] py-2 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 md:gap-16 items-center text-xs font-semibold tracking-wider">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ADACB5] rounded-full" aria-hidden="true" />
              <strong className="font-bold uppercase text-[11px] tracking-wider text-[#D8D5DB]">New Drop</strong>
              <span className="text-[#ADACB5]">?</span>
              <span>Limited Pieces</span>
              <span className="text-[#ADACB5]">?</span>
              <span>Free shipping on orders over ,1999</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto px-4 md:px-8 h-14 md:h-18 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-xl md:text-2xl font-black tracking-tight uppercase text-[#2D3142] hover:opacity-85 transition-opacity"
          >
            <Image 
              src="/devil-logo.png" 
              alt="Devil Clothes Logo" 
              width={32} 
              height={32} 
              className="rounded-full object-cover shadow-sm border border-[#ADACB5]/20"
            />
            DEVIL CLOTHES
          </Link>
        </div>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden md:flex items-center space-x-10 text-xs font-bold tracking-[0.2em] uppercase text-[#2D3142]">
          <Link href="/" className="hover:text-[#ADACB5] transition-colors py-2">
            Home
          </Link>
          <Link href="/shop" className="hover:text-[#ADACB5] transition-colors py-2">
            Shop
          </Link>
          <Link href="/collections" className="hover:text-[#ADACB5] transition-colors py-2">
            Collections
          </Link>
          <Link href="/about" className="hover:text-[#ADACB5] transition-colors py-2">
            About
          </Link>
        </div>

        {/* Right side Icons */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Search Button (Accessible 44px target) */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/20 active:scale-95 transition-all"
          >
            <Search className="w-5 h-5 stroke-[2.2px]" />
          </button>
          
          {/* Wishlist Button (Accessible 44px target) */}
          <button 
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/20 active:scale-95 transition-all"
          >
            <Heart className="w-5 h-5 stroke-[2.2px]" />
          </button>

          {/* Desktop User Account */}
          <Link
            href="/account"
            aria-label="Account"
            className="hidden md:flex min-w-11 h-11 px-3 rounded-full items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/20 active:scale-95 transition-all gap-2"
          >
            <User className="w-5 h-5 stroke-[2.2px]" />
            {isAuthenticated && profile?.full_name && (
              <span className="text-[10px] font-bold tracking-wider uppercase">
                Hi, {profile.full_name.split(' ')[0]}
              </span>
            )}
          </Link>
          
          {/* Desktop Cart Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
            className="hidden md:flex items-center justify-center h-11 px-3.5 rounded-full bg-[#2D3142] text-[#D8D5DB] hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm gap-2 text-xs font-bold tracking-wider"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2px]" />
            <span>{cartCount}</span>
          </button>
        </div>
      </nav>
    </header>
    
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    
    <LoginGate 
      isOpen={showLoginGate} 
      onClose={() => setShowLoginGate(false)} 
      nextUrl="/wishlist" 
    />
    </>
  );
}
