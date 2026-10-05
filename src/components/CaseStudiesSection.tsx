import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CASE_STUDIES } from '../data/portfolioData';
import { CaseStudy } from '../types';
import { sounds } from '../utils/audio';

interface CaseStudiesSectionProps {
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
  isLightMode?: boolean;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onSelectCaseStudy,
  isLightMode = false
}) => {
  return (
    <div className="relative w-full">
      {/* Case Studies Cards: Full-Bleed Image Cards with solid studio background photography */}
      <div className="space-y-8 sm:space-y-10 w-full">
        {CASE_STUDIES.map((study) => {
          return (
            <div
              key={study.id}
              onClick={() => {
                sounds.playGlassChime();
                onSelectCaseStudy(study);
              }}
              className={`group relative rounded-[28px] sm:rounded-[36px] overflow-hidden transition-all duration-500 min-h-[440px] sm:min-h-[500px] flex flex-col justify-between px-4 sm:px-8 lg:px-10 py-8 sm:py-12 cursor-pointer ${
                isLightMode
                  ? 'border border-stone-900/10 hover:border-stone-900/20 shadow-xl bg-white'
                  : 'border border-white/15 hover:border-white/30 shadow-2xl bg-stone-950'
              }`}
            >
              {/* Full-bleed Image Backdrop Spanning Entire Div */}
              <div className={`absolute inset-0 z-0 overflow-hidden ${isLightMode ? 'bg-stone-100' : 'bg-stone-950'}`}>
                <img
                  src={study.heroImage}
                  alt={study.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Mode-Adaptive Gradient Scrims: Soft light scrim for daylight mode, cinematic dark scrim for dark mode */}
                {isLightMode ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-transparent to-white/15 pointer-events-none" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25 pointer-events-none" />
                  </>
                )}
              </div>

              {/* Top Row: Category Badge */}
              <div className="relative z-10 self-end px-2 sm:px-0">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-[11px] font-mono font-medium transition-colors ${
                    isLightMode
                      ? 'bg-white/85 border border-stone-900/10 text-stone-800 shadow-xs'
                      : 'bg-black/60 border border-white/15 text-white'
                  }`}
                  style={isLightMode ? { color: '#1c1917' } : { color: '#ffffff' }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isLightMode ? 'bg-[#0071e3]' : 'bg-emerald-400'
                  }`} />
                  <span className="font-mono">{study.category}</span>
                </div>
              </div>

              {/* Bottom-Aligned Section: Left-aligned Title, Description, and Pill Button */}
              <div className="relative z-10 max-w-xl mt-auto pt-6 pb-2 px-2 sm:px-0">
                <h3
                  className={`text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] ${
                    isLightMode ? 'text-stone-950' : 'text-white'
                  }`}
                  style={isLightMode ? { color: '#0f0f10' } : { color: '#ffffff' }}
                >
                  {study.title.split('—')[0].trim()}
                </h3>

                <p
                  className={`mt-4 text-base sm:text-xl leading-relaxed font-normal max-w-lg ${
                    isLightMode ? 'text-stone-700' : 'text-white/90'
                  }`}
                  style={isLightMode ? { color: '#334155' } : { color: '#ffffff' }}
                >
                  {study.subtitle}
                </p>

                <div className="mt-6 sm:mt-7">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playGlassChime();
                      onSelectCaseStudy(study);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white force-white text-sm font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(0,113,227,0.35)] active:scale-95 group/btn cursor-pointer"
                    style={{ color: '#ffffff' }}
                  >
                    <span className="text-[14px] leading-[20px]" style={{ color: '#ffffff' }}>View case study</span>
                    <ArrowUpRight className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" style={{ color: '#ffffff' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
