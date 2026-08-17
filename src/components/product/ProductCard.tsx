import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

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
      <Link href={`/product/${product.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a] mb-4 md:mb-6">
        {product.isNew && !product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-white text-black px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase">
            NEW
          </div>
        )}
        {product.salePrice && (
          <div className="absolute top-3 left-3 z-10 bg-black text-white border border-white/20 px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
            SALE
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Quick View Overlay */}
        <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center">
          <div className="bg-white text-black py-3 px-8 font-black tracking-[0.2em] text-[10px] uppercase transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center">
            View Product
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-col space-y-1.5 px-1 md:px-0">
        <div className="text-[9px] md:text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="font-bold text-xs md:text-sm tracking-wide uppercase hover:text-gray-400 transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="text-xs md:text-sm font-medium flex items-center gap-3">
          {product.salePrice ? (
            <>
              <span className="text-white">₹{product.salePrice.toLocaleString('en-IN')}</span>
              <span className="text-gray-600 line-through text-[10px] md:text-xs">₹{product.price.toLocaleString('en-IN')}</span>
            </>
          ) : (
            <span className="text-gray-300">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </div>
  );
}
