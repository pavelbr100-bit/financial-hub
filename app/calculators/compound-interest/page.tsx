import CompoundInterestCalc from '@/components/calculators/CompoundInterestCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: { absolute: 'Free Compound Interest Calculator — Savings & Investment Growth | FinWiser' },
  description:
    'Free compound interest calculator. Enter your initial investment, monthly contributions, and interest rate to see how your money grows over time. Compare daily, monthly, quarterly, and annual compounding.',
  openGraph: {
    title: 'Free Compound Interest Calculator — Savings & Investment Growth',
    description: 'See how your money grows with compound interest. Enter your investment, monthly contributions, and rate.',
    type: 'website',
    url: 'https://finwiser.net/calculators/compound-interest',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Compound Interest Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Compound Interest Calculator | FinWiser',
    description: 'See how your money grows with compound interest. Enter your investment, monthly contributions, and rate.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Compound Interest Calculator',
  url: 'https://finwiser.net/calculators/compound-interest',
  description: 'Calculate how investments grow with compound interest. Add monthly contributions and compare compounding frequencies.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Compound interest calculation',
    'Monthly contribution support',
    'Daily, monthly, quarterly, and annual compounding',
    'Year-by-year growth table',
    'Interactive growth chart',
  ],
}

export default async function CompoundInterestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const initialValues = params.principal
    ? {
        principal: params.principal,
        contribution: params.contribution ?? '200',
        rate: params.rate ?? '7',
        freq: params.freq ?? 'monthly',
        years: params.years ?? '20',
      }
    : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
            <span>/</span>
            <span className="text-slate-700 font-medium">Compound Interest Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Compound Interest Calculator
          </h1>
          <p className="text-slate-500 max-w-2xl">
            See how your savings or investments grow over time with compound interest. Add monthly contributions to model regular investing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Year-by-year growth table',
            'Monthly contributions',
            'Daily, monthly, quarterly, annual compounding',
          ].map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-700 text-xs font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        <div className="mb-6">
          <AdBanner slot="3344556677" format="horizontal" />
        </div>

        <CompoundInterestCalc user={user ? { email: user.email } : null} initialValues={initialValues} />

        <div className="mt-8">
          <AdBanner slot="7766554433" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">How Compound Interest Works</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Compound interest</strong> means you earn interest not just on your initial investment, but also on all the interest you have already earned. Over time, this creates an exponential growth effect — often called the &quot;snowball effect.&quot;
            </p>
            <p>
              <strong className="text-slate-800">Compounding frequency</strong> matters. Daily compounding yields slightly more than monthly, which yields more than annually, because interest is applied — and starts earning its own interest — more often. For most savings accounts and investments, monthly compounding is the standard.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-medium text-slate-700 mb-2">Compound Interest Formula</p>
              <code className="text-xs text-navy-700 font-mono">
                A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]
              </code>
              <p className="text-xs text-slate-500 mt-2">
                Where P = principal, r = annual rate, n = compounding periods/year, t = years, PMT = monthly contribution
              </p>
            </div>
            <p>
              <strong className="text-slate-800">Time is your most powerful lever.</strong> Starting 10 years earlier can double your final balance, even with no extra contributions. A common rule of thumb is the Rule of 72: divide 72 by your annual rate to estimate how many years it takes to double your money. At 7%, your money doubles roughly every 10 years.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
