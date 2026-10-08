/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Environment, ENVIRONMENTS } from './components/Environment';
import { TabBar } from './components/TabBar';
import { Ornament } from './components/Ornament';
import { ProfileHeader } from './components/ProfileHeader';
import { HeroSection } from './components/HeroSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { InteractiveLab } from './components/InteractiveLab';
import { ResumeSection } from './components/ResumeSection';
import { ContactSection } from './components/ContactSection';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ResumeModal } from './components/ResumeModal';
import { ContactModal } from './components/ContactModal';
import { CaseStudy, ActiveSection } from './types';
import { DESIGNER_INFO } from './data/portfolioData';
import { sounds } from './utils/audio';
import { ArrowUp } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Environment and theme state with localStorage persistence
  const [currentDarkEnvId, setCurrentDarkEnvId] = useState<string>('cupertino-studio');
  const [currentLightEnvId, setCurrentLightEnvId] = useState<string>('coastal-pavilion');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('spatial_theme_mode');
      if (saved) return saved === 'light';
      return document.documentElement.classList.contains('light-mode');
    }
    return false;
  });

  // Ensure DOM class matches initial state immediately on mount
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const activeEnvId = isLightMode ? currentLightEnvId : currentDarkEnvId;

  // Toggle sound
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
    if (nextState) sounds.playToggle();
  };

  // Toggle Light / Dark mode (Only way to switch mode)
  const handleToggleLightMode = () => {
    const nextMode = !isLightMode;
    setIsLightMode(nextMode);
    sounds.playModeSwitch(nextMode);

    if (nextMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('spatial_theme_mode', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('spatial_theme_mode', 'dark');
    }
  };

  // Select Environment from popover (Strictly updates current mode's background, never changes theme)
  const handleSelectEnvironment = (envId: string) => {
    if (isLightMode) {
      setCurrentLightEnvId(envId);
    } else {
      setCurrentDarkEnvId(envId);
    }
  };

  // Copy email handler
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DESIGNER_INFO.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2600);
  };

  const isNavigatingRef = useRef(false);
  const scrollIdleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth scroll to target section without intermediate jumps
  const handleScrollToSection = (sectionId: string) => {
    isNavigatingRef.current = true;
    setActiveSection(sectionId as ActiveSection);

    if (scrollIdleTimerRef.current) {
      clearTimeout(scrollIdleTimerRef.current);
    }

    const el = document.getElementById(sectionId);
    if (el) {
      if (sectionId === 'overview') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (sectionId === 'contact') {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        const topPos = Math.max(0, el.offsetTop - 70);
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    }

    // Safety fallback timer if no scroll occurs (e.g. already at or near destination)
    scrollIdleTimerRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 400);
  };

  // Scroll spy to update active section as user manually scrolls
  useEffect(() => {
    const handleScroll = () => {
      // If user initiated a navigation click, keep lock active until scrolling has fully rested
      if (isNavigatingRef.current) {
        if (scrollIdleTimerRef.current) {
          clearTimeout(scrollIdleTimerRef.current);
        }
        scrollIdleTimerRef.current = setTimeout(() => {
          isNavigatingRef.current = false;
        }, 160);
        return;
      }

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page check: always prioritize 'contact'
      if (scrollY + windowHeight >= documentHeight - 60) {
        setActiveSection('contact');
        return;
      }

      // Top of page check: always prioritize 'overview'
      if (scrollY < 140) {
        setActiveSection('overview');
        return;
      }

      const sections: ActiveSection[] = ['overview', 'work', 'interactive', 'resume', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 150;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleScrollEnd = () => {
      if (scrollIdleTimerRef.current) {
        clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollIdleTimerRef.current) clearTimeout(scrollIdleTimerRef.current);
    };
  }, []);

  // Lock body & document scroll only when a modal is actively open and prevent background shift
  const isAnyModalOpen = Boolean(
    selectedCaseStudy || isResumeModalOpen || isContactModalOpen || isExperimentModalOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`);
      } else {
        document.documentElement.style.setProperty('--scrollbar-width', '0px');
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.setProperty('--scrollbar-width', '0px');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.setProperty('--scrollbar-width', '0px');
    };
  }, [isAnyModalOpen]);

  // Modular visionOS Glass Card styles for separated sections
  const headerGlassClasses = `glass w-full rounded-[36px] px-4 sm:px-8 lg:px-10 py-5 sm:py-6 transition-all duration-300 border scroll-mt-14 ${
    isLightMode
      ? 'border-black/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]'
      : 'border-white/[0.08] shadow-[0_28px_70px_-18px_rgba(0,0,0,0.72)]'
  }`;

  const headerGlassStyle: React.CSSProperties = {
    borderRadius: '36px',
    borderWidth: '1px',
    backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.68)' : 'rgba(18, 20, 26, 0.38)',
    backdropFilter: 'blur(40px) saturate(190%)',
    WebkitBackdropFilter: 'blur(40px) saturate(190%)',
    boxShadow: isLightMode
      ? '0 20px 50px -15px rgba(0,0,0,0.08)'
      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 0 rgba(0, 0, 0, 0.6), 0 28px 70px -18px rgba(0,0,0,0.72)'
  };

  const cardGlassClasses = `glass w-full rounded-[36px] px-4 sm:px-8 lg:px-10 py-8 sm:py-12 transition-all duration-300 border scroll-mt-14 ${
    isLightMode
      ? 'border-black/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]'
      : 'border-white/[0.08] shadow-[0_28px_70px_-18px_rgba(0,0,0,0.72)]'
  }`;

  const cardGlassStyle: React.CSSProperties = {
    borderRadius: '36px',
    borderWidth: '1px',
    backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.68)' : 'rgba(18, 20, 26, 0.38)',
    backdropFilter: 'blur(40px) saturate(190%)',
    WebkitBackdropFilter: 'blur(40px) saturate(190%)',
    boxShadow: isLightMode
      ? '0 20px 50px -15px rgba(0,0,0,0.08)'
      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 0 rgba(0, 0, 0, 0.6), 0 28px 70px -18px rgba(0,0,0,0.72)'
  };

  const footerGlassClasses = `glass w-full rounded-[28px] px-4 sm:px-8 lg:px-10 py-5 transition-all duration-300 border flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-3.5 sm:gap-4 text-xs font-mono ${
    isLightMode
      ? 'border-black/10 text-stone-600 shadow-[0_12px_32px_-10px_rgba(0,0,0,0.06)]'
      : 'border-white/[0.08] text-white/55 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.60)]'
  }`;

  const footerGlassStyle: React.CSSProperties = {
    borderRadius: '28px',
    borderWidth: '1px',
    backgroundColor: isLightMode ? 'rgba(255, 255, 255, 0.68)' : 'rgba(18, 20, 26, 0.38)',
    backdropFilter: 'blur(40px) saturate(190%)',
    WebkitBackdropFilter: 'blur(40px) saturate(190%)',
    boxShadow: isLightMode
      ? '0 12px 32px -10px rgba(0,0,0,0.06)'
      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 0 rgba(0, 0, 0, 0.6), 0 16px 40px -12px rgba(0,0,0,0.60)'
  };

  return (
    <div
      className={`relative min-h-screen transition-colors duration-400 ${
        isLightMode
          ? 'bg-[#F2F4F8] text-stone-900 selection:bg-black/10 selection:text-black'
          : 'bg-[#0A0B0E] text-white selection:bg-white/20 selection:text-white'
      }`}
    >
      {/* LAYER 0: Room / Natural Environment Backdrop */}
      <Environment
        currentEnv={activeEnvId}
        dimLevel={isLightMode ? 0.18 : 0.28}
        blurAmount={0}
        isLightMode={isLightMode}
      />

      {/* LAYER 30: Floating Vertical Tab Bar on Leading Edge (Desktop) */}
      <TabBar
        activeSection={activeSection}
        onSelectSection={(sec) => handleScrollToSection(sec)}
        isLightMode={isLightMode}
        isHidden={isAnyModalOpen}
      />

      {/* Main Spatial Stage */}
      <div className="relative z-10 flex flex-col items-center min-h-screen px-3 sm:px-8 lg:px-20 pt-8 sm:pt-14 pb-32 sm:pb-36">
        {/* Modular Floating Spatial Windows */}
        <main className="w-full max-w-[1140px] flex flex-col gap-6 sm:gap-8">
          {/* TOP PROFILE CARD: Image, Name & Ellipsis Menu */}
          <section
            id="overview"
            className={`${headerGlassClasses} relative z-30`}
            style={{ ...headerGlassStyle, zIndex: 30 }}
          >
            <ProfileHeader
              onOpenContact={() => setIsContactModalOpen(true)}
              onCopyEmail={handleCopyEmail}
              emailCopied={emailCopied}
              isLightMode={isLightMode}
            />
          </section>

          {/* HEADLINE, MANIFESTO & BENTO GRID CARD */}
          <section
            className={`${cardGlassClasses} relative z-10`}
            style={{ ...cardGlassStyle, zIndex: 10 }}
          >
            <HeroSection
              onScrollToSection={handleScrollToSection}
              onOpenResume={() => setIsResumeModalOpen(true)}
              onOpenContact={() => setIsContactModalOpen(true)}
              isLightMode={isLightMode}
            />
          </section>

          {/* SECTION 2: Work */}
          <section id="work" className="w-full">
            <CaseStudiesSection
              onSelectCaseStudy={(study) => setSelectedCaseStudy(study)}
              isLightMode={isLightMode}
            />
          </section>

          {/* SECTION 3: Materials & Lab */}
          <section
            id="interactive"
            className={cardGlassClasses}
            style={cardGlassStyle}
          >
            <InteractiveLab
              isLightMode={isLightMode}
              onModalOpenChange={setIsExperimentModalOpen}
            />
          </section>

          {/* SECTION 4: Resume */}
          <section
            id="resume"
            className={cardGlassClasses}
            style={cardGlassStyle}
          >
            <ResumeSection
              onOpenResumeModal={() => setIsResumeModalOpen(true)}
              isLightMode={isLightMode}
            />
          </section>

          {/* SECTION 5: Contact */}
          <section
            id="contact"
            className={cardGlassClasses}
            style={cardGlassStyle}
          >
            <ContactSection
              onCopyEmail={handleCopyEmail}
              emailCopied={emailCopied}
              isLightMode={isLightMode}
            />
          </section>

          {/* Modular Window Footer & Copyright Card */}
          <footer
            className={footerGlassClasses}
            style={footerGlassStyle}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center sm:text-left">
              <span className="font-normal">© {new Date().getFullYear()} Crafted by {DESIGNER_INFO.name}</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="font-normal">Engineered by AI</span>
            </div>

            <div className="flex items-center justify-center">
              <button
                onClick={() => {
                  sounds.playTap();
                  handleScrollToSection('overview');
                }}
                className={`inline-flex items-center justify-center gap-1.5 transition-colors group cursor-pointer ${
                  isLightMode ? 'hover:text-stone-900' : 'hover:text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span className="font-normal">Back to top</span>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* LAYER 30: Static Floating Bottom Toolbar (Fixed at Viewport Bottom) */}
      <Ornament
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isLightMode={isLightMode}
        onToggleLightMode={handleToggleLightMode}
        onOpenResumeModal={() => setIsResumeModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onSelectEnvironment={handleSelectEnvironment}
        currentEnvId={activeEnvId}
        isHidden={isAnyModalOpen}
      />

      {/* LAYER 40: Case Study Deep Dive Modal Sheet */}
      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        isLightMode={isLightMode}
      />

      {/* LAYER 40: Full Executive Resume Modal Sheet */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        isLightMode={isLightMode}
      />

      {/* LAYER 40: Quick Contact Modal Sheet */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onCopyEmail={handleCopyEmail}
        emailCopied={emailCopied}
        isLightMode={isLightMode}
      />
    </div>
  );
}
