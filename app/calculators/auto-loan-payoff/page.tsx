import LoanPayoffCalc, { type LoanPayoffCalcConfig } from '@/components/calculators/LoanPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Auto Loan Payoff Calculator: Pay Off Early | FinWiser' },
  description:
    'See what paying extra on your car loan saves in interest and time, and when you stop owing more than the car is worth. Free — no signup required.',
  alternates: { canonical: 'https://finwiser.net/calculators/auto-loan-payoff' },
  openGraph: {
    title: 'Free Auto Loan Payoff Calculator — Early Payoff Savings',
    description:
      'Enter your remaining balance and rate to see how extra payments, a lump sum, or biweekly payments shorten your car loan.',
    type: 'website',
    url: 'https://finwiser.net/calculators/auto-loan-payoff',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Auto Loan Payoff Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Auto Loan Payoff Calculator | FinWiser',
    description:
      'See how extra payments shorten your car loan and when you stop being underwater on it.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below — the two can
 * never drift apart. Every dollar figure here is pinned in
 * lib/calculators/__tests__/autoLoanPayoff.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'How much can I save by paying off my car loan early?',
    answer:
      'Less than people expect, because car loans are short and the balances are small next to a mortgage. On $28,000 at 7.5% with 48 payments left, the loan costs $4,496 in interest if you do nothing. Adding $200 a month clears it a full year early and saves $1,167. Adding $100 a month saves $673. Real money, but hundreds rather than tens of thousands — which is why the rate on your other debts usually decides whether this is the right target.',
  },
  {
    question: 'Is there a penalty for paying off a car loan early?',
    answer:
      'Usually not, but it depends on the contract and the state. The one to check for is a precomputed interest loan, sometimes called Rule of 78s. On those the total interest is baked in at signing and front-loaded, so paying early returns only part of it and the savings shown here will not materialise. Most mainstream lenders now write simple-interest loans, where interest accrues on the outstanding balance daily and early payoff always helps. Your contract will say which one you have.',
  },
  {
    question: 'What does it mean to be upside down on a car loan?',
    answer:
      'It means the payoff balance is higher than the car is worth, so selling it would not clear the loan. It is common in the first years because cars lose roughly 15% of their value a year while the loan amortizes slowly. On a $28,000 balance against a $24,000 car you are $4,000 underwater, and on the normal schedule you stay there until about month 17. Paying an extra $200 a month closes that gap by month 10 instead.',
  },
  {
    question: 'Does paying off a car loan early hurt your credit?',
    answer:
      'It can nudge your score down slightly and temporarily. Closing an installment account removes an active tradeline and can reduce your credit mix, and the average age of open accounts may fall. The effect is small and short-lived, and it is not a reason to carry interest-bearing debt. If you are inside a mortgage application window, it is worth waiting until after closing simply to avoid any movement in the file.',
  },
  {
    question: 'How do I make sure extra payments go to principal?',
    answer:
      'Tell the lender in writing, and check the next statement. Left unmarked, many servicers treat extra funds as a prepayment of your next scheduled payment — you get a month off rather than a shorter loan, and the interest keeps accruing on the same balance. On a simple-interest loan, paying a few days earlier each month also helps slightly, because interest accrues daily.',
  },
  {
    question: 'Should I pay off my car loan or my credit card first?',
    answer:
      'The credit card, almost always. Card APRs of 20–25% are roughly three times a typical auto rate, so the same dollar kills far more interest there. The exception is being deeply underwater on the car without gap insurance — in that case, closing the equity gap protects you from a loss that no interest-rate comparison captures. Clear the cards first, then decide whether the car or investing wins on rate alone.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Auto Loan Payoff Calculator',
  url: 'https://finwiser.net/calculators/auto-loan-payoff',
  description:
    'Calculate how extra monthly payments, a lump sum, or biweekly payments change your car loan payoff date, total interest, and equity position.',
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
    'Negative equity check against the car’s value',
    'Month you stop owing more than the car is worth',
    'Total interest saved and full payoff schedule',
  ],
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Auto Loan Payoff Calculator', item: 'https://finwiser.net/calculators/auto-loan-payoff' },
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
  idPrefix: 'auto',
  saveType: 'auto-loan-payoff',
  heading: 'Your Current Auto Loan',
  balanceLabel: 'Remaining Loan Balance',
  balanceHelp: 'Your payoff balance today, not the original amount financed.',
  balanceDefault: '28,000',
  rateLabel: 'Interest Rate (APR)',
  rateDefault: '7.5',
  termLabel: 'Payments Remaining',
  termDefault: '48',
  termMax: 120,
  extraDefault: '200',
  lumpDefault: '3,000',
  savePlaceholder: 'e.g. Truck payoff plan',
  biweeklyNote:
    'Confirm your lender accepts biweekly payments and applies them on receipt rather than holding them.',
  emptyState: 'Enter your balance, rate, and payments remaining to see your payoff date.',
  equity: {
    label: 'What the Car Is Worth',
    help: 'Adds an equity check — whether you owe more than the car is worth.',
    valueDefault: '24,000',
  },
}

const related = [
  {
    href: '/calculators/car-loan',
    label: 'Car Payment Calculator',
    blurb: 'Shopping rather than paying down? Price a new loan including sales tax and a trade-in.',
  },
  {
    href: '/calculators/credit-card-payoff',
    label: 'Credit Card Payoff Calculator',
    blurb: 'Usually the higher-rate target — check what the cards cost before overpaying the car.',
  },
  {
    href: '/calculators/loan-amortization',
    label: 'Amortization Calculator',
    blurb: 'See the principal and interest split of every payment on any fixed-rate loan.',
  },
  {
    href: '/calculators/mortgage-payoff',
    label: 'Mortgage Payoff Calculator',
    blurb: 'The same extra-payment math where the balances — and the savings — are far larger.',
  },
]

