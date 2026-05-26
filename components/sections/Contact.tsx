'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { sendEmail } from '../../app/actions/sendEmail'

// Animated counter hook
function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return count
}

function StatCard({ value, suffix, label }: { value: number, suffix: string, label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCounter(value, isInView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="font-serif text-4xl md:text-5xl text-white font-bold mb-2 stat-number group-hover:text-gradient transition-all">
        {count}{suffix}
      </div>
      <div className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/60">{label}</div>
    </motion.div>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleUcpSuccess = (e: any) => {
      setMessage(e.detail)
    }
    window.addEventListener('ucp-checkout-success', handleUcpSuccess)
    
    // Load prefilled lead if present on mount
    const saved = sessionStorage.getItem('prefilled_lead')
    if (saved) {
      setMessage(saved)
      sessionStorage.removeItem('prefilled_lead')
    }
    
    return () => window.removeEventListener('ucp-checkout-success', handleUcpSuccess)
  }, [])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end']
  })

  const footerY = useTransform(scrollYProgress, [0.7, 1], [40, 0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      setStatus('error')
      setErrorMsg('Por favor completa todos los campos.')
      return
    }

    setStatus('loading')
    try {
      const response = await sendEmail({ name, email, message })
      if (response.success) {
        setStatus('success')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
        setErrorMsg(response.error || 'Ocurrió un error inesperado.')
      }
    } catch (err: any) {
      setStatus('error')
      setErrorMsg('Error de red. Intenta nuevamente.')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="relative py-32 border-t border-[var(--color-space-border)]">
      
      {/* Stats Band */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-[var(--color-space-border)]">
          <StatCard value={5} suffix="+" label="Proyectos SaaS" />
          <StatCard value={6} suffix="+" label="Años de código" />
          <StatCard value={3} suffix="" label="Apps en producción" />
          <StatCard value={24} suffix="h" label="Tiempo de respuesta" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="flex h-3 w-3 rounded-full bg-green-500 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="font-space text-sm text-[var(--color-mist-gray)]">Disponible para proyectos</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-serif font-bold text-white mb-6"
        >
          Construyamos algo que importe.
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono text-[var(--color-mist-gray)] mb-12"
        >
          Respondo en menos de 24 horas.<br/>
          Zona horaria: Argentina (UTC-3)
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20 font-space text-sm"
        >
          <a href="mailto:arbizualdoalberto@gmail.com" className="hover:text-[var(--color-orbital-teal)] transition-colors group flex items-center gap-2">
            <span className="group-hover:scale-110 transition-transform">📧</span> arbizualdoalberto@gmail.com
          </a>
          <a href="https://linkedin.com/in/aldo-alberto-arbizu" target="_blank" rel="noreferrer" className="hover:text-[var(--color-orbital-teal)] transition-colors group flex items-center gap-2">
            <span className="group-hover:scale-110 transition-transform">💼</span> LinkedIn
          </a>
          <a href="https://github.com/ArbizuAldoAlberto" target="_blank" rel="noreferrer" className="hover:text-[var(--color-orbital-teal)] transition-colors group flex items-center gap-2">
            <span className="group-hover:scale-110 transition-transform">🐙</span> GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-surface max-w-lg mx-auto p-8 text-left"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Tu nombre o empresa</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none disabled:opacity-50 transition-colors" 
              />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Email de contacto</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none disabled:opacity-50 transition-colors" 
              />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">¿Qué estás construyendo?</label>
              <textarea 
                rows={3} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none resize-none disabled:opacity-50 transition-colors"
              ></textarea>
            </div>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-mono text-green-400"
              >
                ¡Mensaje enviado con éxito! Te contactaré a la brevedad.
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-mono text-red-400"
              >
                {errorMsg}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="btn-primary w-full disabled:opacity-50"
            >
              {status === 'loading' ? 'Transmitiendo datos...' : 'Enviar Mensaje →'}
            </button>
          </form>
        </motion.div>
      </div>
      
      {/* Immersive Footer */}
      <motion.footer
        style={{ y: footerY }}
        className="mt-32 pt-12 pb-8 border-t border-[var(--color-space-border)] relative"
      >
        {/* Background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_100%,rgba(29,158,117,0.03),transparent)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            
            {/* Brand Column */}
            <div>
              <h3 className="font-serif text-xl text-white mb-3">Aldo Arbizu</h3>
              <p className="font-mono text-xs text-[var(--color-mist-gray)]/60 leading-relaxed mb-4">
                Product Engineer & Mobile Developer.<br/>
                Antigravity Studio — San Carlos de Bolívar, AR.
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-pulse" />
                <span className="font-space text-[9px] uppercase tracking-widest text-[var(--color-orbital-teal)]">Sistema Online</span>
              </div>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/40 mb-4">Navegación</h4>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {['Manifesto', 'Servicios', 'Proyectos', 'Studio Lab', 'NEXUS', 'Contacto'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-[var(--color-mist-gray)]/60 hover:text-[var(--color-orbital-teal)] transition-colors py-1">
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Location Column */}
            <div>
              <h4 className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/40 mb-4">Ubicación</h4>
              <div className="relative h-28 bg-[var(--color-deep-space)]/50 border border-[var(--color-space-border)] rounded-lg overflow-hidden">
                {/* Stylized map dots */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 w-0.5 rounded-full bg-[var(--color-mist-gray)]"
                      style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`
                      }}
                    />
                  ))}
                </div>
                {/* Argentina highlight */}
                <div className="absolute bottom-4 left-1/3">
                  <div className="relative">
                    <div className="h-3 w-3 rounded-full bg-[var(--color-orbital-teal)] animate-ping opacity-30" />
                    <div className="absolute inset-0 h-3 w-3 rounded-full bg-[var(--color-orbital-teal)]" />
                  </div>
                  <span className="absolute left-5 top-0 font-space text-[8px] text-[var(--color-orbital-teal)] whitespace-nowrap tracking-wider">
                    BUENOS AIRES, AR
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[var(--color-space-border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[10px] text-[var(--color-mist-gray)]/30">
              © 2026 Aldo Arbizu × Antigravity Studio — aldoarbizu.dev
            </span>
            <span className="font-mono text-[10px] text-[var(--color-mist-gray)]/20">
              Built with Next.js 16 · Three.js · Framer Motion · ♥
            </span>
          </div>
        </div>
      </motion.footer>
    </section>
  )
}
