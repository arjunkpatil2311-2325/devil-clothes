"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  return (
    <div className="flex flex-col w-full min-h-screen bg-black px-4 py-12 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12">Your Cart</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-6 gap-4 border-b border-white/10 pb-4 text-xs font-bold tracking-widest uppercase text-gray-500">
                <div className="col-span-3">Product</div>
                <div className="col-span-1 text-center">Quantity</div>
                <div className="col-span-1 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>
              
              {items.map((item) => {
                const itemPrice = item.product.price;
                const imageUrl = item.product.images?.[0] || item.product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
                const slug = item.product.slug || item.product.id;

                return (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center border-b border-white/5 pb-8 relative group">
                    <div className="col-span-3 flex gap-6">
                      <div className="relative w-24 h-32 bg-[#111] shrink-0">
                        <Image 
                          src={imageUrl} 
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">
                          {item.product.category}
                        </div>
                        <Link href={`/product/${slug}`} className="font-bold text-sm tracking-wide uppercase hover:text-gray-300 transition-colors mb-2 line-clamp-2">
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-gray-400 font-bold tracking-widest uppercase">
                          Size: {item.size}
                        </div>
                        {/* Mobile Price & Quantity */}
                        <div className="md:hidden mt-4 flex items-center justify-between w-full">
                          <div className="text-sm font-medium">₹{itemPrice.toLocaleString('en-IN')}</div>
                          <div className="flex items-center border border-white/20">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-white/10">-</button>
                            <span className="text-xs font-bold px-2 w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-white/10">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex col-span-1 justify-center">
                      <div className="flex items-center border border-white/20">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-white/10">-</button>
                        <span className="text-xs font-bold px-2 w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-white/10">+</button>
                      </div>
                    </div>
                    
                    <div className="hidden md:block col-span-1 text-right font-medium">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                    
                    <div className="absolute top-0 right-0 md:relative md:col-span-1 flex justify-end">
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 sticky top-24">
                <h2 className="text-lg font-black tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-center text-xl font-black tracking-widest uppercase">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                
                <Link href="/checkout" className="w-full bg-white text-black py-4 px-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors flex items-center justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-white/10">
            <p className="text-xl font-bold tracking-widest uppercase text-gray-500 mb-8">
              Your cart is empty.
            </p>
            <Link 
              href="/shop"
              className="bg-white text-black px-8 py-4 font-black tracking-widest uppercase text-sm hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
