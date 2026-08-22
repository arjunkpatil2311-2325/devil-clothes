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

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#ADACB5]/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#2D3142] px-4 text-[#ADACB5] tracking-widest font-bold uppercase">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/admin`
              }
            });
            if (error) setError(error.message);
          }}
          className="w-full bg-white text-[#2D3142] py-4 rounded-[20px] font-black tracking-widest uppercase flex justify-center items-center gap-3 h-[56px] shadow-lg shadow-black/20 hover:bg-gray-100 transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
}
