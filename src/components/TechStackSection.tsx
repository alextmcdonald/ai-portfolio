import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  siHtml5,
  siJavascript,
  siTypescript,
  siReact,
  siTailwindcss,
  siGithub,
  siStorybook,
  siClaudecode,
  siCursor,
  siV0
} from 'simple-icons';
import { sounds } from '../utils/audio';

// Authentic vector paths for tools not in the current simple-icons release
const ADOBE_PHOTOSHOP_PATH =
  'M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z';

const ADOBE_ILLUSTRATOR_PATH =
  'M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z';

const CODEX_PATH =
  'M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z';

interface TechItem {
  id: string;
  name: string;
  category: string;
  brandColor?: string;
  path?: string;
  customIcon?: React.ReactNode;
}

interface TechStackProps {
  isLightMode: boolean;
}

export const TechStackSection: React.FC<TechStackProps> = ({ isLightMode }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Allow clicking or tapping outside to dismiss floating tooltip on mobile touch
  useEffect(() => {
    if (!hoveredId) return;
    const handleDismiss = () => {
      setHoveredId(null);
    };
    const timer = setTimeout(() => {
      window.addEventListener('touchstart', handleDismiss, { once: true });
      window.addEventListener('click', handleDismiss, { once: true });
    }, 60);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('touchstart', handleDismiss);
      window.removeEventListener('click', handleDismiss);
    };
  }, [hoveredId]);

  const TECH_ITEMS: TechItem[] = [
    // AI Tools
    {
      id: 'codex',
      name: 'Codex',
      category: 'OpenAI Coding Agent',
      brandColor: '#3941FF',
      customIcon: (
        <svg
          role="img"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill="url(#codex-brand-gradient)"
          fillRule="evenodd"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="codex-brand-gradient"
              gradientUnits="userSpaceOnUse"
              x1="12"
              x2="12"
              y1="0"
              y2="24"
            >
              <stop stopColor="#B1A7FF" />
              <stop offset="0.5" stopColor="#7A9DFF" />
              <stop offset="1" stopColor="#3941FF" />
            </linearGradient>
          </defs>
          <path clipRule="evenodd" d={CODEX_PATH} />
        </svg>
      )
    },
    {
      id: 'claude-code',
      name: 'Claude Code',
      category: 'Anthropic Coding Agent',
      brandColor: `#${siClaudecode.hex}`,
      path: siClaudecode.path
    },
    {
      id: 'cursor',
      name: 'Cursor',
      category: 'AI-First Code Editor',
      brandColor: isLightMode ? '#000000' : '#FFFFFF',
      path: siCursor.path
    },
    {
      id: 'v0',
      name: 'v0',
      category: 'Generative UI Prototyping',
      brandColor: isLightMode ? '#000000' : '#FFFFFF',
      path: siV0.path
    },
    // Coding & Engineering Tools
    {
      id: 'html5',
      name: 'HTML5',
      category: 'Semantic Web Markup',
      brandColor: `#${siHtml5.hex}`,
      path: siHtml5.path
    },
    {
      id: 'css3',
      name: 'CSS3',
      category: 'Modern Responsive Layout',
      brandColor: '#1572B6',
      customIcon: (
        <svg
          viewBox="0 0 512 512"
          className="w-4.5 h-4.5 sm:w-5 sm:h-5"
          fill="#1572B6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M483.111,0.501l-42.59,461.314l-184.524,49.684L71.47,461.815L28.889,0.501H483.111z M397.29,94.302 H255.831H111.866l6.885,55.708h137.08h7.7l-7.7,3.205l-132.07,55.006l4.38,54.453l127.69,0.414l68.438,0.217l-4.381,72.606 l-64.058,18.035v-0.057l-0.525,0.146l-61.864-15.617l-3.754-45.07h-0.205H132.1h-0.202l7.511,87.007l116.423,34.429v-0.062 l0.21,0.062l115.799-33.802l15.021-172.761h-131.03h-0.323l0.323-0.14l135.83-58.071L397.29,94.302z" />
        </svg>
      )
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      category: 'Dynamic Web Engine',
      brandColor: '#F7DF1E',
      customIcon: (
        <svg
          viewBox="0 0 630 630"
          className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="630" height="630" fill="#f7df1e" />
          <path d="m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z" fill="#000000" />
        </svg>
      )
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Type-Safe Architecture',
      brandColor: `#${siTypescript.hex}`,
      path: siTypescript.path
    },
    {
      id: 'react',
      name: 'React',
      category: 'UI Component Engineering',
      brandColor: `#${siReact.hex}`,
      path: siReact.path
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Design Token System',
      brandColor: `#${siTailwindcss.hex}`,
      path: siTailwindcss.path
    },
    {
      id: 'github',
      name: 'GitHub',
      category: 'Version Control & CI/CD',
      brandColor: isLightMode ? '#181717' : '#FFFFFF',
      path: siGithub.path
    },
    {
      id: 'storybook',
      name: 'Storybook',
      category: 'Design System Sandbox',
      brandColor: `#${siStorybook.hex}`,
      path: siStorybook.path
    },
    // Design Tools
    {
      id: 'figma',
      name: 'Figma',
      category: 'Design Systems & UI',
      brandColor: '#F24E1E',
      customIcon: (
        <svg
          viewBox="0 0 16 16"
          className="w-4.5 h-4.5 sm:w-5 sm:h-5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#1ABCFE" d="M8.55 8c0-1.289 1.019-2.333 2.275-2.333C12.082 5.667 13.1 6.71 13.1 8c0 1.289-1.018 2.333-2.275 2.333C9.57 10.333 8.55 9.29 8.55 8z" />
          <path fill="#0ACF83" d="M4 12.667c0-1.289 1.019-2.334 2.275-2.334H8.55v2.334C8.55 13.955 7.531 15 6.275 15S4 13.955 4 12.667z" />
          <path fill="#FF7262" d="M8.55 1v4.667h2.275c1.257 0 2.275-1.045 2.275-2.334C13.1 2.045 12.082 1 10.825 1H8.55z" />
          <path fill="#F24E1E" d="M4 3.333c0 1.289 1.019 2.334 2.275 2.334H8.55V1H6.275C5.019 1 4 2.045 4 3.333z" />
          <path fill="#A259FF" d="M4 8c0 1.289 1.019 2.333 2.275 2.333H8.55V5.667H6.275C5.019 5.667 4 6.71 4 8z" />
        </svg>
      )
    },
    {
      id: 'photoshop',
      name: 'Adobe Photoshop',
      category: 'Visual & Bitmap Craft',
      brandColor: '#31A8FF',
      path: ADOBE_PHOTOSHOP_PATH
    },
    {
      id: 'illustrator',
      name: 'Adobe Illustrator',
      category: 'Vector & Iconography',
      brandColor: '#FF9A00',
      path: ADOBE_ILLUSTRATOR_PATH
    }
  ];

  return (
    <div className="mt-2.5 sm:mt-3.5 relative">
      <div className="flex flex-wrap items-center gap-y-4 gap-x-4 sm:gap-x-5 mt-0 pt-0">
        {/* Left: Overlapping tech stack icon tiles */}
        <div
          className="flex items-center -space-x-2 sm:-space-x-2.5 isolate pt-3.5 [@media(orientation:landscape)]:pt-8 sm:pt-8.5 pb-3.5 pl-[4px] pr-4 sm:pr-6 max-w-full overflow-x-auto md:overflow-visible no-scrollbar touch-pan-x select-none mobile-landscape-overflow-visible"
        >
          {TECH_ITEMS.map((item, idx) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="relative group transition-all duration-200 shrink-0"
                style={{
                  zIndex: isHovered ? 50 : idx + 1
                }}
              >
                {/* Floating Tooltip directly above icon */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.94 }}
                      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none flex flex-col items-center mobile-portrait-hidden"
                    >
                      <div
                        className="px-2.5 py-1.5 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] border border-white/20 bg-stone-900/95 backdrop-blur-xl whitespace-nowrap text-center force-white keep-white"
                        style={{ color: '#ffffff' }}
                      >
                        <div
                          className="text-xs font-semibold leading-tight tracking-tight force-white keep-white"
                          style={{ color: '#ffffff' }}
                        >
                          {item.name}
                        </div>
                      </div>
                      {/* Downward triangle caret */}
                      <div className="w-2 h-2 rotate-45 -mt-1 border-r border-b bg-stone-900/95 border-white/20" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon Tile Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setHoveredId(item.id);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onTouchStart={() => setHoveredId(item.id)}
                  aria-label={item.name}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer mobile-portrait-no-shadow ${
                    isLightMode
                      ? 'bg-[#DFE0E4] text-stone-800 border border-[#D3D5D9] ring-2 ring-[#F7F8FB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                      : 'bg-[#111111] text-white border border-white/15 ring-2 ring-[#0c0d12]/90 shadow-[0_4px_14px_rgba(0,0,0,0.45)]'
                  } ${isHovered ? '-translate-y-1.5 scale-110 shadow-xl' : 'hover:-translate-y-0.5'}`}
                >
                  <div className="transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
                    {item.customIcon ? (
                      item.customIcon
                    ) : (
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill={item.brandColor}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d={item.path} />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Handwritten Script "Current tech stack" with arrow pointing to it */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 select-none py-1 ml-3.5 lg:ml-0 xl:-ml-3 [@media(orientation:landscape)_and_(min-width:1024px)]:-translate-x-3 [@media(orientation:landscape)_and_(min-width:768px)_and_(max-width:1366px)]:-translate-x-3 [@media(orientation:landscape)_and_(max-height:600px)]:ml-3.5 [@media(orientation:landscape)_and_(max-height:600px)]:translate-x-0 tech-stack-callout-adjust">
          {/* Hand-drawn curved arrow pointing toward the tech stack icons */}
          <div
            className="relative text-[#e17100] transition-colors duration-200 -translate-y-1.5 lg:translate-y-0 [@media(orientation:landscape)_and_(max-height:600px)]:-translate-y-1.5"
            style={{ color: '#e17100' }}
          >
            <svg
              width="44"
              height="28"
              viewBox="0 0 52 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-5 sm:w-9 sm:h-5.5 lg:w-10 lg:h-6 -scale-y-100 rotate-[24deg] lg:scale-y-100 lg:rotate-[10deg] [@media(orientation:landscape)_and_(max-height:600px)]:-scale-y-100 [@media(orientation:landscape)_and_(max-height:600px)]:rotate-[24deg] text-[#e17100] transition-transform duration-200"
              style={{ color: '#e17100' }}
            >
              {/* Curved sketch stroke */}
              <path
                d="M48 6C36 5 14 10 7 24"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Arrow head pointing toward the icons */}
              <path
                d="M17 21L6 25L9 14"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Script words */}
          <div className="flex flex-col translate-y-1 lg:translate-y-0 [@media(orientation:landscape)_and_(max-height:600px)]:translate-y-1">
            <span
              className="font-handwriting text-[20px] font-bold tracking-wide -rotate-2 text-[#e17100]"
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                fontSize: '20px',
                color: '#e17100'
              }}
            >
              Core tech stack
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
