import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F5F3EE] text-[#0A0A0A] pt-16 pb-12 px-4 md:px-8 overflow-hidden border-t border-[#171717]/10">
      <div className="container mx-auto flex flex-col space-y-[48px] md:space-y-0 md:grid md:grid-cols-4 md:gap-16 mb-16">
        
        {/* Brand Details */}
        <div className="space-y-4 flex flex-col items-start md:text-left">
          <h2 className="text-[28px] md:text-[34px] font-black tracking-tighter uppercase leading-none text-[#0A0A0A]">DEVIL CLOTHES</h2>
          <p className="text-[#171717]/80 text-[14px] font-bold leading-relaxed max-w-sm uppercase">
            Premium streetwear designed for the bold.<br />
            Built for your style. Wear your attitude.
          </p>
        </div>
        
        {/* Stacked Links - Mobile / Grid - Desktop */}
        <div className="space-y-6 md:space-y-0 md:contents">
          
          {/* Shop */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-black tracking-widest uppercase text-[15px] md:text-[16px] text-[#0A0A0A]">Shop</h3>
            <ul className="space-y-3 text-[13px] md:text-[14px] font-bold text-[#171717]/80 uppercase tracking-wider">
              <li><Link href="/shop" className="hover:text-[#7A2635] transition-colors block py-1">New Arrivals</Link></li>
              <li><Link href="/shop/hoodies" className="hover:text-[#7A2635] transition-colors block py-1">Hoodies</Link></li>
              <li><Link href="/shop/t-shirts" className="hover:text-[#7A2635] transition-colors block py-1">T-Shirts</Link></li>
              <li><Link href="/shop/pants" className="hover:text-[#7A2635] transition-colors block py-1">Pants</Link></li>
              <li><Link href="/shop/accessories" className="hover:text-[#7A2635] transition-colors block py-1">Accessories</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-black tracking-widest uppercase text-[15px] md:text-[16px] text-[#0A0A0A]">Support</h3>
            <ul className="space-y-3 text-[13px] md:text-[14px] font-bold text-[#171717]/80 uppercase tracking-wider">
              <li><Link href="/contact" className="hover:text-[#59624B] transition-colors block py-1">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-[#59624B] transition-colors block py-1">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-[#59624B] transition-colors block py-1">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-[#59624B] transition-colors block py-1">Size Guide</Link></li>
              <li><Link href="/track-order" className="hover:text-[#59624B] transition-colors block py-1">Track Order</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-black tracking-widest uppercase text-[15px] md:text-[16px] text-[#0A0A0A]">Company</h3>
            <ul className="space-y-3 text-[13px] md:text-[14px] font-bold text-[#171717]/80 uppercase tracking-wider">
              <li><Link href="/about" className="hover:text-[#536B7A] transition-colors block py-1">About Us</Link></li>
              <li><Link href="/story" className="hover:text-[#536B7A] transition-colors block py-1">Our Story</Link></li>
              <li><Link href="/privacy" className="hover:text-[#536B7A] transition-colors block py-1">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#536B7A] transition-colors block py-1">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-6 md:col-span-1 md:ml-auto md:max-w-xs mt-8 md:mt-0 pt-4 md:pt-0 border-t border-[#171717]/10 md:border-none">
          <h3 className="font-black tracking-widest uppercase text-[15px] md:text-[16px] text-[#0A0A0A] mt-4 md:mt-0">Newsletter</h3>
          <p className="text-[#171717]/80 text-[13px] font-bold leading-relaxed uppercase tracking-wider">
            Be the first to know about new drops and exclusive offers.
          </p>
          <div className="flex items-center bg-[#E9E2D7] p-1.5 rounded-full border border-[#171717]/5 focus-within:border-[#C9BDAA] transition-colors">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent text-[14px] w-full outline-none px-4 py-3 text-[#0A0A0A] placeholder:text-[#171717]/50 font-bold"
            />
            <button className="bg-[#7A2635] text-[#F5F3EE] p-3 md:p-4 rounded-full hover:bg-[#641F2D] transition-colors shrink-0">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-6 text-[13px] md:text-[14px] font-bold tracking-widest uppercase text-[#0A0A0A] pt-4">
            <a href="#" className="hover:text-[#7A2635] transition-colors">IG</a>
            <a href="#" className="hover:text-[#7A2635] transition-colors">WA</a>
            <a href="#" className="hover:text-[#7A2635] transition-colors">YT</a>
          </div>
        </div>
      </div>

      <div className="container mx-auto pt-8 border-t border-[#171717]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[12px] md:text-[13px] text-[#171717]/60 font-bold uppercase tracking-widest text-center w-full md:text-left">
          © {new Date().getFullYear()} DEVIL CLOTHES. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
