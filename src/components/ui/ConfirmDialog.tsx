"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { X } from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = (value: boolean) => {
    setIsOpen(false);
    if (resolver) resolver(value);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2D3142]/40 backdrop-blur-sm" onClick={() => handleClose(false)} />
          <div 
            className="relative bg-[#D8D5DB] w-full max-w-sm rounded-[24px] shadow-2xl border border-[#ADACB5]/30 overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6 text-center">
              <h3 className="text-lg font-black tracking-tight uppercase text-[#2D3142] mb-2">{options.title}</h3>
              <p className="text-sm font-semibold text-[#2D3142]/70">{options.message}</p>
            </div>
            <div className="flex border-t border-[#ADACB5]/30">
              <button
                onClick={() => handleClose(false)}
                className="flex-1 py-4 text-xs font-black tracking-widest uppercase text-[#2D3142]/70 hover:bg-white/40 transition-colors"
              >
                {options.cancelText || "KEEP ORDER"}
              </button>
              <div className="w-px bg-[#ADACB5]/30" />
              <button
                onClick={() => handleClose(true)}
                className={`flex-1 py-4 text-xs font-black tracking-widest uppercase transition-colors ${
                  options.destructive 
                    ? "text-red-600 hover:bg-red-50" 
                    : "text-[#2D3142] hover:bg-white/40"
                }`}
              >
                {options.confirmText || "CANCEL ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}
