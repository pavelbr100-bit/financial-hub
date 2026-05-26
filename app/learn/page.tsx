import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Personal Finance Guides | FinWiser Learn',
  description: 'Free guides on mortgages, compound interest, debt payoff strategies, and loan amortization. Learn how to make smarter financial decisions.',
}

const categoryStyles: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky:     'bg-sky-100 text-sky-700',
  amber:   'bg-amber-100 text-amber-700',
  purple:  'bg-purple-100 text-purple-700',
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
            Practical guides on mortgages, investing, debt, and loans — written to help you understand your numbers, not just calculate them.
          </p>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-7 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[article.categoryColor]}`}>
                  {article.category}
                </span>
                <span className="text-xs text-slate-400">{article.readMinutes} min read</span>
              </div>
              <h2 className="text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed flex-1">
                {article.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-400">{article.date}</span>
                <span className="text-sm font-medium text-navy-600 group-hover:text-emerald-600 transition-colors">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>

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
