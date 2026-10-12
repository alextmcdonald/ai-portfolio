import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Code2, CheckCircle2, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';
import { sounds } from '../utils/audio';

interface Experiment {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  heroImage: string;
  readTime: string;
  summary: string;
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
    summary: "CouplesChat explores empathetic conversational AI designed to nurture healthy relationship habits. It pairs real-time tone reflection with shared memory indexing, helping partners communicate with deeper understanding and vulnerability.",
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
    category: "Computer Vision & AI",
    title: "Golfscanner",
    subtitle: "A better way to find golf courses and tee times using AI. Think Google flights for golf.",
    heroImage: "/assets/images/golfscanner.jpg",
    readTime: "5 min read",
    summary: "Golfscanner leverages real-time mobile computer vision and neural pose estimation to decompose a golfer's swing kinematics in sub-second latency. Instantly tracks clubface angle, tempo ratio, hip rotation, and projected ball flight without external hardware.",
    technicalArchitecture: [
      "Edge-computed 33-point skeletal landmark tracking running at 60 FPS on mobile",
      "Sub-millimeter clubhead path detection and impact angle reconstruction",
      "Dynamic tempo analysis comparing backswing-to-downswing cadence against tour averages",
      "Augmented reality spatial ball flight trajectory rendering in ambient 3D space"
    ],
    specs: [
      { label: "Frame Rate", value: "60 FPS on Device" },
      { label: "Kinematics", value: "33 Skeletal Landmarks" },
      { label: "Model", value: "CoreML / ONNX Vision" },
      { label: "Detection", value: "Acoustic Impact Trigger" }
    ],
    codeSnippet: `// Sub-second kinematic pose & clubhead trajectory solver
function analyzeSwingFrame(landmarks: PoseLandmarks, timestampMs: number) {
  const hipRotationAngle = calculateHipAngle(landmarks.leftHip, landmarks.rightHip);
  const shoulderTilt = calculateShoulderTilt(landmarks.leftShoulder, landmarks.rightShoulder);
  const tempoRatio = (timestampMs - swingStartMs) / downswingDurationMs;
  return { hipRotationAngle, shoulderTilt, tempoRatio };
}`
  },
  {
    id: "neural-shader",
    category: "UX Education & Tools",
    title: "EverydayUX",
    subtitle: "Helping UX designers sharpen their skills through bite-sized daily challenges.",
    heroImage: "/assets/images/everydayux.jpg",
    readTime: "4 min read",
    summary: "EverydayUX explores real-time generative computer graphics by compiling natural language descriptions into valid, hardware-accelerated GLSL fragment shaders on the fly. Includes an AST sanitizer and hot-reloading WebGL preview pipeline.",
    technicalArchitecture: [
      "Hot-reloading WebGL fragment shader compiler with real-time GLSL syntax sanitization",
      "Zero-allocation GPU uniform bridging for mouse, audio spectrum, and temporal delta variables",
      "Token-streaming shader generator delivering instant visual synthesis as code streams",
      "Adaptive fallbacks preventing GPU thread locking on complex raymarching shaders"
    ],
    specs: [
      { label: "Renderer", value: "WebGL 2.0" },
      { label: "Compilation", value: "<12ms Hot Swap" },
      { label: "Generation", value: "AST-Guarded GLSL" },
      { label: "Framerate", value: "120 FPS VSync" }
    ],
    codeSnippet: `// Dynamic fragment shader injection & compile loop
function hotCompileShader(gl: WebGL2RenderingContext, glslSource: string) {
  const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(shader, sanitizeGLSL(glslSource));
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile error');
  }
  return shader;
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset tab to overview when opening an experiment
  React.useEffect(() => {
    if (selectedExperiment) {
      setActiveTab('overview');
    }
  }, [selectedExperiment]);

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
          AI playground
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
                  {/* Top Bar with Title and Close Button (Even vertical padding) */}
                  <div
                    className={`flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 shrink-0 border-0 ${
                      light ? 'bg-white' : 'bg-white/[0.03]'
                    }`}
                  >
                    <h2
                      className={`text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight ${
                        light ? 'text-stone-950' : 'text-white'
                      }`}
                    >
                      {selectedExperiment.title}
                    </h2>

                    <button
                      onClick={() => {
                        sounds.playTap();
                        setSelectedExperiment(null);
                      }}
                      aria-label="Close experiment details"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border shrink-0 ml-4 cursor-pointer ${
                        light
                          ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                          : 'bg-white/12 hover:bg-white/20 text-white border-white/15'
                      }`}
                    >
                      <X className="w-5 h-5 stroke-[2]" />
                    </button>
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

                    {/* Coming Soon Notice */}
                    <div className="max-w-3xl pt-2 pb-6">
                      <p
                        className={`text-base sm:text-[20px] leading-relaxed sm:leading-[32.5px] font-normal ${
                          light ? 'text-stone-700' : 'text-white/85'
                        }`}
                      >
                        More information coming soon...
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
