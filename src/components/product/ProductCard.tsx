import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

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
  };
}

export default function ProductCard({ product }: ProductProps) {
  const slug = product.slug || product.id;
  const imageUrl =
    product.images?.[0] ||
    product.image ||
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
  const isNew = product.featured || product.isNew;
  const currentPrice = product.price;
  const crossedOutPrice = product.original_price;

  return (
    <div className="group relative flex flex-col bg-[#C7C5CF] rounded-[20px] md:rounded-[24px] p-2 md:p-2.5 border border-[#ADACB5] shadow-card hover:shadow-soft transition-all duration-300">
      {/* 4:5 Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px] md:rounded-[18px] bg-[#D8D5DB]">
        {isNew && !crossedOutPrice && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2D3142] text-[#D8D5DB] px-2.5 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            NEW
          </div>
        )}
        {crossedOutPrice && (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#2D3142] text-[#D8D5DB] px-2.5 py-0.5 text-[9px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            SALE
          </div>
        )}

        {/* Floating Circular Wishlist Button */}
        <button
          type="button"
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-[#D8D5DB]/85 backdrop-blur-md border border-white/60 text-[#2D3142] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <Heart className="w-4 h-4 stroke-[2.2px]" />
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

      {/* Details Area */}
      <div className="flex flex-col pt-2.5 pb-1 px-1.5 space-y-1">
        <span className="text-[9px] md:text-[10px] text-[#2D3142]/70 font-black tracking-[0.2em] uppercase line-clamp-1">
          {product.category}
        </span>

        <Link
          href={`/product/${slug}`}
          className="font-bold text-xs md:text-sm text-[#2D3142] tracking-wide uppercase hover:opacity-75 transition-opacity line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="text-xs md:text-sm font-black flex items-center gap-1.5 pt-0.5">
          <span className="text-[#2D3142]">₹{currentPrice.toLocaleString("en-IN")}</span>
          {crossedOutPrice && (
            <span className="text-[#2D3142]/50 line-through text-[10px] md:text-xs font-semibold">
              ₹{crossedOutPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
