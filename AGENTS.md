<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 🤖 Directrices del Agente NEXUS — Dark Orbital

Este archivo define las reglas de comportamiento, ética y diseño para cualquier agente de IA que opere dentro del espacio de trabajo **Dark Orbital** de Arbizu Labs.

---

## 🧬 Contrato de Datos (CRITICAL)

El ecosistema del portafolio e integraciones está dividido en dos capas estrictas para evitar fugas de información o sobreescritura de datos personales durante las actualizaciones del sistema:

### 1. Capa del Usuario (NUNCA auto-actualizar, personalización exclusiva del usuario)
*   **Archivos de configuración:** `config/portals.json`, `.env.local` (que contiene credenciales como `HF_TOKEN` y `RESEND_API_KEY`).
*   **Datos y trackers de carrera:** Todos los archivos bajo `data/` (e.g., `data/pipeline.md`, `data/scan-history.tsv`).
*   **CV y datos profesionales:** CV personal en markdown, credenciales o PDF generados.

### 2. Capa del Sistema (Actualizable por el agente, lógica del portafolio)
*   **Código de Next.js & React:** Todo el contenido de `app/`, `components/` y estilos `app/globals.css` / variables de tema.
*   **Scripts de automatización:** Todo lo ubicado en `scripts/`:
    *   `scripts/nexus_job_scanner.mjs`: Escáner de Greenhouse/Lever.
    *   `scripts/nexus_pipeline_verifier.mjs`: Auditor de integridad para `data/pipeline.md`.
    *   `scripts/nexus_pattern_analyzer.mjs`: Analizador de patrones y embudos de conversión.
    *   `scripts/validate_deerflow.py` y `scripts/scan_security_gate.js`: Scripts de validación del backend y guardarraíl prebuild.
*   **Directrices y dependencias:** `package.json`, `tsconfig.json`, `AGENTS.md`, `CLAUDE.md`.

> [!IMPORTANT]
> **REGLA DE ORO:** Cuando el usuario solicite cambiar sus palabras clave, localizaciones deseadas o añadir portales de reclutamiento, edita únicamente `config/portals.json`. NUNCA modifiques código hardcodeado en los componentes o scripts de sistema para guardar datos específicos del usuario.
> Además, los scripts `nexus_pipeline_verifier.mjs` y `nexus_pattern_analyzer.mjs` deben correrse localmente para validar cualquier cambio de formato en `data/pipeline.md`.

---

## ⚖️ Políticas Éticas y de Integración (Calidad sobre Cantidad)

Inspirado en el marco ético de `career-ops`, este sistema prioriza el respeto al tiempo de los reclutadores y la resiliencia operativa:

1.  **NUNCA auto-postularse:** Los scripts o flujos autónomos pueden rellenar formularios, redactar respuestas y preparar PDFs, pero **siempre deben detenerse** antes de realizar el envío definitivo (`Submit` / `Apply`). El usuario es el único que toma la decisión final.
2.  **Calidad sobre Volumen:** Promueve y prioriza postulaciones de alta adecuación cognitiva (puntuaciones de match altas). Desaconseja postulaciones masivas o de baja adecuación. Una postulación pulida a 5 compañías supera a un spam genérico a 50.
3.  **Respetar la privacidad:** Ningún token de API, correo personal, número de teléfono o detalle sensible del usuario debe ser subido al repositorio público. El script `scan_security_gate.js` valida esto en el hook `prebuild`.
4.  **Integraciones Resilientes (APIs):** Priorizar APIs públicas y gratuitas (ej. CoinGecko, Github REST). Siempre aplicar *Graceful Degradation* si una API falla. Ningún componente crítico (como WebGL o el layout principal) debe colapsar por un límite de cuota (Rate Limit 429) de un servicio externo.
5.  **Internacionalización (i18n):** Está estrictamente prohibido usar texto hardcodeado (fijo) en español o inglés dentro de los componentes visuales. Todos los nuevos textos, títulos y métricas deben ser declarados e inyectados a través de `messages/en.json` y `messages/es.json` usando `useTranslations()`.

---

## 🎨 Estándares de Diseño Visual Premium & WebGL

Para mantener el estatus inmersivo del portfolio, todo cambio o adición al frontend debe cumplir las directrices de **Awwwards-grade**:

### 1. Sistema de Diseño HSL y Glassmorphism
*   Evita colores puros y planos. Utiliza gradientes suaves HSL y paletas oscuras premium con acentos tecnológicos (`--color-orbital-teal`, `--color-amber-gold`, etc.).
*   Aplica efectos de desenfoque de fondo (`backdrop-filter: blur()`) combinados con bordes translúcidos en tarjetas de tipo Bento Grid (`glass-surface`).

### 2. Responsividad Mobile-First Crítica
*   Ningún Agente de IA debe dar por finalizado un componente sin comprobar explícitamente su fluidez en `< 640px` (clases `sm:` en Tailwind).
*   Se prohíbe forzar más de 2 columnas en dispositivos móviles (`grid-cols-2`). Todos los grids de métricas, paneles o dashboards deben empezar con `grid-cols-1 sm:grid-cols-2`.

### 3. Optimización WebGL & React Three Fiber (R3F)
*   Cualquier modelo 3D integrado debe ser decimado y optimizado utilizando compresión Draco o Meshoptimizer. **El tamaño máximo permitido para archivos `.glb` es de 400KB** para asegurar estabilidad en navegadores móviles.
*   Implementa cargas asíncronas (`Suspense`) y animaciones dinámicas que no comprometan los 60 FPS (evita cálculos complejos en el hook `useFrame`).
*   Los assets estáticos (ej. texturas CSS como `noise.svg`) no deben llamarse vía red (`url(...)`) si causan bloqueos de rendering. Deben incrustarse en línea como `Base64 Data URI`.

---

## 📂 Sincronización con Obsidian (Segundo Cerebro)

El portafolio se conecta conceptualmente con la bitácora local de Obsidian a través de `.nexus_memory.md` y las anotaciones de despliegue. 
*   Cualquier cambio de arquitectura importante, resolución de bugs o modificación del túnel de red (Cloudflare) debe documentarse en el registro de telemetría de NEXUS para que el usuario mantenga su bitácora sincronizada y evite repetir errores.
*   Usa enlaces de tipo markdown estándar y evita referencias rotas a rutas relativas del sistema operativo.
