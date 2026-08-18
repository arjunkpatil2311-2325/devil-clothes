"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Heart, Share2, Truck, RotateCcw, X, MessageCircle } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const { slug } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Fetch product by slug
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
        
      if (error || !productData) {
        setIsLoading(false);
        return; // Will trigger notFound naturally if we handle it below, but client-side we just show a state
      }
      
      setProduct(productData);

      // Fetch related products
      const { data: relatedData } = await supabase
        .from('products')
        .select('*')
        .eq('category', productData.category)
        .neq('id', productData.id)
        .limit(4);
        
      if (relatedData) {
        setRelatedProducts(relatedData);
      }
      
      setIsLoading(false);
    }
    
    loadData();
  }, [slug]);

  // Gallery
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="flex w-full min-h-screen bg-black items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="flex w-full min-h-screen bg-black items-center justify-center flex-col gap-4">
        <h1 className="text-white text-2xl font-black uppercase tracking-widest">Product Not Found</h1>
        <Link href="/shop" className="text-gray-400 hover:text-white border-b border-white pb-1 text-sm font-bold tracking-widest uppercase transition-colors">Return to Shop</Link>
      </div>
    );
  }

  if (!product) return null;

  const galleryImages = product.images && product.images.length > 0
    ? product.images 
    : [product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80", "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80", "https://images.unsplash.com/photo-1516826957135-700edeb5f9fc?w=800&q=80"];

  const sizes = ["S", "M", "L", "XL"]; // Mock sizes if the schema doesn't support an array of sizes natively yet

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    addToCart(product, selectedSize, quantity);
  };

  const currentPrice = product.price;
  const crossedOutPrice = product.original_price;

  const singleProductTotal = currentPrice * quantity;
  const productWhatsAppUrl = generateWhatsAppLink(
    [{ product: product as any, size: selectedSize || "Not Selected", quantity }], 
    singleProductTotal
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-black pb-32 md:pb-0">
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center space-x-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-gray-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Left: Product Image Gallery */}
          <div className="flex flex-col md:flex-row-reverse gap-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden group flex-1">
              <Image
                src={galleryImages[activeImage]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.featured && !crossedOutPrice && (
                <div className="absolute top-4 left-4 z-10 bg-white text-black px-3 py-1.5 text-xs font-black tracking-widest uppercase">
                  NEW
                </div>
              )}
              {crossedOutPrice && (
                <div className="absolute top-4 left-4 z-10 bg-[#7A2635] text-white px-3 py-1.5 text-xs font-black tracking-widest uppercase">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 md:w-20 overflow-x-auto no-scrollbar shrink-0">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-[3/4] w-16 md:w-full shrink-0 bg-[#111] overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-white' : 'border-transparent hover:border-white/50'}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mb-3">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                {product.name}
              </h1>
              <div className="text-xl md:text-2xl font-medium flex items-center gap-4">
                {crossedOutPrice ? (
                  <>
                    <span className="text-[#7A2635]">₹{currentPrice.toLocaleString('en-IN')}</span>
                    <span className="text-gray-500 line-through text-lg">₹{crossedOutPrice.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold tracking-widest uppercase">Size</span>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-gray-400 border-b border-gray-400 hover:text-white hover:border-white transition-colors tracking-widest uppercase"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                {sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border py-3 md:py-4 text-sm font-bold transition-colors uppercase ${
                      selectedSize === size 
                        ? 'bg-white text-black border-white' 
                        : 'border-white/20 hover:border-white text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Stock */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="block text-xs font-bold tracking-widest uppercase mb-4">Quantity</span>
                <div className="flex items-center border border-white/20 w-max">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold px-6">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
                {product.stock > 0 ? `${product.stock} IN STOCK` : <span className="text-[#7A2635]">OUT OF STOCK</span>}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex flex-col gap-3 mb-12">
              <div className="flex gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black py-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors"
                >
                  Add To Cart
                </button>
                <button className="p-4 border border-white/20 hover:border-white hover:bg-white/5 transition-colors flex items-center justify-center group">
                  <Heart className="w-5 h-5 group-hover:fill-white" />
                </button>
              </div>
              <a 
                href={productWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-black py-4 font-black tracking-widest uppercase text-sm hover:bg-[#20b858] transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Buy on WhatsApp
              </a>
            </div>

            {/* Details Accordion style */}
            <div className="space-y-6 pt-8 border-t border-white/10 text-sm text-gray-400">
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-2">Product Details</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Oversized, boxy fit</li>
                  <li>Dropped shoulders</li>
                  <li>Vintage wash treatment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold tracking-widest uppercase text-xs mb-2">Materials</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>100% Premium Organic Cotton</li>
                  <li>Heavyweight construction</li>
                </ul>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex items-center gap-4 text-white">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="font-bold tracking-wider text-[10px] md:text-xs uppercase">Free Shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="font-bold tracking-wider text-[10px] md:text-xs uppercase">14-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-4 text-white">
                  <Share2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                  <span className="font-bold tracking-wider text-[10px] md:text-xs uppercase">Share This Piece</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 border-t border-white/10">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-md border-t border-white/10 z-40 flex flex-col gap-2">
        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white text-black py-3 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors"
          >
            Add To Cart
          </button>
          <button className="p-3 border border-white/20 bg-black flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <a 
          href={productWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-black py-3 font-black tracking-widest uppercase text-xs flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Buy on WhatsApp
        </a>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/20 w-full max-w-2xl relative p-6 md:p-8">
            <button 
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-6">Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-xs font-bold tracking-widest uppercase text-gray-500">
                    <th className="py-4">Size</th>
                    <th className="py-4">Chest (in)</th>
                    <th className="py-4">Length (in)</th>
                    <th className="py-4">Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-4 font-bold">S</td>
                    <td className="py-4">38 - 40</td>
                    <td className="py-4">28</td>
                    <td className="py-4">8.5</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 font-bold">M</td>
                    <td className="py-4">40 - 42</td>
                    <td className="py-4">29</td>
                    <td className="py-4">9</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-4 font-bold">L</td>
                    <td className="py-4">42 - 44</td>
                    <td className="py-4">30</td>
                    <td className="py-4">9.5</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-bold">XL</td>
                    <td className="py-4">44 - 46</td>
                    <td className="py-4">31</td>
                    <td className="py-4">10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
