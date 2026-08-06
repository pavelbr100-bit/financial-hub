import RentVsBuyCalc from '@/components/calculators/RentVsBuyCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Rent vs Buy Calculator: Find Your Breakeven | FinWiser' },
  description:
    'Compare renting and buying on net worth, not monthly payment. See the year buying pulls ahead once taxes, upkeep, and selling costs are counted. No signup.',
  alternates: { canonical: 'https://finwiser.net/calculators/rent-vs-buy' },
  openGraph: {
    title: 'Free Rent vs Buy Calculator — Find Your Breakeven Year',
    description:
      'See how long you need to stay for buying to beat renting, once taxes, maintenance, and transaction costs are counted.',
    type: 'website',
    url: 'https://finwiser.net/calculators/rent-vs-buy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Rent vs Buy Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Rent vs Buy Calculator | FinWiser',
    description:
      'Compare renting and buying on net worth, and find the year buying pulls ahead.',
  },
}

/**
 * Single source for the visible FAQ and the FAQPage schema below — the two can
 * never drift apart. Every dollar figure here is pinned in
 * lib/calculators/__tests__/rentVsBuy.test.ts.
 */
const faqs: { question: string; answer: string }[] = [
  {
    question: 'How long do I need to stay for buying to be worth it?',
    answer:
      'Longer than most people assume, because you pay transaction costs twice — roughly 3% to buy and 6% to sell. On a $400,000 home at 6.5% with 20% down, against $2,200 rent and a 6% investment return, buying does not overtake renting until about month 169, a little over 14 years. Change one assumption and that moves a lot: at $2,500 rent it falls to about 6 years, and at 4% appreciation to about 6 years 7 months.',
  },
  {
    question: 'What is the 5% rule for renting versus buying?',
    answer:
      'It is a quick screen: multiply the home price by 5%, divide by 12, and compare that to the monthly rent. Above the line, buying is worth a closer look; below it, renting probably wins. On a $400,000 home the line sits at $1,667 a month. It is a useful first pass, but it treats the decision as a snapshot — it has no way to account for how long you stay, and transaction costs are exactly what a short stay cannot absorb. On the same $400,000 home over ten years, this calculator puts the true indifference point nearer $2,295.',
  },
  {
    question: 'Why is my mortgage payment not the real cost of owning?',
    answer:
      'Because it leaves out everything that is not principal and interest. On a $400,000 home with 20% down at 6.5%, the mortgage payment is $2,023 a month — but property tax, homeowners insurance, and maintenance add roughly $867 more, bringing the true monthly cost to $2,889 before a single repair or HOA fee. Comparing $2,023 against a $2,200 rent makes buying look obviously cheaper. Comparing $2,889 against $2,200 tells the truth.',
  },
  {
    question: 'Is renting throwing money away?',
    answer:
      'Only in the same sense that mortgage interest is. In the first year of that $400,000 purchase, about $20,695 goes to interest and another $10,400 to taxes, insurance, and upkeep — none of it recoverable, and all of it before you count what the $92,000 down payment and closing costs would have earned invested. Rent buys housing; the unrecoverable part of a mortgage payment buys housing too. What buying adds is forced saving through principal, plus leverage on any appreciation.',
  },
  {
    question: 'Does this include the mortgage interest deduction?',
    answer:
      'No, deliberately. Since the standard deduction rose, the large majority of filers no longer itemize, so for most households the deduction is worth exactly nothing and including it would flatter buying. If you do itemize, your real cost of owning is lower than shown here, and the breakeven arrives sooner. The same goes for capital gains treatment on a home sale and on the investment account, neither of which is modelled.',
  },
  {
    question: 'What if home prices fall instead of rising?',
    answer:
      'Appreciation is the single most powerful assumption in the whole comparison, because it applies to the full home price rather than to your down payment. In the baseline scenario buying trails renting by $17,660 after ten years. Hold prices perfectly flat and that gap widens to about $126,362; at 2% annual declines it reaches roughly $183,114. If you are not confident about the direction of prices over your horizon, run the calculator at 0% and see whether the answer still works for you.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Rent vs Buy Calculator',
  url: 'https://finwiser.net/calculators/rent-vs-buy',
  description:
    'Compare renting against buying on net worth over a chosen horizon, including property taxes, maintenance, transaction costs, and the return on money not spent on a down payment.',
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
    'Net worth comparison rather than payment comparison',
    'Breakeven year where buying overtakes renting',
    'Property tax, insurance, maintenance, and HOA costs',
    'Buying and selling transaction costs',
    'Investment return on the down payment and monthly difference',
    'Year-by-year net worth table',
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
      name: 'Rent vs Buy Calculator',
      item: 'https://finwiser.net/calculators/rent-vs-buy',
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
    blurb: 'Decided to buy? Price the full monthly payment with taxes, insurance, PMI, and HOA.',
  },
  {
    href: '/calculators/mortgage/compare',
    label: 'Mortgage Comparison Calculator',
    blurb: 'Weigh a 15-year term against a 30-year before locking a rate.',
  },
  {
    href: '/calculators/compound-interest',
    label: 'Compound Interest Calculator',
    blurb: 'Model what the down payment would earn if you invested it and kept renting.',
  },
  {
    href: '/calculators/mortgage-payoff',
    label: 'Mortgage Payoff Calculator',
    blurb: 'Already own? See what extra payments do to your payoff date and interest.',
  },
]

