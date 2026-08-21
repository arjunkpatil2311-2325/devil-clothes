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
    <div className="group relative flex flex-col bg-[#ECEAEF] rounded-[22px] md:rounded-[26px] p-2.5 md:p-3 border border-[#ADACB5]/60 shadow-[0_6px_24px_rgba(45,49,66,0.08)] hover:shadow-[0_12px_32px_rgba(45,49,66,0.16)] hover:border-[#2D3142]/40 transition-all duration-300">
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
          aria-label="Add to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-white/70 text-[#2D3142] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
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

      {/* Product Details */}
      <div className="flex flex-col pt-3 pb-1 px-1.5 space-y-1">
        <span className="text-[10px] md:text-[11px] text-[#2D3142]/70 font-black tracking-[0.22em] uppercase line-clamp-1">
          {product.category}
        </span>

        <Link
          href={`/product/${slug}`}
          className="font-black text-xs md:text-sm text-[#2D3142] tracking-wide uppercase hover:opacity-75 transition-opacity line-clamp-1 leading-snug"
        >
          {product.name}
        </Link>

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
  );
}