export default async function AutoLoanPayoffPage() {
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
            <Link href="/calculators" className="hover:text-navy-600 transition-colors">
              Calculators
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium" aria-current="page">
              Auto Loan Payoff Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Auto Loan Payoff Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Enter what you still owe on the car and see how an extra payment, a lump sum, or a
                biweekly schedule moves your payoff date — and when you stop owing more than the car
                is worth.
              </p>
            </div>
            <Link
              href="/calculators/car-loan"
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
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1.293 1.293A1 1 0 005 18h1m7-2h5m0 0l1.293-1.293A1 1 0 0020 14V9.5a1 1 0 00-.293-.707l-2-2A1 1 0 0017 6.5H13"
                />
              </svg>
              Buying instead?
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Extra payment, lump sum, or biweekly', 'Negative equity check', 'No signup'].map((f) => (
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

        <div className="mb-6">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <LoanPayoffCalc user={user ? { email: user.email } : null} config={calcConfig} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            How Early Payoff Works on a Car Loan
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Check which kind of loan you signed first.</strong>{' '}
              Almost all mainstream auto loans are <em>simple interest</em>: interest accrues daily on
              whatever you currently owe, so every extra dollar of principal immediately reduces
              what accrues tomorrow. A minority — mostly older or subprime contracts — are{' '}
              <em>precomputed</em>, sometimes under the name Rule of 78s. There the total interest is
              fixed at signing and weighted toward the early months, so paying off early refunds only
              part of it. Everything on this page assumes simple interest.
            </p>
            <p>
              <strong className="text-slate-800">The term is short, so the leverage is
              small.</strong>{' '}
              A mortgage runs 360 months, which gives an extra payment three decades to compound
              against the balance. A car loan has 48 or 60. The same discipline that saves six
              figures on a house saves hundreds to low thousands here — worth doing, but rarely the
              highest-value place for a spare $200 if you are carrying card debt.
            </p>
            <p>
              <strong className="text-slate-800">Equity is the reason people actually do
              this.</strong>{' '}
              A new car loses value far faster than the loan amortizes in the first two years, so
              many borrowers owe more than the car is worth. That gap is what makes a total loss or
              an unplanned sale expensive: insurance pays the car&apos;s value, and you owe the rest.
              Extra principal closes the gap sooner, which is a risk reduction the interest number
              alone does not show.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>Before you start:</strong> tell your lender in writing that extra funds go to{' '}
                <em>principal only</em>. Unmarked, many servicers apply them to next month&apos;s
                payment instead, which buys you a month off rather than a shorter loan. Then check
                the following statement to confirm the balance actually dropped.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Take a <strong className="text-slate-800">$28,000 balance at 7.5% with 48 payments
              left</strong>. The scheduled payment is $677 a month, and riding out the schedule costs{' '}
              <strong className="text-slate-800">$4,496 in interest</strong>. Here is what four
              approaches to the same loan produce:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Interest and time saved by payoff strategy on a $28,000 auto loan balance at 7.5%
                  with 48 payments remaining
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
                    ['Extra $100 a month', '$673', '7 mo'],
                    ['Extra $200 a month', '$1,167', '1 yr'],
                    ['One-time $3,000 today', '$960', '5 mo'],
                    ['Biweekly payments ($339 every 2 weeks)', '$407', '4 mo'],
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
              Now add the car itself. If that $28,000 balance sits against a car worth{' '}
              <strong className="text-slate-800">$24,000</strong>, you are $4,000 underwater. At
              roughly 15% annual depreciation, the normal schedule leaves you underwater until about{' '}
              <strong className="text-slate-800">month 17</strong>. The extra $200 a month gets you
              above water by <strong className="text-slate-800">month 10</strong> — seven months of
              exposure removed, on top of the $1,167.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>Common mistake:</strong> refinancing to a longer term to cut the monthly
                payment while already underwater. The lower payment feels like relief, but the
                balance now falls even more slowly against a car that keeps depreciating — the gap
                widens and stays open for years longer.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            When Paying the Car Off Early Is the Right Move
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">When the rate is genuinely high.</strong> Auto rates
              spread widely by credit tier. At 11–14%, extra principal is a strong guaranteed return
              and worth prioritising. At a promotional 0–3%, it is close to pointless — the money
              does more in an emergency fund or a retirement account.
            </p>
            <p>
              <strong className="text-slate-800">When you are underwater and have no gap
              coverage.</strong>{' '}
              This is the case where the interest saved is beside the point. If the car were totalled
              tomorrow, insurance pays its market value and you owe the difference in cash on a car
              you no longer have. Closing that gap early — or buying gap insurance — removes a real
              risk.
            </p>
            <p>
              <strong className="text-slate-800">Not before higher-rate debt or the
              match.</strong>{' '}
              A credit card at 22% and an unclaimed employer 401(k) match both beat a 7.5% auto loan
              comfortably. Work down the rate ladder rather than paying off whichever loan feels most
              satisfying to close.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Depreciation is modelled as a steady 15% a year, which is a reasonable average but not
              your specific car — condition, mileage, and model hold value very differently. Check a
              current valuation before treating the equity crossover as precise. For the strategy
              behind these numbers, read{' '}
              <Link
                href="/learn/how-to-pay-off-car-loan-early"
                className="text-navy-600 hover:text-navy-800 underline"
              >
                how to pay off a car loan early
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
              href="/learn/how-to-pay-off-car-loan-early"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              how to pay off a car loan early
            </Link>{' '}
            and{' '}
            <Link
              href="/learn/how-car-loan-interest-works"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              how car loan interest works
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
