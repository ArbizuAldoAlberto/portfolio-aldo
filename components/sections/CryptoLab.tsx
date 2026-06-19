'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const COINS = ['hedera-hashgraph', 'tron', 'the-graph']
const SYMBOLS: Record<string, string> = { 'hedera-hashgraph': 'HBAR', 'tron': 'TRX', 'the-graph': 'GRT' }

export default function CryptoLab() {
  const t = useTranslations('CryptoLab')
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


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm mb-4 block">
          {t('sectionLabel')}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          {t('titleLine1')}<br/>{t('titleLine2')}
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
            {t('liveData')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="glass-surface p-6">
            <h3 className="font-serif text-xl text-white mb-2">{t('features.defi.title')}</h3>
            <p className="font-mono text-sm text-[var(--color-mist-gray)]">{t('features.defi.desc')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-surface p-6">
            <h3 className="font-serif text-xl text-white mb-2">{t('features.bots.title')}</h3>
            <p className="font-mono text-sm text-[var(--color-mist-gray)]">{t('features.bots.desc')}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
