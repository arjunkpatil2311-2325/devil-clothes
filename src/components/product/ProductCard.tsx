import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";

interface ProductProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    category: string;
    price: number;
    original_price?: number | null;
    images?: string[];
    image?: string; // Fallback for old mock data
    featured?: boolean;
    isNew?: boolean; // Fallback for old mock data
  };
}

export default function ProductCard({ product }: ProductProps) {
  // Normalize data from Supabase or Mock
  const slug = product.slug || product.id;
  const imageUrl = product.images?.[0] || product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
  const isNew = product.featured || product.isNew;
  
  // In Supabase, `price` is selling price, `original_price` is the crossed out price
  // In UI old mock, `price` was regular, `salePrice` was discounted
  // We'll prioritize Supabase model:
  const currentPrice = product.price;
  const crossedOutPrice = product.original_price;

  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE] mb-3 md:mb-4 rounded-[12px] md:rounded-[14px] border border-[#171717]/5">
        {isNew && !crossedOutPrice && (
          <div className="absolute top-3 left-3 z-10 bg-[#0A0A0A] text-[#F5F3EE] px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            NEW
          </div>
        )}
        {crossedOutPrice && (
          <div className="absolute top-3 left-3 z-10 bg-[#7A2635] text-[#F5F3EE] px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md rounded-full shadow-sm">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 bg-[#F5F3EE] hover:bg-[#C9BDAA] text-[#0A0A0A] w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <Heart className="w-5 h-5" />
        </button>

        <Link href={`/product/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-col space-y-1.5 px-1">
        <div className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">
          {product.category}
        </div>
        <Link href={`/product/${slug}`} className="font-bold text-[13px] md:text-[14px] text-white tracking-wide uppercase hover:text-gray-300 transition-colors line-clamp-2">
          {product.name}
        </Link>
        <div className="text-[14px] md:text-[15px] font-medium flex items-center gap-2 pt-1">
          {crossedOutPrice ? (
            <>
              <span className="text-[#7A2635] font-black">₹{currentPrice.toLocaleString('en-IN')}</span>
              <span className="text-gray-500 line-through text-[11px] md:text-xs">₹{crossedOutPrice.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="text-white font-black">₹{currentPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
