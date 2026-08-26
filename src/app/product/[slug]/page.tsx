"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Truck, RotateCcw, X, MessageCircle, Share2 } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
import ReviewSection from "@/components/product/ReviewSection";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !productData) {
        setIsLoading(false);
        return;
      }

      setProduct(productData);

      const { data: relatedData } = await supabase
        .from("products")
        .select("*")
        .eq("category", productData.category)
        .neq("id", productData.id)
        .limit(4);

      if (relatedData) {
        setRelatedProducts(relatedData);
      }

      setIsLoading(false);
    }

    loadData();
  }, [slug]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#D8D5DB]">
        <div className="w-12 h-12 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#D8D5DB]">
        <h1 className="text-4xl font-black text-[#2D3142] uppercase tracking-tighter mb-4">
          Product Not Found
        </h1>
        <Link
          href="/shop"
          className="text-xs font-black uppercase tracking-widest text-[#D8D5DB] bg-[#2D3142] px-8 py-4 rounded-full hover:bg-[#3D4258] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.image ||
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
          "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
        ];

  const sizes = ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      document.getElementById('size-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast({
        type: "warning",
        title: "SIZE REQUIRED",
        message: "Select a size before adding this product to your cart."
      });
      setTimeout(() => setSizeError(false), 3000);
      return;
    }
    
    // Check if limit reached
    if (product.stock && quantity > product.stock) {
      showToast({
        type: "error",
        title: "LIMIT REACHED",
        message: `Only ${product.stock} units are currently available.`
      });
      return;
    }
    
    addToCart(product, selectedSize, quantity);
    
    showToast({
      type: "success",
      title: "ADDED TO CART",
      message: `${product.name} (Size ${selectedSize} · Qty ${quantity})`
    });
  };

  const currentPrice = product.price;
  const crossedOutPrice = product.original_price;
  const singleProductTotal = currentPrice * quantity;
  const productWhatsAppUrl = generateWhatsAppLink(
    [{ product: product as any, size: selectedSize || "Not Selected", quantity }],
    singleProductTotal
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] pb-32 md:pb-16 text-[#2D3142]">
      {/* Mobile Top Floating Controls */}
      <div className="sticky top-[56px] z-30 w-full px-3 py-2 md:hidden">
        <div className="flex items-center justify-between bg-[#D8D5DB]/85 backdrop-blur-2xl border border-white/60 rounded-full px-3 py-1.5 shadow-sm">
          <Link
            href="/shop"
            aria-label="Back to Shop"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/25 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2px]" />
          </Link>
          <span className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] truncate max-w-[180px]">
            {product.name}
          </span>
          <button
            type="button"
            aria-label="Add to Wishlist"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#2D3142] hover:bg-[#ADACB5]/25 active:scale-95 transition-all"
          >
            <Heart className="w-5 h-5 stroke-[2.2px]" />
          </button>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <div className="hidden md:block container mx-auto px-6 py-4">
        <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-[#2D3142]/70">
          <Link href="/" className="hover:text-[#2D3142] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#2D3142] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#2D3142] line-clamp-1 font-black">{product.name}</span>
        </div>
      </div>

      {/* Product Content Container */}
      <div className="container mx-auto px-3 md:px-6 pt-2 md:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Left: Product Image & Thumbnails */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Main Image Container */}
            <div className="relative aspect-[4/5] w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#ECEAEF] border border-[#ADACB5]/60 shadow-card">
              <Image
                src={galleryImages[activeImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {product.featured && !crossedOutPrice && (
                <div className="absolute top-4 left-4 z-10 bg-[#2D3142] text-[#D8D5DB] px-3.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
                  NEW
                </div>
              )}
              {crossedOutPrice && (
                <div className="absolute top-4 left-4 z-10 bg-[#2D3142] text-[#D8D5DB] px-3.5 py-1 text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-[4/5] w-18 md:w-20 shrink-0 rounded-[16px] overflow-hidden bg-[#ECEAEF] border-2 transition-all shadow-sm ${
                      activeImage === idx
                        ? "border-[#2D3142] scale-102"
                        : "border-[#ADACB5]/60 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info Card (French Gray background for contrast) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-[#ADACB5]/60 shadow-card flex flex-col">
              {/* Category & Title */}
              <div className="mb-5">
                <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1.5">
                  {product.category}
                </span>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight uppercase text-[#2D3142] leading-tight mb-2">
                    {product.name}
                  </h1>
                  
                  {/* Rating Summary */}
                  <div className="flex items-center gap-1.5 mb-3" onClick={() => {
                      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    <div className="flex text-[#2D3142] cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.average_rating || 0) ? "fill-[#2D3142]" : "text-[#ADACB5]/60"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      ))}
                    </div>
                    {product.review_count ? (
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 cursor-pointer hover:text-[#2D3142]">
                        {product.average_rating} ({product.review_count})
                      </span>
                    ) : (
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 cursor-pointer hover:text-[#2D3142]">
                        No Reviews
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                  <span className="text-2xl md:text-3xl font-black text-[#2D3142]">
                    ₹{currentPrice.toLocaleString("en-IN")}
                  </span>
                  {crossedOutPrice && (
                    <span className="text-base md:text-lg font-bold text-[#2D3142]/50 line-through">
                      ₹{crossedOutPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-[#2D3142]/80 font-semibold leading-relaxed mb-6 uppercase tracking-wide">
                {product.description}
              </p>

              {/* Pill Size Selector */}
              <div id="size-selector" className={`mb-6 transition-all duration-300 p-2 -mx-2 rounded-[20px] ${sizeError ? 'bg-red-100/50 ring-2 ring-red-500/50 animate-shake' : ''}`}>
                <div className="flex justify-between items-center mb-3 px-2">
                  <span className={`text-xs font-black tracking-widest uppercase ${sizeError ? 'text-red-600' : 'text-[#2D3142]'}`}>
                    Select Size {sizeError && '*'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] text-[#2D3142]/80 underline hover:text-[#2D3142] font-bold tracking-wider uppercase transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-full text-xs font-black tracking-wider uppercase transition-all shadow-sm ${
                        selectedSize === size
                          ? "bg-[#2D3142] text-[#D8D5DB] shadow-md scale-102"
                          : "bg-[#D8D5DB] border border-[#ADACB5]/60 text-[#2D3142] hover:bg-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Pill & Stock */}
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[11px] font-black tracking-widest uppercase text-[#2D3142] mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center bg-[#D8D5DB] border border-[#ADACB5]/60 rounded-full px-2 py-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-[#2D3142] hover:bg-white active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <span className="text-xs font-black px-3.5 text-[#2D3142]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-[#2D3142] hover:bg-white active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase block text-[#2D3142]/70 mb-1">
                    Availability
                  </span>
                  <span className="text-xs font-black tracking-wider uppercase text-[#2D3142]">
                    {product.stock > 0 ? `${product.stock} IN STOCK` : "OUT OF STOCK"}
                  </span>
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex flex-col gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#2D3142] text-[#D8D5DB] py-4 min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all shadow-soft"
                >
                  Add To Cart
                </button>
                <a
                  href={productWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#D8D5DB] text-[#2D3142] border border-[#ADACB5]/60 py-4 min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-white active:scale-98 transition-all flex items-center justify-center shadow-card"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-[#2D3142]" />
                  Order on WhatsApp
                </a>
              </div>

              {/* Trust Features Accordion */}
              <div className="border-t border-[#ADACB5]/60 pt-5 space-y-3.5 text-xs text-[#2D3142]/85 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-[#2D3142]" />
                  <span>Free shipping on orders over ₹999</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-[#2D3142]" />
                  <span>14-Day Easy Returns & Exchange</span>
                </div>
                <div className="flex items-center gap-3">
                  <Share2 className="w-4 h-4 text-[#2D3142]" />
                  <span>100% Premium Heavyweight Cotton</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-3 md:px-6 pt-16 md:pt-24 border-t border-[#ADACB5]/60/40 mt-12">
          <div className="mb-6 px-1">
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
              Complementary
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142] leading-none">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Floating Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-[#D8D5DB]/90 backdrop-blur-2xl border-t border-white/60 z-40 flex gap-2.5 shadow-float">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs active:scale-98 transition-all shadow-sm flex items-center justify-center"
        >
          Add To Cart
        </button>
        <a
          href={productWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#ECEAEF] text-[#2D3142] border border-[#ADACB5]/60 py-3.5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs active:scale-98 transition-all shadow-sm flex items-center justify-center"
        >
          <MessageCircle className="w-4 h-4 mr-1.5 text-[#2D3142]" />
          WhatsApp
        </a>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3142]/70 backdrop-blur-sm">
          <div className="bg-[#ECEAEF] border border-[#ADACB5]/60 rounded-[24px] w-full max-w-xl relative p-6 md:p-8 shadow-float text-[#2D3142]">
            <button
              type="button"
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#D8D5DB] border border-[#ADACB5]/60 flex items-center justify-center text-[#2D3142] hover:scale-105 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase mb-4">
              Size Guide (Inches)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs uppercase font-bold">
                <thead>
                  <tr className="border-b border-[#ADACB5]/60 text-[#2D3142]/70 tracking-widest">
                    <th className="py-3">Size</th>
                    <th className="py-3">Chest</th>
                    <th className="py-3">Length</th>
                    <th className="py-3">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ADACB5]/30">
                  <tr>
                    <td className="py-3 font-black text-[#2D3142]">S</td>
                    <td className="py-3">38 - 40"</td>
                    <td className="py-3">28"</td>
                    <td className="py-3">8.5"</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-black text-[#2D3142]">M</td>
                    <td className="py-3">40 - 42"</td>
                    <td className="py-3">29"</td>
                    <td className="py-3">9.0"</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-black text-[#2D3142]">L</td>
                    <td className="py-3">42 - 44"</td>
                    <td className="py-3">30"</td>
                    <td className="py-3">9.5"</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-black text-[#2D3142]">XL</td>
                    <td className="py-3">44 - 46"</td>
                    <td className="py-3">31"</td>
                    <td className="py-3">10.0"</td>
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
