import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE_URL, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/sync`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/items`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
