import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Shield, Globe, Zap, Eye, Compass } from "lucide-react";
import { getSiteBanners } from "@/lib/banners";

export const revalidate = 0;

export default async function AboutPage() {
  const banners = await getSiteBanners();

  const teamMembers = [
    {
      name: "Arjun Patil",
      role: "Founder & Creative Director",
      desc: "Visionary behind Devil Clothes aesthetic, directing seasonal drops, streetwear curation, and brand identity.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Rohan V.",
      role: "Head of Production & Sourcing",
      desc: "Overseeing 380+ GSM heavyweight cottons, precision tailoring, hardware durability, and garment engineering.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Kavya M.",
      role: "Art & Campaign Director",
      desc: "Crafting atmospheric lookbooks, urban cinematography, capsule aesthetics, and visual storytelling.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Dev S.",
      role: "Community & VIP Drops",
      desc: "Connecting with our underground street community, early access releases, and customer experience.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* 1. HERO SECTION */}
      <section className="px-3 pt-2 pb-6 md:px-6 md:pt-4 md:pb-12 w-full">
        <div className="relative h-[48vh] min-h-[340px] max-h-[500px] w-full rounded-[24px] md:rounded-[36px] overflow-hidden bg-[#2D3142] flex flex-col justify-end p-6 md:p-14 shadow-soft border border-[#ADACB5]/40">
          <Image
            src={
              banners.about_hero_image ||
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000&auto=format&fit=crop"
            }
            alt="About Devil Clothes"
            fill
            priority
            className="object-cover opacity-60 object-center"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/45 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#ADACB5] uppercase block mb-2">
              The Origin & Philosophy
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#D8D5DB] leading-tight mb-3">
              Born in the Shadows.<br />Built for the Streets.
            </h1>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY (2-Column with 3-Pill Triptych Collage) */}
      <section className="py-10 md:py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Narrative & CTA */}
          <div className="lg:col-span-6 space-y-6 flex flex-col items-start">
            <div className="inline-block border-b-2 border-[#2D3142] pb-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                Our Story
              </h2>
            </div>

            <blockquote className="text-base md:text-lg font-semibold text-[#2D3142]/90 leading-relaxed max-w-md">
              &ldquo;Born out of a relentless obsession with raw underground streetwear, Devil Clothes bridges luxury heavyweight fabric engineering with unapologetic street edge. We craft garments that command presence, empowering you to wear your attitude with fearless confidence.&rdquo;
            </blockquote>

            <p className="text-xs md:text-sm text-[#2D3142]/75 font-medium leading-relaxed max-w-md">
              Every drop is created in limited batches with custom tailoring, bespoke hardware, and heavyweight fabrics tested for lasting resilience.
            </p>

            <Link
              href="/shop"
              className="bg-[#2D3142] text-[#D8D5DB] px-8 py-3.5 min-h-[50px] rounded-full font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
            >
              <span>Discover Our Pieces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: 3-Pill Triptych Image Collage */}
          <div className="lg:col-span-6 flex justify-center items-center gap-3 md:gap-4.5 pt-4 lg:pt-0">
            {/* Pill 1 */}
            <div className="relative w-28 sm:w-34 md:w-40 h-64 sm:h-76 md:h-92 rounded-[36px] overflow-hidden bg-[#2D3142] shadow-card border border-[#ADACB5]/60 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
                alt="Devil Clothes Streetwear Model"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 30vw, 160px"
              />
            </div>

            {/* Pill 2 (Centerpiece elevated) */}
            <div className="relative w-32 sm:w-40 md:w-48 h-76 sm:h-88 md:h-[430px] rounded-[44px] overflow-hidden bg-[#2D3142] shadow-float border-2 border-white/60 flex-shrink-0 -translate-y-4">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                alt="Devil Clothes Lookbook Photoshoot"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 35vw, 192px"
              />
            </div>

            {/* Pill 3 */}
            <div className="relative w-28 sm:w-34 md:w-40 h-64 sm:h-76 md:h-92 rounded-[36px] overflow-hidden bg-[#2D3142] shadow-card border border-[#ADACB5]/60 flex-shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
                alt="Devil Clothes Fabric Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 30vw, 160px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR IDENTITY, VISION AND VALUES */}
      <section className="py-12 md:py-20 px-3 md:px-8 w-full max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <span className="text-xs font-bold tracking-widest text-[#2D3142]/70 uppercase block mb-1">
            About Us
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#2D3142]">
            Our Identity, Vision and Values
          </h2>
        </div>

        {/* Floating Values Pill Bar */}
        <div className="relative z-10 max-w-3xl mx-auto bg-[#2D3142] text-[#D8D5DB] rounded-[24px] md:rounded-[30px] p-4 md:p-6 shadow-float border border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <Flame className="w-5 h-5 md:w-6 md:h-6 text-[#D8D5DB] mb-1.5 stroke-[2.2px]" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                Authenticity
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-l border-white/15">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#D8D5DB] mb-1.5 stroke-[2.2px]" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                Heavyweight Craft
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 sm:border-l border-white/15">
              <Globe className="w-5 h-5 md:w-6 md:h-6 text-[#D8D5DB] mb-1.5 stroke-[2.2px]" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                Street Culture
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-l border-white/15">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#D8D5DB] mb-1.5 stroke-[2.2px]" />
              <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                Innovation
              </span>
            </div>
          </div>
        </div>

        {/* Vision & Mission Card Underneath */}
        <div className="relative -mt-6 pt-12 md:pt-14 pb-8 md:pb-12 px-6 md:px-12 bg-[#ECEAEF] rounded-[28px] md:rounded-[36px] shadow-card border border-[#ADACB5]/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[#2D3142]">
                <div className="w-8 h-8 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]">
                  <Eye className="w-4 h-4" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Vision
                </h3>
              </div>
              <p className="text-xs md:text-sm text-[#2D3142]/80 font-medium leading-relaxed">
                To be India&apos;s defining underground streetwear label, pioneering high-density fabric architecture, fearless aesthetic autonomy, and a passionate community of style leaders worldwide.
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-3 md:border-l md:border-[#ADACB5]/40 md:pl-10">
              <div className="flex items-center gap-2.5 text-[#2D3142]">
                <div className="w-8 h-8 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Mission
                </h3>
              </div>
              <p className="text-xs md:text-sm text-[#2D3142]/80 font-medium leading-relaxed">
                To design and deliver heavyweight luxury streetwear crafted with obsessive attention to fabric weight, silhouette precision, and bold individuality directly to our street collective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET OUR TEAM */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs font-bold tracking-widest text-[#2D3142]/70 uppercase block mb-1">
            Meet Our Team
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#2D3142]">
            The Collective
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-[#ECEAEF] rounded-[24px] p-6 text-center border border-[#ADACB5]/60 shadow-card flex flex-col items-center justify-between space-y-4 hover:shadow-float transition-shadow"
            >
              <div className="relative w-24 h-24 md:w-26 md:h-26 rounded-full overflow-hidden border-2 border-[#2D3142]/20 shadow-md">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="110px"
                />
              </div>

              <div>
                <h3 className="text-base font-black uppercase text-[#2D3142] tracking-tight">
                  {member.name}
                </h3>
                <span className="text-[11px] font-bold text-[#2D3142]/70 uppercase block mt-0.5">
                  {member.role}
                </span>
                <p className="text-xs text-[#2D3142]/75 font-medium mt-3 leading-relaxed">
                  {member.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
