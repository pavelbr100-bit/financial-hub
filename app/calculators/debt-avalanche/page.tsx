import DebtPayoffCalc from '@/components/calculators/DebtPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Debt Avalanche Calculator: Pay Less Interest | FinWiser' },
  description:
    'Free debt avalanche calculator. Target your highest-rate debt first and see the total interest, payoff date, and how much the avalanche beats the snowball.',
  alternates: { canonical: 'https://finwiser.net/calculators/debt-avalanche' },
  openGraph: {
    title: 'Free Debt Avalanche Calculator — Highest Rate First',
    description:
      'Order your debts by interest rate and see your debt-free date, total interest, and the exact cost of choosing the snowball instead.',
    type: 'website',
    url: 'https://finwiser.net/calculators/debt-avalanche',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Debt Avalanche Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Debt Avalanche Calculator | FinWiser',
    description:
      'Target your highest-rate debt first and see exactly what the avalanche saves over the snowball.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below.
 * Deliberately shares no questions with /calculators/debt-snowball — the two
 * pages must not compete for the same result. Figures are pinned in
 * lib/calculators/__tests__/debtAvalanche.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'How much does the debt avalanche actually save?',
    answer:
      'Less than the internet implies, but reliably more than zero. Take $25,000 across three debts — a $2,000 medical bill at 5%, a $9,000 credit card at 24%, and a $14,000 car loan at 7% — with $560 in minimums and $300 extra a month. The avalanche clears everything in 35 months for $4,360 in interest; the snowball takes 36 months and $5,066. The avalanche saves $706. The gap widens when the rate spread is wide and narrows to almost nothing when your debts sit close together.',
  },
  {
    question: 'Why does the avalanche feel slower even though it is faster?',
    answer:
      'Because the first win takes far longer to arrive. In the example above, the snowball clears the medical bill in month 6. The avalanche attacks the 24% credit card first and does not fully retire anything until month 24 — eighteen months of paying without a single account closing. Both plans finish within a month of each other, but only one of them gives you evidence it is working early on. That is the entire tradeoff, and it is a question about you rather than about arithmetic.',
  },
  {
    question: 'Does the avalanche method still matter if my rates are similar?',
    answer:
      'Barely. The avalanche wins by moving money from a low rate to a high one, so its advantage is proportional to the spread between your rates. If everything you owe sits between 6% and 8%, the two methods finish within a few dollars of each other and you should simply pick whichever you will actually follow. Run both modes in the calculator above: if the interest difference is under a few hundred dollars, that is your answer.',
  },
  {
    question: 'What if my highest-rate debt is also my largest?',
    answer:
      'Then the avalanche demands the most patience it ever will, and the case for it is strongest. A large balance at a high rate accrues more interest per month than anything else you owe, so every month you delay is expensive. The compromise many people use is to clear one genuinely small balance first for the momentum, then switch to strict rate order for everything after — it costs a little and it removes the hardest part of the plan.',
  },
  {
    question: 'Can I switch from the snowball to the avalanche partway through?',
    answer:
      'Yes, and there is no penalty for doing it. Neither method is a product you sign up for; both are just rules for where the extra payment goes each month. Switching mid-plan simply redirects the next payment to a different debt. If you started with the snowball for early momentum and now want the cheaper path, change the target the next time you pay and leave the minimums on everything else untouched.',
  },
  {
    question: 'Should I include my mortgage in the avalanche?',
    answer:
      'Usually no. A mortgage at 6% or 7% is almost always the lowest rate you carry, so a strict avalanche puts it last anyway — including it changes nothing about the order. It also distorts the payoff date, because a 30-year balance dwarfs consumer debt and makes the plan look hopeless. Run the avalanche on your consumer debts, and treat the mortgage as a separate decision once they are gone.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Debt Avalanche Calculator',
  url: 'https://finwiser.net/calculators/debt-avalanche',
  description:
    'Pay off debt with the avalanche method — highest interest rate first. See your debt-free date, total interest, and exactly what the snowball would cost instead.',
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
    'Avalanche payoff order (highest rate first)',
    'Snowball comparison mode',
    'Up to 6 debts',
    'Payoff month for each individual debt',
    'Total interest under each method',
    'Extra payment impact',
  ],
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators' },
    { '@type': 'ListItem', position: 3, name: 'Debt Avalanche Calculator', item: 'https://finwiser.net/calculators/debt-avalanche' },
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

