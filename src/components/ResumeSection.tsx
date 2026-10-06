import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Code,
  Layers,
  Compass,
  X,
  ExternalLink,
  Flame,
  Activity,
  Heart
} from 'lucide-react';
import { RECOMMENDATIONS } from '../data/portfolioData';
import { sounds } from '../utils/audio';

const LATEST_STRAVA_ACTIVITY = {
  title: 'Morning Ride · Mercer Island Loop',
  type: 'Ride',
  date: 'Yesterday at 7:14 AM',
  location: 'Seattle, WA',
  distance: '28.4 mi',
  movingTime: '1h 24m',
  elevation: '1,420 ft',
  avgSpeed: '20.2 mph',
  calories: '942 kcal',
  athleteUrl: 'https://www.strava.com/athletes/almcd',
  athleteHandle: 'almcd',
  path: 'M 30 75 Q 65 15, 125 30 T 215 25 T 275 70 T 230 125 T 125 115 T 50 95 Z'
};

const PERSONAL_PHOTOS = [
  {
    id: 'studio-desk',
    url: '/src/assets/images/alex_workspace_design_1790966330105.jpg',
    tilt: '-rotate-2'
  },
  {
    id: 'creative-craft',
    url: '/src/assets/images/alex_creative_craft_1790966354531.jpg',
    tilt: 'rotate-2'
  },
  {
    id: 'candid-focus',
    url: '/src/assets/images/alex_portrait_blue_1790739680820.jpg',
    tilt: '-rotate-1'
  },
  {
    id: 'design-workshop',
    url: '/src/assets/images/alex_design_workshop_1790966343011.jpg',
    tilt: 'rotate-2'
  },
  {
    id: 'coastal-mist',
    url: '/src/assets/images/env_light_coast_1790741180007.jpg',
    tilt: '-rotate-2'
  }
];

const MARQUEE_PHOTOS = [...PERSONAL_PHOTOS, ...PERSONAL_PHOTOS];

