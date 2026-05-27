'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'
import AmortizationCharts from './AmortizationCharts'

interface AmortizationRow {
  payment: number
  date: string
  paymentAmount: number
  principal: number
  interest: number
  balance: number
}

interface Results {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: AmortizationRow[]
  balloonPayment: number
  interestSaved?: number
  monthsSaved?: number
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function calculateAmortization(
  principal: number,
  annualRate: number,
  amortMonths: number,
  startDate: Date,
  extraMonthly = 0,
  extraYearly = 0,
  loanTermMonths = amortMonths
): Results {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment =
    monthlyRate === 0
      ? principal / amortMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, amortMonths)) /
        (Math.pow(1 + monthlyRate, amortMonths) - 1)

  const schedule: AmortizationRow[] = []
  let balance = principal
  const runMonths = Math.min(loanTermMonths, amortMonths)

  for (let i = 1; i <= runMonths; i++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    const extra = extraMonthly + (i % 12 === 0 ? extraYearly : 0)
    const totalPrincipal = Math.min(principalPayment + extra, balance)
    balance = Math.max(0, balance - totalPrincipal)

    const paymentDate = new Date(startDate)
    paymentDate.setMonth(startDate.getMonth() + i)

    schedule.push({
      payment: i,
      date: paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      paymentAmount: interestPayment + totalPrincipal,
      principal: totalPrincipal,
      interest: interestPayment,
      balance,
    })

    if (balance === 0) break
  }

  const balloonPayment = balance
  const totalPayment = schedule.reduce((s, r) => s + r.paymentAmount, 0) + balloonPayment
  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
    balloonPayment,
  }
}