export default async function DebtAvalanchePage() {
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
              Debt Avalanche Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Debt Avalanche Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Enter your debts and the avalanche method targets the highest interest rate first —
                the order that costs the least. See your debt-free date, what each debt costs you in
                interest, and exactly what choosing the snowball instead would add.
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Prefer the snowball?
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {['Highest rate first', 'Snowball comparison built in', 'Up to 6 debts'].map((f) => (
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

        <DebtPayoffCalc user={user ? { email: user.email } : null} initialStrategy="avalanche" />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Why Rate Order Is the Cheapest Order
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Interest is a price, and you can choose which one
              to stop paying.</strong>{' '}
              A dollar of balance at 24% costs you 24 cents a year; the same dollar at 5% costs five.
              Since your extra payment can only go to one debt at a time, sending it to the highest
              rate buys the largest reduction in future interest per dollar spent. Repeat that every
              month and no other ordering can beat it — this is not a strategy so much as an
              arithmetic result.
            </p>
            <p>
              <strong className="text-slate-800">Balance size is a distraction.</strong> The size of
              a debt determines how long it takes to clear, not how expensive it is per dollar. A
              small balance at 5% is cheap to carry and feels satisfying to kill; a large balance at
              24% is quietly costing you more every month you leave it alone. The avalanche ignores
              how a debt feels and ranks purely on what it charges.
            </p>
            <p>
              <strong className="text-slate-800">Freed minimums are what accelerate the
              plan.</strong>{' '}
              When a debt clears, its minimum payment does not go back into your budget — it joins
              the extra payment attacking the next debt. The pot grows each time an account closes,
              which is why the last debts fall much faster than the first. Both methods use this
              roll; they only disagree about the order the debts should fall in.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>The honest caveat:</strong> the avalanche is optimal only if you follow it.
                The method is measurably cheaper on paper and measurably harder to stick with,
                because the reward comes last. If you have abandoned a payoff plan before, the
                cheaper method on paper may not be the cheaper method for you.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Three debts totalling <strong className="text-slate-800">$25,000</strong>, with{' '}
              <strong className="text-slate-800">$560</strong> in combined minimum payments and{' '}
              <strong className="text-slate-800">$300 extra</strong> available each month:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  The three debts used in the worked example, with balances, rates, and minimum
                  payments
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Debt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Balance
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Minimum
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Medical bill', '$2,000', '5%', '$50'],
                    ['Credit card', '$9,000', '24%', '$180'],
                    ['Car loan', '$14,000', '7%', '$330'],
                  ].map(([name, bal, rate, min]) => (
                    <tr key={name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{name}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{bal}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{rate}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              These three disagree, which is what makes them worth modelling: the smallest balance
              carries the lowest rate, so the two methods pick opposite starting targets.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Avalanche compared against snowball on the same three debts
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Order Cleared
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Debt Free
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Interest
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-emerald-50/40">
                    <td className="px-4 py-3 font-semibold text-emerald-800">Avalanche</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      Card (mo 24) → Car (mo 34) → Medical (mo 35)
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 tabular-nums">35 mo</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700 tabular-nums">
                      $4,360
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Snowball</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      Medical (mo 6) → Card (mo 27) → Car (mo 36)
                    </td>
                    <td className="px-4 py-3 text-right text-slate-800 tabular-nums">36 mo</td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-700 tabular-nums">
                      $5,066
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The avalanche saves <strong className="text-slate-800">$706</strong> and finishes one
              month sooner. That is the whole advantage — real, but smaller than the rhetoric around
              these methods suggests. What the table shows more starkly is the other column: the
              snowball closes an account in <strong className="text-slate-800">month 6</strong>,
              while the avalanche closes nothing until{' '}
              <strong className="text-slate-800">month 24</strong>. Eighteen months of identical
              effort with nothing visibly finished is the real price of the cheaper plan.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>The size of the extra payment matters more than the method.</strong> Drop
                from $300 extra to nothing and this same set of debts takes 68 months instead of 35,
                with the avalanche&apos;s advantage shrinking to $108. Raise it to $200 and the
                avalanche saves $831. In every case, the amount you send beats the order you send it
                in — settle the budget first, then argue about ordering.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Choosing Between the Two</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Run both and look at the gap, not the
              winner.</strong>{' '}
              The calculator above switches between methods on the same debts. If the avalanche saves
              a few hundred dollars, that is a preference question and either answer is defensible.
              If it saves several thousand — which happens when a large balance sits at a card rate —
              the discipline is worth buying.
            </p>
            <p>
              <strong className="text-slate-800">Your history with plans is real
              evidence.</strong>{' '}
              This is not a character judgement; it is a data point about which plan gets finished.
              A method you abandon in month eight costs infinitely more than the one you complete.
              If previous attempts stalled, the snowball&apos;s early wins are worth paying a few
              hundred dollars for.
            </p>
            <p>
              <strong className="text-slate-800">A hybrid is allowed.</strong> Clear one small
              balance for momentum, then switch to strict rate order for everything remaining. You
              give up a fraction of the avalanche&apos;s saving and remove most of what makes it hard
              to sustain. Nobody is checking which method you used.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Assumes fixed rates, no new borrowing, and minimum payments that stay level rather than
              shrinking with the balance. Credit cards recalculate their minimum each month, which
              stretches the payoff further — model a single card precisely with the{' '}
              <Link
                href="/calculators/credit-card-payoff"
                className="text-navy-600 hover:text-navy-800 underline"
              >
                credit card payoff calculator
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
            {[
              {
                href: '/calculators/debt-snowball',
                label: 'Debt Snowball Calculator',
                blurb: 'The same engine ordered by balance instead — smallest debt first.',
              },
              {
                href: '/calculators/credit-card-payoff',
                label: 'Credit Card Payoff Calculator',
                blurb: 'One card at a time, with the shrinking minimum payment modelled properly.',
              },
              {
                href: '/calculators/student-loan-payoff',
                label: 'Student Loan Payoff Calculator',
                blurb: 'Extra payments against a student balance, where forgiveness changes the maths.',
              },
              {
                href: '/calculators/compound-interest',
                label: 'Compound Interest Calculator',
                blurb: 'What the same monthly payment earns once every debt is behind you.',
              },
            ].map((r) => (
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
            For the reasoning behind the choice rather than the arithmetic, read{' '}
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
