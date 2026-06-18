import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getArticleBySlug } from '../../../lib/telemetry-loader';

// Se remueve 'edge' runtime para permitir el uso de fs dentro de getArticleBySlug.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const persona = searchParams.get('persona') || 'founder';

  const colors: Record<string, string> = {
    founder: '#00ff66',
    dev: '#00ccff',
    gentleman: '#d4af37'
  };

  const titles: Record<string, string> = {
    founder: 'ROI-Driven Product Engineer',
    dev: 'Offline-First Mobile Expert',
    gentleman: 'B2B SaaS Architect'
  };

  let titleText = 'Aldo Arbizu';
  let subtitleText = titles[persona] || titles.founder;
  let accentColor = colors[persona] || colors.founder;
  let isArticle = false;
  let categoryText = '';

  if (slug) {
    const article = await getArticleBySlug(slug);
    if (article) {
      titleText = article.meta.title;
      subtitleText = `Aldo Arbizu — ${article.meta.readTime} read`;
      accentColor = colors[article.meta.persona] || colors.founder;
      isArticle = true;
      categoryText = article.meta.category;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#050508',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '800px',
          height: '800px',
          backgroundImage: `radial-gradient(circle, ${accentColor}33 0%, transparent 70%)`,
          borderRadius: '50%',
        }} />

        {/* Badge */}
        <div style={{
          background: `${accentColor}15`,
          color: accentColor,
          padding: '8px 24px',
          border: `1px solid ${accentColor}40`,
          borderRadius: '24px',
          fontSize: '24px',
          fontFamily: 'monospace',
          marginBottom: '40px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ width: '12px', height: '12px', background: accentColor, borderRadius: '50%', marginRight: '16px' }}></span>
          {isArticle ? categoryText : 'NEXUS ACTIVE NODE'}
        </div>

        {/* Title */}
        <div style={{
          fontSize: isArticle ? '70px' : '110px',
          color: 'white',
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '1000px',
        }}>
          {titleText}
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '40px',
          color: '#8c9bb0',
          fontFamily: 'monospace',
          marginBottom: '80px',
        }}>
          {subtitleText}
        </div>

        {/* Logo/Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 'auto',
          fontSize: '36px',
          color: 'white',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: accentColor,
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            marginRight: '24px',
            borderRadius: '12px'
          }}>A</div>
          <span>Arbizu Labs</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
