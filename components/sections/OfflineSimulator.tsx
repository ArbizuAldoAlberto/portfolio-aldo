'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Database, RefreshCw, Send, AlertTriangle, ShieldAlert, ShoppingCart, Cpu } from 'lucide-react'

interface QueueItem {
  id: string
  entity: 'incidents' | 'cart' | 'alerts'
  operation: 'create' | 'update' | 'delete'
  payload: string
  status: 'pending' | 'syncing' | 'synced'
  timestamp: string
}

export default function OfflineSimulator() {
  const [isConnected, setIsConnected] = useState(true)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [syncedItems, setSyncedItems] = useState<QueueItem[]>([])
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM: Arbizu Labs Offline-First Sync Core v1.2 initialized.',
    'NETWORK: Connected to Firebase Realtime Database. Sync engine idle.'
  ])

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-8), `${new Date().toLocaleTimeString()} - ${msg}`])
  }

  // Handle automatic syncing when connection is restored
  useEffect(() => {
    if (isConnected && queue.length > 0) {
      addLog('NETWORK: Connection restored! Initiating background queue sync...')
      
      const syncInterval = setTimeout(async () => {
        // Sync items one by one with micro-delays
        let tempQueue = [...queue]
        for (let i = 0; i < tempQueue.length; i++) {
          const item = tempQueue[i]
          
          // Set to syncing status
          setQueue(prev => 
            prev.map(q => q.id === item.id ? { ...q, status: 'syncing' } : q)
          )
          addLog(`SYNC: Syncing ${item.entity}/${item.id} to Firebase...`)
          
          await new Promise(r => setTimeout(r, 600))
          
          // Complete sync
          addLog(`SYNC: Successfully pushed ${item.entity}/${item.id} -> Cloud DB.`)
          setSyncedItems(prev => [...prev, { ...item, status: 'synced' }])
        }
        
        setQueue([])
        addLog('SYSTEM: Sychronization complete. SQLite local sync queue is empty.')
      }, 800)

      return () => clearTimeout(syncInterval)
    }
  }, [isConnected, queue])

  const simulateAction = (type: 'gps_spoof' | 'techzone_cart' | 'sensor_alert') => {
    const id = `item_${Math.floor(Math.random() * 9000) + 1000}`
    const timestamp = new Date().toLocaleTimeString()
    
    let newItem: QueueItem;

    if (type === 'gps_spoof') {
      newItem = {
        id,
        entity: 'incidents',
        operation: 'create',
        payload: JSON.stringify({ type: 'gps_spoof', guard: 'Aldo Arbizu', coords: '-36.234,-61.112' }),
        status: isConnected ? 'synced' : 'pending',
        timestamp
      }
      addLog(`SQLite: Intercepted spoofing! Saved critical spoofing incident locally inside SQLite.`)
    } else if (type === 'techzone_cart') {
      newItem = {
        id,
        entity: 'cart',
        operation: 'create',
        payload: JSON.stringify({ item: 'Terminal Rugged Honeywell', price: '450.00' }),
        status: isConnected ? 'synced' : 'pending',
        timestamp
      }
      addLog(`SQLite: Offline purchase captured. Cart item queued in SQLite local storage.`)
    } else {
      newItem = {
        id,
        entity: 'alerts',
        operation: 'create',
        payload: JSON.stringify({ sensor: 'Main Hallway Gate', trigger: 'Panic Button' }),
        status: isConnected ? 'synced' : 'pending',
        timestamp
      }
      addLog(`SQLite: Security alarm enqueued. Saved into sync_queue database shelf.`)
    }

    if (isConnected) {
      addLog(`NETWORK: Active internet connection detected. Bypassing queue, writing directly to Firebase.`)
      setSyncedItems(prev => [...prev.slice(-4), newItem])
    } else {
      addLog(`QUEUE: Offline-mode active. Appending to SQLite sync_queue. Max persistence enabled.`)
      setQueue(prev => [...prev, newItem])
    }
  }

  return (
    <section id="offline-simulator" className="relative py-32 border-t border-[var(--color-space-border)] bg-[var(--color-space-black)]">
      <div className="absolute top-0 left-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        02.5
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          Laboratorio Interactivo
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          Offline-First Live Simulator
        </h2>
        <p className="font-mono text-sm text-[var(--color-mist-gray)] max-w-2xl mb-16 leading-relaxed">
          Experimenta cómo funcionan mis arquitecturas de resiliencia móvil en el campo real. Togglea el estado de red, dispara acciones de seguridad o compras, y observa la sincronización en vivo con Firebase en segundo plano.
        </p>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* CONTROL BOX: 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between glass-surface p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Cpu size={120} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-8 border-b border-[var(--color-space-border)] pb-6">
                <span className="font-space text-xs text-[var(--color-mist-gray)] uppercase tracking-wider">Estado de Red</span>
                
                <button 
                  onClick={() => setIsConnected(!isConnected)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    isConnected 
                      ? 'border-green-500/20 bg-green-500/10 text-green-400' 
                      : 'border-red-500/20 bg-red-500/10 text-red-400'
                  }`}
                >
                  {isConnected ? <Wifi size={16} className="animate-pulse" /> : <WifiOff size={16} />}
                  <span className="font-space text-xs font-bold tracking-widest uppercase">
                    {isConnected ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-serif text-lg text-white mb-4">Simular disparadores de App</h3>
                
                <button 
                  onClick={() => simulateAction('gps_spoof')}
                  className="w-full flex items-center justify-between p-4 border border-[var(--color-space-border)] hover:border-red-500/40 hover:bg-white/[0.02] text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-mono text-sm text-white font-medium">GPS Spoofing Alert</div>
                      <div className="font-space text-[10px] text-[var(--color-mist-gray)]/60">SentinelOS Cheating Detector</div>
                    </div>
                  </div>
                  <Send size={14} className="text-[var(--color-mist-gray)]" />
                </button>

                <button 
                  onClick={() => simulateAction('techzone_cart')}
                  className="w-full flex items-center justify-between p-4 border border-[var(--color-space-border)] hover:border-[var(--color-orbital-teal)]/40 hover:bg-white/[0.02] text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} className="text-[var(--color-orbital-teal)] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-mono text-sm text-white font-medium">Add Cart Item</div>
                      <div className="font-space text-[10px] text-[var(--color-mist-gray)]/60">TechZone Store Sync</div>
                    </div>
                  </div>
                  <Send size={14} className="text-[var(--color-mist-gray)]" />
                </button>

                <button 
                  onClick={() => simulateAction('sensor_alert')}
                  className="w-full flex items-center justify-between p-4 border border-[var(--color-space-border)] hover:border-[var(--color-amber-gold)]/40 hover:bg-white/[0.02] text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={20} className="text-[var(--color-amber-gold)] group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-mono text-sm text-white font-medium">Panic Alarm Event</div>
                      <div className="font-space text-[10px] text-[var(--color-mist-gray)]/60">VigiTrack Emergency Sync</div>
                    </div>
                  </div>
                  <Send size={14} className="text-[var(--color-mist-gray)]" />
                </button>
              </div>
            </div>

            <div className="border-t border-[var(--color-space-border)] pt-6">
              <span className="font-space text-[10px] text-[var(--color-mist-gray)]/50 block mb-2">TELEMETRÍA LOCAL CORE:</span>
              <div className="bg-black/40 p-4 font-mono text-[10px] text-[var(--color-mist-gray)] overflow-y-auto h-32 space-y-1">
                {logs.map((log, index) => (
                  <div key={index} className={
                    log.includes('CRITICAL') || log.includes('Spoof') ? 'text-red-400' :
                    log.includes('Successfully') || log.includes('complete') ? 'text-green-400' :
                    log.includes('Offline-mode') ? 'text-[var(--color-amber-gold)]' :
                    'text-[var(--color-mist-gray)]'
                  }>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TELEMETRY VISUAL DATABASE SHELF: 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* SQLITE local db representation */}
            <div className="glass-surface p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-[var(--color-space-border)] pb-4 mb-4">
                  <Database size={18} className="text-[var(--color-orbital-teal)]" />
                  <span className="font-space text-xs text-white uppercase tracking-widest font-bold">Base de Datos Local SQLite</span>
                </div>
                
                <div className="overflow-x-auto min-h-[140px]">
                  <table className="w-full font-mono text-xs text-left">
                    <thead>
                      <tr className="border-b border-[var(--color-space-border)]/50 text-[var(--color-mist-gray)]/60">
                        <th className="py-2 px-3">Item ID</th>
                        <th className="py-2 px-3">Módulo</th>
                        <th className="py-2 px-3">Operación</th>
                        <th className="py-2 px-3">Payload Simulado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {queue.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-[var(--color-mist-gray)]/40 italic">
                              SQLite Sync Queue está limpia. No hay registros pendientes de red.
                            </td>
                          </tr>
                        ) : (
                          queue.map(item => (
                            <motion.tr 
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="border-b border-[var(--color-space-border)]/20 hover:bg-white/[0.01]"
                            >
                              <td className="py-2 px-3 text-white font-semibold">{item.id}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                  item.entity === 'incidents' ? 'bg-red-950 border border-red-500/20 text-red-400' :
                                  item.entity === 'cart' ? 'bg-teal-950 border border-teal-500/20 text-teal-400' :
                                  'bg-amber-950 border border-amber-500/20 text-amber-400'
                                }`}>
                                  {item.entity}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-[var(--color-mist-gray)]">{item.operation}</td>
                              <td className="py-2 px-3 text-[var(--color-mist-gray)]/60 truncate max-w-[200px]" title={item.payload}>
                                {item.payload}
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-mist-gray)]/40 mt-4 border-t border-[var(--color-space-border)]/20 pt-4">
                <span>SQLITE TRANSACTION LAYER ACTIVE</span>
                <span>TABLES: [sync_queue, config, cache]</span>
              </div>
            </div>

            {/* FIREBASE RTDB Cloud database representation */}
            <div className="glass-surface p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-[var(--color-space-border)] pb-4 mb-4">
                  <RefreshCw size={18} className="text-[var(--color-electric-purple)] animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-space text-xs text-white uppercase tracking-widest font-bold">Servidor Cloud Firebase RTDB</span>
                </div>
                
                <div className="overflow-x-auto min-h-[140px]">
                  <table className="w-full font-mono text-xs text-left">
                    <thead>
                      <tr className="border-b border-[var(--color-space-border)]/50 text-[var(--color-mist-gray)]/60">
                        <th className="py-2 px-3">Push ID</th>
                        <th className="py-2 px-3">Módulo</th>
                        <th className="py-2 px-3">Ubicación DB</th>
                        <th className="py-2 px-3">Estado de Sync</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {syncedItems.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-[var(--color-mist-gray)]/40 italic">
                              Esperando flujos de sincronización de datos...
                            </td>
                          </tr>
                        ) : (
                          syncedItems.slice(-4).map(item => (
                            <motion.tr 
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="border-b border-[var(--color-space-border)]/20 hover:bg-white/[0.01]"
                            >
                              <td className="py-2 px-3 text-[var(--color-electric-purple)] font-semibold">{item.id}</td>
                              <td className="py-2 px-3 uppercase text-[10px] text-[var(--color-mist-gray)]">{item.entity}</td>
                              <td className="py-2 px-3 text-[var(--color-mist-gray)]/60">{`prod/rt/${item.entity}/${item.id}`}</td>
                              <td className="py-2 px-3">
                                <span className="flex items-center gap-1.5 text-green-400 font-medium">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                                  Sincronizado
                                </span>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-[var(--color-mist-gray)]/40 mt-4 border-t border-[var(--color-space-border)]/20 pt-4">
                <span>SECURE DATABASE INBOUND GATEWAY ACTIVE</span>
                <span>AUTH CLAIMS: [orgId, custom_claims]</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
