import CompoundInterestCalc from '@/components/calculators/CompoundInterestCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Free Compound Interest Calculator — Savings & Investment Growth | FinWiser' },
  description:
    'Free compound interest calculator. Enter your initial investment, monthly contributions, and interest rate to see how your money grows over time. Compare daily, monthly, quarterly, and annual compounding.',
  alternates: { canonical: 'https://finwiser.net/calculators/compound-interest' },
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


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Compound Interest Calculator', item: 'https://finwiser.net/calculators/compound-interest' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is compound interest?',
      acceptedAnswer: { '@type': 'Answer', text: 'Compound interest is interest calculated on both your original principal and the interest already accumulated. Unlike simple interest (always calculated on the original amount), compound interest causes your balance to grow exponentially — your interest earns interest. A $10,000 investment at 8% grows to $21,589 in 10 years with annual compounding, versus $18,000 with simple interest.' },
    },
    {
      '@type': 'Question',
      name: 'How does compounding frequency affect investment growth?',
      acceptedAnswer: { '@type': 'Answer', text: 'More frequent compounding produces slightly higher returns because interest is added to your balance sooner, creating a larger base for the next calculation. $10,000 at 8% over 10 years grows to $21,589 with annual compounding and $22,080 with daily compounding. The difference between monthly and daily compounding is minimal — what matters far more is your rate and investment timeline.' },
    },
    {
      '@type': 'Question',
      name: 'What is the Rule of 72?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Rule of 72 is a quick mental math shortcut: divide 72 by your annual interest rate to estimate how many years it takes to double your money. At 6%, money doubles in about 12 years. At 9%, it doubles in 8 years. At 12%, it doubles in 6 years. It\'s a simple way to feel the power (or cost) of any interest rate at a glance.' },
    },
    {
      '@type': 'Question',
      name: 'How much should I invest each month to reach a million dollars?',
      acceptedAnswer: { '@type': 'Answer', text: 'It depends entirely on your timeline and expected return. Assuming a 7% average annual return: to reach $1,000,000 in 30 years requires about $830/month. In 35 years, about $555/month. In 40 years, about $380/month. Starting a decade earlier cuts your required monthly contribution roughly in half — the clearest illustration of why starting early beats starting big.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: { '@type': 'Answer', text: 'Simple interest is always calculated on the original principal only. Compound interest is calculated on the growing balance — principal plus accumulated interest. On $1,000 at 10%: simple interest earns $100 every year (flat). Compound interest earns $100 in year one, $110 in year two, $121 in year three, and so on. Over decades, compound interest grows exponentially while simple interest grows linearly.' },
    },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
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
