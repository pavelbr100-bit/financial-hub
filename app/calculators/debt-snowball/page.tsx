import DebtPayoffCalc from '@/components/calculators/DebtPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { DebtPayoffStrategy } from '@/lib/calculators/debtPayoff'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'Debt Snowball Calculator — Free, No Signup | FinWiser' },
  description:
    'Free debt snowball calculator. Enter your debts and see your debt-free date, total interest, and how extra payments speed it up. Avalanche mode included.',
  alternates: { canonical: 'https://finwiser.net/calculators/debt-snowball' },
  openGraph: {
    title: 'Free Debt Snowball Calculator — See Your Debt-Free Date',
    description: 'Pay off debt smallest balance first with the snowball method. Switch to avalanche to compare total interest. Free, instant, no account required.',
    type: 'website',
    url: 'https://finwiser.net/calculators/debt-snowball',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Debt Snowball Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Debt Snowball Calculator | FinWiser',
    description: 'Pay off debt smallest balance first with the snowball method. Switch to avalanche to compare total interest.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Debt Snowball Calculator',
  url: 'https://finwiser.net/calculators/debt-snowball',
  description: 'Pay off debt with the snowball method — smallest balance first. See your payoff date, total interest, and how extra payments accelerate your debt-free date. Avalanche mode included.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Snowball payoff order (smallest balance first)',
    'Avalanche comparison mode',
    'Up to 6 debts',
    'Extra payment savings calculator',
    'Payoff date per debt',
    'Total interest comparison',
  ],
}


const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://finwiser.net' },
    { '@type': 'ListItem', position: 2, name: 'Debt Snowball Calculator', item: 'https://finwiser.net/calculators/debt-snowball' },
  ],
}


const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the debt avalanche method?',
      acceptedAnswer: { '@type': 'Answer', text: 'The debt avalanche method means making minimum payments on all debts and putting every extra dollar toward the debt with the highest interest rate. Once that debt is eliminated, you roll its payment to the next highest-rate debt. This method mathematically minimizes the total interest paid across all your debts, making it the most efficient path to becoming debt-free.' },
    },
    {
      '@type': 'Question',
      name: 'What is the debt snowball method?',
      acceptedAnswer: { '@type': 'Answer', text: 'The debt snowball method means paying off debts from smallest balance to largest, regardless of interest rate. You make minimum payments on everything except the smallest debt, which you attack aggressively. When it\'s gone, roll that payment to the next smallest. The snowball delivers quick motivational wins that many people find crucial for staying on track over months or years.' },
    },
    {
      '@type': 'Question',
      name: 'Which method pays off debt faster — avalanche or snowball?',
      acceptedAnswer: { '@type': 'Answer', text: 'Mathematically, the avalanche method pays off debt faster and saves more in total interest because it targets high-rate debt first. However, research shows the snowball method often leads to better real-world results because eliminating individual debts provides psychological motivation that keeps people committed. If you\'ll stick to either method, choose avalanche. If you need motivation to keep going, snowball often wins in practice.' },
    },
    {
      '@type': 'Question',
      name: 'How much does an extra monthly payment save on debt?',
      acceptedAnswer: { '@type': 'Answer', text: 'Even a small extra payment can dramatically reduce your total interest and payoff time, especially on high-rate debt. On a $10,000 credit card balance at 22% APR paying only minimums, adding just $100/month can cut years off your payoff timeline and save thousands in interest. The higher the interest rate, the greater the benefit of extra payments.' },
    },
    {
      '@type': 'Question',
      name: 'Should I use my savings to pay off debt?',
      acceptedAnswer: { '@type': 'Answer', text: 'If your debt\'s interest rate is higher than what your savings earn, paying off the debt is the better financial move. High-interest debt like credit cards (18–25% APR) almost always warrants aggressive payoff. For low-rate debt (under 5%), the math may favor investing instead. Most financial planners recommend keeping a 3–6 month emergency fund before making extra debt payments.' },
    },
  ],
}

