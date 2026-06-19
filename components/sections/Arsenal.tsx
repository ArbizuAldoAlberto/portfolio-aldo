'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersona } from '../theme/PersonaContext';
import { Shield, Database, Smartphone, Cpu, Plane, Activity, Layers } from 'lucide-react';

import { useTranslations } from 'next-intl';

export default function Arsenal() {
  const { persona } = usePersona();
  const t = useTranslations('Arsenal');

  const arsenalData = [
    {
      id: 'mobile',
      title: t('cards.mobile.title'),
      icon: Smartphone,
      tech: ['React Native', 'Expo Bare', 'SQLite WAL', 'WatermelonDB'],
      affinity: ['engineer', 'agtech'],
      desc: t('cards.mobile.desc'),
    },
    {
      id: 'cyber',
      title: t('cards.cyber.title'),
      icon: Shield,
      tech: ['OWASP Mobile', 'RLS Supabase', 'Vigenère Cipher', 'JWT/Auth'],
      affinity: ['security'],
      desc: t('cards.cyber.desc'),
    },
    {
      id: 'hardware',
      title: t('cards.hardware.title'),
      icon: Cpu,
      tech: ['Blender 3D', 'Hellbot Magna 2', 'IoT', 'Raspberry'],
      affinity: ['agtech', 'engineer'],
      desc: t('cards.hardware.desc'),
    },
    {
      id: 'drones',
      title: t('cards.drones.title'),
      icon: Plane,
      tech: ['UAV Piloting', 'Mapbox Offline', 'GIS', 'Mesh Networks'],
      affinity: ['agtech', 'security'],
      desc: t('cards.drones.desc'),
    },
    {
      id: 'backend',
      title: t('cards.backend.title'),
      icon: Database,
      tech: ['Node.js', 'PostgreSQL', 'Docker', 'Firebase Claims'],
      affinity: ['engineer', 'security'],
      desc: t('cards.backend.desc'),
    },
    {
      id: 'automation',
      title: t('cards.automation.title'),
      icon: Activity,
      tech: ['n8n', 'Claude API', 'OpenAI', 'Python/Scripts'],
      affinity: ['engineer', 'agtech', 'security'],
      desc: t('cards.automation.desc'),
    }
  ];

  const getPersonaColors = () => {
    switch (persona) {
      case 'engineer': return '#3BEACE';
      case 'security': return '#EF4444';
      case 'agtech': return '#84CC16';
      default: return '#3BEACE';
    }
  }

  const activeColor = getPersonaColors();

  // Sort nodes so that affinity nodes bubble up to the top gracefully
  const sortedArsenal = [...arsenalData].sort((a, b) => {
    const aAff = a.affinity.includes(persona) ? 1 : 0;
    const bAff = b.affinity.includes(persona) ? 1 : 0;
    // If affinities are the same, maintain original alphabetical order by ID to prevent jitter
    if (bAff === aAff) return a.id.localeCompare(b.id);
    return bAff - aAff;
  });

  return (
    <section id="arsenal" className="py-32 bg-[var(--color-space-black)] border-t border-[var(--color-space-border)] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] opacity-[0.03] pointer-events-none mix-blend-screen transition-all duration-1000" style={{ backgroundImage: `radial-gradient(circle at center, ${activeColor} 0%, transparent 70%)` }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <Layers size={16} style={{ color: activeColor }} className="transition-colors duration-500" />
          <span className="font-space uppercase tracking-widest text-xs text-[var(--color-mist-gray)] flex items-center">
            {t('sectionLabel')}
            <motion.span 
              key={persona}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: activeColor }} 
              className="ml-2 font-bold"
            >
              {persona === 'security' ? t('levelAlpha') : persona === 'agtech' ? t('levelTerrain') : t('levelSystem')}
            </motion.span>
          </span>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedArsenal.map((node) => {
              const isAffinity = node.affinity.includes(persona);
              const Icon = node.icon;
              
              return (
                <motion.div
                  layout
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: isAffinity ? 1 : 0.35, 
                    scale: isAffinity ? 1 : 0.96,
                    filter: isAffinity ? 'grayscale(0%)' : 'grayscale(100%)'
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`glass-surface p-8 rounded-xl border relative overflow-hidden group transition-colors duration-500 flex flex-col ${isAffinity ? 'bg-black/60' : 'border-white/5 bg-transparent'}`}
                  style={{ 
                    borderColor: isAffinity ? `${activeColor}40` : 'rgba(255,255,255,0.05)',
                    boxShadow: isAffinity ? `0 0 40px ${activeColor}10` : 'none'
                  }}
                >
                  {/* Hover gradient sweep */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `linear-gradient(45deg, transparent, ${activeColor}10, transparent)` }} />
                  
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-lg border border-[var(--color-space-border)] bg-black/80 text-white group-hover:scale-110 transition-transform duration-300" style={{ color: isAffinity ? activeColor : 'var(--color-mist-gray)' }}>
                      <Icon size={24} />
                    </div>
                    {isAffinity && (
                      <span className="font-space text-[9px] font-bold tracking-widest px-2 py-1 rounded-sm uppercase" style={{ backgroundColor: `${activeColor}20`, color: activeColor }}>
                        {t('primary')}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-gradient transition-all">{node.title}</h3>
                  <p className="font-mono text-xs text-[var(--color-mist-gray)] mb-6 h-12 leading-relaxed">
                    {node.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {node.tech.map((t, idx) => (
                      <span key={idx} className="font-space text-[10px] tracking-wider px-2 py-1 border border-white/10 rounded uppercase text-[var(--color-mist-gray)] group-hover:border-white/30 transition-colors" style={{ color: isAffinity ? '#fff' : '' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
