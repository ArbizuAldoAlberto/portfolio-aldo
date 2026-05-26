'use client'
import { useState, useEffect } from 'react'
import { sendEmail } from '../../app/actions/sendEmail'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  
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
    <section id="contact" className="relative py-32 border-t border-[var(--color-space-border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-space text-sm text-[var(--color-mist-gray)]">Disponible para proyectos</span>
        </div>

        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
          Construyamos algo que importe.
        </h2>
        
        <div className="font-mono text-[var(--color-mist-gray)] mb-12">
          Respondo en menos de 24 horas.<br/>
          Zona horaria: Argentina (UTC-3)
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20 font-space text-sm">
          <a href="mailto:arbizualdoalberto@gmail.com" className="hover:text-[var(--color-orbital-teal)] transition-colors">
            📧 arbizualdoalberto@gmail.com
          </a>
          <a href="https://linkedin.com/in/aldo-alberto-arbizu" target="_blank" rel="noreferrer" className="hover:text-[var(--color-orbital-teal)] transition-colors">
            💼 LinkedIn
          </a>
          <a href="https://github.com/ArbizuAldoAlberto" target="_blank" rel="noreferrer" className="hover:text-[var(--color-orbital-teal)] transition-colors">
            🐙 GitHub
          </a>
        </div>

        <div className="glass-surface max-w-lg mx-auto p-8 text-left">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Tu nombre o empresa</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Email de contacto</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none disabled:opacity-50" 
              />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">¿Qué estás construyendo?</label>
              <textarea 
                rows={3} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none resize-none disabled:opacity-50"
              ></textarea>
            </div>

            {status === 'success' && (
              <p className="text-sm font-mono text-green-400">¡Mensaje enviado con éxito! Te contactaré a la brevedad.</p>
            )}

            {status === 'error' && (
              <p className="text-sm font-mono text-red-400">{errorMsg}</p>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="btn-primary w-full disabled:opacity-50"
            >
              {status === 'loading' ? 'Transmitiendo datos...' : 'Enviar Mensaje →'}
            </button>
          </form>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-6 border-t border-[var(--color-space-border)] text-center font-mono text-xs text-[var(--color-mist-gray)]/50">
        Aldo Arbizu × Antigravity Studio — San Carlos de Bolívar, AR <br/>
        aldoarbizu.dev · 2026
      </footer>
    </section>
  )
}
