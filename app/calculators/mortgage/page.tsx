import MortgageCalc from '@/components/calculators/MortgageCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Mortgage Calculator with Taxes, Insurance, PMI & Extra Payments | FinWiser' },
  description:
    'Free mortgage calculator. Estimate your full monthly payment including principal, interest, property tax, home insurance, and PMI. See how extra payments reduce your interest and shorten your loan.',
  alternates: { canonical: 'https://finwiser.net/calculators/mortgage' },
  openGraph: {
    title: 'Free Mortgage Calculator — Monthly Payment, PMI & Amortization',
    description: 'Calculate your full monthly mortgage payment including P&I, taxes, insurance, and PMI. See how extra payments save you thousands.',
    type: 'website',
    url: 'https://finwiser.net/calculators/mortgage',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Mortgage Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Calculator | FinWiser',
    description: 'Calculate your full monthly mortgage payment including P&I, taxes, insurance, and PMI.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Calculator',
  url: 'https://finwiser.net/calculators/mortgage',
  description: 'Calculate your full monthly mortgage payment including P&I, property tax, insurance, and PMI. Add extra payments to see interest savings.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Monthly payment breakdown',
    'Full amortization schedule',
    'PMI calculation',
    'Extra payment savings calculator',
    'Property tax and insurance included',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Mortgage Calculator', item: 'https://finwiser.net/calculators/mortgage' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is a monthly mortgage payment calculated?',
      acceptedAnswer: { '@type': 'Answer', text: 'A monthly mortgage payment is calculated using the amortization formula: Payment = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments. For a $300,000 loan at 7% for 30 years, the principal and interest payment is about $1,996/month.' },
    },
    {
      '@type': 'Question',
      name: 'What is included in a full monthly mortgage payment?',
      acceptedAnswer: { '@type': 'Answer', text: 'A full mortgage payment typically covers four things: principal (reducing your loan balance), interest (the lender\'s fee), property tax (usually escrowed at roughly 1–1.5% of home value per year), and homeowner\'s insurance. If your down payment was less than 20%, PMI (private mortgage insurance) is added as well. Together these are called PITI.' },
    },
    {
      '@type': 'Question',
      name: 'What is PMI and when can I stop paying it?',
      acceptedAnswer: { '@type': 'Answer', text: 'PMI (private mortgage insurance) protects the lender if you default. It\'s required when your down payment is below 20% and typically costs 0.5–1.5% of the loan per year, added to your monthly payment. Under the Homeowners Protection Act, lenders must automatically cancel PMI when you reach 22% equity based on the original purchase price and payment schedule.' },
    },
    {
      '@type': 'Question',
      name: 'How much do extra mortgage payments save?',
      acceptedAnswer: { '@type': 'Answer', text: 'Extra payments go directly toward principal, reducing future interest charges. On a $300,000 30-year mortgage at 7%, paying an extra $200/month saves over $60,000 in interest and pays off the loan roughly 5 years early. The earlier in the loan term you make extra payments, the greater the savings.' },
    },
    {
      '@type': 'Question',
      name: 'What is the 28/36 rule for mortgages?',
      acceptedAnswer: { '@type': 'Answer', text: 'The 28/36 rule is a lender guideline for affordability. Your housing costs (mortgage, taxes, insurance) should not exceed 28% of your gross monthly income, and your total debt payments (housing plus auto loans, student loans, credit cards) should not exceed 36%. Staying within these limits reduces the risk of financial stress and improves loan approval odds.' },
    },
    {
      '@type': 'Question',
      name: 'How accurate is this mortgage calculator?',
      acceptedAnswer: { '@type': 'Answer', text: 'This calculator uses standard amortization formulas and gives accurate estimates for principal, interest, taxes, insurance, and PMI. Actual lender quotes may vary based on your credit score, loan type, and local tax rates.' },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator include property taxes and insurance?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enter your estimated annual property tax rate and insurance cost in the optional fields. If you\'re unsure, 1.1% for taxes and $1,200/year for insurance is a reasonable starting estimate for most areas.' },
    },
    {
      '@type': 'Question',
      name: 'How do extra payments work in this calculator?',
      acceptedAnswer: { '@type': 'Answer', text: 'Enter an extra monthly amount in the Extra Payments field. The calculator will show you the reduced total interest and earlier payoff date compared to the standard schedule. The amortization table updates to reflect every payment under the new plan.' },
    },
    {
      '@type': 'Question',
      name: 'What is a good mortgage rate right now?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mortgage rates change daily and vary by lender, credit score, loan type, and down payment. As a general benchmark, rates in the 6–8% range have been typical for 30-year fixed mortgages in recent years. Check current rates with your lender or a rate comparison site.' },
    },
  ],
}

