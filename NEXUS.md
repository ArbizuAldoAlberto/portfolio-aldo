# 🧠 NEXUS Control Node — Portfolio (aldoarbizu.com)

## 📌 Project Identity
*   **Project Name:** Dark Orbital (Personal Portfolio / Aldo Alberto Arbizu)
*   **Production subdomain:** https://aldoarbizu.com
*   **VPS Port (Assigned):** 3001 (routed via `vhost_router.js` proxy)
*   **Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, React Three Fiber (R3F), Drei, Postprocessing, TailwindCSS v4, next-intl (i18n), Resend
*   **Repository Location:** [portfolio/dark-orbital](file:///E:/01_DESARROLLO/2026/01_ACTIVE/portfolio/dark-orbital)
*   **Obsidian Hub Note:** [[02-PROYECTOS/03-AUXILIARES-HUB/Portfolio|Portfolio.md]]

---

## 🛠️ Local Environment & State
*   **Environment variables:** Configured in `.env.local`
*   **Dependencies:** npm packages installed, R3F and three.js for interactive WebGL 3D/WASM.
*   **Asset Management:** Includes public CVs in [public/cv/](file:///E:/01_DESARROLLO/2026/01_ACTIVE/portfolio/dark-orbital/public/cv/) optimized for ATS checks.
*   **Critical local commands:**
    *   Pre-build security scan: `node scripts/scan_security_gate.js` (runs automatically before build)
    *   Development server: `npm run dev`
    *   Build compilation: `npm run build`
    *   Linting: `npm run lint`

---

## 🔄 Active Lifecycle Phase
*   **Current Phase:** `Deployed / Live` (Active on production VPS, serving resume and project details, integrated with cal.com scheduling).
*   **Production Status:** Running actively in production under PM2 or Docker environment.
*   **Last Audit Date:** 2026-06-26

---

## 🎯 Next High-Priority Actions (Monetization & Conversion)
1.  **Resume ATS optimization check:** Maintain up-to-date markdown and PDF resume links in [public/cv/](file:///E:/01_DESARROLLO/2026/01_ACTIVE/portfolio/dark-orbital/public/cv/).
2.  **Conversion Optimization:** Ensure the main CTA is highly visible: **[Ver Currículum (PDF)]** / **[Programar llamada (Cal.com)]** for recruiters.
3.  **Performance Check:** Audit R3F shaders and 3D frame rates to prevent performance degradation on mobile devices.
