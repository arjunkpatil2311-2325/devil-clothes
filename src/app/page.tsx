import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Lock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { supabaseAdmin } from "@/lib/supabase/server";

export const revalidate = 0; // Disable static caching for live updates

export default async function Home() {
  // Fetch from Supabase
  const { data: latestDrop } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(4);

  const displayProducts = latestDrop || [];

  const { data: activeCollections } = await supabaseAdmin
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const collections = activeCollections || [];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#D8D5DB]">
      {/* 1. HERO SECTION */}
      <section className="relative px-3 pt-2 pb-10 md:px-6 md:pt-4 md:pb-16 w-full">
        <div className="relative h-[78vh] min-h-[520px] max-h-[780px] w-full bg-[#2D3142] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-end shadow-soft border border-[#ADACB5]/40">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
              alt="Devil Clothes Hero"
              fill
              priority
              className="object-cover opacity-90 object-top"
            />
            {/* Gunmetal gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/60 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 md:p-14 flex flex-col items-start w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#ADACB5] rounded-full animate-pulse" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.25em] text-[#ADACB5] uppercase">
                New Drop 2026
              </span>
            </div>

            <h1 className="text-[clamp(42px,10vw,72px)] font-black tracking-tight uppercase mb-3 leading-[0.92] text-[#D8D5DB]">
              NOCTURNAL<br />AWAKENING
            </h1>

            <p className="text-xs md:text-sm text-[#ADACB5] max-w-md font-semibold tracking-wider mb-7 md:mb-9 uppercase leading-relaxed">
              Engineered for the shadows.<br />Designed for the streets.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/shop"
                className="bg-[#D8D5DB] text-[#2D3142] px-8 min-h-[48px] md:min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center group hover:bg-white active:scale-98 transition-all shadow-sm w-full sm:w-auto"
              >
                <span>Shop The Drop</span>
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/collections"
                className="bg-[#2D3142]/70 backdrop-blur-md border border-[#D8D5DB]/35 text-[#D8D5DB] px-8 min-h-[48px] md:min-h-[52px] rounded-full font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center group hover:bg-[#2D3142]/90 active:scale-98 transition-all w-full sm:w-auto"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST / BENEFITS STRIP */}
      <section className="w-full overflow-hidden pb-10 md:pb-16">
        <div className="flex overflow-hidden w-full py-1 relative">
          <div className="flex animate-marquee-slow gap-3 md:gap-4 pr-3 md:w-max">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex gap-3 md:gap-4">
                {[
                  {
                    icon: <Truck className="w-4 h-4" />,
                    title: "FREE SHIPPING",
                    desc: "Orders over ₹999",
                  },
                  {
                    icon: <ShieldCheck className="w-4 h-4" />,
                    title: "PREMIUM QUALITY",
                    desc: "Built to last",
                  },
                  {
                    icon: <RefreshCw className="w-4 h-4" />,
                    title: "EASY RETURNS",
                    desc: "14-day returns",
                  },
                  {
                    icon: <Lock className="w-4 h-4" />,
                    title: "SECURE PAYMENT",
                    desc: "WhatsApp confirmed",
                  },
                ].map((item, i) => (
                  <div
                    key={`${groupIndex}-${i}`}
                    className="flex-none w-[170px] h-[82px] bg-[#C7C5CF] rounded-[18px] p-3.5 border border-[#ADACB5] flex flex-col justify-center items-start shadow-card"
                  >
                    <div className="flex items-center gap-2 mb-1 text-[#2D3142]">
                      <div>{item.icon}</div>
                      <h3 className="text-[10px] font-black tracking-widest uppercase line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[9px] font-bold tracking-wider text-[#2D3142]/70 uppercase">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="w-full pb-12 md:pb-18">
        <div className="px-4 md:px-8 flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
              Curated Lines
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142] leading-none">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-bold tracking-[0.2em] text-[#2D3142] uppercase flex items-center hover:opacity-75 transition-opacity min-h-[44px]"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* Category Carousel: 75vw cards on mobile with preview peek */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-8 gap-3 md:gap-5 pb-2">
          {[
            {
              name: "T-Shirts",
              image:
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
              link: "/shop?category=T-SHIRTS",
            },
            {
              name: "Hoodies",
              image:
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
              link: "/shop?category=HOODIES",
            },
            {
              name: "Pants",
              image:
                "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop",
              link: "/shop?category=PANTS",
            },
            {
              name: "Accessories",
              image:
                "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop",
              link: "/shop?category=ACCESSORIES",
            },
            {
              name: "All Drops",
              image:
                "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=800&auto=format&fit=crop",
              link: "/collections",
            },
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.link}
              className="group relative flex-none w-[75vw] sm:w-[45vw] md:w-[28vw] aspect-[4/5] snap-start rounded-[22px] overflow-hidden bg-[#2D3142] shadow-soft border border-[#ADACB5]/40"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 75vw, 28vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex justify-between items-end">
                <span className="text-xl md:text-2xl font-black tracking-tight uppercase text-[#D8D5DB]">
                  {cat.name}
                </span>
                <div className="w-10 h-10 bg-[#D8D5DB]/90 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center text-[#2D3142] group-hover:scale-105 transition-transform shrink-0 shadow-sm">
                  <ArrowRight className="w-4 h-4 -rotate-45" />
                </div>
              </div>
            </Link>
          ))}
          <div className="w-3 flex-none md:hidden" />
        </div>
      </section>

      {/* 4. OUR PRODUCTS (Strict 2-Column Grid on Mobile) */}
      <section className="px-3 md:px-8 w-full pb-12 md:pb-18">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
              Latest Pieces
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142] leading-none">
              Our Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[11px] font-bold tracking-[0.2em] text-[#2D3142] uppercase flex items-center hover:opacity-75 transition-opacity min-h-[44px]"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        {/* 2 columns on Mobile, 4 columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL BANNER */}
      <section className="px-3 md:px-8 w-full pb-12 md:pb-18">
        <div className="relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#2D3142] flex flex-col md:flex-row shadow-soft border border-[#ADACB5]/40">
          <div className="relative w-full h-[260px] md:h-[400px] md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop"
              alt="Promotion"
              fill
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2D3142] via-transparent to-transparent" />
          </div>

          <div className="relative p-6 md:p-12 flex flex-col items-start justify-center md:w-1/2 bg-[#2D3142] text-[#D8D5DB]">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#ADACB5] uppercase mb-3 border border-[#ADACB5]/40 px-3 py-1 rounded-full">
              Limited Time Only
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-[#D8D5DB] leading-none mb-3">
              GET 50% OFF
            </h2>
            <p className="text-xs md:text-sm font-semibold tracking-wider text-[#ADACB5] uppercase mb-6">
              On selected streetwear essentials
            </p>
            <Link
              href="/shop?sale=true"
              className="bg-[#D8D5DB] text-[#2D3142] px-8 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs flex items-center hover:bg-white active:scale-98 transition-all w-full sm:w-auto justify-center shadow-sm"
            >
              Shop The Sale <ArrowRight className="w-4 h-4 ml-2.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FEATURED COLLECTIONS */}
      <section className="w-full pb-12 md:pb-18">
        <div className="px-4 md:px-8 flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
              Seasonal Releases
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142] leading-none">
              Featured Collections
            </h2>
          </div>
          <Link
            href="/collections"
            className="text-[11px] font-bold tracking-[0.2em] text-[#2D3142] uppercase flex items-center hover:opacity-75 transition-opacity min-h-[44px]"
          >
            View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-8 gap-3 md:gap-5 pb-2">
          {collections.map((collection, i) => (
            <Link
              key={i}
              href={`/collections/${collection.slug}`}
              className="group relative flex-none w-[75vw] sm:w-[50vw] md:w-[35vw] aspect-[4/5] snap-start rounded-[22px] overflow-hidden bg-[#2D3142] shadow-soft border border-[#ADACB5]/40"
            >
              <Image
                src={
                  collection.image ||
                  "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
                }
                alt={collection.name}
                fill
                className="object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 75vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-start">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#D8D5DB] mb-1.5 leading-none">
                  {collection.name}
                </h3>
                <span className="text-[10px] font-black tracking-[0.2em] text-[#ADACB5] uppercase flex items-center mt-2 group-hover:text-[#D8D5DB] transition-colors">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </span>
              </div>
            </Link>
          ))}
          <div className="w-3 flex-none md:hidden" />
        </div>
      </section>

      {/* 7. BRAND STORY */}
      <section className="px-3 md:px-8 w-full pb-12 md:pb-18">
        <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] overflow-hidden border border-[#ADACB5] flex flex-col md:flex-row shadow-card">
          <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200&auto=format&fit=crop"
              alt="Brand Story"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-12 flex flex-col justify-center items-start md:w-1/2">
            <div className="w-8 h-1 bg-[#2D3142] rounded-full mb-4" />
            <h2 className="text-2xl md:text-4xl font-black tracking-tight uppercase text-[#2D3142] mb-4 leading-none">
              BUILT FOR<br />YOUR STYLE
            </h2>
            <p className="text-xs md:text-sm font-semibold tracking-wide text-[#2D3142]/80 uppercase leading-relaxed mb-6">
              Devil Clothes creates premium streetwear pieces designed for everyday wear. We blend luxury aesthetics with underground culture.
            </p>
            <Link
              href="/about"
              className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3.5 min-h-[46px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] active:scale-98 transition-all shadow-sm"
            >
              Read Our Story <ArrowRight className="w-4 h-4 ml-2.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM / SOCIAL FEED */}
      <section className="w-full pb-12 md:pb-18 overflow-hidden">
        <div className="px-4 md:px-8 mb-5 flex flex-col items-start">
          <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
            @DEVILCLOTHES
          </span>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-[#2D3142] uppercase leading-none">
            Join The Community
          </h3>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pl-4 md:pl-8 gap-2.5 md:gap-4 pb-2">
          {[
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&q=80",
            "https://images.unsplash.com/photo-1516826957135-700edeb5f9fc?w=800&q=80",
            "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=800&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
          ].map((img, i) => (
            <div
              key={i}
              className="relative flex-none w-[42vw] md:w-[20vw] aspect-square snap-start rounded-[18px] md:rounded-[22px] overflow-hidden bg-[#2D3142] group shadow-card border border-[#ADACB5]/40"
            >
              <Image
                src={img}
                alt={`Instagram gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 45vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-[#D8D5DB]/85 backdrop-blur-md rounded-full flex items-center justify-center text-[#2D3142] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </div>
          ))}
          <div className="w-3 flex-none md:hidden" />
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="px-3 md:px-8 pb-12 md:pb-18 w-full">
        <div className="relative bg-[#2D3142] text-[#D8D5DB] rounded-[24px] md:rounded-[32px] w-full min-h-[300px] md:min-h-[380px] py-14 md:py-24 flex flex-col items-center justify-center text-center px-4 shadow-soft border border-[#ADACB5]/40 overflow-hidden">
          <h2 className="relative z-10 text-[clamp(38px,10vw,120px)] font-black tracking-tight uppercase leading-[0.9] mb-6">
            WEAR YOUR<br />ATTITUDE.
          </h2>
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-1 bg-[#ADACB5] rounded-full mb-1" />
            <span className="text-xs md:text-sm font-black tracking-[0.3em] uppercase text-[#D8D5DB]">
              DEVIL CLOTHES
            </span>
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-[#ADACB5]">
              MADE FOR THE STREETS.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
