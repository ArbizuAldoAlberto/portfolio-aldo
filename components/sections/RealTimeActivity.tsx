'use client'
import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { GitCommit, Code2, Rocket, Folders, Star, GitFork, AlertCircle, CheckCircle2, Clock, TerminalSquare } from 'lucide-react'
import { getRecentCommits, getTopLanguages, getContributionStreak, getRepoStats } from '../../lib/github-api'

export default function RealTimeActivity() {
  const [loading, setLoading] = useState(true)
  const [githubUser] = useState('aldoarbizu') // Puede venir de env pero para cliente mejor hardcodeado seguro
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      try {
        const [commitsRes, langsRes, streakRes, statsRes] = await Promise.all([
          getRecentCommits(githubUser, 5),
          getTopLanguages(githubUser),
          getContributionStreak(githubUser),
          getRepoStats(githubUser)
        ])
        
        if (isMounted) {
          setData({
            commits: commitsRes,
            langs: langsRes,
            streak: streakRes,
            repoStats: statsRes
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to load telemetry:', error)
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [githubUser])

  // Helper function to format relative time
  const timeAgo = (dateString: string | number) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'hace instantes'
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`
    return `hace ${Math.floor(diffInSeconds / 86400)} d`
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 70, damping: 15 } }
  }

  if (loading || !data) {
    return (
      <div className="grid md:grid-cols-12 gap-6 animate-pulse" aria-live="polite" aria-busy="true">
        <div className="md:col-span-7 h-64 glass-surface rounded-lg bg-white/5 border-l-4 border-l-[var(--color-orbital-teal)]/30"></div>
        <div className="md:col-span-5 h-64 glass-surface rounded-lg bg-white/5 border-l-4 border-l-[var(--color-electric-purple)]/30"></div>
        <div className="md:col-span-12 h-48 glass-surface rounded-lg bg-white/5 border-l-4 border-l-[var(--color-amber-gold)]/30"></div>
      </div>
    )
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid md:grid-cols-12 gap-6"
      aria-live="polite"
    >
      {/* Card 1: GitHub Activity */}
      <motion.div variants={itemVariants} className="md:col-span-7 glass-surface p-6 md:p-8 border-l-4 border-l-[var(--color-orbital-teal)] flex flex-col justify-between hover:border-l-[var(--color-orbital-teal)]/80 transition-colors">
        <div className="flex justify-between items-start mb-6 border-b border-[var(--color-space-border)]/50 pb-4">
          <div className="flex items-center gap-3">
            <GitCommit size={20} className="text-[var(--color-orbital-teal)]" />
            <h3 className="font-serif text-2xl text-white">GitHub Activity</h3>
          </div>
          {data.streak.available ? (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 font-space text-[10px] font-bold tracking-wider">
              🔥 {data.streak.streak} DÍAS CONSECUTIVOS
            </span>
          ) : (
             <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 font-space text-[10px] font-bold tracking-wider">
              <AlertCircle size={10} /> API LIMIT
            </span>
          )}
        </div>

        <div className="space-y-4 flex-1">
          {data.commits.available && data.commits.commits.length > 0 ? (
            data.commits.commits.map((commit: any, i: number) => (
              <div key={i} className="flex justify-between items-start group">
                <div className="flex-1">
                  <a href={commit.url} target="_blank" rel="noreferrer" className="text-white hover:text-[var(--color-orbital-teal)] font-mono text-xs transition-colors line-clamp-1">
                    {commit.message}
                  </a>
                  <span className="text-[9px] font-space text-[var(--color-mist-gray)]/50 uppercase tracking-widest mt-1 block">
                    {commit.repo}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-mist-gray)] whitespace-nowrap pl-4">
                  {timeAgo(commit.date)}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--color-mist-gray)]/50">
              <AlertCircle size={24} className="mb-2 opacity-50" />
              <span className="font-mono text-xs text-center">GitHub API no disponible.<br/>Mostrando datos en caché.</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Card 2: Top Languages */}
      <motion.div variants={itemVariants} className="md:col-span-5 glass-surface p-6 md:p-8 border-l-4 border-l-[var(--color-electric-purple)] flex flex-col hover:border-l-[var(--color-electric-purple)]/80 transition-colors">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-space-border)]/50 pb-4">
          <Code2 size={20} className="text-[var(--color-electric-purple)]" />
          <h3 className="font-serif text-2xl text-white">Top Languages</h3>
        </div>

        <div className="space-y-5 flex-1 flex flex-col justify-center">
          {data.langs.available && data.langs.languages.length > 0 ? (
            data.langs.languages.map((lang: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-white">{lang.name}</span>
                  <span className="text-[var(--color-mist-gray)]">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-[var(--color-space-black)] h-1.5 rounded-full overflow-hidden border border-[var(--color-space-border)]/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full" 
                    style={{ backgroundColor: lang.color }} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-[var(--color-mist-gray)]/50 font-mono text-xs text-center">
              Datos de lenguajes temporalmente inactivos.
            </div>
          )}
        </div>
      </motion.div>



      {/* Card 4: Repo Stats */}
      <motion.div variants={itemVariants} className="md:col-span-12 glass-surface p-6 md:p-8 border-l-4 border-l-[var(--color-amber-gold)] flex flex-col hover:border-l-[var(--color-amber-gold)]/80 transition-colors">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--color-space-border)]/50 pb-4">
          <Folders size={20} className="text-[var(--color-amber-gold)]" />
          <h3 className="font-serif text-2xl text-white">Repository Stats</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-[var(--color-mist-gray)]">
              <Folders size={14} />
              <span className="font-space text-[9px] uppercase tracking-widest">Total Repos</span>
            </div>
            <span className="font-mono text-3xl text-white">{data.repoStats.available ? data.repoStats.stats.totalRepos : '0'}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-[var(--color-mist-gray)]">
              <Star size={14} className="text-yellow-400" />
              <span className="font-space text-[9px] uppercase tracking-widest">Estrellas</span>
            </div>
            <span className="font-mono text-3xl text-white">{data.repoStats.available ? data.repoStats.stats.stars : '0'}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-[var(--color-mist-gray)]">
              <GitFork size={14} className="text-[var(--color-orbital-teal)]" />
              <span className="font-space text-[9px] uppercase tracking-widest">Forks</span>
            </div>
            <span className="font-mono text-3xl text-white">{data.repoStats.available ? data.repoStats.stats.forks : '0'}</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 text-[var(--color-mist-gray)]">
              <AlertCircle size={14} className="text-red-400" />
              <span className="font-space text-[9px] uppercase tracking-widest">Issues</span>
            </div>
            <span className="font-mono text-3xl text-white">{data.repoStats.available ? data.repoStats.stats.issues : '0'}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
