import { notFound } from 'next/navigation';
import { getArticleBySlug } from '../../../../lib/telemetry-loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import ArticleClientWrapper from './ArticleClientWrapper';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);
  if (!article) return { title: 'Report Not Found' };

  return {
    title: `${article.meta.title} | Aldo Arbizu`,
    description: article.meta.description,
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      images: [{ url: `/api/og?slug=${article.meta.slug}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta.title,
      description: article.meta.description,
      images: [`/api/og?slug=${article.meta.slug}`],
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const { meta, content } = article;

  return (
    <div className="min-h-screen pt-32 pb-20 relative bg-[#050508]">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute top-0 right-0 w-full h-[50vh] opacity-10 pointer-events-none blur-[150px]"
        style={{
          background: `radial-gradient(circle at top right, ${
            meta.persona === 'founder' ? 'var(--color-orbital-teal)' : 
            meta.persona === 'gentleman' ? 'var(--color-amber-gold)' : 
            'var(--color-electric-purple)'
          }, transparent 70%)`
        }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Link */}
        <Link href="/telemetry" className="inline-flex items-center gap-2 font-space text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)] hover:text-white transition-colors mb-12">
          <ArrowLeft size={14} /> Volver a Telemetría
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="font-space text-[10px] px-3 py-1 bg-white/5 border border-white/10 rounded-full uppercase tracking-widest text-[var(--color-orbital-teal)]">
              {meta.category}
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--color-mist-gray)] uppercase">
              <Calendar size={12} /> {meta.date}
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--color-mist-gray)] uppercase">
              <Clock size={12} /> {meta.readTime}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
            {meta.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags.map((tag) => (
              <span key={tag} className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--color-space-border)] text-[var(--color-mist-gray)] flex items-center gap-1">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-lg max-w-none font-serif text-[18px] leading-loose text-[#d0d6e0]
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-white
          prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-16 prose-h2:border-b prose-h2:border-[var(--color-space-border)] prose-h2:pb-4
          prose-h3:text-2xl prose-h3:text-[var(--color-mist-gray)]
          prose-a:text-[var(--color-orbital-teal)] prose-a:no-underline hover:prose-a:underline
          prose-code:font-mono prose-code:text-sm prose-code:bg-black/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/10
          prose-pre:bg-[#0a0a0f] prose-pre:border prose-pre:border-[var(--color-space-border)] prose-pre:p-6
          prose-strong:text-white prose-blockquote:border-l-[var(--color-orbital-teal)] prose-blockquote:bg-[var(--color-orbital-teal)]/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:text-[var(--color-mist-gray)] prose-blockquote:not-italic
        ">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* Lead Magnet Client Wrapper (if applicable) */}
        <ArticleClientWrapper title={meta.title} leadMagnet={meta.leadMagnet} />
        
      </div>
    </div>
  );
}
