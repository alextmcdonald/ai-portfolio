import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, ArrowUpRight, MessageSquare, Mail, Sparkles } from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';

interface ContactSectionProps {
  onCopyEmail: () => void;
  emailCopied: boolean;
  isLightMode?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onCopyEmail,
  emailCopied,
  isLightMode = false
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [focusedField, setFocusedField] = useState<'name' | 'email' | 'message' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    sounds.playTap();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      sounds.playSuccess();
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2 sm:px-0">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Get in touch
          </h2>
        </div>

        {/* Availability Badge */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full self-start md:self-auto ${
          isLightMode
            ? 'bg-emerald-500/10 border border-[#009966]/25'
            : 'bg-emerald-500/10 border border-emerald-500/25'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
          }`} />
          <span className={`text-xs font-mono font-bold ${
            isLightMode ? 'text-[#009966]' : 'text-emerald-400'
          }`}>
            {DESIGNER_INFO.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Column: Direct channels and Socials (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className={`rounded-[28px] p-6 sm:p-7 border shadow-xl space-y-3.5 h-full flex flex-col justify-between ${
            isLightMode
              ? 'bg-black/[0.03] border-black/10'
              : 'bg-white/[0.03] border-white/15'
          }`}>
            {/* Direct Email */}
            <div>
              <div
                className={`flex items-center justify-between gap-2 p-3.5 rounded-2xl border ${
                  isLightMode
                    ? 'bg-[#e5e5e5] border-black/10'
                    : 'bg-black/30 border-white/10'
                }`}
              >
                <span
                  className={`text-sm font-normal font-mono truncate ${
                    isLightMode ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  {DESIGNER_INFO.email}
                </span>
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    onCopyEmail();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                    isLightMode
                      ? 'bg-white hover:bg-stone-50 text-stone-800 border border-black/10 shadow-xs'
                      : 'bg-white/15 hover:bg-white/30 text-white'
                  }`}
                >
                  {emailCopied ? (
                    <>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isLightMode ? 'text-[#009966]' : 'text-emerald-400'}`} />
                      <span className={isLightMode ? 'text-[#009966]' : 'text-emerald-400'}>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Verified External Social Platforms (One line each) */}
            <div className="flex flex-col gap-2">
              {[
                {
                  name: 'Figma',
                  url: DESIGNER_INFO.socials.figma,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4zM4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4zm0-8c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4zm8-4h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0zm0 8h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V8z"/>
                    </svg>
                  )
                },
                {
                  name: 'Dribbble',
                  url: DESIGNER_INFO.socials.dribbble,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.626 0 12-5.373 12-12C23.996 5.374 18.626 0 12 0zm9.73 10.02c-.37-.04-2.8-.29-5.6.86-.06-.15-.12-.3-.19-.46-.38-.87-.8-1.72-1.25-2.54 3.73-1.52 5.25-3.6 5.35-3.74 1.05 1.58 1.66 3.47 1.69 5.88zm-3.08-6.93c-.15.2-1.63 2.15-5.18 3.59-1.39-2.56-2.92-4.75-3.09-4.99 1.15-.43 2.38-.68 3.67-.68 1.76 0 3.39.46 4.6 1.4zm-10.42.31c.17.24 1.69 2.41 3.09 4.96-2.81 1.02-6.14 1.05-6.49 1.05-.03-.46-.05-.93-.05-1.4 0-2.09.76-4 2.03-5.49-.6.28-1.07.6-1.58.88zm-5.97 7.02c.32 0 3.32-.03 6.06-1 .34.78.65 1.57.94 2.37-4.14 2.32-6.73 5.9-6.86 6.09-.59-1.44-.94-3.03-.94-4.7 0-.96.12-1.89.34-2.76zm2.34 9.1c.17-.23 2.53-3.6 6.46-5.87.97 2.47 1.56 5.14 1.68 5.75-1.4.67-2.97 1.05-4.63 1.05-1.28 0-2.5-.26-3.51-.93zm9.84.18c-.14-.65-.7-3.15-1.63-5.52 2.6-.96 4.79-.37 5.06-.29-.46 2.35-1.74 4.38-3.43 5.81z"/>
                    </svg>
                  )
                },
                {
                  name: 'Behance',
                  url: DESIGNER_INFO.socials.behance,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-4.976 3-3.413 0-5.882-2.314-5.882-6.027 0-3.69 2.493-6.073 5.767-6.073 3.447 0 5.485 2.428 5.485 5.83 0 .498-.073.984-.135 1.294h-8.083c.112 1.764 1.487 2.766 3.125 2.766 1.341 0 2.296-.583 2.779-1.554l1.919.764zm-5.074-4.524c-.06-1.343-1.026-2.185-2.28-2.185-1.373 0-2.378.966-2.527 2.185h4.807zM7.228 11.082h-3.48v-3.79h3.48c1.378 0 2.217.653 2.217 1.895 0 1.24-.839 1.895-2.217 1.895zm.352 6.096H3.748v-4.07h3.832c1.553 0 2.495.736 2.495 2.035 0 1.3-.942 2.035-2.495 2.035zM7.886 4.292H0V20h8.319c3.151 0 5.441-1.688 5.441-4.708 0-1.854-.997-3.197-2.593-3.868 1.23-.623 2.094-1.802 2.094-3.449 0-2.827-2.146-3.683-5.375-3.683z"/>
                    </svg>
                  )
                },
                {
                  name: 'GitHub',
                  url: DESIGNER_INFO.socials.github,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  )
                },
                {
                  name: 'LinkedIn',
                  url: DESIGNER_INFO.socials.linkedin,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  )
                },
                {
                  name: 'X / Twitter',
                  url: DESIGNER_INFO.socials.twitter,
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playTap()}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all group ${
                    isLightMode
                      ? 'bg-black/[0.03] hover:bg-black/[0.07] border-black/10 text-stone-800 hover:text-stone-950'
                      : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`${isLightMode ? 'text-stone-600 group-hover:text-stone-900' : 'text-white'} transition-colors shrink-0`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${isLightMode ? 'text-stone-400 group-hover:text-stone-900' : 'text-white'} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border shadow-xl h-full flex flex-col justify-between ${
            isLightMode
              ? 'bg-black/[0.03] border-black/10'
              : 'bg-white/[0.03] border-white/15'
          }`}>
            <div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#0071e3] shrink-0" style={{ color: '#0071e3' }} />
                <h3
                  className={`text-[20px] leading-[28px] font-bold tracking-tight ${
                    isLightMode ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Message me
                </h3>
              </div>

              <p
                className={`text-[16px] leading-relaxed mt-5 mb-5 font-medium ${
                  isLightMode ? 'text-stone-600' : 'text-white/70'
                }`}
              >
                Have a 0-to-1 idea, an ambitious project, or just want to talk shop?{' '}
                <br className="hidden sm:inline" />{' '}
                Drop a note below and I&apos;ll respond within 24-48 hours.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 my-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  Message Dispatched
                </h4>
                <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your note has been securely delivered to Alex. Expect a response shortly.
                </p>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setIsSubmitted(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/15 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {/* Name */}
                    <div
                      className={`relative rounded-2xl border-[1.5px] min-h-[52px] sm:min-h-[54px] flex items-center transition-all duration-200 ${
                        focusedField === 'name'
                          ? isLightMode
                            ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                            : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                          : isLightMode
                            ? 'bg-black/[0.03] border-black/15'
                            : 'bg-black/40 border-white/20'
                      }`}
                    >
                      <label
                        htmlFor="contact-name"
                        className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                          focusedField === 'name' || name.length > 0
                            ? `top-2 translate-y-0 text-[10px] font-semibold tracking-wider uppercase ${
                                focusedField === 'name'
                                  ? isLightMode
                                    ? 'text-[#0071e3]'
                                    : 'text-sky-400'
                                  : isLightMode
                                    ? 'text-stone-500'
                                    : 'text-white/50'
                              }`
                            : `top-1/2 -translate-y-1/2 text-sm sm:text-base font-medium ${
                                isLightMode ? 'text-stone-400' : 'text-white/45'
                              }`
                        }`}
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-5 pt-4 pb-1 sm:pt-4.5 sm:pb-1 rounded-2xl bg-transparent border-0 text-sm font-medium focus:outline-none ${
                          isLightMode ? 'text-stone-900' : 'text-white'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div
                      className={`relative rounded-2xl border-[1.5px] min-h-[52px] sm:min-h-[54px] flex items-center transition-all duration-200 ${
                        focusedField === 'email'
                          ? isLightMode
                            ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                            : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                          : isLightMode
                            ? 'bg-black/[0.03] border-black/15'
                            : 'bg-black/40 border-white/20'
                      }`}
                    >
                      <label
                        htmlFor="contact-email"
                        className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                          focusedField === 'email' || email.length > 0
                            ? `top-2 translate-y-0 text-[10px] font-semibold tracking-wider uppercase ${
                                focusedField === 'email'
                                  ? isLightMode
                                    ? 'text-[#0071e3]'
                                    : 'text-sky-400'
                                  : isLightMode
                                    ? 'text-stone-500'
                                    : 'text-white/50'
                              }`
                            : `top-1/2 -translate-y-1/2 text-sm sm:text-base font-medium ${
                                isLightMode ? 'text-stone-400' : 'text-white/45'
                              }`
                        }`}
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-5 pt-4 pb-1 sm:pt-4.5 sm:pb-1 rounded-2xl bg-transparent border-0 text-sm font-medium focus:outline-none ${
                          isLightMode ? 'text-stone-900' : 'text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div
                    className={`relative rounded-2xl border-[1.5px] transition-all duration-200 ${
                      focusedField === 'message'
                        ? isLightMode
                          ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                          : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                        : isLightMode
                          ? 'bg-black/[0.03] border-black/15'
                          : 'bg-black/40 border-white/20'
                    }`}
                  >
                    <label
                      htmlFor="contact-message"
                      className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left ${
                        focusedField === 'message' || message.length > 0
                          ? `top-2 text-[10px] font-semibold tracking-wider uppercase ${
                              focusedField === 'message'
                                ? isLightMode
                                  ? 'text-[#0071e3]'
                                  : 'text-sky-400'
                                : isLightMode
                                  ? 'text-stone-500'
                                  : 'text-white/50'
                            }`
                          : `top-3 text-sm sm:text-base font-medium ${
                              isLightMode ? 'text-stone-400' : 'text-white/45'
                            }`
                      }`}
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-5 pt-6 pb-2 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none resize-none min-h-[90px] sm:min-h-[96px] ${
                        isLightMode ? 'text-stone-900' : 'text-white'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-98 text-white force-white text-sm font-semibold transition-all shadow-[0_4px_20px_rgba(0,113,227,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
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
          </div>
        </div>
      </div>
    </div>
  );
};
