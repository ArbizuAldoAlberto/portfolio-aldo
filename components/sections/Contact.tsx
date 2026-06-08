'use client'
import { motion } from 'framer-motion'
import MagneticWrapper from '../ui/MagneticWrapper'
import { Mail, Linkedin, Github } from 'lucide-react'

export default function Contact() {
  return (
    <section id='contact' className="py-32 ph-4 bg-[var(--space-black)]">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Let's build the future</h2>
          <p className="text-[var(--color-mist-gray)] font-mono max-w-2xl mx-auto">Ready to launch your next mission? Whether it's a 3D interactive experience or a commercial-grade medical app, i'm here to make it happen.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <MagneticWrapper>
            <motion.a
              href="mailto:arbizualdoalberto@gmail.com"
              className="btn-primary flex items-center gap-3"
            >
              <Mail size={ 18 } />
              Send a Message
            </motion.a>
          </MagneticWrapper>

          <div className="flex gap-4">
            <MagneticWrapper>
              <a href="https://linkedin.com/in/aldo-alberto-arbizu" target="_blank" className="p-4 rounded-full border border-[var(--space-border)] text-white hover:bg-[var(--orbital-teal)]/10 transition-all">
                <Linkedin size={ 20 } />
              </a>
            </MagneticWrapper>
            <MagneticWrapper>
              <a href="https://github.com/ArbizuAldoAlberto" target="_blank" className="p-4 rounded-full border border-[var(--space-border)] text-white hover:bg-[var(--orbital-teal)]/10 transition-all">
                <Github size={ 20 } />
              </a>
            </MagneticWrapper>

          </div>
        </div>
      </div>
    </section>
  )
}
