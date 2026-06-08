'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Home, Globe } from 'lucide-react';
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
    const nextLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className='fixed top-4 right-4 z-[100] flex gap-2'>
      <button onClick={toggleLanguage} className='p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white text-xs'>
        {locale.toUpperCase()}
      </button>
    </nav>
  );
}