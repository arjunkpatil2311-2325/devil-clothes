"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

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
    items.map((i) => ({ product: i.product as any, size: i.size, quantity: i.quantity })),
    total
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D3142]/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-[#D8D5DB] border-l border-[#ADACB5] shadow-float flex flex-col transform transition-transform duration-300 ease-in-out text-[#2D3142]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#ADACB5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-black tracking-tight uppercase">Bag ({items.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
            className="w-9 h-9 rounded-full bg-[#C7C5CF] border border-[#ADACB5] flex items-center justify-center text-[#2D3142] hover:scale-105 transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
              <div className="w-14 h-14 rounded-full bg-[#C7C5CF] border border-[#ADACB5] flex items-center justify-center text-[#2D3142] shadow-sm">
                <ShoppingBag className="w-6 h-6 stroke-[1.8px]" />
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase text-[#2D3142]">
                Your Bag Is Empty
              </h3>
              <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider">
                Explore our latest releases and claim your favorites.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3 rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] transition-all shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const itemPrice = item.product.price;
              const imageUrl =
                item.product.images?.[0] ||
                item.product.image ||
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop";
              const slug = item.product.slug || item.product.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#C7C5CF] rounded-[20px] p-3.5 border border-[#ADACB5] shadow-card flex gap-3.5 items-center"
                >
                  <div className="relative w-18 h-22 bg-[#D8D5DB] rounded-[14px] overflow-hidden shrink-0 border border-[#ADACB5]">
                    <Image src={imageUrl} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs tracking-wide uppercase hover:opacity-75 transition-opacity line-clamp-1 pr-2 text-[#2D3142]"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          className="text-[#2D3142]/50 hover:text-[#2D3142] transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-[#2D3142]/80 font-black tracking-widest uppercase mt-0.5">
                        Size: {item.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center bg-[#D8D5DB] border border-[#ADACB5] rounded-full px-1.5 py-0.5 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-[#2D3142]"
                        >
                          -
                        </button>
                        <span className="text-xs font-black px-2 text-[#2D3142]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-[#2D3142]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-black text-[#2D3142]">
                        ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Area */}
        {items.length > 0 && (
          <div className="border-t border-[#ADACB5] p-5 bg-[#C7C5CF]">
            <div className="space-y-2 mb-4 text-xs font-semibold uppercase tracking-wider">
              <div className="flex justify-between text-[#2D3142]/70">
                <span>Subtotal</span>
                <span className="font-bold text-[#2D3142]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-[#2D3142]/70">
                <span>Shipping</span>
                <span className="font-bold text-[#2D3142]">
                  {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black tracking-tight pt-2 border-t border-[#ADACB5] text-[#2D3142]">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all flex items-center justify-center shadow-soft"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#D8D5DB] text-[#2D3142] border border-[#ADACB5] py-3 min-h-[44px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-white active:scale-98 transition-all flex items-center justify-center shadow-card"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#2D3142]" />
                Order on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
