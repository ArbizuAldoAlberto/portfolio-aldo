"use client";
import { motion } from "framer-motion";

export default function PremiumBackground() {
  return (
    <div className="fixed inset-0 z-[-2] bg-[#050508] overflow-hidden pointer-events-none">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <radialGradient id="grad-purple" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="grad-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbes con movimiento orgánico */}
        <motion.circle
          cx="20%"
          cy="30%"
          r="35%"
          fill="url(#grad-purple)"
          filter="url(#glow-blur)"
          animate={{
            cx: ["20%", "25%", "20%"],
            cy: ["30%", "40%", "30%"],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.circle
          cx="85%"
          cy="70%"
          r="40%"
          fill="url(#grad-cyan)"
          filter="url(#glow-blur)"
          animate={{
            cx: ["85%", "75%", "85%"],
            cy: ["70%", "60%", "70%"],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Malla de micro-puntos premium */}
        <pattern
          id="mesh"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.03)" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#mesh)" />
      </svg>

      {/* Capa de ruido de grano fino */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://res.cloudinary.com/dvw9p9s7v/image/upload/v1676644261/noise_ovz3jx.png')]" />
    </div>
  );
}
