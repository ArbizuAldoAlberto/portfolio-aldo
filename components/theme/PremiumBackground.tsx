"use client";

export default function PremiumBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[-2] pointer-events-none"
      style={{ backgroundColor: "var(--bg-seam)" }}
    />
  );
}
