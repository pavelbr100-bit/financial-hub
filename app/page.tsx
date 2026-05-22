import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Financial Calculators & Tools | FinanceHub',
}

const tools = [
  {
    href: '/calculators/loan-amortization',
    title: 'Loan Amortization Calculator',
    description:
      'Break down every payment into principal and interest. See exactly when your loan is paid off and how much total interest you will pay.',
    badge: 'Available',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    href: '#',
    title: 'Mortgage Calculator',
    description:
      'Estimate your monthly mortgage payments including taxes, insurance, and PMI. Compare different loan scenarios side by side.',
    badge: 'Coming soon',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '#',
    title: 'Compound Interest Calculator',
    description:
      'Watch your savings grow over time. Model different contribution amounts, frequencies, and annual return rates.',
    badge: 'Coming soon',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    href: '#',
    title: 'Debt Payoff Planner',
    description:
      'Choose between avalanche and snowball methods. Find the fastest, cheapest way to pay off all your debts.',
    badge: 'Coming soon',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'No spreadsheets required',
    description: 'Instant, accurate results — no Excel formulas to debug.',
    icon: '⚡',
  },
  {
    title: 'Free, always',
    description: 'Every calculator is free to use, no credit card needed.',
    icon: '🆓',
  },
  {
    title: 'Save your work',
    description: 'Create a free account to save and revisit your calculations.',
    icon: '💾',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Top AdSense banner */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-4">
        <AdBanner slot="1234567890" format="horizontal" />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                Free Financial Tools
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Make smarter{' '}
              <span className="text-emerald-400">financial decisions</span>{' '}
              with free calculators
            </h1>

            <p className="text-navy-200 text-lg leading-relaxed mb-8 max-w-xl">
              From loan amortization to compound interest — clear, accurate results with full breakdowns. No paywalls. No signup required.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/calculators/loan-amortization"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
              >
                Try Loan Calculator
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 px-6 py-3 border border-navy-500 hover:border-navy-300 text-navy-100 hover:text-white font-semibold rounded-lg transition-colors"
              >
                Create free account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">Financial Calculators</h2>
          <p className="text-slate-500">Pick a tool and get results in seconds.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tools.map((tool) => {
            const isAvailable = tool.badge === 'Available'
            const cardContent = (
              <div
                className={`group relative bg-white rounded-xl border p-6 shadow-card transition-all duration-200 ${
                  isAvailable
                    ? 'border-slate-200 hover:border-navy-300 hover:shadow-card-hover cursor-pointer'
                    : 'border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-lg transition-colors ${
                      isAvailable
                        ? 'bg-navy-100 text-navy-700 group-hover:bg-navy-700 group-hover:text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
                {isAvailable && (
                  <div className="mt-4 flex items-center gap-1 text-navy-600 group-hover:text-navy-800 text-sm font-medium transition-colors">
                    Open calculator
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            )

            return isAvailable ? (
              <Link key={tool.title} href={tool.href}>
                {cardContent}
              </Link>
            ) : (
              <div key={tool.title}>{cardContent}</div>
            )
          })}
        </div>
      </section>

      {/* Mid-page AdSense */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-10">
        <AdBanner slot="0987654321" format="horizontal" />
      </div>

      {/* Features row */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-navy-300 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
          Save your calculations
        </h2>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Create a free account to save, revisit, and compare your results any time.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-7 py-3 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg transition-colors"
        >
          Get started for free
        </Link>
      </section>
    </div>
  )
}
