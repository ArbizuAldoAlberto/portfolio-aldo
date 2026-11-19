import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import {
  ProductDynastyBadge,
  type DynastySystemCode,
} from '@/components/ui/SovereignBrandMark';

interface SiteDescriptor {
  code?: DynastySystemCode;
  name: string;
  roleEs: string;
  roleEn: string;
  descEs: string;
  descEn: string;
  stack: string[];
  noticeEs?: string;
  noticeEn?: string;
}

const VALID_SUBDOMAINS: Record<string, SiteDescriptor> = {
  titanflow: {
    code: 'SYS-01',
    name: 'TitanFlow Quant Engine',
    roleEs: 'Ejecución Algorítmica Binance Futures Sub-10ms',
    roleEn: 'Sub-10ms Binance Futures Algorithmic Execution Engine',
    descEs:
      'Motor determinista por WebSocket con evaluación Pessimistic SL-First, Chandelier Trailing y Hard Cap de colateral del 1.50%.',
    descEn:
      'Deterministic WebSocket engine featuring Pessimistic SL-First evaluation, Chandelier Trailing, and 1.50% Hard Collateral Cap.',
    stack: ['Node.js WebSockets', 'SQLite WAL', 'Pessimistic SL-First', 'Telegram Ops'],
  },
  sentinelos: {
    code: 'SYS-02',
    name: 'SentinelOS Dispatch',
    roleEs: 'Seguridad Privada Multi-Tenant · 60/60 PostgreSQL RLS',
    roleEn: 'Multi-Tenant Security Dispatch · 60/60 PostgreSQL RLS',
    descEs:
      'Consola SOC y app móvil offline-first para rondas NFC/GPS anti-spoofing, biometría TFLite y despacho Aegis SOS.',
    descEn:
      'Offline-first SOC dashboard and patrol app with anti-spoofing NFC/GPS verification, local TFLite biometrics, and Aegis SOS.',
    stack: ['PostgreSQL RLS 60/60', 'SQLite WAL', 'HMAC-SHA256', 'OWASP MASVS'],
  },
  agromarket: {
    code: 'SYS-03',
    name: 'AgroMarket Pro',
    roleEs: 'Acopio Rural, Silobolsas LiDAR/FLIR & Balanza Offline',
    roleEn: 'Rural Grain Intake, Silo Bag LiDAR/FLIR & Offline Weighbridge',
    descEs:
      'Trazabilidad agrícola 100% operativa con 0% señal 4G mediante SQLite WAL, cubicación volumétrica y auditorías FLIR.',
    descEn:
      '100% operational rural grain intake and traceability under 0% cellular signal using SQLite WAL and FLIR thermography.',
    stack: ['React Native', 'SQLite WAL', 'LiDAR / FLIR', 'SENASA'],
  },
  nomadhub: {
    code: 'SYS-04',
    name: 'NOMAD Tactical Hub',
    roleEs: 'Operaciones Off-Grid · AFSK Radio · LoRa & PAR2',
    roleEn: 'Off-Grid Operations · AFSK Radio · LoRa & PAR2 Self-Healing',
    descEs:
      'Suite táctica de contingencia sin internet ni red eléctrica: PWA local, cifrado AES-256-GCM y exportación EPUB3 para E-Ink.',
    descEn:
      'Off-grid contingency suite with AFSK 800Hz radio modem, AES-256-GCM vaults, PAR2 recovery, and E-Ink EPUB3 compilation.',
    stack: ['AES-256-GCM', 'Reed-Solomon PAR2', 'LoRa Meshtastic', 'Offline PWA'],
  },
  verify: {
    code: 'SYS-05',
    name: 'Verify Cryptographic Trust',
    roleEs: 'Verificación Inmutable SHA-256 & Base L2',
    roleEn: 'Immutable SHA-256 & Base L2 Audit Verification',
    descEs:
      'Portal de verificación instantánea para informes térmicos FLIR, presupuestos firmados ARB-2026 y auditorías de infraestructura.',
    descEn:
      'Instant verification portal for calibrated FLIR inspection reports, signed ARB-2026 quotes, and infrastructure audits.',
    stack: ['SHA-256', 'Base L2', 'QR Proof', 'SQLite WAL'],
  },
  cannasavias: {
    code: 'SYS-06',
    name: 'CannaSavias REPROCANN Sim',
    roleEs: 'DEMOSTRACIÓN DE SOFTWARE B2B / Simulador de Trazabilidad',
    roleEn: 'B2B SOFTWARE DEMONSTRATION / Compliance Traceability Simulator',
    descEs:
      'Plataforma demostrativa de software de gestión e inventario auditable para clubes autorizados REPROCANN (Licencia Software $75.000 ARS).',
    descEn:
      'B2B traceability & compliance management software demonstration for licensed clubs ($75,000 ARS software license).',
    noticeEs:
      'CUMPLIMIENTO ESTRICTO: Demostración exclusiva de software B2B de trazabilidad. No comercializa sustancias ni productos regulados.',
    noticeEn:
      'STRICT COMPLIANCE: B2B traceability software demonstration only. No controlled substances or physical flowers are sold.',
    stack: ['SQLite WAL', 'RBAC Compliance', 'Audit Ledger'],
  },
  aeroshot: {
    code: 'SYS-07',
    name: 'AeroShot Drones GIS',
    roleEs: 'Relevamiento Aéreo 4K, NDVI & Termografía FLIR',
    roleEn: '4K Aerial Surveys, NDVI & Calibrated FLIR Thermography',
    descEs:
      'Procesamiento geoespacial sin señal en campo e informes termográficos industriales y agropecuarios certificados.',
    descEn:
      'Offline-ready field geospatial processing and certified FLIR Ironbow thermal inspections for agriculture and industry.',
    stack: ['GIS WebGL', 'FLIR Ironbow', 'GeoJSON', 'Base L2'],
  },
  impresion3d: {
    code: 'SYS-08',
    name: 'ab3d-forge // Impresión 3D',
    roleEs: 'CAD Paramétrico Blender + Slicer STL en Cliente WASM',
    roleEn: 'Parametric Blender CAD + Client-Side WASM STL Slicer',
    descEs:
      'Pipeline automatizado Bit-to-Atom para diseño paramétrico, análisis volumétrico local y fabricación aditiva funcional.',
    descEn:
      'Bit-to-Atom engineering pipeline combining headless Blender parametric CAD, client STL slicing, and industrial FDM production.',
    stack: ['Blender Headless', 'WASM STL', 'Three.js', 'Hellbot Magna 2'],
  },
  habitat: {
    code: 'SYS-09',
    name: 'Hábitat Lease Engine',
    roleEs: 'Contratos Directos & Arriendos Notarizados en Base L2',
    roleEn: 'Direct Leasing & Land Contracts Notarized on Base L2',
    descEs:
      'Firma criptográfica directa con prueba on-chain en Base L2 y panel administrativo de cumplimiento.',
    descEn:
      'Frictionless cryptographic lease signing with Base L2 verification and transparent lifecycle tracking.',
    stack: ['Next.js 16', 'Solidity / Base L2', 'Keccak256'],
  },
  ecoconnect: {
    code: 'SYS-10',
    name: 'EcoConnect ESG',
    roleEs: 'Telemetría Satelital Sentinel-2 & Registro Ambiental',
    roleEn: 'Sentinel-2 Satellite Telemetry & ESG Registry',
    descEs:
      'Auditoría de biomasa forestal por índices NDVI y trazabilidad ambiental verificable con PostgreSQL RLS.',
    descEn:
      'Forest canopy monitoring via Sentinel-2 NDVI and verifiable ESG reporting protected by strict PostgreSQL RLS.',
    stack: ['Sentinel-2 API', 'PostgreSQL RLS', 'Base L2'],
  },
  aureus: {
    code: 'SYS-11',
    name: 'Aureus Wealth OS',
    roleEs: 'Consolidación Patrimonial Privada Multimoneda',
    roleEn: 'Private Multi-Currency Wealth Consolidation Engine',
    descEs:
      'Motor WASM local de análisis financiero con streaming sub-120ms y aislamiento Zero-Cloud de balances.',
    descEn:
      'Local WASM deterministic financial compute with sub-120ms streaming UI and Zero-Cloud balance custody.',
    stack: ['Next.js 16', 'Rust / WASM', 'Circuit Breaker'],
  },
  marketingadvisor: {
    code: 'SYS-12',
    name: 'Smart Marketing AI',
    roleEs: 'Pipelines Autónomos n8n + Zod Schema',
    roleEn: 'Autonomous n8n Pipelines + Zod Schema Validation',
    descEs:
      'Calificación estructurada de demanda B2B y orquestación multicanal con LLMCircuitBreaker y kill-switch.',
    descEn:
      'Autonomous n8n lead qualification workflows guarded by strict Zod schemas and an LLM Circuit Breaker.',
    stack: ['n8n Self-Hosted', 'Zod Schema', 'Gemini 2.5'],
  },
  pawhero: {
    name: 'PawHero · Iniciativa Filantrópica',
    roleEs: 'Placas QR 3D Gratuitas & Ayuda Directa a Refugios (0% Comisión)',
    roleEn: 'Free 3D QR Pet Tags & Direct Shelter Support (0% Fee)',
    descEs:
      'Plataforma sin fines de lucro para identificación de mascotas mediante placas STL imprimibles gratis y enlace directo a refugios.',
    descEn:
      '100% non-profit animal identification portal providing free 3D-printable QR tags and zero-fee shelter aid.',
    stack: ['3D STL Open Specs', 'P2P Alerts', '0% Non-Profit'],
  },
};

