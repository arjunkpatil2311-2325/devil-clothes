"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LoginGateProps {
  isOpen: boolean;
  onClose: () => void;
  nextUrl?: string;
}

export function LoginGate({ isOpen, onClose, nextUrl = "/checkout" }: LoginGateProps) {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close if user logs in
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#2D3142]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal / Bottom Sheet */}
      <div 
        className="relative w-full max-w-md bg-[#EBE9ED] md:rounded-[24px] rounded-t-[24px] rounded-b-none shadow-2xl border-t border-l border-r md:border-b border-[#ADACB5]/30 overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 md:p-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-[#2D3142] rounded-full flex items-center justify-center text-[#D8D5DB] mb-4 shadow-sm">
            <User className="w-6 h-6 stroke-[2.5px]" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-[#2D3142] mb-2">
            ONE STEP AWAY
          </h2>
          
          <p className="text-[13px] md:text-sm font-semibold text-[#2D3142]/70 leading-relaxed mb-8 max-w-[280px]">
            Sign in to continue with your order and keep your orders safely connected to your account.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(nextUrl)}`}
              className="w-full bg-[#2D3142] text-[#D8D5DB] py-3.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#3D4258] transition-colors shadow-sm"
            >
              LOGIN
            </Link>
            
            <Link
              href={`/signup?redirect=${encodeURIComponent(nextUrl)}`}
              className="w-full bg-[#D8D5DB] text-[#2D3142] border border-[#ADACB5] py-3.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-white transition-colors"
            >
              CREATE ACCOUNT
            </Link>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 text-[11px] font-black tracking-widest uppercase text-[#ADACB5] hover:text-[#2D3142] transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
