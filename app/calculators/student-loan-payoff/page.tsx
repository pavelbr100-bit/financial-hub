import LoanPayoffCalc, { type LoanPayoffCalcConfig } from '@/components/calculators/LoanPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Student Loan Payoff Calculator: Extra Payments | FinWiser' },
  description:
    'See how extra payments or a lump sum change your student loan payoff date and total interest. Free, instant, and no signup required.',
  alternates: { canonical: 'https://finwiser.net/calculators/student-loan-payoff' },
  openGraph: {
    title: 'Free Student Loan Payoff Calculator — Extra Payment Savings',
    description:
      'Enter your balance and rate to see how paying extra shortens your student loans and cuts total interest.',
    type: 'website',
    url: 'https://finwiser.net/calculators/student-loan-payoff',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Student Loan Payoff Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Student Loan Payoff Calculator | FinWiser',
    description:
      'See how extra payments shorten your student loans and cut total interest.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below — the two can
 * never drift apart. Every dollar figure here is pinned in
 * lib/calculators/__tests__/studentLoanPayoff.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'How much faster can extra payments clear my student loans?',
    answer:
      'Substantially, because the standard term is long enough for extra principal to compound against the balance. On $35,000 at 6.5% over the standard 10-year plan, the scheduled payment is $397 a month and the loans cost $12,690 in interest. Adding $100 a month clears them in 7 years 5 months and saves $3,504. Adding $200 a month clears them in 5 years 11 months and saves $5,471 — a little over four years cut from the term.',
  },
  {
    question: 'Is there a penalty for paying off student loans early?',
    answer:
      'No. Federal law prohibits prepayment penalties on student loans, federal and private alike, so you can pay any amount ahead of schedule at any time. The practical catch is not a penalty but application: extra funds are frequently applied to future payments or spread across all your loans instead of the one you intended, which is a servicer instruction problem rather than a contractual one.',
  },
  {
    question: 'How do I make sure extra payments go to principal?',
    answer:
      'Send written instructions to your servicer stating that any amount above the scheduled payment should be applied to the principal of a specific loan, and that you do not want your due date advanced. Without it, most servicers either push your next due date forward — which stops the clock but not the interest — or split the extra evenly across every loan in the group, which is rarely the loan you would have chosen.',
  },
  {
    question: 'Should I pay extra or go for loan forgiveness?',
    answer:
      'These pull in opposite directions, so decide before you start. If you are pursuing Public Service Loan Forgiveness or a forgiveness endpoint under an income-driven plan, extra payments reduce the balance that would eventually have been forgiven — you are spending your own money to shrink someone else’s write-off. If forgiveness is not part of your plan, the arithmetic on this page applies in full. This is the one question worth resolving before optimising anything else.',
  },
  {
    question: 'Should I refinance instead of paying extra?',
    answer:
      'Refinancing lowers the rate; paying extra shortens the term. Moving $35,000 from 6.5% to 4.5% over ten years drops the payment from $397 to $363 and saves about $4,162 in interest — comparable to paying an extra $150 a month. The catch is that refinancing federal loans with a private lender permanently forfeits income-driven repayment, forbearance protections, and any forgiveness eligibility. On private loans there is far less to lose.',
  },
  {
    question: 'Does it matter when I make a lump sum payment?',
    answer:
      'Yes, more than the amount does. A $5,000 payment made today against $35,000 at 6.5% saves about $3,966 in interest and ends the loans 22 months early. The same $5,000 paid three years from now saves about $2,459 — roughly $1,500 less, for the identical money. Every extra dollar stops accruing interest for the whole remaining term, so an early payment simply has more term left to work against.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Student Loan Payoff Calculator',
  url: 'https://finwiser.net/calculators/student-loan-payoff',
  description:
    'Calculate how extra monthly payments, a one-time lump sum, or biweekly payments change your student loan payoff date and total interest.',
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
    'New payoff date vs. the standard schedule',
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
      name: 'Student Loan Payoff Calculator',
      item: 'https://finwiser.net/calculators/student-loan-payoff',
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

const calcConfig: LoanPayoffCalcConfig = {
  idPrefix: 'student',
  saveType: 'student-loan-payoff',
  heading: 'Your Student Loans',
  balanceLabel: 'Current Balance',
  balanceHelp: 'Combine your loans if they share a similar rate; otherwise run the highest one first.',
  balanceDefault: '35,000',
  rateLabel: 'Interest Rate',
  rateDefault: '6.5',
  termLabel: 'Payments Remaining',
  termDefault: '120',
  termMax: 360,
  extraDefault: '100',
  lumpDefault: '5,000',
  savePlaceholder: 'e.g. Grad loan payoff',
  biweeklyNote:
    'Check that your servicer applies each half-payment on receipt rather than holding it until the full amount is due.',
  emptyState: 'Enter your balance, rate, and payments remaining to see your payoff date.',
}

const related = [
  {
    href: '/calculators/credit-card-payoff',
    label: 'Credit Card Payoff Calculator',
    blurb: 'Card debt at 20%+ outranks student loans — check what the cards cost first.',
  },
  {
    href: '/calculators/loan-amortization',
    label: 'Amortization Calculator',
    blurb: 'See the principal and interest split of every payment, or model a refinance side by side.',
  },
  {
    href: '/calculators/compound-interest',
    label: 'Compound Interest Calculator',
    blurb: 'Compare paying extra against investing the same amount over the same years.',
  },
  {
    href: '/calculators/debt-snowball',
    label: 'Debt Snowball Calculator',
    blurb: 'Several loans at different rates? Order them by snowball or avalanche.',
  },
]

export default async function StudentLoanPayoffPage() {
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
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-slate-500 mb-3"
          >
            <Link href="/" className="hover:text-navy-600 transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium" aria-current="page">
              Student Loan Payoff Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Student Loan Payoff Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Enter what you owe and see how an extra monthly payment, a lump sum, or a biweekly
                schedule moves your payoff date and cuts the interest you pay overall.
              </p>
            </div>
            <Link
              href="/calculators/debt-snowball"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Several loans?
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

        <LoanPayoffCalc user={user ? { email: user.email } : null} config={calcConfig} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Settle One Question Before You Optimise Anything
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Are you aiming for forgiveness?</strong> If you are
              working toward Public Service Loan Forgiveness or a forgiveness endpoint under an
              income-driven plan, extra payments actively work against you — every dollar you add
              reduces a balance that was going to be written off. In that case the optimal payment is
              the required one, and the money is better placed elsewhere. Everything below assumes
              you are paying the loans off yourself.
            </p>
            <p>
              <strong className="text-slate-800">Extra payments have real leverage here.</strong>{' '}
              Unlike a car loan, the standard student loan term is ten years and many borrowers are
              on twenty or twenty-five year plans. That length is exactly what gives extra principal
              time to compound against the balance, which is why a modest amount moves the payoff
              date by years rather than months.
            </p>
            <p>
              <strong className="text-slate-800">Target the highest rate, not the biggest
              balance.</strong>{' '}
              Most borrowers hold several loans at different rates disbursed across different years.
              Servicers usually spread extra payments evenly across all of them by default, which is
              the one distribution nobody would choose deliberately. Name the specific loan in
              writing, and pick the one with the highest rate.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>Before you start:</strong> instruct your servicer in writing to apply extra
                funds to <em>principal on a named loan</em> and to leave your due date where it is.
                Left unmarked, the common outcome is an advanced due date — the clock stops, the
                interest does not. This calculator models principal-only extra payments.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Take <strong className="text-slate-800">$35,000 at 6.5% on the standard 10-year
              plan</strong>. The scheduled payment is $397 a month, and following the schedule costs{' '}
              <strong className="text-slate-800">$12,690 in interest</strong> — $47,690 in total for
              $35,000 borrowed. Here is what four approaches produce:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Interest and time saved by payoff strategy on a $35,000 student loan balance at
                  6.5% over 10 years
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
                    ['Extra $100 a month', '$3,504', '2 yr 7 mo'],
                    ['Extra $200 a month', '$5,471', '4 yr 1 mo'],
                    ['One-time $5,000 today', '$3,966', '1 yr 10 mo'],
                    ['Biweekly payments ($199 every 2 weeks)', '$1,430', '1 yr'],
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
              The third row is the one worth dwelling on, because the timing is doing most of the
              work. That $5,000 saves <strong className="text-slate-800">$3,966</strong> paid today.
              Hold the same $5,000 for three years and pay it in month 37, and it saves{' '}
              <strong className="text-slate-800">$2,459</strong> — about $1,500 less for identical
              money. Waiting to accumulate a satisfying round number is itself expensive.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>A refinance is the other lever:</strong> moving this balance from 6.5% to
                4.5% would drop the payment to $363 and save about $4,162 — roughly what an extra
                $150 a month achieves, without needing the extra $150. On federal loans that trade
                permanently gives up income-driven repayment, forbearance rights, and forgiveness
                eligibility, so it is a very different decision than it looks on the rate alone.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Where Student Loans Sit Against Everything Else
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Below the 401(k) match and credit cards.</strong> An
              employer match is an immediate 50–100% return and card debt at 20–25% costs three to
              four times a typical student loan rate. Both beat extra principal at 6.5% by a wide
              margin. Capture the match, clear the cards, then come back to this page.
            </p>
            <p>
              <strong className="text-slate-800">Above almost nothing else, and that is the
              point.</strong>{' '}
              Once the expensive debt is gone, a 6.5% guaranteed return is genuinely competitive with
              a long-run stock market expectation and comes with no variance at all. Below about 4%,
              the argument flips and investing the difference usually wins.
            </p>
            <p>
              <strong className="text-slate-800">Federal protections have real value.</strong>{' '}
              Income-driven repayment, deferment, forbearance, and death or disability discharge are
              insurance you already own. Aggressively clearing federal loans is fine; refinancing
              them away to shave a point is a different trade, and one that cannot be reversed if
              your income drops.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              These figures assume a fixed rate and a balance with no capitalised interest pending —
              if you are leaving a grace period, deferment, or an income-driven plan, unpaid interest
              may be added to principal first, which raises the balance this calculator should start
              from. Compare paying extra against investing the same money with the{' '}
              <Link
                href="/calculators/compound-interest"
                className="text-navy-600 hover:text-navy-800 underline"
              >
                compound interest calculator
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
            For the reasoning behind ordering several debts rather than the arithmetic on one, read{' '}
            <Link
              href="/learn/debt-avalanche-vs-snowball"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              debt avalanche vs snowball
            </Link>{' '}
            and{' '}
            <Link
              href="/learn/what-is-amortization"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              what is amortization
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
