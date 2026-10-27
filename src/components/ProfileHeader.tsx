import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  MoreHorizontal,
  Send,
  Mail,
  Check,
  Copy,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';
import { SocialIcon } from './SocialIcons';

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
  const [isStatusHovered, setIsStatusHovered] = useState(false);
  const [isLocationHovered, setIsLocationHovered] = useState(false);
  const [isEnergyHovered, setIsEnergyHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [seattleTime, setSeattleTime] = useState<string>(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date());
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const updateTime = () => {
      try {
        setSeattleTime(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }).format(new Date())
        );
      } catch {
        // fallback
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Eagerly preload and decode both avatars so switching theme is instantaneous (0ms delay)
  useEffect(() => {
    const urls = [DESIGNER_INFO.avatarUrl, DESIGNER_INFO.avatarLightUrl].filter(Boolean) as string[];
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }, []);
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
              scale: isAvatarHovered ? 1.08 : 0.95,
              opacity: isAvatarHovered ? (isLightMode ? 0.16 : 0.24) : 0
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute -inset-1 rounded-full bg-gradient-to-tr from-sky-400/70 via-blue-500/60 to-indigo-400/70 blur-xl pointer-events-none"
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
              {/* Dark mode portrait */}
              <img
                src={DESIGNER_INFO.avatarUrl}
                alt={DESIGNER_INFO.name}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover rounded-full transition-opacity duration-300 will-change-transform absolute inset-0 ${
                  isLightMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
                style={{
                  transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              />

              {/* Light mode portrait (preloaded and present in DOM for instant 0ms switch) */}
              <img
                src={DESIGNER_INFO.avatarLightUrl || '/assets/images/alex_portrait_blue_1790739680820.jpg'}
                alt={DESIGNER_INFO.name}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover rounded-full transition-opacity duration-300 will-change-transform absolute inset-0 ${
                  isLightMode ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{
                  transform: isAvatarHovered ? 'scale(1.05)' : 'scale(1)'
                }}
              />

              {/* Top-down Specular Horizon Arc */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none rounded-t-full z-10" />
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
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-200/60 shadow-[0_4px_12px_rgba(245,158,11,0.4)]'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300/40 shadow-[0_4px_14px_rgba(245,158,11,0.5)]'
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
          className={`text-2xl sm:text-3xl font-bold tracking-tight inline-flex items-center gap-2.5 sm:gap-3 ${
            isLightMode ? 'text-stone-900' : 'text-white'
          }`}
        >
          <span>{DESIGNER_INFO.name}</span>

          {/* Interactive Pulsing Status Dot & Hover Tooltip */}
          <div
            className="relative inline-flex items-center justify-center cursor-pointer select-none group -ml-[2px]"
            onMouseEnter={() => setIsStatusHovered(true)}
            onMouseLeave={() => setIsStatusHovered(false)}
            onTouchStart={() => setIsStatusHovered(true)}
            onClick={(e) => {
              e.preventDefault();
            }}
            onFocus={() => setIsStatusHovered(true)}
            onBlur={() => setIsStatusHovered(false)}
            tabIndex={0}
            role="button"
            aria-label="Currently: Open to new opportunities"
          >
            {/* Tooltip floating above dot - styled to match tech stack icons */}
            <AnimatePresence>
              {isStatusHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.94 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center"
                >
                  <div
                    className="px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] border border-white/20 bg-stone-900/95 backdrop-blur-xl whitespace-nowrap text-center force-white keep-white"
                    style={{ color: '#ffffff' }}
                  >
                    <div
                      className="text-xs font-semibold leading-tight tracking-tight force-white keep-white"
                      style={{ color: '#ffffff' }}
                    >
                      Currently: Open to new opportunities
                    </div>
                  </div>
                  {/* Downward triangle caret */}
                  <div className="w-2 h-2 rotate-45 -mt-1 border-r border-b bg-stone-900/95 border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulsing Status Dot Container */}
            <div
              className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110 active:scale-95 shadow-none"
              style={{ boxShadow: 'none' }}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
                  }`}
                  style={{ animationDuration: '2.4s', boxShadow: 'none' }}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
                  }`}
                  style={{ boxShadow: 'none' }}
                />
              </span>
            </div>
          </div>

          {/* Interactive Location Pin & Hover Tooltip */}
          <div
            className="relative inline-flex items-center justify-center cursor-pointer select-none group -ml-[4px] sm:-ml-[5px]"
            onMouseEnter={() => setIsLocationHovered(true)}
            onMouseLeave={() => setIsLocationHovered(false)}
            onTouchStart={() => setIsLocationHovered(true)}
            onClick={(e) => {
              e.preventDefault();
            }}
            onFocus={() => setIsLocationHovered(true)}
            onBlur={() => setIsLocationHovered(false)}
            tabIndex={0}
            role="button"
            aria-label={`Based in ${DESIGNER_INFO.location}${seattleTime ? ` – Local time: ${seattleTime}` : ''}`}
          >
            {/* Tooltip floating above pin - styled to match tech stack icons and status dot */}
            <AnimatePresence>
              {isLocationHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.94 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center"
                >
                  <div
                    className="px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] border border-white/20 bg-stone-900/95 backdrop-blur-xl whitespace-nowrap text-center force-white keep-white"
                    style={{ color: '#ffffff' }}
                  >
                    <div
                      className="text-xs font-semibold leading-tight tracking-tight force-white keep-white"
                      style={{ color: '#ffffff' }}
                    >
                      Based in {DESIGNER_INFO.location}{seattleTime ? ` – Local time: ${seattleTime}` : ''}
                    </div>
                  </div>
                  {/* Downward triangle caret */}
                  <div className="w-2 h-2 rotate-45 -mt-1 border-r border-b bg-stone-900/95 border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pin Container */}
            <div
              className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] rounded-full flex items-center justify-center shadow-none"
              style={{ boxShadow: 'none' }}
            >
              <span className="text-sm sm:text-base leading-none select-none flex items-center justify-center">
                📍
              </span>
            </div>
          </div>

          {/* Interactive Lightning Bolt & Hover Tooltip */}
          <div
            className="relative inline-flex items-center justify-center cursor-pointer select-none group -ml-[4px] sm:-ml-[5px]"
            onMouseEnter={() => setIsEnergyHovered(true)}
            onMouseLeave={() => setIsEnergyHovered(false)}
            onTouchStart={() => setIsEnergyHovered(true)}
            onClick={(e) => {
              e.preventDefault();
            }}
            onFocus={() => setIsEnergyHovered(true)}
            onBlur={() => setIsEnergyHovered(false)}
            tabIndex={0}
            role="button"
            aria-label="Powered by coffee & curiosity"
          >
            {/* Tooltip floating above lightning bolt */}
            <AnimatePresence>
              {isEnergyHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.94 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center"
                >
                  <div
                    className="px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] border border-white/20 bg-stone-900/95 backdrop-blur-xl whitespace-nowrap text-center force-white keep-white"
                    style={{ color: '#ffffff' }}
                  >
                    <div
                      className="text-xs font-semibold leading-tight tracking-tight force-white keep-white"
                      style={{ color: '#ffffff' }}
                    >
                      Powered by coffee & curiosity
                    </div>
                  </div>
                  {/* Downward triangle caret */}
                  <div className="w-2 h-2 rotate-45 -mt-1 border-r border-b bg-stone-900/95 border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lightning Bolt Container */}
            <div
              className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] rounded-full flex items-center justify-center shadow-none"
              style={{ boxShadow: 'none' }}
            >
              <Zap
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Interactive Info Icon & Hover Tooltip */}
          <div
            className="relative inline-flex items-center justify-center cursor-pointer select-none -ml-[1px] sm:-ml-[2px]"
            onMouseEnter={() => setIsInfoHovered(true)}
            onMouseLeave={() => setIsInfoHovered(false)}
            onTouchStart={() => setIsInfoHovered(true)}
            onClick={(e) => {
              e.preventDefault();
            }}
            onFocus={() => setIsInfoHovered(true)}
            onBlur={() => setIsInfoHovered(false)}
            tabIndex={0}
            role="button"
            aria-label="This portfolio was designed, coded, and shipped by me (with the help of AI)"
          >
            {/* Tooltip floating above info icon */}
            <AnimatePresence>
              {isInfoHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.94 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-1/2 -translate-x-[60%] sm:-translate-x-1/2 [@media(orientation:landscape)_and_(max-height:550px)]:-translate-x-1/2 [@media(orientation:landscape)_and_(max-width:932px)_and_(max-height:600px)]:-translate-x-1/2 [@media(orientation:landscape)_and_(max-width:896px)]:-translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center"
                >
                  <div
                    className="px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] border border-white/20 bg-stone-900/95 backdrop-blur-xl text-center w-max max-w-[calc(100vw-32px)] sm:max-w-none force-white keep-white"
                    style={{ color: '#ffffff' }}
                  >
                    <div
                      className="text-xs font-semibold leading-tight tracking-tight force-white keep-white"
                      style={{ color: '#ffffff' }}
                    >
                      <span className="block sm:inline [@media(orientation:landscape)_and_(max-height:550px)]:block [@media(orientation:landscape)_and_(max-width:932px)_and_(max-height:600px)]:block [@media(orientation:landscape)_and_(max-width:896px)]:block whitespace-nowrap">
                        This portfolio was designed, coded,
                      </span>{' '}
                      <span className="block sm:inline [@media(orientation:landscape)_and_(max-height:550px)]:block [@media(orientation:landscape)_and_(max-width:932px)_and_(max-height:600px)]:block [@media(orientation:landscape)_and_(max-width:896px)]:block whitespace-nowrap">
                        and shipped by me (with the help of AI)
                      </span>
                    </div>
                  </div>
                  {/* Downward triangle caret */}
                  <div className="w-2 h-2 rotate-45 -mt-1 border-r border-b bg-stone-900/95 border-white/20 translate-x-[23px] sm:translate-x-0 [@media(orientation:landscape)_and_(max-height:550px)]:translate-x-0 [@media(orientation:landscape)_and_(max-width:932px)_and_(max-height:600px)]:translate-x-0 [@media(orientation:landscape)_and_(max-width:896px)]:translate-x-0" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Icon Container (static, 16px size) */}
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shadow-none"
              style={{ width: '16px', height: '16px', boxShadow: 'none' }}
            >
              <img
                src="/assets/aistudio/image_27796d7c.png"
                alt="Info"
                className={`w-[13px] h-[13px] object-contain select-none pointer-events-none ${
                  isLightMode ? 'opacity-70' : 'invert opacity-80'
                }`}
                draggable={false}
              />
            </div>
          </div>
        </h1>
        <p
          className={`text-base sm:text-xl font-normal leading-relaxed mt-0.5 mobile-landscape-text-18 [@media(orientation:landscape)_and_(max-height:550px)]:text-[18px] [@media(orientation:landscape)_and_(max-width:932px)_and_(max-height:600px)]:text-[18px] [@media(orientation:landscape)_and_(max-width:896px)]:text-[18px] ${
            isLightMode ? 'text-stone-600' : 'text-white/80'
          }`}
        >
          {DESIGNER_INFO.title}{' '}
          <span className={isLightMode ? 'text-stone-400' : 'text-white/40'}>|</span>{' '}
          {DESIGNER_INFO.roleSubtext}
        </p>
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
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 border cursor-pointer backdrop-blur-md ${
            isMenuOpen
              ? isLightMode
                ? 'bg-stone-900/15 text-stone-950 border-black/15 shadow-xs'
                : 'bg-black/35 hover:bg-black/45 active:bg-black/50 text-white border-white/20 shadow-xs'
              : isLightMode
                ? 'bg-white/70 hover:bg-white/85 active:bg-stone-200/80 text-stone-800 hover:text-stone-950 active:text-stone-950 border-black/10 shadow-xs'
                : 'bg-white/12 hover:bg-white/20 active:bg-black/35 text-white border-white/15'
          }`}
          title="Contact & Email Options"
          aria-label="More contact options"
          aria-expanded={isMenuOpen}
        >
          <MoreHorizontal className={`w-5 h-5 stroke-[2.2] ${isLightMode ? '' : 'text-white'}`} />
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
                  ? 'border-black/12 text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.14)]'
                  : 'border-white/20 text-white shadow-[0_24px_60px_rgba(0,0,0,0.6)]'
              }`}
              style={{
                backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.72)' : 'rgba(18, 20, 26, 0.70)',
                backdropFilter: 'blur(40px) saturate(190%)',
                WebkitBackdropFilter: 'blur(40px) saturate(190%)'
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
                    ? 'bg-[#eeeeee] border-black/10'
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
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer border border-transparent shadow-none ${
                    isLightMode
                      ? 'bg-[#d5d5d5] hover:bg-[#c8c8c8] text-black'
                      : 'bg-white/15 hover:bg-white/25 text-white'
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
                    name: 'LinkedIn',
                    url: DESIGNER_INFO.socials.linkedin,
                    iconUrl: '/assets/icons/linkedin.svg'
                  },
                  {
                    name: 'Dribbble',
                    url: DESIGNER_INFO.socials.dribbble,
                    iconUrl: '/assets/icons/dribbble.svg'
                  },
                  {
                    name: 'Behance',
                    url: DESIGNER_INFO.socials.behance,
                    iconUrl: '/assets/icons/behance.svg'
                  },
                  {
                    name: 'GitHub',
                    url: DESIGNER_INFO.socials.github,
                    iconUrl: '/assets/icons/github.svg'
                  },
                  {
                    name: 'X / Twitter',
                    url: DESIGNER_INFO.socials.twitter,
                    iconUrl: '/assets/icons/x.svg'
                  },
                  {
                    name: 'On Design',
                    url: DESIGNER_INFO.socials.ondesign,
                    iconUrl: '/assets/icons/on-design.svg'
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
                        : 'bg-white/20 hover:bg-white/30 border-white/20 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`${isLightMode ? 'text-stone-600 group-hover:text-stone-900' : 'text-white'} transition-colors shrink-0`}>
                        <SocialIcon name={social.name} className="w-3.5 h-3.5 fill-current shrink-0" />
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
