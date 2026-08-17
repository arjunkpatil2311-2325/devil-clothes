"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, MessageCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const whatsappUrl = generateWhatsAppLink(
    items.map(i => ({ product: i.product as any, size: i.size, quantity: i.quantity })), 
    total
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-[70] w-full md:w-[480px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <h2 className="text-xl font-black tracking-widest uppercase">Cart ({items.length})</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
              <h3 className="text-2xl font-black tracking-widest uppercase text-gray-500">Your Bag Is Empty</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="bg-white text-black px-8 py-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const itemPrice = item.product.price; // Supabase uses `price` for selling price
                const imageUrl = item.product.images?.[0] || item.product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
                const slug = item.product.slug || item.product.id;

                return (
                  <div key={item.id} className="flex gap-4 border-b border-white/5 pb-6">
                    <div className="relative w-24 h-32 bg-[#111] shrink-0">
                      <Image 
                        src={imageUrl} 
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link 
                            href={`/product/${slug}`} 
                            onClick={() => setIsCartOpen(false)}
                            className="font-bold text-sm tracking-wide uppercase hover:text-gray-300 transition-colors line-clamp-2 pr-4"
                          >
                            {item.product.name}
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-1">
                          Size: {item.size}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/20">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-white/10"
                          >-</button>
                          <span className="text-xs font-bold px-2 w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-white/10"
                          >+</button>
                        </div>
                        <div className="text-sm font-medium">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Area */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 bg-black">
            <div className="space-y-3 mb-6 text-sm font-medium">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black tracking-widest uppercase pt-3 border-t border-white/10">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-white text-black py-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-black py-4 font-black tracking-widest uppercase text-sm hover:bg-[#20b858] transition-colors flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
