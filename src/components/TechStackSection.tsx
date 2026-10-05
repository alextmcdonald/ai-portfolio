import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sounds } from '../utils/audio';

interface TechItem {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  brandColor?: string;
}

interface TechStackProps {
  isLightMode: boolean;
}

export const TechStackSection: React.FC<TechStackProps> = ({ isLightMode }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const TECH_ITEMS: TechItem[] = [
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design Systems & UI',
      brandColor: '#F24E1E',
      icon: (
        <svg viewBox="0 0 38 57" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
        </svg>
      )
    },
    {
      id: 'react',
      name: 'React',
      category: 'UI Engineering',
      brandColor: '#61DAFB',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      )
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Type-Safe Architecture',
      brandColor: '#3178C6',
      icon: (
        <svg viewBox="0 0 128 128" className="w-5 h-5 sm:w-6 sm:h-6">
          <rect width="128" height="128" rx="20" fill="#3178C6" />
          <path d="M68.5 83.4c2.5 4.3 6.9 7 12.8 7 5.6 0 9.2-2.7 9.2-6.6 0-4.5-3.8-6.1-10.4-8.8-9.4-3.8-15.6-8.5-15.6-18.7 0-9.8 7.6-17.1 19.3-17.1 8.2 0 14.2 2.8 18.2 8.4l-7.7 5.2c-2.4-3.4-5.6-5-10.3-5-4.8 0-8 2.7-8 6.1 0 3.8 3.3 5.4 9.6 8 10.3 4.2 16.4 8.7 16.4 19.4 0 11.2-8.5 17.7-21.2 17.7-10.4 0-17.6-4.1-21.9-10.9l9.6-4.7zM49.6 50.8v47.6h-11.8v-47.6h-16.1v-9.6h44v9.6h-16.1z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Design Token System',
      brandColor: '#38BDF8',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" fill="#38BDF8" />
        </svg>
      )
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      category: 'React Framework',
      brandColor: '#000000',
      icon: (
        <svg viewBox="0 0 180 180" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <circle cx="90" cy="90" r="90" fill={isLightMode ? '#000000' : '#FFFFFF'} />
          <path d="M149.508 157.08L69.142 54H54V125.882H66.6667V69.9678L139.999 164.249C143.327 162.083 146.505 159.682 149.508 157.08Z" fill={isLightMode ? '#FFFFFF' : '#000000'} />
          <path d="M115.5 54H128V103.882H115.5V54Z" fill={isLightMode ? '#FFFFFF' : '#000000'} />
        </svg>
      )
    },
    {
      id: 'framer',
      name: 'Framer',
      category: 'Interactive Motion',
      brandColor: '#0055FF',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill={isLightMode ? '#0f172a' : '#ffffff'}>
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
      )
    },
    {
      id: 'swift',
      name: 'SwiftUI',
      category: 'Spatial & Apple Platforms',
      brandColor: '#F05138',
      icon: (
        <svg viewBox="0 0 128 128" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <rect width="128" height="128" rx="28" fill="#F05138" />
          <path d="M96.7 87.2C85.5 99.4 69.4 105.7 54.1 103.4C71.3 93.9 79.5 78.4 81.3 64.9C67.6 75.9 49.3 78.8 33 69.9C45.8 69.5 56.4 62.4 62.6 51.5C53.5 54.4 43.1 50.8 36.6 42.2C48.6 44.4 61.4 39.4 67.2 27C52.1 33.3 35.8 28.5 25 16C36.8 35.5 59.4 46.2 82.3 43.6C80.2 49.8 76.5 55.4 71.6 59.9C83.2 57.7 93.9 50.4 100.8 40.5C104.9 57.8 98.7 74.2 96.7 87.2Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'cursor',
      name: 'Cursor',
      category: 'AI-First Code Editor',
      brandColor: '#8B5CF6',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#A78BFA" />
          <path d="M2 17L12 22L22 17V11L12 16L2 11V17Z" fill="#7C3AED" />
          <path d="M2 7V17L12 22V12L2 7Z" fill="#8B5CF6" opacity="0.6" />
        </svg>
      )
    },
    {
      id: 'python',
      name: 'Python',
      category: 'AI & Machine Learning',
      brandColor: '#3776AB',
      icon: (
        <svg viewBox="0 0 128 128" className="w-5 h-5 sm:w-6 sm:h-6">
          <path d="M63.6 5.8c-28.7 0-27 12.4-27 12.4l.03 12.9h27.5v3.9H26.3S6 32.7 6 61.9c0 29.3 17.7 28.2 17.7 28.2h10.6v-14.8s-.6-17.7 17.4-17.7h27.2s16.6-.3 16.6-16.1V18.2s1.5-12.4-31.9-12.4zm-15 8.7c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1-5.1-2.3-5.1-5.1 2.3-5.1 5.1-5.1z" fill="#3776AB" />
          <path d="M64.4 122.2c28.7 0 27-12.4 27-12.4l-.03-12.9H63.9v-3.9h37.8s20.3 2.3 20.3-26.9c0-29.3-17.7-28.2-17.7-28.2h-10.6v14.8s.6 17.7-17.4 17.7H49.1s-16.6.3-16.6 16.1v23.3s-1.5 12.4 31.9 12.4zm15-8.7c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z" fill="#FFD438" />
        </svg>
      )
    },
    {
      id: 'claude',
      name: 'Claude & Gemini',
      category: 'Generative AI & LLMs',
      brandColor: '#D97706',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
          <path d="M12 2L14.2 8.3L20.5 10.5L14.2 12.7L12 19L9.8 12.7L3.5 10.5L9.8 8.3L12 2Z" fill="#D97706" />
          <circle cx="18" cy="18" r="2.5" fill="#F59E0B" />
          <circle cx="6" cy="18" r="1.5" fill="#F59E0B" />
        </svg>
      )
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Backend & Tooling',
      brandColor: '#5FA04E',
      icon: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 sm:w-6 sm:h-6">
          <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" fill="#5FA04E" />
          <path d="M16 11.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 7.2a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'Version Control & CI/CD',
      brandColor: '#24292F',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill={isLightMode ? '#24292F' : '#FFFFFF'}>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="mt-6 sm:mt-8 pt-1">
      <div className="flex flex-wrap items-center gap-y-4 gap-x-4 sm:gap-x-5">
        
        {/* Left: Overlapping tech stack icon tiles */}
        <div className="flex items-center -space-x-2 sm:-space-x-2.5 isolate py-2">
          {TECH_ITEMS.map((item, idx) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="relative group transition-all duration-200"
                style={{
                  zIndex: isHovered ? 40 : idx + 1
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(item.id)}
              >
                {/* Tooltip floating above icon */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center"
                    >
                      <div className={`px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.25)] border backdrop-blur-xl whitespace-nowrap text-center ${
                        isLightMode
                          ? 'bg-stone-900 text-white border-stone-800'
                          : 'bg-stone-900/95 text-white border-white/20'
                      }`}>
                        <div className="text-xs font-semibold leading-tight tracking-tight">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-stone-300 font-normal leading-tight mt-0.5">
                          {item.category}
                        </div>
                      </div>
                      {/* Downward triangle caret */}
                      <div className={`w-2 h-2 rotate-45 -mt-1 border-r border-b ${
                        isLightMode
                          ? 'bg-stone-900 border-stone-800'
                          : 'bg-stone-900/95 border-white/20'
                      }`} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon Tile */}
                <button
                  type="button"
                  onClick={() => sounds.playTap()}
                  aria-label={item.name}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isLightMode
                      ? 'bg-white/95 text-stone-800 border border-stone-200/90 ring-2 ring-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'bg-[#181a20] text-white border border-white/15 ring-2 ring-[#0c0d12]/90 shadow-[0_4px_14px_rgba(0,0,0,0.45)]'
                  } ${isHovered ? '-translate-y-1.5 scale-110 shadow-xl' : 'hover:-translate-y-0.5'}`}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Handwritten Script "Current tech stack" with arrow pointing to it */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 select-none py-1">
          {/* Hand-drawn curved arrow pointing toward the tech stack icons */}
          <div className="relative text-[#38bdf8] transition-colors duration-200" style={{ color: '#38bdf8' }}>
            <svg
              width="44"
              height="28"
              viewBox="0 0 52 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-5 sm:w-10 sm:h-6 -scale-y-90 rotate-6 text-[#38bdf8]"
              style={{ color: '#38bdf8' }}
            >
              {/* Curved sketch stroke */}
              <path
                d="M48 6C36 5 14 10 7 24"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Arrow head pointing left toward the icons */}
              <path
                d="M17 21L6 25L9 14"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Script words */}
          <div className="flex flex-col">
            <span
              className={`font-handwriting text-[24px] font-bold tracking-wide -rotate-2 ${
                isLightMode ? 'text-[#0071e3]' : 'text-[#38bdf8]'
              }`}
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '24px'
              }}
            >
              Current tech stack
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
