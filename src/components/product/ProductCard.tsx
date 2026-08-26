"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { LoginGate } from "@/components/ui/LoginGate";

interface ProductProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    category: string;
    price: number;
    original_price?: number | null;
    images?: string[];
    image?: string;
    featured?: boolean;
    isNew?: boolean;
    review_count?: number;
    average_rating?: number;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const slug = product.slug || product.id;
  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
  const isNew = product.featured || product.isNew;
  const currentPrice = product.price;
  const crossedOutPrice = product.original_price;

  const saved = isInWishlist(product.id);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginGate(true);
      return;
    }
    
    if (isToggling) return;
    setIsToggling(true);
    await toggleWishlist(product.id);
    setIsToggling(false);
  };

  return (
    <>
    <div className="group relative flex flex-col h-full justify-between bg-[#ECEAEF] rounded-[22px] md:rounded-[26px] p-2 md:p-3 border border-[#ADACB5]/60 shadow-[0_6px_24px_rgba(45,49,66,0.08)] hover:shadow-[0_12px_32px_rgba(45,49,66,0.16)] hover:border-[#2D3142]/40 transition-all duration-300">
      <div className="flex flex-col gap-3">
      {/* 4:5 Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] md:rounded-[20px] bg-[#D8D5DB]">
        {isNew && !crossedOutPrice && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2D3142] text-[#D8D5DB] px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            NEW DROP
          </div>
        )}
        {crossedOutPrice && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2D3142] text-[#D8D5DB] px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            SALE
          </div>
        )}

        {/* Floating Circular Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-white/70 text-[#2D3142] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          <Heart className={`w-4 h-4 stroke-[2.2px] transition-colors ${saved ? "fill-red-500 stroke-red-500" : ""}`} />
        </button>

        <Link href={`/product/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
      </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col px-1.5 space-y-1">
        <span className="text-[10px] md:text-[11px] text-[#2D3142]/70 font-black tracking-[0.22em] uppercase line-clamp-1">
          {product.category}
        </span>

        <Link
          href={`/product/${slug}`}
          className="font-black text-xs md:text-sm text-[#2D3142] tracking-wide hover:opacity-75 transition-opacity line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>
        
        {product.review_count ? (
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 fill-[#2D3142] text-[#2D3142]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="text-[9px] font-black tracking-widest text-[#2D3142]/80 mt-0.5">
              {product.average_rating} ({product.review_count})
            </span>
          </div>
        ) : null}

        <div className="text-sm md:text-base font-black flex items-center gap-2 pt-0.5">
          <span className="text-[#2D3142]">₹{currentPrice.toLocaleString("en-IN")}</span>
          {crossedOutPrice && (
            <span className="text-[#2D3142]/50 line-through text-xs font-semibold">
              ₹{crossedOutPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
    
    <LoginGate 
      isOpen={showLoginGate} 
      onClose={() => setShowLoginGate(false)} 
      nextUrl="/wishlist" 
    />
    </>
  );
}
