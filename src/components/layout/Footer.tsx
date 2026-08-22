"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#EBE9ED] text-[#2D3142] pt-16 pb-14 px-4 md:px-8 border-t border-[#ADACB5]/30">
      <div className="container mx-auto space-y-12 md:space-y-0 md:grid md:grid-cols-4 md:gap-12 mb-12">
        {/* Brand Details */}
        <div className="space-y-4 flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none text-[#2D3142]">
            DEVIL CLOTHES
          </h2>
          <p className="text-[#2D3142]/75 text-xs md:text-sm font-semibold leading-relaxed max-w-sm uppercase tracking-wide">
            Premium streetwear engineered for the streets.<br />
            Built for your style. Wear your attitude.
          </p>
        </div>

        {/* Links: Shop */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">Shop</h3>
          <ul className="space-y-2.5 text-xs font-semibold text-[#2D3142]/75">
            <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">New Arrivals</Link></li>
            <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Hoodies</Link></li>
            <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">T-Shirts</Link></li>
            <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Pants</Link></li>
            <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Accessories</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">Support</h3>
          <ul className="space-y-2.5 text-xs font-semibold text-[#2D3142]/75">
            <li><Link href="/contact" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">FAQ & Sizing</Link></li>
            <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Shipping & Returns</Link></li>
            <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block py-0.5">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-4 md:max-w-xs">
          <h3 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">Newsletter</h3>
          <p className="text-[#2D3142]/70 text-xs font-semibold leading-relaxed">
            Join the community for exclusive drops and private releases.
          </p>
          <form className="flex items-center w-full bg-[#D8D5DB] p-1.5 rounded-full border border-[#ADACB5]/40 focus-within:border-[#2D3142] transition-colors shadow-sm">
            <label htmlFor="footer-newsletter-input" className="sr-only">
              Email Address
            </label>
            <input 
              id="footer-newsletter-input"
              type="email" 
              required
              placeholder="Enter your email" 
              className="bg-transparent text-xs w-full outline-none pl-3.5 pr-2 py-1.5 text-[#2D3142] placeholder:text-[#2D3142]/45 font-medium"
            />
            <button 
              type="submit"
              aria-label="Subscribe to newsletter"
              className="bg-[#2D3142] text-[#D8D5DB] p-2.5 rounded-full hover:bg-[#3D4258] active:scale-95 transition-all shrink-0 flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex space-x-6 text-xs font-bold tracking-widest uppercase text-[#2D3142] pt-2">
            <a
              href="https://www.instagram.com/devil_cloths_hub/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              IG
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              WA
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-8 border-t border-[#ADACB5]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#2D3142]/75 font-normal tracking-wide text-center md:text-left">
          © {new Date().getFullYear()} DEVIL CLOTHES. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
