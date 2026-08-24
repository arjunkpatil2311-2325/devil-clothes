"use client";

import React from "react";
import { Check, Truck } from "lucide-react";

interface TruckButtonProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function TruckButton({ isSubmitting, isSuccess, onClick, disabled }: TruckButtonProps) {
  // CSS is injected to handle the complex keyframes
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
        }
        .box {
          position: absolute;
          left: 50%;
          top: -80px;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background: #C7C5CF;
          border: 2px solid var(--primary);
          border-radius: 2px;
          opacity: 0;
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
          80% { left: 120%; transform: translate(0, -50%); }
          100% { left: 120%; transform: translate(0, -50%); }
        }

        @keyframes box-drop {
          0% { top: -80px; opacity: 0; }
          20% { top: -80px; opacity: 1; }
          35% { top: 50%; transform: translate(-50%, -10px); opacity: 1; }
          45% { top: 50%; transform: translate(-50%, 0); opacity: 1; }
          55% { top: 50%; transform: translate(-50%, 0); opacity: 1; }
          80% { top: 50%; transform: translate(150px, 0); opacity: 1; }
          100% { top: 50%; transform: translate(150px, 0); opacity: 0; }
        }

        .truck-svg {
          width: 48px;
          height: 24px;
          fill: none;
          stroke: #D8D5DB;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
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

        {/* Truck */}
        <div className="truck-wrapper text-[#D8D5DB]">
          <Truck className="w-8 h-8 stroke-[1.5]" />
        </div>
      </button>
    </>
  );
}
