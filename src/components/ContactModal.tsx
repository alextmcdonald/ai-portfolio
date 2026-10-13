import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, Copy, MessageSquare } from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyEmail: () => void;
  emailCopied: boolean;
  isLightMode?: boolean;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onCopyEmail,
  emailCopied,
  isLightMode = false
}) => {
  const light = isLightMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('light-mode'));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'note' | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !note.trim()) return;

    sounds.playTap();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://formspree.io/f/mbgdawzg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: note.trim()
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        setSent(true);
        sounds.playSuccess();
        setName('');
        setEmail('');
        setNote('');
      } else {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to send message');
      }
    } catch {
      setIsSubmitting(false);
      setSubmitError('Unable to send right now. Please email me@alextmcdonald.com directly.');
    }
  };

  return typeof document !== 'undefined'
    ? createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain">
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
              className={`fixed inset-0 backdrop-blur-2xl overscroll-none touch-none ${
                light ? 'bg-black/75' : 'bg-black/85'
              }`}
            />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={`relative w-full max-w-lg rounded-[32px] border shadow-2xl overflow-hidden z-10 my-auto p-6 sm:p-8 backdrop-blur-2xl transition-colors duration-200 ${
            light
              ? 'bg-white/95 text-stone-900 border-black/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)]'
              : 'glass-thick bg-stone-950/90 text-white border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#0071e3] shrink-0" />
              <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                light ? 'text-stone-950' : 'text-white'
              }`}>
                Message me
              </h2>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              aria-label="Close message window"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 border cursor-pointer ${
                light
                  ? 'bg-white/95 hover:bg-white text-stone-800 hover:text-stone-950 border-black/10 shadow-xs'
                  : 'bg-white/12 hover:bg-white/20 text-white border-white/15'
              }`}
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {sent ? (
            <div className="py-8 text-center space-y-3.5">
              <div className="flex items-center justify-center mx-auto text-emerald-500">
                <svg
                  className="w-14 h-14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="8.75" />
                  <polyline points="8.5 12 11 14.5 15.5 9.5" />
                </svg>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${light ? 'text-stone-900' : 'text-white'}`}>
                Message sent!
              </h3>
              <p className={`text-base sm:text-[18px] leading-relaxed max-w-md mx-auto font-normal ${light ? 'text-stone-700' : 'text-white/85'}`}>
                Thanks for reaching out. Your message has been successfully delivered. Talk soon! ✌️
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Intro message */}
              <p
                className={`text-[18px] leading-relaxed -mt-2 mb-2 pb-[10px] font-normal ${
                  light ? 'text-stone-600' : 'text-white/75'
                }`}
              >
                Have a 0-to-1 idea, an ambitious project, or just want to talk shop? Drop a note below and I&apos;ll respond within 24-48 hours.
              </p>

              {/* Name */}
              <div
                className={`relative rounded-2xl border-[1.5px] min-h-[62px] flex items-center transition-all duration-200 ${
                  focusedField === 'name'
                    ? light
                      ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                      : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                    : light
                      ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                      : 'bg-black/40 border-white/20'
                }`}
              >
                <label
                  htmlFor="modal-name"
                  className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                    focusedField === 'name' || name.length > 0
                      ? 'top-2.5 translate-y-0 text-[11px] font-semibold tracking-wider uppercase ' + (
                          focusedField === 'name'
                            ? (light ? 'text-[#0071e3]' : 'text-sky-400')
                            : (light ? 'text-stone-500' : 'text-white/50')
                        )
                      : 'top-1/2 -translate-y-1/2 text-base sm:text-lg font-medium ' + (light ? 'text-stone-500' : 'text-white/45')
                  }`}
                >
                  Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={{ color: light ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                  className={`w-full px-5 pt-5 pb-1.5 sm:pt-5.5 sm:pb-2 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}
                />
              </div>

              {/* Email */}
              <div
                className={`relative rounded-2xl border-[1.5px] min-h-[62px] flex items-center transition-all duration-200 ${
                  focusedField === 'email'
                    ? light
                      ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                      : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                    : light
                      ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                      : 'bg-black/40 border-white/20'
                }`}
              >
                <label
                  htmlFor="modal-email"
                  className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                    focusedField === 'email' || email.length > 0
                      ? 'top-2.5 translate-y-0 text-[11px] font-semibold tracking-wider uppercase ' + (
                          focusedField === 'email'
                            ? (light ? 'text-[#0071e3]' : 'text-sky-400')
                            : (light ? 'text-stone-500' : 'text-white/50')
                        )
                      : 'top-1/2 -translate-y-1/2 text-base sm:text-lg font-medium ' + (light ? 'text-stone-500' : 'text-white/45')
                  }`}
                >
                  Email
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={{ color: light ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                  className={`w-full px-5 pt-5 pb-1.5 sm:pt-5.5 sm:pb-2 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}
                />
              </div>

              {/* Message */}
              <div
                className={`relative rounded-2xl border-[1.5px] transition-all duration-200 ${
                  focusedField === 'note'
                    ? light
                      ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                      : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                    : light
                      ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                      : 'bg-black/40 border-white/20'
                }`}
              >
                <label
                  htmlFor="modal-note"
                  className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left ${
                    focusedField === 'note' || note.length > 0
                      ? 'top-2.5 text-[11px] font-semibold tracking-wider uppercase ' + (
                          focusedField === 'note'
                            ? (light ? 'text-[#0071e3]' : 'text-sky-400')
                            : (light ? 'text-stone-500' : 'text-white/50')
                        )
                      : 'top-4 text-base sm:text-lg font-medium ' + (light ? 'text-stone-500' : 'text-white/45')
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="modal-note"
                  required
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onFocus={() => setFocusedField('note')}
                  onBlur={() => setFocusedField(null)}
                  style={{ color: light ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                  className={`w-full px-5 pt-7.5 pb-3 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none resize-none min-h-[135px] ${
                    light ? 'text-stone-900' : 'text-white'
                  }`}
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-400 text-center font-medium px-2">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white force-white text-sm font-semibold active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 shadow-[0_4px_20px_rgba(0,113,227,0.3)] cursor-pointer disabled:opacity-50"
                style={{ color: '#ffffff' }}
              >
                {isSubmitting ? (
                  <span style={{ color: '#ffffff' }}>Sending message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" style={{ color: '#ffffff' }} />
                    <span style={{ color: '#ffffff' }}>Send message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  )
: null;
};
