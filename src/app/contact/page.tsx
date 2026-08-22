import Image from "next/image";
import { getSiteBanners } from "@/lib/banners";

export const revalidate = 0;

export default async function ContactPage() {
  const banners = await getSiteBanners();

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Hero Header Card */}
      <section className="px-3 pt-2 pb-6 md:px-6 md:pt-4 md:pb-10">
        <div className="relative h-[30vh] min-h-[220px] max-h-[320px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#2D3142] flex items-center justify-center shadow-soft border border-[#ADACB5]/40">
          <Image
            src={
              banners.contact_hero_image ||
              "https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=2000&auto=format&fit=crop"
            }
            alt="Contact Devil Clothes"
            fill
            priority
            className="object-cover opacity-50"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D3142] via-[#2D3142]/40 to-transparent" />

          <div className="relative z-10 text-center px-4">
            <span className="text-xs font-bold tracking-widest text-[#ADACB5] uppercase block mb-1">
              Direct Access
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-[#D8D5DB] leading-none mb-2">
              CONTACT US
            </h1>
            <p className="text-xs text-[#ADACB5] font-semibold tracking-wider uppercase">
              Reach the studio for drops, orders, & partnerships.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-3 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Info Card */}
          <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[28px] p-6 md:p-8 border border-[#ADACB5]/60 shadow-card space-y-6">
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70 mb-1">
                Customer Support
              </h2>
              <p className="text-sm font-black text-[#2D3142]">support@devilclothes.com</p>
              <p className="text-xs text-[#2D3142]/70 font-semibold mt-0.5">
                Available Mon–Sat, 10:00 AM – 7:00 PM
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70 mb-1">
                Collaborations & Wholesale
              </h2>
              <p className="text-sm font-black text-[#2D3142]">info@devilclothes.com</p>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70 mb-1">
                Studio
              </h2>
              <p className="text-xs font-semibold uppercase leading-relaxed text-[#2D3142]">
                DEVIL CLOTHES STUDIO<br />
                Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[28px] p-6 md:p-8 border border-[#ADACB5]/60 shadow-card">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/50 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/50 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold tracking-wider uppercase text-[#2D3142]/70">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/50 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50 resize-none"
                  required
                />
              </div>
              <button
                type="button"
                className="w-full bg-[#2D3142] text-[#D8D5DB] py-3.5 rounded-[14px] text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] active:scale-98 transition-all shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
