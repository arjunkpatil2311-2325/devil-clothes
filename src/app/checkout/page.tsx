"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, AlertCircle, ShoppingBag, UserX, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { LoginGate } from "@/components/ui/LoginGate";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [items, router, isSuccess]);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setShowLoginGate(true);
      return;
    }

    setIsSubmitting(true);

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

    const payloadItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      size: item.size,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems,
          contact,
          shipping: addressDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setIsSuccess(true);
      
      // Play sound
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const playTone = (freq: number, startTime: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
          gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + startTime);
          osc.stop(ctx.currentTime + startTime + duration);
        };
        playTone(523.25, 0, 0.15); // C5
        playTone(659.25, 0.1, 0.15); // E5
        playTone(783.99, 0.2, 0.4); // G5
      } catch (e) {}

      setTimeout(() => {
        clearCart();
        router.push(`/order/${data.orderNumber}`);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      showToast({
        type: "error",
        title: "ORDER COULDN'T BE COMPLETED",
        message: err.message || "We couldn't create your order right now. Your cart is safe. Please try again.",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex-1 bg-[#D8D5DB] flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB]">

    {isSuccess && (
      <div className="fixed inset-0 z-[100] bg-[#1E9540] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform animate-bounce">
            <Check className="w-12 h-12 text-[#1E9540] stroke-[3]" />
          </div>
        </div>
        <h2 className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase animate-in slide-in-from-bottom-4 duration-500">
          Order Confirmed
        </h2>
        <p className="text-white/80 font-semibold tracking-widest text-xs uppercase mt-2 animate-in slide-in-from-bottom-8 duration-700">
          Preparing your receipt...
        </p>
      </div>
    )}

      <LoginGate isOpen={showLoginGate} onClose={() => setShowLoginGate(false)} />
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#D8D5DB]/85 backdrop-blur-2xl border-b border-[#ADACB5]/60 py-3.5 px-4 md:px-8 flex items-center justify-between">
        <Link
          href="/cart"
          className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] hover:opacity-75 transition-opacity flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bag
        </Link>
        <div className="text-base md:text-lg font-black tracking-tight uppercase text-[#2D3142]">
          DEVIL CLOTHES
        </div>
        <div className="w-16 hidden md:block" />
      </div>

      <div className="container mx-auto max-w-5xl px-3 md:px-6 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Checkout Form (7 cols) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] p-5 md:p-8 border border-[#ADACB5]/60 shadow-card">
              <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase mb-6 text-[#2D3142]">
                Shipping & Contact
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* Contact Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] pb-1 border-b border-[#ADACB5]">
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={profile?.full_name || ""}
                      placeholder="Full Name"
                      className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      defaultValue={profile?.phone || ""}
                      placeholder="WhatsApp Mobile Number"
                      className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      defaultValue={profile?.email || user?.email || ""}
                      placeholder="Email Address"
                      className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                  </div>
                </div>

                {/* Delivery Address Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] pb-1 border-b border-[#ADACB5]">
                    Delivery Address
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="Street Address, House / Flat No."
                      className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                    <input
                      type="text"
                      name="apartment"
                      placeholder="Apartment, Landmark, Suite (optional)"
                      className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="City"
                        className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                      />
                      <input
                        type="text"
                        name="state"
                        required
                        placeholder="State"
                        className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                      />
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      required
                      placeholder="PIN Code"
                      className="w-full md:w-1/2 bg-[#D8D5DB] border border-[#ADACB5] rounded-[16px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                    />
                  </div>
                </div>

                {/* WhatsApp Pre-order Notice */}
                <div className="bg-[#D8D5DB] rounded-[18px] border border-[#ADACB5] p-4 space-y-1.5 shadow-sm">
                  <h4 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">
                    WhatsApp Direct Pre-Order
                  </h4>
                  <p className="text-[11px] text-[#2D3142]/80 leading-relaxed font-semibold uppercase tracking-wide">
                    Clicking "Order Now" reserves your pieces and launches WhatsApp to confirm order specifics.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2D3142] text-[#D8D5DB] py-4 min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all disabled:opacity-50 flex justify-center items-center shadow-soft"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#D8D5DB] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "ORDER NOW"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-5 md:p-8 border border-[#ADACB5] shadow-card">
              <h2 className="text-lg font-black tracking-tight uppercase mb-4 text-[#2D3142]">
                Order Items ({items.length})
              </h2>

              <div className="space-y-3 mb-6 max-h-[36vh] overflow-y-auto pr-1 no-scrollbar divide-y divide-[#ADACB5]/30">
                {items.map((item) => {
                  const itemPrice = item.product.price;
                  return (
                    <div key={item.id} className="flex gap-3.5 pt-3 first:pt-0 items-center">
                      <div className="relative w-14 h-18 bg-[#D8D5DB] rounded-[12px] overflow-hidden shrink-0 border border-[#ADACB5]">
                        <Image
                          src={
                            item.product.images?.[0] ||
                            item.product.image ||
                            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000"
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1 right-1 bg-[#2D3142] text-[#D8D5DB] w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black z-10">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <div className="font-bold text-xs tracking-wide uppercase line-clamp-1 text-[#2D3142]">
                          {item.product.name}
                        </div>
                        <div className="text-[10px] text-[#2D3142]/80 font-black uppercase mt-0.5">
                          Size: {item.size}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm font-black text-[#2D3142] shrink-0">
                        ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#ADACB5] pt-4 space-y-2.5 text-xs font-semibold uppercase tracking-wider">
                <div className="flex justify-between text-[#2D3142]/70">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D3142]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#2D3142]/70">
                  <span>Delivery</span>
                  <span className="font-bold text-[#2D3142]">
                    {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#ADACB5] pt-4 mt-4 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-[#2D3142]/70 font-black tracking-[0.2em] uppercase block">
                    Total
                  </span>
                  <span className="text-2xl font-black text-[#2D3142]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[10px] text-[#2D3142]/60 font-bold uppercase tracking-widest pb-1">
                  INR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
