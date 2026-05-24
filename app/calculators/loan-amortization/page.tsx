import LoanAmortizationCalc from '@/components/calculators/LoanAmortizationCalc'
import AdBanner from '@/components/AdBanner'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Loan Amortization Calculator',
  description:
    'Free loan amortization calculator. Enter any loan amount, interest rate, and term to see your monthly payment, full payment schedule, and total interest. Add extra payments to see how much you can save.',
}

export default async function LoanAmortizationPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; rate?: string; term?: string; unit?: string; start?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const params = await searchParams
  const initialValues = params.amount
    ? {
        loanAmount: params.amount,
        interestRate: params.rate ?? '6.5',
        loanTerm: params.term ?? '30',
        termUnit: (params.unit as 'years' | 'months') ?? 'years',
        startDate: params.start ?? '',
      }
    : undefined

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Loan Amortization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Loan Amortization Calculator
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Enter your loan details to calculate your monthly payment and see a complete amortization schedule showing exactly how each payment is split between principal and interest.
        </p>
      </div>

      {/* Top AdSense slot */}
      <div className="mb-6">
        <AdBanner slot="1122334455" format="horizontal" />
      </div>

      {/* Calculator */}
      <LoanAmortizationCalc
        user={user ? { email: user.email } : null}
        initialValues={initialValues}
      />

      {/* Bottom AdSense slot */}
      <div className="mt-8">
        <AdBanner slot="5544332211" format="horizontal" />
      </div>

      {/* Explainer */}
      <section className="mt-12 bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">How Loan Amortization Works</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
          <p>
            <strong className="text-slate-800">Amortization</strong> is the process of paying off a loan through regular scheduled payments over time. Each payment covers both the accrued interest and a portion of the principal balance.
          </p>
          <p>
            Early in the loan, most of each payment goes toward interest because the balance is high. As you pay down the principal, the interest portion shrinks and more of each payment reduces the balance. This is why paying a little extra each month — especially early on — can save a significant amount in total interest.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="font-medium text-slate-700 mb-2">Monthly Payment Formula</p>
            <code className="text-xs text-navy-700 font-mono">
              M = P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
            </code>
            <p className="text-xs text-slate-500 mt-2">
              Where P = principal, r = monthly interest rate, n = number of payments
            </p>
          </div>
          <p>
            <strong className="text-slate-800">Tip:</strong> The total interest you pay is heavily influenced by the loan term. A 15-year mortgage typically costs significantly less in total interest than a 30-year mortgage on the same amount, even if the monthly payment is higher.
          </p>
        </div>
      </section>
    </div>
  )
}
