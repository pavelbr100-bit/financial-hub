import MortgageCalc from '@/components/calculators/MortgageCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'North Carolina Mortgage Calculator — NC Tax Rates Included | FinWiser' },
  description:
    'Free North Carolina mortgage calculator with NC average property tax rates pre-loaded. Estimate your full monthly payment including taxes, insurance, and PMI.',
  alternates: { canonical: 'https://finwiser.net/calculators/mortgage/north-carolina' },
  openGraph: {
    title: 'North Carolina Mortgage Calculator — NC Tax Rates Included | FinWiser',
    description: 'Free North Carolina mortgage calculator with NC average property tax rates pre-loaded. Estimate your full monthly payment including taxes, insurance, and PMI.',
    type: 'website',
    url: 'https://finwiser.net/calculators/mortgage/north-carolina',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'North Carolina Mortgage Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'North Carolina Mortgage Calculator — NC Tax Rates Included | FinWiser',
    description: 'Free North Carolina mortgage calculator with NC average property tax rates pre-loaded. Estimate your full monthly payment including taxes, insurance, and PMI.',
  },
}

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://finwiser.net/calculators/mortgage' },
    { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
    { '@type': 'ListItem', position: 4, name: 'North Carolina Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage/north-carolina' },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the average property tax rate in North Carolina?',
      acceptedAnswer: { '@type': 'Answer', text: 'The average effective property tax rate in North Carolina is approximately 0.77% of assessed home value per year — well below the national average of about 1.1%. Rates vary by county: Mecklenburg County (Charlotte) is around 0.85%, Wake County (Raleigh) is around 0.74%, and rural counties can be lower.' },
    },
    {
      '@type': 'Question',
      name: 'What is the average home price in North Carolina?',
      acceptedAnswer: { '@type': 'Answer', text: 'As of 2025–2026, the median home price in North Carolina is approximately $320,000–$340,000 statewide. Prices vary significantly by market: Charlotte median is around $380,000–$420,000, Raleigh around $400,000–$440,000, Durham around $360,000–$390,000, and Asheville around $430,000–$480,000.' },
    },
    {
      '@type': 'Question',
      name: 'Does North Carolina have good mortgage rates?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mortgage rates in North Carolina are generally in line with national averages since they are primarily driven by federal monetary policy and secondary mortgage markets. NC borrowers with strong credit (740+) and a 20% down payment typically qualify for rates at or slightly below the national average. Shopping multiple lenders — including local credit unions and banks — can result in meaningfully lower rates.' },
    },
    {
      '@type': 'Question',
      name: 'What first-time homebuyer programs are available in North Carolina?',
      acceptedAnswer: { '@type': 'Answer', text: 'The North Carolina Housing Finance Agency (NCHFA) offers the NC Home Advantage Mortgage program, which provides competitive fixed-rate mortgages and down payment assistance of up to 3–5% of the loan amount for eligible first-time buyers. Income and purchase price limits apply. Visit nchfa.com for current program details and eligibility requirements.' },
    },
    {
      '@type': 'Question',
      name: 'How is a mortgage payment calculated in North Carolina?',
      acceptedAnswer: { '@type': 'Answer', text: 'A North Carolina mortgage payment includes the same components as any standard mortgage: principal and interest (calculated via the standard amortization formula), property tax (escrowed monthly at roughly 0.77% of home value annually in NC), homeowner\'s insurance, and PMI if your down payment is below 20%. Use the calculator above with NC-specific defaults already pre-loaded to estimate your payment.' },
    },
  ],
}

const ncInitialValues = {
  tax: '0.77',
  insurance: '1,400',
}

