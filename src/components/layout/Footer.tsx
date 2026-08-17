"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-white text-black pt-16 md:pt-24 pb-12 px-4 md:px-8 mt-12 md:mt-24 overflow-hidden border-t border-black/10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16 mb-16">
        <div className="space-y-6 md:col-span-1 flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">DEVIL CLOTHES</h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">
            Premium streetwear designed for the bold. Built for your style. Wear your attitude.
          </p>
          <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase text-black pt-4">
            <a href="#" className="hover:text-gray-500 transition-colors">IG</a>
            <a href="#" className="hover:text-gray-500 transition-colors">WA</a>
            <a href="#" className="hover:text-gray-500 transition-colors">YT</a>
          </div>
        </div>
        
        {/* Mobile Accordions / Desktop Columns */}
        <div className="md:contents flex flex-col space-y-4">
          <div className="border-b border-black/10 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('shop')}
              className="w-full flex items-center justify-between md:cursor-default"
            >
              <h3 className="font-black tracking-widest uppercase text-xs md:text-sm md:mb-6">Shop</h3>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 ${openSection === 'shop' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm font-bold text-gray-500 uppercase tracking-wider overflow-hidden transition-all duration-300 md:h-auto md:opacity-100 ${openSection === 'shop' ? 'max-h-64 opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-none md:mt-0'}`}>
              <li><Link href="/shop" className="hover:text-black transition-colors block py-1">New Arrivals</Link></li>
              <li><Link href="/shop/hoodies" className="hover:text-black transition-colors block py-1">Hoodies</Link></li>
              <li><Link href="/shop/t-shirts" className="hover:text-black transition-colors block py-1">T-Shirts</Link></li>
              <li><Link href="/shop/pants" className="hover:text-black transition-colors block py-1">Pants</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-black transition-colors block py-1">Accessories</Link></li>
            </ul>
          </div>

          <div className="border-b border-black/10 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between md:cursor-default"
            >
              <h3 className="font-black tracking-widest uppercase text-xs md:text-sm md:mb-6">Support</h3>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 ${openSection === 'support' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm font-bold text-gray-500 uppercase tracking-wider overflow-hidden transition-all duration-300 md:h-auto md:opacity-100 ${openSection === 'support' ? 'max-h-64 opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-none md:mt-0'}`}>
              <li><Link href="/contact" className="hover:text-black transition-colors block py-1">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors block py-1">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors block py-1">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-black transition-colors block py-1">Size Guide</Link></li>
              <li><Link href="/track-order" className="hover:text-black transition-colors block py-1">Track Order</Link></li>
            </ul>
          </div>

          <div className="border-b border-black/10 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('company')}
              className="w-full flex items-center justify-between md:cursor-default"
            >
              <h3 className="font-black tracking-widest uppercase text-xs md:text-sm md:mb-6">Company</h3>
              <ChevronDown className={`w-4 h-4 md:hidden transition-transform duration-300 ${openSection === 'company' ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-4 text-sm font-bold text-gray-500 uppercase tracking-wider overflow-hidden transition-all duration-300 md:h-auto md:opacity-100 ${openSection === 'company' ? 'max-h-64 opacity-100 mt-6' : 'max-h-0 opacity-0 md:max-h-none md:mt-0'}`}>
              <li><Link href="/about" className="hover:text-black transition-colors block py-1">About Us</Link></li>
              <li><Link href="/story" className="hover:text-black transition-colors block py-1">Our Story</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition-colors block py-1">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors block py-1">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-6 md:col-span-1 md:ml-auto md:max-w-xs mt-8 md:mt-0 border-b border-black/10 md:border-none pb-12 md:pb-0">
          <h3 className="font-black tracking-widest uppercase text-xs md:text-sm">Newsletter</h3>
          <p className="text-gray-500 text-xs font-bold leading-relaxed uppercase tracking-wider">
            Be the first to know about new drops and exclusive offers.
          </p>
          <div className="flex items-center border border-black/20 focus-within:border-black transition-colors p-1">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent text-sm w-full outline-none px-4 py-3 placeholder:text-gray-400 font-medium"
            />
            <button className="bg-black text-white p-3 hover:bg-black/80 transition-colors shrink-0">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest text-center w-full md:text-left">
          © {new Date().getFullYear()} DEVIL CLOTHES. All rights reserved.
        </p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden md:block">
          Made with attitude.
        </p>
      </div>
    </footer>
  );
}
