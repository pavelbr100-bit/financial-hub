import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/saved'],
    },
    sitemap: 'https://finwiser.net/sitemap.xml',
  }
}
