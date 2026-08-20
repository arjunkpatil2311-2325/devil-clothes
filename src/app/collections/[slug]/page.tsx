import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Product } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { data: collection } = await supabaseAdmin
    .from("collections")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!collection) return { title: "Collection Not Found | DEVIL CLOTHES" };
  return {
    title: `${collection.name} | DEVIL CLOTHES`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const { data: collection, error } = await supabaseAdmin
    .from("collections")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !collection) {
    notFound();
  }

  // Find products matching collection
  const { data: collectionProducts } = await supabaseAdmin
    .from("products")
    .select("*")
    .or(`collection.eq.${collection.slug},collection.ilike.%${collection.name}%`)
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  const products: Product[] = collectionProducts || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <nav className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 flex items-center gap-2">
          <Link href="/" className="hover:text-[#2D3142] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#2D3142] transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#2D3142]">{collection.name}</span>
        </nav>
      </div>

      {/* Collection Hero Header */}
      <section className="container mx-auto px-3 md:px-6 mb-8">
        <div className="relative aspect-[16/9] md:aspect-[21/8] w-full rounded-[22px] md:rounded-[30px] overflow-hidden bg-[#2D3142] shadow-soft border border-[#ADACB5]/30 flex items-center justify-center">
          <Image
            src={
              collection.image ||
              "https://images.unsplash.com/photo-1556821840-3a63f95609a7"
            }
            alt={collection.name}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-2 leading-none text-[#D8D5DB]">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-xs md:text-sm text-[#ADACB5] font-semibold tracking-wider uppercase mb-4">
                {collection.description}
              </p>
            )}
            <div className="text-[10px] font-black tracking-widest text-[#D8D5DB] uppercase bg-[#2D3142]/80 border border-[#ADACB5]/40 px-4 py-1.5 rounded-full">
              {products.length} Products
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-3 md:px-6 pb-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#EBE9ED]/80 rounded-[22px] border border-[#ADACB5]/30 p-12 text-center flex flex-col items-center justify-center shadow-card">
            <h3 className="text-lg font-black text-[#2D3142] tracking-tight uppercase mb-2">
              No products available
            </h3>
            <p className="text-xs text-[#2D3142]/70 font-semibold tracking-wider uppercase mb-6">
              Pieces for this collection will drop soon.
            </p>
            <Link
              href="/shop"
              className="bg-[#2D3142] text-[#D8D5DB] px-8 py-3 rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] transition-all shadow-sm"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
