"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectUrl);
      }
    }
    checkUser();
  }, [router, redirectUrl, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }
    
    if (!password) {
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error("Invalid email or password");
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm mb-8 font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-2.5 ml-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1F2232] border-2 border-[#1F2232] focus:border-[#ADACB5]/30 rounded-[20px] px-5 py-4 text-[#D8D5DB] focus:outline-none transition-all placeholder:text-[#ADACB5]/30 font-medium"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-2.5 ml-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1F2232] border-2 border-[#1F2232] focus:border-[#ADACB5]/30 rounded-[20px] px-5 py-4 text-[#D8D5DB] focus:outline-none transition-all placeholder:text-[#ADACB5]/30 font-medium"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#D8D5DB] text-[#2D3142] py-4 rounded-[20px] font-black tracking-widest uppercase mt-6 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center h-[56px]"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-[#2D3142] border-t-transparent rounded-full animate-spin" />
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[#ADACB5] text-xs font-medium mb-3">
          Don't have an account?
        </p>
        <Link
          href={`/signup?redirect=${encodeURIComponent(redirectUrl)}`}
          className="text-[10px] font-black tracking-widest uppercase text-[#D8D5DB] hover:text-white transition-colors border-b border-[#D8D5DB]/30 pb-1 inline-block"
        >
          Create Account
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 bg-[#ECEAEF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2D3142] rounded-[32px] p-8 md:p-12 shadow-2xl">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-center text-[#D8D5DB] uppercase mb-2">
          DEVIL CLOTHES
        </h1>
        <p className="text-[#ADACB5] text-center text-xs font-bold tracking-widest uppercase mb-10">
          Welcome Back
        </p>
        <Suspense fallback={<div className="flex justify-center"><div className="w-8 h-8 border-4 border-[#D8D5DB] border-t-transparent rounded-full animate-spin"></div></div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