export default async function RentVsBuyPage() {
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
              Rent vs Buy Calculator
            </span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Rent vs Buy Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                Compare renting against buying on net worth rather than monthly payment, and find the
                year buying pulls ahead once taxes, upkeep, and the cost of selling are counted.
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
          {['Net worth, not monthly payment', 'Finds your breakeven year', 'No signup'].map((f) => (
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

        <RentVsBuyCalc user={user ? { email: user.email } : null} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            Why Comparing Rent to a Mortgage Payment Gets It Wrong
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">The mortgage payment is not the cost of
              owning.</strong>{' '}
              It is the cost of the loan. Property tax, homeowners insurance, and maintenance are
              charged on the house itself and never appear on the amortization schedule. On a
              $400,000 home they add roughly $867 a month before a single repair — enough to turn a
              payment that looked cheaper than rent into one that is not.
            </p>
            <p>
              <strong className="text-slate-800">Renting is not the absence of an
              investment.</strong>{' '}
              The renter still has the down payment and closing costs. If a buyer hands over $92,000
              on day one, the honest comparison gives the renter that same $92,000 invested, plus
              anything they save each month by paying less for housing. Ignore that and buying wins
              every comparison automatically, which is why so many rent-versus-buy tools conclude
              that it does.
            </p>
            <p>
              <strong className="text-slate-800">You pay to enter and to leave.</strong> Closing
              costs of about 3% and selling costs of about 6% are the reason a short stay rarely
              works. On a $400,000 purchase that is roughly $36,000 in friction, and it has to be
              recovered out of appreciation and principal before buying is even level with renting.
              A five-year stay has to absorb the same friction a twenty-five year stay spreads thin.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>What this page compares:</strong> net worth at the end of your horizon. The
                buyer sells the house, pays selling costs, and clears the mortgage. The renter cashes
                out an investment account seeded with the buyer&apos;s upfront cash and topped up
                every month either household spends less than the other. Whichever number is larger
                won.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">A Worked Example</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              A <strong className="text-slate-800">$400,000 home at 6.5% with 20% down</strong>,
              against renting a comparable place for{' '}
              <strong className="text-slate-800">$2,200 a month</strong>. Assume 3% annual home
              appreciation, 3% rent increases, a 6% return on invested money, 1.1% property tax, 1%
              maintenance, and 3% and 6% transaction costs.
            </p>
            <p>
              The mortgage payment is <strong className="text-slate-800">$2,023</strong>, which looks
              cheaper than the rent. The actual cost of owning in year one is{' '}
              <strong className="text-slate-800">$2,889</strong> — $674 a month more than renting —
              and buying requires <strong className="text-slate-800">$92,000</strong> in cash before
              anyone moves in.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Net worth if buying versus renting a $400,000 home at 6.5% against $2,200 monthly
                  rent
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      After
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      If You Buy
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      If You Rent
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Ahead By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['5 years', '$136,332', '$166,602', 'Renting, $30,270'],
                    ['10 years', '$234,029', '$251,689', 'Renting, $17,660'],
                    ['15 years', '$353,625', '$348,462', 'Buying, $5,163'],
                  ].map(([when, buy, rentCol, ahead]) => (
                    <tr key={when} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{when}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{buy}</td>
                      <td className="px-4 py-3 text-right text-slate-800 tabular-nums">{rentCol}</td>
                      <td className="px-4 py-3 text-right font-semibold text-navy-700">{ahead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Buying overtakes renting at <strong className="text-slate-800">month 169</strong> — a
              little over fourteen years. That is far longer than the &ldquo;five years and you are
              fine&rdquo; rule of thumb suggests, and it is entirely a function of today&apos;s rate
              being high relative to the rent. Nothing here says buying is a bad idea; it says this
              particular house at this particular rent needs a long stay.
            </p>
            <p>
              Change one input at a time and the breakeven moves sharply. Every row below is the
              baseline with a single assumption altered:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  How the breakeven year changes when one assumption is altered
                </caption>
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Change
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Buying Pulls Ahead
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Rent is $2,500, not $2,200', 'Year 6'],
                    ['Homes appreciate 4%, not 3%', 'Year 6'],
                    ['Mortgage rate is 5.5%, not 6.5%', 'Year 7'],
                    ['Investments return 4%, not 6%', 'Year 7'],
                    ['Selling costs 4%, not 6%', 'Year 11'],
                    ['Homes appreciate 2%, not 3%', 'Year 24'],
                    ['Rent is $1,800, not $2,200', 'Never'],
                    ['Investments return 7%, not 6%', 'Never'],
                    ['Mortgage rate is 7.5%, not 6.5%', 'Never'],
                  ].map(([change, when]) => (
                    <tr key={change} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700">{change}</td>
                      <td
                        className={`px-4 py-3 text-right font-semibold tabular-nums ${
                          when === 'Never' ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {when}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>The honest conclusion:</strong> three of those nine changes make buying never
                catch up within forty years. This is not a calculator that produces a clean answer —
                it produces an answer that is extremely sensitive to two numbers nobody knows in
                advance, home appreciation and investment returns. Treat the breakeven as a range,
                not a date, and check whether the decision still holds at 0% appreciation.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            What the Numbers Cannot Tell You
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Buying is a commitment to a place.</strong> The
              largest financial risk in the model above is not the rate — it is having to sell in year
              three. A job change, a relationship ending, or a city you turn out to dislike all force
              the 6% selling cost at the worst possible time. Renting prices that flexibility
              explicitly; owning charges for it only if you use it.
            </p>
            <p>
              <strong className="text-slate-800">A mortgage is forced saving, and that
              matters.</strong>{' '}
              The comparison assumes the renter reliably invests every dollar they save. Most people
              do not. If the realistic alternative to a mortgage payment is spending the difference,
              buying wins in practice even where it loses on the spreadsheet — the principal portion
              is a savings plan you cannot skip.
            </p>
            <p>
              <strong className="text-slate-800">Rent control and rate locks cut opposite
              ways.</strong>{' '}
              A fixed-rate mortgage caps your housing cost for thirty years while rents rise; a
              stabilised lease or a landlord who does not raise the rent undoes much of that
              advantage. Set the rent growth input to what you actually expect, not the default.
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Assumes a 30-year fixed mortgage, no PMI, and no mortgage interest or property tax
              deduction — most filers take the standard deduction, and including it would flatter
              buying for households that get no benefit from it. Capital gains treatment on the home
              sale and the investment account is not modelled. If you itemize, your breakeven is
              earlier than shown. Once you have decided, size the loan with the{' '}
              <Link
                href="/calculators/mortgage"
                className="text-navy-600 hover:text-navy-800 underline"
              >
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
            For the reasoning behind the numbers rather than the arithmetic, read{' '}
            <Link
              href="/learn/how-much-house-can-you-afford"
              className="text-navy-600 hover:text-navy-800 underline"
            >
              how much house can you afford
            </Link>{' '}
            and{' '}
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
