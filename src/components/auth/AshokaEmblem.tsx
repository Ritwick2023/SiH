'use client';

import React from 'react';

/**
 * State Emblem of India (Ashoka Lion Capital)
 * Official emblem of the Government of India & MoSPI
 */
export function AshokaEmblem({
  className = 'h-10 w-auto',
  color = '#1F273A',
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="State Emblem of India"
    >
      <g fill={color}>
        {/* Central Crown / Crest */}
        <path d="M57 8 C57 5, 63 5, 63 8 L64 14 L56 14 Z" />
        <circle cx="60" cy="5" r="2.5" />

        {/* Central Lion Head */}
        <path d="M50 14 C48 10, 72 10, 70 14 C75 18, 76 26, 73 34 C71 39, 67 43, 60 44 C53 43, 49 39, 47 34 C44 26, 45 18, 50 14 Z" />
        {/* Lion Mane Strands (Center) */}
        <path d="M48 20 C42 22, 43 32, 49 35 C48 29, 49 23, 48 20 Z" />
        <path d="M72 20 C78 22, 77 32, 71 35 C72 29, 71 23, 72 20 Z" />
        <path d="M52 35 C46 38, 48 48, 55 49 C54 43, 53 38, 52 35 Z" />
        <path d="M68 35 C74 38, 72 48, 65 49 C66 43, 67 38, 68 35 Z" />
        {/* Central Lion Facial Features */}
        <circle cx="55" cy="24" r="1.5" />
        <circle cx="65" cy="24" r="1.5" />
        <path d="M58 26 L62 26 L60 30 Z" />
        <path d="M57 32 C58 34, 62 34, 63 32" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Moustache / Whisker Pads */}
        <ellipse cx="57" cy="31" rx="2" ry="1.2" />
        <ellipse cx="63" cy="31" rx="2" ry="1.2" />

        {/* Left Lion Head (Profile) */}
        <path d="M28 20 C24 16, 44 14, 46 22 C48 28, 46 37, 41 43 C36 44, 30 38, 28 32 C26 27, 27 23, 28 20 Z" />
        <path d="M26 23 C20 25, 22 36, 29 38 C27 32, 26 27, 26 23 Z" />
        <path d="M22 28 C18 31, 21 41, 30 42 C27 38, 25 33, 22 28 Z" />
        <circle cx="34" cy="26" r="1.3" />
        <path d="M28 31 L32 30" stroke={color} strokeWidth="1.2" />

        {/* Right Lion Head (Profile) */}
        <path d="M92 20 C96 16, 76 14, 74 22 C72 28, 74 37, 79 43 C84 44, 90 38, 92 32 C94 27, 93 23, 92 20 Z" />
        <path d="M94 23 C100 25, 98 36, 91 38 C93 32, 94 27, 94 23 Z" />
        <path d="M98 28 C102 31, 99 41, 90 42 C93 38, 95 33, 98 28 Z" />
        <circle cx="86" cy="26" r="1.3" />
        <path d="M92 31 L88 30" stroke={color} strokeWidth="1.2" />

        {/* Torso & Forelegs of the 3 Lions */}
        <path d="M38 43 C36 50, 36 68, 38 78 L47 78 C46 68, 47 52, 49 46 Z" />
        <path d="M54 48 C53 56, 53 69, 54 78 L66 78 C67 69, 67 56, 66 48 Z" />
        <path d="M82 43 C84 50, 84 68, 82 78 L73 78 C74 68, 73 52, 71 46 Z" />
        <path d="M48 48 C45 54, 45 68, 46 78 L53 78 C52 68, 52 56, 51 48 Z" />
        <path d="M72 48 C75 54, 75 68, 74 78 L67 78 C68 68, 68 56, 69 48 Z" />

        {/* Mane Details on Chest */}
        <path d="M42 56 C39 60, 41 68, 45 68 C44 63, 43 59, 42 56 Z" />
        <path d="M78 56 C81 60, 79 68, 75 68 C76 63, 77 59, 78 56 Z" />

        {/* Abacus Upper Border */}
        <rect x="18" y="78" width="84" height="4" rx="1.5" />
        {/* Abacus Frieze Body */}
        <rect x="22" y="82" width="76" height="20" rx="1" />
      </g>

      {/* Ashoka Chakra in Center of Abacus */}
      <circle cx="60" cy="92" r="8" stroke={color} strokeWidth="1.4" fill="none" />
      <circle cx="60" cy="92" r="1.5" fill={color} />
      {/* 24 Spokes (Represented cleanly via 12 intersecting cross lines) */}
      <g stroke={color} strokeWidth="0.7">
        <line x1="60" y1="84" x2="60" y2="100" />
        <line x1="52" y1="92" x2="68" y2="92" />
        <line x1="54.34" y1="86.34" x2="65.66" y2="97.66" />
        <line x1="54.34" y1="97.66" x2="65.66" y2="86.34" />
        <line x1="57.07" y1="84.34" x2="62.93" y2="99.66" />
        <line x1="62.93" y1="84.34" x2="57.07" y2="99.66" />
        <line x1="52.34" y1="89.07" x2="67.66" y2="94.93" />
        <line x1="52.34" y1="94.93" x2="67.66" y2="89.07" />
      </g>

      {/* Carvings on Abacus: Bull on Left, Horse on Right */}
      <g fill={color}>
        {/* Bull carving (Left) */}
        <path d="M30 96 C30 92, 33 88, 38 88 C41 88, 43 90, 44 93 C42 93, 40 92, 38 93 C36 94, 35 96, 35 98 L30 98 Z" />
        <path d="M33 87 C31 85, 30 87, 30 88" stroke={color} strokeWidth="1" />

        {/* Horse carving (Right) */}
        <path d="M90 96 C90 92, 87 88, 82 88 C79 88, 77 90, 76 93 C78 93, 80 92, 82 93 C84 94, 85 96, 85 98 L90 98 Z" />
        <path d="M87 87 C89 85, 90 87, 90 88" stroke={color} strokeWidth="1" />

        {/* Abacus Lower Rim */}
        <rect x="18" y="102" width="84" height="4" rx="1.5" />

        {/* Inverted Lotus Bell Base */}
        <path d="M26 106 C28 118, 42 124, 60 124 C78 124, 92 118, 94 106 Z" fill="none" stroke={color} strokeWidth="1.8" />
        {/* Lotus Petal Strands */}
        <path d="M60 106 L60 123" stroke={color} strokeWidth="1.2" />
        <path d="M50 106 C51 113, 53 118, 55 122" stroke={color} strokeWidth="1" />
        <path d="M70 106 C69 113, 67 118, 65 122" stroke={color} strokeWidth="1" />
        <path d="M40 106 C42 112, 45 116, 48 119" stroke={color} strokeWidth="1" />
        <path d="M80 106 C78 112, 75 116, 72 119" stroke={color} strokeWidth="1" />
        <path d="M32 106 C34 110, 38 113, 42 115" stroke={color} strokeWidth="0.8" />
        <path d="M88 106 C86 110, 82 113, 78 115" stroke={color} strokeWidth="0.8" />

        {/* Pedestal Base Line */}
        <rect x="22" y="125" width="76" height="3" rx="1.5" />
      </g>

      {/* Motto: "सत्यमेव जयते" (Satyameva Jayate) in Devanagari */}
      <text
        x="60"
        y="144"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="bold"
        fontFamily="sans-serif"
        fill={color}
        letterSpacing="0.8"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

export default AshokaEmblem;
