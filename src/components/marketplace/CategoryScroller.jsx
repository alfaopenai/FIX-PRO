import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import tools3d from '@/assets/icons/tools-3d.jpg';
import lighting3d from '@/assets/icons/lighting-3d.jpg';
import paint3d from '@/assets/icons/paint-3d.jpg';
import gardening3d from '@/assets/icons/gardening-3d.jpg';
import building3d from '@/assets/icons/building-3d.jpg';

// New visual: minimal black glyph icons inside soft glass squares
const categories = [
  {
    name: 'חומרי בניין',
    category: 'building_materials',
    img: building3d,
    glowFrom: '#94a3b8',
    glowTo: '#64748b'
  },
  {
    name: 'גינון',
    category: 'gardening',
    img: gardening3d,
    glowFrom: '#86efac',
    glowTo: '#22c55e'
  },
  {
    name: 'צבע',
    category: 'painting_supplies',
    img: paint3d,
    glowFrom: '#c4b5fd',
    glowTo: '#8b5cf6'
  },
  {
    name: 'חשמל ותאורה',
    category: 'electrical_supplies',
    img: lighting3d,
    glowFrom: '#fde047',
    glowTo: '#fbbf24'
  },
  {
    name: 'כלי עבודה',
    category: 'tools',
    img: tools3d,
    glowFrom: '#93c5fd',
    glowTo: '#60a5fa'
  },
];

export default function CategoryScroller() {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((cat) => (
          <Link
            key={cat.category}
            to={createPageUrl('Marketplace') + '?category=' + cat.category}
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 border border-white/5 shadow-[0_6px_18px_rgba(0,0,0,0.35)] group-hover:shadow-[0_12px_30px_rgba(0,255,255,0.25),_0_6px_18px_rgba(0,0,0,0.35)] group-hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
              {/* Glow (soft, per category) */}
              <div
                className="absolute inset-0 rounded-full blur-[16px] opacity-60 group-hover:opacity-95 transition-all duration-300 mix-blend-screen"
                style={{ background: `conic-gradient(from 0deg, ${cat.glowFrom}22, ${cat.glowTo}22)` }}
              />
              {/* Image only (no inner white frame) */}
              <div className="relative w-full h-full overflow-hidden rounded-full neon-wobble">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-contain object-center p-0 saturate-110 contrast-110 drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] group-hover:drop-shadow-[0_8px_14px_rgba(0,0,0,0.6)] group-hover:rotate-[-1.5deg] group-hover:scale-105 transition-all duration-300 ease-out"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://img.icons8.com/3d-fluency/96/toolbox.png'; }}
                />
                {/* Neon ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-0 ring-cyan-400/0 group-hover:ring-12 group-hover:ring-cyan-400/25 transition-all duration-300"></div>
                {/* Click flash */}
                <div className="pointer-events-none absolute inset-0 rounded-full flash-overlay opacity-0"></div>
              </div>
            </div>
            <div className="mt-2 text-sm font-extrabold text-blue-700 dark:text-gray-200 drop-shadow-sm">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>
      {/* Effects */}
      <style jsx>{`
        @keyframes neonWobble {
          0% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(2.4deg) scale(1.03); }
          50% { transform: rotate(0deg) scale(1); }
          80% { transform: rotate(-2.4deg) scale(1.03); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .group:hover .neon-wobble {
          animation: neonWobble 900ms ease-in-out infinite;
          filter: drop-shadow(0 0 14px rgba(34,211,238,0.35));
        }
        .group:active .flash-overlay {
          opacity: 0.22;
          background: radial-gradient(120px 120px at 50% 50%, rgba(34,211,238,0.35), rgba(0,0,0,0));
          transition: opacity 180ms ease-out;
        }
      `}</style>
    </div>
  );
}