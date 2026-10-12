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

  const resumePdfPath = '/assets/icons/Alex%20McDonald%20Product%20Designer%20Resume.pdf';

  const handleDownloadResume = () => {
    sounds.playSuccess();
    const link = document.createElement('a');
    link.href = resumePdfPath;
    link.download = 'Alex McDonald Product Designer Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Scrim */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className={`fixed inset-0 backdrop-blur-xl ${
            light ? 'bg-black/50' : 'bg-black/80'
          }`}
        />

        {/* Modal Window Container (No border or shadow on the PDF viewer container per user request) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={`relative w-full max-w-5xl h-[92vh] sm:h-[90vh] rounded-[24px] sm:rounded-[32px] flex flex-col overflow-hidden z-10 my-auto backdrop-blur-2xl transition-colors duration-200 border-0 shadow-none ${
            light
              ? 'bg-white text-stone-900'
              : 'bg-stone-950 text-white'
          }`}
          style={{ border: 'none', boxShadow: 'none' }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-0 border-b-transparent shrink-0 ${
            light ? 'bg-stone-50 text-stone-950' : 'bg-stone-900 text-white'
          }`}>
            <div>
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                light ? 'text-stone-950' : 'text-white'
              }`}>
                Alex McDonald&apos;s Resume
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadResume}
                className="h-9 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white force-white flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-none border-0 cursor-pointer"
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

          {/* PDF Viewer Body (No border, no shadow) */}
          <div className="flex-1 w-full h-full overflow-hidden p-0 m-0 border-0 shadow-none bg-stone-100 dark:bg-stone-900">
            <iframe
              src={`${resumePdfPath}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              title="Alex McDonald Product Designer Resume"
              className="w-full h-full border-0 outline-none shadow-none"
              style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
