import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Free Mortgage & Loan Calculators — No Signup Required | FinWiser' },
  description:
    'Free financial calculators for mortgages, loans, compound interest, and debt payoff. See your full amortization schedule, compare mortgage scenarios, and make smarter money decisions — no signup required.',
  openGraph: {
    title: 'FinWiser — Free Mortgage & Loan Calculators',
    description: 'Free calculators for mortgages, loans, compound interest, and debt payoff. No signup required.',
    type: 'website',
    url: 'https://finwiser.net',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'FinWiser — Free Financial Calculators' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinWiser — Free Mortgage & Loan Calculators',
    description: 'Free calculators for mortgages, loans, compound interest, and debt payoff. No signup required.',
  },
}

const tools = [
  {
    href: '/calculators/mortgage',
    title: 'Mortgage Calculator',
    description:
      'Find out your true monthly cost including taxes, insurance, and PMI — then see how much interest extra payments could save you.',
    badge: undefined,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/calculators/car-loan',
    title: 'Car Loan Calculator',
    description:
      'See your true monthly payment, total interest, and whether the car fits your budget — including sales tax and trade-in value.',
    badge: 'New' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1.293 1.293A1 1 0 005 18h1m7-2h5m0 0l1.293-1.293A1 1 0 0020 14V9.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 6.5H13" />
      </svg>
    ),
  },
  {
    href: '/calculators/loan-amortization',
    title: 'Loan Amortization Calculator',
    description:
      'See every payment broken down into principal and interest. Know exactly when your loan is paid off and what it costs in total.',
    badge: undefined,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    href: '/calculators/debt-payoff',
    title: 'Debt Payoff Planner',
    description:
      'Enter your debts, pick avalanche or snowball, add an extra payment — and see the exact month each debt disappears.',
    badge: 'New' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/calculators/compound-interest',
    title: 'Compound Interest Calculator',
    description:
      'See how $10,000 and $200/month grows to six figures. Watch interest outpace contributions as compounding kicks in.',
    badge: 'New' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'No spreadsheets required',
    description: 'Instant, accurate results — no Excel formulas to debug.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Free, always',
    description: 'Every calculator is free to use, no credit card needed.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Save your work',
    description: 'Create a free account to save and revisit your calculations.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://finwiser.net/#organization',
      name: 'FinWiser',
      url: 'https://finwiser.net',
      description: 'Free financial calculators for loans and mortgages.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://finwiser.net/#website',
      url: 'https://finwiser.net',
      name: 'FinWiser',
      description: 'Free mortgage and loan amortization calculators.',
      publisher: { '@id': 'https://finwiser.net/#organization' },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-col">
      {/* Top AdSense banner */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-4">
        <AdBanner slot="1234567890" format="horizontal" />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 min-w-0">
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

              <p className="text-navy-200 text-lg leading-relaxed mb-5 max-w-xl">
                See the true cost of any loan in seconds — every payment, every dollar of interest, clearly laid out.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['No signup required', 'No data sold', 'Always free'].map(label => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-navy-200">
                    <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/calculators/mortgage"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Try Mortgage Calculator
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

            {/* Product mockup */}
            <div className="flex-shrink-0 w-full lg:w-[420px]">
              <div className="bg-navy-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/40">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-xs text-white/30 font-mono truncate">finwiser.net/calculators/mortgage</span>
                </div>

                {/* Result cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-white/8 rounded-xl p-3 border-t-2 border-emerald-500">
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-wide">Monthly</p>
                    <p className="text-emerald-400 text-lg font-bold tabular-nums">$2,029</p>
                  </div>
                  <div className="bg-white/8 rounded-xl p-3 border-t-2 border-navy-400">
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-wide">Total</p>
                    <p className="text-white text-lg font-bold tabular-nums">$730K</p>
                  </div>
                  <div className="bg-white/8 rounded-xl p-3 border-t-2 border-amber-400">
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-wide">Interest</p>
                    <p className="text-amber-400 text-lg font-bold tabular-nums">$410K</p>
                  </div>
                </div>

                {/* Mini balance chart */}
                <div className="bg-white/5 rounded-xl p-3 mb-3">
                  <p className="text-white/30 text-xs mb-2.5">Loan balance — 30 years</p>
                  <div className="flex items-end gap-0.5 h-12">
                    {[100,96,92,87,81,74,66,57,47,35,22,7].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor: `rgba(30,58,110,${0.5 + i * 0.04})`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Extra payment savings highlight */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-emerald-400/70 text-xs">With $200/mo extra</p>
                    <p className="text-emerald-400 font-semibold text-sm">Save $52K in interest</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-emerald-400/70 text-xs">Pay off</p>
                    <p className="text-emerald-400 font-bold text-sm">4y earlier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">What do you want to figure out?</h2>
          <p className="text-slate-500">Five calculators, instant results, no account needed.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <div className="group relative bg-white rounded-xl border border-slate-200 hover:border-navy-300 hover:shadow-card-hover p-6 shadow-card transition-all duration-200 cursor-pointer h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-navy-100 text-navy-700 group-hover:bg-navy-700 group-hover:text-white transition-colors">
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{tool.description}</p>
                <div className="mt-5 flex justify-end">
                  <div className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-navy-600 group-hover:bg-navy-700 flex items-center justify-center transition-all">
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mid-page AdSense */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-10">
        <AdBanner slot="0987654321" format="horizontal" />
      </div>

      {/* Features row */}
      <section className="bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy-500 mb-8">Why people use FinWiser</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                  <p className="text-navy-300 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA — cross-promote the comparison tool */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-navy-50 border border-navy-100 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="p-3 rounded-xl bg-navy-100 text-navy-700 flex-shrink-0">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mb-1">
              Compare mortgages side by side
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              15-year vs 30-year? Two different rates? See which option costs less over the life of your loan — including total interest and monthly payment differences.
            </p>
          </div>
          <Link
            href="/calculators/mortgage/compare"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Compare scenarios
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
    </>
  )
}
