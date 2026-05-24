# Claude Code Rules

*   Referirse a [AGENTS.md](file:///E:/01_DESARROLLO/2026/01_ACTIVE/portfolio/dark-orbital/AGENTS.md) como el contrato principal del sistema.
*   Siempre ejecutar `npm run build` para verificar la compilación antes de finalizar cambios grandes en la UI o lógica.
*   Utilizar `node scripts/nexus_pipeline_verifier.mjs` para verificar la integridad de la base de datos de carrera y `node scripts/nexus_pattern_analyzer.mjs` para análisis antes de confirmar cambios.
*   Mantener el servidor local de desarrollo Next.js funcional y validar la tipificación de TypeScript.
