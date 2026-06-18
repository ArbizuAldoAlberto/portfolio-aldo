'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body style={{ backgroundColor: '#050508', color: 'white', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '40px', border: '1px solid #ff333333', borderRadius: '8px', background: '#000' }}>
          <h1 style={{ color: '#ff4444', marginBottom: '16px' }}>FATAL SYSTEM ERROR</h1>
          <p style={{ color: '#888', marginBottom: '32px', fontSize: '14px' }}>
            {error.message || 'El núcleo de enrutamiento de Next.js ha colapsado.'}
          </p>
          <button 
            onClick={() => reset()}
            style={{ background: 'transparent', color: 'white', border: '1px solid #444', padding: '12px 24px', cursor: 'pointer', fontFamily: 'monospace', textTransform: 'uppercase' }}
          >
            Hard Reset
          </button>
        </div>
      </body>
    </html>
  )
}
