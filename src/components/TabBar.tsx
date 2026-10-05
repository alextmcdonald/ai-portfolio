import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Layers, Sliders, FileText, Send } from 'lucide-react';
import { ActiveSection } from '../types';
import { sounds } from '../utils/audio';

interface TabBarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  isLightMode?: boolean;
  isHidden?: boolean;
}

interface TabItem {
  id: ActiveSection;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: Compass },
  { id: 'work', label: 'Case Studies', icon: Layers },
  { id: 'interactive', label: 'AI Experiments', icon: Sliders },
  { id: 'resume', label: 'About & Bio', icon: FileText },
  { id: 'contact', label: 'Get in Touch', icon: Send }
];

export const TabBar: React.FC<TabBarProps> = ({
  activeSection,
  onSelectSection,
  isLightMode = false,
  isHidden = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleTabClick = (id: ActiveSection) => {
    sounds.playTap();
    onSelectSection(id);
  };

  return (
    <>
      {/* Desktop Vertical Tab Bar (Left floating pill) */}
      <nav
        aria-label="Spatial navigation"
        className={`hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-40 select-none transition-all duration-300 ${
          isHidden ? 'opacity-0 pointer-events-none -translate-x-12' : 'opacity-100'
        }`}
        onMouseEnter={() => {
          sounds.playToggle();
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          animate={{
            width: isHovered ? 218 : 64,
            borderRadius: isHovered ? 28 : 32
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className={`relative rounded-[32px] p-2 flex flex-col gap-1.5 shadow-2xl border-[1.5px] overflow-hidden transition-colors duration-300 ${
            isLightMode
              ? 'bg-white/90 border-black/10 shadow-[0_20px_48px_-10px_rgba(0,0,0,0.14)]'
              : 'glass-thick border-white/15'
          }`}
          style={{
            borderWidth: '1.5px',
            backdropFilter: 'blur(36px) saturate(180%)',
            WebkitBackdropFilter: 'blur(36px) saturate(180%)'
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSection === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{ borderRadius: '100px' }}
                className={`relative w-full h-11 px-2.5 rounded-[100px] flex items-center justify-start group text-left cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? isLightMode
                      ? 'text-stone-900 font-semibold'
                      : 'text-white font-semibold'
                    : isLightMode
                      ? 'text-stone-600 hover:text-stone-950 hover:bg-black/5'
                      : 'text-white/70 hover:text-white hover:bg-white/12'
                }`}
                aria-current={isSelected ? 'page' : undefined}
                title={tab.label}
              >
                {/* Active Indicator Sliding Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 rounded-[100px] pointer-events-none ${
                      isLightMode
                        ? 'bg-black/10 shadow-xs'
                        : 'bg-white/25 shadow-sm'
                    }`}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Fixed Icon container - 24x24 anchored with mathematical precision */}
                <div className="relative z-10 w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 stroke-[2] transition-transform duration-200 group-hover:scale-110" />
                </div>

                {/* Expanding Label */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.14 }}
                      className={`relative z-10 ml-3 text-sm font-semibold whitespace-nowrap overflow-hidden ${
                        isLightMode ? 'text-stone-900' : 'text-white'
                      }`}
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
};
