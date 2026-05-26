import DebtPayoffCalc from '@/components/calculators/DebtPayoffCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { DebtPayoffStrategy } from '@/lib/calculators/debtPayoff'

export const metadata: Metadata = {
  title: { absolute: 'Free Debt Payoff Calculator — Avalanche & Snowball Planner | FinWiser' },
  description:
    'Free debt payoff calculator. Compare the avalanche and snowball strategies side by side. Enter your debts, add an extra monthly payment, and see exactly when each debt is paid off and how much interest you save.',
  openGraph: {
    title: 'Free Debt Payoff Calculator — Avalanche & Snowball Planner',
    description: 'Compare debt avalanche vs snowball strategies. See your payoff date and total interest for each approach.',
    type: 'website',
    url: 'https://finwiser.net/calculators/debt-payoff',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Free Debt Payoff Calculator — FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Debt Payoff Calculator | FinWiser',
    description: 'Compare debt avalanche vs snowball strategies. See your payoff date and total interest for each approach.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Debt Payoff Planner',
  url: 'https://finwiser.net/calculators/debt-payoff',
  description: 'Compare avalanche vs snowball debt payoff strategies. See your payoff date, total interest, and how extra payments accelerate your debt-free date.',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Avalanche and snowball strategy comparison',
    'Up to 6 debts',
    'Extra payment savings calculator',
    'Payoff date per debt',
    'Total interest comparison',
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
  let initialStrategy: DebtPayoffStrategy | undefined
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
            <span>/</span>
            <span className="text-slate-700 font-medium">Debt Payoff Planner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
            Debt Payoff Planner
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Enter your debts and choose a strategy. See exactly when each debt is paid off, how much interest you owe, and how extra payments accelerate your debt-free date.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            'Avalanche & snowball strategies',
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
          <AdBanner slot="4455667788" format="horizontal" />
        </div>

        <DebtPayoffCalc
          user={user ? { email: user.email } : null}
          initialDebts={initialDebts}
          initialStrategy={initialStrategy}
          initialExtra={initialExtra}
        />

        <div className="mt-8">
          <AdBanner slot="8877665544" format="horizontal" />
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
      </div>
    </>
  )
}
