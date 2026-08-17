import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/server";

export const metadata = {
  title: "Collections | Devil Clothes",
  description: "Curated streetwear collections by Devil Clothes.",
};

// Force dynamic rendering or revalidate 
export const revalidate = 60;

export default async function CollectionsPage() {
  
  const { data: collections, error } = await supabaseAdmin
    .from('collections')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  const activeCollections = collections || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/10">
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-12 md:mt-0">
          <h1 className="text-4xl md:text-[5rem] lg:text-[7rem] font-black tracking-tighter uppercase mb-4 leading-none text-white">
            OUR COLLECTIONS
          </h1>
          <p className="text-[10px] md:text-sm text-gray-400 max-w-xl font-bold tracking-[0.3em] uppercase">
            Curated streetwear collections, engineered for the shadows.
          </p>
        </div>
      </section>

      {/* Collection Grid */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {activeCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {activeCollections.map((collection) => (
              <Link 
                key={collection.id} 
                href={`/collections/${collection.slug}`}
                className="group relative flex flex-col w-full overflow-hidden block"
              >
                {/* Image Container with hover effects */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]">
                  <Image
                    src={collection.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7"}
                    alt={collection.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                      {collection.name}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-300 font-bold tracking-[0.2em] uppercase mb-6 max-w-md line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="bg-white text-black px-8 py-3 font-black tracking-[0.2em] text-[10px] uppercase flex items-center gap-2 group-hover:bg-gray-200 transition-colors transform group-hover:translate-x-2 duration-300">
                      Explore Collection <span className="text-lg leading-none">&rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center border border-white/10">
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase mb-4">
              New collections are coming soon.
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-bold tracking-[0.2em] uppercase mb-8">
              We're crafting something worth keeping.
            </p>
            <Link 
              href="/shop" 
              className="bg-white text-black px-10 py-5 font-black tracking-[0.2em] uppercase text-[10px] md:text-xs hover:bg-gray-200 hover:scale-105 transition-all duration-300"
            >
              Shop All Products &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
