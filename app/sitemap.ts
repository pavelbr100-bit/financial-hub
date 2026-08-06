import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://finwiser.net'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date('2026-07-02'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/calculators/mortgage`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/car-loan`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/loan-amortization`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/debt-snowball`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/compound-interest`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/biweekly-mortgage`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${base}/calculators/mortgage/compare`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/north-carolina`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/south-carolina`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/georgia`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/florida`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/texas`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/calculators/mortgage/virginia`,
      lastModified: new Date('2026-05-30'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/learn`,
      lastModified: new Date('2026-05-27'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: new Date('2026-06-07'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date('2026-06-07'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${base}/how-it-works`,
      lastModified: new Date('2026-05-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date('2026-07-02'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date('2026-07-02'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${base}/learn/${article.slug}`,
    lastModified: parseDate(article.updated ?? article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...articlePages]
}
