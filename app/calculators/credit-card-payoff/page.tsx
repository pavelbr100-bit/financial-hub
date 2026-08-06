import CreditCardPayoffCalc from '@/components/calculators/CreditCardPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Credit Card Payoff Calculator: Time & Interest | FinWiser' },
  description:
    'See how long your credit card takes to clear and what the interest costs — on minimum payments, a set monthly amount, or a target date. Free, no signup.',
  alternates: { canonical: 'https://finwiser.net/calculators/credit-card-payoff' },
  openGraph: {
    title: 'Free Credit Card Payoff Calculator — Time and Interest',
    description:
      'Enter your balance and APR to see your payoff date, total interest, and how much paying more than the minimum saves you.',
    type: 'website',
    url: 'https://finwiser.net/calculators/credit-card-payoff',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Credit Card Payoff Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Credit Card Payoff Calculator | FinWiser',
    description:
      'See your payoff date, total interest, and what paying more than the minimum actually saves.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below — the two can
 * never drift apart. Every dollar figure here is pinned in
 * lib/calculators/__tests__/creditCardPayoff.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'How long will it take to pay off $5,000 in credit card debt?',
    answer:
      'It depends almost entirely on what you pay, not on the balance. On $5,000 at 24% APR, paying only the minimum takes about 19 years 6 months and costs roughly $8,887 in interest — more than the original debt. Holding a fixed $250 a month instead clears the same card in 2 years 2 months for about $1,449 in interest. The single biggest lever is refusing to let the payment shrink as the balance falls.',
  },
  {
    question: 'What happens if I only pay the minimum on my credit card?',
    answer:
      'The minimum is typically 1% of the balance plus that month’s interest, with a floor around $25. Because the percentage applies to a shrinking balance, the amount due falls every month, so the payoff stretches out. On a $6,000 balance at 22% APR the first minimum is about $170, but it drops to roughly $152 by month 12 and $94 by month 60. The card takes about 20 years 9 months to clear and costs about $9,933 in interest — you pay $15,933 for $6,000 of spending.',
  },
  {
    question: 'How much do I need to pay to be debt free in 12 months?',
    answer:
      'Use the same annuity formula an installment loan uses: P = B × r / (1 − (1 + r)^−n), where B is the balance, r is the APR divided by 12, and n is 12. On a $6,000 balance at 22% that comes to about $562 a month, and total interest of roughly $739. Switch the calculator above to "Debt free by a date" and it works this out for any term you name.',
  },
  {
    question: 'Does a balance transfer actually save money?',
    answer:
      'Usually yes, but only if you clear the balance inside the promotional window. A 3% transfer fee on $6,000 costs $180 upfront, and repaying $6,180 across an 18-month 0% offer means $343 a month. Paying that same $343 on the original 22% card would take 22 months and cost about $1,300 in interest — so the transfer saves roughly $1,120. If the promo expires with a balance still on the card, the standard APR applies to whatever is left and most of that advantage disappears.',
  },
  {
    question: 'Should I pay off my smallest card or my highest-rate card first?',
    answer:
      'Highest rate first (the avalanche) always costs less in interest, because you retire the most expensive dollars soonest. Smallest balance first (the snowball) costs slightly more but closes accounts faster, which some people need to stay with the plan. The gap is usually a few hundred dollars across a typical set of balances. This page models one card at a time; to order several cards, use the debt snowball calculator, which compares both methods side by side.',
  },
  {
    question: 'Does paying a credit card in full stop all interest?',
    answer:
      'Yes, if you pay the full statement balance by the due date every cycle. That keeps your grace period, and purchases carry no interest. Once you carry a balance forward, most issuers suspend the grace period, so new purchases start accruing interest from the day they post rather than after the due date. Getting the grace period back generally requires paying the statement balance in full and keeping it there for a cycle or two.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Credit Card Payoff Calculator',
  url: 'https://finwiser.net/calculators/credit-card-payoff',
  description:
    'Calculate how long a credit card balance takes to clear and how much interest it costs, on minimum payments, a fixed monthly amount, or a target payoff date.',
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
    'Fixed monthly payment mode',
    'Target payoff date mode with the required payment',
    'Minimum payment only mode',
    'Total interest and payoff date',
    'Savings compared against minimum payments',
    'Full month-by-month payoff schedule',
  ],
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Credit Card Payoff Calculator', item: 'https://finwiser.net/calculators/credit-card-payoff' },
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
    href: '/calculators/debt-snowball',
    label: 'Debt Snowball Calculator',
    blurb: 'More than one card? Order every balance by snowball or avalanche and see a single payoff date.',
  },
  {
    href: '/calculators/loan-amortization',
    label: 'Amortization Calculator',
    blurb: 'Model a consolidation or personal loan and compare its schedule against carrying the card.',
  },
  {
    href: '/calculators/compound-interest',
    label: 'Compound Interest Calculator',
    blurb: 'The same compounding that works against you here, running in your favour instead.',
  },
  {
    href: '/calculators/debt-avalanche',
    label: 'Debt Avalanche Calculator',
    blurb: 'Several cards? Order them by interest rate — the cheapest sequence to clear them all.',
  },
]

