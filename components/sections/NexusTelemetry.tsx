'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal as TerminalIcon, Cpu, Layers, Wifi, CheckCircle2, ShieldAlert, Play, RefreshCw, AlertCircle, Coins, Workflow, Brain } from 'lucide-react'
import { useCursor } from '../theme/CursorContext'

interface ConsoleLog {
  text: string
  type: 'system' | 'success' | 'warning' | 'info' | 'error'
}

export default function NexusTelemetry() {
  const { setCursorState } = useCursor()
  const [activeTab, setActiveTab] = useState<'status' | 'skills' | 'terminal'>('status')
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

  const runSimulatedScript = async (script: 'integrity' | 'security' | 'titan') => {
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
      addTerminalLog('Phase 5: Checking 76 skills and multi-project config... OK', 'info')
      await new Promise(r => setTimeout(r, 700))
      addTerminalLog('============================================================', 'system')
      addTerminalLog('  [PASS] Passed:   150', 'success')
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
    } else {
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
    }
    
    setIsRunningScript(false)
  }

  return (
    <section id="nexus-telemetry" className="relative py-32 border-t border-[var(--color-space-border)] bg-[var(--color-space-black)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        07
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="h-2 w-2 rounded-full bg-[var(--color-orbital-teal)] animate-ping"></span>
          <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm block">
            NEXUS Autonomous Node
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          Sistema Autónomo de Supervisión
        </h2>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] max-w-3xl mb-12 leading-relaxed">
          Este sitio web y todos los repositorios activos de Antigravity Studio están integrados localmente bajo la supervisión de <strong>NEXUS</strong>, un super-agente agéntico personalizado que coordina compilaciones, despliegues, seguridad perimetral y supervisión financiera automatizada.
        </p>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--color-space-border)] mb-8 font-space text-xs">
          {[
            { id: 'status', label: 'Estatus del Sistema', icon: Brain },
            { id: 'skills', label: 'Distribución de Habilidades', icon: Layers },
            { id: 'terminal', label: 'Terminal Interactiva', icon: TerminalIcon }
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
                className="grid md:grid-cols-12 gap-6"
              >
                {/* System Status Bento Card */}
                <div className="md:col-span-8 glass-surface p-8 border-l-4 border-l-[var(--color-orbital-teal)] flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-serif text-2xl text-white">NEXUS Core Integration</h3>
                        <span className="font-mono text-xs text-[var(--color-mist-gray)]/50">Node: Local-Host-AR</span>
                      </div>
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 font-space text-[10px] font-bold tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        ONLINE
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 font-mono text-xs mb-8">
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">IA Engine:</span>
                          <span className="text-white font-bold">Gemini 2.5 Pro</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">Integrity Status:</span>
                          <span className="text-green-400 font-bold">150/150 Checks [PASS]</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">Active Skills:</span>
                          <span className="text-white font-bold">76 Registered</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">Security Gate:</span>
                          <span className="text-[var(--color-orbital-teal)] font-bold">DefenseClaw Enabled</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">Obsidian Vault:</span>
                          <span className="text-white font-bold">Synced (WikiLinks)</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--color-space-border)]/50 pb-2">
                          <span className="text-[var(--color-mist-gray)]">n8n Flows:</span>
                          <span className="text-white font-bold">5 Webhooks Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--color-space-black)]/50 border border-[var(--color-space-border)] p-4 rounded font-mono text-xs text-[var(--color-mist-gray)]">
                    <span className="text-[var(--color-orbital-teal)] font-bold">COGNITIVE_ENGRAM:</span> "Supervisor agéntico en modo Dios. Sincronización continua de conocimiento entre la bóveda de Obsidian y los flujos de CI/CD locales."
                  </div>
                </div>

                {/* Subsystem widgets */}
                <div className="md:col-span-4 space-y-6">
                  {/* TITAN status */}
                  <div className="glass-surface p-6 border-l-4 border-l-[var(--color-amber-gold)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-white font-serif font-bold text-lg">
                        <Coins size={18} className="text-[var(--color-amber-gold)]" />
                        <span>TITAN Supervisor</span>
                      </div>
                      <span className="font-space text-[9px] text-[var(--color-amber-gold)] uppercase tracking-wider font-bold">ALPHA MODE</span>
                    </div>
                    <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed mb-4">
                      Bot de trading cuantitativo en régimen de momentum. Kelly sizing calibrado y monitoreo de riesgo on-chain.
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-mist-gray)]/60">
                      <span>Win Rate: 68.4%</span>
                      <span>Regimen: ADX &gt; 28</span>
                    </div>
                  </div>

                  {/* n8n integration */}
                  <div className="glass-surface p-6 border-l-4 border-l-[var(--color-electric-purple)]">
                    <div className="flex items-center gap-2 text-white font-serif font-bold text-lg mb-4">
                      <Workflow size={18} className="text-[var(--color-electric-purple)]" />
                      <span>n8n Workflows</span>
                    </div>
                    <p className="font-mono text-xs text-[var(--color-mist-gray)] leading-relaxed mb-4">
                      Automatización de CRM de leads, notificaciones de facturación de Stripe y reportes de telemetría a canales en caliente.
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-mist-gray)]/60">
                      <span>Tasks: 18 triggers/day</span>
                      <span>State: Nominales</span>
                    </div>
                  </div>
                </div>
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
                  { title: 'System Design', rate: 95, icon: Cpu, desc: 'Diseño y optimización de infraestructuras distribuidas y APIs escalables basadas en blueprints industriales.' },
                  { title: 'UI-UX Pro Max', rate: 92, icon: Layers, desc: 'Patrones estéticos avanzados, Bento grids, diseño HSL responsivo y micro-interacciones de Awwwards-grade.' },
                  { title: 'Draco GLB WebGL', rate: 88, icon: RefreshCw, desc: 'Optimización poligonal en Blender, baking de iluminación y exportación reducida para carga 3D ultra rápida.' },
                  { title: 'DeFi & Web3 Integration', rate: 82, icon: Coins, desc: 'Conexión de contratos inteligentes, lectura on-chain y pasarelas de pago criptográficas descentralizadas.' },
                  { title: 'n8n & automation', rate: 95, icon: Workflow, desc: 'Flujos bidireccionales complejos, ETLs de datos, notificaciones cruzadas y bots de comunicación eficientes.' },
                  { title: 'Security by Design', rate: 90, icon: ShieldAlert, desc: 'Modelado de amenazas, auditoría estática anti-secrets, escaneo OWASP Mobile y reglas estrictas de bases de datos.' }
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
                    <h3 className="font-serif text-xl text-white mb-2">Simular Scripts de Agente</h3>
                    <p className="font-mono text-xs text-[var(--color-mist-gray)] mb-6 leading-relaxed">
                      Ejecutá los scripts del supervisor agéntico para observar cómo audita, valida y sincroniza el ecosistema en tiempo real.
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
                        <span>Ejecutando script de telemetría...</span>
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

          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
