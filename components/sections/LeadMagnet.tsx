'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Download, Mail, RefreshCw, User, X, Building, Zap } from 'lucide-react';
import { submitLead } from '../../lib/lead-actions';
import { trackLeadMagnetDownload } from '../../lib/analytics';

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function LeadMagnet({ isOpen, onClose, title = "Blueprint Técnico" }: LeadMagnetProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('source', 'lead_magnet');
    formData.append('services', `Descarga de: ${title}`);
    
    const result = await submitLead(null, formData);
    setStatus(result);
    setLoading(false);

    if (result.success) {
      trackLeadMagnetDownload(title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      setDownloadReady(true);
    }
  };

  const handleDownload = () => {
    // URL proveniente de env variables o estático
    const url = process.env.NEXT_PUBLIC_LEAD_MAGNET_URL || '/downloads/sqlite-wal-blueprint.pdf';
    window.open(url, '_blank');
    
    // Auto close after download
    setTimeout(() => {
      onClose();
      // Reset state for future openings
      setTimeout(() => {
        setDownloadReady(false);
        setStatus(null);
      }, 500);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="glass-surface w-full max-w-md p-8 border-l-4 border-l-[var(--color-orbital-teal)] relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-[var(--color-mist-gray)] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {!downloadReady ? (
              <>
                <div className="text-center mb-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[var(--color-orbital-teal)]/20 flex items-center justify-center mb-4 border border-[var(--color-orbital-teal)]/50">
                    <Download className="text-[var(--color-orbital-teal)]" size={20} />
                  </div>
                  <h3 className="font-serif text-2xl text-white mb-2">Acceso al Blueprint</h3>
                  <p className="font-mono text-xs text-[var(--color-mist-gray)]">
                    Ingresa tus credenciales corporativas para desbloquear el acceso a <strong>{title}</strong>.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
                  
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                      <User size={12} />
                      Nombre <span className="text-[var(--color-orbital-teal)]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={loading}
                      className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                      <Mail size={12} />
                      Email Corporativo <span className="text-[var(--color-orbital-teal)]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={loading}
                      className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2 group">
                    <label className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                      <Building size={12} />
                      Empresa (Opcional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      disabled={loading}
                      className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all"
                    />
                  </div>

                  {status && (
                    <div className={`p-3 rounded border text-xs font-mono text-center ${status.success ? 'bg-green-950/20 border-green-500/20 text-green-400' : 'bg-red-950/20 border-red-500/20 text-red-400'}`}>
                      {status.message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3 rounded flex justify-center items-center gap-2 font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group mt-6"
                  >
                    <div className="absolute inset-0 bg-[var(--color-orbital-teal)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center gap-2 group-hover:text-black">
                      {loading ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                      <span>DESBLOQUEAR BLUEPRINT</span>
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 border border-green-500/50">
                  <Check className="text-green-500" size={32} />
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">¡Acceso Concedido!</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] mb-8">
                  El sistema ha verificado tus credenciales. Puedes descargar el documento técnico ahora.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full py-4 rounded bg-[var(--color-orbital-teal)] text-black flex justify-center items-center gap-2 font-space tracking-widest text-xs font-bold hover:brightness-110 transition-all"
                >
                  <Download size={16} />
                  <span>DESCARGAR AHORA</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
