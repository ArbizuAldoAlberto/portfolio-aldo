"use client";

export default function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ backgroundColor: "var(--bg-seam)" }}
    />
  );
}
