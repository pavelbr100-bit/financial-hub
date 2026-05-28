import CarLoanCalc from '@/components/calculators/CarLoanCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { articles } from '@/lib/articles'

export const metadata: Metadata = {
  title: { absolute: 'Free Car Loan Calculator — Monthly Payment, Total Interest & Affordability | FinWiser' },
  description:
    'Free car loan calculator — enter your vehicle price, down payment, and interest rate to see your monthly payment, total interest, and full amortization schedule.',
  alternates: { canonical: 'https://finwiser.net/calculators/car-loan' },
  openGraph: {
    title: 'Free Car Loan Calculator — Monthly Payment & Total Interest',
    description: 'Calculate your car loan payment, total interest, and true vehicle cost including sales tax and trade-in. Check if it fits your budget.',
    type: 'website',
    url: 'https://finwiser.net/calculators/car-loan',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Car Loan Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Car Loan Calculator | FinWiser',
    description: 'Calculate your car loan payment, total interest, and true vehicle cost including sales tax and trade-in.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Car Loan Calculator',
  url: 'https://finwiser.net/calculators/car-loan',
  description: 'Calculate monthly car loan payments with trade-in, sales tax, and down payment. Includes full amortization schedule and affordability checker.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Monthly payment calculation',
    'Sales tax included',
    'Trade-in value support',
    'Full amortization schedule',
    'Affordability checker',
    'New vs used car rate hints',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Car Loan Calculator', item: 'https://finwiser.net/calculators/car-loan' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is car loan interest calculated?',
      acceptedAnswer: { '@type': 'Answer', text: 'Car loans use simple interest on the declining balance. Each month your interest charge equals the remaining balance multiplied by the monthly rate (annual rate ÷ 12). As you pay down the principal, the interest portion of each payment shrinks and the principal portion grows. This makes early extra payments particularly effective at reducing total cost.' },
    },
    {
      '@type': 'Question',
      name: 'What is a good car loan interest rate?',
      acceptedAnswer: { '@type': 'Answer', text: 'Good car loan rates depend on your credit score and whether the car is new or used. Borrowers with excellent credit (720+) typically qualify for new car rates of 5–8% and used car rates of 7–11%. Those with fair credit (580–669) often see rates of 11–17%. Credit unions and banks frequently offer lower rates than dealership financing, so it pays to get pre-approved before visiting a dealer.' },
    },
    {
      '@type': 'Question',
      name: 'How much should I put down on a car?',
      acceptedAnswer: { '@type': 'Answer', text: 'A common guideline is 20% for a new car and 10% for a used car. A larger down payment reduces your loan amount, monthly payment, and total interest paid. It also protects you from going \'underwater\' — owing more than the car is worth — as vehicles typically depreciate 15–25% in the first year alone.' },
    },
    {
      '@type': 'Question',
      name: 'Is a 72 or 84-month car loan a bad idea?',
      acceptedAnswer: { '@type': 'Answer', text: 'Longer terms lower your monthly payment but significantly increase total interest paid and the risk of being underwater on your loan. A $30,000 loan at 8% costs roughly $1,800 more in total interest over 72 months than 60 months — and about $3,700 more over 84 months. Most financial advisors recommend keeping car loan terms at 60 months or less.' },
    },
    {
      '@type': 'Question',
      name: 'What credit score do I need for a good car loan rate?',
      acceptedAnswer: { '@type': 'Answer', text: 'To qualify for the best car loan rates, a credit score of 720 or higher is generally needed. Scores in the 660–719 range get reasonable rates. Below 620 typically means subprime rates of 13% or more. Before visiting a dealership, check your credit, get pre-approved through your bank or credit union, and compare offers — dealerships earn a markup on financing, so their rate is rarely your best option.' },
    },
  ],
}

export default async function CarLoanPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link href="/" className="hover:text-navy-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Car Loan Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Car Loan Calculator
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Enter your vehicle price, down payment, trade-in, and loan details to see your exact monthly payment, total interest, and true cost of the car — including sales tax.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Sales tax included',
            'Trade-in credit',
            'Affordability check',
            'Full amortization schedule',
          ].map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-700 text-xs font-medium">
              <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        {/* Top AdSense slot */}
        <div className="mb-6">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        {/* Calculator */}
        <CarLoanCalc user={user ? { email: user.email } : null} />

        {/* Bottom AdSense slot */}
        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        {/* Explainer */}
        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">How Car Loan Payments Are Calculated</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Your monthly car payment is based on the amount financed — which is the vehicle price plus sales tax, minus your down payment and trade-in value. The calculator uses the standard amortization formula to divide that amount into equal monthly payments over your chosen term.
            </p>
            <p>
              <strong className="text-slate-800">Sales tax matters.</strong> Most states apply sales tax to the full vehicle price before your down payment or trade-in are subtracted. On a $35,000 car in a state with 8% sales tax, that adds $2,800 to the amount you finance — which means more interest over the life of the loan.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-medium text-slate-700 mb-2">Monthly Payment Formula</p>
              <code className="text-xs text-navy-700 font-mono">
                M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
              </code>
              <p className="text-xs text-slate-500 mt-2">
                Where P = amount financed, r = monthly interest rate, n = number of payments
              </p>
            </div>
            <p>
              <strong className="text-slate-800">New vs. used rates.</strong> New car loans typically carry lower interest rates (around 6–8%) than used car loans (9–13%) because new cars carry less uncertainty about condition and value. If you&apos;re comparing a new vs. used car, factor in the rate difference — sometimes a newer car with better financing costs less per month despite the higher sticker price.
            </p>
            <p>
              <strong className="text-slate-800">Affordability rule of thumb.</strong> Financial advisors generally recommend keeping your total car payment below 15% of your gross monthly income. If you&apos;re above 20%, the car is likely putting meaningful strain on your budget — especially once you factor in insurance, maintenance, and fuel.
            </p>
          </div>
        </section>

        {/* Learn More */}
        {(() => {
          const carLoanSlugs = [
            'how-car-loan-interest-works',
            'new-vs-used-car-loan',
            'how-to-get-best-car-loan-rate',
            'car-loan-term-length-guide',
            'how-to-pay-off-car-loan-early',
            'car-loan-down-payment-guide',
          ]
          const carArticles = articles.filter(a => carLoanSlugs.includes(a.slug))
          return (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-navy-900 mb-2">Learn More About Car Loans</h2>
              <p className="text-slate-500 text-sm mb-6">Guides to help you understand your loan, get the best rate, and pay it off faster.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {carArticles.map(article => (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="group bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-5 flex flex-col"
                  >
                    <span className="self-start px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
                      {article.category}
                    </span>
                    <h3 className="text-sm font-bold text-navy-900 leading-snug mb-2 group-hover:text-navy-600 transition-colors flex-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-400">{article.readMinutes} min read</span>
                      <span className="text-xs font-medium text-navy-500 group-hover:text-emerald-600 transition-colors">
                        Read article →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}
      </div>
    </>
  )
}
