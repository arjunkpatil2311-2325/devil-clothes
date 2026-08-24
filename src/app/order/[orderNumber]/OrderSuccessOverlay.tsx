"use client";

import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderSuccessOverlayProps {
  isNewOrder: boolean;
  orderNumber: string;
}

export default function OrderSuccessOverlay({ isNewOrder, orderNumber }: OrderSuccessOverlayProps) {
  const [show, setShow] = useState(isNewOrder);
  const [phase, setPhase] = useState(0);
  const router = useRouter();
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!isNewOrder) return;

    // Phase 0: Mount (Checkmark)
    // Phase 1: ORDER CONFIRMED
    // Phase 2: YOUR PIECE IS RESERVED
    // Phase 3: Fade out

    const playPremiumSound = () => {
      if (hasPlayed.current) return;
      hasPlayed.current = true;

      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();

        // 1. Subtle soft impact (kick/thump)
        const impactOsc = ctx.createOscillator();
        const impactGain = ctx.createGain();
        impactOsc.type = 'sine';
        impactOsc.frequency.setValueAtTime(150, ctx.currentTime);
        impactOsc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        impactGain.gain.setValueAtTime(0.4, ctx.currentTime);
        impactGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        impactOsc.connect(impactGain);
        impactGain.connect(ctx.destination);
        impactOsc.start(ctx.currentTime);
        impactOsc.stop(ctx.currentTime + 0.5);

        // 2. Clean confirmation tone (warm triangle synth)
        const toneOsc = ctx.createOscillator();
        const toneGain = ctx.createGain();
        toneOsc.type = 'triangle';
        // A4 to C#5 chord sequence
        toneOsc.frequency.setValueAtTime(440, ctx.currentTime + 0.1); 
        toneOsc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.25); 
        toneGain.gain.setValueAtTime(0, ctx.currentTime + 0.1);
        toneGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
        toneGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        
        // Add a slight reverb/resonance feel with a lowpass filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        toneOsc.connect(filter);
        filter.connect(toneGain);
        toneGain.connect(ctx.destination);
        
        toneOsc.start(ctx.currentTime + 0.1);
        toneOsc.stop(ctx.currentTime + 1.5);
      } catch (e) {
        // Silently fail if autoplay is blocked
      }
    };

    // Attempt to play sound immediately
    playPremiumSound();

    const t1 = setTimeout(() => setPhase(1), 600); // Show "ORDER CONFIRMED"
    const t2 = setTimeout(() => setPhase(2), 1400); // Show "YOUR PIECE IS RESERVED"
    const t3 = setTimeout(() => setPhase(3), 2600); // Start fade out
    const t4 = setTimeout(() => {
      setShow(false);
      // Clean up URL so refresh doesn't trigger it again
      router.replace(`/order/${orderNumber}`);
    }, 3200); // Fully unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isNewOrder, orderNumber, router]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#D8D5DB] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
        phase === 3 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        
        {/* Animated Checkmark */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Subtle Expanding Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#2D3142]/20 animate-ping" style={{ animationDuration: '2s' }} />
          
          <div className="relative z-10 w-16 h-16 bg-[#2D3142] rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-700 hover:scale-105">
            <Check className="w-8 h-8 text-[#D8D5DB]" strokeWidth={2.5} />
          </div>
        </div>

        {/* Text Sequence */}
        <div className="text-center space-y-3 h-20">
          <h1
            className={`text-2xl md:text-3xl font-black tracking-[0.15em] uppercase text-[#2D3142] transition-all duration-700 transform ${
              phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Order Confirmed
          </h1>
          
          <p
            className={`text-sm md:text-base font-semibold tracking-widest uppercase text-[#2D3142]/70 transition-all duration-700 transform ${
              phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Your piece is reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
