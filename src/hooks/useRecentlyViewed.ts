"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";

const STORAGE_KEY = "devil_recently_viewed";
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse recently viewed", e);
    }
  }, []);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recently viewed", e);
      }
      
      return updated;
    });
  };

  return { recentlyViewed, addRecentlyViewed };
}