interface Props {
  user: { email?: string | null } | null
  initialValues?: {
    loanAmount: string
    interestRate: string
    loanTerm: string
    termUnit: 'years' | 'months'
    startDate: string
  }
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function LoanAmortizationCalc({ user, initialValues }: Props) {
  const defaultDate = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const [loanAmount, setLoanAmount] = useState(() => {
    const raw = (initialValues?.loanAmount ?? '250000').replace(/[^0-9]/g, '')
    return raw ? new Intl.NumberFormat('en-US').format(parseInt(raw, 10)) : ''
  })
  const [interestRate, setInterestRate] = useState(initialValues?.interestRate ?? '6.5')
  const [loanTerm, setLoanTerm] = useState(initialValues?.loanTerm ?? '30')
  const [termUnit, setTermUnit] = useState<'years' | 'months'>(initialValues?.termUnit ?? 'years')
  const [startDate, setStartDate] = useState(initialValues?.startDate || defaultDate())
  const [results, setResults] = useState<Results | null>(null)
  const [showFullTable, setShowFullTable] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isBalloon, setIsBalloon] = useState(false)
  const [amortTerm, setAmortTerm] = useState('30')
  const [amortUnit, setAmortUnit] = useState<'years' | 'months'>('years')
  const [extraMonthly, setExtraMonthly] = useState('')
  const [extraYearly, setExtraYearly] = useState('')
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const validate = useCallback(() => {
    const errs: Record<string, string> = {}
    const amount = parseFloat(loanAmount.replace(/,/g, ''))
    const rate = parseFloat(interestRate)
    const term = parseInt(loanTerm)

    if (!loanAmount || isNaN(amount) || amount <= 0) errs.loanAmount = 'Enter a valid loan amount'
    if (!interestRate || isNaN(rate) || rate < 0 || rate > 100) errs.interestRate = 'Enter a rate between 0 and 100'
    if (!loanTerm || isNaN(term) || term <= 0) errs.loanTerm = 'Enter a valid term'
    if (termUnit === 'years' && term > 50) errs.loanTerm = 'Maximum term is 50 years'
    if (termUnit === 'months' && term > 600) errs.loanTerm = 'Maximum term is 600 months'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [loanAmount, interestRate, loanTerm, termUnit])

  function handleCalculate() {
    if (!validate()) return

    const principal = parseFloat(loanAmount.replace(/,/g, ''))
    const rate = parseFloat(interestRate)
    const termMonths = termUnit === 'years' ? parseInt(loanTerm) * 12 : parseInt(loanTerm)
    const [year, month] = startDate.split('-').map(Number)
    const start = new Date(year, month - 1, 1)

    const extraM = parseFloat(extraMonthly.replace(/,/g, '')) || 0
    const extraY = parseFloat(extraYearly.replace(/,/g, '')) || 0
    const amortMonths = isBalloon
      ? (amortUnit === 'years' ? parseInt(amortTerm) * 12 : parseInt(amortTerm))
      : termMonths

    const base = calculateAmortization(principal, rate, amortMonths, start, 0, 0, termMonths)
    const withExtra = (extraM > 0 || extraY > 0)
      ? calculateAmortization(principal, rate, amortMonths, start, extraM, extraY, termMonths)
      : null

    setResults({
      ...(withExtra ?? base),
      interestSaved: withExtra ? base.totalInterest - withExtra.totalInterest : undefined,
      monthsSaved: withExtra ? base.schedule.length - withExtra.schedule.length : undefined,
    })
    setShowFullTable(false)
    setSaveState('idle')
    setCalcName('')
  }

  async function handleSave() {
    if (!calcName.trim() || !results) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'loan-amortization',
        inputs: { loanAmount, interestRate, loanTerm, termUnit, startDate },
        summary: {
          monthlyPayment: results.monthlyPayment,
          totalPayment: results.totalPayment,
          totalInterest: results.totalInterest,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const displayedRows = results
    ? showFullTable
      ? results.schedule
      : results.schedule.slice(0, 12)
    : []

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Loan Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Loan amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={loanAmount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '')
                  setLoanAmount(raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                }}
                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.loanAmount ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="250,000"
              />
            </div>
            {errors.loanAmount && <p className="mt-1 text-xs text-red-500">{errors.loanAmount}</p>}
          </div>

          {/* Interest rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full pl-4 pr-9 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.interestRate ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            {errors.interestRate && <p className="mt-1 text-xs text-red-500">{errors.interestRate}</p>}
          </div>

          {/* Loan term */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Loan Term
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className={`flex-1 px-4 py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.loanTerm ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="30"
              />
              <select
                value={termUnit}
                onChange={(e) => setTermUnit(e.target.value as 'years' | 'months')}
                className="px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors cursor-pointer"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
            {errors.loanTerm && <p className="mt-1 text-xs text-red-500">{errors.loanTerm}</p>}
          </div>

          {/* Balloon loan toggle */}
          <div className="col-span-full">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-700">Balloon Loan</p>
                <p className="text-xs text-slate-400 mt-0.5">Amortization period differs from loan term — remaining balance due at end</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBalloon(!isBalloon)}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors flex-shrink-0 ${isBalloon ? 'bg-navy-600' : 'bg-slate-300'}`}
                aria-label="Toggle balloon loan"
              >
                <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${isBalloon ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Amortization period — only shown for balloon loans */}
          {isBalloon && (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Amortization Period
                <span className="ml-2 text-xs font-normal text-slate-400">Used to calculate the monthly payment</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={amortTerm}
                  onChange={(e) => setAmortTerm(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-navy-300 bg-navy-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                  placeholder="30"
                />
                <select
                  value={amortUnit}
                  onChange={(e) => setAmortUnit(e.target.value as 'years' | 'months')}
                  className="px-3 py-2.5 rounded-lg border border-navy-300 bg-navy-50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 cursor-pointer"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          )}

          {/* Start date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              First Payment Month
            </label>
            <input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Extra payments */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Extra Payments <span className="text-xs font-normal text-slate-400">— optional, reduces interest & payoff time</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Extra Monthly</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={extraMonthly}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    setExtraMonthly(raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                  }}
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Extra Yearly (lump sum)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={extraYearly}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '')
                    setExtraYearly(raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                  }}
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full py-3 bg-navy-700 hover:bg-navy-600 active:bg-navy-800 text-white font-semibold rounded-lg transition-colors text-sm tracking-wide shadow-sm"
        >
          Calculate
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Monthly Payment"
              value={formatCurrency(results.monthlyPayment)}
              accent="emerald"
            />
            <ResultCard
              label="Total Amount Paid"
              value={formatCurrency(results.totalPayment)}
              accent="navy"
            />
            <ResultCard
              label="Total Interest Paid"
              value={formatCurrency(results.totalInterest)}
              accent="amber"
            />
          </div>

          {/* Balloon payment banner */}
          {results.balloonPayment > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800 mb-1">Balloon Payment Due</p>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    At the end of the loan term a lump sum of{' '}
                    <span className="font-bold text-amber-900">{formatCurrency(results.balloonPayment)}</span>{' '}
                    is due. This is the remaining principal balance that was not paid down during the loan term.
                    You will need to pay this in full, refinance, or sell the asset.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Savings banner */}
          {results.interestSaved !== undefined && results.monthsSaved !== undefined && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-semibold text-emerald-800">Extra payment savings</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-emerald-600 mb-0.5">Interest Saved</p>
                  <p className="text-2xl font-bold text-emerald-700 tabular-nums">{formatCurrency(results.interestSaved)}</p>
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
          )}

          {/* Charts */}
          <AmortizationCharts schedule={results.schedule} />

          {/* Interest vs principal bar */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Payment Breakdown</h3>
            <div className="flex rounded-full overflow-hidden h-4 mb-3">
              <div
                className="bg-navy-600 transition-all"
                style={{
                  width: `${(parseFloat(loanAmount.replace(/,/g, '')) / results.totalPayment) * 100}%`,
                }}
              />
              <div className="bg-amber-400 flex-1" />
            </div>
            <div className="flex gap-5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-navy-600 inline-block" />
                Principal ({((parseFloat(loanAmount.replace(/,/g, '')) / results.totalPayment) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Interest ({((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Amortization table */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-navy-900">Amortization Schedule</h3>
              <span className="text-xs text-slate-500">{results.schedule.length} payments</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Principal</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRows.map((row, idx) => {
                    const isBalloonRow = results.balloonPayment > 0 && idx === displayedRows.length - 1
                    return (
                      <tr key={row.payment} className={isBalloonRow ? 'bg-amber-50' : 'hover:bg-slate-50 transition-colors'}>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.payment}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.date}
                          {isBalloonRow && <span className="ml-2 text-xs font-semibold text-amber-600">+ Balloon</span>}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">
                          {formatCurrency(row.paymentAmount)}
                        </td>
                        <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs">
                          {formatCurrency(row.principal)}
                        </td>
                        <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium font-mono text-xs">
                          {isBalloonRow
                            ? <span className="text-amber-700 font-bold">{formatCurrency(results.balloonPayment)}</span>
                            : <span className="text-slate-800">{formatCurrency(row.balance)}</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {results.schedule.length > 12 && (
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  {showFullTable
                    ? 'Show fewer rows'
                    : `Show all ${results.schedule.length} payments`}
                </button>
              </div>
            )}
          </div>

          {/* Save section */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
            {user ? (
              saveState === 'saved' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                      placeholder="e.g. Home purchase 2025"
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
      )}
    </div>
  )
}

function ResultCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: 'emerald' | 'navy' | 'amber'
}) {
  const borderMap = {
    emerald: 'border-emerald-500',
    navy: 'border-navy-500',
    amber: 'border-amber-400',
  }
  const textMap = {
    emerald: 'text-emerald-700',
    navy: 'text-navy-700',
    amber: 'text-amber-700',
  }

  return (
    <div className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
    </div>
  )
}
