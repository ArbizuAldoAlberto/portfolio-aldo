'use server'

interface Deployment {
  name: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | string;
  url: string;
  created: number;
}

interface VercelStats {
  totalProjects: number;
  successDeployments: number;
  failedDeployments: number;
}

const fetchWithTimeout = async (url: string, token: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: controller.signal,
      next: { revalidate: 60 } // Cache deployments for 1 minute
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

export async function getDeployments(limit = 3): Promise<{ available: boolean, deployments: Deployment[] }> {
  const token = process.env.VERCEL_API_TOKEN
  
  if (!token) {
    return { available: false, deployments: [] }
  }

  try {
    const res = await fetchWithTimeout(`https://api.vercel.com/v6/deployments?limit=${limit}`, token)
    if (!res.ok) throw new Error('API Error')
    
    const data = await res.json()
    const deployments: Deployment[] = data.deployments.map((d: any) => ({
      name: d.name,
      state: d.state, // READY, ERROR, BUILDING
      url: `https://${d.url}`,
      created: d.created
    }))
    
    return { available: true, deployments }
  } catch (error) {
    console.error('Error fetching Vercel deployments:', error)
    return { available: false, deployments: [] }
  }
}

export async function getProjectStats(): Promise<{ available: boolean, stats: VercelStats }> {
  const token = process.env.VERCEL_API_TOKEN
  
  if (!token) {
    return { available: false, stats: { totalProjects: 0, successDeployments: 0, failedDeployments: 0 } }
  }

  try {
    // Fetch projects count
    const projRes = await fetchWithTimeout('https://api.vercel.com/v9/projects', token)
    let totalProjects = 0
    if (projRes.ok) {
      const projData = await projRes.json()
      totalProjects = projData.projects.length
    }

    // Fetch recent deployments to infer stats
    const depRes = await fetchWithTimeout('https://api.vercel.com/v6/deployments?limit=100', token)
    let successDeployments = 0
    let failedDeployments = 0
    
    if (depRes.ok) {
      const depData = await depRes.json()
      successDeployments = depData.deployments.filter((d: any) => d.state === 'READY').length
      failedDeployments = depData.deployments.filter((d: any) => d.state === 'ERROR').length
    }

    return { 
      available: true, 
      stats: { totalProjects, successDeployments, failedDeployments } 
    }
  } catch (error) {
    console.error('Error fetching Vercel stats:', error)
    return { available: false, stats: { totalProjects: 0, successDeployments: 0, failedDeployments: 0 } }
  }
}
