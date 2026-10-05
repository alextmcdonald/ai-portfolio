import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  FileText,
  Send,
  ChevronUp,
  Check
} from 'lucide-react';
import { DARK_ENVIRONMENTS, LIGHT_ENVIRONMENTS } from './Environment';
import { sounds } from '../utils/audio';

interface OrnamentProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isLightMode: boolean;
  onToggleLightMode: () => void;
  onOpenResumeModal: () => void;
  onOpenContactModal: () => void;
  onSelectEnvironment: (envId: string) => void;
  currentEnvId: string;
  isHidden?: boolean;
}

export const Ornament: React.FC<OrnamentProps> = ({
  soundEnabled,
  onToggleSound,
  isLightMode,
  onToggleLightMode,
  onOpenResumeModal,
  onOpenContactModal,
  onSelectEnvironment,
  currentEnvId,
  isHidden = false
}) => {
  const [isEnvTrayOpen, setIsEnvTrayOpen] = useState(false);
  const [isPlayingAudioAnim, setIsPlayingAudioAnim] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  const availableEnvironments = isLightMode ? LIGHT_ENVIRONMENTS : DARK_ENVIRONMENTS;
  const activeEnv = availableEnvironments.find(e => e.id === currentEnvId) || availableEnvironments[0];

  // Close tray if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setIsEnvTrayOpen(false);
      }
    };
    if (isEnvTrayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEnvTrayOpen]);

  const triggerSoundFeedback = () => {
    setIsPlayingAudioAnim(true);
    setTimeout(() => setIsPlayingAudioAnim(false), 350);
  };

  return (
    <div
      className={`fixed bottom-6 inset-x-0 z-40 flex flex-col items-center select-none px-3 pointer-events-none transition-all duration-300 ${
        isHidden ? 'opacity-0 pointer-events-none translate-y-12' : 'opacity-100'
      }`}
      ref={trayRef}
    >
      {/* EXPANDABLE ENVIRONMENT SELECTOR POPOVER TRAY */}
      <AnimatePresence>
        {isEnvTrayOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: -10, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className={`pointer-events-auto mb-2 w-[94vw] max-w-md rounded-[28px] p-3.5 shadow-2xl border backdrop-blur-3xl z-40 ${
              isLightMode
                ? 'bg-white/92 border-black/10 text-stone-900 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.18)]'
                : 'bg-stone-950/90 border-white/20 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]'
            }`}
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)'
            }}
          >
            <div className="flex items-center justify-between px-3 py-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold tracking-tight">
                  {isLightMode ? 'Choose Light Environment' : 'Choose Dark Environment'}
                </span>
              </div>
              <span className={`text-[10px] font-mono ${isLightMode ? 'text-stone-500' : 'text-white/50'}`}>
                {isLightMode ? 'Daylight (4)' : 'Nocturne (4)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableEnvironments.map((env) => {
                const isSelected = env.id === activeEnv.id;
                return (
                  <button
                    key={env.id}
                    onClick={() => {
                      sounds.playToggle();
                      triggerSoundFeedback();
                      onSelectEnvironment(env.id);
                      setIsEnvTrayOpen(false);
                    }}
                    className={`relative flex items-center gap-2.5 p-2 rounded-2xl transition-all duration-200 text-left border ${
                      isSelected
                        ? isLightMode
                          ? 'bg-black/10 border-black/25 shadow-sm'
                          : 'bg-white/20 border-white/40 shadow-sm'
                        : isLightMode
                          ? 'bg-black/[0.03] hover:bg-black/[0.07] border-black/5'
                          : 'bg-white/[0.05] hover:bg-white/[0.12] border-white/10'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-xs relative">
                      <img
                        src={env.url}
                        alt={env.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="text-xs font-bold truncate">
                        {env.name}
                      </div>
                      <div className={`text-[10px] truncate ${isLightMode ? 'text-stone-600' : 'text-white/60'}`}>
                        {env.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE SPATIAL FLOATING DOCK (ALWAYS STATIC AT VIEWPORT BOTTOM) */}
      <div
        className={`pointer-events-auto rounded-full h-14 px-3 flex items-center gap-1.5 shadow-2xl border transition-all duration-300 max-w-fit ${
          isLightMode
            ? 'bg-white/90 border-black/10 text-stone-900 shadow-[0_20px_48px_-10px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.95)]'
            : 'bg-stone-900/75 border-white/20 text-white shadow-[0_24px_50px_-10px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.35)]'
        }`}
        style={{
          backdropFilter: 'blur(36px) saturate(180%)',
          WebkitBackdropFilter: 'blur(36px) saturate(180%)'
        }}
      >
        {/* ACTION 1: RESUME */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerSoundFeedback();
            onOpenResumeModal();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
            isLightMode
              ? 'bg-black/[0.06] hover:bg-black/[0.12] text-stone-800 hover:text-black'
              : 'bg-white/12 hover:bg-white/24 text-white/90 hover:text-white'
          }`}
          title="Open formatted resume"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2]" />
          <span className="hidden sm:inline">Resume</span>
        </button>

        {/* ACTION 2: CONTACT */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerSoundFeedback();
            onOpenContactModal();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
            isLightMode
              ? 'bg-black/[0.06] hover:bg-black/[0.12] text-stone-800 hover:text-black'
              : 'bg-white/12 hover:bg-white/24 text-white/90 hover:text-white'
          }`}
          title="Send a quick note"
        >
          <Send className="w-3.5 h-3.5 stroke-[2]" />
          <span className="hidden sm:inline">Contact</span>
        </button>

        {/* VERTICAL DIVIDER */}
        <div className={`w-[1px] h-6 mx-0.5 ${isLightMode ? 'bg-black/10' : 'bg-white/15'}`} />

        {/* ENVIRONMENT SELECTOR CAPSULE */}
        <button
          onClick={() => {
            sounds.playTap();
            triggerSoundFeedback();
            setIsEnvTrayOpen(!isEnvTrayOpen);
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
            isEnvTrayOpen
              ? isLightMode
                ? 'bg-black/15 text-black'
                : 'bg-white/30 text-white'
              : isLightMode
                ? 'bg-black/[0.05] hover:bg-black/[0.1] text-stone-800 hover:text-black'
                : 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white'
          }`}
          title={`Ambient Room: ${activeEnv.name}`}
        >
          <div className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/30">
            <img
              src={activeEnv.url}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="hidden md:inline text-xs font-medium">
            {activeEnv.name}
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isEnvTrayOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* VERTICAL DIVIDER */}
        <div className={`w-[1px] h-6 mx-0.5 ${isLightMode ? 'bg-black/10' : 'bg-white/15'}`} />

        {/* DARK MODE / LIGHT MODE SEGMENTED TOGGLE */}
        <div
          className={`flex items-center p-0.5 rounded-full border ${
            isLightMode
              ? 'bg-black/[0.05] border-black/10'
              : 'bg-black/30 border-white/15'
          }`}
        >
          {/* Light Mode Pill */}
          <button
            onClick={() => {
              if (!isLightMode) {
                onToggleLightMode();
                triggerSoundFeedback();
              }
            }}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
              isLightMode
                ? 'bg-white text-amber-500 shadow-sm'
                : 'text-white/50 hover:text-white/80'
            }`}
            title="Switch to Apple Light Glass Mode"
            aria-label="Light mode"
          >
            <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>

          {/* Dark Mode Pill */}
          <button
            onClick={() => {
              if (isLightMode) {
                onToggleLightMode();
                triggerSoundFeedback();
              }
            }}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
              !isLightMode
                ? 'bg-white/25 text-sky-200 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Switch to Apple Dark Glass Mode"
            aria-label="Dark mode"
          >
            <Moon className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>

        {/* AUDIO HAPTICS WITH DYNAMIC SOUNDWAVE */}
        <button
          onClick={() => {
            onToggleSound();
            triggerSoundFeedback();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 ${
            soundEnabled
              ? isLightMode
                ? 'text-stone-800 hover:bg-black/10'
                : 'text-white/90 hover:bg-white/15'
              : isLightMode
                ? 'text-stone-400 hover:bg-black/5'
                : 'text-white/40 hover:bg-white/10'
          }`}
          title={soundEnabled ? "Audio Haptics: Enabled" : "Audio Haptics: Muted"}
          aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 stroke-[2]" />
              {/* Dynamic sound equalizer bars */}
              <div className="flex items-center gap-0.5 h-3">
                <span
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    isLightMode ? 'bg-stone-800' : 'bg-white'
                  } ${isPlayingAudioAnim ? 'h-3' : 'h-1.5'}`}
                />
                <span
                  className={`w-0.5 rounded-full transition-all duration-150 delay-75 ${
                    isLightMode ? 'bg-stone-800' : 'bg-white'
                  } ${isPlayingAudioAnim ? 'h-2.5' : 'h-2'}`}
                />
                <span
                  className={`w-0.5 rounded-full transition-all duration-150 delay-150 ${
                    isLightMode ? 'bg-stone-800' : 'bg-white'
                  } ${isPlayingAudioAnim ? 'h-3.5' : 'h-1'}`}
                />
              </div>
            </>
          ) : (
            <VolumeX className="w-4 h-4 stroke-[2]" />
          )}
        </button>
      </div>
    </div>
  );
};
