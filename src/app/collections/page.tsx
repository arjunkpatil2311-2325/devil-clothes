import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSiteBanners } from "@/lib/banners";

export const metadata = {
  title: "Collections | DEVIL CLOTHES",
  description: "Curated streetwear collections by Devil Clothes.",
};

export const revalidate = 0;

export default async function CollectionsPage() {
  const [banners, collectionsRes] = await Promise.all([
    getSiteBanners(),
    supabaseAdmin
      .from("collections")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false }),
  ]);

  const activeCollections = collectionsRes.data || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Hero Header */}
      <section className="px-3 pt-2 pb-6 md:px-6 md:pt-4 md:pb-10">
        <div className="relative h-[30vh] min-h-[220px] max-h-[320px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#2D3142] flex items-center justify-center shadow-soft border border-[#ADACB5]/40">
          <Image
            src={banners.collections_hero_image || "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=2000&auto=format&fit=crop"}
            alt="Collections Hero"
            fill
            priority
            className="object-cover opacity-50"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

          <div className="relative z-10 text-center px-4">
            <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[#ADACB5] uppercase block mb-1">
              Curated Editorials
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#D8D5DB] leading-none mb-2">
              COLLECTIONS
            </h1>
            <p className="text-[11px] md:text-xs text-[#ADACB5] font-semibold tracking-widest uppercase">
              Exclusive drops and limited series.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Grid */}
      <section className="container mx-auto px-3 md:px-6 pb-16">
        {activeCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {activeCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group relative flex flex-col w-full overflow-hidden rounded-[22px] md:rounded-[28px] bg-[#2D3142] shadow-soft border border-[#ADACB5]/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={
                      collection.image ||
                      "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
                    }
                    alt={collection.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/30 to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-end items-start z-10">
                    <h2 className="text-2xl md:text-4xl font-black text-[#D8D5DB] tracking-tight uppercase mb-1 leading-none">
                      {collection.name}
                    </h2>
                    {collection.description && (
                      <p className="text-[11px] md:text-xs text-[#ADACB5] font-semibold tracking-wider uppercase mb-4 max-w-md line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <div className="bg-[#D8D5DB] text-[#2D3142] px-6 py-2.5 rounded-full font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2 group-hover:bg-white transition-all shadow-sm">
                      Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#EBE9ED]/80 rounded-[22px] border border-[#ADACB5]/30 p-12 text-center flex flex-col items-center justify-center shadow-card">
            <h2 className="text-xl md:text-2xl font-black text-[#2D3142] tracking-tight uppercase mb-2">
              New collections arriving soon
            </h2>
            <p className="text-xs text-[#2D3142]/70 font-semibold tracking-wider uppercase mb-6">
              Check back for limited seasonal releases.
            </p>
            <Link
              href="/shop"
              className="bg-[#2D3142] text-[#D8D5DB] px-8 py-3 rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] transition-all shadow-sm"
            >
              Shop All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