interface ResumeSectionProps {
  onOpenResumeModal: () => void;
  isLightMode?: boolean;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  onOpenResumeModal,
  isLightMode = false
}) => {
  // Lightbox State for Personal Photos
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Recommendations Slideshow State
  const [recIndex, setRecIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Strava State (Latest Activity)
  const [kudosCount, setKudosCount] = useState(38);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);

  const handleGiveKudos = () => {
    if (!hasGivenKudos) {
      sounds.playSuccess();
      setKudosCount((prev) => prev + 1);
      setHasGivenKudos(true);
    } else {
      sounds.playTap();
      setKudosCount((prev) => prev - 1);
      setHasGivenKudos(false);
    }
  };

  const currentRec = RECOMMENDATIONS[recIndex];

  // Auto-play slideshow every 6.5 seconds, paused on hover
  useEffect(() => {
    if (isPaused) return;

    autoPlayTimerRef.current = setInterval(() => {
      setRecIndex((prev) => (prev + 1) % RECOMMENDATIONS.length);
    }, 6500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPaused]);

  const handleNextRec = () => {
    sounds.playTap();
    setRecIndex((prev) => (prev + 1) % RECOMMENDATIONS.length);
  };

  const handlePrevRec = () => {
    sounds.playTap();
    setRecIndex((prev) => (prev - 1 + RECOMMENDATIONS.length) % RECOMMENDATIONS.length);
  };

  const handleSelectRec = (index: number) => {
    sounds.playTap();
    setRecIndex(index);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2 sm:px-0">
        <div>
          <h2
            className={`text-3xl sm:text-4xl font-bold tracking-tight ${
              isLightMode ? 'text-stone-900' : 'text-white'
            }`}
          >
            About me
          </h2>
          <p
            className={`mt-1.5 text-sm sm:text-base font-normal ${
              isLightMode ? 'text-stone-600' : 'text-white/70'
            }`}
          >
            Design Leader · Creative Technologist · System Architect
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenResumeModal();
            }}
            className="px-4 py-2.5 rounded-full bg-white/12 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span className="text-[14px] leading-[20px]">View resume</span>
          </button>
        </div>
      </div>

      {/* Editorial Narrative & Pillars Grid */}
      <div className="flex flex-col space-y-8 mb-10">
        {/* Narrative Biography */}
        <div className="space-y-4 max-w-4xl">
          <p
            className={`text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] ${
              isLightMode ? 'text-stone-700' : 'text-white/85'
            }`}
          >
            I believe great design lives at the precise convergence of <strong>rigorous visual craft</strong>, <strong>spatial ergonomics</strong>, and <strong>deep technical execution</strong>. Over the past decade, I have guided 0-to-1 product definitions and scaled design systems used by millions of daily users across spatial hardware, fintech, and creative operating systems.
          </p>

          <p
            className={`text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] ${
              isLightMode ? 'text-stone-600' : 'text-white/75'
            }`}
          >
            Rather than treating design and engineering as separate disciplines, I prototype in production code—authoring responsive React/TypeScript systems, GLSL spatial glass shaders, and physics-based spring curves. When designers write code, products retain their soul from conception to shipment.
          </p>
        </div>

        {/* Three Foundational Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div
            className={`p-5 rounded-[22px] border transition-all shadow-none ${
              isLightMode
                ? 'bg-stone-50/80 border-stone-200/80'
                : 'bg-[#111111] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-sky-400">
              <Code className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Engineered</span>
            </div>
            <p className={`text-[13px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-white/70'}`}>
              Production React, TypeScript & GLSL shaders for zero-friction handoff.
            </p>
          </div>

          <div
            className={`p-5 rounded-[22px] border transition-all shadow-none ${
              isLightMode
                ? 'bg-stone-50/80 border-stone-200/80'
                : 'bg-[#111111] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Spatial Math</span>
            </div>
            <p className={`text-[13px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-white/70'}`}>
              3 US patents filed in gaze gesture anchoring & concentric geometry.
            </p>
          </div>

          <div
            className={`p-5 rounded-[22px] border transition-all shadow-none ${
              isLightMode
                ? 'bg-stone-50/80 border-stone-200/80'
                : 'bg-[#111111] border-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Compass className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Leadership</span>
            </div>
            <p className={`text-[13px] leading-relaxed ${isLightMode ? 'text-stone-600' : 'text-white/70'}`}>
              Scaled systems adopted across 140+ teams; mentored 18+ designers.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Pictures: Infinite Scrolling Ribbon (Strictly zero background, pure images) */}
      <div
        className="mb-12 overflow-hidden -mx-2 sm:mx-0 relative"
        style={{ background: 'transparent' }}
      >
        <style>{`
          @keyframes infiniteScrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div
          className="flex items-center gap-4 sm:gap-6 w-max py-3 px-1 hover:[animation-play-state:paused]"
          style={{
            animation: 'infiniteScrollLeft 38s linear infinite',
            willChange: 'transform',
            background: 'transparent'
          }}
        >
          {MARQUEE_PHOTOS.map((photo, idx) => (
            <motion.div
              key={`${photo.id}-${idx}`}
              whileHover={{ scale: 1.05, y: -6, zIndex: 30 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              onClick={() => {
                sounds.playTap();
                setSelectedPhoto(photo.url);
              }}
              className={`shrink-0 cursor-pointer relative rounded-[22px] sm:rounded-[26px] overflow-hidden transition-transform duration-300 ${
                photo.tilt
              } hover:rotate-0`}
              style={{
                width: idx % 2 === 0 ? '240px' : '205px',
                height: '290px',
                background: 'transparent'
              }}
            >
              <img
                src={photo.url}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover select-none pointer-events-none rounded-[22px] sm:rounded-[26px]"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal (Strictly no text, just the picture) */}
      <AnimatePresence>
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative z-10 max-w-4xl max-h-[85vh] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt=""
                aria-hidden="true"
                className="w-auto h-auto max-h-[82vh] max-w-[90vw] object-contain select-none"
              />

              <button
                onClick={() => {
                  sounds.playTap();
                  setSelectedPhoto(null);
                }}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all duration-200 border border-white/20 backdrop-blur-md cursor-pointer active:scale-90"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Area: Recommendations + Custom Strava Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* RECOMMENDATIONS SLIDESHOW (Left Column, col-span-7) */}
        <div
          className={`lg:col-span-7 rounded-[30px] p-6 sm:p-8 border relative overflow-hidden transition-colors duration-300 flex flex-col justify-between min-h-[440px] sm:min-h-[410px] ${
            isLightMode
              ? 'bg-stone-50/90 border-stone-200/90 text-stone-900 shadow-sm'
              : 'bg-white/[0.03] border-white/15 text-white shadow-md'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slideshow Header & Navigation Controls */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold tracking-tight ${
                    isLightMode ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Recommendations
                </h3>
              </div>

              {/* Navigation Controls: Arrows and Index Indicator */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span
                  className={`text-xs font-mono mr-2 ${
                    isLightMode ? 'text-stone-500' : 'text-white/50'
                  }`}
                >
                  0{recIndex + 1} / 0{RECOMMENDATIONS.length}
                </span>

                <button
                  onClick={handlePrevRec}
                  aria-label="Previous recommendation"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    isLightMode
                      ? 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-stone-800'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextRec}
                  aria-label="Next recommendation"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    isLightMode
                      ? 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-stone-800'
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slideshow Recommendations: Stacked in single grid cell so container is always as tall as longest testimonial */}
            <div className="grid grid-cols-1 items-start relative z-10">
              {RECOMMENDATIONS.map((rec, idx) => {
                const isActive = idx === recIndex;
                return (
                  <div
                    key={rec.id}
                    aria-hidden={!isActive}
                    className={`col-start-1 row-start-1 space-y-4 transition-all duration-300 ease-out ${
                      isActive
                        ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                        : 'opacity-0 translate-y-2 pointer-events-none z-0'
                    }`}
                  >
                    {/* Full Testimonial Quote */}
                    <p
                      className={`text-sm sm:text-base md:text-[17px] leading-relaxed font-normal italic ${
                        isLightMode ? 'text-stone-800' : 'text-white/85'
                      }`}
                    >
                      &ldquo;{rec.quote}&rdquo;
                    </p>

                    {/* Recommender Metadata */}
                    <div className="pt-3 flex items-center gap-3.5">
                      {/* Avatar Initials Circle */}
                      <div
                        className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs tracking-wider shrink-0 ${
                          isLightMode
                            ? 'bg-stone-200 border-black/10 text-stone-700'
                            : 'bg-white/10 border-white/20 text-white'
                        }`}
                      >
                        {rec.avatarInitials}
                      </div>

                      <div>
                        <div
                          className={`text-sm font-bold ${
                            isLightMode ? 'text-stone-900' : 'text-white'
                          }`}
                        >
                          {rec.name}
                        </div>
                        <div
                          className={`text-[13px] ${
                            isLightMode ? 'text-stone-500' : 'text-white/60'
                          }`}
                        >
                          {rec.role} ·{' '}
                          <span
                            className={
                              isLightMode ? 'text-stone-700 font-medium' : 'text-white/80'
                            }
                          >
                            {rec.company}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
            {RECOMMENDATIONS.map((rec, idx) => {
              const isActive = idx === recIndex;
              return (
                <button
                  key={rec.id}
                  onClick={() => handleSelectRec(idx)}
                  aria-label={`Go to recommendation ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                    isActive
                      ? isLightMode
                        ? 'w-7 bg-stone-700'
                        : 'w-7 bg-stone-300'
                      : isLightMode
                        ? 'w-2 bg-stone-400/60 hover:bg-stone-500'
                        : 'w-2 bg-white/25 hover:bg-white/45'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* CUSTOM STRAVA ATHLETIC INTEGRATION (Right Column, col-span-5) */}
        <div
          className={`lg:col-span-5 rounded-[30px] p-6 sm:p-7 border relative overflow-hidden transition-colors duration-300 flex flex-col justify-between ${
            isLightMode
              ? 'bg-stone-50/90 border-stone-200/90 text-stone-900 shadow-sm'
              : 'bg-white/[0.03] border-white/15 text-white shadow-md'
          }`}
        >
          <div>
            {/* Header: Strava Logo, Athlete Handle & Direct Profile Link */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <a
                href={LATEST_STRAVA_ACTIVITY.athleteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FC4C02]/15 border border-[#FC4C02]/30 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                  <svg className="w-4 h-4 fill-[#FC4C02]" viewBox="0 0 24 24">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.925 15.626h4.171" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#FC4C02]">
                    Recent Activity
                  </div>
                  <div className={`text-[11px] font-mono group-hover:underline ${isLightMode ? 'text-stone-500' : 'text-white/50'}`}>
                    strava.com/athletes/{LATEST_STRAVA_ACTIVITY.athleteHandle}
                  </div>
                </div>
              </a>

              <a
                href={LATEST_STRAVA_ACTIVITY.athleteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="View Strava Profile"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                  isLightMode
                    ? 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-stone-800'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* GPS Vector Route Map Visualizer (Placed above Activity Title) */}
            <div className={`relative h-44 sm:h-48 rounded-2xl border p-2 mb-4 overflow-hidden flex items-center justify-center ${
              isLightMode
                ? 'bg-stone-200/50 border-black/5'
                : 'bg-black/40 border-white/10'
            }`}>
              <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#FC4C02_1px,transparent_1px)] [background-size:12px_12px]" />

              <svg viewBox="18 12 262 118" className="w-full h-full relative z-10 overflow-visible" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="stravaRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FC4C02" />
                    <stop offset="100%" stopColor="#FF8A3D" />
                  </linearGradient>
                </defs>
                {/* Glow route underlay */}
                <path
                  d={LATEST_STRAVA_ACTIVITY.path}
                  fill="none"
                  stroke="#FC4C02"
                  strokeWidth="6"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Main GPS Route path */}
                <path
                  d={LATEST_STRAVA_ACTIVITY.path}
                  fill="none"
                  stroke="url(#stravaRouteGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Start Pin */}
                <circle cx={30} cy={75} r="4" fill="#30D158" stroke="#fff" strokeWidth="1.5" />
                {/* Finish Pin */}
                <circle cx={50} cy={95} r="4.5" fill="#FC4C02" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Activity Title & Timestamp */}
            <div className="mb-2">
              <h4 className={`text-base sm:text-lg font-bold tracking-tight ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                {LATEST_STRAVA_ACTIVITY.title}
              </h4>
              <p className={`text-[13px] ${isLightMode ? 'text-stone-500' : 'text-white/50'} mt-1`}>
                {LATEST_STRAVA_ACTIVITY.date} · {LATEST_STRAVA_ACTIVITY.distance} · {LATEST_STRAVA_ACTIVITY.location}
              </p>
            </div>
          </div>

          {/* Footer: Give Kudos Button */}
          <div className="pt-2 flex items-center">
            <button
              onClick={handleGiveKudos}
              aria-label="Give Kudos"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer border ${
                hasGivenKudos
                  ? 'bg-[#FC4C02] text-white border-[#FC4C02] shadow-sm shadow-[#FC4C02]/40'
                  : isLightMode
                    ? 'bg-black/[0.04] hover:bg-black/[0.08] border-black/10 text-stone-700'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasGivenKudos ? 'fill-white stroke-white' : ''}`} />
              <span>{kudosCount} Kudos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
