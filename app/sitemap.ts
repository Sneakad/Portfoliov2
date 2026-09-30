import type { MetadataRoute } from 'next';
import { homeProjects } from '@/data/home';
import { SITE_URL, projectUrl } from '@/data/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...homeProjects.map((p) => ({
      url: projectUrl(p),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
