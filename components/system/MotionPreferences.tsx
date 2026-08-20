"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface MotionContextType {
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  toggleReducedMotion: () => void;
}

const MotionContext = createContext<MotionContextType>({
  reducedMotion: false,
  setReducedMotion: () => {},
  toggleReducedMotion: () => {},
});

export function MotionPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);

  useEffect(() => {
    // 1. Detectar preferencia del sistema operativo
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saved = localStorage.getItem("nexus_reduced_motion");

    if (saved !== null) {
      setReducedMotionState(saved === "true");
    } else {
      setReducedMotionState(mediaQuery.matches);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("nexus_reduced_motion") === null) {
        setReducedMotionState(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-reduced-motion",
        reducedMotion ? "true" : "false"
      );
    }
  }, [reducedMotion]);

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem("nexus_reduced_motion", String(val));
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  return (
    <MotionContext.Provider
      value={{ reducedMotion, setReducedMotion, toggleReducedMotion }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotionPreferences() {
  return useContext(MotionContext);
}
