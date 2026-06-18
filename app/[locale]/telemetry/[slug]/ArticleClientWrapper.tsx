'use client';
import { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import LeadMagnet from '../../../../components/sections/LeadMagnet';
import { trackArticleView } from '../../../../lib/analytics';

interface Props {
  title: string;
  leadMagnet: boolean;
}

export default function ArticleClientWrapper({ title, leadMagnet }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    trackArticleView(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 'Blog');
  }, [title]);

  return (
    <>
      <div className="mt-16 pt-16 border-t border-[var(--color-space-border)]">
        <h3 className="font-serif text-2xl text-white mb-4">Acelera tu Implementación</h3>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] mb-8 max-w-2xl">
          ¿Necesitas implementar esta arquitectura en tu propia empresa? Puedes contactarme directamente o, si prefieres, descargar el blueprint detallado.
        </p>

        <div className="flex flex-wrap gap-4">
          <a href="/#contact" className="btn-primary py-4 px-6 rounded flex items-center justify-center font-space tracking-widest text-xs font-bold transition-all bg-white/5 border border-white/10 hover:border-white/30 text-white">
            <Calendar size={16} className="mr-2" /> AGENDAR CHARLA
          </a>
          
          {leadMagnet && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary py-4 px-6 rounded flex items-center justify-center gap-3 font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group border border-[var(--color-orbital-teal)]/50"
            >
              <div className="absolute inset-0 bg-[var(--color-orbital-teal)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-black text-[var(--color-orbital-teal)]">
                <Download size={16} />
                <span>DESCARGAR BLUEPRINT</span>
              </span>
            </button>
          )}
        </div>
      </div>

      <LeadMagnet 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={title} 
      />
    </>
  );
}
