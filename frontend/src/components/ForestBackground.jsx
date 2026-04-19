import React from 'react';

export default function ForestBackground() {
  return (
    <>
      {/* 1. Organic Paper / Wood Noise Texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] mix-blend-multiply" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed'
        }}
      />

      {/* 2. Abstract Majestic Tree Silhouette (Top Left) */}
      <svg 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] text-[#085041] opacity-[0.03] pointer-events-none -rotate-12" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M14 22v-4a2 2 0 10-4 0v4H6v-4.5l-3 1V16l3-1.5V11L3 12V9l3-2V4a2 2 0 114 0v3h4V4a2 2 0 114 0v3l3 2v3l-3-1v3.5l3 1.5v2.5l-3-1V22h-4z" />
        <circle cx="12" cy="7" r="4" />
        <circle cx="6" cy="11" r="3" />
        <circle cx="18" cy="11" r="3" />
        <circle cx="7" cy="16" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
      </svg>

      {/* 3. Abstract Forest Leaf Motif (Bottom Right) */}
      <svg 
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] text-[#085041] opacity-[0.04] pointer-events-none rotate-45" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 21.036c-3.119-1.28-7.5-5.592-7.5-12.036A4.5 4.5 0 019 4.5c1.24 0 2.387.408 3 1.094A4.5 4.5 0 0115 4.5c2.485 0 4.5 2.015 4.5 4.5 0 6.444-4.381 10.756-7.5 12.036z" />
        <path d="M12 9v12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
      
      {/* 4. Topographic Contour Lines (Center ambient) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none mask-image-radial"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-50 0a50 50 0 1 0 100 0a50 50 0 1 0 -100 0m10 0a40 40 0 1 0 80 0a40 40 0 1 0 -80 0m10 0a30 30 0 1 0 60 0a30 30 0 1 0 -60 0m10 0a20 20 0 1 0 40 0a20 20 0 1 0 -40 0m10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0' fill='none' stroke='%23085041' stroke-width='0.5' /%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)'
        }}
      />
    </>
  );
}
