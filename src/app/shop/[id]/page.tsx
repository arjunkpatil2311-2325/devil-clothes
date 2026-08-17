import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Share2, Truck, RotateCcw } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = mockProducts.find(p => p.id === id) || mockProducts.find(p => p.name.toLowerCase() === id.toLowerCase());

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-6 border-b border-white/10">
        <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Product Image Gallery */}
          <div className="flex flex-col space-y-4">
            <div className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.isNew && !product.salePrice && (
                <div className="absolute top-4 left-4 z-10 bg-white text-black px-3 py-1.5 text-xs font-black tracking-widest uppercase">
                  NEW
                </div>
              )}
              {product.salePrice && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1.5 text-xs font-black tracking-widest uppercase">
                  SALE
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-8 border-b border-white/10 pb-8">
              <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-4">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                {product.name}
              </h1>
              <div className="text-2xl font-medium flex items-center gap-4">
                {product.salePrice ? (
                  <>
                    <span className="text-red-500">₹{product.salePrice.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 line-through text-lg">₹{product.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="text-white">₹{product.price.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold tracking-widest uppercase">Size</span>
                <button className="text-xs text-gray-400 border-b border-gray-400 hover:text-white hover:border-white transition-colors">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button 
                    key={size}
                    className="border border-white/20 py-4 text-sm font-bold hover:border-white transition-colors uppercase focus:bg-white focus:text-black"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-12">
              <button className="flex-1 bg-white text-black py-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors">
                Add To Cart
              </button>
              <button className="p-4 border border-white/20 hover:border-white hover:bg-white/5 transition-colors flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Details & Shipping */}
            <div className="space-y-6 text-sm text-gray-400">
              <p className="leading-relaxed">
                Premium heavyweight cotton construction. Features a slightly oversized, 
                boxy fit with dropped shoulders. Pre-shrunk and garment dyed for a 
                vintage wash effect. 
              </p>
              <ul className="list-disc list-inside space-y-2 pt-4 border-t border-white/10">
                <li>100% Organic Cotton</li>
                <li>400 GSM Heavyweight Fabric</li>
                <li>Designed in Tokyo, Manufactured ethically</li>
                <li>Machine wash cold, lay flat to dry</li>
              </ul>
              
              <div className="pt-8 space-y-4 border-t border-white/10">
                <div className="flex items-center gap-4 text-white">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="font-bold tracking-wider text-xs uppercase">Free Shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="font-bold tracking-wider text-xs uppercase">14-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Share2 className="w-5 h-5 text-gray-400" />
                  <span className="font-bold tracking-wider text-xs uppercase">Share This Drop</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
