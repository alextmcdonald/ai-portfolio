import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight
} from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';
import { TechStackSection } from './TechStackSection';

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenContact: () => void;
  isLightMode: boolean;
}

const ROTATING_WORDS = ['ambitious', 'futuristic', 'functional', 'visionary'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToSection,
  onOpenResume,
  onOpenContact,
  isLightMode
}) => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 4800);
    return () => clearInterval(timer);
  }, []);

  const currentWord = ROTATING_WORDS[wordIndex];

  return (
    <div className="relative px-2 sm:px-0">
      {/* Hero Headline & Manifesto */}
      <div className="w-full">
        <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.18] text-balance ${
          isLightMode ? 'text-stone-900' : 'text-white'
        }`}>
          <span>Design partner for </span>
          <motion.span layout className="inline-flex items-baseline whitespace-nowrap">
            <motion.span
              layout
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative inline-block overflow-hidden align-baseline h-[1.22em] -mb-[0.22em]"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={currentWord}
                  layout
                  initial={{ y: '100%', opacity: 0, filter: 'blur(3px)' }}
                  animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: '-100%', opacity: 0, filter: 'blur(3px)' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-[#0071e3]"
                >
                  {currentWord}
                </motion.span>
              </AnimatePresence>
            </motion.span>

            {/* "teams" stays continuously present and smoothly glides left/right */}
            <motion.span
              layout
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block"
            >
              &nbsp;teams
            </motion.span>
          </motion.span>
        </h2>

        <p className={`mt-6 text-base sm:text-xl font-normal leading-relaxed max-w-4xl ${
          isLightMode ? 'text-stone-600' : 'text-white/80'
        }`}>
          I specialize in visual communication as a UX designer, with strong creative problem-solving and execution skills. I bring my work to life by coding websites, apps, and games. I thrive on pushing boundaries, taking risks, and infusing narrative into my work.
        </p>

        {/* Call to Actions (Prominent White Capsule + Recessed Capsule) */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          {/* Prominent visionOS Button */}
          <button
            onClick={() => {
              sounds.playTap();
              onScrollToSection('work');
            }}
            className="group/btn px-7 py-3.5 rounded-full text-sm font-semibold active:scale-97 transition-all duration-200 flex items-center gap-2 bg-[#0071e3] hover:bg-[#0077ed] text-white force-white shadow-[0_4px_20px_rgba(0,113,227,0.3)] cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <span style={{ color: '#ffffff' }}>Explore case studies</span>
            <ArrowDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform duration-200" style={{ color: '#ffffff' }} />
          </button>

          {/* Secondary Recessed Button */}
          <button
            onClick={() => {
              sounds.playTap();
              onOpenResume();
            }}
            className={`group/btn px-6 py-3.5 rounded-full text-sm font-semibold active:scale-97 transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isLightMode
                ? 'bg-white/80 hover:bg-white text-stone-800 hover:text-stone-950 border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md'
                : 'bg-black/25 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md'
            }`}
          >
            <span>View resume & bio</span>
            <ArrowUpRight className={`w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200 ${isLightMode ? 'text-stone-500' : 'text-white/70'}`} />
          </button>
        </div>
      </div>

      {/* Quantitative Rigor Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-4xl mt-6">
        {DESIGNER_INFO.stats.map((stat, idx) => (
          <div
            key={idx}
            className="transition-colors duration-200"
          >
            <div className={`text-[32px] font-bold not-italic tracking-tight tabular-nums leading-tight ${
              isLightMode ? 'text-stone-900' : 'text-white'
            }`}>
              {stat.value}
            </div>
            <div className={`text-base font-normal mt-1 ${
              isLightMode ? 'text-stone-700' : 'text-white/80'
            }`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack Showcase */}
      <TechStackSection isLightMode={isLightMode} />
    </div>
  );
};