export default async function SubdomainNodePage({
  params,
}: {
  params: Promise<{ locale: string; subdomain: string }>;
}) {
  const { locale, subdomain } = await params;
  if (subdomain.toLowerCase() === 'sabiobosque') {
    notFound();
  }

  const normalized = subdomain.toLowerCase() === 'cannabis' ? 'cannasavias' : subdomain.toLowerCase();
  const node = VALID_SUBDOMAINS[normalized];
  if (!node) {
    notFound();
  }

  const isEs = locale === 'es';
  const liveHref = `https://${normalized}.aldoarbizu.com`;

  return (
    <main className="min-h-screen bg-[#060709] text-[#F2F0EA] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8A93A6] hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEs ? 'Volver al Hub Principal' : 'Back to Principal Hub'}
          </Link>
          <span className="text-[11px] uppercase tracking-widest text-[#00E599] font-bold">
            NODE ONLINE // {normalized}.aldoarbizu.com
          </span>
        </div>

        <section className="p-6 sm:p-10 rounded-[2px] border border-[#1B202B] bg-[#0B0D12]">
          <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-[#1B202B]">
            {node.code ? (
              <ProductDynastyBadge code={node.code} className="w-11 h-11 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-[2px] border border-[#00E599]/50 bg-[#00E599]/10 flex items-center justify-center text-[#00E599]">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                {node.code ? `${node.code} // PRODUCTION SUBDOMAIN` : 'NON-PROFIT NODE'}
              </div>
              <div className="text-xs text-[#8A93A6]">{isEs ? node.roleEs : node.roleEn}</div>
            </div>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-[#F2F0EA] mb-4">
            {node.name}
          </h1>
          <p className="font-sans text-base text-[#C2C8D4] leading-relaxed mb-6">
            {isEs ? node.descEs : node.descEn}
          </p>

          {(node.noticeEs || node.noticeEn) && (
            <div className="mb-6 p-4 rounded-[2px] border border-[#FF4F00]/45 bg-[#FF4F00]/10 text-xs text-[#F2F0EA] leading-relaxed">
              {isEs ? node.noticeEs : node.noticeEn}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {node.stack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-[2px] border border-[#1B202B] bg-[#060709] text-[11px] text-[#C2C8D4]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] bg-[#FF4F00] hover:bg-[#D4AF37] text-[#07080A] font-extrabold font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <span>{isEs ? 'Abrir Plataforma en Vivo' : 'Launch Live Platform'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={`https://arbizulabs.com/products/${normalized}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] border border-[#1B202B] bg-[#060709] hover:border-[#D4AF37] text-[#F2F0EA] font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <span>{isEs ? 'Especificación Comercial B2B' : 'Commercial B2B Spec'}</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
