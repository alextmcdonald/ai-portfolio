import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, GraduationCap, Briefcase, Layers } from 'lucide-react';
import { DESIGNER_INFO, WORK_EXPERIENCE, EDUCATION_LIST } from '../data/portfolioData';
import { sounds } from '../utils/audio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightMode?: boolean;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  isLightMode = false
}) => {
  const light = isLightMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('light-mode'));

  if (!isOpen) return null;

  const handleDownloadResume = () => {
    sounds.playSuccess();
    const resumeText = `
ALEX McDONALD
Senior Product Designer · AI Design Engineer & Spatial Systems
Location: Seattle, WA | Email: me@alextmcdonald.com
Portfolio: https://alexmcdonald.design

===================================================================
ABOUT & EXECUTIVE SUMMARY
===================================================================
${DESIGNER_INFO.bio}
Location: ${DESIGNER_INFO.location} | Email: ${DESIGNER_INFO.email}

===================================================================
EXPERIENCE
===================================================================
${WORK_EXPERIENCE.map(
  exp => `
${exp.role}
${exp.company} | ${exp.period} | ${exp.location}
${exp.highlights.map(h => `• ${h}`).join('\n')}
Core Competencies: ${exp.skills?.join(', ') || ''}
`
).join('\n')}

===================================================================
EDUCATION
===================================================================
${EDUCATION_LIST.map(e => `• ${e.degree} - ${e.institution} (${e.year}) [${e.notes}]`).join('\n')}

===================================================================
EXPERTISE
===================================================================
• Product Design:
  Product Strategy, UI/UX Design, Visual Design, Interaction Design, Mobile Product Design, Prototyping, Information Architecture, Design Systems, AI-Assisted Design, Enterprise UX, End-to-End Product Design, Design-to-Code Workflows, B2B SaaS

• Research & Testing:
  Mixed-Methods Research, User Interviews, Usability Testing, A/B Testing, Journey Mapping, Heuristic Evaluation, Competitive Analysis, Accessibility Audits, Synthesis

• Tools & Technologies:
  Figma, Adobe CC, Dovetail, Maze, UserTesting, Hotjar, Storybook, Jira, Confluence, Miro, ChatGPT, Claude, Codex, Cursor, v0, HTML, CSS, Tailwind, React, Git, GitHub

• Leadership & Collaboration:
  Cross-Functional Leadership, Stakeholder Management, Workshop Facilitation, Product Discovery, Executive Communication, Systems Thinking, Design Strategy
    `.trim();

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Alex_McDonald_Product_Design_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className={`fixed inset-0 backdrop-blur-xl transition-all ${
            light ? 'bg-black/50' : 'bg-black/80'
          }`}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={`relative w-full max-w-4xl max-h-[92vh] rounded-[32px] sm:rounded-[40px] border shadow-2xl flex flex-col overflow-hidden z-10 my-auto backdrop-blur-2xl transition-colors duration-200 ${
            light
              ? 'bg-white/95 text-stone-900 border-black/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)]'
              : 'glass-thick bg-stone-950/90 text-white border-white/20'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 sm:px-8 py-5 border-b ${
            light ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/[0.04]'
          }`}>
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                light ? 'text-stone-950' : 'text-white'
              }`}>
                Alex McDonald&apos;s Resume
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadResume}
                className="h-9 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white force-white flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-[0_2px_12px_rgba(0,113,227,0.35)] cursor-pointer"
                style={{ color: '#ffffff' }}
                title="Download resume"
              >
                <Download className="w-3.5 h-3.5 text-white force-white" style={{ color: '#ffffff' }} />
                <span className="text-white force-white" style={{ color: '#ffffff' }}>Download</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                aria-label="Close resume modal"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer ${
                  light
                    ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                    : 'bg-white/12 hover:bg-white/20 text-white border-white/15'
                }`}
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-10 py-8 space-y-8 print:p-0">
            {/* Bio summary */}
            <div className="space-y-4">
              <p className={`text-sm sm:text-base leading-relaxed font-normal ${
                light ? 'text-stone-700' : 'text-white/90'
              }`}>
                {DESIGNER_INFO.bio}
              </p>
            </div>

            {/* Work Experience */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                light ? 'text-stone-500' : 'text-white/50'
              }`}>
                <Briefcase className="w-4 h-4 text-[#0071e3]" />
                <span>Professional Experience</span>
              </h3>

              <div className="space-y-6">
                {WORK_EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h4 className={`text-base font-bold ${
                        light ? 'text-stone-900' : 'text-white'
                      }`}>
                        {exp.role}
                      </h4>
                      <span className={`text-xs font-mono ${
                        light ? 'text-stone-500' : 'text-white/60'
                      }`}>
                        {exp.period}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-emerald-500">
                      {exp.company} <span className={light ? 'text-stone-400' : 'text-white/40'}>·</span> {exp.location}
                    </div>

                    <ul className="mt-2 space-y-1.5 pl-[10px]">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className={`text-xs sm:text-sm leading-relaxed list-disc list-inside ${
                          light ? 'text-stone-600' : 'text-white/80'
                        }`}>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                light ? 'text-stone-500' : 'text-white/50'
              }`}>
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>Education</span>
              </h3>

              <div className="space-y-3">
                {EDUCATION_LIST.map((edu, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${
                    light
                      ? 'bg-black/[0.03] border-black/10'
                      : 'bg-white/[0.03] border-white/10'
                  }`}>
                    <div className={`text-xs sm:text-sm font-bold ${
                      light ? 'text-stone-900' : 'text-white'
                    }`}>
                      {edu.degree}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      light ? 'text-stone-600' : 'text-white/70'
                    }`}>
                      {edu.institution} <span className={light ? 'text-stone-400' : 'text-white/40'}>·</span> {edu.year}
                    </div>
                    <div className={`text-xs mt-0.5 ${
                      light ? 'text-stone-500' : 'text-white/50'
                    }`}>
                      {edu.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${
                light ? 'text-stone-500' : 'text-white/50'
              }`}>
                <Layers className="w-4 h-4 text-[#0071e3]" />
                <span>Expertise</span>
              </h3>

              <div className="space-y-3">
                <div className={`p-3.5 rounded-xl border ${
                  light
                    ? 'bg-black/[0.03] border-black/10'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className={`text-xs sm:text-sm font-bold ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}>
                    Product Design
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    light ? 'text-stone-600' : 'text-white/70'
                  }`}>
                    Product Strategy, UI/UX Design, Visual Design, Interaction Design, Mobile Product Design, Prototyping, Information Architecture, Design Systems, AI-Assisted Design, Enterprise UX, End-to-End Product Design, Design-to-Code Workflows, B2B SaaS
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  light
                    ? 'bg-black/[0.03] border-black/10'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className={`text-xs sm:text-sm font-bold ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}>
                    Research & Testing
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    light ? 'text-stone-600' : 'text-white/70'
                  }`}>
                    Mixed-Methods Research, User Interviews, Usability Testing, A/B Testing, Journey Mapping, Heuristic Evaluation, Competitive Analysis, Accessibility Audits, Synthesis
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  light
                    ? 'bg-black/[0.03] border-black/10'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className={`text-xs sm:text-sm font-bold ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}>
                    Tools & Technologies
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    light ? 'text-stone-600' : 'text-white/70'
                  }`}>
                    Figma, Adobe CC, Dovetail, Maze, UserTesting, Hotjar, Storybook, Jira, Confluence, Miro, ChatGPT, Claude, Codex, Cursor, v0, HTML, CSS, Tailwind, React, Git, GitHub
                  </p>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                  light
                    ? 'bg-black/[0.03] border-black/10'
                    : 'bg-white/[0.03] border-white/10'
                }`}>
                  <div className={`text-xs sm:text-sm font-bold ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}>
                    Leadership & Collaboration
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    light ? 'text-stone-600' : 'text-white/70'
                  }`}>
                    Cross-Functional Leadership, Stakeholder Management, Workshop Facilitation, Product Discovery, Executive Communication, Systems Thinking, Design Strategy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
