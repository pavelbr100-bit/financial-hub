import LoanAmortizationCalc from '@/components/calculators/LoanAmortizationCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Free Loan Amortization Calculator — Payment Schedule & Total Interest | FinWiser' },
  description:
    'Free loan amortization calculator. Enter any loan amount, interest rate, and term to see your monthly payment, full payment schedule, and total interest. Add extra payments to see how much you can save.',
  alternates: { canonical: 'https://finwiser.net/calculators/loan-amortization' },
  openGraph: {
    title: 'Free Loan Amortization Calculator — Payment Schedule & Total Interest',
    description: 'Enter any loan amount, rate, and term to get your full amortization schedule and total interest cost.',
    type: 'website',
    url: 'https://finwiser.net/calculators/loan-amortization',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Loan Amortization Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Loan Amortization Calculator | FinWiser',
    description: 'Enter any loan amount, rate, and term to get your full amortization schedule and total interest cost.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Loan Amortization Calculator',
  url: 'https://finwiser.net/calculators/loan-amortization',
  description: 'Calculate monthly loan payments and generate a full amortization schedule. Works for mortgages, auto loans, personal loans, and balloon loans.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Monthly payment calculation',
    'Full amortization schedule',
    'Extra monthly and yearly payments',
    'Balloon loan support',
    'Total interest calculation',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Loan Amortization Calculator', item: 'https://finwiser.net/calculators/loan-amortization' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a loan amortization schedule?',
      acceptedAnswer: { '@type': 'Answer', text: 'A loan amortization schedule is a complete table showing every payment over the life of a loan, broken down into principal and interest components. It reveals how much of each payment reduces your balance versus how much is the cost of borrowing, and shows your remaining balance after every payment. It\'s the clearest way to understand the true cost of any loan.' },
    },
    {
      '@type': 'Question',
      name: 'Why do I pay mostly interest at the start of my loan?',
      acceptedAnswer: { '@type': 'Answer', text: 'Interest is calculated on your remaining balance each month. At the start of a loan, your balance is at its highest — so interest consumes most of your payment. As you pay down the principal over time, the interest portion shrinks and the principal portion grows, even though your total monthly payment stays the same. This is why extra early payments have an outsized effect.' },
    },
    {
      '@type': 'Question',
      name: 'How do extra payments affect loan amortization?',
      acceptedAnswer: { '@type': 'Answer', text: 'Extra payments reduce your principal balance immediately. A lower balance means less interest is charged next month, so more of your next regular payment goes toward principal. This compounding effect accelerates repayment: on a $200,000 loan at 7% for 30 years, an extra $100/month saves over $26,000 in interest and shortens the loan by more than 4 years.' },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a 15-year and 30-year loan?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 15-year loan has higher monthly payments but pays dramatically less total interest and builds equity much faster. A 30-year loan has lower payments that provide cash flow flexibility. On a $300,000 loan at 7%, the 30-year option costs over $400,000 in total interest versus about $185,000 for the 15-year — a difference of more than $215,000.' },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my monthly loan payment?',
      acceptedAnswer: { '@type': 'Answer', text: 'Use the formula: Payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the principal, r is the monthly rate (annual rate ÷ 12), and n is total payments. For a $20,000 loan at 6% for 5 years: r = 0.005, n = 60, giving a payment of about $386/month. Online amortization calculators like this one do the math instantly and show the full payment schedule.' },
    },
  ],
}

export default async function LoanAmortizationPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; rate?: string; term?: string; unit?: string; start?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const initialValues = params.amount
    ? {
        loanAmount: params.amount,
        interestRate: params.rate ?? '6.5',
        loanTerm: params.term ?? '30',
        termUnit: (params.unit as 'years' | 'months') ?? 'years',
        startDate: params.start ?? '',
      }
    : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Loan Amortization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Loan Amortization Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Enter your loan details to calculate your monthly payment and see a complete amortization schedule showing exactly how each payment is split between principal and interest.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'Full amortization schedule',
          'Extra payment savings',
          'Balloon loan support',
        ].map(f => (
          <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-700 text-xs font-medium">
            <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </span>
        ))}
      </div>

      {/* Top AdSense slot */}
      <div className="mb-6">
        <AdBanner slot="1122334455" format="horizontal" />
      </div>

      {/* Calculator */}
      <LoanAmortizationCalc
        user={user ? { email: user.email } : null}
        initialValues={initialValues}
      />

      {/* Bottom AdSense slot */}
      <div className="mt-8">
        <AdBanner slot="5544332211" format="horizontal" />
      </div>

      {/* Explainer */}
      <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">How Loan Amortization Works</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong className="text-slate-800">Amortization</strong> is the process of paying off a loan through regular scheduled payments over time. Each payment covers both the accrued interest and a portion of the principal balance.
          </p>
          <p>
            Early in the loan, most of each payment goes toward interest because the balance is high. As you pay down the principal, the interest portion shrinks and more of each payment reduces the balance. This is why paying a little extra each month — especially early on — can save a significant amount in total interest.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="font-medium text-slate-700 mb-2">Monthly Payment Formula</p>
            <code className="text-xs text-navy-700 font-mono">
              M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
            </code>
            <p className="text-xs text-slate-500 mt-2">
              Where P = principal, r = monthly interest rate, n = number of payments
            </p>
          </div>
          <p>
            <strong className="text-slate-800">Tip:</strong> The total interest you pay is heavily influenced by the loan term. A 15-year mortgage typically costs significantly less in total interest than a 30-year mortgage on the same amount, even if the monthly payment is higher.
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
