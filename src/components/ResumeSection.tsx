import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Flame,
  Activity,
  Heart,
  Music,
  BookOpen
} from 'lucide-react';
import { RECOMMENDATIONS, STATUS_CARD_MEDIA } from '../data/portfolioData';
import { sounds } from '../utils/audio';

const LATEST_STRAVA_ACTIVITY = {
  title: 'Morning Mile',
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
    id: 'design-workshop',
    url: '/src/assets/images/alex_design_workshop_1790966343011.jpg',
    tilt: '-rotate-1'
  },
  {
    id: 'coastal-mist',
    url: '/src/assets/images/env_light_coast_1790741180007.jpg',
    tilt: 'rotate-2'
  }
];

const TRACK_PHOTOS = [
  ...PERSONAL_PHOTOS,
  ...PERSONAL_PHOTOS,
  ...PERSONAL_PHOTOS
];

interface ResumeSectionProps {
  onOpenResumeModal: () => void;
  isLightMode?: boolean;
  onPhotoModalChange?: (isOpen: boolean) => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({
  onOpenResumeModal,
  isLightMode = false,
  onPhotoModalChange
}) => {
  // Lightbox State for Personal Photos
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    onPhotoModalChange?.(Boolean(selectedPhoto));
  }, [selectedPhoto, onPhotoModalChange]);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  // Recommendations Slideshow State
  const [recIndex, setRecIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 px-2 sm:px-0">
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
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => {
              sounds.playTap();
              onOpenResumeModal();
            }}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 flex items-center gap-2 cursor-pointer border self-start ${
              isLightMode
                ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs backdrop-blur-md'
                : 'bg-white/12 hover:bg-white/20 text-white border-white/15'
            }`}
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
      </div>

      {/* Personal Pictures: Infinite Scrolling Ribbon (Strictly zero background, pure images) */}
      <div
        className="mb-12 overflow-hidden -mx-2 sm:mx-0 relative select-none"
        style={{ background: 'transparent' }}
      >
        <style>{`
          @keyframes infiniteScrollLeft {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
        `}</style>
        <div
          className="flex items-center w-max py-3 px-1 hover:[animation-play-state:paused]"
          style={{
            animation: 'infiniteScrollLeft 60s linear infinite',
            willChange: 'transform',
            background: 'transparent'
          }}
        >
          {/* Primary Track */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6">
            {TRACK_PHOTOS.map((photo, idx) => (
              <motion.div
                key={`track1-${photo.id}-${idx}`}
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

          {/* Secondary Track (Identical clone for seamless continuous looping) */}
          <div className="flex shrink-0 items-center gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
            {TRACK_PHOTOS.map((photo, idx) => (
              <motion.div
                key={`track2-${photo.id}-${idx}`}
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
              className={`fixed inset-0 backdrop-blur-xl transition-all ${
                isLightMode ? 'bg-black/50' : 'bg-black/80'
              }`}
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
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md cursor-pointer active:scale-90 border ${
                  isLightMode
                    ? 'bg-white/45 hover:bg-white/65 text-stone-900 border-white/50 shadow-xs'
                    : 'bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border-white/20'
                }`}
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
          className={`lg:col-span-7 rounded-[30px] p-6 sm:p-8 border relative overflow-hidden transition-colors duration-300 flex flex-col justify-between min-h-[460px] lg:h-[460px] ${
            isLightMode
              ? 'bg-white/55 border-black/10 text-stone-900 shadow-sm'
              : 'bg-white/[0.03] border-white/15 text-white shadow-md'
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slideshow Header & Navigation Controls */}
          <div>
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 relative z-10">
              <div className="min-w-0">
                <h3
                  className={`text-lg sm:text-xl font-bold tracking-tight truncate ${
                    isLightMode ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Recommendations
                </h3>
              </div>

              {/* Navigation Controls: Arrows and Index Indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span
                  className={`hidden sm:inline text-xs font-mono mr-2 ${
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
                      ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                      : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextRec}
                  aria-label="Next recommendation"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    isLightMode
                      ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                      : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
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
                      className={`text-sm sm:text-base md:text-[17px] leading-relaxed font-normal italic whitespace-pre-line ${
                        isLightMode ? 'text-stone-800' : 'text-white/85'
                      }`}
                    >
                      &ldquo;{rec.quote}&rdquo;
                      {rec.readMoreUrl && (
                        <span className="inline-block ml-1.5 font-normal italic">
                          <a
                            href={rec.readMoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 font-normal italic text-[#0071e3] hover:underline hover:text-[#0077ed] transition-colors cursor-pointer"
                          >
                            <span className="italic">Read more</span>
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block shrink-0 not-italic" />
                          </a>
                        </span>
                      )}
                    </p>

                    {/* Recommender Metadata */}
                    <div className="pt-3 flex items-center gap-3.5">
                      {/* Avatar Headshot Image */}
                      <div
                        className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 ${
                          isLightMode
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {rec.avatarUrl ? (
                          <img
                            src={rec.avatarUrl}
                            alt={`${rec.name} headshot`}
                            className="w-full h-full object-cover select-none"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="font-bold text-xs tracking-wider">
                            {rec.avatarInitials}
                          </span>
                        )}
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
                          className={`text-sm ${
                            isLightMode ? 'text-stone-500' : 'text-white/60'
                          }`}
                        >
                          {rec.role}
                          {rec.company && (
                            <>
                              {' '}·{' '}
                              <span
                                className={
                                  isLightMode ? 'text-stone-700 font-medium' : 'text-white/80'
                                }
                              >
                                {rec.company}
                              </span>
                            </>
                          )}
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

        {/* RIGHT COLUMN: 3 Stacked Status Cards (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between h-full lg:h-[460px]">
          {/* 1. STRAVA CARD (Simplified with Right Map) */}
          <a
            href="https://www.strava.com/athletes/almcd"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playTap()}
            className={`rounded-[28px] sm:rounded-[32px] p-5 border transition-all duration-300 flex flex-row items-stretch justify-between gap-4 cursor-pointer no-underline text-inherit ${
              isLightMode
                ? 'bg-white/55 border-black/10 text-stone-900 shadow-sm'
                : 'bg-white/[0.03] border-white/15 text-white shadow-md'
            }`}
          >
            <div className="min-w-0 flex-1 self-stretch flex flex-col justify-between pl-0 ml-[5px] mt-[3px] mb-0 h-[90px]">
              <div className="flex items-center gap-2 h-5 mb-1.5">
                <svg className="w-4 h-4 fill-[#FC4C02] shrink-0" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.925 15.626h4.171" />
                </svg>
                <span className="text-[13px] font-bold uppercase tracking-wider text-[#FC4C02]">
                  RECENT ACTIVITY
                </span>
              </div>

              <div className="mt-auto">
                <h4 className={`text-lg font-bold tracking-tight leading-snug ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                  {LATEST_STRAVA_ACTIVITY.title}
                </h4>
                <div className="flex items-center gap-4 sm:gap-6 mt-[7px] h-[30px] leading-6">
                  <div>
                    <div className={`text-[10px] leading-[12px] font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-stone-400' : 'text-white/45'}`}>
                      Distance
                    </div>
                    <div className={`text-sm font-normal leading-none ${isLightMode ? 'text-stone-500' : 'text-white/60'}`}>
                      1.46mi
                    </div>
                  </div>
                  <div>
                    <div className={`text-[10px] leading-[12px] font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-stone-400' : 'text-white/45'}`}>
                      Pace
                    </div>
                    <div className={`text-sm font-normal leading-none ${isLightMode ? 'text-stone-500' : 'text-white/60'}`}>
                      7:59/mi
                    </div>
                  </div>
                  <div>
                    <div className={`text-[10px] leading-[12px] font-medium uppercase tracking-wider mb-1 ${isLightMode ? 'text-stone-400' : 'text-white/45'}`}>
                      Time
                    </div>
                    <div className={`text-sm font-normal leading-none ${isLightMode ? 'text-stone-500' : 'text-white/60'}`}>
                      11m 41s
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Strava Map Square (Uploadable Image) */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 relative flex items-center justify-center ${
                isLightMode ? 'bg-stone-100' : 'bg-stone-900'
              }`}
              title="Strava Map Preview"
            >
              <img
                src={STATUS_CARD_MEDIA.stravaMap}
                alt="Strava Activity Route Map"
                className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </a>

          {/* 2. CURRENT LISTENING CARD */}
          <a
            href="https://open.spotify.com/track/5yUAQrjLRFDW4yqZI9L5v6"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playTap()}
            className={`rounded-[24px] sm:rounded-[28px] p-3.5 sm:px-5 h-[138px] min-h-[138px] border transition-all duration-300 flex flex-row items-center justify-between gap-4 cursor-pointer no-underline text-inherit ${
              isLightMode
                ? 'bg-white/55 border-black/10 text-stone-900 shadow-sm'
                : 'bg-white/[0.03] border-white/15 text-white shadow-md'
            }`}
          >
            <div className="min-w-0 flex-1 self-center h-[90px] flex flex-col justify-between ml-[5px] mt-[3px]">
              <div className="flex items-center gap-2 h-5">
                <Music className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[13px] font-bold uppercase tracking-wider text-emerald-500 leading-none">
                  CURRENT LISTENING
                </span>
              </div>

              <div className="mt-auto">
                <h4 className={`text-base sm:text-lg font-bold tracking-tight leading-snug ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                  Blessed
                </h4>
                <p className={`text-[14px] leading-[20px] font-normal ${isLightMode ? 'text-stone-500' : 'text-white/60'} mt-[5px]`}>
                  August Charles
                </p>
              </div>
            </div>

            {/* Right Side: Album Cover Square (Uploadable Image) */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 self-center relative ${
                isLightMode ? 'bg-stone-100' : 'bg-stone-900'
              }`}
              title="Blessed by August Charles"
            >
              <img
                src={STATUS_CARD_MEDIA.albumCover}
                alt="August Charles - Blessed Album Cover"
                className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </a>

          {/* 3. CURRENT READING CARD */}
          <a
            href="https://www.goodreads.com/en/book/show/13436116-lean-ux"
            target="_blank"
            rel="noreferrer"
            onClick={() => sounds.playTap()}
            className={`rounded-[24px] sm:rounded-[28px] p-3.5 sm:px-5 h-[138px] min-h-[138px] border transition-all duration-300 flex flex-row items-center justify-between gap-4 cursor-pointer no-underline text-inherit ${
              isLightMode
                ? 'bg-white/55 border-black/10 text-stone-900 shadow-sm'
                : 'bg-white/[0.03] border-white/15 text-white shadow-md'
            }`}
          >
            <div className="min-w-0 flex-1 self-center h-[90px] flex flex-col justify-between ml-[5px] mt-[3px]">
              <div className="flex items-center gap-2 h-5">
                <BookOpen className={`w-4 h-4 shrink-0 ${isLightMode ? 'text-indigo-600' : 'text-indigo-400'}`} />
                <span className={`text-[13px] font-bold uppercase tracking-wider leading-none ${isLightMode ? 'text-indigo-600' : 'text-indigo-400'}`}>
                  CURRENT READING
                </span>
              </div>

              <div className="mt-auto">
                <h4 className={`text-base sm:text-lg font-bold tracking-tight leading-snug ${isLightMode ? 'text-stone-900' : 'text-white'}`}>
                  Lean UX
                </h4>
                <p className={`text-[14px] leading-[20px] font-normal ${isLightMode ? 'text-stone-500' : 'text-white/60'} mt-[5px]`}>
                  Jeff Gothelf & Josh Seiden
                </p>
              </div>
            </div>

            {/* Right Side: Book Cover Square (Uploadable Image) */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 self-center relative ${
                isLightMode ? 'bg-stone-100' : 'bg-stone-900'
              }`}
              title="Lean UX by Jeff Gothelf & Josh Seiden"
            >
              <img
                src={STATUS_CARD_MEDIA.bookCover}
                alt="Lean UX Book Cover"
                className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
