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
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F9FB]">
        <div className="w-12 h-12 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F9F9FB] px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase text-[#2D3142] tracking-tighter mb-4">
          YOUR WISHLIST IS WAITING
        </h1>
        <p className="text-sm font-semibold text-[#2D3142]/70 mb-8 max-w-md">
          Log in to save your favorite pieces and access them from anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login?redirect=/wishlist"
            className="bg-[#2D3142] text-[#D8D5DB] px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#3D4258] transition-colors"
          >
            LOG IN
          </Link>
          <Link
            href="/signup?redirect=/wishlist"
            className="bg-[#D8D5DB] text-[#2D3142] border border-[#ADACB5]/30 px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase hover:bg-white transition-colors"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9FB] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2D3142] mb-10">
          YOUR WISHLIST
        </h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[24px] border border-[#ADACB5]/20 text-center">
            <h2 className="text-2xl font-black uppercase text-[#2D3142] tracking-tighter mb-4">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-sm font-semibold text-[#2D3142]/70 mb-8">
              Save pieces you love and find them here later.
            </p>
            <Link
              href="/shop"
              className="bg-[#2D3142] text-[#D8D5DB] px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#3D4258] transition-colors"
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
      </div>
    </div>
  );
}
