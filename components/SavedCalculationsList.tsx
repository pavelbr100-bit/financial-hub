'use client'

import { useState } from 'react'
import Link from 'next/link'
import { deleteCalculation, type SavedCalculation } from '@/lib/supabase/calculations'

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function SavedCalculationsList({
  calculations: initial,
}: {
  calculations: SavedCalculation[]
}) {
  const [calculations, setCalculations] = useState(initial)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteCalculation(id)
      setCalculations((prev) => prev.filter((c) => c.id !== id))
    } catch {
      // keep the item in the list if delete fails
    } finally {
      setDeleting(null)
    }
  }

  if (calculations.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium text-slate-600 mb-2">No saved calculations yet</p>
        <p className="text-sm mb-6">Calculate a loan and save it — it will appear here.</p>
        <Link
          href="/calculators/loan-amortization"
          className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
        >
          Go to Loan Calculator →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {calculations.map((calc) => {
        const { inputs, summary } = calc
        const loadUrl = `/calculators/loan-amortization?amount=${inputs.loanAmount}&rate=${inputs.interestRate}&term=${inputs.loanTerm}&unit=${inputs.termUnit}&start=${inputs.startDate}`

        return (
          <div key={calc.id} className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-navy-900">{calc.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Saved {formatDate(calc.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={loadUrl}
                  className="px-3 py-1.5 text-xs font-medium bg-navy-700 hover:bg-navy-600 text-white rounded-md transition-colors"
                >
                  Load
                </Link>
                <button
                  onClick={() => handleDelete(calc.id)}
                  disabled={deleting === calc.id}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-300 hover:border-red-300 text-slate-500 hover:text-red-500 rounded-md transition-colors disabled:opacity-50"
                >
                  {deleting === calc.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Monthly Payment</p>
                <p className="font-semibold text-emerald-700 tabular-nums">
                  {formatCurrency(summary.monthlyPayment)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Total Interest</p>
                <p className="font-semibold text-amber-700 tabular-nums">
                  {formatCurrency(summary.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Loan Amount</p>
                <p className="font-semibold text-navy-700 tabular-nums">
                  {formatCurrency(parseFloat(inputs.loanAmount.replace(/,/g, '')))}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
