"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] px-3 py-8 md:py-16 text-[#2D3142]">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 md:mb-10 px-1">
          <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
            Review Bag
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none">
            Your Cart
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              {items.map((item) => {
                const itemPrice = item.product.price;
                const imageUrl =
                  item.product.images?.[0] ||
                  item.product.image ||
                  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
                const slug = item.product.slug || item.product.id;

                return (
                  <div
                    key={item.id}
                    className="bg-[#ECEAEF] rounded-[24px] p-3.5 md:p-5 border border-[#ADACB5]/60 shadow-card flex gap-4 items-center relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-26 md:w-24 md:h-32 bg-[#D8D5DB] rounded-[16px] overflow-hidden shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] text-[#2D3142]/70 font-black tracking-[0.2em] uppercase">
                            {item.product.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            className="text-[#2D3142]/50 hover:text-[#2D3142] transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <Link
                          href={`/product/${slug}`}
                          className="font-bold text-xs md:text-sm tracking-wide uppercase hover:opacity-75 transition-opacity line-clamp-1 text-[#2D3142]"
                        >
                          {item.product.name}
                        </Link>

                        <div className="text-[10px] text-[#2D3142]/80 font-black tracking-widest uppercase mt-0.5">
                          Size: {item.size}
                        </div>
                      </div>

                      {/* Pill Controls & Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-[#D8D5DB] border border-[#ADACB5] rounded-full px-1.5 py-0.5 shadow-inner">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-white active:scale-95 transition-all text-[#2D3142]"
                          >
                            -
                          </button>
                          <span className="text-xs font-black px-2.5 text-center text-[#2D3142]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs hover:bg-white active:scale-95 transition-all text-[#2D3142]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm md:text-base font-black text-[#2D3142]">
                          ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>

              {/* Order Summary (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] p-5 md:p-8 border border-[#ADACB5]/60 shadow-card sticky top-24">
                  <h2 className="text-lg font-black tracking-tight uppercase mb-5 pb-3 border-b border-[#ADACB5]/60">
                    Order Summary
                  </h2>

                <div className="space-y-3.5 mb-6 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  <div className="flex justify-between text-[#2D3142]/70">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#2D3142]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#2D3142]/70">
                    <span>Delivery</span>
                    <span className="font-bold text-[#2D3142]">
                      {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#ADACB5] pt-5 mb-7 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-[#2D3142]/70 font-black tracking-[0.2em] uppercase block">
                      Total Amount
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-[#2D3142]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#2D3142]/60 font-bold uppercase tracking-widest pb-1">
                    INR Incl. Taxes
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-[#2D3142] text-[#D8D5DB] py-4 min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all flex items-center justify-center shadow-soft"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2.5" />
                </Link>
              </div>
            </div>
          </div>
          ) : (
            <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] border border-[#ADACB5]/60 p-12 text-center flex flex-col items-center justify-center shadow-card space-y-3 min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-[#D8D5DB] border border-[#ADACB5]/60 flex items-center justify-center text-[#2D3142] shadow-sm">
                <ShoppingBag className="w-7 h-7 stroke-[1.8px]" />
              </div>
              <p className="text-xl md:text-2xl font-black tracking-tight uppercase text-[#2D3142] mb-1">
                Your bag is empty
              </p>
              <p className="text-[11px] md:text-xs text-[#2D3142]/70 font-bold uppercase tracking-widest max-w-sm mb-4">
                Explore our latest drops and select your statement pieces.
              </p>
              <Link
                href="/shop"
                className="bg-[#2D3142] text-[#D8D5DB] px-8 min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center justify-center hover:bg-[#3D4258] transition-all shadow-sm active:scale-95"
              >
                Shop Now
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
