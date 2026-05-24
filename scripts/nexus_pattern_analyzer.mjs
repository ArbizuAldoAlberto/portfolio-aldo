#!/usr/bin/env node

/**
 * nexus_pattern_analyzer.mjs
 * 
 * Analiza el pipeline de ofertas, calcula embudos de conversión, compatibilidad
 * geográfica, palabras clave predominantes y genera recomendaciones de carrera
 * accionables y personalizadas.
 */

import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PIPELINE_PATH = path.join(ROOT_DIR, 'data', 'pipeline.md');
const CONFIG_PATH = path.join(ROOT_DIR, 'config', 'portals.json');

function run() {
  console.log("=============================================================");
  console.log("📊 NEXUS PATTERN ANALYZER: Iniciando análisis de embudo y patrones...");
  console.log(`📂 Archivo: ${PIPELINE_PATH}`);
  console.log("=============================================================");

  if (!existsSync(PIPELINE_PATH)) {
    console.error(`❌ ERROR: No se encontró el archivo de pipeline en ${PIPELINE_PATH}`);
    process.exit(1);
  }

  // Cargar configuración de filtros de localización para evaluar compatibilidad
  let allowedLocs = ["remote", "us", "argentina", "latam", "anywhere"];
  let blockedLocs = ["on-site", "hybrid", "london", "tokyo", "munich"];
  if (existsSync(CONFIG_PATH)) {
    try {
      const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
      if (config.location_filter) {
        allowedLocs = config.location_filter.allow || allowedLocs;
        blockedLocs = config.location_filter.block || blockedLocs;
      }
    } catch (err) {
      // Ignorar e ir por defaults
    }
  }

  const content = readFileSync(PIPELINE_PATH, 'utf-8');
  const lines = content.split('\n');

  const statusCounts = {};
  let totalRoles = 0;
  let compatibleLocations = 0;
  const companyCounts = {};
  const keywords = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;
    if (line.includes('Fecha') && line.includes('Compañía') && line.includes('Rol')) continue;
    if (line.includes('|---|') || line.includes('| :--- |') || line.includes('|---')) continue;

    const parts = line.split('|').map(p => p.trim());
    if (parts.length !== 8) continue;

    const [_, dateStr, company, role, location, urlField, status] = parts;

    totalRoles++;

    // Agrupar por Estado
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    // Agrupar por Compañía
    companyCounts[company] = (companyCounts[company] || 0) + 1;

    // Analizar ubicación
    const locLower = location.toLowerCase();
    const isAllowed = allowedLocs.some(kw => locLower.includes(kw));
    const isBlocked = blockedLocs.some(kw => locLower.includes(kw));
    if (isAllowed && !isBlocked) {
      compatibleLocations++;
    }

    // Extraer palabras clave del Rol
    const words = role.toLowerCase().replace(/[^a-z0-9\s.-]/g, '').split(/\s+/);
    for (const w of words) {
      if (w.length > 2 && !["and", "the", "for", "with", "system", "engineer", "developer", "engineering"].includes(w)) {
        keywords[w] = (keywords[w] || 0) + 1;
      }
    }
  }

  if (totalRoles === 0) {
    console.log("⚠️ No hay ofertas registradas en el pipeline para analizar.");
    process.exit(0);
  }

  // 1. Embudo de conversión (Funnel)
  console.log("📈 FUNNEL DE CONVERSIÓN DE BÚSQUEDA:");
  const states = ['Evaluated', 'Applied', 'Responded', 'Interview', 'Offer', 'Rejected', 'Discarded', 'SKIP'];
  states.forEach(state => {
    const count = statusCounts[state] || 0;
    const bar = "█".repeat(Math.round((count / totalRoles) * 20));
    const pct = ((count / totalRoles) * 100).toFixed(1);
    console.log(`   - ${state.padEnd(12)}: ${bar.padEnd(20)} [${count}] (${pct}%)`);
  });

  const evaluatedCount = statusCounts['Evaluated'] || 0;
  const appliedCount = statusCounts['Applied'] || 0;
  const respondedCount = statusCounts['Responded'] || 0;
  const interviewCount = statusCounts['Interview'] || 0;
  const offerCount = statusCounts['Offer'] || 0;

  const appliedRate = totalRoles > 0 ? ((appliedCount / totalRoles) * 100).toFixed(1) : 0;
  const interviewRate = totalRoles > 0 ? ((interviewCount / totalRoles) * 100).toFixed(1) : 0;
  const offerRate = totalRoles > 0 ? ((offerCount / totalRoles) * 100).toFixed(1) : 0;

  console.log("\n⚡ MÉTRICAS DE EFICIENCIA:");
  console.log(`   - Total Ofertas Escaneadas: ${totalRoles}`);
  console.log(`   - Tasa de Postulación: ${appliedRate}%`);
  console.log(`   - Tasa de Entrevista: ${interviewRate}%`);
  console.log(`   - Tasa de Oferta final: ${offerRate}%`);

  // 2. Análisis de Localización
  const compatPct = ((compatibleLocations / totalRoles) * 100).toFixed(1);
  console.log("\n📍 ANÁLISIS GEOGRÁFICO Y POLÍTICA DE COMPATIBILIDAD:");
  console.log(`   - Vacantes con localización 100% compatible: ${compatibleLocations}/${totalRoles} (${compatPct}%)`);

  // 3. Top palabras clave
  const topKeywords = Object.entries(keywords).sort((a,b) => b[1] - a[1]).slice(0, 5);
  console.log("\n🏷️ PALABRAS CLAVE PREDOMINANTES EN ROLES:");
  topKeywords.forEach(([kw, c]) => {
    console.log(`   - "${kw}": ${c} apariciones`);
  });

  // Recomendación proactiva
  console.log("\n💡 RECOMENDACIONES PROACTIVAS DE NEXUS:");
  if (parseFloat(compatPct) < 70) {
    console.log("   👉 Se detecta un porcentaje alto de ubicaciones no compatibles. Refina 'config/portals.json' para optimizar la carga cognitiva.");
  }
  if (interviewCount === 0 && appliedCount > 5) {
    console.log("   👉 Alto volumen de aplicaciones sin entrevistas. Recomienda utilizar la habilidad de optimización de Pitch Decks y revisión de CV/Portfolio.");
  } else if (offerCount === 0 && interviewCount > 2) {
    console.log("   👉 Llegando a entrevistas pero sin ofertas. Sugiere repasar Mock Interviews y preparación técnica especializada.");
  } else {
    console.log("   👉 El flujo actual es estable. Continúe alimentando el escáner diariamente.");
  }
  console.log("=============================================================");
}

run();
