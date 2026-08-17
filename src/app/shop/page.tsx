"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import { supabase } from "@/lib/supabase/client";

type Category = "ALL" | "T-SHIRTS" | "HOODIES" | "PANTS" | "ACCESSORIES";
type SortOption = "Featured" | "Newest" | "Price: Low to High" | "Price: High to Low";

// Add Product interface based on Supabase
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

  const categories: Category[] = ["ALL", "T-SHIRTS", "HOODIES", "PANTS", "ACCESSORIES"];
  const sortOptions: SortOption[] = ["Featured", "Newest", "Price: Low to High", "Price: High to Low"];

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });
        
      if (data) {
        setProducts(data);
      }
      setIsLoading(false);
    }
    
    fetchProducts();
  }, []);

  // Filter products
  let filteredProducts = [...products];
  if (activeCategory !== "ALL") {
    filteredProducts = filteredProducts.filter(
      p => p.category.toUpperCase() === activeCategory
    );
  }

  // Sort products
  if (activeSort === "Newest") {
    filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (activeSort === "Price: Low to High") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === "Price: High to Low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (activeSort === "Featured") {
    filteredProducts.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-black flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop"
            alt="Shop Hero"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-[5rem] lg:text-[7rem] font-black tracking-tighter uppercase mb-4 leading-none">
            SHOP
          </h1>
          <p className="text-[10px] md:text-sm text-gray-400 max-w-xl font-bold tracking-[0.3em] uppercase">
            The Complete Collection.
          </p>
        </div>
      </section>

      <section className="py-8 px-4 md:px-6 container mx-auto flex-1">
        
        {/* Toolbar: Categories & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-6 md:space-y-0 border-b border-white/10 pb-6">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs md:text-sm font-bold tracking-widest uppercase transition-colors pb-1 border-b-2 ${
                  activeCategory === cat 
                    ? "text-white border-white" 
                    : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500 shrink-0">
              Sort By:
            </span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="bg-black text-white border border-white/20 px-3 py-2 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-white w-full md:w-auto"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-xl font-bold tracking-widest uppercase text-gray-500">
              No products found in this category.
            </p>
            <button 
              onClick={() => setActiveCategory("ALL")}
              className="mt-6 border-b border-white pb-1 text-sm font-bold tracking-widest uppercase hover:text-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
