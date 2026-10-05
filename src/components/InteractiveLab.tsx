import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, Code2, CheckCircle2 } from 'lucide-react';
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
    subtitle: "Empathetic relationship AI with real-time tone reflection and shared memories.",
    heroImage: "/src/assets/images/coupleschat_preview_1790968348941.jpg",
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
    subtitle: "Computer vision swing analyzer delivering real-time kinematics and shot telemetry.",
    heroImage: "/src/assets/images/golfscanner_preview_1790968360808.jpg",
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
    category: "Generative Graphics",
    title: "NeuralShader",
    subtitle: "Conversational natural language to real-time WebGL fragment shaders with zero-latency compilation.",
    heroImage: "/src/assets/images/experiment_neural_shader_1790967365207.jpg",
    readTime: "4 min read",
    summary: "NeuralShader explores real-time generative computer graphics by compiling natural language descriptions into valid, hardware-accelerated GLSL fragment shaders on the fly. Includes an AST sanitizer and hot-reloading WebGL preview pipeline.",
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
  },
  {
    id: "spatial-kinetics",
    category: "Spatial UI & Physics",
    title: "SpatialKinetics",
    subtitle: "Fluid spring-physics engine modeling gaze-anchored glass windows with ambient inertia.",
    heroImage: "/src/assets/images/experiment_spatial_kinetics_1790967377472.jpg",
    readTime: "6 min read",
    summary: "SpatialKinetics explores the ergonomics of 3D spatial glass window anchoring. Modeled around biological micro-saccades and natural head velocity, it prevents visual jitter while maintaining the illusion of true physical weight and air resistance.",
    technicalArchitecture: [
      "Non-linear RK4 spring integrator tuned for 90 FPS spatial head-mounted displays",
      "Adaptive gaze deadband filtering eliminating micro-saccade tremor without introducing input lag",
      "Specular rim lighting vector dynamically mapped to room lux sensors and sun orientation",
      "Spatial collision and anti-overlap physics preventing window occlusion in multi-tasking workspaces"
    ],
    specs: [
      { label: "Refresh Rate", value: "90Hz Spatial Display" },
      { label: "Integrator", value: "Runge-Kutta (RK4)" },
      { label: "Jitter Reduction", value: "87% vs Linear" },
      { label: "Latency", value: "Sub-11ms Motion-to-Photon" }
    ],
    codeSnippet: `// Runge-Kutta 4th Order Spring Physics Integrator
function evaluateSpring(current: SpringState, target: number, dt: number, config: SpringConfig) {
  const dX = current.pos - target;
  const accel = -config.stiffness * dX - config.damping * current.vel;
  return { pos: current.pos + current.vel * dt, vel: current.vel + accel * dt };
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
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  // Notify parent when experiment modal is open so body scroll and layout shift are handled centrally
  React.useEffect(() => {
    const isOpen = Boolean(selectedExperiment);
    onModalOpenChange?.(isOpen);
    return () => {
      onModalOpenChange?.(false);
    };
  }, [selectedExperiment, onModalOpenChange]);

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="mb-8 px-2 sm:px-0">
        <h2
          className={`text-3xl sm:text-4xl font-bold tracking-tight ${
            isLightMode ? 'text-stone-900' : 'text-white'
          }`}
        >
          AI experiments
        </h2>
        <p
          className={`mt-3 text-base sm:text-lg leading-relaxed font-normal max-w-3xl ${
            isLightMode ? 'text-stone-600' : 'text-white/70'
          }`}
        >
          These are (a few) of my experiments in code and craft. Even as a design leader, I believe the only way to master the medium is to build. This space is dedicated to hands-on exploration, using AI to translate ideas into reality.
        </p>
      </div>

      {/* 2-Column Grid (1 Column on Smaller Screens) of Clean Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {EXPERIMENTS.map((exp) => (
          <div
            key={exp.id}
            onClick={() => {
              sounds.playGlassChime();
              setSelectedExperiment(exp);
            }}
            className={`group relative rounded-[28px] sm:rounded-[32px] overflow-hidden transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-stretch ${
              isLightMode
                ? 'bg-white/80 hover:bg-white border border-stone-900/10 hover:border-stone-900/25 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 shadow-xl hover:shadow-2xl'
            }`}
          >
            {/* Horizontal Thumbnail Image Frame */}
            <div className="relative overflow-hidden shrink-0 w-full sm:w-44 md:w-48 lg:w-44 xl:w-48 h-48 sm:h-auto min-h-[175px] m-2.5 sm:m-3 sm:mr-0 rounded-[20px] sm:rounded-[24px]">
              <img
                src={exp.heroImage}
                alt={exp.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Specular Edge Gradient Overlay on Image */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isLightMode
                    ? 'bg-gradient-to-t from-black/20 via-transparent to-transparent'
                    : 'bg-gradient-to-t from-black/50 via-transparent to-transparent'
                }`}
              />
            </div>

            {/* Horizontal Information Body: Title, Description, and CTA */}
            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
              <div>
                <h3
                  className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-200 ${
                    isLightMode ? 'text-stone-900 group-hover:text-black' : 'text-white group-hover:text-sky-100'
                  }`}
                >
                  {exp.title}
                </h3>

                <p
                  className={`mt-2 text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                    isLightMode ? 'text-stone-600' : 'text-white/75'
                  }`}
                >
                  {exp.subtitle}
                </p>
              </div>

              {/* CTA Action */}
              <div className="mt-4 pt-2">
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

      {/* Read More Detail Modal (Portaled to document.body at layer 50) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedExperiment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 overflow-y-auto overscroll-contain"
                onClick={() => setSelectedExperiment(null)}
              >
                <motion.div
                  initial={{ scale: 0.94, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 20 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative w-full max-w-3xl rounded-[32px] overflow-hidden border shadow-2xl my-auto flex flex-col max-h-[90vh] ${
                    isLightMode
                      ? 'bg-white text-stone-900 border-stone-200'
                      : 'bg-stone-900 text-white border-white/20'
                  }`}
                >
                  {/* Modal Hero Banner */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0">
                    <img
                      src={selectedExperiment.heroImage}
                      alt={selectedExperiment.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isLightMode
                          ? 'from-white via-white/50 to-transparent'
                          : 'from-stone-900 via-stone-900/60 to-transparent'
                      }`}
                    />

                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedExperiment(null)}
                      className={`absolute top-5 right-5 w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        isLightMode
                          ? 'bg-white/80 hover:bg-white text-stone-900 border-black/10'
                          : 'bg-black/60 hover:bg-black/90 text-white border-white/20'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-2 border ${
                          isLightMode
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        <span>{selectedExperiment.category}</span>
                        <span>·</span>
                        <span>{selectedExperiment.readTime}</span>
                      </div>
                      <h3
                        className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                          isLightMode ? 'text-stone-900' : 'text-white'
                        }`}
                      >
                        {selectedExperiment.title}
                      </h3>
                    </div>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 sm:p-8 overflow-y-auto overscroll-contain space-y-6">
                    <div>
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                          isLightMode ? 'text-sky-700' : 'text-sky-400'
                        }`}
                      >
                        Executive summary
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isLightMode ? 'text-stone-700' : 'text-white/85'
                        }`}
                      >
                        {selectedExperiment.summary}
                      </p>
                    </div>

                    {/* Technical Architecture */}
                    <div>
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                          isLightMode ? 'text-emerald-700' : 'text-emerald-400'
                        }`}
                      >
                        Technical innovations
                      </h4>
                      <div className="space-y-2.5">
                        {selectedExperiment.technicalArchitecture.map((tech, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2
                              className={`w-4 h-4 shrink-0 mt-0.5 ${
                                isLightMode ? 'text-emerald-600' : 'text-emerald-400'
                              }`}
                            />
                            <span
                              className={`text-xs sm:text-sm leading-relaxed ${
                                isLightMode ? 'text-stone-700' : 'text-white/80'
                              }`}
                            >
                              {tech}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benchmarks Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {selectedExperiment.specs.map((spec, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-[18px] border ${
                            isLightMode
                              ? 'bg-stone-50 border-stone-200'
                              : 'bg-white/[0.04] border-white/10'
                          }`}
                        >
                          <div
                            className={`text-[11px] ${
                              isLightMode ? 'text-stone-500' : 'text-white/50'
                            }`}
                          >
                            {spec.label}
                          </div>
                          <div
                            className={`text-xs sm:text-sm font-bold mt-1 ${
                              isLightMode ? 'text-stone-900' : 'text-white'
                            }`}
                          >
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Code Implementation */}
                    <div>
                      <div
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${
                          isLightMode ? 'text-amber-700' : 'text-amber-300'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Production implementation</span>
                      </div>
                      <pre
                        className={`p-4 rounded-[20px] border text-xs font-mono overflow-x-auto leading-relaxed ${
                          isLightMode
                            ? 'bg-stone-900 border-stone-800 text-stone-100'
                            : 'bg-black/60 border-white/10 text-white/90'
                        }`}
                      >
                        {selectedExperiment.codeSnippet}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
