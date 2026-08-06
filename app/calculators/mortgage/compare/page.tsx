import MortgageCompare, { type Scenario } from '@/components/calculators/MortgageCompare'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Mortgage Comparison Calculator — 3 Scenarios | FinWiser' },
  description:
    'Free mortgage comparison tool. Compare up to 3 scenarios side by side — different rates, terms, or down payments — and see which costs less overall.',
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
  isAccessibleForFree: true,
  publisher: {
    '@type': 'Organization',
    name: 'FinWiser',
    url: 'https://finwiser.net',
  },
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
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
    { '@type': 'ListItem', position: 4, name: 'Mortgage Comparison Calculator', item: 'https://finwiser.net/calculators/mortgage/compare' },
  ],
}


// Single source for both the visible FAQ section and the FAQPage JSON-LD below,
// so the two can never drift apart.
const faqs = [
  {
    question: 'What is the difference between a 15-year and 30-year mortgage?',
    answer:
      'A 15-year mortgage has higher monthly payments but builds equity faster and costs dramatically less in total interest. On a $300,000 loan, a 30-year at 7% runs $1,996 a month and $418,527 in interest, while a 15-year at 6.375% — shorter terms usually price about 0.625% lower — runs $2,593 a month and $166,695 in interest. That is roughly $597 more per month to save about $251,800 over the life of the loan.',
  },
  {
    question: 'Which mortgage term saves the most money overall?',
    answer:
      'Shorter terms always save the most total interest. At the same rate, a 15-year mortgage costs about 44% of the total interest of a 30-year — less than half — and 15-year loans usually carry rates 0.5–0.75% lower, compounding the savings. The trade-off is a higher monthly payment that leaves less room for other financial goals.',
  },
  {
    question: 'How much difference does .25% make on a mortgage?',
    answer:
      'Less per month than most buyers expect, but a lot over 30 years. On a $300,000 30-year loan, moving from 6.50% to 6.75% raises the payment from $1,896.20 to $1,945.79 — about $50 a month — but adds roughly $17,850 in total interest. On a $400,000 loan the same quarter point costs about $66 a month and $23,800 overall. It is worth shopping several lenders for.',
  },
  {
    question: 'How much is a $350,000 mortgage at 6% for 30 years?',
    answer:
      'Principal and interest come to $2,098.43 a month. Over 360 payments that totals $755,434, of which $405,434 is interest — more than the amount borrowed. Property taxes, homeowners insurance, PMI, and any HOA dues sit on top of that figure and are not included in it.',
  },
  {
    question: 'Which mortgage calculator is most accurate?',
    answer:
      'Any calculator using the standard amortization formula returns the same principal and interest payment — accuracy differences come from what a tool leaves out, not the math. A P&I-only result understates your real monthly cost because it omits property taxes, insurance, PMI, and HOA dues. This page compares principal and interest across scenarios; for a full monthly payment estimate use the main mortgage calculator, which includes those escrow items.',
  },
  {
    question: 'What factors should I compare when evaluating mortgage offers?',
    answer:
      'Compare the interest rate, loan term, APR (which includes lender fees and points), required down payment, and total cost over the full loan term. Two loans with the same rate can have very different total costs once origination fees and discount points are factored in. Use the APR and a side-by-side amortization comparison as your primary benchmarks.',
  },
  {
    question: 'Should I choose a fixed-rate or adjustable-rate mortgage?',
    answer:
      "A fixed-rate mortgage locks your rate for the life of the loan — ideal for long-term owners who want payment certainty. An ARM starts with a lower introductory rate for 3, 5, or 7 years, then adjusts periodically based on market rates. ARMs make sense if you're confident you'll sell or refinance before the fixed period ends and current fixed rates are high.",
  },
  {
    question: 'How do I calculate the total cost of a mortgage?',
    answer:
      'Multiply your monthly principal and interest payment by the total number of payments (years × 12), then add your down payment. On a $360,000 home with $60,000 down, the $300,000 balance at 7% over 30 years costs $1,995.91 a month — $718,528 across 360 payments. Add the down payment and the home has cost $778,528 against a $360,000 purchase price. This is why comparing total costs, not just monthly payments, matters.',
  },
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

const related = [
  {
    href: '/calculators/mortgage',
    label: 'Mortgage Calculator',
    blurb: 'Full monthly payment including property taxes, insurance, PMI, and HOA dues.',
  },
  {
    href: '/calculators/mortgage-payoff',
    label: 'Mortgage Payoff Calculator',
    blurb:
      'Once you have picked a loan, see what extra payments or a lump sum do to the payoff date.',
  },
  {
    href: '/calculators/biweekly-mortgage',
    label: 'Biweekly Mortgage Calculator',
    blurb: 'Compare a biweekly schedule against standard monthly payments from a home price.',
  },
  {
    href: '/calculators/loan-amortization',
    label: 'Amortization Calculator',
    blurb: 'See the principal and interest split of every payment on any fixed-rate loan.',
  },
]

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
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/" className="hover:text-navy-600 transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/calculators" className="hover:text-navy-600 transition-colors">
            Calculators
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/calculators/mortgage" className="hover:text-navy-600 transition-colors">
            Mortgage Calculator
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 font-medium" aria-current="page">
            Mortgage Comparison Calculator
          </span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Mortgage Comparison Calculator
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

      <section
        aria-labelledby="faq-heading"
        className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8"
      >
        <h2 id="faq-heading" className="text-xl font-bold text-navy-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-5">
          {faqs.map((f) => (
            <div key={f.question}>
              <h3 className="font-semibold text-navy-800 text-sm mb-1">{f.question}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="related-heading"
        className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8"
      >
        <h2 id="related-heading" className="text-xl font-bold text-navy-900 mb-4">
          Related Calculators
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="font-medium text-navy-700 hover:text-navy-900 text-sm underline"
              >
                {r.label}
              </Link>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{r.blurb}</p>
            </li>
          ))}
        </ul>
        <p className="text-slate-600 text-sm leading-relaxed mt-5">
          For the reasoning behind the term choice rather than the numbers, read{' '}
          <Link
            href="/learn/15-year-vs-30-year-mortgage"
            className="text-navy-600 hover:text-navy-800 underline"
          >
            15-year vs 30-year mortgage
          </Link>
          .
        </p>
      </section>
    </div>
    </>
  )
}
