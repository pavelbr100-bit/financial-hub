import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'
import { allCalculatorHrefs } from '@/lib/calculators'

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
      url: `${base}/calculators`,
      lastModified: new Date('2026-08-06'),
      changeFrequency: 'weekly',
      priority: 0.9,
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

  // Generated from lib/calculators.ts so a new calculator cannot be added to the
  // site and silently left out of the sitemap.
  const calculatorPages: MetadataRoute.Sitemap = allCalculatorHrefs().map(href => ({
    url: `${base}${href}`,
    lastModified: new Date('2026-08-06'),
    changeFrequency: 'monthly' as const,
    priority: href.startsWith('/calculators/mortgage/') ? 0.8 : 0.9,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${base}/learn/${article.slug}`,
    lastModified: parseDate(article.updated ?? article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...calculatorPages, ...articlePages]
}
