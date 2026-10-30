import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Code2, CheckCircle2, Sparkles, Layers, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Experiment {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  heroImage: string;
  readTime: string;
  summary: string;
  descriptionParagraphs: string[];
  technicalArchitecture: string[];
  specs: { label: string; value: string }[];
  codeSnippet: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "couples-chat",
    category: "AI Communication",
    title: "CouplesChat",
    subtitle: "An AI-powered relationship coach for couples with a private and group chat feature.",
    heroImage: "/assets/images/coupleschat.jpg",
    readTime: "4 min read",
    summary: "CouplesChat is an AI relationship coach designed to help couples communicate better, navigate conflict, and build stronger relationships over time.",
    descriptionParagraphs: [
      "CouplesChat is an AI relationship coach designed to help couples communicate better, navigate conflict, and build stronger relationships over time. Rather than replacing real conversations, the app helps people prepare for them, reflect on them, and better understand both themselves and their partner.",
      "I've been designing the product from the ground up, from user flows and onboarding to the AI conversation experience itself. The focus has been creating an experience that feels supportive, personal, and easy to use while keeping each partner's privacy and shared relationship history in mind.",
      "This project is especially meaningful because healthy relationships are one of the biggest predictors of happiness, yet most people have very few tools to help them communicate well. I'm excited by the idea that AI can provide thoughtful guidance in moments when people need it most and help couples build healthier habits over time."
    ],
    technicalArchitecture: [
      "Real-time sentiment and tone reflection using low-latency streaming LLMs",
      "End-to-end encrypted shared relationship vault and shared memory indexing",
      "Gentle conflict de-escalation suggestions powered by emotionally intelligent prompting",
      "Micro-ritual daily connection prompts designed to build consistent emotional intimacy"
    ],
    specs: [
      { label: "Latency", value: "180ms Streaming" },
      { label: "Privacy", value: "Zero-Knowledge E2EE" },
      { label: "Architecture", value: "Vector Memory + Gemini" },
      { label: "Design System", value: "Warm Glassmorphism" }
    ],
    codeSnippet: `// Real-time empathetic tone reflection pipeline
async function analyzeMessageTone(content: string, coupleContext: CoupleProfile) {
  const reflection = await aiModel.generate({
    systemPrompt: "Analyze conversational tone with empathy, warmth, and non-defensive reframing.",
    input: content,
    context: coupleContext.sharedValues
  });
  return reflection.suggestedReframing;
}`
  },
  {
    id: "golf-scanner",
    category: "Search & Discovery",
    title: "Golfscanner",
    subtitle: "A better way to find golf courses and tee times using AI. Think Google flights for golf.",
    heroImage: "/assets/images/golfscanner.jpg",
    readTime: "5 min read",
    summary: "Golfscanner is my vision for making it easier to find available tee times across multiple golf courses from one place.",
    descriptionParagraphs: [
      "Golfscanner is my vision for making it easier to find available tee times across multiple golf courses from one place. Booking golf can still feel surprisingly fragmented, with players jumping between different websites and reservation systems just to find an opening that fits their schedule.",
      "The idea is to create a simple search experience where golfers can quickly discover available tee times, compare options, and spend less time searching and more time playing. Long term, I see opportunities to help courses fill unused inventory while giving players a much better booking experience.",
      "As someone who loves golf, this is a product I would use myself every week. It's the kind of everyday problem that seems small but affects millions of golfers, and I enjoy exploring how thoughtful product design and AI can simplify experiences that have been unnecessarily complicated for years."
    ],
    technicalArchitecture: [
      "Unified multi-course inventory aggregator querying municipal and public club APIs",
      "Smart preference filters matching price thresholds, time-of-day, and weather windows",
      "Sub-second tee-time availability scanner with dynamic price comparison matrix",
      "Automated reservation route synchronization with personal calendars"
    ],
    specs: [
      { label: "Search Engine", value: "Multi-Course Aggregate" },
      { label: "Refresh Rate", value: "Real-Time Telemetry" },
      { label: "Platform", value: "Mobile-First Web & iOS" },
      { label: "Model", value: "Schedule Intelligence" }
    ],
    codeSnippet: `// Aggregated tee time discovery and slot matcher
function queryAvailableTeeTimes(location: GeoCoords, date: Date, preferredWindow: TimeRange) {
  return courseAggregator.findSlots({
    coords: location,
    radiusMiles: 25,
    dateRange: [date],
    window: preferredWindow
  });
}`
  },
  {
    id: "everyday-ux",
    category: "UX Education & Tools",
    title: "EverydayUX",
    subtitle: "Helping UX designers sharpen their skills through bite-sized daily challenges.",
    heroImage: "/assets/images/everydayux.jpg",
    readTime: "4 min read",
    summary: "EverydayUX is a place where designers can spend just a few minutes each day solving real product design challenges to build stronger product instincts.",
    descriptionParagraphs: [
      "EverydayUX started from a simple observation. Most designers want to keep improving, but finding time to study every day is hard. There are plenty of courses and books, but very few experiences that make learning feel like a habit instead of another task.",
      "I'm building EverydayUX as a place where designers can spend just a few minutes each day solving real product design challenges. The goal is to make learning interactive, practical, and fun. Instead of watching long videos or reading endless articles, users can work through bite sized scenarios, compare their thinking with guided solutions, and gradually build stronger product instincts.",
      "This project is important to me because I believe great designers are made through consistent practice. I want to create something that I would personally look forward to opening every morning and that helps designers at every stage of their career become a little better every day."
    ],
    technicalArchitecture: [
      "Micro-learning scenario engine delivering real-world product dilemmas in under 5 minutes",
      "Interactive guided solution walk-throughs with rationale comparison",
      "Streak tracking and habit formation mechanics designed for sustainable daily practice",
      "Progressive scenario difficulty adapting to junior, mid-level, and senior design patterns"
    ],
    specs: [
      { label: "Format", value: "Daily Bite-Sized" },
      { label: "Cadence", value: "3-5 Mins / Day" },
      { label: "Focus", value: "Real UX Challenges" },
      { label: "Community", value: "Peer Discussion" }
    ],
    codeSnippet: `// Scenario evaluation and decision tree solver
function evaluateScenarioChoice(userDecision: DecisionId, expertPath: ExpertGuidance) {
  const alignmentScore = calculateRationaleDelta(userDecision.tradeoffs, expertPath.considerations);
  return { score: alignmentScore, takeaways: expertPath.critiqueNotes };
}`
  }
];

