"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase/client";

type Category = "ALL" | "T-SHIRTS" | "HOODIES" | "PANTS" | "JACKETS" | "ACCESSORIES";
type SortOption = "Featured" | "Newest" | "Price: Low to High" | "Price: High to Low";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  original_price: number | null;
  images: string[];
  featured: boolean;
  created_at: string;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [activeSort, setActiveSort] = useState<SortOption>("Featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState(
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop"
  );

  const categories: Category[] = ["ALL", "T-SHIRTS", "HOODIES", "PANTS", "JACKETS", "ACCESSORIES"];
  const sortOptions: SortOption[] = ["Featured", "Newest", "Price: Low to High", "Price: High to Low"];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [prodRes, bannerRes] = await Promise.all([
          supabase
            .from("products")
            .select("*")
            .eq("status", "Published")
            .order("created_at", { ascending: false }),
          fetch("/api/admin/banners").then((r) => r.json()),
        ]);

        if (prodRes.data) {
          setProducts(prodRes.data);
        }
        if (bannerRes?.data?.shop_hero_image) {
          setHeroImage(bannerRes.data.shop_hero_image);
        }
      } catch (err) {
        console.error("Failed to load shop data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter products
  let filteredProducts = [...products];
  if (activeCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toUpperCase() === activeCategory
    );
  }

  // Sort products
  if (activeSort === "Newest") {
    filteredProducts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (activeSort === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (activeSort === "Featured") {
    filteredProducts.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Hero Header Card */}
      <section className="px-3 pt-2 pb-6 md:px-6 md:pt-4 md:pb-10">
        <div className="relative h-[30vh] min-h-[220px] max-h-[320px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#2D3142] flex items-center justify-center shadow-soft border border-[#ADACB5]/40">
          <Image
            src={heroImage}
            alt="Shop Catalog"
            fill
            priority
            className="object-cover opacity-50"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

          <div className="relative z-10 text-center px-4">
            <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[#ADACB5] uppercase block mb-1">
              Catalog Collection
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#D8D5DB] leading-none mb-2">
              ALL PRODUCTS
            </h1>
            <p className="text-[11px] md:text-xs text-[#ADACB5] font-semibold tracking-widest uppercase">
              Engineered street pieces for daily rotation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <section className="px-3 md:px-6 container mx-auto flex-1 pb-16">
        {/* Filter and Sort Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-[#ECEAEF] rounded-[22px] p-3 md:p-4 border border-[#ADACB5]/60 shadow-card">
          {/* Category Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-black tracking-wider uppercase px-4 py-2 rounded-full transition-all shrink-0 active:scale-95 ${
                  activeCategory === cat
                    ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                    : "bg-[#D8D5DB] text-[#2D3142] hover:bg-white border border-[#ADACB5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 shrink-0">
              Sort:
            </span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider outline-none focus:border-[#2D3142] cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2D3142] border-t-transparent"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#ECEAEF] rounded-[24px] border border-[#ADACB5]/60 p-12 text-center flex flex-col items-center justify-center shadow-card space-y-3">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase">
              Season 2026
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D3142] tracking-tight">
              New Inventory Dropping Soon
            </h3>
            <p className="text-xs md:text-sm text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-sm">
              We are restocking our latest catalog. Switch categories or check back shortly.
            </p>
            {activeCategory !== "ALL" && (
              <button
                onClick={() => setActiveCategory("ALL")}
                className="mt-2 bg-[#2D3142] text-[#D8D5DB] px-6 py-2.5 rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
