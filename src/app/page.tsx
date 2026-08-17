import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Lock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { mockProducts, mockCollections, mockGallery } from "@/lib/mock-data";

export default function Home() {
  const latestDrop = mockProducts.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#fafafa]">
      
      {/* 3. HERO SECTION */}
      <section className="relative px-4 pt-4 pb-8 md:p-6 w-full">
        <div className="relative h-[85vh] min-h-[600px] w-full bg-black rounded-[2rem] overflow-hidden flex flex-col justify-end">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop"
              alt="Devil Clothes Hero"
              fill
              priority
              className="object-cover opacity-80"
            />
            {/* Subtle dark gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 md:p-16 flex flex-col items-start w-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">New Collection '26</span>
            </div>
            
            <h1 className="text-[clamp(3.5rem,15vw,10rem)] font-black tracking-tighter uppercase mb-4 leading-[0.85] text-white">
              NOCTURNAL<br />AWAKENING
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-300 max-w-md font-bold tracking-widest mb-10 uppercase leading-relaxed">
              Engineered for the shadows.<br />Designed for the streets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/shop" 
                className="bg-white text-black px-8 py-5 rounded-full font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-between group hover:scale-[1.02] transition-transform w-full sm:w-auto"
              >
                <span>Shop The Drop</span>
                <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/collections" 
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-5 rounded-full font-black tracking-[0.2em] uppercase text-[10px] flex items-center justify-between group hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST / BENEFITS STRIP */}
      <section className="w-full overflow-hidden pb-12">
        <div className="flex overflow-hidden w-full py-4 relative">
          <div className="flex animate-marquee-slow gap-4 pr-4 md:w-max">
            {/* Render 2 sets of items to create seamless loop */}
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex gap-4">
                {[
                  { icon: <Truck className="w-5 h-5 mb-3" />, title: "FREE SHIPPING", desc: "Orders over ₹999" },
                  { icon: <ShieldCheck className="w-5 h-5 mb-3" />, title: "PREMIUM QUALITY", desc: "Built to last" },
                  { icon: <RefreshCw className="w-5 h-5 mb-3" />, title: "EASY RETURNS", desc: "14-day returns" },
                  { icon: <Lock className="w-5 h-5 mb-3" />, title: "SECURE PAYMENT", desc: "100% secure checkout" }
                ].map((item, i) => (
                  <div key={`${groupIndex}-${i}`} className="flex-none w-[60vw] md:w-64 bg-white rounded-2xl p-6 border border-black/5 flex flex-col justify-center items-start shadow-sm hover:shadow-md transition-shadow">
                    {item.icon}
                    <h3 className="text-xs font-black tracking-widest uppercase text-black mb-1">{item.title}</h3>
                    <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase whitespace-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section className="w-full pb-16">
        <div className="px-4 md:px-6 flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-black">Shop By Category</h2>
          <Link href="/shop" className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase flex items-center hover:text-black transition-colors">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-4 pb-4">
          {[
            { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", link: "/shop?category=T-SHIRTS" },
            { name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop", link: "/shop?category=HOODIES" },
            { name: "Pants", image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop", link: "/shop?category=PANTS" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop", link: "/shop?category=ACCESSORIES" },
            { name: "All Collections", image: "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=800&auto=format&fit=crop", link: "/collections" }
          ].map((cat, i) => (
            <Link 
              key={i}
              href={cat.link}
              className="group relative flex-none w-[75vw] md:w-[30vw] aspect-[4/5] md:aspect-[3/4] snap-start rounded-[2rem] overflow-hidden bg-[#111]"
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 75vw, 30vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end">
                <span className="text-2xl font-black tracking-tighter uppercase text-white">
                  {cat.name}
                </span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 text-black -rotate-45" />
                </div>
              </div>
            </Link>
          ))}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 6. OUR PRODUCTS (Strict 2 Column Grid on Mobile) */}
      <section className="px-4 md:px-6 w-full pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-black">Our Products</h2>
          <Link href="/shop" className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase flex items-center hover:text-black transition-colors">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        {/* 2 columns EXACTLY on all mobile viewports (grid-cols-2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {latestDrop.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PROMOTIONAL BANNER */}
      <section className="px-4 md:px-6 w-full pb-16">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden bg-black flex items-center">
          <Image 
            src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop" 
            alt="Promotion" 
            fill 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-16 flex flex-col items-start">
            <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase mb-4 border border-white/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Limited Time Only
            </span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none mb-4">
              GET 50% OFF
            </h2>
            <p className="text-xs md:text-sm font-bold tracking-widest text-gray-300 uppercase mb-8">
              On selected vintage washed items
            </p>
            <Link 
              href="/shop?sale=true" 
              className="bg-white text-black px-8 py-4 rounded-full font-black tracking-[0.2em] uppercase text-[10px] flex items-center hover:bg-gray-200 transition-colors"
            >
              Shop The Sale <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FEATURED COLLECTIONS */}
      <section className="w-full pb-16">
        <div className="px-4 md:px-6 flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-black">Featured Collections</h2>
          <Link href="/collections" className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase flex items-center hover:text-black transition-colors">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-4 pb-4">
          {mockCollections.map((collection, i) => (
            <Link 
              key={i}
              href={`/collections/${collection.id}`}
              className="group relative flex-none w-[80vw] md:w-[40vw] aspect-[4/3] snap-start rounded-[2rem] overflow-hidden bg-[#111]"
            >
              <Image src={collection.image} alt={collection.name} fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 80vw, 40vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-start">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white mb-2">
                  {collection.name}
                </h3>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase flex items-center mt-2 group-hover:text-gray-300 transition-colors">
                  Explore Now <ArrowRight className="w-3 h-3 ml-2" />
                </span>
              </div>
            </Link>
          ))}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 9. BRAND STORY */}
      <section className="px-4 md:px-6 w-full pb-16">
        <div className="bg-white rounded-[2rem] overflow-hidden border border-black/5 grid grid-cols-1 md:grid-cols-2">
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full">
            <Image 
              src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200&auto=format&fit=crop" 
              alt="Brand Story" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center items-start">
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase text-black mb-6 leading-[0.9]">
              BUILT FOR<br />YOUR STYLE
            </h2>
            <p className="text-xs md:text-sm font-bold tracking-wider text-gray-500 uppercase leading-relaxed mb-8">
              Devil Clothes creates premium streetwear pieces designed for everyday wear. We blend luxury aesthetics with underground culture, resulting in garments that demand attention without trying too hard.
            </p>
            <Link 
              href="/about" 
              className="text-[10px] font-black tracking-[0.2em] text-black uppercase flex items-center border-b-2 border-black pb-1 hover:text-gray-600 transition-colors"
            >
              Read Our Story <ArrowRight className="w-3 h-3 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM / SOCIAL SECTION */}
      <section className="w-full pb-16 overflow-hidden">
        <div className="px-4 md:px-6 mb-6">
          <h2 className="text-xs font-black tracking-[0.2em] text-gray-500 uppercase mb-2">@DEVILCLOTHES</h2>
          <h3 className="text-2xl font-black tracking-tighter text-black uppercase">Join the community</h3>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-3 pb-4">
          {mockGallery.map((img, i) => (
            <div key={i} className="relative flex-none w-[45vw] md:w-[20vw] aspect-square snap-start rounded-[1.5rem] overflow-hidden bg-[#111] group">
              <Image
                src={img}
                alt={`Instagram gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 45vw, 20vw"
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          ))}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="px-4 pb-16 w-full">
        <div className="bg-black text-white rounded-[2rem] w-full py-24 md:py-32 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.85] mb-6">
            WEAR YOUR<br />ATTITUDE.
          </h2>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">DEVIL CLOTHES</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">MADE FOR THE STREETS.</span>
          </div>
        </div>
      </section>

    </div>
  );
}
