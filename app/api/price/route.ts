import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids') || 'hedera-hashgraph,tron,the-graph'
    
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    
    if (!response.ok) {
      throw new Error('CoinGecko API failed')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 })
  }
}