export default async function CreditCardPayoffPage() {
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
              Credit Card Payoff Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Credit Card Payoff Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Enter your balance and APR to see when the card clears and what the interest costs —
                paying the minimum, a set amount each month, or whatever it takes to be done by a
                date you choose.
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Have several cards?
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Minimum, fixed, or target-date', 'Instant results as you type', 'No signup'].map((f) => (
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

        <CreditCardPayoffCalc user={user ? { email: user.email } : null} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Why Credit Cards Take So Much Longer Than You Expect
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">A card is not a loan with an end date.</strong> A car
              loan or a mortgage has a fixed payment and a final month written into the contract. A
              credit card has neither. There is only a balance, a rate, and a minimum the issuer
              recalculates every statement — which means the card has no payoff date until you decide
              what you are paying each month.
            </p>
            <p>
              <strong className="text-slate-800">The minimum is designed to shrink.</strong> Most
              issuers ask for roughly 1% of the balance plus the interest that accrued, floored at
              about $25. As the balance falls, so does the amount due, so the principal you retire
              gets smaller every single month. That single feature is what turns a few thousand
              dollars into a two-decade balance.
            </p>
            <p>
              <strong className="text-slate-800">A fixed payment breaks the pattern.</strong> Pay the
              same dollar amount every month rather than whatever the statement asks for, and the
              interest portion shrinks while the principal portion grows. Nothing about the card
              changes — you have simply stopped letting the payoff decelerate.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>On the arithmetic:</strong> this calculator applies interest monthly at APR ÷
                12. Issuers use a daily periodic rate compounded daily against your average daily
                balance, which runs slightly higher — typically under 1% more interest across a full
                payoff. It also assumes you stop adding new purchases, which is the assumption that
                matters most.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Take a <strong className="text-slate-800">$6,000 balance at 22% APR</strong> with no new
              purchases. The first month&apos;s interest alone is $110. Here is what four different
              approaches to that identical balance produce:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Time to payoff and total interest by payment approach on a $6,000 credit card
                  balance at 22% APR
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      What You Pay
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Time to Clear
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Total Interest
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Minimum only (starts at $170, falls)', '20 yr 9 mo', '$9,933'],
                    ['$200 every month', '3 yr 8 mo', '$2,791'],
                    ['$300 every month', '2 yr 2 mo', '$1,543'],
                    ['$562 every month (clear in a year)', '1 yr', '$739'],
                  ].map(([label, time, interest]) => (
                    <tr key={label} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{label}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{time}</td>
                      <td className="px-4 py-3 text-right font-semibold text-amber-700 tabular-nums">
                        {interest}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              The first two rows are worth comparing carefully. The minimum starts at $170 — only $30
              less than the fixed $200 plan — yet it costs an extra{' '}
              <strong className="text-slate-800">$7,142 in interest</strong> and takes seventeen more
              years. Almost none of that gap comes from the size of the first payment. It comes from
              what happens to every payment after it: the minimum falls to $152 by month 12 and $94 by
              month 60, while the fixed $200 never moves.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>The floor you cannot go below:</strong> at 22%, a $6,000 balance accrues
                exactly $110 in the first month. Pay $110 and the balance never moves; pay less and it
                grows despite your payment. Anything you are willing to pay above $110 is the only
                part doing real work.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Where the Payoff Should Sit in Your Plan
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Card debt usually outranks everything except a
              401(k) match.</strong>{' '}
              At 22%, every dollar you put against the balance earns a guaranteed 22% return. No
              investment offers that with certainty, and no mortgage or car loan you hold costs
              nearly as much. The common exception is an employer match, which is an instant 50–100%
              return and should be captured first.
            </p>
            <p>
              <strong className="text-slate-800">Keep a small cash buffer anyway.</strong> Emptying
              your savings into the card and then meeting the next emergency with the same card leaves
              you exactly where you started, minus the buffer. A modest starter fund — often a
              month&apos;s essential expenses — is what stops the balance from rebuilding.
            </p>
            <p>
              <strong className="text-slate-800">Consider a transfer or a fixed-rate loan only if
              the payment stays put.</strong>{' '}
              A 0% balance transfer or a consolidation loan lowers the rate, not the discipline
              required. Both work when you keep paying the amount that clears the balance inside the
              promotional window or the loan term; both fail when the lower payment becomes the new
              habit and the card fills back up.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              This page models one card at a time. If you are carrying balances across several cards,
              the ordering question matters more than the arithmetic on any single one — work through
              them with the{' '}
              <Link
                href="/calculators/debt-snowball"
                className="text-navy-600 hover:text-navy-800 underline"
              >
                debt snowball calculator
              </Link>
              , which also runs the avalanche method for comparison.
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
            For why the required payment falls as the balance does, and what to do about it, read{' '}
            <Link
              href="/learn/how-to-pay-off-credit-card-debt"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              how to pay off credit card debt
            </Link>
            .
          </p>
          <p className="text-slate-600 text-sm leading-relaxed mt-3">
            For the reasoning behind each approach rather than the numbers, read{' '}
            <Link
              href="/learn/debt-avalanche-vs-snowball"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              debt avalanche vs snowball
            </Link>{' '}
            and{' '}
            <Link
              href="/learn/debt-payoff-strategies"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              debt payoff strategies
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  )
}
