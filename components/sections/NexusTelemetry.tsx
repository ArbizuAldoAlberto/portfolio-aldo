'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, Cpu, Layers, Wifi, CheckCircle2, ShieldAlert, Play, RefreshCw, AlertCircle, Coins, Workflow, Brain, Search, BookOpen } from 'lucide-react'
import { useCursor } from '../theme/CursorContext'
import RealTimeActivity from './RealTimeActivity'
import { getAllArticles, Article } from '../../lib/telemetry-loader'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface ConsoleLog {
  text: string
  type: 'system' | 'success' | 'warning' | 'info' | 'error'
}

export default function NexusTelemetry() {
  const t = useTranslations('NexusTelemetry')
  const { setCursorState } = useCursor()
  const [activeTab, setActiveTab] = useState<'status' | 'skills' | 'terminal' | 'reports'>('status')
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    getAllArticles().then(setArticles).catch(console.error)
  }, [])
  const [terminalLogs, setTerminalLogs] = useState<ConsoleLog[]>([
    { text: 'NEXUS v1.1.0-supreme initialized on local nodes.', type: 'system' },
    { text: 'COGNITIVE LAYER: Connected to local Obsidian Brain Vault.', type: 'info' },
    { text: 'Enter / help to list simulated automation commands.', type: 'system' }
  ])
  const [isRunningScript, setIsRunningScript] = useState(false)
  const [activeCommand, setActiveCommand] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalLogs])

  const addTerminalLog = (text: string, type: ConsoleLog['type'] = 'info') => {
    setTerminalLogs(prev => [...prev, { text, type }])
  }

  const runSimulatedScript = async (script: 'integrity' | 'security' | 'titan' | 'pixal3d' | 'career-ops' | 'verifier' | 'analyzer') => {
    if (isRunningScript) return
    setIsRunningScript(true)
    setTerminalLogs([])
    
    if (script === 'integrity') {
      setActiveCommand('python scripts/validate_deerflow.py')
      addTerminalLog('NEXUS > python scripts/validate_deerflow.py', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('Phase 1: Parsing extensions_config.json... OK', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('Phase 2: Checking cross-references in SKILL.md... OK', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('Phase 3: Verifying sandbox mounts & local paths... OK', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('Phase 4: Checking SOUL.md system design coherence... OK', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('Phase 5: Checking 77 skills and multi-project config... OK', 'info')
      await new Promise(r => setTimeout(r, 700))
      addTerminalLog('============================================================', 'system')
      addTerminalLog('  [PASS] Passed:   152', 'success')
      addTerminalLog('  [FAIL] Failed:   0', 'success')
      addTerminalLog('  [WARN] Warnings: 0', 'success')
      addTerminalLog('============================================================', 'system')
      addTerminalLog('INTEGRITY CHECK PASSED -- ALL SYSTEMS NOMINAL.', 'success')
    } else if (script === 'security') {
      setActiveCommand('scan_security_gate.sh --project=dark-orbital')
      addTerminalLog('NEXUS > scan_security_gate.sh --project=dark-orbital', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('SCANNING: Instantiating DefenseClaw security policies...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Scanning source files for hardcoded credentials...', 'info')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('AUDIT: Checking .gitignore file rules... [EXCLUDES .env*] OK', 'success')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Inspecting API schemas & endpoint parameters... OK', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('RESULT: 0 vulnerabilities found. 0 secrets leaked to git stage.', 'success')
      addTerminalLog('SYSTEM: Pre-commit security gate verified.', 'success')
    } else if (script === 'titan') {
      setActiveCommand('python -m titan.regime_detector')
      addTerminalLog('NEXUS > python -m titan.regime_detector', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('TITAN: Loading quantitative metrics from Binance/Bybit API...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('METRICS: ADX = 22.4 | Ranging Regime Predominating.', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('STRATEGY: Sniper / Ranger adaptive weights loaded.', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('RISK: Kelly Sizing set to 1.5% | Isolated Margin verified.', 'success')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('PORTFOLIO: Win Rate: 68.4% | Profit Factor: 2.15', 'success')
      addTerminalLog('TRADING STATE: Nominal. Supervisor idle.', 'success')
    } else if (script === 'pixal3d') {
      setActiveCommand('python inference.py --image input.png --decimation_target 100000 --texture_size 2048')
      addTerminalLog('NEXUS > python inference.py --image input.png --decimation_target 100000 --texture_size 2048', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('PIXAL3D: Loading neural rendering models (DinoV3 + MoGe-2)...', 'info')
      await new Promise(r => setTimeout(r, 800))
      addTerminalLog('PIXAL3D: Running fotorrealistic 3D reconstruction stage... [1536 resolution cascade]', 'info')
      await new Promise(r => setTimeout(r, 900))
      addTerminalLog('PIXAL3D: Applying mesh decimation target: 100,000 faces... OK', 'success')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('PIXAL3D: Baking combined diffuse & normal lighting to 2048x2048 PBR maps...', 'info')
      await new Promise(r => setTimeout(r, 800))
      addTerminalLog('PIXAL3D: Exporting optimized GLB asset (Draco compression enabled)...', 'info')
      await new Promise(r => setTimeout(r, 700))
      addTerminalLog('============================================================', 'system')
      addTerminalLog('  Vertices: 51,204 | Faces: 100,000 | Time taken: 8.42s', 'success')
      addTerminalLog('============================================================', 'system')
      addTerminalLog('RESULT: 3D asset generated successfully and verified for WebGL render.', 'success')
    } else if (script === 'verifier') {
      setActiveCommand('node scripts/nexus_pipeline_verifier.mjs')
      addTerminalLog('NEXUS > node scripts/nexus_pipeline_verifier.mjs', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('🔍 NEXUS PIPELINE VERIFIER: Iniciando auditoría de integridad...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📂 Archivo: data/pipeline.md', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Analizando filas de datos...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Verificando formato YYYY-MM-DD y estructura de 6 columnas... OK', 'success')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Verificando estados canónicos de career-ops... OK', 'success')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('AUDIT: Detectando ofertas duplicadas... OK', 'success')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('-------------------------------------------------------------', 'system')
      addTerminalLog('📊 Resumen de Integridad:', 'info')
      addTerminalLog('   - Filas de datos analizadas: 5', 'info')
      addTerminalLog('   - Errores encontrados: 0', 'success')
      addTerminalLog('   - Advertencias encontradas: 0', 'success')
      addTerminalLog('-------------------------------------------------------------', 'system')
      addTerminalLog('✅ AUDITORÍA EXITOSA: Todos los registros son íntegros y canónicos.', 'success')
    } else if (script === 'analyzer') {
      setActiveCommand('node scripts/nexus_pattern_analyzer.mjs')
      addTerminalLog('NEXUS > node scripts/nexus_pattern_analyzer.mjs', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('📊 NEXUS PATTERN ANALYZER: Iniciando análisis de embudo...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📈 FUNNEL DE CONVERSIÓN DE BÚSQUEDA:', 'info')
      addTerminalLog('   - Evaluated   : ████████████████████ [5] (100.0%)', 'info')
      addTerminalLog('   - Applied     :                      [0] (0.0%)', 'info')
      addTerminalLog('   - Responded   :                      [0] (0.0%)', 'info')
      addTerminalLog('   - Interview   :                      [0] (0.0%)', 'info')
      addTerminalLog('   - Offer       :                      [0] (0.0%)', 'info')
      addTerminalLog('   - Rejected    :                      [0] (0.0%)', 'info')
      addTerminalLog('   - Discarded   :                      [0] (0.0%)', 'info')
      addTerminalLog('   - SKIP        :                      [0] (0.0%)', 'info')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('⚡ MÉTRICAS DE EFICIENCIA:', 'info')
      addTerminalLog('   - Total Ofertas Escaneadas: 5', 'info')
      addTerminalLog('   - Tasa de Postulación: 0.0%', 'info')
      addTerminalLog('   - Tasa de Entrevista: 0.0%', 'info')
      addTerminalLog('   - Tasa de Oferta final: 0.0%', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📍 ANÁLISIS GEOGRÁFICO Y POLÍTICA DE COMPATIBILIDAD:', 'info')
      addTerminalLog('   - Vacantes con localización 100% compatible: 5/5 (100.0%)', 'success')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('🏷️ PALABRAS CLAVE PREDOMINANTES EN ROLES:', 'info')
      addTerminalLog('   - "product": 2 apariciones', 'info')
      addTerminalLog('   - "applied": 1 apariciones', 'info')
      addTerminalLog('   - "senior": 1 apariciones', 'info')
      addTerminalLog('   - "reactnext.js": 1 apariciones', 'info')
      addTerminalLog('   - "fullstack": 1 apariciones', 'info')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('💡 RECOMENDACIONES PROACTIVAS DE NEXUS:', 'warning')
      addTerminalLog('   👉 El flujo actual es estable. Continúe alimentando el escáner diariamente.', 'warning')
      addTerminalLog('=============================================================', 'system')
    } else {
      setActiveCommand('node scripts/nexus_job_scanner.mjs')
      addTerminalLog('NEXUS > node scripts/nexus_job_scanner.mjs', 'system')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('📡 NEXUS CAREER-OPS RADAR: Iniciando escaneo de portales...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📂 Configuración cargada: 4 portales (OpenAI, Vercel, Linear, Stripe).', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📋 Filtro de títulos (Positivo): [mobile, product, ai, react, next.js, frontend, fullstack]', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('📍 Filtro de localización (Permitido): [remote, us, argentina, latam]', 'info')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('🔍 Escaneando portales... OK (5 coincidencias encontradas)', 'info')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('============================================================', 'system')
      addTerminalLog('Applying de-duplication cache (scan-history.tsv)...', 'info')
      await new Promise(r => setTimeout(r, 500))
      addTerminalLog('✅ NUEVO COINCIDENTE: [Vercel] Senior React/Next.js Engineer - Remote, Argentina', 'success')
      addTerminalLog('⚠️  DUPLICADO (Ignorado): [OpenAI] Product Engineer - Applied AI', 'warning')
      addTerminalLog('⚠️  DUPLICADO (Ignorado): [Linear] Fullstack Product Engineer', 'warning')
      await new Promise(r => setTimeout(r, 600))
      addTerminalLog('============================================================', 'system')
      addTerminalLog('📊 Escaneo Finalizado: 5 encontradas | 1 nuevo agregado | 4 duplicados', 'success')
      addTerminalLog('Pipeline data/pipeline.md actualizado con éxito.', 'success')
    }
    
    setIsRunningScript(false)
  }

  return (
    <section id="nexus-telemetry" className="relative py-32 border-t border-[var(--color-space-border)] bg-[var(--color-space-black)]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-ping"></span>
          <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm block">
            {t('sectionLabel')}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          {t('title')}
        </h2>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
          {t('desc')}
        </p>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--color-space-border)] mb-8 font-space text-xs">
          {[
            { id: 'status', label: t('tabs.status'), icon: Brain, live: true },
            { id: 'skills', label: t('tabs.skills'), icon: Layers },
            { id: 'terminal', label: t('tabs.terminal'), icon: TerminalIcon },
            { id: 'reports', label: t('tabs.reports'), icon: BookOpen, live: true }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[var(--color-orbital-teal)] text-white bg-[var(--color-deep-space)]/30'
                    : 'border-transparent text-[var(--color-mist-gray)]/60 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.live && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 relative ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            
            {/* TAB: STATUS */}
            {activeTab === 'status' && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RealTimeActivity />
              </motion.div>
            )}

            {/* TAB: SKILLS */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  { title: t('skills.sysDesign.title'), rate: 95, icon: Cpu, desc: t('skills.sysDesign.desc') },
                  { title: t('skills.uiux.title'), rate: 92, icon: Layers, desc: t('skills.uiux.desc') },
                  { title: t('skills.assets3d.title'), rate: 90, icon: RefreshCw, desc: t('skills.assets3d.desc') },
                  { title: t('skills.aiOps.title'), rate: 96, icon: Search, desc: t('skills.aiOps.desc') },
                  { title: t('skills.n8n.title'), rate: 95, icon: Workflow, desc: t('skills.n8n.desc') },
                  { title: t('skills.security.title'), rate: 90, icon: ShieldAlert, desc: t('skills.security.desc') }
                ].map((skill, index) => {
                  const Icon = skill.icon
                  return (
                    <div key={index} className="glass-surface p-6 hover:border-[var(--color-space-border)]/50 transition-all group">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className="text-[var(--color-orbital-teal)] group-hover:scale-110 transition-transform" />
                          <h4 className="font-serif text-lg text-white">{skill.title}</h4>
                        </div>
                        <span className="font-mono text-xs text-[var(--color-orbital-teal)] font-bold">{skill.rate}%</span>
                      </div>
                      
                      <div className="w-full bg-[var(--color-space-black)] h-1 rounded-full overflow-hidden mb-4 border border-[var(--color-space-border)]">
                        <div className="bg-[var(--color-orbital-teal)] h-full" style={{ width: `${skill.rate}%` }}></div>
                      </div>

                      <p className="font-mono text-[11px] text-[var(--color-mist-gray)] leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  )
                })}
              </motion.div>
            )}

            {/* TAB: TERMINAL */}
            {activeTab === 'terminal' && (
              <motion.div
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Control Panel: 4 cols */}
                <div className="lg:col-span-4 flex flex-col justify-between glass-surface p-6">
                  <div>
                    <h3 className="font-serif text-xl text-white mb-2">{t('terminal.title')}</h3>
                    <p className="font-mono text-xs text-[var(--color-mist-gray)] mb-6 leading-relaxed">
                      {t('terminal.desc')}
                    </p>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => runSimulatedScript('integrity')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-orbital-teal)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>validate_deerflow.py</span>
                        <Play size={12} className="text-[var(--color-orbital-teal)]" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('security')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-electric-purple)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>scan_security_gate.sh</span>
                        <Play size={12} className="text-[var(--color-electric-purple)]" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('titan')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-amber-gold)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>regime_detector.py</span>
                        <Play size={12} className="text-[var(--color-amber-gold)]" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('pixal3d')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-coral-burn)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>inference.py</span>
                        <Play size={12} className="text-[var(--color-coral-burn)]" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('career-ops')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-orbital-teal)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>nexus_job_scanner.mjs</span>
                        <Play size={12} className="text-[var(--color-orbital-teal)]" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('verifier')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-green-500/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>nexus_pipeline_verifier.mjs</span>
                        <Play size={12} className="text-green-500" />
                      </button>

                      <button
                        onClick={() => runSimulatedScript('analyzer')}
                        disabled={isRunningScript}
                        className="w-full text-left p-3 border border-[var(--color-space-border)] hover:border-[var(--color-amber-gold)]/40 hover:bg-white/[0.01] transition-all flex items-center justify-between text-xs font-mono text-white cursor-pointer disabled:opacity-50"
                      >
                        <span>nexus_pattern_analyzer.mjs</span>
                        <Play size={12} className="text-[var(--color-amber-gold)]" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-space-border)] pt-4 mt-6 text-[10px] font-mono text-[var(--color-mist-gray)]/40">
                    <span>COGNITIVE GATEWAY v1.0</span>
                  </div>
                </div>

                {/* Console Output: 8 cols */}
                <div 
                  onMouseEnter={() => setCursorState('default')}
                  className="lg:col-span-8 bg-black border border-[var(--color-space-border)] rounded-lg p-6 font-mono text-xs flex flex-col justify-between min-h-[350px] relative overflow-hidden"
                >
                  <div className="absolute top-2 right-4 text-[9px] text-[var(--color-mist-gray)]/30 select-none">
                    NEXUS_SHELL
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[280px] scrollbar-thin">
                    {terminalLogs.map((log, index) => {
                      let colorClass = 'text-[var(--color-mist-gray)]'
                      if (log.type === 'system') colorClass = 'text-[var(--color-orbital-teal)]'
                      if (log.type === 'success') colorClass = 'text-green-400 font-bold'
                      if (log.type === 'warning') colorClass = 'text-[var(--color-amber-gold)]'
                      if (log.type === 'error') colorClass = 'text-red-400'
                      
                      return (
                        <div key={index} className={colorClass}>
                          {log.text}
                        </div>
                      )
                    })}
                    
                    {isRunningScript && (
                      <div className="flex items-center gap-2 text-white animate-pulse">
                        <RefreshCw size={12} className="animate-spin" />
                        <span>{t('terminal.running')}</span>
                      </div>
                    )}
                    
                    <div ref={terminalEndRef} />
                  </div>

                  <div className="border-t border-[var(--color-space-border)]/50 pt-4 mt-4 flex items-center gap-2 text-[var(--color-mist-gray)]/60">
                    <span>$</span>
                    <span className="text-white">{activeCommand || 'idle'}</span>
                    {!isRunningScript && <span className="h-4 w-2 bg-white animate-pulse"></span>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {articles.slice(0, 3).map((article) => (
                  <Link href={`/telemetry/${article.meta.slug}`} key={article.meta.slug} className="glass-surface p-6 hover:border-[var(--color-orbital-teal)]/30 transition-all group flex flex-col h-full cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/60">
                        {article.meta.category}
                      </span>
                      {article.meta.leadMagnet && (
                        <span className="h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-pulse"></span>
                      )}
                    </div>
                    <h4 className="font-serif text-xl text-white mb-3 group-hover:text-[var(--color-orbital-teal)] transition-colors">
                      {article.meta.title}
                    </h4>
                    <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed mb-6 flex-grow">
                      {article.meta.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-space-border)]">
                      <span className="font-mono text-[10px] text-[var(--color-mist-gray)] uppercase">{article.meta.date}</span>
                      <span className="font-space text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                        {t('reports.readBtn')}
                      </span>
                    </div>
                  </Link>
                ))}
                
                {articles.length === 0 && (
                  <div className="col-span-full py-12 text-center text-[var(--color-mist-gray)] font-mono text-sm">
                    {t('reports.loading')}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
