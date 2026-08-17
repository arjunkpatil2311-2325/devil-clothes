import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-12 md:pt-16 pb-8 px-4 md:px-6 mt-12 md:mt-24 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
        <div className="space-y-4 md:col-span-1">
          <h2 className="text-2xl font-black tracking-tighter uppercase">DEVIL CLOTHES</h2>
          <p className="text-gray-400 text-sm max-w-xs">
            Premium streetwear designed for the bold. Built for your style. Wear your attitude.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold tracking-widest uppercase text-sm">Shop</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/shop/new" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link href="/shop/hoodies" className="hover:text-white transition-colors">Hoodies</Link></li>
            <li><Link href="/shop/t-shirts" className="hover:text-white transition-colors">T-Shirts</Link></li>
            <li><Link href="/shop/pants" className="hover:text-white transition-colors">Pants</Link></li>
            <li><Link href="/shop/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold tracking-widest uppercase text-sm">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold tracking-widest uppercase text-sm">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} DEVIL CLOTHES. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm font-medium tracking-widest uppercase text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}
