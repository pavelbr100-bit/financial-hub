import BiweeklyMortgageCalc from '@/components/calculators/BiweeklyMortgageCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Free Biweekly Mortgage Calculator — How Much Can You Save? | FinWiser' },
  description:
    'See exactly how much interest and time you save by switching to biweekly mortgage payments. Free calculator — no signup required.',
  alternates: { canonical: 'https://finwiser.net/calculators/biweekly-mortgage' },
  openGraph: {
    title: 'Free Biweekly Mortgage Calculator — How Much Can You Save?',
    description:
      'See exactly how much interest and time you save by switching to biweekly mortgage payments. Free calculator — no signup required.',
    type: 'website',
    url: 'https://finwiser.net/calculators/biweekly-mortgage',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Biweekly Mortgage Calculator — FinWiser',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Biweekly Mortgage Calculator | FinWiser',
    description:
      'See exactly how much interest and time you save by switching to biweekly mortgage payments.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Biweekly Mortgage Calculator',
  url: 'https://finwiser.net/calculators/biweekly-mortgage',
  description:
    'Calculate how much interest and time you save by making biweekly mortgage payments instead of monthly payments.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Monthly vs. biweekly payment comparison',
    'Total interest savings calculation',
    'Time saved calculation',
    'Full amortization schedules for both payment plans',
    'Side-by-side comparison table',
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
      name: 'Biweekly Mortgage Calculator',
      item: 'https://finwiser.net/calculators/biweekly-mortgage',
    },
  ],
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do biweekly mortgage payments save money?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Biweekly payments save money because you make 26 half-payments per year instead of 12 full payments — equivalent to 13 full monthly payments annually. That extra monthly payment each year goes entirely toward reducing your principal, which reduces the interest you pay every subsequent month. On a $300,000 30-year mortgage at 7%, switching to biweekly payments typically saves over $40,000 in interest and pays off the loan about 4–5 years early.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a biweekly mortgage payment save?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The savings depend on your loan amount, interest rate, and term. On a typical $300,000 30-year mortgage at 7%, biweekly payments save approximately $40,000–$45,000 in interest and shorten the loan by about 4–5 years. Larger loans, higher rates, or longer terms increase the savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a biweekly mortgage payment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A biweekly mortgage payment is half of your standard monthly payment, paid every two weeks. Because there are 52 weeks in a year, you make 26 half-payments — equivalent to 13 full monthly payments instead of the usual 12. The extra payment reduces your principal faster, cutting both the loan term and total interest paid.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is a biweekly mortgage payment the same as making extra payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Effectively yes. Biweekly payments are mathematically equivalent to making one extra monthly payment per year. Both approaches reduce the loan principal faster than a standard monthly schedule. The difference is in timing: biweekly payments apply the extra principal in small amounts throughout the year, while a lump-sum extra payment does it once. Biweekly payments are slightly more efficient because each small reduction cuts interest sooner.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does every lender accept biweekly mortgage payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Not automatically. Some lenders offer a formal biweekly plan, which may have a setup fee. Others allow you to achieve the same result by adding 1/12th of your monthly payment as extra principal each month. Always confirm with your lender how extra payments are applied — they should go toward principal, not held to reduce next month's payment.",
      },
    },
  ],
}

export default async function BiweeklyMortgagePage() {
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
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <Link href="/" className="hover:text-navy-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Biweekly Mortgage Calculator</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
                Biweekly Mortgage Payment Calculator
              </h1>
              <p className="text-slate-500 max-w-2xl">
                See exactly how much interest and time you save by switching from monthly to biweekly
                mortgage payments.
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
          {[
            'Instant results as you type',
            'Side-by-side comparison',
            'Full amortization schedules',
          ].map((f) => (
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
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </span>
          ))}
        </div>

        <div className="mb-6">
          <AdBanner slot="3344556677" format="horizontal" />
        </div>

        <BiweeklyMortgageCalc user={user ? { email: user.email } : null} />

        <div className="mt-8">
          <AdBanner slot="7766554433" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">How Biweekly Payments Work</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">The core idea is simple:</strong> instead of making
              12 monthly payments per year, you make 26 half-payments every two weeks. Since 26 ×
              (monthly payment ÷ 2) = 13 monthly payments, you are effectively making one extra full
              payment per year — without it feeling that way.
            </p>
            <p>
              <strong className="text-slate-800">Why it saves so much:</strong> that extra annual
              payment goes directly toward principal. A smaller principal balance means less interest
              accrues every single month afterward. Over a 30-year mortgage, that compounding effect
              can eliminate 4–5 years of payments and tens of thousands in interest.
            </p>
            <p>
              <strong className="text-slate-800">How to set it up:</strong> some lenders offer a
              formal biweekly payment plan, though some charge a setup fee. The simpler approach:
              divide your monthly P&amp;I payment by 12 and add that amount to each monthly payment
              as extra principal. The math is identical and most lenders accept it at no cost.
            </p>
            <div className="bg-navy-50 border border-navy-100 rounded-lg p-4">
              <p className="text-navy-800 text-sm">
                <strong>Important:</strong> always confirm with your lender that extra payments are
                applied directly to principal — not held and credited toward next month&apos;s
                payment. If the lender holds biweekly payments until they equal a full monthly
                payment, you lose most of the interest-saving benefit.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
