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
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] mb-3 md:mb-4 rounded-[12px] md:rounded-[16px]">
        {product.isNew && !product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-white text-black px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full">
            NEW
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-black text-white border border-white/20 px-2.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md rounded-full">
            SALE
          </div>
        )}
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white border border-white/20 backdrop-blur-md text-white hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors">
          <Heart className="w-5 h-5" />
        </button>

        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
      </div>

      {/* Details */}
      <div className="flex flex-col space-y-1.5 px-1">
        <div className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="font-bold text-[13px] md:text-[15px] tracking-wide uppercase hover:text-gray-400 transition-colors line-clamp-2">
          {product.name}
        </Link>
        <div className="text-[14px] md:text-[16px] font-medium flex items-center gap-2 pt-1">
          {product.salePrice ? (
            <>
              <span className="text-white font-bold">₹{product.salePrice.toLocaleString('en-IN')}</span>
              <span className="text-gray-600 line-through text-[11px] md:text-xs">₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="text-gray-300">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
