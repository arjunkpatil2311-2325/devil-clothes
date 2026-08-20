export default function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      <div className="container mx-auto max-w-4xl px-3 md:px-6 py-8 md:py-16">
        <div className="mb-8 md:mb-12 text-center">
          <span className="text-[10px] font-black tracking-[0.3em] text-[#2D3142]/60 uppercase block mb-1">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none text-[#2D3142]">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Info Card */}
          <div className="bg-[#EBE9ED]/90 backdrop-blur-md rounded-[22px] md:rounded-[28px] p-6 md:p-8 border border-[#ADACB5]/30 shadow-card space-y-6">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1">
                Customer Support
              </h2>
              <p className="text-sm font-black text-[#2D3142]">support@devilclothes.com</p>
              <p className="text-xs text-[#2D3142]/70 font-semibold mt-0.5">
                Available Mon–Sat, 10:00 AM – 7:00 PM
              </p>
            </div>

            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1">
                Collaborations & Wholesale
              </h2>
              <p className="text-sm font-black text-[#2D3142]">info@devilclothes.com</p>
            </div>

            <div>
              <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1">
                Studio
              </h2>
              <p className="text-xs font-semibold uppercase leading-relaxed text-[#2D3142]">
                DEVIL CLOTHES STUDIO<br />
                Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#EBE9ED]/90 backdrop-blur-md rounded-[22px] md:rounded-[28px] p-6 md:p-8 border border-[#ADACB5]/30 shadow-card">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] placeholder:text-[#2D3142]/50 resize-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all shadow-soft"
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
