#!/usr/bin/env node

/**
 * nexus_pipeline_verifier.mjs
 * 
 * Realiza una auditoría de salud e integridad sobre el archivo data/pipeline.md.
 * Valida la estructura de columnas, formatos de fecha, URLs y estados canónicos.
 * Detecta duplicados para evitar desperdicio de atención.
 */

import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PIPELINE_PATH = path.join(ROOT_DIR, 'data', 'pipeline.md');

const CANONICAL_STATES = new Set([
  'Evaluated', 'Applied', 'Responded', 'Interview', 'Offer', 'Rejected', 'Discarded', 'SKIP'
]);

function run() {
  console.log("=============================================================");
  console.log("🔍 NEXUS PIPELINE VERIFIER: Iniciando auditoría de integridad...");
  console.log(`📂 Archivo: ${PIPELINE_PATH}`);
  console.log("=============================================================");

  if (!existsSync(PIPELINE_PATH)) {
    console.error(`❌ ERROR: No se encontró el archivo de pipeline en ${PIPELINE_PATH}`);
    process.exit(1);
  }

  const content = readFileSync(PIPELINE_PATH, 'utf-8');
  const lines = content.split('\n');

  let dataRows = 0;
  let errors = 0;
  let warnings = 0;
  const seenRoles = new Map(); // company + role -> line number

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;
    
    // Omitir cabecera y separador
    if (line.includes('Fecha') && line.includes('Compañía') && line.includes('Rol')) continue;
    if (line.includes('|---|') || line.includes('| :--- |') || line.includes('|---')) continue;

    dataRows++;
    const parts = line.split('|').map(p => p.trim());
    
    // Validar columnas (esperamos 8 partes por split de '|')
    if (parts.length !== 8) {
      console.error(`❌ Fila ${i + 1}: Formato incorrecto. Se esperaban 6 columnas, encontrado: ${parts.length - 2} partes.`);
      errors++;
      continue;
    }

    const [_, dateStr, company, role, location, urlField, status] = parts;

    // 1. Validar campos no vacíos
    if (!dateStr || !company || !role || !location || !urlField || !status) {
      console.error(`❌ Fila ${i + 1}: Contiene campos vacíos.`);
      errors++;
      continue;
    }

    // 2. Validar formato de fecha YYYY-MM-DD
    const dateReg = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateReg.test(dateStr)) {
      console.error(`❌ Fila ${i + 1}: Formato de fecha inválido (${dateStr}). Debe ser YYYY-MM-DD.`);
      errors++;
    }

    // 3. Validar URL sintaxis [Link](https://...)
    const urlReg = /^\[[^\]]+\]\((https?:\/\/[^\)]+)\)$/;
    if (!urlReg.test(urlField)) {
      console.warn(`⚠️ Fila ${i + 1}: Sintaxis de URL no estándar o dudosa (${urlField}). Se recomienda [Texto](URL).`);
      warnings++;
    }

    // 4. Validar estado canónico
    if (!CANONICAL_STATES.has(status)) {
      console.error(`❌ Fila ${i + 1}: Estado no canónico (${status}). Permitidos: [${Array.from(CANONICAL_STATES).join(', ')}].`);
      errors++;
    }

    // 5. Detectar duplicados
    const uniqueKey = `${company.toLowerCase()}||${role.toLowerCase()}`;
    if (seenRoles.has(uniqueKey)) {
      console.warn(`⚠️ Fila ${i + 1}: Oferta duplicada. Ya se registró "${role}" para "${company}" en la línea ${seenRoles.get(uniqueKey)}.`);
      warnings++;
    } else {
      seenRoles.set(uniqueKey, i + 1);
    }
  }

  console.log("-------------------------------------------------------------");
  console.log(`📊 Resumen de Integridad:`);
  console.log(`   - Filas de datos analizadas: ${dataRows}`);
  console.log(`   - Errores encontrados: ${errors}`);
  console.log(`   - Advertencias encontradas: ${warnings}`);
  console.log("=============================================================");

  if (errors > 0) {
    console.error("❌ AUDITORÍA COMPLETA: El archivo presenta fallas de integridad.");
    process.exit(1);
  } else {
    console.log("✅ AUDITORÍA EXITOSA: Todos los registros son íntegros y canónicos.");
    process.exit(0);
  }
}

run();
