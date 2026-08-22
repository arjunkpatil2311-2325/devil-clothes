"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error("Invalid admin credentials");
      }

      let isAdmin = data.user?.user_metadata?.is_admin === true;

      if (!isAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          isAdmin = true;
        }
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error("Access denied: You do not have admin privileges");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row relative overflow-hidden">
      {/* Video Background Section */}
      <div className="relative flex-1 h-[45vh] md:h-screen w-full bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-urban-street-fashion-and-style-in-the-city-40767-large.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlays to smoothly blend the video into the card */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#2D3142] md:to-transparent md:bg-gradient-to-r md:from-black/80 md:via-transparent md:to-[#2D3142]" />
        
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
          <div className="text-2xl md:text-3xl font-black tracking-tighter uppercase text-white leading-none">
            DEVIL <span className="text-white/60">CLOTHES</span>
          </div>
          <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/70 mt-1">
            Admin Portal
          </div>
        </div>
      </div>

      {/* Login Form Section (Bottom Sheet on Mobile, Side Panel on Desktop) */}
      <div className="w-full md:w-[450px] lg:w-[500px] bg-[#2D3142] rounded-t-[40px] md:rounded-none px-8 py-10 md:p-14 z-10 flex flex-col justify-center -mt-12 md:mt-0 relative shadow-[0_-20px_40px_rgba(0,0,0,0.4)] md:shadow-[-20px_0_40px_rgba(0,0,0,0.4)]">
        
        {/* Mobile drag indicator */}
        <div className="w-12 h-1.5 bg-[#ADACB5]/20 rounded-full mx-auto mb-8 md:hidden" />

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#D8D5DB] mb-2">
            Sign In
          </h1>
          <p className="text-[#ADACB5] text-sm">
            Secure access for authorized personnel.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-8 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-2.5 ml-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1F2232] border-2 border-[#1F2232] focus:border-[#ADACB5]/30 rounded-[20px] px-5 py-4 text-[#D8D5DB] focus:outline-none transition-all placeholder:text-[#ADACB5]/30 font-medium"
              placeholder="admin@devilclothes.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-2.5 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1F2232] border-2 border-[#1F2232] focus:border-[#ADACB5]/30 rounded-[20px] px-5 py-4 text-[#D8D5DB] focus:outline-none transition-all placeholder:text-[#ADACB5]/30 font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#D8D5DB] to-[#ADACB5] text-[#2D3142] py-4 rounded-[20px] font-black tracking-widest uppercase mt-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center h-[56px] shadow-lg shadow-black/20"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-[#2D3142] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Secure Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
