'use client'

import { useState } from 'react'
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

interface MonthlyBreakdown {
  principalInterest: number
  propertyTax: number
  homeInsurance: number
  pmi: number
  hoa: number
  total: number
}

interface Results {
  monthly: MonthlyBreakdown
  loanAmount: number
  totalInterest: number
  schedule: AmortizationRow[]
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
  initialValues?: Record<string, string>
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

function buildSchedule(principal: number, annualRate: number, termMonths: number): { schedule: AmortizationRow[]; monthlyPI: number } {
  const r = annualRate / 100 / 12
  const monthlyPI = r === 0
    ? principal / termMonths
    : (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)

  let balance = principal
  const start = new Date()
  const schedule: AmortizationRow[] = []

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * r
    const principalPmt = monthlyPI - interest
    balance = Math.max(0, balance - principalPmt)
    const d = new Date(start)
    d.setMonth(start.getMonth() + i)
    schedule.push({
      payment: i,
      date: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      paymentAmount: monthlyPI,
      principal: principalPmt,
      interest,
      balance,
    })
  }

  return { schedule, monthlyPI }
}

export default function MortgageCalc({ user, initialValues }: Props) {
  const [homePrice, setHomePrice] = useState(initialValues?.homePrice ?? '400,000')
  const [downPayment, setDownPayment] = useState(initialValues?.down ?? '20')
  const [downType, setDownType] = useState<'%' | '$'>((initialValues?.downType as '%' | '$') ?? '%')
  const [interestRate, setInterestRate] = useState(initialValues?.rate ?? '6.5')
  const [loanTerm, setLoanTerm] = useState(Number(initialValues?.term ?? 30))
  const [propertyTax, setPropertyTax] = useState(initialValues?.tax ?? '1.2')
  const [homeInsurance, setHomeInsurance] = useState(initialValues?.insurance ?? '1,200')
  const [pmiRate, setPmiRate] = useState(initialValues?.pmi ?? '0.5')
  const [includeHOA, setIncludeHOA] = useState(parseAmount(initialValues?.hoa ?? '0') > 0)
  const [hoaFees, setHoaFees] = useState(initialValues?.hoa ?? '300')
  const [results, setResults] = useState<Results | null>(null)
  const [showFullTable, setShowFullTable] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const homePriceNum = parseAmount(homePrice)
  const downPaymentNum = downType === '%'
    ? homePriceNum * (parseFloat(downPayment || '0') / 100)
    : parseAmount(downPayment)
  const downPct = homePriceNum > 0 ? (downPaymentNum / homePriceNum) * 100 : 0
  const needsPMI = downPct < 20 && homePriceNum > 0

  function handleCalculate() {
    const errs: Record<string, string> = {}
    const hp = parseAmount(homePrice)
    const dp = downType === '%' ? hp * (parseFloat(downPayment || '0') / 100) : parseAmount(downPayment)
    const rate = parseFloat(interestRate)

    if (!hp || hp <= 0) errs.homePrice = 'Enter a valid home price'
    if (dp < 0 || dp >= hp) errs.downPayment = 'Down payment must be less than home price'
    if (!interestRate || isNaN(rate) || rate < 0 || rate > 100) errs.interestRate = 'Enter a valid interest rate'

    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const loanAmount = hp - dp
    const termMonths = loanTerm * 12
    const { schedule, monthlyPI } = buildSchedule(loanAmount, rate, termMonths)

    const monthlyTax = (hp * (parseFloat(propertyTax || '0') / 100)) / 12
    const monthlyInsurance = parseAmount(homeInsurance) / 12
    const monthlyPMI = needsPMI ? (loanAmount * (parseFloat(pmiRate || '0') / 100)) / 12 : 0
    const monthlyHOA = includeHOA ? parseAmount(hoaFees) : 0
    const total = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA
    const totalInterest = monthlyPI * termMonths - loanAmount

    setResults({
      monthly: { principalInterest: monthlyPI, propertyTax: monthlyTax, homeInsurance: monthlyInsurance, pmi: monthlyPMI, hoa: monthlyHOA, total },
      loanAmount,
      totalInterest,
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
        type: 'mortgage',
        inputs: { homePrice, down: downPayment, downType, rate: interestRate, term: String(loanTerm), tax: propertyTax, insurance: homeInsurance, pmi: pmiRate, hoa: includeHOA ? hoaFees : '0' },
        summary: { monthlyPayment: results.monthly.total, totalPayment: results.monthly.total * loanTerm * 12, totalInterest: results.totalInterest },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const displayedRows = results ? (showFullTable ? results.schedule : results.schedule.slice(0, 12)) : []

  const breakdownItems = results ? [
    { label: 'Principal & Interest', value: results.monthly.principalInterest, color: 'bg-navy-600' },
    { label: 'Property Tax', value: results.monthly.propertyTax, color: 'bg-emerald-500' },
    { label: 'Home Insurance', value: results.monthly.homeInsurance, color: 'bg-sky-400' },
    ...(results.monthly.pmi > 0 ? [{ label: 'PMI', value: results.monthly.pmi, color: 'bg-amber-400' }] : []),
    ...(results.monthly.hoa > 0 ? [{ label: 'HOA Fees', value: results.monthly.hoa, color: 'bg-purple-400' }] : []),
  ] : []

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Mortgage Details</h2>
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
                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${errors.homePrice ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'}`}
                placeholder="400,000"
              />
            </div>
            {errors.homePrice && <p className="mt-1 text-xs text-red-500">{errors.homePrice}</p>}
          </div>

          {/* Down payment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Down Payment</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {downType === '$' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>}
                <input
                  type="text"
                  inputMode="numeric"
                  value={downPayment}
                  onChange={(e) => {
                    if (downType === '$') setDownPayment(formatCommas(e.target.value))
                    else setDownPayment(e.target.value.replace(/[^0-9.]/g, ''))
                  }}
                  className={`w-full ${downType === '$' ? 'pl-7 pr-4' : 'pl-4 pr-9'} py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${errors.downPayment ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'}`}
                  placeholder={downType === '%' ? '20' : '80,000'}
                />
                {downType === '%' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>}
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
            {errors.downPayment && <p className="mt-1 text-xs text-red-500">{errors.downPayment}</p>}
            {homePriceNum > 0 && downPaymentNum > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                {downType === '%' ? formatCurrency(downPaymentNum) : `${downPct.toFixed(1)}%`}
                {needsPMI && ' · PMI will apply'}
              </p>
            )}
          </div>

          {/* Interest rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Interest Rate</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full pl-4 pr-9 py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${errors.interestRate ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-slate-400'}`}
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            {errors.interestRate && <p className="mt-1 text-xs text-red-500">{errors.interestRate}</p>}
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

          {/* Property tax */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Property Tax (annual)</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="1.2"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>

          {/* Home insurance */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Home Insurance (annual)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={homeInsurance}
                onChange={(e) => setHomeInsurance(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="1,200"
              />
            </div>
          </div>

          {/* PMI */}
          {needsPMI && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                PMI Rate (annual)
                <span className="ml-2 text-xs font-normal text-amber-600">Required — down payment under 20%</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pmiRate}
                  onChange={(e) => setPmiRate(e.target.value)}
                  className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-amber-300 bg-amber-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
              </div>
            </div>
          )}

          {/* HOA */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-slate-700">HOA Fees (monthly)</label>
              <button
                type="button"
                onClick={() => setIncludeHOA(!includeHOA)}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${includeHOA ? 'bg-navy-600' : 'bg-slate-200'}`}
                aria-label="Toggle HOA"
              >
                <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${includeHOA ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            {includeHOA && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={hoaFees}
                  onChange={(e) => setHoaFees(formatCommas(e.target.value) || '0')}
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                  placeholder="300"
                />
              </div>
            )}
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
          {/* Total monthly */}
          <div className="bg-navy-900 rounded-xl p-6 text-white text-center">
            <p className="text-navy-300 text-sm font-medium mb-1">Total Monthly Payment</p>
            <p className="text-4xl font-extrabold tabular-nums">{formatCurrency(results.monthly.total)}</p>
            <p className="text-navy-400 text-xs mt-2">{loanTerm}-year mortgage · {interestRate}% rate</p>
          </div>

          {/* Monthly breakdown */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Monthly Breakdown</h3>
            <div className="flex rounded-full overflow-hidden h-3 mb-5">
              {breakdownItems.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} transition-all`}
                  style={{ width: `${(item.value / results.monthly.total) * 100}%` }}
                />
              ))}
            </div>
            <div className="space-y-2.5">
              {breakdownItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm ${item.color} flex-shrink-0`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-medium text-slate-800 tabular-nums">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Loan Amount" value={formatCurrency(results.loanAmount)} accent="navy" />
            <SummaryCard label="Total Interest" value={formatCurrency(results.totalInterest)} accent="amber" />
            <SummaryCard label="Total Cost" value={formatCurrency(results.loanAmount + results.totalInterest)} accent="emerald" />
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
                    {['#', 'Date', 'Payment', 'Principal', 'Interest', 'Balance'].map((h, i) => (
                      <th key={h} className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${i <= 1 ? 'text-left' : 'text-right'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayedRows.map((row) => (
                    <tr key={row.payment} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.payment}</td>
                      <td className="px-4 py-3 text-slate-700">{row.date}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">{formatCurrency(row.paymentAmount)}</td>
                      <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs">{formatCurrency(row.principal)}</td>
                      <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs">{formatCurrency(row.interest)}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">{formatCurrency(row.balance)}</td>
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
                  {showFullTable ? 'Show fewer rows' : `Show all ${results.schedule.length} payments`}
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
                      placeholder="e.g. Dream home 2025"
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
                  {saveState === 'error' && <p className="text-xs text-red-500">Failed to save. Please try again.</p>}
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

function SummaryCard({ label, value, accent }: { label: string; value: string; accent: 'emerald' | 'navy' | 'amber' }) {
  const borderMap = { emerald: 'border-emerald-500', navy: 'border-navy-500', amber: 'border-amber-400' }
  const textMap = { emerald: 'text-emerald-700', navy: 'text-navy-700', amber: 'text-amber-700' }
  return (
    <div className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
    </div>
  )
}
