"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

interface WishlistContextType {
  wishlistItems: string[];
  wishlistProducts: Product[];
  toggleWishlist: (productId: string) => Promise<boolean>; // returns new state
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadWishlist() {
      if (!isAuthenticated || !user) {
        setWishlistItems([]);
        setWishlistProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("wishlists")
          .select("product_id, products(*)")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading wishlist:", error);
          // Fallback or handle missing table
        } else if (data) {
          setWishlistItems(data.map((item) => item.product_id));
          setWishlistProducts(
            data
              .map((item) => item.products)
              .filter((p) => p != null) as unknown as Product[]
          );
        }
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWishlist();
  }, [isAuthenticated, user]);

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated || !user) {
      showToast({ type: "error", title: "Please login to save to wishlist" });
      return false;
    }

    const currentlyInWishlist = wishlistItems.includes(productId);
    
    // Optimistic UI update
    const newItems = currentlyInWishlist
      ? wishlistItems.filter((id) => id !== productId)
      : [...wishlistItems, productId];
      
    setWishlistItems(newItems);

    try {
      if (currentlyInWishlist) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
          
        if (error) {
          console.error("Delete wishlist error:", error);
          setWishlistItems(wishlistItems); // Revert
          showToast({ type: "error", title: "Failed to remove from wishlist" });
          return currentlyInWishlist;
        }

        setWishlistProducts(prev => prev.filter(p => p.id !== productId));
        showToast({ type: "success", title: "Removed from wishlist" });
      } else {
        const { error } = await supabase
          .from("wishlists")
          .insert({ user_id: user.id, product_id: productId });
          
        if (error) {
          console.error("Insert wishlist error:", error);
          setWishlistItems(wishlistItems); // Revert
          showToast({ type: "error", title: "Failed to add to wishlist" });
          return currentlyInWishlist;
        }

        // Fetch the full product to add it to the products array
        const { data } = await supabase.from("products").select("*").eq("id", productId).single();
        if (data) {
          setWishlistProducts(prev => [...prev, data as unknown as Product]);
        }
        showToast({ type: "success", title: "Added to wishlist" });
      }
      return !currentlyInWishlist;
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      // Revert on error
      setWishlistItems(wishlistItems);
      showToast({ type: "error", title: "An unexpected error occurred" });
      return currentlyInWishlist;
    }
  };

  const isInWishlist = (productId: string) => wishlistItems.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, wishlistProducts, toggleWishlist, isInWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
