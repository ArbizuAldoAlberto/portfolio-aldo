import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getArticleBySlug } from '../../../lib/telemetry-loader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const persona = searchParams.get('persona') || 'founder';

  const colors: Record<string, string> = {
    founder: '#FF4F00',
    dev: '#00E599',
    gentleman: '#D4AF37',
  };

  const titles: Record<string, string> = {
    founder: 'Principal Systems Architect · Staff SRE',
    dev: 'Offline-First SQLite WAL & 60/60 RLS Engineer',
    gentleman: 'Sovereign B2B & Deterministic Quant Systems',
  };

  let titleText = 'Aldo Alberto Arbizu';
  let subtitleText = titles[persona] || titles.founder;
  let accentColor = colors[persona] || '#D4AF37';
  let isArticle = false;
  let categoryText = 'AXIOM SOVEREIGN // v3.1.0';

  if (slug) {
    const article = await getArticleBySlug(slug);
    if (article) {
      titleText = article.meta.title;
      subtitleText = `Aldo Arbizu · ${article.meta.readTime} read`;
      accentColor = colors[article.meta.persona] || '#D4AF37';
      isArticle = true;
      categoryText = article.meta.category;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#060709',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          color: '#F2F0EA',
          fontFamily: 'monospace',
          border: `2px solid ${accentColor}55`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1B202B',
            paddingBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#D4AF37',
              textTransform: 'uppercase',
            }}
          >
            {categoryText}
          </span>
          <span
            style={{
              fontSize: 18,
              color: '#00E599',
              fontWeight: 700,
              letterSpacing: '0.12em',
            }}
          >
            60/60 RLS · &lt;10MS · WAL ACID
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: isArticle ? 48 : 62,
              fontWeight: 800,
              lineHeight: 1.08,
              color: '#F2F0EA',
              letterSpacing: '-0.03em',
            }}
          >
            {titleText}
          </div>
          <div
            style={{
              fontSize: 26,
              color: accentColor,
              fontWeight: 600,
            }}
          >
            {subtitleText}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1B202B',
            paddingTop: '24px',
            fontSize: 18,
            color: '#8A93A6',
          }}
        >
          <span>ALDOARBIZU.COM // ARBIZULABS.COM</span>
          <span style={{ color: '#F2F0EA', fontWeight: 700 }}>BUENOS AIRES · GMT-3</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
