"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistProducts, isLoading } = useWishlist();
  const { isAuthenticated, loading: isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex-1 bg-[#D8D5DB] flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex-1 bg-[#D8D5DB] flex flex-col items-center justify-center px-4 text-center min-h-[70vh]">
        <div className="bg-[#ECEAEF] p-8 md:p-12 rounded-[24px] md:rounded-[36px] border border-[#ADACB5]/60 shadow-card flex flex-col items-center max-w-lg w-full">
          <h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D3142] tracking-tight mb-4">
            WISHLIST IS WAITING
          </h1>
          <p className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-[#2D3142]/70 mb-8 max-w-md">
            Log in to save your favorite pieces and access them from anywhere.
          </p>
          <div className="flex flex-col w-full gap-3">
            <Link
              href="/login?redirect=/wishlist"
              className="bg-[#2D3142] text-[#D8D5DB] w-full min-h-[48px] flex justify-center items-center rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm active:scale-95"
            >
              LOG IN
            </Link>
            <Link
              href="/signup?redirect=/wishlist"
              className="bg-[#D8D5DB] text-[#2D3142] border border-[#ADACB5] w-full min-h-[48px] flex justify-center items-center rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-white transition-all shadow-sm active:scale-95"
            >
              CREATE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB]">
      <section className="px-3 pt-6 pb-12 md:px-8 md:pt-10 md:pb-16 flex-1 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2D3142] mb-8 md:mb-12 px-2">
          YOUR WISHLIST
        </h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] border border-[#ADACB5]/60 text-center shadow-card">
            <h2 className="text-xl md:text-3xl font-black uppercase text-[#2D3142] tracking-tight mb-3">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-[11px] md:text-xs font-bold tracking-widest uppercase text-[#2D3142]/70 mb-8">
              Save pieces you love and find them here later.
            </p>
            <Link
              href="/shop"
              className="bg-[#2D3142] text-[#D8D5DB] px-8 min-h-[48px] flex justify-center items-center rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm active:scale-95"
            >
              EXPLORE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
