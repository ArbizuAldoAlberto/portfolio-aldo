'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Tag, Zap } from 'lucide-react';
import { ArticleMeta } from '../../lib/telemetry-loader';

interface ArticleCardProps {
  article: ArticleMeta;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const getPersonaColorClass = (persona: string) => {
    switch (persona) {
      case 'founder': return 'text-[var(--color-orbital-teal)]';
      case 'dev': return 'text-[var(--color-electric-purple)]';
      case 'gentleman': return 'text-[var(--color-amber-gold)]';
      default: return 'text-[var(--color-orbital-teal)]';
    }
  };

  const personaColor = getPersonaColorClass(article.persona);

  return (
    <Link href={`/telemetry/${article.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className={`glass-surface h-full flex flex-col p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-orbital-teal)]/30 group ${
          featured ? 'border-t-4 border-t-[var(--color-orbital-teal)] shadow-[0_0_30px_rgba(0,255,102,0.05)]' : ''
        }`}
      >
        {featured && article.leadMagnet && (
          <div className="flex items-center gap-2 mb-6 text-[10px] uppercase tracking-widest font-space text-[var(--color-orbital-teal)] font-bold">
            <Zap size={14} className="animate-pulse" />
            <span>Lead Magnet · Descarga Gratuita</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <span className="font-space text-xs tracking-widest uppercase text-[var(--color-mist-gray)]/60">
            {article.category}
          </span>
          <span className="font-space text-xs tracking-widest text-[var(--color-mist-gray)]/40">
            {article.date}
          </span>
        </div>

        <h3 className={`font-serif font-bold text-white mb-4 transition-colors group-hover:${personaColor} ${
          featured ? 'text-3xl md:text-5xl' : 'text-2xl'
        }`}>
          {article.title}
        </h3>

        <p className="font-mono text-sm text-[var(--color-mist-gray)] leading-relaxed mb-8 flex-grow">
          {article.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-6 border-t border-[var(--color-space-border)]">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--color-space-border)] text-[var(--color-mist-gray)] flex items-center gap-1">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--color-mist-gray)]">
            <Clock size={12} />
            <span className="text-xl font-bold text-white">{article.readTime}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
