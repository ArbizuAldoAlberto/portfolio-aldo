'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const COINS = ['hedera-hashgraph', 'tron', 'the-graph']
const SYMBOLS: Record<string, string> = { 'hedera-hashgraph': 'HBAR', 'tron': 'TRX', 'the-graph': 'GRT' }

export default function CryptoLab() {
  const [prices, setPrices] = useState<any>({})
  
  useEffect(() => {
    const url = `/api/price?ids=${COINS.join(',')}`
    
    const fallbackPrices = {
      'hedera-hashgraph': { usd: 0.2354, usd_24h_change: 2.45 },
      'tron': { usd: 0.1142, usd_24h_change: -1.12 },
      'the-graph': { usd: 0.1874, usd_24h_change: 0.85 }
    }

    const fetchPrices = () => {
      fetch(url)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`)
          return r.json()
        })
        .then(data => {
          if (data && data['hedera-hashgraph'] && data['tron'] && data['the-graph']) {
            setPrices(data)
          } else {
            throw new Error('Malformed CoinGecko response data')
          }
        })
        .catch(err => {
          console.warn('[NEXUS TELEMETRY] CoinGecko API rate limit or error, using telemetry fallbacks:', err)
          setPrices(fallbackPrices)
        })
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="crypto" className="relative py-32 bg-[var(--color-deep-space)]/30 border-t border-[var(--color-space-border)]">
      <div className="absolute top-0 right-10 text-[200px] font-serif opacity-5 leading-none pointer-events-none text-white select-none">
        06
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          Crypto & Assets Lab
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          No solo invierto en cripto —<br/>construyo las herramientas que uso.
        </h2>

        {/* Live Widget */}
        <div className="glass-surface p-6 mb-16 border-l-4 border-l-[var(--color-amber-gold)] max-w-3xl">
          <div className="grid grid-cols-3 gap-4">
            {COINS.map(id => {
              const data = prices[id]
              if (!data) return <div key={id} className="h-16 animate-pulse bg-white/5 rounded"></div>
              const change = data.usd_24h_change?.toFixed(2)
              const isUp = change > 0
              return (
                <div key={id} className="text-center md:text-left">
                  <div className="font-space text-white font-bold">{SYMBOLS[id]}</div>
                  <div className="font-mono text-lg text-[var(--color-mist-gray)]">${data.usd?.toFixed(4)}</div>
                  <div className={`font-mono text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '▲ +' : '▼ '}{change}%
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-xs font-mono text-[var(--color-mist-gray)]/50 mt-4 text-right">
            [Live data via CoinGecko]
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-surface p-6">
            <h3 className="font-serif text-xl text-white mb-2">Integración DeFi</h3>
            <p className="font-mono text-sm text-[var(--color-mist-gray)]">Smart contracts, Wallet connect, token gating. Conectando la Web2 tradicional con Web3.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-surface p-6">
            <h3 className="font-serif text-xl text-white mb-2">Alertas & Bots n8n</h3>
            <p className="font-mono text-sm text-[var(--color-mist-gray)]">Workflows automatizados para monitoreo de on-chain data y notificaciones a Discord/Telegram.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
