'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMeta {
  title: string;
  slug: string;
  date: string;
  category: string;
  persona: 'founder' | 'dev' | 'gentleman';
  readTime: string;
  tags: string[];
  description: string;
  leadMagnet: boolean;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

const TELEMETRY_DIR = path.join(process.cwd(), 'data', 'telemetry');

export async function getAllArticles(): Promise<Article[]> {
  if (!fs.existsSync(TELEMETRY_DIR)) {
    return [];
  }

  const files = fs.readdirSync(TELEMETRY_DIR);
  
  const articles: Article[] = files
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(TELEMETRY_DIR, filename);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(rawContent);

      return {
        meta: {
          title: data.title,
          slug: data.slug,
          date: data.date,
          category: data.category,
          persona: data.persona,
          readTime: data.readTime,
          tags: data.tags || [],
          description: data.description,
          leadMagnet: data.leadMagnet || false,
        },
        content
      };
    })
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = path.join(TELEMETRY_DIR, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(rawContent);

  return {
    meta: {
      title: data.title,
      slug: data.slug,
      date: data.date,
      category: data.category,
      persona: data.persona,
      readTime: data.readTime,
      tags: data.tags || [],
      description: data.description,
      leadMagnet: data.leadMagnet || false,
    },
    content
  };
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(a => a.meta.leadMagnet) || null;
}
