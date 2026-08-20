"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useMotionPreferences } from "./MotionPreferences";

export function CustomCursor() {
  const { reducedMotion } = useMotionPreferences();
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Física de resorte ultra-suave
  const springConfig = { damping: 25, stiffness: 280, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Solo activar en desktop/mouse real
    const fineMatch = window.matchMedia("(pointer: fine)");
    setIsFinePointer(fineMatch.matches);

    if (!fineMatch.matches || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target && target.closest("a, button, [data-cursor], input, textarea")) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [reducedMotion, isVisible, mouseX, mouseY]);

  if (!isFinePointer || reducedMotion || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
      {/* Halo seguidor translúcido que acompaña al cursor nativo sin ocultarlo ni estorbar */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-all duration-200 ${
          isHoveringInteractive
            ? "w-10 h-10 border border-emerald-400/50 bg-emerald-400/10 scale-125"
            : "w-6 h-6 border border-white/25 bg-transparent"
        }`}
      />
    </div>
  );
}
