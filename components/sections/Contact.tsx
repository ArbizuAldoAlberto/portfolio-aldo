'use client'

export default function Contact() {
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
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Tu nombre o empresa</label>
              <input type="text" className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none" />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">Email de contacto</label>
              <input type="email" className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none" />
            </div>
            <div>
              <label className="font-space text-xs text-[var(--color-mist-gray)] block mb-2">¿Qué estás construyendo?</label>
              <textarea rows={3} className="w-full bg-[var(--color-space-black)] border border-[var(--color-space-border)] p-3 text-white font-mono text-sm focus:border-[var(--color-orbital-teal)] outline-none resize-none"></textarea>
            </div>
            <button className="btn-primary w-full">Enviar Mensaje →</button>
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
