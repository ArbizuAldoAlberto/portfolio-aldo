'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Terminal, Building, User, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, MessageSquare, Calendar } from 'lucide-react';
import { usePersona } from '../theme/PersonaContext';
import { useTranslations, useLocale } from 'next-intl';
import { submitLead } from '../../lib/lead-actions';
import { trackEvent } from '../../lib/analytics';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const { persona } = usePersona();
  const t = useTranslations('Contact');
  const locale = useLocale();

  const getPersonaContent = () => {
    switch (persona) {
      case 'engineer':
        return {
          title: t('personas.engineer.title'),
          desc: t('personas.engineer.desc'),
          bullets: [
            t('personas.engineer.bullets.0'),
            t('personas.engineer.bullets.1'),
            t('personas.engineer.bullets.2')
          ],
          btnText: t('personas.engineer.btnText'),
          btnSub: t('personas.engineer.btnSub'),
          labelMessage: t('personas.engineer.labelMessage'),
          placeMessage: t('personas.engineer.placeMessage')
        }
      case 'agtech':
        return {
          title: t('personas.agtech.title'),
          desc: t('personas.agtech.desc'),
          bullets: [
            t('personas.agtech.bullets.0'),
            t('personas.agtech.bullets.1'),
            t('personas.agtech.bullets.2')
          ],
          btnText: t('personas.agtech.btnText'),
          btnSub: t('personas.agtech.btnSub'),
          labelMessage: t('personas.agtech.labelMessage'),
          placeMessage: t('personas.agtech.placeMessage')
        }
      case 'security':
      default:
        return {
          title: t('personas.security.title'),
          desc: t('personas.security.desc'),
          bullets: [
            t('personas.security.bullets.0'),
            t('personas.security.bullets.1'),
            t('personas.security.bullets.2')
          ],
          btnText: t('personas.security.btnText'),
          btnSub: t('personas.security.btnSub'),
          labelMessage: t('personas.security.labelMessage'),
          placeMessage: t('personas.security.placeMessage')
        }
    }
  }

  const content = getPersonaContent();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(null, formData);
    setStatus(result);
    setLoading(false);
    if (result.success) {
      trackEvent('contact_form_submit', { 
        has_company: !!formData.get('company')
      });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section id='contact' className='py-32 bg-[var(--color-space-black)] border-t border-[var(--color-space-border)] relative overflow-hidden'>
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-orbital-teal)]/5 blur-[150px] pointer-events-none rounded-full transform translate-x-1/2" />


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Terminal size={14} className="text-[var(--color-orbital-teal)]" />
          <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm block">
            {t('sectionLabel')}
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-16">
          {content.title}
        </h2>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Copy & Direct Contact */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-12">
            <div className="space-y-6">
              <p className="font-mono text-sm text-[var(--color-mist-gray)] leading-relaxed">
                {content.desc}
              </p>
              
              <ul className="space-y-4 font-mono text-xs text-[var(--color-mist-gray)]">
                {content.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-[var(--color-orbital-teal)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-surface p-6 border-l-4 border-l-[var(--color-electric-purple)] hover:border-l-[var(--color-orbital-teal)] transition-colors">
              <span className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/50 block mb-2">{t('directContact')}</span>
              <a href="mailto:aldo@arbizulabs.com" className="font-mono text-white hover:text-[var(--color-orbital-teal)] transition-colors flex items-center gap-2 group">
                <Mail size={16} />
                <span>aldo@arbizulabs.com</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7 glass-surface p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
              <MessageSquare size={120} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              {/* Honeypot anti-spam */}
              <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label htmlFor="name" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                    <User size={12} />
                    {t('form.name')} <span className="text-[var(--color-orbital-teal)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    disabled={loading}
                    className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2 group">
                  <label htmlFor="email" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                    <Mail size={12} />
                    {t('form.email')} <span className="text-[var(--color-orbital-teal)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={loading}
                    className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all disabled:opacity-50"
                    placeholder={locale === 'es' ? "john@empresa.com" : "john@company.com"}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="company" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                  <Building size={12} />
                  {t('form.company')}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  disabled={loading}
                  className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all disabled:opacity-50"
                  placeholder="Arbizu Labs, LLC"
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="message" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                  <Terminal size={12} />
                  {content.labelMessage} <span className="text-[var(--color-orbital-teal)]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  disabled={loading}
                  className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all resize-none disabled:opacity-50"
                  placeholder={content.placeMessage}
                ></textarea>
              </div>

              <AnimatePresence mode="wait">
                {status && (
                  <motion.div
                    key="status-msg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-md border flex items-start gap-3 font-mono text-xs ${
                      status.success 
                        ? 'bg-green-950/20 border-green-500/20 text-green-400' 
                        : 'bg-red-950/20 border-red-500/20 text-red-400'
                    }`}
                  >
                    {status.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 px-6 rounded-md flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[var(--color-orbital-teal)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors">
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>{content.btnSub}</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{content.btnText}</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Separador Calendly / Cal.com */}
            <div className="relative z-10 mt-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-space-border)] to-transparent" />
                <span className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/50">{t('form.orPhone')}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-space-border)] to-transparent" />
              </div>
              <a 
                href="https://cal.com/aldo-arbizu" 
                target="_blank" 
                rel="noreferrer"
                className="w-full btn-outline py-4 px-6 rounded-md flex items-center justify-center gap-3 font-space tracking-widest text-xs font-bold transition-all border border-[var(--color-space-border)] hover:border-[var(--color-orbital-teal)] hover:bg-[var(--color-orbital-teal)]/5 text-[var(--color-mist-gray)] hover:text-white group"
              >
                <Calendar size={16} className="text-[var(--color-orbital-teal)] group-hover:scale-110 transition-transform" />
                <span>{t('form.callBtn')}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}