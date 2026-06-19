'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../ui/GlitchText'
import RevealText from '../ui/RevealText'
import { useSound } from '../theme/SoundManager'
import { Check, Cpu, CreditCard, RefreshCw, ShoppingCart, User, Mail, Send, X } from 'lucide-react'
import { submitLead } from '../../lib/lead-actions'
import { trackUcpCheckout } from '../../lib/analytics'
import { useTranslations } from 'next-intl'

const serviceOptions = [
  { id: 'mobile', title: 'Mobile Apps (Offline-First)', price: 3000, desc: 'Diseño y desarrollo de apps móviles en React Native & Expo que funcionan sin conexión. Ideal para logística, agro o seguridad.' },
  { id: 'saas', title: 'SaaS & Fullstack Architecture', price: 5000, desc: 'Desarrollo web seguro con Next.js y PostgreSQL. Integración híbrida Stripe/Base L2 para pagos.' },
  { id: 'n8n', title: 'Intelligent n8n Workflows', price: 500, desc: 'Automatización comercial con n8n para capturar leads y automatizar tareas repetitivas 24/7.' },
  { id: 'security', title: 'Security Audit & WebGL 3D', price: 1500, desc: 'Auditoría bajo normas OWASP MASVS y modelado 3D interactivo en React Three Fiber.' }
]

