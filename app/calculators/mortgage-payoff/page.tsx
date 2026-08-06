import MortgagePayoffCalc from '@/components/calculators/MortgagePayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Mortgage Payoff Calculator: Extra Payments | FinWiser' },
  description:
    'See how extra monthly payments, a lump sum, or biweekly payments move your mortgage payoff date and cut total interest. Free — no signup required.',
  alternates: { canonical: 'https://finwiser.net/calculators/mortgage-payoff' },
  openGraph: {
    title: 'Free Mortgage Payoff Calculator — Extra Payment Savings',
    description:
      'Enter your remaining balance and rate to see how extra payments, a lump sum, or biweekly payments shorten your mortgage and cut interest.',
    type: 'website',
    url: 'https://finwiser.net/calculators/mortgage-payoff',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Mortgage Payoff Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Payoff Calculator | FinWiser',
    description:
      'See how extra payments, a lump sum, or biweekly payments shorten your mortgage and cut total interest.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below — the two can
 * never drift apart. Every dollar figure here is pinned in
 * lib/calculators/__tests__/mortgagePayoff.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'What is the 2% rule for mortgage payoff?',
    answer:
      'The 2% rule is an informal guideline: each year, pay an extra 2% of your original loan balance toward principal. On a $300,000 mortgage that is $6,000 a year, or $500 a month. At 6.5% with 30 years remaining, that extra $500 a month clears the loan in about 17.5 years instead of 30. It is a rule of thumb, not a lender product — the number that matters is whatever extra amount you can sustain every month.',
  },
  {
    question: 'How do I pay off a 30 year mortgage in 5 years?',
    answer:
      'You have to raise the payment enough to retire the whole balance in 60 months. On a $300,000 balance at 6.5%, that means paying about $5,870 a month instead of $1,896 — roughly triple. For most households a 5-year payoff is only realistic after a large windfall, a home sale, or an unusually small remaining balance. If the full payment is out of reach, the calculator above shows what a smaller, sustainable increase actually buys you.',
  },
  {
    question: 'How much does an extra principal payment reduce my mortgage?',
    answer:
      'Every extra dollar goes straight to principal, so it stops accruing interest for the entire remaining life of the loan. On a $300,000 balance at 6.5% with 30 years left, a single one-time $1,000 payment made today saves about $5,903 in interest and pulls the payoff date forward by 3 months. The same $1,000 paid ten years from now saves far less, because it has fewer years left to compound against.',
  },
  {
    question: 'What is the formula for paying off a mortgage early?',
    answer:
      'There is no separate early-payoff formula. Start with the standard amortization payment, P = L × r / (1 − (1 + r)^−n), where L is the balance, r the monthly rate, and n the months remaining. Each month, interest equals the balance times r, and everything you pay above that reduces the balance. Adding extra principal simply makes the balance fall faster, so the loan ends before month n. That month-by-month simulation is exactly what the calculator on this page runs.',
  },
  {
    question: 'Is it better to pay extra monthly or make one lump sum payment?',
    answer:
      'A steady monthly amount almost always wins over a single lump sum of similar total value, because it reduces the balance repeatedly rather than once. On a $300,000 balance at 6.5% over 30 years, an extra $200 a month saves about $103,449 in interest, while a single $10,000 payment today saves about $53,602 — even though the monthly plan takes years to add up to more than $10,000. If you receive a windfall, pay it as early as possible: timing matters more than size.',
  },
  {
    question: 'Should I pay off my mortgage early or invest the money?',
    answer:
      'Paying extra principal is a guaranteed, risk-free return equal to your mortgage rate. Investing may return more, but not with certainty. A common order of operations: capture any employer 401(k) match first, clear higher-rate debt such as credit cards, build an emergency fund, then decide between extra principal and taxable investing based on your rate and your appetite for risk. At a 6.5% mortgage rate the guaranteed return is competitive; at 3% it usually is not.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Payoff Calculator',
  url: 'https://finwiser.net/calculators/mortgage-payoff',
  description:
    'Calculate how extra monthly payments, a one-time lump sum, or biweekly payments change your mortgage payoff date and total interest.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: {
    '@type': 'Organization',
    name: 'FinWiser',
    url: 'https://finwiser.net',
  },
  featureList: [
    'Extra monthly payment mode',
    'One-time lump sum mode with timing',
    'Biweekly payment mode',
    'New payoff date vs. current payoff date',
    'Total interest saved',
    'Full payoff schedule',
  ],
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Mortgage Payoff Calculator',
      item: 'https://finwiser.net/calculators/mortgage-payoff',
    },
  ],
}

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
    href: '/calculators/biweekly-mortgage',
    label: 'Biweekly Mortgage Calculator',
    blurb: 'Start from a home price and down payment to compare a biweekly schedule side by side.',
  },
  {
    href: '/calculators/loan-amortization',
    label: 'Amortization Calculator',
    blurb: 'See the principal and interest split of every payment on any fixed-rate loan.',
  },
  {
    href: '/calculators/mortgage/compare',
    label: 'Mortgage Comparison Calculator',
    blurb: 'Weigh a 15-year against a 30-year term before committing to extra payments.',
  },
]

