import MortgageCalc from '@/components/calculators/MortgageCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Free Mortgage Calculator — Monthly Payment, PMI & Amortization | FinWiser' },
  description:
    'Free mortgage calculator. Estimate your full monthly payment including principal, interest, property tax, home insurance, and PMI. See how extra payments reduce your interest and shorten your loan.',
  alternates: { canonical: 'https://finwiser.net/calculators/mortgage' },
  openGraph: {
    title: 'Free Mortgage Calculator — Monthly Payment, PMI & Amortization',
    description: 'Calculate your full monthly mortgage payment including P&I, taxes, insurance, and PMI. See how extra payments save you thousands.',
    type: 'website',
    url: 'https://finwiser.net/calculators/mortgage',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Mortgage Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Calculator | FinWiser',
    description: 'Calculate your full monthly mortgage payment including P&I, taxes, insurance, and PMI.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Calculator',
  url: 'https://finwiser.net/calculators/mortgage',
  description: 'Calculate your full monthly mortgage payment including P&I, property tax, insurance, and PMI. Add extra payments to see interest savings.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Monthly payment breakdown',
    'Full amortization schedule',
    'PMI calculation',
    'Extra payment savings calculator',
    'Property tax and insurance included',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is a monthly mortgage payment calculated?',
      acceptedAnswer: { '@type': 'Answer', text: 'A monthly mortgage payment is calculated using the amortization formula: Payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments. For a $300,000 loan at 7% for 30 years, the principal and interest payment is about $1,996/month.' },
    },
    {
      '@type': 'Question',
      name: 'What is included in a full monthly mortgage payment?',
      acceptedAnswer: { '@type': 'Answer', text: 'A full mortgage payment typically covers four things: principal (reducing your loan balance), interest (the lender\'s fee), property tax (usually escrowed at roughly 1–1.5% of home value per year), and homeowner\'s insurance. If your down payment was less than 20%, PMI (private mortgage insurance) is added as well. Together these are called PITI.' },
    },
    {
      '@type': 'Question',
      name: 'What is PMI and when can I stop paying it?',
      acceptedAnswer: { '@type': 'Answer', text: 'PMI (private mortgage insurance) protects the lender if you default. It\'s required when your down payment is below 20% and typically costs 0.5–1.5% of the loan per year, added to your monthly payment. Under the Homeowners Protection Act, lenders must automatically cancel PMI when you reach 22% equity based on the original purchase price and payment schedule.' },
    },
    {
      '@type': 'Question',
      name: 'How much do extra mortgage payments save?',
      acceptedAnswer: { '@type': 'Answer', text: 'Extra payments go directly toward principal, reducing future interest charges. On a $300,000 30-year mortgage at 7%, paying an extra $200/month saves over $60,000 in interest and pays off the loan roughly 5 years early. The earlier in the loan term you make extra payments, the greater the savings.' },
    },
    {
      '@type': 'Question',
      name: 'What is the 28/36 rule for mortgages?',
      acceptedAnswer: { '@type': 'Answer', text: 'The 28/36 rule is a lender guideline for affordability. Your housing costs (mortgage, taxes, insurance) should not exceed 28% of your gross monthly income, and your total debt payments (housing plus auto loans, student loans, credit cards) should not exceed 36%. Staying within these limits reduces the risk of financial stress and improves loan approval odds.' },
    },
  ],
}

export default async function MortgagePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const initialValues = params.homePrice ? params : undefined

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
          <span className="text-slate-700 font-medium">Mortgage Calculator</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
              Mortgage Calculator
            </h1>
            <p className="text-slate-500 max-w-2xl">
              Estimate your full monthly mortgage payment including principal, interest, property tax, home insurance, and PMI.
            </p>
          </div>
          <Link
            href="/calculators/mortgage/compare"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-navy-300 hover:border-navy-500 text-navy-700 hover:text-navy-900 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Compare scenarios
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'Includes PMI, taxes & insurance',
          'Extra payment savings',
          'Side-by-side scenario comparison',
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
        <AdBanner slot="2233445566" format="horizontal" />
      </div>

      <MortgageCalc user={user ? { email: user.email } : null} initialValues={initialValues} />

      <div className="mt-8">
        <AdBanner slot="6655443322" format="horizontal" />
      </div>

      <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">What Goes Into a Mortgage Payment?</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong className="text-slate-800">Principal & Interest (P&I)</strong> is the base payment that pays down your loan. Early payments are mostly interest; over time more goes toward principal.
          </p>
          <p>
            <strong className="text-slate-800">Property Tax</strong> is collected monthly by your lender and held in escrow, then paid to your local government annually. Rates vary widely by location — 1–2% of home value per year is typical.
          </p>
          <p>
            <strong className="text-slate-800">Home Insurance</strong> protects against damage and liability. Lenders require it. Expect $800–$2,000/year depending on location and coverage.
          </p>
          <p>
            <strong className="text-slate-800">PMI (Private Mortgage Insurance)</strong> is required when your down payment is less than 20%. It protects the lender — not you — and typically costs 0.5–1.5% of the loan per year. It can be cancelled once you reach 20% equity.
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