export default function Services() {
  const t = useTranslations('Services')
  const { playTick, playClick, playSuccess } = useSound()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'linking' | 'processing' | 'done'>('idle')
  const [showLeadModal, setShowLeadModal] = useState(false)

  // Modal form states
  const [loading, setLoading] = useState(false)
  const [leadStatus, setLeadStatus] = useState<{ success: boolean; message: string } | null>(null)

  const toggleService = (id: string) => {
    playTick()
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const total = selectedServices.reduce((sum, id) => {
    const option = serviceOptions.find(o => o.id === id)
    return sum + (option ? option.price : 0)
  }, 0)

  const handleCheckout = async () => {
    if (selectedServices.length === 0) return
    playClick()
    setCheckoutStep('linking')
    
    await new Promise(r => setTimeout(r, 1200))
    setCheckoutStep('processing')
    
    await new Promise(r => setTimeout(r, 1500))
    playSuccess()
    setCheckoutStep('done')
    
    // Telemetry tracking
    const selectedNames = selectedServices.map(id => serviceOptions.find(o => o.id === id)?.title).filter(Boolean) as string[];
    trackUcpCheckout(total, selectedNames);

    // Instead of scrolling to contact, show lead capture modal
    setTimeout(() => {
      setCheckoutStep('idle')
      setShowLeadModal(true)
    }, 1200)
  }

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setLeadStatus(null)
    
    const formData = new FormData(e.currentTarget)
    // Inject custom data
    formData.append('source', 'ucp_checkout')
    formData.append('services', selectedServices.map(id => serviceOptions.find(o => o.id === id)?.title).join(', '))
    formData.append('total', total.toString())

    const result = await submitLead(null, formData)
    setLeadStatus(result)
    setLoading(false)

    if (result.success) {
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowLeadModal(false)
        setLeadStatus(null)
        setSelectedServices([]) // Reset selection
      }, 3000)
    }
  }

  return (
    <section id="services" className="relative py-32 bg-[var(--color-deep-space)]/30 border-t border-[var(--color-space-border)]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none">
          {t('sectionLabel')}
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-16">
          <GlitchText delay={0.1} text={t('title')} />
        </h2>

        {/* BENTO SELECTORS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {serviceOptions.map((svc) => {
            const isSelected = selectedServices.includes(svc.id)
            return (
              <div
                key={svc.id}
                onClick={() => toggleService(svc.id)}
                className={`glass-surface p-8 group transition-all duration-300 relative overflow-hidden cursor-pointer select-none border-t-2 ${
                  isSelected 
                    ? 'border-t-[var(--color-orbital-teal)] border-r-[var(--color-orbital-teal)]/30 border-b-[var(--color-orbital-teal)]/30 border-l-[var(--color-orbital-teal)]/30 bg-[var(--color-deep-space)]' 
                    : 'border-t-[var(--color-space-border)] hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-space text-xs tracking-wider opacity-60">
                    USD {svc.price}
                  </span>
                  
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-[var(--color-orbital-teal)] border-[var(--color-orbital-teal)] text-black' 
                      : 'border-[var(--color-space-border)]'
                  }`}>
                    {isSelected && <Check size={12} className="stroke-[3]" />}
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-white mb-4 transition-colors group-hover:text-[var(--color-orbital-teal)]">{t(`options.${svc.id}.title`)}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed h-16">{t(`options.${svc.id}.desc`)}</p>
              </div>
            )
          })}
        </div>

        {/* ESTIMATOR PANEL & UCP CHECKOUT */}
        <div className="glass-surface p-8 rounded-xl max-w-4xl mx-auto border-l-4 border-l-[var(--color-amber-gold)] mb-20 relative overflow-hidden bg-black/40">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
            <Cpu size={180} />
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            
            {/* Total Display */}
            <div className="md:col-span-7 space-y-4">
              <span className="font-space text-[10px] text-[var(--color-amber-gold)] uppercase tracking-wider font-bold block">
                {t('budget.title')}
              </span>
              
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl md:text-5xl font-bold text-white transition-all">
                  USD {total.toLocaleString()}
                </span>
                <span className="font-space text-xs text-[var(--color-mist-gray)]/50">{t('budget.base')}</span>
              </div>

              <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                {t('budget.desc')}
              </p>
            </div>

            {/* Simulated Checkout Button & Flow */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                
                {/* IDLE */}
                {checkoutStep === 'idle' && (
                  <motion.button
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={handleCheckout}
                    disabled={selectedServices.length === 0}
                    className="w-full btn-primary py-4 px-6 rounded-lg flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-space tracking-widest font-bold border border-green-500/20"
                    style={{ boxShadow: selectedServices.length > 0 ? '0 0 20px rgba(0, 255, 102, 0.2)' : 'none' }}
                  >
                    <ShoppingCart size={14} className="text-black" />
                    <span>{t('budget.btnIdle')}</span>
                  </motion.button>
                )}

                {/* LINKING */}
                {checkoutStep === 'linking' && (
                  <motion.div
                    key="linking"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-[var(--color-space-border)] bg-black/80 rounded-lg flex flex-col items-center justify-center gap-3 font-mono text-[10px]"
                  >
                    <RefreshCw size={20} className="text-[var(--color-amber-gold)] animate-spin" />
                    <span className="text-[var(--color-amber-gold)] font-bold tracking-widest uppercase">{t('budget.btnLinking')}</span>
                  </motion.div>
                )}

                {/* PROCESSING */}
                {checkoutStep === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-green-500/20 bg-green-950/20 rounded-lg flex flex-col items-center justify-center gap-3 font-mono text-[10px]"
                  >
                    <CreditCard size={20} className="text-green-400 animate-pulse" />
                    <span className="text-green-400 font-bold tracking-widest uppercase">{t('budget.btnProcessing')}</span>
                  </motion.div>
                )}

                {/* DONE */}
                {checkoutStep === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-green-500 bg-green-500 text-black rounded-lg flex flex-col items-center justify-center gap-2 font-mono text-[10px]"
                  >
                    <span className="font-bold tracking-widest uppercase text-xs">{t('budget.btnDone')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* PROCESO */}
        <div className="border-t border-[var(--color-space-border)] pt-16">
          <div className="flex flex-wrap justify-between items-center gap-4 text-center md:text-left">
            {[
              { s: t('process.step1'), d: t('process.step1Desc') },
              { s: t('process.step2'), d: t('process.step2Desc') },
              { s: t('process.step3'), d: t('process.step3Desc') },
              { s: t('process.step4'), d: t('process.step4Desc') },
              { s: t('process.step5'), d: t('process.step5Desc') }
            ].map((step, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <div className="font-space text-white text-sm mb-2 font-bold">{step.s}</div>
                <div className="font-mono text-[var(--color-mist-gray)] text-xs">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {showLeadModal && (
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
              className="glass-surface w-full max-w-md p-8 border-t-4 border-t-[var(--color-orbital-teal)] relative"
            >
              <button 
                onClick={() => setShowLeadModal(false)}
                className="absolute top-4 right-4 text-[var(--color-mist-gray)] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <Check className="mx-auto text-[var(--color-orbital-teal)] mb-4" size={40} />
                <h3 className="font-serif text-2xl text-white mb-2">{t('modal.title')}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)]">
                  {t('modal.desc')} USD {total.toLocaleString()}.
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" />
                
                <div className="space-y-2 group">
                  <label htmlFor="modal-name" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                    <User size={12} />
                    {t('modal.nameLabel')} <span className="text-[var(--color-orbital-teal)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-name"
                    name="name"
                    required
                    disabled={loading}
                    className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all"
                  />
                </div>

                <div className="space-y-2 group">
                  <label htmlFor="modal-email" className="flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] group-focus-within:text-[var(--color-orbital-teal)] transition-colors">
                    <Mail size={12} />
                    {t('modal.emailLabel')} <span className="text-[var(--color-orbital-teal)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    required
                    disabled={loading}
                    className="w-full bg-black/50 border border-[var(--color-space-border)] rounded-md px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[var(--color-orbital-teal)] focus:ring-1 focus:ring-[var(--color-orbital-teal)] transition-all"
                  />
                </div>

                {leadStatus && (
                  <div className={`p-3 rounded border text-xs font-mono text-center ${leadStatus.success ? 'bg-green-950/20 border-green-500/20 text-green-400' : 'bg-red-950/20 border-red-500/20 text-red-400'}`}>
                    {leadStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded flex justify-center items-center gap-2 font-space tracking-widest text-xs font-bold transition-all relative overflow-hidden group mt-4"
                >
                  <div className="absolute inset-0 bg-[var(--color-orbital-teal)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-black">
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                    <span>{t('modal.btn')}</span>
                  </span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
