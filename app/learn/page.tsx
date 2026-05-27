import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'
import LearnArticles from '@/components/LearnArticles'

export const metadata: Metadata = {
  title: { absolute: 'Personal Finance Guides | FinWiser Learn' },
  description: 'Free personal finance guides on mortgages, loans, debt, and investing. Written clearly so you can understand your numbers, not just calculate them.',
  alternates: { canonical: 'https://finwiser.net/learn' },
  openGraph: {
    title: 'Personal Finance Guides | FinWiser Learn',
    description: 'Free guides on mortgages, compound interest, debt payoff strategies, and loan amortization. Learn how to make smarter financial decisions.',
    type: 'website',
    url: 'https://finwiser.net/learn',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FinWiser Learn — Personal Finance Guides' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Finance Guides | FinWiser Learn',
    description: 'Free guides on mortgages, compound interest, debt payoff strategies, and loan amortization.',
  },
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-navy-900 py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-3">FinWiser Learn</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Personal Finance, Explained Clearly
          </h1>
          <p className="text-navy-300 text-lg leading-relaxed">
            Practical guides on mortgages, investing, debt, loans, and auto financing — written to help you understand your numbers, not just calculate them.
          </p>
        </div>
      </div>

      {/* Articles + filters */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <LearnArticles articles={articles} />

        {/* Calculators CTA */}
        <div className="mt-14 bg-white rounded-2xl border border-slate-100 shadow-card p-8 text-center">
          <p className="text-slate-500 text-sm mb-2">Ready to run the numbers?</p>
          <h2 className="text-xl font-bold text-navy-900 mb-5">Use our free calculators alongside these guides</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/calculators/mortgage', label: 'Mortgage' },
              { href: '/calculators/compound-interest', label: 'Compound Interest' },
              { href: '/calculators/debt-payoff', label: 'Debt Payoff' },
              { href: '/calculators/loan-amortization', label: 'Loan Amortization' },
              { href: '/calculators/car-loan', label: 'Car Loan' },
            ].map(c => (
              <Link
                key={c.href}
                href={c.href}
                className="px-4 py-2 bg-navy-50 hover:bg-navy-100 text-navy-700 text-sm font-medium rounded-lg transition-colors"
              >
                {c.label} Calculator
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