export default async function MortgagePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const initialValues = params.homePrice ? params : undefined

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">Mortgage Calculator</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
              Mortgage Calculator
            </h1>
            <p className="text-slate-500 max-w-2xl">
              Estimate your full monthly mortgage payment including principal, interest, property tax, home insurance, and PMI.
            </p>
          </div>
          <Link
            href="/calculators/mortgage/compare"
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 border border-navy-300 hover:border-navy-500 text-navy-700 hover:text-navy-900 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Compare scenarios
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          'Includes PMI, taxes & insurance',
          'Extra payment savings',
          'Side-by-side scenario comparison',
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

      <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">What Goes Into a Mortgage Payment?</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong className="text-slate-800">Principal & Interest (P&I)</strong> is the base payment that pays down your loan. Early payments are mostly interest; over time more goes toward principal.
          </p>
          <p>
            <strong className="text-slate-800">Property Tax</strong> is collected monthly by your lender and held in escrow, then paid to your local government annually. Rates vary widely by location — 1–2% of home value per year is typical.
          </p>
          <p>
            <strong className="text-slate-800">Home Insurance</strong> protects against damage and liability. Lenders require it. Expect $800–$2,000/year depending on location and coverage.
          </p>
          <p>
            <strong className="text-slate-800">PMI (Private Mortgage Insurance)</strong> is required when your down payment is less than 20%. It protects the lender — not you — and typically costs 0.5–1.5% of the loan per year. It can be cancelled once you reach 20% equity.
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">How to Use This Mortgage Calculator</h2>
        <ol className="space-y-3 text-slate-600 text-sm leading-relaxed list-decimal list-inside">
          <li><strong className="text-slate-800">Enter the home price</strong> and your down payment amount or percentage.</li>
          <li><strong className="text-slate-800">Enter the interest rate</strong> and loan term (30 years, 15 years, etc.).</li>
          <li><strong className="text-slate-800">Fill in the optional fields</strong> — annual property tax rate, homeowner&apos;s insurance cost, and PMI rate — to see your full monthly payment including taxes, insurance, and PMI.</li>
          <li><strong className="text-slate-800">Add an extra monthly payment</strong> to see how much interest you&apos;ll save and how many years earlier you&apos;ll pay off the loan.</li>
        </ol>
        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          Results update automatically as you type. Scroll past the payment summary to see the full amortization schedule — every payment broken down by principal, interest, and remaining balance.
        </p>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">What Is Included in a Monthly Mortgage Payment?</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p><strong className="text-slate-800">Principal (P)</strong> — the portion of each payment that reduces your loan balance. Early in a 30-year loan, this is a small fraction of each payment.</p>
          <p><strong className="text-slate-800">Interest (I)</strong> — the lender&apos;s fee, calculated on your remaining balance each month. In the early years, interest makes up roughly 75–85% of each payment.</p>
          <p><strong className="text-slate-800">Property Tax (T)</strong> — collected monthly and held in escrow, then paid to your local government. Property taxes average 1–2% of home value per year nationally. On a $400,000 home at 1.2%, that&apos;s about $400/month.</p>
          <p><strong className="text-slate-800">Home Insurance (I)</strong> — required by all mortgage lenders. Typical cost is $800–$2,000 per year ($67–$167/month), varying by location and coverage level.</p>
          <p><strong className="text-slate-800">PMI (Private Mortgage Insurance)</strong> — required when your down payment is less than 20%. Typically 0.5–1.5% of the loan per year, cancellable once you reach 20% equity.</p>
          <p><strong className="text-slate-800">HOA Fees (A)</strong> — if your home is in a managed community (condo, townhome, planned development), monthly HOA fees are part of your true housing cost even though they&apos;re not part of the mortgage itself.</p>
          <p className="mt-2 pt-4 border-t border-slate-100 text-slate-500 italic">Together these are sometimes called <strong className="text-slate-700 not-italic">PITIA</strong> — Principal, Interest, Tax, Insurance, and Association fees.</p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Mortgage Payment Formula</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          Monthly principal and interest payments are calculated using the standard amortization formula:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4 text-center font-mono text-sm text-slate-800 mb-4">
          M = P &times; [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> &minus; 1]
        </div>
        <ul className="space-y-1 text-slate-600 text-sm mb-6">
          <li><strong className="text-slate-800">M</strong> = monthly payment</li>
          <li><strong className="text-slate-800">P</strong> = principal (loan amount)</li>
          <li><strong className="text-slate-800">r</strong> = monthly interest rate (annual rate &divide; 12)</li>
          <li><strong className="text-slate-800">n</strong> = total number of payments (years &times; 12)</li>
        </ul>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-5 py-4 text-slate-700 text-sm">
          <strong>Worked example:</strong> $400,000 loan at 7% for 30 years.<br />
          r = 0.07 &divide; 12 = 0.005833 &nbsp;|&nbsp; n = 360<br />
          M = $400,000 &times; [0.005833 &times; (1.005833)<sup>360</sup>] / [(1.005833)<sup>360</sup> &minus; 1] = <strong>$2,661/month</strong> (P&amp;I only)
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Example Monthly Mortgage Payments</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          All rows assume a 30-year fixed rate. &ldquo;With Taxes &amp; Insurance&rdquo; adds estimated property tax (1.1% annually) and homeowner&apos;s insurance ($1,400/year).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 pr-4 font-semibold text-slate-700">Home Price</th>
                <th className="pb-2 pr-4 font-semibold text-slate-700">Down Payment</th>
                <th className="pb-2 pr-4 font-semibold text-slate-700">Rate</th>
                <th className="pb-2 pr-4 font-semibold text-slate-700">Monthly P&amp;I</th>
                <th className="pb-2 font-semibold text-slate-700">With Taxes &amp; Insurance (est.)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100"><td className="py-2 pr-4">$250,000</td><td className="py-2 pr-4">10%</td><td className="py-2 pr-4">6.5%</td><td className="py-2 pr-4">$1,422</td><td className="py-2">~$1,900</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4">$350,000</td><td className="py-2 pr-4">20%</td><td className="py-2 pr-4">7.0%</td><td className="py-2 pr-4">$1,863</td><td className="py-2">~$2,350</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-4">$450,000</td><td className="py-2 pr-4">20%</td><td className="py-2 pr-4">7.0%</td><td className="py-2 pr-4">$2,395</td><td className="py-2">~$3,000</td></tr>
              <tr><td className="py-2 pr-4">$550,000</td><td className="py-2 pr-4">20%</td><td className="py-2 pr-4">6.5%</td><td className="py-2 pr-4">$2,765</td><td className="py-2">~$3,450</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">How PMI Affects Your Payment</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            PMI is triggered when your down payment is less than 20% of the home&apos;s purchase price. The lender requires it because a smaller down payment means higher risk if you default.
          </p>
          <p>
            <strong className="text-slate-800">Example:</strong> $350,000 home with a 10% down payment &rarr; $315,000 loan. At 0.5–1.5% PMI annually, that&apos;s <strong>$131–$394/month</strong> added on top of principal, interest, taxes, and insurance.
          </p>
          <p>
            <strong className="text-slate-800">How to cancel PMI:</strong> Once your loan balance reaches 80% of the home&apos;s original value, request cancellation in writing. Your lender may require a formal appraisal. Under federal law, lenders must automatically cancel PMI when you reach 78% LTV — but you don&apos;t have to wait. Requesting at 80% saves you months of premiums.
          </p>
          <p>
            <strong className="text-slate-800">Tip:</strong> Putting 20% down eliminates PMI entirely. On a $350,000 loan, that&apos;s $131–$394/month saved from day one.
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">How Extra Payments Reduce Interest</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            Every extra dollar you pay goes directly toward your principal balance. A lower balance means less interest accrues the following month, so more of every future regular payment also reduces principal. This compounding effect accelerates over the life of the loan.
          </p>
          <p>
            <strong className="text-slate-800">Example:</strong> $350,000 mortgage at 7% for 30 years. Standard P&amp;I: $2,329/month. Add $200/month extra:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Total interest saved: <strong className="text-slate-800">~$54,000</strong></li>
            <li>Loan paid off: <strong className="text-slate-800">~5 years earlier</strong></li>
          </ul>
          <p>
            Enter an amount in the <strong className="text-slate-800">Extra Monthly Payment</strong> field in the calculator above. The amortization table will update automatically to show your new payoff date and total interest cost.
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">15-Year vs. 30-Year Mortgage</h2>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-2 pr-8 font-semibold text-slate-700"></th>
                <th className="pb-2 pr-8 font-semibold text-slate-700">15-Year</th>
                <th className="pb-2 font-semibold text-slate-700">30-Year</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr className="border-b border-slate-100"><td className="py-2 pr-8 font-medium text-slate-700">Loan Amount</td><td className="py-2 pr-8">$350,000</td><td className="py-2">$350,000</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-8 font-medium text-slate-700">Rate</td><td className="py-2 pr-8">6.5%</td><td className="py-2">7.0%</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-8 font-medium text-slate-700">Monthly P&amp;I</td><td className="py-2 pr-8">$3,050</td><td className="py-2">$2,329</td></tr>
              <tr className="border-b border-slate-100"><td className="py-2 pr-8 font-medium text-slate-700">Total Interest</td><td className="py-2 pr-8">$199,000</td><td className="py-2">$488,000</td></tr>
              <tr><td className="py-2 pr-8 font-medium text-slate-700">Total Cost</td><td className="py-2 pr-8">$549,000</td><td className="py-2">$838,000</td></tr>
            </tbody>
          </table>
        </div>
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            The 30-year mortgage offers a lower required payment and more monthly flexibility. The 15-year saves approximately $289,000 in total interest — but requires a payment that&apos;s $721/month higher.
          </p>
          <p>
            Many financial advisors suggest choosing the 30-year if you&apos;ll consistently invest the monthly payment difference, since long-term market returns have historically outpaced mortgage rates. The 15-year is the better choice if you want a guaranteed return in the form of interest savings and a faster path to owning your home outright.
          </p>
          <p>
            Use <Link href="/calculators/mortgage/compare" className="text-navy-700 underline hover:text-navy-900">FinWiser&apos;s mortgage comparison calculator</Link> to model both scenarios side by side with your specific numbers.
          </p>
        </div>
      </section>

      <section className="mt-8 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">How accurate is this mortgage calculator?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">This calculator uses standard amortization formulas and gives accurate estimates for principal, interest, taxes, insurance, and PMI. Actual lender quotes may vary based on your credit score, loan type, and local tax rates.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Does this calculator include property taxes and insurance?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Yes. Enter your estimated annual property tax rate and insurance cost in the optional fields. If you&apos;re unsure, 1.1% for taxes and $1,200/year for insurance is a reasonable starting estimate for most areas.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">What is PMI and when can I remove it?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">PMI (Private Mortgage Insurance) is required when your down payment is less than 20% of the home price. You can request cancellation once your loan balance reaches 80% of the home&apos;s original value. Contact your servicer in writing to initiate the process — you don&apos;t have to wait for automatic cancellation at 78%.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">How do extra payments work in this calculator?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Enter an extra monthly amount in the &ldquo;Extra Payments&rdquo; field. The calculator will show you the reduced total interest and earlier payoff date compared to the standard schedule. The amortization table updates to reflect every payment under the new plan.</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">What is a good mortgage rate right now?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Mortgage rates change daily and vary by lender, credit score, loan type, and down payment. As a general benchmark, rates in the 6–8% range have been typical for 30-year fixed mortgages in recent years. Check current rates with your lender or a rate comparison site for up-to-date numbers.</p>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-navy-900 mb-4">Related Calculators &amp; Guides</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li><Link href="/calculators/biweekly-mortgage" className="text-navy-700 underline hover:text-navy-900">Biweekly Mortgage Calculator</Link> — see how biweekly payments cut your loan term and total interest</li>
          <li><Link href="/calculators/mortgage/compare" className="text-navy-700 underline hover:text-navy-900">Mortgage Comparison Calculator</Link> — compare two loan scenarios side by side</li>
          <li><Link href="/calculators/loan-amortization" className="text-navy-700 underline hover:text-navy-900">Loan Amortization Calculator</Link> — full amortization schedule for any loan type</li>
          <li><Link href="/learn/mortgage-payoff-strategies" className="text-navy-700 underline hover:text-navy-900">How to Pay Off Your Mortgage Early — 7 Proven Strategies</Link></li>
        </ul>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-5 mb-2">State Calculators</p>
        <ul className="space-y-2 text-sm text-slate-600">
          <li><Link href="/calculators/mortgage/north-carolina" className="text-navy-700 underline hover:text-navy-900">NC Mortgage Calculator</Link> — NC tax rate (0.77%) pre-loaded</li>
          <li><Link href="/calculators/mortgage/south-carolina" className="text-navy-700 underline hover:text-navy-900">SC Mortgage Calculator</Link> — SC tax rate (0.57%) pre-loaded</li>
          <li><Link href="/calculators/mortgage/georgia" className="text-navy-700 underline hover:text-navy-900">GA Mortgage Calculator</Link> — GA tax rate (0.92%) pre-loaded</li>
          <li><Link href="/calculators/mortgage/florida" className="text-navy-700 underline hover:text-navy-900">FL Mortgage Calculator</Link> — FL tax &amp; hurricane insurance pre-loaded</li>
          <li><Link href="/calculators/mortgage/texas" className="text-navy-700 underline hover:text-navy-900">TX Mortgage Calculator</Link> — TX tax rate (1.60%) pre-loaded</li>
          <li><Link href="/calculators/mortgage/virginia" className="text-navy-700 underline hover:text-navy-900">VA Mortgage Calculator</Link> — VA tax rate &amp; VA loan info</li>
        </ul>
      </section>

      <p className="mt-6 mb-2 text-xs text-slate-400 leading-relaxed">
        Results are estimates based on the information you enter. FinWiser uses standard amortization formulas. Actual payments may vary based on lender fees, credit score, local tax assessments, and insurance costs. This is not financial advice.
      </p>
    </div>
    </>
  )
}
