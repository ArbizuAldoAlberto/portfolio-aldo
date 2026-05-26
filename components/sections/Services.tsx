'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../ui/GlitchText'
import { useSound } from '../theme/SoundManager'
import { Check, Cpu, CreditCard, RefreshCw, ShoppingCart } from 'lucide-react'

const serviceOptions = [
  { id: 'mobile', title: 'Mobile Apps (Offline-First)', price: 3000, desc: 'React Native & Expo. Sincronización robusta local SQLite/Firebase.' },
  { id: 'saas', title: 'SaaS & Fullstack Architecture', price: 5000, desc: 'Arquitecturas Next.js multi-tenant escalables, Supabase y PostgreSQL.' },
  { id: 'n8n', title: 'n8n Automation Workflows', price: 500, desc: 'Automatización de CRM de leads, bots de comunicación e integraciones IA.' },
  { id: 'security', title: 'Security Audit & 3D Hardware', price: 1500, desc: 'Auditoría OWASP Mobile, contratos inteligentes y prototipado 3D.' }
]

export default function Services() {
  const { playTick, playClick, playSuccess } = useSound()
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'linking' | 'processing' | 'done'>('idle')

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
    
    // Create pre-filled message
    const selectedNames = selectedServices.map(id => serviceOptions.find(o => o.id === id)?.title).join(', ')
    const leadMessage = `Hola Aldo, acabo de cotizar un proyecto en tu estimador interactivo. Seleccioné: ${selectedNames} por un valor estimado de USD ${total}. Me interesa avanzar en una cotización oficial de desarrollo.`
    
    sessionStorage.setItem('prefilled_lead', leadMessage)
    
    // Dispatch custom event to notify contact form
    const event = new CustomEvent('ucp-checkout-success', { detail: leadMessage })
    window.dispatchEvent(event)

    setTimeout(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
      setCheckoutStep('idle')
    }, 1200)
  }

  return (
    <section id="services" className="relative py-32 bg-[var(--color-deep-space)]/30 border-t border-[var(--color-space-border)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        03
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block select-none">
          Servicios
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-16">
          <GlitchText text="Misiones & Presupuestos" />
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

                <h3 className="font-serif text-2xl text-white mb-4 transition-colors group-hover:text-[var(--color-orbital-teal)]">{svc.title}</h3>
                <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed h-16">{svc.desc}</p>
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
                Presupuesto de Misión Estimado
              </span>
              
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl md:text-5xl font-bold text-white transition-all">
                  USD {total.toLocaleString()}
                </span>
                <span className="font-space text-xs text-[var(--color-mist-gray)]/50">Base cotizada</span>
              </div>

              <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed">
                Selecciona uno o más módulos de desarrollo arriba. Simula la pasarela de pago para transferir la telemetría del presupuesto directamente al formulario de contacto.
              </p>
            </div>

            {/* Simulated Checkout Button & Flow */}
            <div className="md:col-span-5 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                
                {/* IDLE: Checkout Button */}
                {checkoutStep === 'idle' && (
                  <motion.button
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={handleCheckout}
                    disabled={selectedServices.length === 0}
                    className="w-full btn-primary py-4 px-6 rounded-lg flex items-center justify-center gap-3 cursor-none disabled:opacity-40 disabled:cursor-not-allowed text-xs font-space tracking-widest font-bold border border-green-500/20"
                    style={{
                      boxShadow: selectedServices.length > 0 ? '0 0 20px rgba(0, 255, 102, 0.2)' : 'none'
                    }}
                  >
                    <ShoppingCart size={14} className="text-black" />
                    <span>GOOGLE UCP CHECKOUT</span>
                  </motion.button>
                )}

                {/* LINKING: Cryptographic Handshake */}
                {checkoutStep === 'linking' && (
                  <motion.div
                    key="linking"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-[var(--color-space-border)] bg-black/80 rounded-lg flex flex-col items-center justify-center gap-3 font-mono text-[10px]"
                  >
                    <RefreshCw size={20} className="text-[var(--color-amber-gold)] animate-spin" />
                    <span className="text-[var(--color-amber-gold)] font-bold tracking-widest uppercase">ENLAZANDO WALLET CRYPTO...</span>
                    <span className="text-[var(--color-mist-gray)]/60">Resolviendo claims UCP del nodo</span>
                  </motion.div>
                )}

                {/* PROCESSING: Transaction confirmation */}
                {checkoutStep === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-green-500/20 bg-green-950/20 rounded-lg flex flex-col items-center justify-center gap-3 font-mono text-[10px]"
                  >
                    <CreditCard size={20} className="text-green-400 animate-pulse" />
                    <span className="text-green-400 font-bold tracking-widest uppercase">PROCESANDO PAGO UCP...</span>
                    <span className="text-[var(--color-mist-gray)]/60">Generando hash de transacción</span>
                  </motion.div>
                )}

                {/* DONE: Complete */}
                {checkoutStep === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full p-4 border border-green-500 bg-green-500 text-black rounded-lg flex flex-col items-center justify-center gap-2 font-mono text-[10px]"
                  >
                    <span className="font-bold tracking-widest uppercase text-xs">PAGO PROCESADO OK!</span>
                    <span>Transfiriendo datos de lead...</span>
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
              { s: '01 Brief', d: 'Respuesta en 48h' },
              { s: '02 Propuesta', d: 'Esquema en 72h' },
              { s: '03 Dev Sprint', d: 'Entregables bi-semanales' },
              { s: '04 Deploy', d: 'Expo EAS / Vercel Edge' },
              { s: '05 Soporte', d: 'Mantenimiento continuo' }
            ].map((step, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <div className="font-space text-white text-sm mb-2 font-bold">{step.s}</div>
                <div className="font-mono text-[var(--color-mist-gray)] text-xs">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
