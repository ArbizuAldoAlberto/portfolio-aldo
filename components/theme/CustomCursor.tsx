// Reemplaza el componente CustomCursor con esta versión "Premium Glow":
"use client";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useCursor } from "./CursorContext";
import { usePersona } from "./PersonaContext";

export default function CustomCursor() {
  const { cursorState } = useCursor();
  const { persona } = usePersona();
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, isVisible]);

  const glowColor =
    persona === "dev"
      ? "rgba(59, 234, 206, 0.4)"
      : persona === "gentleman"
        ? "rgba(255, 255, 255, 0.3)"
        : "rgba(255, 177, 48, 0.3)";

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        style={{ x: cursorXSpring, y: cursorYSpring }}
        className="relative"
      >
        {/* Glow Trail */}
        <motion.div
          animate={{
            scale: cursorState === "click" ? 1.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl"
          style={{ backgroundColor: glowColor }}
        />

        {/* Main Cursor Dot */}
        <motion.div
          animate={{
            scale: cursorState === "click" ? 0.8 : 1,
            width: cursorState === "drag" ? 40 : 8,
            height: cursorState === "drag" ? 40 : 8,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full mix-blend-difference"
        />
      </motion.div>
    </div>
  );
}
