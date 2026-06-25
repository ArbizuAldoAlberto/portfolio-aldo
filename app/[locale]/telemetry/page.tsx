import { getAllArticles } from '../../../lib/telemetry-loader';
import ArticleCard from '../../../components/ui/ArticleCard';
;
import RevealText from '../../../components/ui/RevealText';
import { Radar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Telemetry Reports | Aldo Arbizu',
  description: 'Artículos técnicos, blueprints y reportes de telemetría sobre ingeniería de software B2B.',
};

export default async function TelemetryIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const articles = await getAllArticles();
  
  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4 flex flex-col items-center justify-center text-center">
        <Radar size={48} className="text-[var(--color-mist-gray)]/30 mb-6 animate-pulse" />
        <h1 className="text-3xl font-serif text-white mb-4">{locale === 'en' ? 'No Telemetry Signal' : 'Sin Señal de Telemetría'}</h1>
        <p className="font-mono text-sm text-[var(--color-mist-gray)]">{locale === 'en' ? 'No reports found in the data vault.' : 'No se han encontrado reportes en la bóveda de datos.'}</p>
      </div>
    );
  }

  const featured = articles.find(a => a.meta.leadMagnet) || articles[0];
  const rest = articles.filter(a => a.meta.slug !== featured.meta.slug);

  return (
    <div className="min-h-screen pt-32 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-mist-gray)] hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {locale === 'en' ? 'Return to Home' : locale === 'zh' ? '返回主页' : 'Volver a Inicio'}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Radar size={16} className="text-[var(--color-orbital-teal)] animate-pulse" />
            <span className="font-space text-[var(--color-mist-gray)] uppercase tracking-widest text-sm">
              {locale === 'en' ? 'Knowledge Base' : 'Base de Conocimiento'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            <RevealText delay={0.2}>Telemetry Reports.</RevealText>
          </h1>
          <p className="max-w-2xl font-mono text-sm text-[var(--color-mist-gray)] leading-relaxed">
            {locale === 'en' ? 'Engineering reports, architecture post-mortems, and technical blueprints designed for CTOs and Product Engineers.' : 'Reportes de ingeniería, post-mortems de arquitectura y blueprints técnicos diseñados para CTOs y Product Engineers.'}
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-8">
          <ArticleCard article={featured.meta} featured={true} />
        </div>

        {/* Grid Rest */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article) => (
              <ArticleCard key={article.meta.slug} article={article.meta} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
