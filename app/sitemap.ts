import { MetadataRoute } from 'next';
import { getAllArticles } from '../lib/telemetry-loader';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aldoarbizu.com';

  const staticRoutes = [
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/es/telemetry`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/telemetry`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const articles = await getAllArticles();
    dynamicRoutes = articles.flatMap(article => [
      {
        url: `${baseUrl}/es/telemetry/${article.meta.slug}`,
        lastModified: new Date(article.meta.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/en/telemetry/${article.meta.slug}`,
        lastModified: new Date(article.meta.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }
    ]);
  } catch (error) {
    console.error('Error generating sitemap dynamic routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
