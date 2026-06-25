'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Home, Globe, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '../../i18n/routing';

const sections = [{ id: 'hero', key: 'hero' }, { id: 'manifesto', key: 'manifesto' }, { id: 'projects', key: 'projects' }, { id: 'contact', key: 'contact' }];

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.05) setIsVisible(true);
    else setIsVisible(false);
  });

  const toggleLanguage = () => {
    const locales = ['es', 'en', 'zh'];
    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className='fixed top-4 right-4 z-[100] flex gap-2'>
      {pathname !== '/' && (
        <Link href="/" className='px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:border-[var(--color-orbital-teal)]/50 rounded-full text-[var(--color-mist-gray)] hover:text-white transition-all text-xs font-space tracking-widest flex items-center gap-2'>
          <Home size={12} className="text-[var(--color-orbital-teal)]" />
          <span className="hidden sm:inline">{t('hero').toUpperCase()}</span>
        </Link>
      )}
      <Link href="/#store" className='px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:border-[var(--color-orbital-teal)]/50 rounded-full text-[var(--color-mist-gray)] hover:text-white transition-all text-xs font-space tracking-widest flex items-center gap-2'>
        <span className="text-[var(--color-orbital-teal)] text-[10px]">🛒</span>
        <span className="hidden sm:inline">STORE</span>
      </Link>
      <Link href="/telemetry" className='px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:border-[var(--color-orbital-teal)]/50 rounded-full text-[var(--color-mist-gray)] hover:text-white transition-all text-xs font-space tracking-widest flex items-center gap-2'>
        <BookOpen size={12} className="text-[var(--color-orbital-teal)]" />
        <span className="hidden sm:inline">TELEMETRY</span>
      </Link>
      <button onClick={toggleLanguage} className='px-3 py-2 bg-black/50 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-full text-white text-xs transition-all font-space tracking-widest flex items-center gap-1'>
        <span className={locale === 'es' ? 'text-[var(--color-orbital-teal)] font-bold' : 'text-[var(--color-mist-gray)]/50'}>ES</span>
        <span className="text-[var(--color-space-border)]">/</span>
        <span className={locale === 'en' ? 'text-[var(--color-orbital-teal)] font-bold' : 'text-[var(--color-mist-gray)]/50'}>EN</span>
        <span className="text-[var(--color-space-border)]">/</span>
        <span className={locale === 'zh' ? 'text-[var(--color-orbital-teal)] font-bold' : 'text-[var(--color-mist-gray)]/50'}>ZH</span>
      </button>
    </nav>
  );
}