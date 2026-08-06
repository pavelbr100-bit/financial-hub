import type { Metadata } from 'next'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import {
  calculators,
  calculatorCategories,
  calculatorsByCategory,
  stateCalculators,
} from '@/lib/calculators'

export const metadata: Metadata = {
  title: { absolute: 'Free Financial Calculators — No Signup | FinWiser' },
  description:
    'Every FinWiser calculator in one place: mortgages, debt payoff, car and student loans, credit cards, and compound interest. Free, instant, no account needed.',
  alternates: { canonical: 'https://finwiser.net/calculators' },
  openGraph: {
    title: 'Free Financial Calculators — FinWiser',
    description:
      'Mortgage, debt payoff, loan, and investment calculators. Free, instant results, no signup.',
    type: 'website',
    url: 'https://finwiser.net/calculators',
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'Free Financial Calculators — FinWiser' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Financial Calculators | FinWiser',
    description: 'Mortgage, debt payoff, loan, and investment calculators. No signup required.',
  },
}

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Financial Calculators',
  url: 'https://finwiser.net/calculators',
  description:
    'Every FinWiser calculator in one place: mortgages, debt payoff, car and student loans, credit cards, and compound interest.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FinWiser',
    url: 'https://finwiser.net',
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: calc.name,
      url: `https://finwiser.net${calc.href}`,
    })),
  },
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Calculators',
      item: 'https://finwiser.net/calculators',
    },
  ],
}

/** Short guidance per category so the page reads as a guide, not a link dump. */
const categoryIntros: Record<string, string> = {
  'Mortgage & Home':
    'Start with the full payment before the loan itself — taxes, insurance, and PMI decide affordability far more often than the rate does. If you have not committed yet, the rent vs buy comparison is the one to run first.',
  'Debt & Credit Cards':
    'One card is a different problem from five. A single balance is about the shrinking minimum payment; several balances are about what order to attack them in, and the order matters less than the amount you send.',
  Loans: 'Two questions live here: what a loan will cost before you sign it, and what paying extra does once you already have it. They need different tools.',
  'Saving & Investing':
    'The mirror image of the debt calculators — the same compounding, running in your favour. Useful for deciding whether extra debt payments or investing wins at your rate.',
}

/** Stable heading id per category, for the aria-labelledby link. */
function categoryId(category: string): string {
  return `cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export default function CalculatorsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-slate-500 mb-3"
          >
            <Link href="/" className="hover:text-navy-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium" aria-current="page">
              Calculators
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Free Financial Calculators
          </h1>
          <p className="text-slate-500 max-w-2xl">
            {calculators.length} tools covering mortgages, debt payoff, loans, and compound interest.
            Every one runs instantly in your browser, shows the assumptions behind its numbers, and
            works without an account.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['No signup', 'Instant results', 'Assumptions always stated'].map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-700 text-xs font-medium"
            >
              <svg
                className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        <div className="mb-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        {calculatorCategories.map((category) => (
          <section key={category} className="mb-10" aria-labelledby={categoryId(category)}>
            <h2 id={categoryId(category)} className="text-xl font-bold text-navy-900 mb-2">
              {category}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-2xl">
              {categoryIntros[category]}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calculatorsByCategory(category).map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
                    className="block h-full bg-white rounded-xl border border-slate-100 shadow-card p-5 hover:border-navy-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="font-semibold text-navy-900 group-hover:text-navy-700 mb-1.5">
                      {calc.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{calc.blurb}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="states-heading" className="mb-10">
          <h2 id="states-heading" className="text-xl font-bold text-navy-900 mb-2">
            Mortgage Calculators by State
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 max-w-2xl">
            The same mortgage calculator with that state&apos;s average property tax rate and
            insurance costs already filled in, plus notes on local first-time buyer programs. If your
            state is not listed, the{' '}
            <Link
              href="/calculators/mortgage"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              main mortgage calculator
            </Link>{' '}
            takes any tax rate you enter.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stateCalculators.map((state) => (
              <li key={state.href}>
                <Link
                  href={state.href}
                  className="flex items-baseline gap-2 bg-white rounded-lg border border-slate-100 px-4 py-3 hover:border-navy-300 transition-colors"
                >
                  <span className="font-medium text-navy-700 text-sm">{state.name}</span>
                  <span className="text-slate-400 text-xs">{state.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">How These Calculators Work</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Every number is reproducible.</strong> Each tool
              states the loan amount, rate, and term behind any figure it quotes, and the worked
              examples in the surrounding text are pinned in an automated test suite. If a number on
              a page changes, a test fails.
            </p>
            <p>
              <strong className="text-slate-800">Nothing you type leaves your browser.</strong> The
              calculations run locally as you type. Balances, rates, and incomes are never sent to a
              server unless you sign in and explicitly save a calculation.
            </p>
            <p>
              <strong className="text-slate-800">The assumptions are stated, including the
              unflattering ones.</strong>{' '}
              Where a model excludes something that would change the answer — the mortgage interest
              deduction in the rent vs buy comparison, daily compounding on credit cards — the page
              says so and explains which direction it biases the result.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              These tools are for estimation and education. They are not financial advice, and they
              cannot account for your full circumstances. Confirm anything consequential with your
              lender, servicer, or a qualified advisor. More on{' '}
              <Link href="/how-it-works" className="text-navy-600 hover:text-navy-800 underline">
                how the calculators are built
              </Link>{' '}
              and{' '}
              <Link href="/about" className="text-navy-600 hover:text-navy-800 underline">
                who writes them
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-2">Prefer to read first?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The{' '}
            <Link href="/learn" className="text-navy-700 underline hover:text-navy-900">
              Learn section
            </Link>{' '}
            covers the reasoning behind these tools — how amortization actually works, whether to
            take a 15-year or 30-year mortgage, and which debt payoff order suits you.
          </p>
        </section>
      </div>
    </>
  )
}
