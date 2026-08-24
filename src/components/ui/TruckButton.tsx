"use client";

import React from "react";
import { Check } from "lucide-react";

interface TruckButtonProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function TruckButton({ isSubmitting, isSuccess, onClick, disabled }: TruckButtonProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .truck-button {
          --color: #D8D5DB;
          --background: #2D3142;
          --success: #1E9540;
          --primary: #2D3142;
          position: relative;
          width: 100%;
          min-height: 52px;
          border-radius: 9999px;
          background: var(--background);
          color: var(--color);
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          overflow: hidden;
          transition: background 0.3s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .truck-button:active:not(:disabled) {
          transform: scale(0.98);
        }
        .truck-button:disabled {
          opacity: 0.9;
          cursor: not-allowed;
        }
        .truck-button .default-text,
        .truck-button .success-text {
          position: absolute;
          transition: transform 0.4s ease, opacity 0.4s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
        }
        .truck-button .success-text {
          transform: translateY(40px);
          opacity: 0;
          color: #fff;
        }
        .truck-button.is-animating .default-text {
          transform: translateY(-40px);
          opacity: 0;
        }
        .truck-button.is-success {
          background: var(--success);
        }
        .truck-button.is-success .default-text {
          opacity: 0;
        }
        .truck-button.is-success .success-text {
          transform: translateY(0);
          opacity: 1;
          transition-delay: 0.2s;
        }

        /* Truck Animation Setup */
        .truck-wrapper {
          position: absolute;
          left: -100px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          z-index: 2;
        }
        
        .box {
          position: absolute;
          left: calc(50% - 15px); /* Offset slightly to fall into the back */
          top: -80px;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: #D4A373; /* Classic cardboard brown */
          border: 1px solid #A67C52;
          border-radius: 1px;
          opacity: 0;
          z-index: 1; /* Falls behind the truck wall */
        }
        .box::after {
          content: '';
          position: absolute;
          top: 50%;
          left: -1px;
          right: -1px;
          height: 2px;
          background: #E3B98E;
          transform: translateY(-50%);
        }

        .truck-button.is-animating .truck-wrapper {
          animation: truck-drive 2.5s ease forwards;
        }
        .truck-button.is-animating .box {
          animation: box-drop 2.5s ease forwards;
        }

        @keyframes truck-drive {
          0% { left: -100px; }
          25% { left: 50%; transform: translate(-50%, -50%); }
          55% { left: 50%; transform: translate(-50%, -50%); }
          80% { left: 150%; transform: translate(0, -50%); }
          100% { left: 150%; transform: translate(0, -50%); }
        }

        @keyframes box-drop {
          0% { top: -80px; opacity: 0; }
          20% { top: -80px; opacity: 1; }
          35% { top: 50%; transform: translate(-50%, -16px); opacity: 1; }
          45% { top: 50%; transform: translate(-50%, -8px); opacity: 1; }
          55% { top: 50%; transform: translate(-50%, -8px); opacity: 1; }
          80% { top: 50%; transform: translate(150px, -8px); opacity: 1; }
          100% { top: 50%; transform: translate(150px, -8px); opacity: 0; }
        }
      `}} />
      <button 
        className={`truck-button shadow-soft ${isSubmitting ? 'is-animating' : ''} ${isSuccess ? 'is-success' : ''}`}
        disabled={disabled || isSubmitting || isSuccess}
        onClick={onClick}
        type="submit"
      >
        <span className="default-text">ORDER NOW</span>
        <span className="success-text">
          <Check className="w-5 h-5 stroke-[3]" /> ORDER CONFIRMED
        </span>

        {/* Box */}
        <div className="box"></div>

        {/* Custom Colorful Truck */}
        <div className="truck-wrapper">
          <svg width="64" height="32" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cargo Box (White/Light Grey) */}
            <rect x="2" y="6" width="36" height="18" rx="2" fill="#ECEAEF" />
            <rect x="2" y="6" width="36" height="18" rx="2" stroke="#ADACB5" strokeWidth="1" />
            
            {/* Horizontal Stripe on Cargo (Brand Color) */}
            <rect x="2" y="16" width="36" height="2" fill="#ADACB5" />
            
            {/* Cabin (Cool Gray/Blue) */}
            <path d="M38 12C38 10.8954 38.8954 10 40 10H46.5L52.5 16V22C52.5 23.1046 51.6046 24 50.5 24H38V12Z" fill="#C7C5CF" stroke="#ADACB5" strokeWidth="1" />
            
            {/* Cabin Window */}
            <path d="M45.5 11.5L50.5 16.5V17H39.5V11.5H45.5Z" fill="#2D3142" opacity="0.6" />
            
            {/* Headlight */}
            <path d="M52 20.5C52 19.6716 52.6716 19 53.5 19V19C54.3284 19 55 19.6716 55 20.5V20.5C55 21.3284 54.3284 22 53.5 22V22C52.6716 22 52 21.3284 52 20.5V20.5Z" fill="#FDE047" />
            
            {/* Taillight */}
            <rect x="1" y="19" width="3" height="4" rx="1" fill="#EF4444" />
            
            {/* Wheels */}
            {/* Back wheel */}
            <circle cx="12" cy="24" r="5" fill="#111" />
            <circle cx="12" cy="24" r="2" fill="#D8D5DB" />
            
            {/* Middle wheel */}
            <circle cx="28" cy="24" r="5" fill="#111" />
            <circle cx="28" cy="24" r="2" fill="#D8D5DB" />
            
            {/* Front wheel */}
            <circle cx="45" cy="24" r="5" fill="#111" />
            <circle cx="45" cy="24" r="2" fill="#D8D5DB" />
          </svg>
        </div>
      </button>
    </>
  );
}
