"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Package, ShoppingBag, MessageCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const contact = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    };
    
    const addressDetails = {
      street: formData.get("street"),
      apartment: formData.get("apartment"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
    };

    const payloadItems = items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      size: item.size,
      quantity: item.quantity
    }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems,
          contact,
          shipping: addressDetails
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Order created successfully
      clearCart();
      router.push(`/order/${data.orderNumber}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Prevent rendering checkout form if cart is empty
  if (items.length === 0) {
    return null; 
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      <div className="container mx-auto px-4 md:px-6 py-6 border-b border-white/10 flex items-center">
        <Link href="/cart" className="text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Link>
        <div className="mx-auto text-xl font-black tracking-widest uppercase hidden md:block">
          DEVIL CLOTHES
        </div>
        <div className="md:w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Checkout Form */}
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-8">Checkout Information</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-500 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Contact</h3>
                <div className="space-y-4">
                  <input type="text" name="name" required placeholder="Full Name" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                  <input type="tel" name="phone" required placeholder="Mobile Number" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                  <input type="email" name="email" required placeholder="Email Address" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                </div>
              </div>

              {/* Delivery */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Delivery</h3>
                <div className="space-y-4">
                  <input type="text" name="street" required placeholder="Street Address" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                  <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" required placeholder="City" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                    <input type="text" name="state" required placeholder="State" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                  </div>
                  <input type="text" name="pincode" required placeholder="PIN Code" className="w-full md:w-1/2 bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" />
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Payment</h3>
                <div className="bg-[#111] border border-white/20 p-6">
                  <h4 className="font-bold tracking-widest uppercase text-sm mb-2">WhatsApp Pre-order</h4>
                  <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                    Clicking Order Now will secure your items and open WhatsApp to complete your manual payment. Your order is not confirmed until payment is sent.
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-black py-5 font-black tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "ORDER NOW"
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-1 lg:order-2 bg-[#050505] p-6 md:p-8 lg:p-10 border border-white/10 lg:border-none lg:bg-transparent">
            <h2 className="text-xl font-black tracking-tighter uppercase mb-8 hidden lg:block">Order Summary</h2>
            
            <div className="space-y-6 mb-8 border-b border-white/10 pb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item) => {
                const itemPrice = item.product.price;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-[#111] border border-white/10 shrink-0">
                      <Image src={item.product.images?.[0] || item.product.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000"} alt={item.product.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="font-bold text-xs tracking-wider uppercase line-clamp-1">{item.product.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">Size: {item.size}</div>
                    </div>
                    <div className="text-sm font-medium flex items-center shrink-0">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 text-sm font-medium mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 flex justify-between items-end">
              <span className="text-xl font-black tracking-widest uppercase">Total</span>
              <div className="flex items-end gap-2">
                <span className="text-xs text-gray-500 font-medium pb-1">INR</span>
                <span className="text-2xl font-black tracking-widest">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
