'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'

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
  totalLoanAmount: number
  totalInterest: number
  totalCost: number
  taxAmount: number
  schedule: AmortizationRow[]
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function formatInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  return digits === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(digits, 10))
}

function parseAmount(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0
}

const LOAN_TERMS = [24, 36, 48, 60, 72, 84]

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
}

export default function CarLoanCalc({ user }: Props) {
  const [vehiclePrice, setVehiclePrice] = useState('35,000')
  const [downPayment, setDownPayment] = useState('5,000')
  const [tradeIn, setTradeIn] = useState('0')
  const [loanTermMonths, setLoanTermMonths] = useState(60)
  const [interestRate, setInterestRate] = useState('7.0')
  const [salesTax, setSalesTax] = useState('8.0')
  const [isNewCar, setIsNewCar] = useState(true)
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [showFullTable, setShowFullTable] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const validate = useCallback(() => {
    const errs: Record<string, string> = {}
    const price = parseAmount(vehiclePrice)
    const down = parseAmount(downPayment)
    const trade = parseAmount(tradeIn)
    const rate = parseFloat(interestRate)
    const tax = parseFloat(salesTax)

    if (!vehiclePrice || price <= 0) errs.vehiclePrice = 'Enter a valid vehicle price'
    if (!interestRate || isNaN(rate) || rate < 0 || rate > 100) errs.interestRate = 'Enter a rate between 0 and 100'
    if (!salesTax || isNaN(tax) || tax < 0 || tax > 30) errs.salesTax = 'Enter a tax rate between 0 and 30'
    if (down + trade >= price && price > 0) errs.downPayment = 'Down payment + trade-in cannot exceed vehicle price'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [vehiclePrice, downPayment, tradeIn, interestRate, salesTax])

  function handleCalculate() {
    if (!validate()) return

    const price = parseAmount(vehiclePrice)
    const down = parseAmount(downPayment)
    const trade = parseAmount(tradeIn)
    const rate = parseFloat(interestRate)
    const tax = parseFloat(salesTax)
    const n = loanTermMonths

    const taxAmount = price * (tax / 100)
    const principal = price + taxAmount - down - trade
    const monthlyRate = rate / 100 / 12

    const monthlyPayment =
      monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1)

    const schedule: AmortizationRow[] = []
    let balance = principal
    const startDate = new Date()
    startDate.setDate(1)

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance)
      balance = Math.max(0, balance - principalPayment)

      const paymentDate = new Date(startDate)
      paymentDate.setMonth(startDate.getMonth() + i)

      schedule.push({
        payment: i,
        date: paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        paymentAmount: interestPayment + principalPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      })

      if (balance === 0) break
    }

    const totalInterest = schedule.reduce((s, r) => s + r.interest, 0)

    setResults({
      monthlyPayment,
      totalLoanAmount: principal,
      totalInterest,
      totalCost: price + taxAmount + totalInterest,
      taxAmount,
      schedule,
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
        type: 'car-loan',
        inputs: { vehiclePrice, downPayment, tradeIn, loanTermMonths: String(loanTermMonths), interestRate, salesTax },
        summary: {
          monthlyPayment: results.monthlyPayment,
          totalPayment: results.totalLoanAmount + results.totalInterest,
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

  const affordabilityPct =
    results && monthlyIncome
      ? (results.monthlyPayment / parseAmount(monthlyIncome)) * 100
      : null

  const affordabilityColor =
    affordabilityPct === null
      ? null
      : affordabilityPct < 15
      ? 'emerald'
      : affordabilityPct < 20
      ? 'amber'
      : 'red'

  const affordabilityLabel =
    affordabilityPct === null
      ? null
      : affordabilityPct < 15
      ? 'Good — within budget'
      : affordabilityPct < 20
      ? 'Caution — stretching your budget'
      : 'High — consider a less expensive car'

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Vehicle & Loan Details</h2>

        {/* New / Used toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 mb-5">
          <div>
            <p className="text-sm font-medium text-slate-700">Vehicle type</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Avg rate: new ~7%, used ~11%
            </p>
          </div>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setIsNewCar(true)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isNewCar ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              New
            </button>
            <button
              type="button"
              onClick={() => setIsNewCar(false)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-l border-slate-200 ${
                !isNewCar ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Used
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Vehicle price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vehicle Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(formatInput(e.target.value))}
                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.vehiclePrice ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="35,000"
              />
            </div>
            {errors.vehiclePrice && <p className="mt-1 text-xs text-red-500">{errors.vehiclePrice}</p>}
          </div>

          {/* Down payment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Down Payment</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={downPayment}
                onChange={(e) => setDownPayment(formatInput(e.target.value))}
                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.downPayment ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="5,000"
              />
            </div>
            {errors.downPayment && <p className="mt-1 text-xs text-red-500">{errors.downPayment}</p>}
          </div>

          {/* Trade-in value */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Trade-in Value <span className="text-xs font-normal text-slate-400">— optional</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={tradeIn}
                onChange={(e) => setTradeIn(formatInput(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          {/* Sales tax */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">State Sales Tax</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={salesTax}
                onChange={(e) => setSalesTax(e.target.value)}
                className={`w-full pl-4 pr-9 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                  errors.salesTax ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                }`}
                placeholder="8.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            {errors.salesTax && <p className="mt-1 text-xs text-red-500">{errors.salesTax}</p>}
          </div>

          {/* Interest rate */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Annual Interest Rate
              <span className="ml-2 text-xs font-normal text-slate-400">
                avg {isNewCar ? 'new ~7%' : 'used ~11%'}
              </span>
            </label>
            <div className="relative max-w-[200px]">
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
                placeholder="7.0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            {errors.interestRate && <p className="mt-1 text-xs text-red-500">{errors.interestRate}</p>}
          </div>

          {/* Loan term */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Loan Term</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {LOAN_TERMS.map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setLoanTermMonths(months)}
                  className={`py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    loanTermMonths === months
                      ? 'bg-navy-700 text-white border-navy-700 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-navy-400 hover:text-navy-700'
                  }`}
                >
                  {months}mo
                </button>
              ))}
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
          {/* Monthly payment hero */}
          <div className="bg-navy-900 rounded-xl p-6 text-white text-center">
            <p className="text-navy-300 text-xs font-semibold uppercase tracking-widest mb-1">Monthly Payment</p>
            <p className="text-5xl font-extrabold tabular-nums text-white mb-1">
              {formatCurrency(results.monthlyPayment)}
            </p>
            <p className="text-navy-400 text-sm">for {loanTermMonths} months</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Total Loan Amount"
              value={formatCurrency(results.totalLoanAmount)}
              accent="navy"
            />
            <ResultCard
              label="Total Interest Paid"
              value={formatCurrency(results.totalInterest)}
              accent="amber"
            />
            <ResultCard
              label="Total Vehicle Cost"
              value={formatCurrency(results.totalCost)}
              sub={`incl. ${formatCurrency(results.taxAmount)} tax`}
              accent="slate"
            />
          </div>

          {/* Affordability section */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="font-semibold text-navy-900 mb-1">Can I afford this car?</h3>
            <p className="text-slate-500 text-sm mb-4">
              Enter your gross monthly income to see what percentage this payment represents.
            </p>
            <div className="flex gap-3 items-start">
              <div className="relative flex-1 max-w-[220px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(formatInput(e.target.value))}
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                  placeholder="Monthly income"
                />
              </div>
              {affordabilityPct !== null && monthlyIncome && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  affordabilityColor === 'emerald'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : affordabilityColor === 'amber'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span>{affordabilityPct.toFixed(1)}% of income</span>
                </div>
              )}
            </div>
            {affordabilityPct !== null && monthlyIncome && (
              <div className={`mt-3 flex items-start gap-2 text-sm ${
                affordabilityColor === 'emerald' ? 'text-emerald-700' :
                affordabilityColor === 'amber' ? 'text-amber-700' : 'text-red-700'
              }`}>
                <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  affordabilityColor === 'emerald' ? 'bg-emerald-500' :
                  affordabilityColor === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                {affordabilityLabel}
              </div>
            )}
            <p className="mt-3 text-xs text-slate-400">
              Rule of thumb: keep car payment under 15% of gross monthly income. Above 20% puts financial stress on your budget.
            </p>
          </div>

          {/* Payment breakdown bar */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Payment Breakdown</h3>
            <div className="flex rounded-full overflow-hidden h-4 mb-3">
              <div
                className="bg-navy-600 transition-all"
                style={{ width: `${(results.totalLoanAmount / (results.totalLoanAmount + results.totalInterest)) * 100}%` }}
              />
              <div className="bg-amber-400 flex-1" />
            </div>
            <div className="flex gap-5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-navy-600 inline-block" />
                Principal ({((results.totalLoanAmount / (results.totalLoanAmount + results.totalInterest)) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Interest ({((results.totalInterest / (results.totalLoanAmount + results.totalInterest)) * 100).toFixed(1)}%)
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
                <tbody className="divide-y divide-slate-50">
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
                      <td className="px-4 py-3 text-right text-slate-800 font-medium font-mono text-xs">
                        {formatCurrency(row.balance)}
                      </td>
                    </tr>
                  ))}
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
                  <Link href="/saved" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">
                    View saved →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Save this calculation</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. Honda Accord 2025"
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
                <Link href="/auth/login" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">
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
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent: 'emerald' | 'navy' | 'amber' | 'slate'
}) {
  const borderMap = {
    emerald: 'border-emerald-500',
    navy: 'border-navy-500',
    amber: 'border-amber-400',
    slate: 'border-slate-400',
  }
  const textMap = {
    emerald: 'text-emerald-700',
    navy: 'text-navy-700',
    amber: 'text-amber-700',
    slate: 'text-slate-700',
  }

  return (
    <div className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}
