import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ShieldCheck, Sparkles, SlidersHorizontal, BarChart3, Layers } from 'lucide-react';
import { CaseStudy } from '../types';
import { sounds } from '../utils/audio';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  isLightMode?: boolean;
}

const CASE_STUDY_GALLERY: Record<string, {
  explorations: Array<{ title: string; caption: string; image: string }>;
  screenImages: string[];
  systemSpecImage: string;
  impactImage: string;
}> = {
  'customerpath': {
    explorations: [
      {
        title: 'Multi-Branch Journey Nodes',
        caption: 'Visual flow graph orchestrating complex omnichannel customer touchpoints',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Predictive Audience Clustering',
        caption: 'Machine learning powered customer cohort segmentation with live retention models',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      '/assets/images/customerpath-thumb.jpg',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  },
  'aura-spatial-os': {
    explorations: [
      {
        title: 'Dynamic Gaze Occlusion',
        caption: 'Sub-pixel pupil tracking with adaptive rim specular refraction',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: '3D Spatial Window Depth',
        caption: 'Depth buffer calculations maintaining constant 45pt angular readability',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  'monolith-fintech': {
    explorations: [
      {
        title: 'Realtime Orderbook Canvas',
        caption: 'Microsecond updates rendered on GPU compositor layers',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Biometric Confirmation Drawer',
        caption: 'Multi-layer passkey authentication with progressive disclosure',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  },
  'cerebra-ai-canvas': {
    explorations: [
      {
        title: 'Infinite Node Architecture',
        caption: 'Spatial node chaining with real-time prompt branching',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Streaming Latency Profiler',
        caption: 'Token rate telemetry visualizer with sub-50ms render loop',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  'pogoseat': {
    explorations: [
      {
        title: 'Real-time Stadium Vector Map',
        caption: 'SVG stadium bowl with live color-coded seat availability heatmaps',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Instant Seat Viewpoint Simulator',
        caption: 'Field-of-view perspective simulator rendering real sightlines',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  },
  'stacksocial': {
    explorations: [
      {
        title: 'Dynamic Bundle Configurator',
        caption: 'Interactive tier-based package builder with real-time value telemetry',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Digital License Fulfillment Hub',
        caption: 'Instant 1-click license provisioning with automated copy-to-clipboard activation',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      }
    ],
    screenImages: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
    ],
    systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
    impactImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  }
};

const DEFAULT_GALLERY = {
  explorations: [
    {
      title: 'Interface Exploration A',
      caption: 'Ergonomic layout and interaction hierarchy',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Interface Exploration B',
      caption: 'Dynamic component state and visual feedback',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    }
  ],
  screenImages: [
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  ],
  systemSpecImage: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80',
  impactImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
};

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  isLightMode = false
}) => {
  const light = isLightMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('light-mode'));
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'tokens' | 'metrics'>('overview');
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Auto-scroll the active tab into view horizontally inside tab container only
  React.useEffect(() => {
    const container = tabsContainerRef.current;
    const tabEl = document.getElementById(`cs-tab-${activeTab}`);
    if (container && tabEl) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tabEl.getBoundingClientRect();
      const scrollOffset =
        tabRect.left - containerRect.left + container.scrollLeft - container.clientWidth / 2 + tabRect.width / 2;
      container.scrollTo({
        left: Math.max(0, scrollOffset),
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  // Handle wheel on tabs (translates vertical wheel to horizontal scroll)
  React.useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY !== 0) {
          e.preventDefault();
          el.scrollLeft += e.deltaY;
        }
      } else {
        const atLeft = el.scrollLeft <= 0;
        const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        if ((e.deltaX < 0 && atLeft) || (e.deltaX > 0 && atRight)) {
          e.preventDefault();
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [caseStudy]);

  // Prevent background and page scroll bleed-through while modal is open
  React.useEffect(() => {
    if (!caseStudy) return;

    // Prevent wheel events on the backdrop or scrim from scrolling the window
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const scrollable = target.closest('[data-modal-scrollable="true"]');
      if (!scrollable) {
        // Scrolled outside the modal content (scrim, padding, modal header)
        e.preventDefault();
        return;
      }

      if (scrollable === tabsContainerRef.current) {
        return;
      }

      // If scrolled inside the modal content, prevent scroll chaining at top/bottom bounds
      const el = scrollable as HTMLElement;
      const isAtTop = el.scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;
      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const scrollable = target.closest('[data-modal-scrollable="true"]');
      if (!scrollable) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [caseStudy]);

  const lastStudyRef = useRef<CaseStudy | null>(caseStudy);
  if (caseStudy) {
    lastStudyRef.current = caseStudy;
  }
  const currentStudy = caseStudy || lastStudyRef.current;

  const gallery = (currentStudy && CASE_STUDY_GALLERY[currentStudy.id]) || DEFAULT_GALLERY;

  const scrollToSection = (sectionId: 'overview' | 'process' | 'tokens' | 'metrics') => {
    sounds.playTap();
    setActiveTab(sectionId);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);

    const container = scrollContainerRef.current;
    const target = document.getElementById(`cs-section-${sectionId}`);
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetScrollTop = targetRect.top - containerRect.top + container.scrollTop - 10;
      container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 25) {
      setActiveTab('metrics');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const sections: Array<'overview' | 'process' | 'tokens' | 'metrics'> = [
      'overview',
      'process',
      'tokens',
      'metrics'
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(`cs-section-${sections[i]}`);
      if (el) {
        const elRect = el.getBoundingClientRect();
        if (elRect.top - containerRect.top <= 80) {
          setActiveTab(sections[i]);
          break;
        }
      }
    }
  };

  const navTabs = [
    { id: 'overview' as const, label: 'Executive Summary', icon: Sparkles },
    { id: 'process' as const, label: 'Design Decisions', icon: Layers },
    { id: 'tokens' as const, label: 'System Specifications', icon: SlidersHorizontal },
    { id: 'metrics' as const, label: 'Impact & Results', icon: BarChart3 }
  ];

  const currentScreenImage = gallery.screenImages[activeScreenIndex % gallery.screenImages.length];

  return typeof document !== 'undefined'
    ? createPortal(
        <AnimatePresence>
          {caseStudy && currentStudy && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden overscroll-none">
              {/* Dim backdrop scrim */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className={`fixed inset-0 backdrop-blur-2xl overscroll-none touch-none ${
                  light ? 'bg-black/92' : 'bg-black/85'
                }`}
              />

              {/* Modal Window Container (Clean borderless full-screen sheet matching ResumeModal) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className={`relative w-full h-full max-h-full case-study-modal-window rounded-[24px] sm:rounded-[32px] flex flex-col overflow-hidden z-10 my-auto transition-colors duration-200 border-0 shadow-none ${
                  light
                    ? 'bg-white text-stone-900'
                    : 'bg-stone-950 text-white'
                }`}
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  touchAction: 'auto',
                  contain: 'paint',
                  isolation: 'isolate',
                }}
              >
                {/* Header matching ResumeModal */}
                <div
                  className={`flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-0 border-b-transparent shrink-0 select-none ${
                    light ? 'bg-stone-50 text-stone-950' : 'bg-stone-900 text-white'
                  }`}
                >
                  <div>
                    <h2
                      className={`text-xl sm:text-2xl font-bold tracking-tight ${
                        light ? 'text-stone-950' : 'text-white'
                      }`}
                    >
                      {currentStudy.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                      }}
                      aria-label="Close case study"
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border-0 shadow-none cursor-pointer ${
                        light
                          ? 'bg-stone-200/80 hover:bg-stone-300 text-stone-800'
                          : 'bg-white/12 hover:bg-white/20 text-white'
                      }`}
                    >
                      <X className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>

                {/* Body: Embedded Figma Prototype IFRAME when figmaUrl exists, or Rich Case Study Deep-Dive */}
                {currentStudy.figmaUrl ? (
                  <div
                    className={`relative flex-1 min-h-0 w-full overflow-hidden case-study-iframe-container rounded-b-[24px] sm:rounded-b-[32px] p-0 m-0 border-0 shadow-none ${
                      light ? 'bg-stone-100' : 'bg-stone-900'
                    }`}
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      touchAction: 'auto',
                      contain: 'paint',
                      isolation: 'isolate',
                    }}
                  >
                    <iframe
                      src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(currentStudy.figmaUrl)}`}
                      title={`${currentStudy.title} Prototype`}
                      allowFullScreen
                      allow="fullscreen; clipboard-read; clipboard-write"
                      className="w-full h-full min-h-full border-0 outline-none shadow-none rounded-b-[24px] sm:rounded-b-[32px]"
                      style={{
                        border: 'none',
                        outline: 'none',
                        boxShadow: 'none',
                        touchAction: 'auto',
                      }}
                    />
                  </div>
                ) : (
            <>
              {/* Sticky Modal Navigation Tabs */}
              <div
                ref={tabsContainerRef}
                data-modal-scrollable="true"
                className={`sticky top-0 z-20 px-5 sm:px-8 pt-0 pb-0 flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar shrink-0 min-h-[40px] sm:min-h-[44px] h-[42px] sm:h-[46px] select-none transition-colors duration-200 border-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x [overscroll-behavior-x:none] ${
                  light ? 'bg-white' : 'bg-white/[0.03]'
                }`}
              >
                {navTabs.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`cs-tab-${tab.id}`}
                      onClick={() => scrollToSection(tab.id)}
                      className={`relative h-full flex items-center py-1.5 px-1 text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer shrink-0 border-0 bg-transparent ${
                        isSelected
                          ? light
                            ? 'text-stone-900 font-semibold'
                            : 'text-white font-semibold'
                          : light
                            ? 'text-stone-500 font-normal hover:text-stone-800'
                            : 'text-white/60 font-normal hover:text-white/90'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isSelected && (
                        <motion.div
                          layoutId="caseStudyActiveTabUnderline"
                          className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${
                            light
                              ? 'bg-stone-900 shadow-[0_0_8px_rgba(0,0,0,0.25)]'
                              : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                          }`}
                          style={{
                            backgroundColor: light ? '#0f172a' : '#ffffff'
                          }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Unified Single-Page Scrollable Content Body (With container borders, NO horizontal lines) */}
              <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                data-modal-scrollable="true"
                className="flex-1 overflow-y-auto overscroll-contain case-study-scroll-container rounded-b-[24px] sm:rounded-b-[32px] px-6 sm:px-8 py-6 space-y-12 scroll-smooth"
                style={{
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-y',
                  contain: 'paint',
                  isolation: 'isolate',
                }}
              >
                {/* SECTION 1: OVERVIEW & EXECUTIVE SUMMARY */}
                <section id="cs-section-overview" className="space-y-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Sparkles className="w-4 h-4" />
                <span>Executive Summary</span>
              </div>

              {/* Hero Showcase Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-video max-h-84 w-full group border border-white/15">
                {currentStudy.videoUrl ? (
                  <video
                    src={currentStudy.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                ) : (
                  <img
                    src={currentStudy.heroImage}
                    alt={currentStudy.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-6">
                  <p className="text-sm sm:text-base font-medium text-white/95 max-w-2xl text-balance">
                    {currentStudy.subtitle}
                  </p>
                </div>
              </div>

              {/* Problem vs Solution Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-thin p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    The Challenge
                  </div>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed font-normal">
                    {currentStudy.problem}
                  </p>
                </div>

                <div className="glass-thin p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    The Architecture
                  </div>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed font-normal">
                    {currentStudy.solution}
                  </p>
                </div>
              </div>

              {/* Early UI Interface Explorations */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">
                  Interface Explorations & Ergonomic Studies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.explorations.map((item, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 group flex flex-col">
                      <div className="aspect-[16/10] w-full overflow-hidden bg-black/30 border-b border-white/5">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="text-sm font-semibold text-white">{item.title}</div>
                        <div className="text-xs text-white/60 mt-1">{item.caption}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Insights */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white">
                  Ergonomic & Usability Insights
                </h3>
                <div className="space-y-2.5">
                  {currentStudy.researchInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/10"
                    >
                      <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/85 leading-relaxed">
                        {insight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 2: PROCESS & DESIGN DECISIONS (No horizontal divider line) */}
            <section id="cs-section-process" className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Layers className="w-4 h-4" />
                <span>Design Decisions & Workflows</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentStudy.designDecisions.map((decision, idx) => (
                  <div
                    key={idx}
                    className="glass-thin p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span>{decision.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed pl-7">
                      {decision.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive Screen Switcher with High-Res UI Mockup */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base font-bold text-white">
                    Key Interaction Workflows & UI Prototype Screens
                  </h3>
                  <span className="text-xs text-white/50 font-mono">
                    Screen {activeScreenIndex + 1} of {currentStudy.prototypeScreens.length}
                  </span>
                </div>

                {/* Workflow Screen Selector Pills */}
                <div className="flex gap-2 pb-1 overflow-x-auto">
                  {currentStudy.prototypeScreens.map((screen, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playTap();
                        setActiveScreenIndex(idx);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        activeScreenIndex === idx
                          ? 'bg-sky-500/25 text-sky-200 border-sky-400/40'
                          : light
                            ? 'bg-white/95 text-stone-800 hover:bg-white border-black/10 shadow-xs'
                            : 'bg-white/12 text-white hover:bg-white/20 border-white/15'
                      }`}
                    >
                      {screen.name}
                    </button>
                  ))}
                </div>

                {/* Rich UI Mockup Display for Active Screen */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-h-80 w-full group bg-black/40 border border-white/15">
                  <img
                    src={currentScreenImage}
                    alt={currentStudy.prototypeScreens[activeScreenIndex]?.name || 'UI Workflow'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex items-end p-5 sm:p-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-white">
                          {currentStudy.prototypeScreens[activeScreenIndex].name}
                        </span>
                        <span className="text-[11px] text-sky-300 font-mono bg-sky-500/20 px-2 py-0.5 rounded-md border border-sky-400/30">
                          {currentStudy.prototypeScreens[activeScreenIndex].tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/85 mt-1.5 max-w-2xl leading-relaxed">
                        {currentStudy.prototypeScreens[activeScreenIndex].caption}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: SYSTEM SPECIFICATIONS (No horizontal divider line) */}
            <section id="cs-section-tokens" className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <SlidersHorizontal className="w-4 h-4" />
                <span>System Specifications & Tokens</span>
              </div>

              {/* Design System UI Specimen Preview Image */}
              <div className="rounded-2xl overflow-hidden aspect-[21/9] max-h-52 w-full relative group bg-black/40 border border-white/15">
                <img
                  src={gallery.systemSpecImage}
                  alt="Design System Specimen"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-xs font-mono text-emerald-300">
                    Design Tokens, Radial Ratios & Component Elevation Spec Sheet
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Technical Architecture & Token Rationale</span>
                </div>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                  Engineered to align directly with visionOS spatial guidelines, sub-pixel rendering tolerances, and WCAG AA contrast standards.
                </p>
              </div>

              <div className="space-y-2.5">
                {currentStudy.systemSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 gap-1"
                  >
                    <span className="text-xs font-semibold text-white/60">
                      {spec.key}
                    </span>
                    <span className="text-xs font-mono text-white/90 bg-white/10 px-2 py-0.5 rounded-md border border-white/10 self-start sm:self-auto">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: METRICS & IMPACT (No horizontal divider line) */}
            <section id="cs-section-metrics" className="space-y-6 pt-4 pb-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <BarChart3 className="w-4 h-4" />
                <span>Impact & Results</span>
              </div>

              {/* Production Telemetry Dashboard UI Preview */}
              <div className="rounded-2xl overflow-hidden aspect-[21/9] max-h-52 w-full relative group bg-black/40 border border-white/15">
                <img
                  src={gallery.impactImage}
                  alt="Production Telemetry Dashboard"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-xs font-mono text-indigo-300">
                    Production Analytics: Squad Velocity, Adoption Rate & Gaze Accuracy
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentStudy.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="glass-thin p-5 rounded-2xl bg-white/[0.04] border border-white/15"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                      {metric.value}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white/90 mt-1">
                      {metric.label}
                    </div>
                    <div className="text-xs text-white/60 mt-1 leading-snug">
                      {metric.subtext}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/25">
                <h4 className="text-sm font-bold text-emerald-300">
                  Business & Architectural Longevity
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
                  The token architecture and ergonomic guidelines established in {currentStudy.title} now serve as the baseline foundation for production shipping across 3 multi-platform core squads.
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </motion.div>
  </div>
        )}
      </AnimatePresence>,
      document.body
    )
  : null;
};
