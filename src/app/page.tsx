import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Lock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { mockProducts, mockCollections, mockGallery } from "@/lib/mock-data";

export default function Home() {
  const latestDrop = mockProducts.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#F5F3EE]">
      
      {/* 3. HERO SECTION */}
      <section className="relative px-4 pt-2 pb-12 md:p-6 w-full">
        <div className="relative h-[80vh] min-h-[500px] w-full bg-[#0A0A0A] rounded-[20px] overflow-hidden flex flex-col justify-end shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2000&auto=format&fit=crop"
              alt="Devil Clothes Hero"
              fill
              priority
              className="object-cover opacity-85"
            />
            {/* Strong dark gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 md:p-16 flex flex-col items-start w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 bg-[#C9BDAA] rounded-full animate-pulse" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-[#C9BDAA] uppercase">New Collection '26</span>
            </div>
            
            <h1 className="text-[clamp(48px,12vw,76px)] font-black tracking-tighter uppercase mb-4 leading-[0.9] text-[#F5F3EE]">
              NOCTURNAL<br />AWAKENING
            </h1>
            
            <p className="text-[13px] md:text-[15px] text-gray-300 max-w-md font-bold tracking-widest mb-8 md:mb-10 uppercase leading-relaxed">
              Engineered for the shadows.<br />Designed for the streets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link 
                href="/shop" 
                className="bg-[#F5F3EE] text-[#0A0A0A] px-8 py-[18px] md:py-5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-[12px] flex items-center justify-center group hover:scale-[1.02] hover:bg-white transition-all w-full sm:w-auto"
              >
                <span>Shop The Drop</span>
                <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/collections" 
                className="bg-[#171717]/40 backdrop-blur-md border border-[#F5F3EE]/20 text-[#F5F3EE] px-8 py-[18px] md:py-5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-[12px] flex items-center justify-center group hover:bg-[#171717]/60 transition-all w-full sm:w-auto"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST / BENEFITS STRIP */}
      <section className="w-full overflow-hidden pb-[48px] md:pb-[72px]">
        <div className="flex overflow-hidden w-full py-2 relative">
          <div className="flex animate-marquee-slow gap-3 md:gap-4 pr-3 md:w-max">
            {/* Render 2 sets of items to create seamless loop */}
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex gap-3 md:gap-4">
                {[
                  { icon: <Truck className="w-4 h-4 mb-2" />, title: "FREE SHIPPING", desc: "Orders over ₹999", bg: "bg-[#E9E2D7]", text: "text-[#0A0A0A]", iconColor: "text-[#7A2635]" },
                  { icon: <ShieldCheck className="w-4 h-4 mb-2" />, title: "PREMIUM QUALITY", desc: "Built to last", bg: "bg-[#E6E8E3]", text: "text-[#0A0A0A]", iconColor: "text-[#59624B]" },
                  { icon: <RefreshCw className="w-4 h-4 mb-2" />, title: "EASY RETURNS", desc: "14-day returns", bg: "bg-[#E3E7E9]", text: "text-[#0A0A0A]", iconColor: "text-[#536B7A]" },
                  { icon: <Lock className="w-4 h-4 mb-2" />, title: "SECURE PAYMENT", desc: "100% checkout", bg: "bg-[#ECE9E2]", text: "text-[#0A0A0A]", iconColor: "text-[#0A0A0A]" }
                ].map((item, i) => (
                  <div key={`${groupIndex}-${i}`} className={`flex-none w-[160px] h-[80px] ${item.bg} rounded-xl p-3 border border-black/5 flex flex-col justify-center items-start shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={item.iconColor}>{item.icon}</div>
                      <h3 className={`text-[11px] font-black tracking-widest uppercase ${item.text} line-clamp-1`}>{item.title}</h3>
                    </div>
                    <p className="text-[10px] font-bold tracking-wider text-[#171717]/60 uppercase">{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section className="w-full pb-[48px] md:pb-[72px]">
        <div className="px-4 md:px-6 flex items-end justify-between mb-8">
          <h2 className="text-[28px] md:text-[34px] font-black tracking-tighter uppercase text-[#0A0A0A] leading-none">Shop By<br/>Category</h2>
          <Link href="/shop" className="text-[11px] font-black tracking-[0.2em] text-[#171717]/60 uppercase flex items-center hover:text-[#0A0A0A] transition-colors min-h-[44px]">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-3 md:gap-4 pb-4">
          {[
            { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", link: "/shop?category=T-SHIRTS", accent: "bg-[#7A2635]" },
            { name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop", link: "/shop?category=HOODIES", accent: "bg-[#59624B]" },
            { name: "Pants", image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop", link: "/shop?category=PANTS", accent: "bg-[#536B7A]" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop", link: "/shop?category=ACCESSORIES", accent: "bg-[#C9BDAA]" },
            { name: "All Collections", image: "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=800&auto=format&fit=crop", link: "/collections", accent: "bg-[#171717]" }
          ].map((cat, i) => (
            <Link 
              key={i}
              href={cat.link}
              className="group relative flex-none w-[72vw] md:w-[30vw] aspect-[4/5] snap-start rounded-[16px] overflow-hidden bg-[#111]"
            >
              <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 768px) 72vw, 30vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/30 to-transparent" />
              
              {/* Subtle accent line */}
              <div className={`absolute top-0 left-0 w-full h-1 ${cat.accent} opacity-80`} />
              
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex justify-between items-end">
                <span className="text-[24px] md:text-[28px] font-black tracking-tighter uppercase text-[#F5F3EE]">
                  {cat.name}
                </span>
                <div className="w-[36px] h-[36px] bg-[#F5F3EE] rounded-full flex items-center justify-center group-hover:bg-[#C9BDAA] transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 text-[#0A0A0A] -rotate-45" />
                </div>
              </div>
            </Link>
          ))}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 6. OUR PRODUCTS (Strict 2 Column Grid on Mobile) */}
      <section className="px-4 md:px-6 w-full pb-[48px] md:pb-[72px]">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-[28px] md:text-[34px] font-black tracking-tighter uppercase text-[#0A0A0A] leading-none">Our<br/>Products</h2>
          <Link href="/shop" className="text-[11px] font-black tracking-[0.2em] text-[#171717]/60 uppercase flex items-center hover:text-[#0A0A0A] transition-colors min-h-[44px]">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        {/* 2 columns EXACTLY on all mobile viewports (grid-cols-2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] md:gap-6">
          {latestDrop.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. PROMOTIONAL BANNER */}
      <section className="px-4 md:px-6 w-full pb-[48px] md:pb-[72px]">
        <div className="relative w-full rounded-[16px] overflow-hidden bg-[#641F2D] flex flex-col md:flex-row shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <div className="relative w-full h-[300px] md:h-[450px] md:w-1/2">
            <Image 
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop" 
              alt="Promotion" 
              fill 
              className="object-cover opacity-90"
            />
          </div>
          
          <div className="relative p-8 md:p-16 flex flex-col items-start justify-center md:w-1/2 bg-[#641F2D]">
            <span className="text-[11px] font-black tracking-[0.2em] text-[#F5F3EE] uppercase mb-5 border border-[#F5F3EE]/30 px-4 py-2 rounded-full">
              Limited Time Only
            </span>
            <h2 className="text-[48px] md:text-6xl font-black tracking-tighter uppercase text-[#F5F3EE] leading-none mb-4">
              GET 50% OFF
            </h2>
            <p className="text-[14px] font-bold tracking-widest text-[#F5F3EE]/70 uppercase mb-8">
              On selected items
            </p>
            <Link 
              href="/shop?sale=true" 
              className="bg-[#F5F3EE] text-[#0A0A0A] px-8 py-[18px] md:py-4 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-[12px] flex items-center hover:bg-white transition-all w-full sm:w-auto justify-center"
            >
              Shop The Sale <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FEATURED COLLECTIONS */}
      <section className="w-full pb-[48px] md:pb-[72px]">
        <div className="px-4 md:px-6 flex items-end justify-between mb-8">
          <h2 className="text-[28px] md:text-[34px] font-black tracking-tighter uppercase text-[#0A0A0A] leading-none">Featured<br/>Collections</h2>
          <Link href="/collections" className="text-[11px] font-black tracking-[0.2em] text-[#171717]/60 uppercase flex items-center hover:text-[#0A0A0A] transition-colors min-h-[44px]">
            View All <ArrowRight className="w-3 h-3 ml-2" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-[12px] md:gap-4 pb-4">
          {mockCollections.map((collection, i) => {
            const accents = ['bg-[#E9E2D7]', 'bg-[#536B7A]', 'bg-[#C9BDAA]', 'bg-[#59624B]', 'bg-[#171717]'];
            const accent = accents[i % accents.length];
            return (
              <Link 
                key={i}
                href={`/collections/${collection.id}`}
                className="group relative flex-none w-[75vw] md:w-[40vw] aspect-[4/5] snap-start rounded-[16px] overflow-hidden bg-[#111]"
              >
                <Image src={collection.image} alt={collection.name} fill className="object-cover opacity-70 group-hover:scale-[1.03] transition-transform duration-700" sizes="(max-width: 768px) 75vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent" />
                
                {/* Subtle grading overlay based on collection accent */}
                <div className={`absolute inset-0 opacity-10 mix-blend-color ${accent}`} />
                <div className={`absolute top-0 left-0 w-full h-1 ${accent} opacity-80`} />
                
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col items-start">
                  <h3 className="text-[32px] md:text-[36px] font-black tracking-tighter uppercase text-[#F5F3EE] mb-2 leading-none">
                    {collection.name}
                  </h3>
                  <span className="text-[11px] font-bold tracking-[0.2em] text-[#F5F3EE] uppercase flex items-center mt-3 group-hover:text-[#C9BDAA] transition-colors">
                    Explore Now <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </Link>
            )
          })}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 9. BRAND STORY */}
      <section className="px-4 md:px-6 w-full pb-[48px] md:pb-[72px]">
        <div className="bg-[#E9E2D7] rounded-[16px] overflow-hidden border border-[#171717]/5 flex flex-col md:flex-row shadow-sm">
          <div className="relative w-full aspect-[4/3] md:h-auto md:w-1/2">
            <Image 
              src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200&auto=format&fit=crop" 
              alt="Brand Story" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-16 flex flex-col justify-center items-start md:w-1/2">
            <div className="w-8 h-1 bg-[#7A2635] rounded-full mb-6" />
            <h2 className="text-[36px] md:text-5xl font-black tracking-tighter uppercase text-[#0A0A0A] mb-6 leading-[0.9]">
              BUILT FOR<br />YOUR STYLE
            </h2>
            <p className="text-[14px] md:text-[15px] font-bold tracking-wider text-[#171717]/80 uppercase leading-relaxed mb-8">
              Devil Clothes creates premium streetwear pieces designed for everyday wear. We blend luxury aesthetics with underground culture.
            </p>
            <Link 
              href="/about" 
              className="bg-[#0A0A0A] text-[#F5F3EE] px-6 py-4 rounded-full text-[12px] font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#171717] transition-colors"
            >
              Read Our Story <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM / SOCIAL SECTION */}
      <section className="w-full pb-[48px] md:pb-[72px] overflow-hidden">
        <div className="px-4 md:px-6 mb-8 flex flex-col items-start">
          <h2 className="text-[11px] font-black tracking-[0.2em] text-[#171717]/60 uppercase mb-2">@DEVILCLOTHES</h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#59624B]" />
            <h3 className="text-[28px] md:text-[34px] font-black tracking-tighter text-[#0A0A0A] uppercase leading-none">Join the community</h3>
          </div>
        </div>
        
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-6 gap-[10px] md:gap-[12px] pb-4">
          {mockGallery.map((img, i) => (
            <div key={i} className="relative flex-none w-[42vw] md:w-[20vw] aspect-square snap-start rounded-[12px] md:rounded-[14px] overflow-hidden bg-[#111] group shadow-sm">
              <Image
                src={img}
                alt={`Instagram gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 45vw, 20vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </div>
            </div>
          ))}
          <div className="w-4 flex-none md:hidden" />
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="px-4 pb-[48px] md:pb-[72px] w-full">
        <div className="relative bg-[#0A0A0A] bg-gradient-to-b from-[#0A0A0A] to-[#171717] text-[#F5F3EE] rounded-[16px] w-full min-h-[320px] md:min-h-[400px] py-16 md:py-32 flex flex-col items-center justify-center text-center px-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Extremely subtle grain overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}} />
          
          <h2 className="relative z-10 text-[clamp(48px,12vw,160px)] font-black tracking-tighter uppercase leading-[0.85] mb-8">
            WEAR YOUR<br />ATTITUDE.
          </h2>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-6 h-0.5 bg-[#7A2635] rounded-full mb-1" />
            <span className="text-[12px] md:text-[14px] font-black tracking-[0.3em] uppercase text-[#C9BDAA]">DEVIL CLOTHES</span>
            <span className="text-[11px] md:text-[12px] font-bold tracking-widest uppercase text-[#F5F3EE]/70">MADE FOR THE STREETS.</span>
          </div>
        </div>
      </section>

    </div>
  );
}
