import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, ArrowUpRight, MessageSquare, Mail, Sparkles, X } from 'lucide-react';
import { DESIGNER_INFO } from '../data/portfolioData';
import { sounds } from '../utils/audio';
import { SocialIcon } from './SocialIcons';

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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

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
          message: message.trim()
        })
      });

      if (response.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        sounds.playSuccess();
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to dispatch message');
      }
    } catch {
      // In case of network errors or adblocker restrictions, show error
      setIsSubmitting(false);
      setSubmitError('Unable to send at this moment. Please email hi@alexmcdonald.site directly.');
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex flex-col landscape:flex-row landscape:items-center sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 px-2 sm:px-0">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${
            isLightMode ? 'text-stone-900' : 'text-white'
          }`}>
            Get in touch
          </h2>
        </div>

        {/* Availability Badge */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full self-start landscape:self-auto sm:self-auto md:self-auto shrink-0 ${
          isLightMode
            ? 'bg-emerald-500/10 border border-[#009966]/25'
            : 'bg-emerald-500/10 border border-emerald-500/25'
        }`}>
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
              }`}
              style={{ animationDuration: '2.4s', boxShadow: 'none' }}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLightMode ? 'bg-[#009966]' : 'bg-emerald-400'
              }`}
              style={{ boxShadow: 'none' }}
            />
          </span>
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
          <div className={`rounded-[28px] p-6 sm:p-7 border space-y-3.5 h-full flex flex-col justify-between ${
            isLightMode
              ? 'bg-white/55 border-black/10 shadow-sm'
              : 'bg-white/[0.03] border-white/15 shadow-md'
          }`}>
            {/* Direct Email */}
            <div>
              <div
                className={`flex items-center justify-between gap-2 p-3.5 rounded-2xl border ${
                  isLightMode
                    ? 'bg-white/50 border-black/10'
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
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer border border-transparent shadow-none ${
                    isLightMode
                      ? 'bg-stone-200 hover:bg-stone-300 text-black'
                      : 'bg-white/15 hover:bg-white/25 text-white'
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
                  name: 'LinkedIn',
                  url: DESIGNER_INFO.socials.linkedin,
                  iconUrl: '/assets/icons/linkedin.svg'
                },
                {
                  name: 'Dribbble',
                  url: DESIGNER_INFO.socials.dribbble,
                  iconUrl: '/assets/icons/dribbble.svg'
                },
                {
                  name: 'Behance',
                  url: DESIGNER_INFO.socials.behance,
                  iconUrl: '/assets/icons/behance.svg'
                },
                {
                  name: 'GitHub',
                  url: DESIGNER_INFO.socials.github,
                  iconUrl: '/assets/icons/github.svg'
                },
                {
                  name: 'X / Twitter',
                  url: DESIGNER_INFO.socials.twitter,
                  iconUrl: '/assets/icons/x.svg'
                },
                {
                  name: 'On Design',
                  url: DESIGNER_INFO.socials.ondesign,
                  iconUrl: '/assets/icons/on-design.svg'
                }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playTap()}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all group ${
                    isLightMode
                      ? 'bg-white hover:bg-stone-100 border-black/10 text-stone-800 hover:text-stone-950 shadow-xs'
                      : 'bg-white/12 hover:bg-white/20 border-white/15 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`${isLightMode ? 'text-stone-600 group-hover:text-stone-900' : 'text-white'} transition-colors shrink-0`}>
                      <SocialIcon name={item.name} className="w-3.5 h-3.5 fill-current shrink-0" />
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
          <div className={`rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border h-full flex flex-col justify-between ${
            isLightMode
              ? 'bg-white/55 border-black/10 shadow-sm'
              : 'bg-white/[0.03] border-white/15 shadow-md'
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
                className={`text-[18px] leading-relaxed mt-5 mb-5 font-normal ${
                  isLightMode ? 'text-stone-600' : 'text-white/75'
                }`}
              >
                Have a 0-to-1 idea, ambitious project in mind, or just want to talk shop? Drop a note below and I&apos;ll respond ASAP.
              </p>
            </div>

            {isSubmitted ? (
              <div className="relative p-8 sm:p-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3.5 my-auto">
                {/* Pure X icon without border or background in top right */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setIsSubmitted(false);
                  }}
                  aria-label="Close success message"
                  className={`absolute top-4 right-4 p-1.5 flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer bg-transparent border-0 ${
                    isLightMode
                      ? 'text-stone-400 hover:text-stone-800'
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>

                {/* Check icon: slightly tighter circle with prominent check mark inside */}
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

                <h4
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    isLightMode ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Message sent!
                </h4>

                <p
                  className={`text-base sm:text-[18px] leading-relaxed max-w-lg mx-auto font-normal ${
                    isLightMode ? 'text-stone-700' : 'text-white/85'
                  }`}
                >
                  Thanks for reaching out. Your message has been successfully delivered. Talk soon! ✌️
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 flex-1 flex flex-col justify-between">
                <div className="space-y-3 sm:space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {/* Name */}
                    <div
                      className={`relative rounded-2xl border-[1.5px] min-h-[62px] flex items-center transition-all duration-200 ${
                        focusedField === 'name'
                          ? isLightMode
                            ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                            : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                          : isLightMode
                            ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                            : 'bg-black/40 border-white/20'
                      }`}
                    >
                      <label
                        htmlFor="contact-name"
                        className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                          focusedField === 'name' || name.length > 0
                            ? `top-2.5 translate-y-0 text-[11px] font-semibold tracking-wider uppercase ${
                                focusedField === 'name'
                                  ? isLightMode
                                    ? 'text-[#0071e3]'
                                    : 'text-sky-400'
                                  : isLightMode
                                    ? 'text-stone-500'
                                    : 'text-white/50'
                              }`
                            : `top-1/2 -translate-y-1/2 text-base sm:text-lg font-medium ${
                                isLightMode ? 'text-stone-500' : 'text-white/45'
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
                        style={{ color: isLightMode ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                        className={`w-full px-5 pt-5 pb-1.5 sm:pt-5.5 sm:pb-2 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none ${
                          isLightMode ? 'text-stone-900' : 'text-white'
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div
                      className={`relative rounded-2xl border-[1.5px] min-h-[62px] flex items-center transition-all duration-200 ${
                        focusedField === 'email'
                          ? isLightMode
                            ? 'bg-white border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-sm'
                            : 'bg-black/60 border-white/70 ring-2 ring-white/20 shadow-inner'
                          : isLightMode
                            ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                            : 'bg-black/40 border-white/20'
                      }`}
                    >
                      <label
                        htmlFor="contact-email"
                        className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left leading-none ${
                          focusedField === 'email' || email.length > 0
                            ? `top-2.5 translate-y-0 text-[11px] font-semibold tracking-wider uppercase ${
                                focusedField === 'email'
                                  ? isLightMode
                                    ? 'text-[#0071e3]'
                                    : 'text-sky-400'
                                  : isLightMode
                                    ? 'text-stone-500'
                                    : 'text-white/50'
                              }`
                            : `top-1/2 -translate-y-1/2 text-base sm:text-lg font-medium ${
                                isLightMode ? 'text-stone-500' : 'text-white/45'
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
                        style={{ color: isLightMode ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                        className={`w-full px-5 pt-5 pb-1.5 sm:pt-5.5 sm:pb-2 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none ${
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
                          ? 'bg-white/80 hover:bg-white border-black/10 hover:border-black/20 shadow-xs'
                          : 'bg-black/40 border-white/20'
                    }`}
                  >
                    <label
                      htmlFor="contact-message"
                      className={`absolute left-5 pointer-events-none transition-all duration-200 ease-out origin-left ${
                        focusedField === 'message' || message.length > 0
                          ? `top-2.5 text-[11px] font-semibold tracking-wider uppercase ${
                              focusedField === 'message'
                                ? isLightMode
                                  ? 'text-[#0071e3]'
                                  : 'text-sky-400'
                                : isLightMode
                                  ? 'text-stone-500'
                                  : 'text-white/50'
                            }`
                          : `top-4 text-base sm:text-lg font-medium ${
                              isLightMode ? 'text-stone-500' : 'text-white/45'
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
                      style={{ color: isLightMode ? '#0f172a' : '#ffffff', backgroundColor: 'transparent' }}
                      className={`w-full px-5 pt-7.5 pb-3 rounded-2xl bg-transparent border-0 text-sm sm:text-base font-medium focus:outline-none resize-none min-h-[110px] sm:min-h-[120px] ${
                        isLightMode ? 'text-stone-900' : 'text-white'
                      }`}
                    />
                  </div>
                </div>

                {submitError && (
                  <p className="text-xs text-red-400 text-center font-medium px-2">
                    {submitError}
                  </p>
                )}

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