export default async function DebtPayoffPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams

  // Load saved plan if ?saved=<id>
  type DebtInput = { id: string; name: string; balance: string; rate: string; minPayment: string }
  let initialDebts: DebtInput[] | undefined
  // Defaults to snowball so the pre-selected strategy matches the page's H1.
  // A saved plan overrides this below with whichever strategy it was saved with.
  let initialStrategy: DebtPayoffStrategy = 'snowball'
  let initialExtra: string | undefined

  if (params.saved) {
    const { data } = await supabase
      .from('saved_calculations')
      .select('inputs')
      .eq('id', params.saved)
      .single()
    if (data?.inputs?.debts) {
      try {
        initialDebts = JSON.parse(data.inputs.debts) as DebtInput[]
        initialStrategy = (data.inputs.strategy as DebtPayoffStrategy) ?? 'avalanche'
        initialExtra = data.inputs.extraMonthly ?? ''
      } catch {
        // malformed — fall through to defaults
      }
    }
  }

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
            <span className="text-slate-700 font-medium">Debt Snowball Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Debt Snowball Calculator
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Enter your debts and the snowball method targets the smallest balance first, rolling each cleared payment into the next debt. See exactly when each one is paid off, how much interest you owe, and how extra payments accelerate your debt-free date — or switch to avalanche to compare.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Snowball & avalanche strategies',
            'Up to 6 debts',
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

        <DebtPayoffCalc
          user={user ? { email: user.email } : null}
          initialDebts={initialDebts}
          initialStrategy={initialStrategy}
          initialExtra={initialExtra}
        />

        <div className="mt-8">
          <AdBanner slot="2503689657" format="horizontal" />
        </div>

        <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-navy-900 mb-4">Avalanche vs. Snowball: Which Strategy Wins?</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              <strong className="text-slate-800">Avalanche (highest rate first)</strong> is mathematically optimal. By eliminating the most expensive debt first, you pay less total interest over time. If you have a credit card at 22% and a car loan at 6%, avalanche targets the credit card first — every extra dollar you pay saves you 22 cents per year in interest instead of 6.
            </p>
            <p>
              <strong className="text-slate-800">Snowball (lowest balance first)</strong> prioritizes psychology over math. Paying off small debts quickly gives you visible wins that keep motivation high. Research shows many people actually stick to the snowball method longer — and a method you follow beats an optimal method you abandon.
            </p>
            <p>
              <strong className="text-slate-800">Extra monthly payments</strong> are the highest-leverage move in either strategy. Even $50–$100 extra per month can shave years off your payoff timeline and save thousands in interest. Once one debt is paid off, roll its entire minimum payment into the next target — this is the &quot;debt roll&quot; that makes both strategies work.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-medium text-slate-700 mb-1">Quick tip</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                If the difference in total interest between avalanche and snowball is small (under $500), pick snowball for the motivation boost. If the gap is large — common when you have a high-rate credit card alongside low-rate loans — avalanche is worth the discipline.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-slate-50 rounded-xl border border-slate-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Related Calculators</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/calculators/debt-avalanche" className="text-navy-700 underline hover:text-navy-900">Debt Avalanche Calculator</Link> — the same debts ordered by interest rate instead of balance</li>
            <li><Link href="/calculators/credit-card-payoff" className="text-navy-700 underline hover:text-navy-900">Credit Card Payoff Calculator</Link> — work a single card, including what minimum payments really cost</li>
            <li><Link href="/calculators/loan-amortization" className="text-navy-700 underline hover:text-navy-900">Loan Amortization Calculator</Link> — break a single debt down into a full payment schedule</li>
            <li><Link href="/calculators/car-loan" className="text-navy-700 underline hover:text-navy-900">Car Loan Calculator</Link> — model an auto loan before adding it to your payoff plan</li>
            <li><Link href="/calculators/compound-interest" className="text-navy-700 underline hover:text-navy-900">Compound Interest Calculator</Link> — see what the same monthly payment earns once the debt is gone</li>
          </ul>
        </section>
      </div>
    </>
  )
}