export default async function MortgagePayoffPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link href="/" className="hover:text-navy-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium" aria-current="page">
              Mortgage Payoff Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Mortgage Payoff Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Enter what you still owe and see how an extra monthly payment, a one-time lump sum,
                or a biweekly schedule moves your payoff date and shrinks your total interest.
              </p>
            </div>
            <Link
              href="/calculators/mortgage"
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-navy-300 hover:border-navy-500 text-navy-700 hover:text-navy-900 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Full mortgage calculator
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Extra payment, lump sum, or biweekly', 'Instant results as you type', 'No signup'].map(
            (f) => (
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
            )
          )}
        </div>

        <div className="mb-6">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <MortgagePayoffCalc user={user ? { email: user.email } : null} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">How Mortgage Payoff Works</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Interest is charged on the balance, not the
              term.</strong>{' '}
              Each month your lender multiplies what you currently owe by one twelfth of your annual
              rate. Whatever you pay above that interest charge reduces the balance. Because next
              month&apos;s interest is calculated on the smaller balance, every extra dollar keeps
              paying you back for the entire remaining life of the loan.
            </p>
            <p>
              <strong className="text-slate-800">Extra payments shorten the loan — they don&apos;t
              lower the bill.</strong>{' '}
              Your scheduled payment stays fixed. Paying extra means you reach a zero balance before
              the final scheduled month, so the loan simply ends early. If you want a lower monthly
              obligation instead, that requires a recast or a refinance, which is a different
              decision entirely.
            </p>
            <p>
              <strong className="text-slate-800">Timing beats size.</strong> The same dollar saves
              more the earlier it is paid, because it has more months left to work against. This is
              why a modest amount paid consistently from today usually outperforms a larger sum you
              wait years to accumulate.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>Before you start:</strong> tell your servicer in writing that extra funds are
                to be applied to <em>principal only</em>. Left unmarked, many servicers hold the
                money as a prepayment of next month&apos;s bill — you get a month off, not a shorter
                loan. Also confirm your loan has no prepayment penalty; they are uncommon on modern
                conforming mortgages but not extinct.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Take a <strong className="text-slate-800">$300,000 remaining balance at 6.5% with 30
              years left</strong>. The scheduled principal-and-interest payment is $1,896 a month,
              and staying on that schedule costs <strong className="text-slate-800">$382,633 in
              interest</strong> over the full term. Here is what three different approaches to the
              same loan produce:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Interest and time saved by payoff strategy on a $300,000 balance at 6.5% with 30
                  years remaining
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Strategy
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Interest Saved
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Time Saved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Extra $200 a month', '$103,449', '6 yr 11 mo'],
                    ['Extra $300 a month', '$135,115', '9 yr 2 mo'],
                    ['One-time $10,000 today', '$53,602', '2 yr 9 mo'],
                    ['Biweekly payments ($948 every 2 weeks)', '$87,256', '5 yr 10 mo'],
                  ].map(([label, interest, time]) => (
                    <tr key={label} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{label}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700 tabular-nums">
                        {interest}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              The comparison worth sitting with is the first row against the third. An extra $200 a
              month takes over four years just to add up to $10,000 in payments — yet it saves
              roughly twice as much interest as handing over $10,000 today, because it keeps cutting
              the balance month after month rather than once.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            When Paying Early Helps — And When It Doesn&apos;t
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">It helps most when your rate is high and your
              term is long.</strong>{' '}
              On a $250,000 balance at 7% with 25 years to run, an extra $150 a month saves about
              $58,696 in interest and ends the loan 4 years 6 months early. The same $150 against a
              3% loan with eight years left barely moves the needle — there is little interest left
              to eliminate.
            </p>
            <p>
              <strong className="text-slate-800">It rarely helps when something else costs
              more.</strong>{' '}
              Credit card debt at 22%, a car loan at 11%, or an unclaimed employer 401(k) match all
              beat a 6.5% guaranteed return. Extra principal is also illiquid: once paid, you cannot
              get it back without a refinance or a home equity loan. An emergency fund should come
              first.
            </p>
            <p>
              <strong className="text-slate-800">One case people get wrong:</strong> paying extra to
              &ldquo;cancel PMI sooner&rdquo; is often worth more than the interest saved. If you are
              close to 20% equity, a relatively small lump sum can remove a monthly premium
              entirely — check your loan servicer&apos;s removal threshold before deciding where the
              money goes.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              These figures cover principal and interest only. Your actual monthly bill also includes
              property taxes, homeowners insurance, and possibly PMI or HOA dues, which do not change
              when you pay down principal. Estimate the full payment with the{' '}
              <Link href="/calculators/mortgage" className="text-navy-600 hover:text-navy-800 underline">
                mortgage calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          aria-labelledby="faq-heading"
          className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8"
        >
          <h2 id="faq-heading" className="text-xl font-bold text-navy-900 mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqs.map((f) => (
              <div key={f.question}>
                <h3 className="font-semibold text-navy-900 mb-1.5 text-sm">{f.question}</h3>
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
            For the reasoning behind each approach rather than the numbers, read{' '}
            <Link
              href="/learn/mortgage-payoff-strategies"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              mortgage payoff strategies
            </Link>{' '}
            and{' '}
            <Link
              href="/learn/mortgage-amortization-explained"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              mortgage amortization explained
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
