"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Grid, Heart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Shop",
      icon: Search,
      href: "/shop",
    },
    {
      label: "Collections",
      icon: Grid,
      href: "/collections",
    },
    {
      label: "Account",
      icon: User,
      href: "/account",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-[#F5F3EE]/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#171717]/10 px-2 py-3 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
                isActive 
                  ? "text-[#7A2635] bg-[#171717]/5" 
                  : "text-[#171717]/60 hover:text-[#0A0A0A]"
              }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
              <span className={`text-[9px] font-bold tracking-wider uppercase ${isActive ? "text-[#7A2635]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Cart Button (opens drawer instead of linking) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all text-[#171717]/60 hover:text-[#0A0A0A] relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#7A2635] text-[#F5F3EE] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold tracking-wider uppercase">
            Cart
          </span>
        </button>
      </nav>
    </div>
  );
}
