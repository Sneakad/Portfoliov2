import type { MetadataRoute } from 'next';
import { seo } from '@/data/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: seo.shortTitle,
    description: seo.description,
    start_url: '/',
    display: 'browser',
    background_color: '#F1F0EA',
    theme_color: '#111110',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      { src: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  };
}
