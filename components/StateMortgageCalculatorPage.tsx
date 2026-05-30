import MortgageCalc from '@/components/calculators/MortgageCalc'
import AdBanner from '@/components/AdBanner'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { StateConfig } from '@/lib/data/state-mortgage-configs'
import { stateConfigs } from '@/lib/data/state-mortgage-configs'

function calcMonthlyPI(homePrice: number, downPct: number, annualRate: number): number {
  const loan = homePrice * (1 - downPct)
  const r = annualRate / 12
  const n = 360
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function fmtPrice(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

type Props = { config: StateConfig }

export default async function StateMortgageCalculatorPage({ config }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const {
    stateName, stateAbbr, slug,
    avgPropertyTaxRate, avgHomeInsurance, avgHomePrice,
    majorCities, firstTimeBuyerProgram, contentBlurbs,
  } = config

  const initialValues = {
    tax: avgPropertyTaxRate.toString(),
    insurance: avgHomeInsurance.toLocaleString('en-US'),
  }

  const priceRows = [
    { home: Math.round(avgHomePrice * 0.8), down: 0.2 },
    { home: avgHomePrice,                   down: 0.2 },
    { home: Math.round(avgHomePrice * 1.25), down: 0.2 },
  ]

  const otherStates = stateConfigs.filter(c => c.slug !== slug)

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
      { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators/mortgage' },
      { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
      { '@type': 'ListItem', position: 4, name: `${stateName} Mortgage Calculator`, item: `https://finwiser.net/calculators/mortgage/${slug}` },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the average property tax rate in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average effective property tax rate in ${stateName} is approximately ${avgPropertyTaxRate}% of assessed home value per year. ${contentBlurbs.taxContext}`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average home price in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${contentBlurbs.marketOverview} Use the calculator above with ${stateAbbr}-specific defaults pre-loaded to estimate your monthly payment.`,
        },
      },
      {
        '@type': 'Question',
        name: `What first-time homebuyer programs are available in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${stateName} offers first-time homebuyer support through the ${firstTimeBuyerProgram.name}. Income and purchase price limits apply. Visit ${firstTimeBuyerProgram.url} for current program details and eligibility requirements.`,
        },
      },
      {
        '@type': 'Question',
        name: `How is a mortgage payment calculated in ${stateName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A ${stateName} mortgage payment includes principal and interest (calculated via the standard amortization formula), property tax escrowed monthly at roughly ${avgPropertyTaxRate}% of home value annually, homeowner's insurance, and PMI if your down payment is below 20%. The calculator above has ${stateAbbr}-specific defaults pre-loaded.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 flex-wrap">
          <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/calculators/mortgage" className="hover:text-navy-600 transition-colors">Mortgage Calculator</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{stateName}</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            {stateName} Mortgage Calculator
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Estimate your monthly payment with {stateName} property tax rates pre-loaded.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            `${stateAbbr} tax rate pre-loaded (${avgPropertyTaxRate}%)`,
            'Includes taxes, insurance & PMI',
            'Extra payment savings',
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
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <MortgageCalc user={user ? { email: user.email } : null} initialValues={initialValues} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        {config.topCallout && (
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-900 mb-1">{config.topCallout.heading}</p>
                <p className="text-amber-800 text-sm leading-relaxed">{config.topCallout.body}</p>
              </div>
            </div>
          </div>
        )}

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Home Prices in {stateName}</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>{contentBlurbs.marketOverview}</p>
            <p>Major markets include {majorCities.join(', ')}. Monthly P&amp;I estimates at 7%, 30-year fixed with 20% down:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left mt-2">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 pr-6 font-semibold text-slate-700">Home Price</th>
                    <th className="pb-2 pr-6 font-semibold text-slate-700">Loan Amount</th>
                    <th className="pb-2 font-semibold text-slate-700">Est. Monthly P&amp;I</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {priceRows.map(row => (
                    <tr key={row.home} className="border-b border-slate-100">
                      <td className="py-2 pr-6">{fmtPrice(row.home)}</td>
                      <td className="py-2 pr-6">{fmtPrice(row.home * (1 - row.down))}</td>
                      <td className="py-2">~{fmtPrice(calcMonthlyPI(row.home, row.down, 0.07))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs">Assumes 20% down, 30-year fixed at 7%, P&amp;I only. Add taxes and insurance for full payment.</p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Property Taxes in {stateName}</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>{contentBlurbs.taxContext}</p>
            <p>
              On a {fmtPrice(avgHomePrice)} home at {avgPropertyTaxRate}%, that&apos;s roughly{' '}
              <strong className="text-slate-800">{fmtPrice(Math.round(avgHomePrice * avgPropertyTaxRate / 100 / 12))}/month</strong>{' '}
              in property taxes, collected in escrow by your lender. At the national average of 1.1%, the same home would cost{' '}
              {fmtPrice(Math.round(avgHomePrice * 1.1 / 100 / 12))}/month — a meaningful difference over the life of the loan.
            </p>
            <p>
              The calculator above uses {avgPropertyTaxRate}% as a starting point. Update it with your specific county rate for a more accurate estimate. Your lender will verify the exact rate during underwriting.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Reading Your {stateAbbr} Mortgage Payment Breakdown</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>The calculator breaks your total monthly payment into four components:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-slate-800">Principal &amp; Interest</strong> — the base loan payment, calculated using the standard amortization formula.</li>
              <li><strong className="text-slate-800">Property Tax</strong> — at {stateName}&apos;s {avgPropertyTaxRate}% average, collected monthly in escrow by your lender.</li>
              <li>
                <strong className="text-slate-800">Home Insurance</strong> — estimated at {fmtPrice(avgHomeInsurance)}/year ({fmtPrice(Math.round(avgHomeInsurance / 12))}/month) for {stateName}.
                Your actual cost depends on location, coverage, and your insurer.
              </li>
              <li><strong className="text-slate-800">PMI</strong> — required if your down payment is under 20%. Typically 0.5–1.5% of the loan per year, cancellable once you reach 20% equity.</li>
            </ul>
            <p>Scroll below the payment summary to see the full amortization schedule — every monthly payment shown with principal, interest, and remaining balance.</p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">First-Time Homebuyer Programs in {stateName}</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              {stateName} offers first-time homebuyer support through the{' '}
              <strong className="text-slate-800">{firstTimeBuyerProgram.name}</strong>. This program typically provides:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Competitive fixed-rate mortgage financing</li>
              <li>Down payment assistance for eligible buyers</li>
              <li>Available for FHA, VA, USDA, and conventional loans (varies by program)</li>
              <li>Income and purchase price limits apply</li>
            </ul>
            <p>
              For current eligibility requirements, income limits, and participating lenders, visit{' '}
              <a href={firstTimeBuyerProgram.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">
                {firstTimeBuyerProgram.url.replace('https://', '')}
              </a>.
            </p>
            <p>
              Use the calculator above to estimate your full monthly payment before applying. Knowing your number makes it easier to compare programs and evaluate affordability.
            </p>
          </div>
        </section>

        {config.extraSections?.map(section => (
          <section key={section.heading} className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900 mb-4">{section.heading}</h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              {section.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              {section.bullets && (
                <ul className="list-disc list-inside space-y-1">
                  {section.bullets.map(b => <li key={b}>{b}</li>)}
                </ul>
              )}
              {section.link && (
                <p>
                  <a href={section.link.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">
                    {section.link.text}
                  </a>
                </p>
              )}
              {section.note && (
                <p className="text-slate-400 italic text-xs">{section.note}</p>
              )}
            </div>
          </section>
        ))}

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What is the average property tax rate in {stateName}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The average effective property tax rate in {stateName} is approximately {avgPropertyTaxRate}% of assessed home value per year. {contentBlurbs.taxContext}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What is the average home price in {stateName}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{contentBlurbs.marketOverview}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Does {stateName} have good mortgage rates?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Mortgage rates in {stateName} are generally in line with national averages since they&apos;re primarily driven by federal monetary policy and secondary mortgage markets.
                Borrowers with strong credit (740+) and a 20% down payment typically qualify for rates at or near the national average.
                Shopping multiple lenders — including local credit unions and regional banks — can result in meaningfully lower rates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What first-time homebuyer programs are available in {stateName}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {stateName} offers homebuyer support through the {firstTimeBuyerProgram.name}. Income and purchase price limits apply. Visit{' '}
                <a href={firstTimeBuyerProgram.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">
                  {firstTimeBuyerProgram.url.replace('https://', '')}
                </a>{' '}
                for current program details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">How is a mortgage payment calculated in {stateName}?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A {stateName} mortgage payment includes principal and interest (via the standard amortization formula), property tax escrowed monthly at roughly {avgPropertyTaxRate}% of home value annually,
                homeowner&apos;s insurance, and PMI if your down payment is below 20%. The calculator above has {stateAbbr}-specific defaults pre-loaded.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Related Calculators &amp; Guides</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/calculators/mortgage" className="text-navy-700 underline hover:text-navy-900">Mortgage Calculator</Link> — standard mortgage calculator with full amortization</li>
            <li><Link href="/calculators/biweekly-mortgage" className="text-navy-700 underline hover:text-navy-900">Biweekly Mortgage Calculator</Link> — see how biweekly payments cut your loan term</li>
            <li><Link href="/learn/mortgage-payoff-strategies" className="text-navy-700 underline hover:text-navy-900">How to Pay Off Your Mortgage Early — 7 Proven Strategies</Link></li>
            {otherStates.map(s => (
              <li key={s.slug}>
                <Link href={`/calculators/mortgage/${s.slug}`} className="text-navy-700 underline hover:text-navy-900">
                  {s.stateName} Mortgage Calculator
                </Link>{' '}
                — {s.stateAbbr} tax rates pre-loaded ({s.avgPropertyTaxRate}%)
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-6 mb-2 text-xs text-slate-400 leading-relaxed">
          Results are estimates based on the information you enter. Property tax rates and home prices are approximate and may not reflect current local conditions. FinWiser uses standard amortization formulas. This is not financial advice.
        </p>
      </div>
    </>
  )
}
