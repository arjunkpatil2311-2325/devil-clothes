import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Hero Section */}
      <section className="px-3 pt-2 pb-6 md:px-6 md:pt-4 md:pb-10">
        <div className="relative h-[35vh] min-h-[250px] max-h-[360px] w-full rounded-[22px] md:rounded-[30px] overflow-hidden bg-[#2D3142] flex items-center justify-center shadow-soft border border-[#ADACB5]/30">
          <Image
            src="https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=2000&auto=format&fit=crop"
            alt="About Devil Clothes"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

          <div className="relative z-10 text-center px-4">
            <span className="text-[10px] md:text-xs font-black tracking-[0.3em] text-[#ADACB5] uppercase block mb-1">
              Brand Philosophy
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#D8D5DB] leading-none mb-2">
              THE ORIGIN
            </h1>
            <p className="text-[11px] md:text-xs text-[#ADACB5] font-semibold tracking-widest uppercase">
              Born in the underground. Built for the streets.
            </p>
          </div>
        </div>
      </section>

      {/* Story Content Section */}
      <section className="py-8 md:py-16 px-3 md:px-6 container mx-auto max-w-3xl">
        <div className="bg-[#EBE9ED]/90 backdrop-blur-md rounded-[24px] p-6 md:p-12 border border-[#ADACB5]/30 shadow-card space-y-8 text-xs md:text-sm leading-relaxed text-[#2D3142]/85 font-semibold uppercase tracking-wide">
          <p>
            <strong className="text-[#2D3142] font-black">DEVIL CLOTHES</strong> was founded on a simple premise: premium streetwear shouldn't compromise between luxury construction and authentic edge. We blur the lines between high fashion and underground culture.
          </p>
          <p>
            Every piece is designed with intent. We source heavyweight cottons, precision hardware, and engineer relaxed fits that command presence. It is an attitude woven into fabric.
          </p>
          <p>
            We don't follow passing trends. We draw inspiration from nightscapes, architectural silhouettes, and contemporary street aesthetics.
          </p>

          <div className="pt-8 border-t border-[#ADACB5]/30 text-center">
            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-[#2D3142] mb-1">
              Wear Your Attitude.
            </h2>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#2D3142]/60 font-bold">
              DEVIL CLOTHES STUDIO
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
