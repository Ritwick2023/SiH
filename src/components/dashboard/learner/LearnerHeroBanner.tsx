'use client';

import React from 'react';
import Image from 'next/image';

interface LearnerHeroBannerProps {
  name: string;
  isHindi?: boolean;
}

export function LearnerHeroBanner({ name, isHindi = false }: LearnerHeroBannerProps) {
  const firstName = name ? name.split(' ')[0] : 'Rithwik';

  return (
    <div className="relative rounded-2xl border border-[#D8DFEE] bg-gradient-to-r from-[#EBF3FC] via-[#E2EEFA] to-[#DCE9F8] overflow-hidden shadow-xs min-h-[160px] flex items-center">
      {/* Background blend & Rashtrapati Bhavan image on right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-5/12 hidden sm:block pointer-events-none overflow-hidden select-none">
        <div
          className="relative w-full h-full"
          style={{
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Image
            src="/images/hero-rashtrapati-bhavan.jpg"
            alt="Rashtrapati Bhavan - Government of India"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Left text stack */}
      <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-[#1C4CA1]">
          {isHindi ? 'सुप्रभात,' : 'GOOD MORNING,'}
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F273A] tracking-tight mt-1 flex items-center gap-2">
          <span>{firstName}</span>
          <span className="text-2xl sm:text-3xl" role="img" aria-label="Waving hand">👋</span>
        </h1>
        <p className="font-bold text-base sm:text-lg text-[#1F273A] mt-1.5 leading-snug">
          {isHindi
            ? 'आइए आपकी सीखने की यात्रा जारी रखें'
            : "Let's continue your learning journey"}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {isHindi
            ? 'अपनी दक्षताओं का निर्माण करें। अपने कौशल को सुदृढ़ करें। डेटा-संचालित भारत में योगदान दें।'
            : 'Build your competencies. Strengthen your skills. Contribute to a data-driven India.'}
        </p>
      </div>
    </div>
  );
}

export default LearnerHeroBanner;