export default async function NorthCarolinaMortgagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 flex-wrap">
          <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/calculators/mortgage" className="hover:text-navy-600 transition-colors">Mortgage Calculator</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">North Carolina</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            North Carolina Mortgage Calculator
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Estimate your monthly payment with North Carolina property tax rates pre-loaded.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'NC tax rate pre-loaded (0.77%)',
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

        <MortgageCalc user={user ? { email: user.email } : null} initialValues={ncInitialValues} />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        {/* NC Context */}
        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Home Prices in North Carolina</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              North Carolina has become one of the fastest-growing states in the country, driven by a strong job market in technology, finance, and healthcare — particularly in the Research Triangle (Raleigh-Durham-Chapel Hill) and Charlotte metro areas. That population growth has pushed home prices up significantly over the past several years, though NC remains more affordable than comparable metros on the East Coast.
            </p>
            <p>
              As of 2025–2026, median home prices by market are approximately:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left mt-2">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 pr-6 font-semibold text-slate-700">Market</th>
                    <th className="pb-2 pr-6 font-semibold text-slate-700">Median Home Price</th>
                    <th className="pb-2 font-semibold text-slate-700">Est. Monthly P&amp;I at 7%</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-100"><td className="py-2 pr-6">Raleigh</td><td className="py-2 pr-6">~$420,000</td><td className="py-2">~$2,237</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-6">Charlotte</td><td className="py-2 pr-6">~$390,000</td><td className="py-2">~$2,077</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-6">Durham</td><td className="py-2 pr-6">~$375,000</td><td className="py-2">~$1,997</td></tr>
                  <tr className="border-b border-slate-100"><td className="py-2 pr-6">Asheville</td><td className="py-2 pr-6">~$450,000</td><td className="py-2">~$2,396</td></tr>
                  <tr><td className="py-2 pr-6">NC Statewide</td><td className="py-2 pr-6">~$330,000</td><td className="py-2">~$1,757</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-500 text-xs">Assumes 20% down payment, 30-year fixed rate at 7%, P&amp;I only.</p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Property Taxes in North Carolina</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              North Carolina&apos;s average effective property tax rate is <strong className="text-slate-800">0.77% per year</strong> — significantly below the national average of approximately 1.1%. That difference adds up: on a $400,000 home, NC buyers pay roughly $3,080/year in property taxes compared to $4,400/year at the national average — saving $110/month on their mortgage payment.
            </p>
            <p>
              Property taxes in NC are set at the county level and can vary. A few reference points:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li><strong className="text-slate-800">Wake County (Raleigh):</strong> ~0.74%</li>
              <li><strong className="text-slate-800">Mecklenburg County (Charlotte):</strong> ~0.85%</li>
              <li><strong className="text-slate-800">Durham County:</strong> ~0.92%</li>
              <li><strong className="text-slate-800">Buncombe County (Asheville):</strong> ~0.67%</li>
            </ul>
            <p>
              The calculator above uses 0.77% as a starting point. Update it with your specific county rate for a more accurate estimate.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Reading Your NC Mortgage Payment Breakdown</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              The calculator breaks your total monthly payment into four components:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-slate-800">Principal &amp; Interest</strong> — the base loan payment. On a $350,000 loan at 7% for 30 years, this is $2,329/month.</li>
              <li><strong className="text-slate-800">Property Tax</strong> — at NC&apos;s 0.77% average, a $350,000 home costs about $225/month in taxes, collected in escrow by your lender.</li>
              <li><strong className="text-slate-800">Home Insurance</strong> — typically $1,200–$1,600/year in NC ($100–$133/month), depending on location and coverage. Coastal areas may be higher due to hurricane risk.</li>
              <li><strong className="text-slate-800">PMI</strong> — if your down payment is under 20%, PMI is typically 0.5–1.5% of the loan per year. On a $315,000 loan (10% down on $350K), that&apos;s $131–$394/month until you reach 20% equity.</li>
            </ul>
            <p>
              Scroll below the payment summary to see the full amortization schedule — every monthly payment shown with principal, interest, and remaining balance.
            </p>
          </div>
        </section>

        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">First-Time Homebuyer Programs in North Carolina</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              North Carolina offers strong first-time homebuyer support through the <strong className="text-slate-800">North Carolina Housing Finance Agency (NCHFA)</strong>. Their flagship program, the <strong className="text-slate-800">NC Home Advantage Mortgage</strong>, provides:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Competitive fixed-rate mortgage financing</li>
              <li>Down payment assistance of up to 3–5% of the loan amount, structured as a forgivable second mortgage</li>
              <li>Available for FHA, VA, USDA, and conventional loans</li>
              <li>Income limits and purchase price limits apply</li>
            </ul>
            <p>
              The NC Home Advantage Mortgage is available to both first-time buyers and military veterans. Income limits vary by county and household size. For current eligibility requirements, income limits, and a list of participating lenders, visit <a href="https://www.nchfa.com" target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">nchfa.com</a>.
            </p>
            <p>
              Use the calculator above to estimate your full monthly payment before applying. Knowing your number makes it easier to compare programs and evaluate affordability.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What is the average property tax rate in North Carolina?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">The average effective property tax rate in North Carolina is approximately 0.77% of assessed home value per year — well below the national average of about 1.1%. Rates vary by county: Mecklenburg County (Charlotte) is around 0.85%, Wake County (Raleigh) is around 0.74%, and rural counties can be lower.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What is the average home price in North Carolina?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">As of 2025–2026, the median home price in North Carolina is approximately $320,000–$340,000 statewide. Prices vary significantly by market: Charlotte is around $380,000–$420,000, Raleigh around $400,000–$440,000, Durham around $360,000–$390,000, and Asheville around $430,000–$480,000.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">Does North Carolina have good mortgage rates?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Mortgage rates in North Carolina are generally in line with national averages since they&apos;re primarily driven by federal monetary policy and secondary mortgage markets. Borrowers with strong credit (740+) and a 20% down payment typically qualify for rates at or slightly below the national average. Shopping multiple lenders — including local NC credit unions and banks — can result in meaningfully lower rates.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">What first-time homebuyer programs are available in North Carolina?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">The North Carolina Housing Finance Agency (NCHFA) offers the NC Home Advantage Mortgage, which provides competitive fixed-rate mortgages and down payment assistance of up to 3–5% of the loan amount for eligible buyers. Income and purchase price limits apply. Visit <a href="https://www.nchfa.com" target="_blank" rel="noopener noreferrer" className="text-navy-700 underline hover:text-navy-900">nchfa.com</a> for current program details.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-1">How is a mortgage payment calculated in North Carolina?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">A North Carolina mortgage payment includes principal and interest (calculated via the standard amortization formula), property tax escrowed monthly at roughly 0.77% of home value annually, homeowner&apos;s insurance, and PMI if your down payment is below 20%. The calculator above has NC-specific defaults pre-loaded so you can get an accurate estimate immediately.</p>
            </div>
          </div>
        </section>

        {/* Related links */}
        <section className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Related Calculators &amp; Guides</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/calculators/mortgage" className="text-navy-700 underline hover:text-navy-900">Mortgage Calculator</Link> — standard mortgage calculator with full amortization</li>
            <li><Link href="/calculators/biweekly-mortgage" className="text-navy-700 underline hover:text-navy-900">Biweekly Mortgage Calculator</Link> — see how biweekly payments cut your loan term</li>
            <li><Link href="/learn/mortgage-payoff-strategies" className="text-navy-700 underline hover:text-navy-900">How to Pay Off Your Mortgage Early — 7 Proven Strategies</Link></li>
          </ul>
        </section>

        <p className="mt-6 mb-2 text-xs text-slate-400 leading-relaxed">
          Results are estimates based on the information you enter. Property tax rates and home prices are approximate and may not reflect current local conditions. FinWiser uses standard amortization formulas. This is not financial advice.
        </p>
      </div>
    </>
  )
}
