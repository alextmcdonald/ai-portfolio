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

type AudienceId = 'everyone' | 'recruiters' | 'design-directors' | 'product-managers' | 'engineers';

interface AudienceTab {
  id: AudienceId;
  label: string;
}

const AUDIENCE_TABS: AudienceTab[] = [
  { id: 'everyone', label: 'Everyone' },
  { id: 'recruiters', label: 'Recruiters' },
  { id: 'design-directors', label: 'Design Directors' },
  { id: 'product-managers', label: 'Product Managers' },
  { id: 'engineers', label: 'Engineers' }
];

const AUDIENCE_DESCRIPTIONS: Record<AudienceId, string> = {
  everyone:
    "I’m a generalist drawn to complex problems, thoughtful interfaces, and the systems that make great products possible. From early-stage ideas to enterprise platforms built at scale, I incorporate product design, design systems, and front-end design engineering to create experiences that feel simple, cohesive, and purposeful.",
  recruiters:
    "I bring 15 years of product thinking, visual craft, and technical fluency to the teams I work with. With experience spanning early-stage startups and complex enterprise products, I’m comfortable navigating ambiguity, collaborating across disciplines, and taking ideas from concept to execution.",
  'design-directors':
    "I take pride in my craft and believe truly great design balances user needs, business goals, and thoughtful execution. I enjoy bringing clarity to complex problems, raising the bar for design quality, and building the systems and shared practices that help teams create better, more consistent experiences.",
  'product-managers':
    "I thrive in ambiguous environments and enjoy partnering with product teams to turn ambitious ideas into useful, intuitive experiences. By connecting user needs with business objectives and technical realities, I help teams find clarity, align on priorities, and move from problem to solution with purpose.",
  engineers:
    "I value the partnership between design and engineering and believe the best products come from building together and collaborating early. With a strong foundation in front-end development, I enjoy bridging design and code, exploring solutions collaboratively, and creating interfaces that are as practical to build as they are intuitive to use."
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToSection,
  onOpenResume,
  onOpenContact,
  isLightMode
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeAudience, setActiveAudience] = useState<AudienceId>('everyone');

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
      <div className="w-full -mt-[5px] pb-0">
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

        {/* Audience Perspective Tabs */}
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar border-0 mt-5 sm:mt-6 mb-1 py-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {AUDIENCE_TABS.map((tab) => {
            const isSelected = activeAudience === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playTap();
                  setActiveAudience(tab.id);
                }}
                className={`relative pb-2 pt-1 px-0.5 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer shrink-0 border-0 bg-transparent ${
                  isSelected
                    ? isLightMode
                      ? 'text-stone-900 font-semibold'
                      : 'text-white font-semibold'
                    : isLightMode
                      ? 'text-stone-400 font-normal hover:text-stone-700'
                      : 'text-white/50 font-normal hover:text-white/85'
                }`}
              >
                <span>{tab.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="heroActiveAudienceTabUnderline"
                    className={`absolute bottom-0 left-0 right-0 h-[1px] rounded-full ${
                      isLightMode ? 'bg-stone-900' : 'bg-white'
                    }`}
                    style={{
                      backgroundColor: isLightMode ? '#0f172a' : '#ffffff'
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Audience Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeAudience}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`mt-2.5 text-base sm:text-xl font-normal leading-relaxed max-w-[950px] min-h-[4.5rem] sm:min-h-[3.75rem] ${
              isLightMode ? 'text-stone-600' : 'text-white/80'
            }`}
          >
            {AUDIENCE_DESCRIPTIONS[activeAudience]}
          </motion.p>
        </AnimatePresence>

        {/* Call to Actions (Prominent White Capsule + Recessed Capsule) */}
        <div className="flex flex-wrap items-center gap-4 mt-5 sm:mt-6 mb-3">
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
            className={`group/btn px-6 py-3.5 rounded-full text-sm font-semibold active:scale-95 transition-all duration-150 flex items-center gap-2 cursor-pointer border ${
              isLightMode
                ? 'bg-white/95 hover:bg-white active:bg-stone-100 text-stone-800 hover:text-stone-950 border-black/10 shadow-xs backdrop-blur-md'
                : 'bg-white/12 hover:bg-white/20 text-white border-white/15 backdrop-blur-md'
            }`}
          >
            <span>View resume</span>
            <ArrowUpRight className={`w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200 ${isLightMode ? 'text-stone-600 group-hover/btn:text-stone-900' : 'text-white'}`} />
          </button>
        </div>
      </div>

      {/* Tech Stack Showcase */}
      <TechStackSection isLightMode={isLightMode} />
    </div>
  );
};
