# 🛸 Dark Orbital — Arbizu Labs Portfolio Showcase

```text
   █████╗ ███╗   ██╗████████╗██╗ ██████╗ ██████╗  █████╗ ██╗   ██╗██╗████████╗██╗   ██╗
  ██╔══██╗████╗  ██║╚══██╔══╝██║██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║╚══██╔══╝╚██╗ ██╔╝
  ███████║██╔██╗ ██║   ██║   ██║██║  ███╗██████╔╝███████║██║   ██║██║   ██║    ╚████╔╝ 
  ██╔══██║██║╚██╗██║   ██║   ██║██║   ██║██╔══██╗██╔══██║╚██╗ ██╔╝██║   ██║     ╚██╔╝  
  ██║  ██║██║ ╚████║   ██║   ██║╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║   ██║      ██║   
  ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝   ╚═╝      ╚═╝   
                                            
                    -- NEXUS CONTROL NODE: MARKETING DIVISION --
```

Bienvenido al repositorio oficial del **Portfolio Inmersivo (Dark Orbital)** de **Aldo Arbizu** (Product Engineer & Mobile Developer). Este proyecto no es solo una carta de presentación estática; es un ecosistema interactivo y de alto rendimiento que demuestra prácticas avanzadas de arquitectura de software, animaciones tridimensionales fluidas y automatización agéntica.

---

## 🧬 Ecosistema & Arquitectura Técnica

El sitio web está construido utilizando tecnologías de última generación para lograr una carga inicial optimizada (<1.5s) y una fluidez excepcional:

1.  **Frontend & Logic:**
    *   **React 19** & **Next.js 16 (App Router)** utilizando **Turbopack** para hot-reloading instantáneo y compilaciones ultra-eficientes.
    *   **Framer Motion** para transiciones fluidas y micro-interacciones de nivel Awwwards-grade.
    *   **Lucide React** para iconografía minimalista y limpia.
2.  **Visuales 3D Inmersivos (Capa Aeroespacial):**
    *   **React Three Fiber (R3F)** & **Three.js** para renderizado 3D interactivo y sistemas de partículas orbitantes.
    *   **React Three Postprocessing** aplicando efectos de Bloom y aberración cromática con baja huella de rendimiento.
3.  **Backend & Automatizaciones:**
    *   **Resend API** integrado mediante Next.js Server Actions seguros para captación de leads sin exponer tokens en el cliente.
    *   **NEXUS Telemetry Console:** Terminal integrada que expone métricas cognitivas, distribución de habilidades y simulación de auditorías de infraestructura.

---

## 🛠️ Guía de Desarrollo Local

### Pre-requisitos
Asegúrate de contar con Node.js y npm instalados en tu sistema.

### Instalación
Clona el repositorio e instala todas las dependencias requeridas:
```bash
npm install
```

### Configuración de Variables de Entorno
Copia el archivo de ejemplo y completa tus credenciales seguras (como la API key de Resend):
```bash
cp .env.example .env.local
```

### Comandos de Ejecución
*   **Servidor de desarrollo:** `npm run dev`
*   **Compilación de producción:** `npm run build`
*   **Servidor de producción local:** `npm run start`
*   **Linter estático:** `npm run lint`

---

## 🤖 Nodos de Telemetría NEXUS & Auditoría Local

El repositorio cuenta con scripts físicos de soporte que respaldan las capacidades mostradas en la consola interactiva de la interfaz web. Puedes ejecutarlos localmente para auditar el proyecto:

### 1. Validador de Integridad de Estructura
Verifica que las variables locales de entorno, configuraciones esenciales de Next.js y assets se encuentren nominales:
```bash
python scripts/validate_deerflow.py
```

### 2. Compuerta de Seguridad Perimetral (Static Security Scan)
Escanea de forma estática los archivos del código fuente en busca de secretos expuestos antes de realizar cualquier commit o build de producción. 
```bash
sh scripts/scan_security_gate.sh --project=dark-orbital
```
*Nota: Este script se ejecuta automáticamente en el hook `prebuild` del `package.json`. Si hay una API Key expuesta en el código, el build fallará automáticamente protegiendo tu infraestructura.*

### 3. Simulador del Régimen de Riesgo TITAN
Permite auditar el comportamiento del bot de trading cuantitativo integrado en la suite de automatizaciones de Arbizu Labs:
```bash
python scripts/regime_detector.py
```

---

## 📂 Integración con Obsidian (Segundo Cerebro)
Este portfolio se conecta de forma lógica con **Arbizu Vault** a través del nodo de control local `NEXUS.md`, garantizando que cada mejora en la infraestructura B2B, trading o branding se documente en tiempo real en la base de conocimiento digital del desarrollador.

---

*Aldo Arbizu × Arbizu Labs — San Carlos de Bolívar, Argentina (2026)*
