import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  MoreHorizontal,
  Send,
  Mail,
  Check,
  Copy,
  ArrowUpRight
} from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';

interface ProfileHeaderProps {
  onOpenContact: () => void;
  onCopyEmail: () => void;
  emailCopied: boolean;
  isLightMode: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onOpenContact,
  onCopyEmail,
  emailCopied,
  isLightMode
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [avatarRotation, setAvatarRotation] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [floatingCounters, setFloatingCounters] = useState<Array<{ id: number; count: number }>>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAvatarMouseEnter = () => {
    setIsAvatarHovered(true);
  };

  const handleAvatarMouseLeave = () => {
    setIsAvatarHovered(false);
  };

  const handleAvatarClick = () => {
    sounds.playAvatarClick();
    setAvatarRotation((prev) => prev + 360);

    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    const newId = Date.now() + Math.random();
    setFloatingCounters((prev) => [...prev, { id: newId, count: nextCount }]);

    // Easter egg every 100 clicks: shoot confetti and play triumphant crystal milestone chime
    if (nextCount > 0 && nextCount % 100 === 0) {
      // Confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.35 },
          colors: ['#0071e3', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7', '#34d399']
        });
        setTimeout(() => {
          confetti({
            particleCount: 70,
            angle: 60,
            spread: 65,
            origin: { x: 0.15, y: 0.45 },
            colors: ['#0071e3', '#34d399', '#f59e0b', '#ec4899', '#a855f7']
          });
          confetti({
            particleCount: 70,
            angle: 120,
            spread: 65,
            origin: { x: 0.85, y: 0.45 },
            colors: ['#0071e3', '#34d399', '#f59e0b', '#ec4899', '#a855f7']
          });
        }, 220);
      } catch {
        // guarded
      }

