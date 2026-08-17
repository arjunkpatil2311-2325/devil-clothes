"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Package, ShoppingBag, MessageCircle, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "success">("details");
  const [orderId, setOrderId] = useState("");

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && step === "details") {
      router.push("/cart");
    }
  }, [items, step, router]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a random order ID like DC-8492
    const generatedOrderId = `DC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(generatedOrderId);
    setStep("success");
    clearCart();
  };

  if (step === "success") {
    const whatsappMessage = encodeURIComponent(`Hello Devil Clothes, I just placed order ${orderId} and have a question.`);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    return (
      <div className="flex flex-col w-full min-h-[80vh] bg-black px-4 py-16 md:py-24 items-center justify-center">
        <div className="max-w-xl text-center space-y-8">
          <div className="w-24 h-24 bg-white/5 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <div className="text-gray-500 font-bold tracking-widest uppercase text-sm mb-2">Order Placed</div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6">
              Thank you for shopping with Devil Clothes.
            </h1>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 inline-block w-full max-w-sm">
            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-1">Order</div>
            <div className="text-2xl font-black tracking-widest">{orderId}</div>
          </div>

          <p className="text-gray-400 font-medium tracking-wide text-sm md:text-base leading-relaxed max-w-md mx-auto">
            We'll contact you shortly to confirm your order availability and delivery details.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex-1 bg-[#111] border border-white/20 text-white py-4 px-6 font-black tracking-widest uppercase text-xs hover:border-white transition-colors flex items-center justify-center opacity-50 cursor-not-allowed">
              <Package className="w-4 h-4 mr-2" />
              Track Order
            </button>
            <Link 
              href="/shop"
              className="flex-1 bg-white text-black py-4 px-6 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <div className="flex justify-center">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:max-w-md bg-[#25D366] text-black py-4 px-6 font-black tracking-widest uppercase text-xs hover:bg-[#20b858] transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Prevent rendering checkout form if cart is empty (it will redirect via useEffect)
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
            
            <form onSubmit={handlePlaceOrder} className="space-y-10">
              
              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Contact</h3>
                <div className="space-y-4">
                  <input type="text" required placeholder="Full Name" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input type="tel" required placeholder="Mobile Number" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input type="email" required placeholder="Email Address" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>

              {/* Delivery */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Delivery</h3>
                <div className="space-y-4">
                  <input type="text" required placeholder="Street Address" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="City" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                    <input type="text" required placeholder="State" className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                  </div>
                  <input type="text" required placeholder="PIN Code" className="w-full md:w-1/2 bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-white pb-2 border-b border-white/10">Payment</h3>
                <div className="bg-[#111] border border-white/20 p-6 flex items-start gap-4">
                  <div className="mt-1">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold tracking-widest uppercase text-sm mb-1">Demo Order</h4>
                    <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wider">
                      Payment will be confirmed with the brand after order placement. No real payment is required at this stage.
                    </p>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-white text-black py-5 font-black tracking-widest uppercase hover:bg-gray-200 transition-colors">
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-1 lg:order-2 bg-[#050505] p-6 md:p-8 lg:p-10 border border-white/10 lg:border-none lg:bg-transparent">
            <h2 className="text-xl font-black tracking-tighter uppercase mb-8 hidden lg:block">Order Summary</h2>
            
            <div className="space-y-6 mb-8 border-b border-white/10 pb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item) => {
                const itemPrice = item.product.salePrice || item.product.price;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-[#111] border border-white/10 shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
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
                <span className="text-gray-400">Shipping</span>
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
