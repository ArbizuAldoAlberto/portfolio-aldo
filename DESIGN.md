# DESIGN.md — CONTRATO DETERMINISTA DE INTERFAZ Y DIRECCIÓN DE ARTE
**Sistema:** Ecosistema ARBIZU LABS (`aldoarbizu.com` ↔ `arbizulabs.com` ↔ Productos Satélite)  
**Dirección de Arte Bloqueada:** **Opción 1 — *Orbital CNC & Horological Telemetry*** (con fusión táctica `#10B981` para telemetría en vivo)  
**Titular:** Aldo Alberto Arbizu (`CUIT: 20-38362060-1`) · **Última Calibración:** `2026-11-18`

---

## 1. SISTEMA DE TRIPLE REFERENCIA

### 1.1 Referencia de Ritmo y Layout
- **Eje Rector:** Asimetría técnica `7:5` y matrices tabulares arquitectónicas delimitadas por divisores de `1px` (`border-white/10`), inspiradas en instrumentos aeronáuticos, calibración CNC de alta precisión y relojería mecánica suiza.
- **Qué tomar:** Jerarquía espacial contrastada entre bloques densos de telemetría tabular, split-screens de alta legibilidad y lienzos 3D/video a sangre con bordes fundidos.
- **Qué NO copiar jamás:** Contenedores centrados con pill badges redondeados genéricos arriba del `<h1>`, gradientes radiales violeta/azul difusos ni grillas simétricas repetitivas de 3 tarjetas con un icono de 16px en caja translúcida ("AI Slop").

### 1.2 Referencia de Escala Tipográfica
- **Títulos y Display Arquitectónico:** `Geist Sans` (`--font-geist-sans`), pesos `700`/`800`, `letter-spacing: -0.03em`, `line-height: 1.05`.
- **Datos, Coordenadas, Precios, Latencias y Código:** `JetBrains Mono` (`--font-jetbrains`), pesos `400`/`700`, **`font-variant-numeric: tabular-nums`** obligatorio en toda cifra dinámica o métrica de latencia.
- **Prohibición:** Nunca usar `Inter` como voz principal de identidad ni mezclas genéricas no calibradas (`Playfair` + `Inter`).

### 1.3 Referencia de Dirección Fotográfica e Imagen
- **Activos Reales y Procedurales (GATE 0 Opción B):** Escenas Three.js/WebGL PBR locales con `.dispose()` determinista, modelos `.glb` comprimidos con decodificador local Draco/Meshopt (`/draco/`), renders WebP 16:9/9:16 locales y esquemáticos vectoriales SVG CAD de trazo preciso `1.5px`.
- **Prohibición de Emojis:** Cero emojis de sistema (`⚛️`, `🗄️`, `🛡️`, `🚀`, etc.) en interfaces corporativas, tablas de stack o encabezados de sección.

---

## 2. PALETA HEXADECIMAL & CONTRASTE WCAG AAA
| Token | Hexadecimal | Uso Estricto | Contraste sobre `#070B12` |
|---|---|---|---|
| **Obsidiana Base** | `#070B12` | Fondo primario absoluto | — |
| **Superficie Técnica** | `#0D131F` | Paneles de telemetría, filas activas y modales | `1.14:1` |
| **Platino Primario** | `#F8FAFC` | Títulos H1-H3 y valores numéricos críticos | **18.1:1 (AAA)** |
| **Acero Técnico** | `#CBD5E1` | Copys técnicos y descripciones de arquitectura | **12.4:1 (AAA)** |
| **Acero Silenciado** | `#94A3B8` | Etiquetas secundarias y subíndices | **7.1:1 (AAA)** |
| **Oro Solar CNC** | `#D4AF37` | Autoridad, acentos activos, cotas y CTAs primarios | **9.4:1 (AAA)** |
| **Esmeralda Telemetría** | `#10B981` | Exclusivo para nodos vivos, latencia ms y estado `/api/status` | **8.3:1 (AAA)** |

---

## 3. MOTIVO VISUAL RECONOCIBLE (`Signature Motif`)
- **Crosshairs Micrométricos (`+`) y Divisores de `1px`:** Intersecciones de retícula marcadas con signos `+` en `#D4AF37` (`font-mono text-xs select-none`), líneas estructurales de `1px` (`rgba(255, 255, 255, 0.10)`) y numeración indexada `01 // 08` en `JetBrains Mono`.
- **Reglas Estructurales Cerradas:**
  1. Alineación editorial a la izquierda en bloques de texto técnico; cero centrados genéricos en héroes corporativos.
  2. Bordes nítidos (`rounded-none` o `rounded-[2px]`/`[4px]` arquitectónico en matrices y paneles de instrumentos; evitar `rounded-3xl` inflados).
  3. Toda cifra de latencia, SLA, precio o volumen debe renderizarse con `tabular-nums`.

---

## 4. LA PRUEBA DE ESCALA DE GRISES (`Grayscale Wireframe Test`)
Al convertir la interfaz a escala de grises, ninguna sección consecutiva puede compartir la misma silueta espacial:
1. **Hero:** Split asimétrico `7:5` (titular izquierdo + panel de telemetría relojera derecho).
2. **SocialProof / Stack:** Fila de instrumentos cuantitativos + **Índice Tabular Horizontal** numerado (`01..08`) con esquemáticos SVG CAD de `1.5px`.
3. **Problems / Diagnóstico:** **Matriz Comparativa de Ingeniería** en filas de banda ancha (Arquitectura Convencional Frágil vs. Ingeniería Soberana Arbizu Labs).
4. **EngineeringStandards:** Retícula técnica numerada `STD-01`..`STD-06` sin tarjetas clónicas flotantes.

---

## 5. REGLA DE EVIDENCIA REAL (`No-Hallucinated-Assets Rule`)
- Prohibido inventar clientes, logos ficticios, porcentajes sin respaldo o testimonios apócrifos.
- Toda métrica exhibida (`< 10ms`, `SQLite WAL`, `60/60 RLS`, `CUIT 20-38362060-1`, `+54 9 2314 489197`) corresponde exclusivamente a activos auditados y en producción del ecosistema ARBIZU LABS.
- Productos clasificados `INACTIVO` (ej. `SabioBosque`) quedan estrictamente excluidos de toda interfaz pública.
