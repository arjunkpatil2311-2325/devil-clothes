"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Layers, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  // Hide storefront bottom nav on specific pages (product detail, checkout, order tracking, admin dashboard)
  const hideOnRoutes = ["/checkout", "/order", "/product", "/admin"];
  if (hideOnRoutes.some((route) => pathname?.startsWith(route))) {
    return null;
  }

  const navItems = [
    {
      label: "HOME",
      icon: Home,
      href: "/",
    },
    {
      label: "SHOP",
      icon: Compass,
      href: "/shop",
    },
    {
      label: "COLLECTIONS",
      icon: Layers,
      href: "/collections",
    },
    {
      label: "CART",
      icon: ShoppingBag,
      href: "/cart",
      isCart: true,
    },
    {
      label: "ACCOUNT",
      icon: User,
      href: "/account",
    },
  ];

  return (
    <aside aria-label="Mobile Navigation" className="md:hidden fixed bottom-5 left-4 right-4 z-50 max-w-[420px] mx-auto pointer-events-none">
      <nav className="pointer-events-auto h-[68px] bg-[#D8D5DB]/80 backdrop-blur-2xl rounded-[24px] shadow-[0_14px_45px_rgba(45,49,66,0.22)] border border-white/65 px-2.5 flex items-center justify-between">
        {navItems.map((item) => {
          const isCartActive = item.isCart && pathname === "/cart";
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));

          if (item.isCart) {
            return (
              <button
                key={item.label}
                onClick={() => setIsCartOpen(true)}
                aria-label="Open Shopping Bag"
                className={`relative flex flex-col items-center justify-center min-w-[56px] h-[52px] px-2 rounded-[18px] transition-all duration-200 active:scale-95 ${
                  isCartActive
                    ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                    : "text-[#2D3142]/70 hover:text-[#2D3142]"
                }`}
              >
                <div className="relative">
                  <item.icon
                    className={`w-[20px] h-[20px] ${
                      isCartActive ? "stroke-[2.5px]" : "stroke-[2px]"
                    }`}
                  />
                  {cartCount > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center text-[9px] font-black leading-none ${
                        isCartActive
                          ? "bg-[#D8D5DB] text-[#2D3142]"
                          : "bg-[#2D3142] text-[#D8D5DB]"
                      } shadow-sm`}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-black tracking-wider mt-0.5 uppercase ${
                    isCartActive ? "text-[#D8D5DB]" : "text-[#2D3142]/70"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[52px] px-2 rounded-[18px] transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                  : "text-[#2D3142]/70 hover:text-[#2D3142]"
              }`}
            >
              <item.icon
                className={`w-[20px] h-[20px] ${
                  isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                }`}
              />
              <span
                className={`text-[9px] font-black tracking-wider mt-0.5 uppercase ${
                  isActive ? "text-[#D8D5DB]" : "text-[#2D3142]/70"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
