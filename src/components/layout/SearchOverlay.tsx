"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Search as SearchIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "Published")
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(10);
        
      if (!error && data) {
        setResults(data);
      }
      setIsLoading(false);
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:pt-16">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2D3142]/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Search Panel */}
      <div 
        className="relative w-full h-full md:h-auto md:max-h-[80vh] md:max-w-3xl bg-[#F9F9FB] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 md:zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 md:p-6 border-b border-[#ADACB5]/20 flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-[#2D3142]/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tees, hoodies, cargos..."
            className="flex-1 bg-transparent text-base md:text-xl font-bold tracking-tight text-[#2D3142] placeholder:text-[#2D3142]/30 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#EBE9ED] flex items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {query.trim() === "" ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pt-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#2D3142] mb-2">Search Devil Clothes</h3>
              <p className="text-xs font-semibold">Start typing to discover pieces.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center pt-10">
              <div className="w-8 h-8 border-2 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug || product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-[16px] hover:bg-white border border-transparent hover:border-[#ADACB5]/30 transition-all group"
                >
                  <div className="relative w-16 h-20 rounded-[10px] overflow-hidden bg-[#D8D5DB] shrink-0">
                    <Image
                      src={product.images?.[0] || product.image || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#ADACB5] mb-1">
                      {product.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#2D3142] line-clamp-1 group-hover:text-[#2D3142]/70 transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs font-black text-[#2D3142] mt-1">
                      ₹1{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center pt-20">
              <h3 className="text-xl font-black uppercase tracking-tight text-[#2D3142] mb-2">No pieces found</h3>
              <p className="text-sm font-semibold text-[#2D3142]/70">Try another search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