      // Celebratory ascending crystal arpeggio sound
      sounds.playMilestone();
    }
  };

  // Close menu on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="grid grid-cols-[auto_1fr] sm:flex sm:flex-row sm:items-center sm:justify-between gap-x-4 gap-y-3.5 sm:gap-6 px-2 sm:px-0">
      {/* Avatar with concentric glass rim & interactive states */}
      <div
        className="col-start-1 row-start-1 sm:order-1 sm:shrink-0 relative cursor-pointer select-none"
        onMouseEnter={handleAvatarMouseEnter}
        onMouseLeave={handleAvatarMouseLeave}
        onClick={handleAvatarClick}
        title={`Alex McDonald — ${DESIGNER_INFO.status}`}
      >
          {/* Ambient Electric Sky/Cobalt Glow Bloom on Hover */}
          <motion.div
            animate={{
              scale: isAvatarHovered ? 1.18 : 0.92,
              opacity: isAvatarHovered ? (isLightMode ? 0.35 : 0.55) : 0
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute -inset-2 rounded-full bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 blur-xl pointer-events-none"
          />

          {/* Avatar Capsule Container */}
          <motion.div
            animate={{ rotate: avatarRotation }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1.5 shadow-none transition-transform duration-300 ease-out"
          >
            {/* Outer Specular Chromatic Rim - Continuously clockwise circling border */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none avatar-circling-border transition-opacity duration-300"
              style={{
                padding: '1.5px',
                opacity: isAvatarHovered ? 1 : 0.75,
                background: isAvatarHovered
                  ? (isLightMode
                      ? 'linear-gradient(135deg, #38bdf8, #a8a29e, #818cf8)'
                      : 'linear-gradient(135deg, #38bdf8, rgba(255,255,255,0.85), #818cf8)')
                  : (isLightMode
                      ? 'conic-gradient(from 0deg, rgba(0,0,0,0.26) 0deg, rgba(0,0,0,0.10) 60deg, rgba(0,0,0,0.03) 120deg, transparent 180deg, transparent 300deg, rgba(0,0,0,0.26) 360deg)'
                      : 'conic-gradient(from 0deg, rgba(255,255,255,0.38) 0deg, rgba(255,255,255,0.15) 60deg, rgba(255,255,255,0.04) 120deg, transparent 180deg, transparent 300deg, rgba(255,255,255,0.38) 360deg)'),
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />

            {/* Avatar Photo Frame */}
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img
                src={DESIGNER_INFO.avatarUrl}
                alt={DESIGNER_INFO.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full transition-transform duration-500 will-change-transform"
                style={{
                  transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              />

              {/* Top-down Specular Horizon Arc */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none rounded-t-full" />
            </div>

            {/* Status Indicator: positioned bottom-right, half on half off the image */}
            <div className="absolute bottom-1.5 right-1.5 z-20 pointer-events-none">
              <div
                className={`w-[22px] h-[22px] rounded-full flex items-center justify-center border transition-transform duration-200 ${
                  isLightMode
                    ? 'bg-white border-white/90'
                    : 'bg-stone-900 border-stone-800'
                }`}
                title={`Active — ${DESIGNER_INFO.status}`}
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
                    }`}
                    style={{ animationDuration: '2.4s' }}
                  />
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
                  }`} />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating click counter: +1, +2, +3... (or "Oh yeah! 🎉" at every 100) to top-right that floats up and fades out */}
          <div className="absolute top-0 right-0 pointer-events-none z-30">
            <AnimatePresence>
              {floatingCounters.map((item) => {
                const isMilestone = item.count > 0 && item.count % 100 === 0;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6, scale: 0.6 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [6, -16, -28, -42],
                      scale: isMilestone ? [0.6, 1.2, 1.1, 0.9] : [0.6, 1.12, 1, 0.85]
                    }}
                    transition={{
                      duration: isMilestone ? 1.3 : 1.0,
                      times: [0, 0.18, 0.65, 1],
                      ease: 'easeOut'
                    }}
                    onAnimationComplete={() => {
                      setFloatingCounters((prev) => prev.filter((c) => c.id !== item.id));
                    }}
                    className={`absolute right-0 top-0 whitespace-nowrap font-mono font-bold text-[11px] sm:text-xs px-2 py-0.5 rounded-full shadow-lg border select-none force-white keep-white ${
                      isMilestone
                        ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white border-amber-300/70 shadow-[0_4px_16px_rgba(245,158,11,0.6)]'
                        : isLightMode
                          ? 'bg-[#0071e3] text-white border-white/40 shadow-[0_4px_12px_rgba(0,113,227,0.35)]'
                          : 'bg-[#0071e3] text-white border-white/30 shadow-[0_4px_14px_rgba(0,113,227,0.5)]'
                    }`}
                    style={{ color: '#ffffff' }}
                  >
                    <span className="force-white keep-white" style={{ color: '#ffffff' }}>
                      {isMilestone ? 'Oh yeah! 🎉' : `+${item.count}`}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      {/* Profile Text Metadata: Below row 1 on mobile portrait, between avatar and ellipsis on mobile landscape & up */}
      <div className="col-span-2 row-start-2 sm:order-2 sm:flex-1 sm:min-w-0">
        <h1
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isLightMode ? 'text-stone-900' : 'text-white'
          }`}
        >
          {DESIGNER_INFO.name}
        </h1>
        <p
          className={`text-sm sm:text-base font-medium mt-0.5 ${
            isLightMode ? 'text-stone-600' : 'text-white/75'
          }`}
        >
          {DESIGNER_INFO.title}{' '}
          <span className={isLightMode ? 'text-stone-400' : 'text-white/40'}>/</span>{' '}
          {DESIGNER_INFO.roleSubtext}
        </p>
        <div
          className={`flex items-center gap-2 text-xs font-medium mt-2 flex-wrap ${
            isLightMode ? 'text-stone-500' : 'text-white/70'
          }`}
        >
          <span className="hidden sm:inline-flex text-[13px] items-center gap-1">
            <span>📍</span>
            <span>{DESIGNER_INFO.location}</span>
          </span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span
            className={`font-mono font-bold ${
              isLightMode ? 'text-[#009966]' : 'text-emerald-400'
            }`}
          >
            {DESIGNER_INFO.status}
          </span>
        </div>
      </div>

      {/* Interactive Ellipsis Action Menu:
          - Mobile Portrait: row 1, col 2 (to the right of profile picture and above text)
          - Mobile Landscape & up (sm:): order-3, pushed to the right of all other elements
      */}
      <div
        className={`col-start-2 row-start-1 justify-self-end sm:order-3 sm:shrink-0 sm:ml-auto relative self-center sm:self-auto ${
          isMenuOpen ? 'z-50' : 'z-20'
        }`}
        ref={menuRef}
      >
        <button
          onClick={() => {
            sounds.playTap();
            setIsMenuOpen(!isMenuOpen);
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 border cursor-pointer ${
            isMenuOpen
              ? isLightMode
                ? 'bg-stone-200 text-stone-950 border-black/15 shadow-xs'
                : 'bg-white/22 text-white border-white/25 shadow-xs backdrop-blur-md'
              : isLightMode
                ? 'bg-white/95 hover:bg-white active:bg-stone-200 text-stone-800 hover:text-stone-950 active:text-stone-950 border-black/10 shadow-xs backdrop-blur-md'
                : 'bg-white/12 hover:bg-white/20 active:bg-white/25 text-white border-white/15 backdrop-blur-md'
          }`}
          title="Contact & Email Options"
          aria-label="More contact options"
          aria-expanded={isMenuOpen}
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* VisionOS Floating Context Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className={`absolute right-0 top-12 z-50 w-72 sm:w-80 p-2.5 rounded-2xl border shadow-2xl backdrop-blur-2xl select-none space-y-2 ${
                isLightMode
                  ? 'bg-white/95 border-black/12 text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.16)]'
                  : 'bg-stone-900/90 border-white/20 text-white shadow-2xl'
              }`}
              style={{
                backdropFilter: 'blur(36px) saturate(180%)',
                WebkitBackdropFilter: 'blur(36px) saturate(180%)'
              }}
            >
              {/* Primary Blue CTA: Message Me */}
              <button
                onClick={() => {
                  sounds.playTap();
                  setIsMenuOpen(false);
                  onOpenContact();
                }}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white force-white active:scale-98 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-none"
                style={{ color: '#ffffff' }}
              >
                <Send className="w-3.5 h-3.5 force-white" style={{ color: '#ffffff' }} />
                <span className="force-white" style={{ color: '#ffffff' }}>Message me</span>
              </button>

              {/* Direct Email with Copy Action */}
              <div
                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
                  isLightMode
                    ? 'bg-white/50 border-black/10'
                    : 'bg-black/40 border-white/10'
                }`}
              >
                <span
                  className={`text-xs font-mono truncate ${
                    isLightMode ? 'text-stone-800' : 'text-white/90'
                  }`}
                >
                  {DESIGNER_INFO.email}
                </span>

                <button
                  onClick={() => {
                    sounds.playSuccess();
                    onCopyEmail();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer border ${
                    isLightMode
                      ? 'bg-white hover:bg-stone-50 text-stone-800 border-black/10 shadow-xs'
                      : 'bg-white/15 hover:bg-white/25 text-white border-white/15'
                  }`}
                >
                  {emailCopied ? (
                    <>
                      <Check
                        className={`w-3 h-3 stroke-[2.5] ${
                          isLightMode ? 'text-[#009966]' : 'text-emerald-400'
                        }`}
                      />
                      <span
                        className={
                          isLightMode ? 'text-[#009966]' : 'text-emerald-400'
                        }
                      >
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stacked Social Links (One line each) */}
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    name: 'Figma',
                    url: DESIGNER_INFO.socials.figma,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm0-8c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4zm8-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0zm0 8h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V8z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Dribbble',
                    url: DESIGNER_INFO.socials.dribbble,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.626 0 12-5.373 12-12C23.996 5.374 18.626 0 12 0zm9.73 10.02c-.37-.04-2.8-.29-5.6.86-.06-.15-.12-.3-.19-.46-.38-.87-.8-1.72-1.25-2.54 3.73-1.52 5.25-3.6 5.35-3.74 1.05 1.58 1.66 3.47 1.69 5.88zm-3.08-6.93c-.15.2-1.63 2.15-5.18 3.59-1.39-2.56-2.92-4.75-3.09-4.99 1.15-.43 2.38-.68 3.67-.68 1.76 0 3.39.46 4.6 1.4zm-10.42.31c.17.24 1.69 2.41 3.09 4.96-2.81 1.02-6.14 1.05-6.49 1.05-.03-.46-.05-.93-.05-1.4 0-2.09.76-4 2.03-5.49-.6.28-1.07.6-1.58.88zm-5.97 7.02c.32 0 3.32-.03 6.06-1 .34.78.65 1.57.94 2.37-4.14 2.32-6.73 5.9-6.86 6.09-.59-1.44-.94-3.03-.94-4.7 0-.96.12-1.89.34-2.76zm2.34 9.1c.17-.23 2.53-3.6 6.46-5.87.97 2.47 1.56 5.14 1.68 5.75-1.4.67-2.97 1.05-4.63 1.05-1.28 0-2.5-.26-3.51-.93zm9.84.18c-.14-.65-.7-3.15-1.63-5.52 2.6-.96 4.79-.37 5.06-.29-.46 2.35-1.74 4.38-3.43 5.81z" />
                      </svg>
                    )
                  },
                  {
                    name: 'Behance',
                    url: DESIGNER_INFO.socials.behance,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-4.976 3-3.413 0-5.882-2.314-5.882-6.027 0-3.69 2.493-6.073 5.767-6.073 3.447 0 5.485 2.428 5.485 5.83 0 .498-.073.984-.135 1.294h-8.083c.112 1.764 1.487 2.766 3.125 2.766 1.341 0 2.296-.583 2.779-1.554l1.919.764zm-5.074-4.524c-.06-1.343-1.026-2.185-2.28-2.185-1.373 0-2.378.966-2.527 2.185h4.807zM7.228 11.082h-3.48v-3.79h3.48c1.378 0 2.217.653 2.217 1.895 0 1.24-.839 1.895-2.217 1.895zm.352 6.096H3.748v-4.07h3.832c1.553 0 2.495.736 2.495 2.035 0 1.3-.942 2.035-2.495 2.035zM7.886 4.292H0V20h8.319c3.151 0 5.441-1.688 5.441-4.708 0-1.854-.997-3.197-2.593-3.868 1.23-.623 2.094-1.802 2.094-3.449 0-2.827-2.146-3.683-5.375-3.683z" />
                      </svg>
                    )
                  },
                  {
                    name: 'GitHub',
                    url: DESIGNER_INFO.socials.github,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    )
                  },
                  {
                    name: 'LinkedIn',
                    url: DESIGNER_INFO.socials.linkedin,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    )
                  },
                  {
                    name: 'X / Twitter',
                    url: DESIGNER_INFO.socials.twitter,
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )
                  }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      sounds.playTap();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group border ${
                      isLightMode
                        ? 'bg-white hover:bg-stone-100 border-black/10 text-stone-800 hover:text-stone-950 shadow-xs'
                        : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isLightMode ? 'text-stone-600 group-hover:text-stone-900' : 'text-white'} transition-colors shrink-0`}>
                        {social.icon}
                      </span>
                      <span className="truncate">{social.name}</span>
                    </div>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isLightMode ? 'text-stone-400 group-hover:text-stone-900' : 'text-white'} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0`} />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
