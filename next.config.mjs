/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Prevent browsers from caching HTML — stale HTML breaks client-side nav after a deploy.
        // Excludes /_next/ so hashed assets keep the immutable header below instead of
        // receiving both (every matching rule contributes, so an unscoped /(.*) would
        // emit two conflicting Cache-Control values on every static asset).
        source: '/((?!_next/).*)',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
      {
        // Hashed static assets are safe to cache forever. Mirrors public/_headers,
        // which is what Cloudflare actually serves these with.
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async redirects() {
    return [
      // Route rename — the page targets "debt snowball calculator" as its primary keyword
      { source: '/calculators/debt-payoff', destination: '/calculators/debt-snowball', permanent: true },

      // Cluster A — mortgage payoff consolidation
      { source: '/learn/extra-mortgage-payments-how-much-can-you-save', destination: '/learn/mortgage-payoff-strategies', permanent: true },
      { source: '/learn/how-to-save-on-mortgage-interest',               destination: '/learn/mortgage-payoff-strategies', permanent: true },
      { source: '/learn/biweekly-vs-monthly-mortgage-payments',          destination: '/learn/mortgage-payoff-strategies', permanent: true },
      // Cluster D — amortization consolidation
      { source: '/learn/what-is-loan-amortization',                      destination: '/learn/what-is-amortization',       permanent: true },
      // Cluster F — compound interest consolidation
      { source: '/learn/what-is-compound-interest',                      destination: '/learn/compound-interest-guide',    permanent: true },
      // Cluster G — avalanche/snowball consolidation
      { source: '/learn/avalanche-vs-snowball-debt-payoff',              destination: '/learn/debt-avalanche-vs-snowball', permanent: true },
      { source: '/learn/avalanche-vs-snowball-comparison',               destination: '/learn/debt-avalanche-vs-snowball', permanent: true },
      // Cluster I — car loan mechanics consolidation
      { source: '/learn/car-loan-term-length-guide',                     destination: '/learn/how-car-loan-interest-works', permanent: true },
      { source: '/learn/car-loan-down-payment-guide',                    destination: '/learn/how-car-loan-interest-works', permanent: true },
      // Cluster J — car loan rate consolidation
      { source: '/learn/dealer-financing-vs-bank-loan',                  destination: '/learn/how-to-get-best-car-loan-rate', permanent: true },
      // Cluster K — new vs used consolidation
      { source: '/learn/new-car-vs-used-car-loan',                       destination: '/learn/new-vs-used-car-loan',       permanent: true },
      // Malformed URL crawled by Googlebot
      { source: '/&',                                                     destination: '/',                                 permanent: true },
    ]
  },
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
