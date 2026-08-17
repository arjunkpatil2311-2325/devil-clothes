export default function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 text-center">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Customer Service</h2>
              <p className="text-white font-medium">support@devilclothes.com</p>
              <p className="text-sm text-gray-400 mt-1">Available Mon-Fri, 10am - 6pm</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Wholesale & Press</h2>
              <p className="text-white font-medium">info@devilclothes.com</p>
            </div>
            
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Headquarters</h2>
              <p className="text-white font-medium">
                DEVIL CLOTHES STUDIO<br />
                Industrial Sector 4<br />
                Mumbai, MH 400001
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400">Name</label>
              <input 
                type="text" 
                className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400">Email</label>
              <input 
                type="email" 
                className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest uppercase text-gray-400">Message</label>
              <textarea 
                rows={5}
                className="w-full bg-[#111] border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white resize-none"
                required
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-white text-black py-4 font-black tracking-widest uppercase hover:bg-gray-200 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
