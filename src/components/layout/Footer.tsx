"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#EBE9ED] text-[#2D3142] pt-16 pb-[110px] md:pb-14 px-5 md:px-8 border-t border-[#ADACB5]/30">
      <div className="container mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-12">
        {/* Brand Details */}
        <div className="space-y-4 flex flex-col items-start md:w-1/3 md:pr-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase leading-none text-[#2D3142]">
            DEVIL CLOTHES
          </h2>
          <p className="text-[#2D3142]/75 text-xs md:text-sm font-semibold leading-relaxed max-w-sm tracking-wide">
            Premium streetwear engineered for the streets. Built for your style. Wear your attitude.
          </p>
        </div>

        <div className="flex flex-row gap-12 md:w-1/3 justify-between md:justify-around">
          {/* Links: Shop */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">Shop</h3>
            <ul className="space-y-3 text-xs font-semibold text-[#2D3142]/75">
              <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block">New Arrivals</Link></li>
              <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block">Hoodies</Link></li>
              <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block">T-Shirts</Link></li>
              <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block">Pants</Link></li>
              <li><Link href="/shop" className="hover:text-[#2D3142] transition-colors inline-block">Accessories</Link></li>
            </ul>
          </div>

          {/* Links: Support */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-black tracking-[0.2em] uppercase text-xs text-[#2D3142]">Support</h3>
            <ul className="space-y-3 text-xs font-semibold text-[#2D3142]/75">
              <li><Link href="/contact" className="hover:text-[#2D3142] transition-colors inline-block">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block">FAQ & Sizing</Link></li>
              <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block">Shipping & Returns</Link></li>
              <li><Link href="/about" className="hover:text-[#2D3142] transition-colors inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-4 md:w-1/3 md:pl-10">
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
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-6 border-t border-[#ADACB5]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-[#2D3142]/70 font-bold tracking-widest uppercase text-center md:text-left">
          &copy; {new Date().getFullYear()} DEVIL CLOTHES. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
