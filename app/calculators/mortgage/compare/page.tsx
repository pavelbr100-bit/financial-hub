import MortgageCompare, { type Scenario } from '@/components/calculators/MortgageCompare'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Mortgage Comparison Calculator — Compare Up to 3 Loan Scenarios | FinWiser' },
  description:
    'Free mortgage comparison tool. Compare up to 3 scenarios side by side — different rates, terms, or down payments. See exactly which option costs less over the life of your loan.',
  alternates: { canonical: 'https://finwiser.net/calculators/mortgage/compare' },
  openGraph: {
    title: 'Mortgage Comparison Calculator — Compare Up to 3 Loan Scenarios',
    description: 'Compare up to 3 mortgage scenarios side by side. See which rate, term, and down payment combination costs less.',
    type: 'website',
    url: 'https://finwiser.net/calculators/mortgage/compare',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Mortgage Comparison Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Comparison Calculator | FinWiser',
    description: 'Compare up to 3 mortgage scenarios side by side. See which rate, term, and down payment costs less.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Comparison Calculator',
  url: 'https://finwiser.net/calculators/mortgage/compare',
  description: 'Compare up to 3 mortgage scenarios side by side. Instantly see how rate, term, and down payment affect your total cost.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Compare up to 3 mortgage scenarios',
    'Side-by-side payment comparison',
    'Total interest comparison',
    'Loan balance chart',
    'Best value highlighting',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
    { '@type': 'ListItem', position: 3, name: 'Compare Mortgages', item: 'https://finwiser.net/calculators/mortgage/compare' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the difference between a 15-year and 30-year mortgage?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 15-year mortgage has higher monthly payments but builds equity faster and costs dramatically less in total interest. A 30-year mortgage has lower payments that give you more monthly flexibility. On a $300,000 loan at the same interest rate, the 30-year option typically costs over $200,000 more in total interest compared to the 15-year — while the monthly payment difference is often $400–$600.' },
    },
    {
      '@type': 'Question',
      name: 'Which mortgage term saves the most money overall?',
      acceptedAnswer: { '@type': 'Answer', text: 'Shorter terms always save the most total interest. A 15-year mortgage typically costs less than half the total interest of a 30-year at the same rate — and 15-year loans usually carry rates 0.5–0.75% lower than 30-year loans, compounding the savings. The trade-off is a higher monthly payment that leaves less room for other financial goals.' },
    },
    {
      '@type': 'Question',
      name: 'What factors should I compare when evaluating mortgage offers?',
      acceptedAnswer: { '@type': 'Answer', text: 'Compare the interest rate, loan term, APR (which includes lender fees and points), required down payment, and total cost over the full loan term. Two loans with the same rate can have very different total costs once origination fees and discount points are factored in. Use the APR and a side-by-side amortization comparison as your primary benchmarks.' },
    },
    {
      '@type': 'Question',
      name: 'Should I choose a fixed-rate or adjustable-rate mortgage?',
      acceptedAnswer: { '@type': 'Answer', text: 'A fixed-rate mortgage locks your rate for the life of the loan — ideal for long-term owners who want payment certainty. An ARM starts with a lower introductory rate for 3, 5, or 7 years, then adjusts periodically based on market rates. ARMs make sense if you\'re confident you\'ll sell or refinance before the fixed period ends and current fixed rates are high.' },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate the total cost of a mortgage?',
      acceptedAnswer: { '@type': 'Answer', text: 'Multiply your monthly principal and interest payment by the total number of payments (years × 12), then add your down payment. For example: $1,996/month × 360 payments = $718,560 in total P&I payments. Add a $60,000 down payment and the home\'s total purchase cost is $778,560 — even though the purchase price was $360,000. This is why comparing total costs, not just monthly payments, matters.' },
    },
  ],
}

export default async function MortgageComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialScenarios: Scenario[] | undefined
  if (params.saved) {
    const { data } = await supabase
      .from('saved_calculations')
      .select('inputs')
      .eq('id', params.saved)
      .single()
    if (data?.inputs?.scenarios) {
      try {
        initialScenarios = JSON.parse(data.inputs.scenarios) as Scenario[]
      } catch {
        // malformed JSON — fall through to defaults
      }
    }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
          <span>/</span>
          <a
            href="/calculators/mortgage"
            className="hover:text-navy-600 transition-colors"
          >
            Mortgage Calculator
          </a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Compare</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Compare Mortgages
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Compare up to 3 mortgage scenarios side by side. Edit any field to
          instantly see how rate, term, or down payment changes affect your
          total cost.
        </p>
      </div>

      <MortgageCompare
        initialParams={params}
        initialScenarios={initialScenarios}
        user={user ? { email: user.email } : null}
      />
    </div>
    </>
  )
}
