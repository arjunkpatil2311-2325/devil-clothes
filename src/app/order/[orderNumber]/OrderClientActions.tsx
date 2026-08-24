"use client";

import { useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";

export default function OrderClientActions() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePaymentCompleted = () => {
    // In a full implementation, you would send an API request here to notify admins
    // For now, we handle the UI state dynamically as requested.
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#EBE9ED] rounded-[24px] p-6 border border-[#1E9540]/30 shadow-card space-y-3">
        <div className="flex items-center gap-2 text-[#1E9540]">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <h2 className="text-xs font-black tracking-[0.2em] uppercase">
            Verification Pending
          </h2>
        </div>
        <p className="text-xs text-[#2D3142]/80 font-bold uppercase tracking-wider leading-relaxed">
          Payment submitted for verification. We'll confirm your order shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#EBE9ED] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card space-y-5 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2D3142]"></div>

      <div>
        <div className="flex items-center gap-2 text-[#2D3142] mb-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-xs font-black tracking-[0.2em] uppercase">
            Payment Required
          </h2>
        </div>
        <p className="text-xs text-[#2D3142]/80 font-bold uppercase tracking-wider leading-relaxed">
          Please complete your payment using UPI or Bank Transfer to confirm your reservation. 
        </p>
      </div>

      <div className="bg-[#D8D5DB] rounded-[16px] p-5 border border-[#ADACB5]/50 space-y-3">
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
          <span className="text-[#2D3142]/70">UPI ID</span>
          <span className="text-[#2D3142]">devilclothes@upi</span>
        </div>
        <div className="w-full h-[1px] bg-[#ADACB5]/30"></div>
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
          <span className="text-[#2D3142]/70">Bank Name</span>
          <span className="text-[#2D3142]">HDFC Bank</span>
        </div>
        <div className="w-full h-[1px] bg-[#ADACB5]/30"></div>
        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
          <span className="text-[#2D3142]/70">Account Name</span>
          <span className="text-[#2D3142]">Devil Clothes</span>
        </div>
      </div>

      <button
        onClick={handlePaymentCompleted}
        className="w-full bg-[#2D3142] text-[#D8D5DB] py-4 px-6 min-h-[50px] rounded-full font-black tracking-[0.15em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all flex items-center justify-center shadow-soft"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        I've Completed Payment
      </button>
    </div>
  );
}
