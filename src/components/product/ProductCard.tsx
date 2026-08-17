import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";

interface ProductProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    salePrice?: number;
    image: string;
    isNew?: boolean;
  };
}

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="group relative flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE] mb-3 md:mb-4 rounded-[12px] md:rounded-[14px] border border-[#171717]/5">
        {product.isNew && !product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-[#0A0A0A] text-[#F5F3EE] px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
            NEW
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-[#7A2635] text-[#F5F3EE] px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md rounded-full shadow-sm">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 bg-[#F5F3EE] hover:bg-[#C9BDAA] text-[#0A0A0A] w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <Heart className="w-5 h-5" />
        </button>

        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-col space-y-1.5 px-1">
        <div className="text-[10px] text-[#171717]/60 font-black tracking-[0.2em] uppercase">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="font-bold text-[13px] md:text-[14px] text-[#0A0A0A] tracking-wide uppercase hover:text-[#171717]/70 transition-colors line-clamp-2">
          {product.name}
        </Link>
        <div className="text-[14px] md:text-[15px] font-medium flex items-center gap-2 pt-1">
          {product.salePrice ? (
            <>
              <span className="text-[#7A2635] font-black">₹{product.salePrice.toLocaleString('en-IN')}</span>
              <span className="text-[#171717]/40 line-through text-[11px] md:text-xs">₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="text-[#0A0A0A] font-black">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
