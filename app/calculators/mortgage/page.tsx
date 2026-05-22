import MortgageCalc from '@/components/calculators/MortgageCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Mortgage Calculator',
  description:
    'Calculate your monthly mortgage payment including principal, interest, property tax, insurance, and PMI. Compare loan terms side by side.',
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Mortgage Calculator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Mortgage Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Estimate your full monthly mortgage payment including principal, interest, property tax, home insurance, and PMI. Adjust the inputs to compare different scenarios.
        </p>
      </div>

      <div className="mb-6">
        <AdBanner slot="2233445566" format="horizontal" />
      </div>

      <MortgageCalc user={user ? { email: user.email } : null} initialValues={initialValues} />

      <div className="mt-8">
        <AdBanner slot="6655443322" format="horizontal" />
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
    </div>
  )
}
