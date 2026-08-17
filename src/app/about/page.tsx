import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full bg-black flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=2000&auto=format&fit=crop"
            alt="About Devil Clothes"
            fill
            priority
            className="object-cover opacity-50 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">
            THE ORIGIN
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-xl font-medium tracking-widest uppercase">
            Born in the underground. Built for the world.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 md:px-6 container mx-auto max-w-4xl">
        <div className="space-y-12 text-lg md:text-xl leading-relaxed text-gray-300">
          <p>
            <strong className="text-white">DEVIL CLOTHES</strong> was founded on a simple premise: premium streetwear shouldn't be a compromise between luxury and authenticity. We blur the lines between high fashion and raw, underground culture.
          </p>
          <p>
            Every piece is designed with intent. We source the heaviest cottons, the most durable hardware, and engineer fits that demand attention without shouting. It's an attitude woven into fabric.
          </p>
          <p>
            We don't follow trends. We observe the streets, the nightlife, the obscure corners of the city, and we design for the people who inhabit them. 
          </p>
          
          <div className="pt-12 border-t border-white/10 mt-12 text-center">
            <h2 className="text-3xl font-black tracking-tighter uppercase text-white mb-6">Wear Your Attitude.</h2>
            <p className="text-sm tracking-widest uppercase text-gray-500">Established 2024</p>
          </div>
        </div>
      </section>
    </div>
  );
}
