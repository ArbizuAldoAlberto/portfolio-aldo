import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orbital: {
          bg: "#0A0A0C",
          card: "#121217",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "#1C1C24",
          emerald: "#10B981",
          "emerald-glow": "rgba(16, 185, 129, 0.15)",
          amber: "#F59E0B",
          "amber-glow": "rgba(245, 158, 11, 0.15)",
          muted: "#94A3B8",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        "emerald-card": "0 0 35px -5px rgba(16, 185, 129, 0.12)",
        "amber-card": "0 0 35px -5px rgba(245, 158, 11, 0.12)",
      },
      animation: {
        "grid-move": "gridMove 20s linear infinite",
      },
      keyframes: {
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
