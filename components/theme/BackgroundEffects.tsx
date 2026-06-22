"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "./PersonaContext";

export default function BackgroundEffects() {
  const { persona } = usePersona();

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-700 bg-[var(--color-space-black)]">
      <AnimatePresence mode="wait">
        {persona === 'security' && (
          <motion.div
            key="founder-effects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Dynamic Orbs - Walbi Style */}
            <motion.div
              animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)] blur-[100px]"
            />
            <motion.div
              animate={{ x: [0, -100, 0], y: [0, 80, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_70%)] blur-[80px]"
            />
          </motion.div>
        )}

        {persona === 'engineer' && (
          <motion.div
            key="dev-effects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hacker/Terminal Orbs */}
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-5%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] blur-[100px]"
            />
            <motion.div
              animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[10%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)] blur-[90px]"
            />
          </motion.div>
        )}

        {persona === 'agtech' && (
          <motion.div
            key="gentleman-effects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium Gold/Amber subtle glows */}
            <motion.div
              animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(180,83,9,0.03)_0%,transparent_70%)] blur-[150px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Grain/Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,8,0.4)_100%)]" />
    </div>
  );
}
