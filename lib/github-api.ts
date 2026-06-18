'use server'

interface GithubCommit {
  message: string;
  repo: string;
  date: string;
  url: string;
}

interface GithubRepoStats {
  totalRepos: number;
  stars: number;
  forks: number;
  issues: number;
}

interface TopLanguage {
  name: string;
  percentage: number;
  color: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Vue: '#41b883',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33'
}

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 600 } // Cache for 10 minutes
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function getRecentCommits(username: string, limit = 5): Promise<{ available: boolean, commits: GithubCommit[] }> {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${username}/events/public`)
    if (!res.ok) throw new Error('API Error')
    
    const events = await res.json()
    const pushEvents = events.filter((e: any) => e.type === 'PushEvent')
    
    const commits: GithubCommit[] = []
    
    for (const event of pushEvents) {
      if (commits.length >= limit) break
      for (const commit of event.payload.commits) {
        if (commits.length >= limit) break
        commits.push({
          message: commit.message.length > 50 ? commit.message.substring(0, 50) + '...' : commit.message,
          repo: event.repo.name.split('/')[1] || event.repo.name,
          date: event.created_at,
          url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
        })
      }
    }
    
    return { available: true, commits }
  } catch (error) {
    console.error('Error fetching commits:', error)
    return { available: false, commits: [] }
  }
}

export async function getTopLanguages(username: string): Promise<{ available: boolean, languages: TopLanguage[] }> {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    if (!res.ok) throw new Error('API Error')
    
    const repos = await res.json()
    const languageCounts: Record<string, number> = {}
    let totalSize = 0

    repos.forEach((repo: any) => {
      if (repo.language && !repo.fork) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + repo.size
        totalSize += repo.size
      }
    })

    const sortedLanguages = Object.entries(languageCounts)
      .map(([name, size]) => ({
        name,
        percentage: Math.round((size / totalSize) * 100) || 1,
        color: LANGUAGE_COLORS[name] || '#888888'
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)

    return { available: true, languages: sortedLanguages }
  } catch (error) {
    console.error('Error fetching languages:', error)
    return { available: false, languages: [] }
  }
}

export async function getContributionStreak(username: string): Promise<{ available: boolean, streak: number }> {
  // Calculating true streak requires GraphQL or deep event inspection which is rate limited.
  // We'll estimate based on recent events for this demo to save API calls.
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${username}/events/public`)
    if (!res.ok) throw new Error('API Error')
    
    const events = await res.json()
    const pushDates = new Set(
      events
        .filter((e: any) => e.type === 'PushEvent')
        .map((e: any) => new Date(e.created_at).toISOString().split('T')[0])
    )
    
    // Simplistic streak calculation based on recent 90 events (usually covers ~30 days max)
    let streak = 0;
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      
      if (pushDates.has(dateStr)) {
        streak++
      } else if (i !== 0) {
        // Break streak if not found and not today
        break
      }
    }

    return { available: true, streak }
  } catch (error) {
    console.error('Error fetching streak:', error)
    return { available: false, streak: 0 }
  }
}

export async function getRepoStats(username: string): Promise<{ available: boolean, stats: GithubRepoStats }> {
  try {
    const res = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`)
    if (!res.ok) throw new Error('API Error')
    
    const repos = await res.json()
    
    const stats: GithubRepoStats = {
      totalRepos: repos.length,
      stars: repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0),
      forks: repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0),
      issues: repos.reduce((acc: number, repo: any) => acc + repo.open_issues_count, 0)
    }

    return { available: true, stats }
  } catch (error) {
    console.error('Error fetching repo stats:', error)
    return { 
      available: false, 
      stats: { totalRepos: 0, stars: 0, forks: 0, issues: 0 } 
    }
  }
}