interface InteractiveLabProps {
  isLightMode?: boolean;
  onModalOpenChange?: (isOpen: boolean) => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  isLightMode = false,
  onModalOpenChange
}) => {
  const light = isLightMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('light-mode'));
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'innovations' | 'specs' | 'code'>('overview');
  const [hoveredNavTooltip, setHoveredNavTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset tab to overview, scroll position and tooltip when opening or changing experiment
  React.useEffect(() => {
    if (selectedExperiment) {
      setActiveTab('overview');
      setHoveredNavTooltip(null);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } else {
      setHoveredNavTooltip(null);
    }
  }, [selectedExperiment?.id]);

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Auto-scroll the active tab into view horizontally
  React.useEffect(() => {
    const tabEl = document.getElementById(`exp-tab-${activeTab}`);
    if (tabEl && tabsContainerRef.current) {
      tabEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
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
  }, [selectedExperiment]);

  // Prevent background scroll bleed-through when experiment modal is open
  React.useEffect(() => {
    if (!selectedExperiment) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const scrollable = target.closest('[data-modal-scrollable="true"]');
      if (!scrollable) {
        e.preventDefault();
        return;
      }

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
  }, [selectedExperiment]);

  // Notify parent when experiment modal is open so body scroll and layout shift are handled centrally
  React.useEffect(() => {
    const isOpen = Boolean(selectedExperiment);
    onModalOpenChange?.(isOpen);
    return () => {
      onModalOpenChange?.(false);
    };
  }, [selectedExperiment, onModalOpenChange]);

  const currentIndex = selectedExperiment
    ? EXPERIMENTS.findIndex((e) => e.id === selectedExperiment.id)
    : -1;
  const prevIndex =
    currentIndex !== -1 ? (currentIndex - 1 + EXPERIMENTS.length) % EXPERIMENTS.length : 0;
  const nextIndex =
    currentIndex !== -1 ? (currentIndex + 1) % EXPERIMENTS.length : 0;
  const prevExp = EXPERIMENTS[prevIndex];
  const nextExp = EXPERIMENTS[nextIndex];

  const handlePrevExperiment = () => {
    if (currentIndex === -1 || EXPERIMENTS.length === 0) return;
    sounds.playTap();
    const newPrevIndex = (currentIndex - 1 + EXPERIMENTS.length) % EXPERIMENTS.length;
    setSelectedExperiment(EXPERIMENTS[newPrevIndex]);
    const nextPrevIdx = (newPrevIndex - 1 + EXPERIMENTS.length) % EXPERIMENTS.length;
    setHoveredNavTooltip((prev) => (prev ? { ...prev, text: EXPERIMENTS[nextPrevIdx].title } : null));
  };

  const handleNextExperiment = () => {
    if (currentIndex === -1 || EXPERIMENTS.length === 0) return;
    sounds.playTap();
    const newNextIndex = (currentIndex + 1) % EXPERIMENTS.length;
    setSelectedExperiment(EXPERIMENTS[newNextIndex]);
    const nextNextIdx = (newNextIndex + 1) % EXPERIMENTS.length;
    setHoveredNavTooltip((prev) => (prev ? { ...prev, text: EXPERIMENTS[nextNextIdx].title } : null));
  };

  // Close experiment detail modal when Esc key is pressed, ArrowLeft / ArrowRight to navigate
  React.useEffect(() => {
    if (!selectedExperiment) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playTap();
        setSelectedExperiment(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevExperiment();
      } else if (e.key === 'ArrowRight') {
        handleNextExperiment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExperiment, currentIndex]);

  const scrollToSection = (sectionId: 'overview' | 'innovations' | 'specs' | 'code') => {
    sounds.playTap();
    setActiveTab(sectionId);
    isProgrammaticScroll.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);

    const container = scrollContainerRef.current;
    const target = document.getElementById(`exp-section-${sectionId}`);
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
      setActiveTab('code');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const sections: Array<'overview' | 'innovations' | 'specs' | 'code'> = [
      'overview',
      'innovations',
      'specs',
      'code'
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(`exp-section-${sections[i]}`);
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
    { id: 'innovations' as const, label: 'Technical Innovations', icon: Layers },
    { id: 'specs' as const, label: 'System Specifications', icon: SlidersHorizontal },
    { id: 'code' as const, label: 'Production Implementation', icon: Code2 }
  ];

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="mb-8 sm:mb-10 px-2 sm:px-0">
        <h2
          className={`text-3xl sm:text-4xl font-bold tracking-tight ${
            isLightMode ? 'text-stone-900' : 'text-white'
          }`}
        >
          Side projects
        </h2>
        <p
          className={`mt-8 text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] max-w-4xl ${
            isLightMode ? 'text-stone-700' : 'text-white/85'
          }`}
        >
          These are a few of my experiments in design, code, and AI. I believe the best way to understand new tools and technologies is to get hands-on, explore possibilities, and build things. This space is where I turn curiosity into working prototypes and bring ideas to life.
        </p>
      </div>

      {/* 2-Column Grid on Desktop (lg:); Single Column on Tablet & Mobile (Portrait & Landscape) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            onClick={() => {
              sounds.playGlassChime();
              setSelectedExperiment(exp);
            }}
            className={`group relative rounded-[28px] sm:rounded-[32px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-stretch ${
              isLightMode
                ? 'bg-white/55 hover:bg-white/75 border border-black/10 hover:border-black/20 shadow-sm hover:shadow-md'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 shadow-xl hover:shadow-2xl'
            }`}
          >
            {/* Horizontal Thumbnail Image Frame */}
            <div className="relative overflow-hidden shrink-0 w-[calc(100%-2.5rem)] sm:w-[200px] md:w-[230px] lg:w-[165px] xl:w-[195px] h-32 sm:h-auto max-sm:min-h-0 m-5 mb-0 sm:m-5 sm:mr-0 rounded-2xl">
              <img
                src={exp.heroImage}
                alt={exp.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Horizontal Information Body: Title, Description, and CTA */}
            <div className="flex-1 p-5 sm:p-5 flex flex-col justify-end min-w-0">
              <div className="mt-auto">
                <h3
                  className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-200 ${
                    isLightMode ? 'text-stone-900 group-hover:text-black' : 'text-white group-hover:text-sky-100'
                  }`}
                >
                  {exp.title}
                </h3>

                <p
                  className={`mt-2 text-sm leading-relaxed line-clamp-3 ${
                    isLightMode ? 'text-stone-600' : 'text-white/75'
                  }`}
                >
                  {exp.subtitle}
                </p>
              </div>

              {/* CTA Action */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sounds.playGlassChime();
                    setSelectedExperiment(exp);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white force-white text-xs font-semibold transition-all duration-200 shadow-[0_2px_12px_rgba(0,113,227,0.3)] active:scale-95 group/btn cursor-pointer shrink-0"
                  style={{ color: '#ffffff' }}
                >
                  <span style={{ color: '#ffffff' }}>Read more</span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                    style={{ color: '#ffffff' }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read More Detail Modal (Matching CaseStudyModal exactly) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedExperiment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                {/* Dim backdrop scrim */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedExperiment(null);
                  }}
                  className={`fixed inset-0 backdrop-blur-2xl ${
                    light ? 'bg-black/75' : 'bg-black/85'
                  }`}
                />

                {/* Modal Window Container with outer border */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  className={`relative w-full max-w-4xl max-h-[90vh] rounded-[32px] sm:rounded-[40px] border shadow-2xl flex flex-col overflow-hidden z-10 my-auto ${
                    light
                      ? 'bg-white/95 text-stone-900 border-black/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)]'
                      : 'glass-thick bg-stone-950/90 text-white border-white/20'
                  }`}
                  style={{
                    backdropFilter: 'blur(48px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(48px) saturate(180%)'
                  }}
                >
                  {/* Top Bar with Title and Prev/Next/Close Navigation */}
                  <div
                    className={`flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 shrink-0 border-0 select-none ${
                      light ? 'bg-white' : 'bg-white/[0.03]'
                    }`}
                  >
                    <div>
                      <h2
                        className={`text-[24px] sm:text-[28px] font-bold tracking-tight leading-tight ${
                          light ? 'text-stone-950' : 'text-white'
                        }`}
                      >
                        {selectedExperiment.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Previous Side Project */}
                      <button
                        onClick={handlePrevExperiment}
                        onMouseEnter={(e) => {
                          if (prevExp) {
                            setHoveredNavTooltip({ text: prevExp.title, x: e.clientX, y: e.clientY });
                          }
                        }}
                        onMouseMove={(e) => {
                          if (prevExp) {
                            setHoveredNavTooltip((prev) =>
                              prev ? { ...prev, x: e.clientX, y: e.clientY } : { text: prevExp.title, x: e.clientX, y: e.clientY }
                            );
                          }
                        }}
                        onMouseLeave={() => setHoveredNavTooltip(null)}
                        aria-label={`Previous side project: ${prevExp?.title || ''}`}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                          light
                            ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                            : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Next Side Project */}
                      <button
                        onClick={handleNextExperiment}
                        onMouseEnter={(e) => {
                          if (nextExp) {
                            setHoveredNavTooltip({ text: nextExp.title, x: e.clientX, y: e.clientY });
                          }
                        }}
                        onMouseMove={(e) => {
                          if (nextExp) {
                            setHoveredNavTooltip((prev) =>
                              prev ? { ...prev, x: e.clientX, y: e.clientY } : { text: nextExp.title, x: e.clientX, y: e.clientY }
                            );
                          }
                        }}
                        onMouseLeave={() => setHoveredNavTooltip(null)}
                        aria-label={`Next side project: ${nextExp?.title || ''}`}
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                          light
                            ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                            : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Close Button */}
                      <button
                        onClick={() => {
                          setHoveredNavTooltip(null);
                          sounds.playTap();
                          setSelectedExperiment(null);
                        }}
                        aria-label="Close experiment details"
                        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                          light
                            ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                            : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Single-Page Scrollable Content Body with Only Main Image and Lorem Ipsum */}
                  <div
                    ref={scrollContainerRef}
                    data-modal-scrollable="true"
                    className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-6 space-y-6"
                  >
                    {/* Main Hero Showcase Image */}
                    <div className="relative rounded-2xl overflow-hidden aspect-video max-h-96 w-full border border-white/15">
                      <img
                        src={selectedExperiment.heroImage}
                        alt={selectedExperiment.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Experiment Description Paragraphs */}
                    <div className="max-w-3xl pt-2 pb-6 space-y-6">
                      {(selectedExperiment.descriptionParagraphs || [selectedExperiment.summary]).map((p, idx) => (
                        <p
                          key={idx}
                          className={`text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] font-normal ${
                            light ? 'text-stone-700' : 'text-white/85'
                          }`}
                        >
                          {p}
                        </p>
                      ))}
                      <p
                        className={`text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] italic ${
                          light ? 'text-stone-500' : 'text-white/60'
                        }`}
                      >
                        Full case study coming soon...
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Tooltip below cursor on Prev/Next hover */}
                <AnimatePresence>
                  {hoveredNavTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -2, scale: 0.95 }}
                      transition={{ duration: 0.12 }}
                      className={`fixed pointer-events-none z-[99999] px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium tracking-tight shadow-lg backdrop-blur-md whitespace-nowrap select-none force-white keep-white text-white ${
                        light
                          ? 'bg-black/80 shadow-stone-950/25 border border-black/10'
                          : 'bg-black/75 border border-white/15 shadow-black/50'
                      }`}
                      style={{
                        color: '#ffffff',
                        left:
                          typeof window !== 'undefined'
                            ? Math.min(Math.max(70, hoveredNavTooltip.x), window.innerWidth - 70)
                            : hoveredNavTooltip.x,
                        top: hoveredNavTooltip.y + 20,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {hoveredNavTooltip.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
