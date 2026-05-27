'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'
import { buildSchedule } from '@/lib/calculators/mortgage'

interface AmortizationRow {
  payment: number
  date: string
  paymentAmount: number
  principal: number
  interest: number
  balance: number
}

interface BiweeklyResults {
  loanAmount: number
  monthlyPI: number
  biweeklyPayment: number
  monthlyTotalInterest: number
  biweeklyTotalInterest: number
  interestSaved: number
  monthsSaved: number
  monthlyPayoffDate: string
  biweeklyPayoffDate: string
  monthlySchedule: AmortizationRow[]
  biweeklySchedule: AmortizationRow[]
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatCommas(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  return digits === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(digits, 10))
}

function parseAmount(val: string): number {
  return parseFloat(val.replace(/,/g, '')) || 0
}

function addDates(
  schedule: { payment: number; paymentAmount: number; principal: number; interest: number; balance: number }[]
): AmortizationRow[] {
  const start = new Date()
  return schedule.map((row) => {
    const d = new Date(start)
    d.setMonth(start.getMonth() + row.payment)
    return { ...row, date: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }
  })
}

function payoffDate(monthsFromNow: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsFromNow)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function BiweeklyMortgageCalc({ user }: Props) {
  const [homePrice, setHomePrice] = useState('400,000')
  const [downPayment, setDownPayment] = useState('20')
  const [downType, setDownType] = useState<'%' | '$'>('%')
  const [interestRate, setInterestRate] = useState('6.5')
  const [loanTerm, setLoanTerm] = useState(30)
  const [activeTab, setActiveTab] = useState<'monthly' | 'biweekly'>('biweekly')
  const [showFullTable, setShowFullTable] = useState(false)
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const homePriceNum = parseAmount(homePrice)
  const downPaymentNum =
    downType === '%'
      ? homePriceNum * (parseFloat(downPayment || '0') / 100)
      : parseAmount(downPayment)
  const downPct = homePriceNum > 0 ? (downPaymentNum / homePriceNum) * 100 : 0

  const results = useMemo((): BiweeklyResults | null => {
    const hp = parseAmount(homePrice)
    const dp =
      downType === '%' ? hp * (parseFloat(downPayment || '0') / 100) : parseAmount(downPayment)
    const rate = parseFloat(interestRate)

    if (!hp || hp <= 0) return null
    if (dp < 0 || dp >= hp) return null
    if (!interestRate || isNaN(rate) || rate <= 0 || rate > 100) return null

    const loanAmount = hp - dp
    const termMonths = loanTerm * 12

    const monthly = buildSchedule(loanAmount, rate, termMonths)
    const { monthlyPI } = monthly
    const biweekly = buildSchedule(loanAmount, rate, termMonths, monthlyPI / 12)

    const monthlyTotalInterest = monthly.schedule.reduce((s, r) => s + r.interest, 0)
    const biweeklyTotalInterest = biweekly.schedule.reduce((s, r) => s + r.interest, 0)

    return {
      loanAmount,
      monthlyPI,
      biweeklyPayment: monthlyPI / 2,
      monthlyTotalInterest,
      biweeklyTotalInterest,
      interestSaved: monthlyTotalInterest - biweeklyTotalInterest,
      monthsSaved: monthly.schedule.length - biweekly.schedule.length,
      monthlyPayoffDate: payoffDate(monthly.schedule.length),
      biweeklyPayoffDate: payoffDate(biweekly.schedule.length),
      monthlySchedule: addDates(monthly.schedule),
      biweeklySchedule: addDates(biweekly.schedule),
    }
  }, [homePrice, downPayment, downType, interestRate, loanTerm])

  async function handleSave() {
    if (!calcName.trim() || !results) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'biweekly-mortgage',
        inputs: {
          homePrice,
          down: downPayment,
          downType,
          rate: interestRate,
          term: String(loanTerm),
        },
        summary: {
          monthlyPayment: results.biweeklyPayment,
          totalPayment: results.loanAmount + results.biweeklyTotalInterest,
          totalInterest: results.biweeklyTotalInterest,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const activeSchedule = results
    ? activeTab === 'monthly'
      ? results.monthlySchedule
      : results.biweeklySchedule
    : []
  const displayedRows = showFullTable ? activeSchedule : activeSchedule.slice(0, 12)

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Loan Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Home price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Home Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={homePrice}
                onChange={(e) => setHomePrice(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="400,000"
              />
            </div>
          </div>

          {/* Down payment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Down Payment</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {downType === '$' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                )}
                <input
                  type="text"
                  inputMode="numeric"
                  value={downPayment}
                  onChange={(e) => {
                    if (downType === '$') setDownPayment(formatCommas(e.target.value))
                    else setDownPayment(e.target.value.replace(/[^0-9.]/g, ''))
                  }}
                  className={`w-full ${downType === '$' ? 'pl-7 pr-4' : 'pl-4 pr-9'} py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors`}
                  placeholder={downType === '%' ? '20' : '80,000'}
                />
                {downType === '%' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                )}
              </div>
              <select
                value={downType}
                onChange={(e) => {
                  const t = e.target.value as '%' | '$'
                  setDownType(t)
                  setDownPayment(t === '%' ? '20' : '80,000')
                }}
                className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 cursor-pointer"
              >
                <option value="%">%</option>
                <option value="$">$</option>
              </select>
            </div>
            {homePriceNum > 0 && downPaymentNum > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {downType === '%' ? formatCurrency(downPaymentNum) : `${downPct.toFixed(1)}%`}
              </p>
            )}
          </div>

          {/* Interest rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Annual Interest Rate</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>

          {/* Loan term */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Loan Term</label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 15, 20, 30].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setLoanTerm(yr)}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    loanTerm === yr
                      ? 'bg-navy-700 border-navy-700 text-white'
                      : 'border-slate-300 text-slate-700 hover:border-navy-400 hover:text-navy-700'
                  }`}
                >
                  {yr}yr
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {results ? (
        <>
          {/* Hero: monthly vs biweekly */}
          <div className="bg-navy-900 rounded-xl p-6 text-white">
            <div className="grid grid-cols-2 divide-x divide-navy-700">
              <div className="text-center pr-6">
                <p className="text-navy-300 text-xs font-medium mb-1 uppercase tracking-wide">Monthly Payment</p>
                <p className="text-3xl font-extrabold tabular-nums">{formatCurrency(results.monthlyPI)}</p>
                <p className="text-navy-400 text-xs mt-1.5">12 payments/year</p>
              </div>
              <div className="text-center pl-6">
                <p className="text-emerald-400 text-xs font-medium mb-1 uppercase tracking-wide">Biweekly Payment</p>
                <p className="text-3xl font-extrabold tabular-nums text-emerald-400">
                  {formatCurrency(results.biweeklyPayment)}
                </p>
                <p className="text-navy-400 text-xs mt-1.5">26 payments/year</p>
              </div>
            </div>
          </div>

          {/* Savings banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="font-semibold text-emerald-800">Biweekly savings vs. monthly</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-600 mb-0.5">Interest Saved</p>
                <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(results.interestSaved)}
                </p>
              </div>
              <div>
                <p className="text-xs text-emerald-600 mb-0.5">Time Saved</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {Math.floor(results.monthsSaved / 12) > 0 && `${Math.floor(results.monthsSaved / 12)}y `}
                  {results.monthsSaved % 12 > 0 && `${results.monthsSaved % 12}m`}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-navy-900">Monthly vs. Biweekly Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/2"></th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Monthly
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">
                      Biweekly
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      label: 'Payment Amount',
                      monthly: formatCurrency(results.monthlyPI),
                      biweekly: formatCurrency(results.biweeklyPayment),
                    },
                    { label: 'Payments per Year', monthly: '12', biweekly: '26' },
                    {
                      label: 'Total Interest',
                      monthly: formatCurrency(results.monthlyTotalInterest),
                      biweekly: formatCurrency(results.biweeklyTotalInterest),
                    },
                    {
                      label: 'Total Cost',
                      monthly: formatCurrency(results.loanAmount + results.monthlyTotalInterest),
                      biweekly: formatCurrency(results.loanAmount + results.biweeklyTotalInterest),
                    },
                    {
                      label: 'Payoff Date',
                      monthly: results.monthlyPayoffDate,
                      biweekly: results.biweeklyPayoffDate,
                    },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-600">{row.label}</td>
                      <td className="px-5 py-3 text-right font-medium text-slate-800 tabular-nums">
                        {row.monthly}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-700 tabular-nums bg-emerald-50/50">
                        {row.biweekly}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50">
                    <td className="px-5 py-3 text-emerald-800 font-semibold">You Save</td>
                    <td className="px-5 py-3"></td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(results.interestSaved)}
                      </span>
                      <span className="text-emerald-600 text-xs ml-1.5">
                        (
                        {Math.floor(results.monthsSaved / 12) > 0
                          ? `${Math.floor(results.monthsSaved / 12)}y `
                          : ''}
                        {results.monthsSaved % 12 > 0 ? `${results.monthsSaved % 12}m` : ''} faster)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Loan Amount" value={formatCurrency(results.loanAmount)} accent="navy" />
            <SummaryCard
              label="Interest (Monthly)"
              value={formatCurrency(results.monthlyTotalInterest)}
              accent="amber"
            />
            <SummaryCard
              label="Interest (Biweekly)"
              value={formatCurrency(results.biweeklyTotalInterest)}
              accent="emerald"
            />
          </div>

          {/* Amortization table with tab toggle */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-navy-900">Amortization Schedule</h3>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTab('monthly')
                    setShowFullTable(false)
                  }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === 'monthly'
                      ? 'bg-navy-700 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => {
                    setActiveTab('biweekly')
                    setShowFullTable(false)
                  }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === 'biweekly'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Biweekly
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['#', 'Date', 'Payment', 'Principal', 'Interest', 'Balance'].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                          i <= 1 ? 'text-left' : 'text-right'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRows.map((row) => (
                    <tr key={row.payment} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.payment}</td>
                      <td className="px-4 py-3 text-slate-700">{row.date}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">
                        {formatCurrency(row.paymentAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs">
                        {formatCurrency(row.principal)}
                      </td>
                      <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeSchedule.length > 12 && (
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  {showFullTable
                    ? 'Show fewer rows'
                    : `Show all ${activeSchedule.length} payments`}
                </button>
              </div>
            )}
          </div>

          {/* Save */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
            {user ? (
              saveState === 'saved' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-sm">Calculation saved!</span>
                  </div>
                  <Link
                    href="/saved"
                    className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
                  >
                    View saved →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Save this calculation</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Our next home 2026"
                      value={calcName}
                      onChange={(e) => setCalcName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                    />
                    <button
                      onClick={handleSave}
                      disabled={saveState === 'saving' || !calcName.trim()}
                      className="px-5 py-2.5 bg-navy-700 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      {saveState === 'saving' ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                  {saveState === 'error' && (
                    <p className="text-xs text-red-500">Failed to save. Please try again.</p>
                  )}
                </div>
              )
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Sign in to save and revisit this calculation.</p>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
                >
                  Sign in →
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-8 text-center">
          <p className="text-slate-400 text-sm">
            Fill in your loan details above to instantly see how much you could save with biweekly
            payments.
          </p>
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'emerald' | 'navy' | 'amber'
}) {
  const borderMap = { emerald: 'border-emerald-500', navy: 'border-navy-500', amber: 'border-amber-400' }
  const textMap = { emerald: 'text-emerald-700', navy: 'text-navy-700', amber: 'text-amber-700' }
  return (
    <div
      className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
    </div>
  )
}
