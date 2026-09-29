'use client';

import React from 'react';

/**
 * Building a Data-Driven India card
 * Sidebar bottom showcase card with tricolor lotus emblem
 */
export function BuildingDataIndiaCard({ isHindi = false }: { isHindi?: boolean }) {
  return (
    <div className="relative mt-auto m-3 p-4 rounded-2xl bg-gradient-to-b from-[#FFFDF7] via-[#F4F9F9] to-[#EBF3FB] border border-[#D8DFEE] overflow-hidden shadow-2xs group select-none">
      {/* Subtle background wave graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          viewBox="0 0 200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          fill="none"
        >
          <path
            d="M0 80 Q 50 60, 100 80 T 200 80 L 200 120 L 0 120 Z"
            fill="url(#waveGradient)"
            opacity="0.5"
          />
          <path
            d="M0 95 Q 60 75, 120 95 T 200 95 L 200 120 L 0 120 Z"
            fill="#DCE9F8"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Tricolor Lotus Leaf Emblem */}
      <div className="relative z-10 flex justify-center mb-2.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-2xs border border-[#E2E8F0]/80 p-2 group-hover:scale-105 transition-transform duration-200">
          <svg viewBox="0 0 48 48" fill="none" className="h-8 w-8" xmlns="http://www.w3.org/2000/svg">
            {/* Center Petal - Saffron Orange */}
            <path
              d="M24 6 C21 16, 21 26, 24 32 C27 26, 27 16, 24 6 Z"
              fill="#F97316"
            />
            {/* Left Petal - Teal / Cyan Blue */}
            <path
              d="M24 16 C16 19, 11 26, 13 33 C18 34, 22 28, 24 23 Z"
              fill="#0D9488"
            />
            {/* Right Petal - India Green */}
            <path
              d="M24 16 C32 19, 37 26, 35 33 C30 34, 26 28, 24 23 Z"
              fill="#16A34A"
            />
            {/* Left Outer Leaf */}
            <path
              d="M22 26 C13 28, 7 35, 10 40 C16 41, 21 34, 23 30 Z"
              fill="#0284C7"
              opacity="0.85"
            />
            {/* Right Outer Leaf */}
            <path
              d="M26 26 C35 28, 41 35, 38 40 C32 41, 27 34, 25 30 Z"
              fill="#15803D"
              opacity="0.85"
            />
            {/* Base Petal */}
            <path
              d="M17 38 C21 41, 27 41, 31 38 C28 42, 20 42, 17 38 Z"
              fill="#EA580C"
            />
          </svg>
        </div>
      </div>

      {/* Text Stack */}
      <div className="relative z-10 text-center">
        <h3 className="font-extrabold text-[13px] text-[#1F273A] tracking-tight leading-snug">
          {isHindi ? 'डेटा-संचालित भारत का निर्माण' : 'Building a Data-Driven India'}
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-normal">
          {isHindi
            ? 'सांख्यिकीय ज्ञान और कौशल से नागरिकों और अधिकारियों को सशक्त बनाना'
            : 'Empowering people with statistical knowledge and skills'}
        </p>
      </div>
    </div>
  );
}

export default BuildingDataIndiaCard;
