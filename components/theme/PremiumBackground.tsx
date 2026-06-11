"use client";
import { motion } from "framer-motion";
import { usePersona } from "./PersonaContext";

export default function PremiumBackground() {
  const { persona } = usePersona();

  return (
    <div className="fixed inset-0 z-[-2] bg-[var(--color-space-black)] overflow-hidden pointer-events-none transition-colors duration-700">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Walbi / Founder gradients */}
          <radialGradient id="grad-purple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>

          {/* Dev gradients */}
          <radialGradient id="grad-emerald" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-blue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>

          {/* Gentleman gradients */}
          <radialGradient id="grad-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad-amber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B45309" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
          </radialGradient>

          {/* Founder Mesh */}
          <pattern id="founder-mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
          </pattern>

          {/* Dev Grid */}
          <pattern id="dev-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* --- DYNAMIC BACKGROUND CONTENT BASED ON PERSONA --- */}
        {persona === 'founder' && (
          <g>
            <motion.circle
              cx="20%" cy="30%" r="35%"
              fill="url(#grad-purple)" filter="url(#glow-blur)"
              animate={{ cx: ["20%", "25%", "20%"], cy: ["30%", "40%", "30%"], scale: [1, 1.1, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="85%" cy="70%" r="40%"
              fill="url(#grad-cyan)" filter="url(#glow-blur)"
              animate={{ cx: ["85%", "75%", "85%"], cy: ["70%", "60%", "70%"], scale: [1, 1.05, 1] }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            />
            <rect width="100%" height="100%" fill="url(#founder-mesh)" />
          </g>
        )}

        {persona === 'dev' && (
          <g>
            <motion.circle
              cx="10%" cy="80%" r="30%"
              fill="url(#grad-emerald)" filter="url(#glow-blur)"
              animate={{ cx: ["10%", "15%", "10%"], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="90%" cy="10%" r="35%"
              fill="url(#grad-blue)" filter="url(#glow-blur)"
              animate={{ cx: ["90%", "85%", "90%"], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <rect width="100%" height="100%" fill="url(#dev-grid)" />
          </g>
        )}

        {persona === 'gentleman' && (
          <g>
            <motion.circle
              cx="50%" cy="50%" r="50%"
              fill="url(#grad-gold)" filter="url(#glow-blur)"
              animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="20%" cy="20%" r="40%"
              fill="url(#grad-amber)" filter="url(#glow-blur)"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        )}
      </svg>

      {/* Noise layer: Present in all, but slightly more visible in Gentleman */}
      <div className={`absolute inset-0 pointer-events-none mix-blend-overlay bg-[url('https://res.cloudinary.com/dvw9p9s7v/image/upload/v1676644261/noise_ovz3jx.png')] transition-opacity duration-1000 ${persona === 'gentleman' ? 'opacity-[0.06]' : 'opacity-[0.03]'}`} />
    </div>
  );
}
