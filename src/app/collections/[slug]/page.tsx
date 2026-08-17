import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockCollections, mockProducts } from "@/lib/mock-data";
import ProductCard from "@/components/product/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const collection = mockCollections.find(c => c.id === resolvedParams.slug);
  if (!collection) return { title: "Collection Not Found | Devil Clothes" };
  return {
    title: `${collection.name} | Devil Clothes`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const collection = mockCollections.find(c => c.id === resolvedParams.slug);

  if (!collection) {
    notFound();
  }

  // Find products that match this collection (which maps perfectly to categories in our mock data)
  const collectionProducts = mockProducts.filter(
    (product) => product.category.toLowerCase() === collection.id.replace('-', '') || product.category.toLowerCase() === collection.id
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 md:px-6 py-6 mt-16 md:mt-24">
        <nav className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-white">{collection.name}</span>
        </nav>
      </div>

      {/* Collection Hero */}
      <section className="container mx-auto px-4 md:px-6 mb-16">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#0a0a0a] border border-white/10 flex items-center justify-center">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            sizes="100vw"
            priority
          />
          <div className="relative z-10 flex flex-col items-center text-center p-8">
            <h1 className="text-4xl md:text-[5rem] lg:text-[7rem] font-black tracking-tighter uppercase mb-4 leading-none text-white">
              {collection.name}
            </h1>
            <p className="text-[10px] md:text-sm text-gray-300 max-w-xl font-bold tracking-[0.3em] uppercase">
              {collection.description}
            </p>
            <div className="mt-8 text-xs font-bold tracking-widest text-gray-500 uppercase border border-gray-500/30 px-6 py-2 rounded-full">
              {collectionProducts.length} Products
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 md:px-6 pb-24">
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {collectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-white/10 border-dashed">
            <h3 className="text-xl font-black text-white tracking-widest uppercase mb-2">No products available</h3>
            <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase">Check back later for updates to this collection.</p>
          </div>
        )}
      </section>
    </div>
  );
}
