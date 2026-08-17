import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { mockProducts, mockGallery } from "@/lib/mock-data";

export default function Home() {
  const latestDrop = mockProducts.filter(p => p.isNew).slice(0, 4);
  const bestSellers = mockProducts.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 3. Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] w-full bg-black flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1570215778588-75217983637e?q=80&w=2000&auto=format&fit=crop"
            alt="Devil Clothes Hero"
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center mt-12 md:mt-0">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase mb-4 md:mb-6 leading-[0.85]">
            NOCTURNAL<br />AWAKENING
          </h1>
          <p className="text-xs sm:text-sm md:text-lg text-gray-300 max-w-2xl font-bold tracking-[0.2em] mb-8 md:mb-12 uppercase">
            The new collection. Engineered for the shadows. Designed for the streets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/shop" 
              className="bg-white text-black px-10 py-5 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs hover:bg-gray-200 hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center"
            >
              Shop The Drop
            </Link>
            <Link 
              href="/collections" 
              className="bg-transparent text-white border border-white/30 px-10 py-5 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs hover:bg-white/10 hover:border-white transition-all duration-300 w-full sm:w-auto text-center"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Collection */}
      <section className="py-16 md:py-24 px-4 md:px-6 container mx-auto overflow-hidden">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase">The Latest Drop</h2>
          <Link href="/shop" className="hidden md:flex items-center text-sm font-bold tracking-widest uppercase hover:text-gray-400 transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {latestDrop.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <Link href="/shop" className="mt-8 flex md:hidden items-center justify-center text-sm font-bold tracking-widest uppercase bg-white/5 py-4 hover:bg-white/10 transition-colors w-full">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </section>

      {/* 5. Editorial Section */}
      <section className="w-full bg-[#0a0a0a] py-0 border-y border-white/5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[4/5] sm:aspect-square md:aspect-auto md:h-[600px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=1200&auto=format&fit=crop"
              alt="Editorial"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 md:p-16 lg:p-24">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 md:mb-6">
              Built For<br />Your Style
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-xl leading-relaxed mb-8 max-w-md">
              DEVIL CLOTHES creates premium streetwear pieces designed for everyday wear. 
              We blend luxury aesthetics with underground culture, resulting in garments 
              that demand attention without trying too hard.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center text-xs md:text-sm font-bold tracking-widest uppercase border-b-2 border-white pb-1 w-max hover:text-gray-400 hover:border-gray-400 transition-all"
            >
              Read Our Story <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Categories Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8 md:mb-12 text-center">
          Categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
            { name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
            { name: "Pants", image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop" },
            { name: "Accessories", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop" }
          ].map((cat) => (
            <Link 
              key={cat.name} 
              href={`/shop/${cat.name.toLowerCase()}`}
              className="group relative aspect-square overflow-hidden bg-[#111]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black tracking-widest uppercase bg-black/50 backdrop-blur-sm px-6 py-3 border border-white/20">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Best Sellers */}
      <section className="py-12 md:py-24 px-4 md:px-6 container mx-auto bg-[#050505] overflow-hidden">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase">Best Sellers</h2>
          <Link href="/shop" className="hidden md:flex items-center text-sm font-bold tracking-widest uppercase hover:text-gray-400 transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Brand Statement */}
      <section className="py-24 md:py-48 px-4 w-full bg-white text-black flex items-center justify-center text-center overflow-hidden">
        <h2 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase">
          Wear Your<br />Attitude.
        </h2>
      </section>

      {/* 9. Social Gallery */}
      <section className="pt-16 pb-12 w-full overflow-hidden">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-lg md:text-2xl font-black tracking-widest uppercase mb-2">@DEVILCLOTHES</h2>
          <p className="text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">Join the community</p>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 md:gap-4 pb-4 px-4">
          {mockGallery.map((img, i) => (
            <div key={i} className="relative w-48 h-48 md:w-80 md:h-80 shrink-0 snap-start bg-[#111] group">
              <Image
                src={img}
                alt={`Instagram gallery image ${i + 1}`}
                fill
                className="object-cover transition-opacity duration-300 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
