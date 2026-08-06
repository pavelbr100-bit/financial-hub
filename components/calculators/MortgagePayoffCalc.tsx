'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'
import { comparePayoff, type PayoffStrategy } from '@/lib/calculators/mortgagePayoff'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
}

const STRATEGIES: { id: PayoffStrategy; label: string; short: string }[] = [
  { id: 'extra-monthly', label: 'Extra monthly payment', short: 'Extra monthly' },
  { id: 'lump-sum', label: 'One-time lump sum', short: 'Lump sum' },
  { id: 'biweekly', label: 'Biweekly payments', short: 'Biweekly' },
]

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatCommas(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '')
  return digits === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(digits, 10))
}

function parseAmount(val: string): number {
  return parseFloat(val.replace(/,/g, '')) || 0
}

function formatDuration(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} mo`
  if (m === 0) return `${y} yr`
  return `${y}y ${m}m`
}

function payoffDate(monthsFromNow: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsFromNow)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function scheduleDate(monthOffset: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + monthOffset)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function MortgagePayoffCalc({ user }: Props) {
  const [balance, setBalance] = useState('300,000')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('30')
  const [months, setMonths] = useState('0')
  const [strategy, setStrategy] = useState<PayoffStrategy>('extra-monthly')
  const [extraMonthly, setExtraMonthly] = useState('200')
  const [lumpSum, setLumpSum] = useState('10,000')
  const [lumpDelay, setLumpDelay] = useState('0')
  const [showFullTable, setShowFullTable] = useState(false)
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const remainingMonths =
    (parseInt(years || '0', 10) || 0) * 12 + (parseInt(months || '0', 10) || 0)

  const results = useMemo(() => {
    const bal = parseAmount(balance)
    const r = parseFloat(rate)

    if (!bal || bal <= 0) return null
    if (!rate || isNaN(r) || r < 0 || r > 100) return null
    if (remainingMonths <= 0 || remainingMonths > 600) return null

    return comparePayoff({
      balance: bal,
      annualRate: r,
      remainingMonths,
      strategy,
      extraMonthly: parseAmount(extraMonthly),
      lumpSum: parseAmount(lumpSum),
      lumpSumMonth: (parseInt(lumpDelay || '0', 10) || 0) + 1,
    })
  }, [balance, rate, remainingMonths, strategy, extraMonthly, lumpSum, lumpDelay])

  async function handleSave() {
    if (!calcName.trim() || !results) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'mortgage-payoff',
        inputs: {
          balance,
          rate,
          years,
          months,
          strategy,
          extraMonthly,
          lumpSum,
          lumpDelay,
        },
        summary: {
          monthlyPayment: results.accelerated.monthlyPI,
          totalPayment: results.accelerated.totalPaid,
          totalInterest: results.accelerated.totalInterest,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const schedule = results?.accelerated.schedule ?? []
  const displayedRows = showFullTable ? schedule : schedule.slice(0, 12)
  const strategyLabel = STRATEGIES.find((s) => s.id === strategy)!.short

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Your Current Mortgage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="payoff-balance"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Remaining Loan Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                id="payoff-balance"
                type="text"
                inputMode="numeric"
                value={balance}
                onChange={(e) => setBalance(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="300,000"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              What you still owe today — not the original loan amount.
            </p>
          </div>

          <div>
            <label htmlFor="payoff-rate" className="block text-sm font-medium text-slate-700 mb-1.5">
              Interest Rate
            </label>
            <div className="relative">
              <input
                id="payoff-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="6.5"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                %
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Time Remaining</span>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  aria-label="Years remaining"
                  type="number"
                  min="0"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-4 pr-16 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                  placeholder="30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  years
                </span>
              </div>
              <div className="relative flex-1">
                <input
                  aria-label="Additional months remaining"
                  type="number"
                  min="0"
                  max="11"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full pl-4 pr-20 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  months
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-1">How Will You Pay It Down?</h2>
        <p className="text-sm text-slate-500 mb-4">
          Each option is compared against sticking to your current payment.
        </p>
        <div
          role="group"
          aria-label="Payoff strategy"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5"
        >
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={strategy === s.id}
              onClick={() => {
                setStrategy(s.id)
                setShowFullTable(false)
              }}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                strategy === s.id
                  ? 'bg-navy-700 border-navy-700 text-white'
                  : 'border-slate-300 text-slate-700 hover:border-navy-400 hover:text-navy-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {strategy === 'extra-monthly' && (
          <div className="sm:max-w-xs">
            <label
              htmlFor="payoff-extra"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Extra Principal Each Month
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                id="payoff-extra"
                type="text"
                inputMode="numeric"
                value={extraMonthly}
                onChange={(e) => setExtraMonthly(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="200"
              />
            </div>
          </div>
        )}

        {strategy === 'lump-sum' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="payoff-lump"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Lump Sum Toward Principal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  $
                </span>
                <input
                  id="payoff-lump"
                  type="text"
                  inputMode="numeric"
                  value={lumpSum}
                  onChange={(e) => setLumpSum(formatCommas(e.target.value))}
                  className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                  placeholder="10,000"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="payoff-lump-delay"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Paid In
              </label>
              <div className="relative">
                <input
                  id="payoff-lump-delay"
                  type="number"
                  min="0"
                  max="120"
                  value={lumpDelay}
                  onChange={(e) => setLumpDelay(e.target.value)}
                  className="w-full pl-4 pr-24 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  months from now
                </span>
              </div>
            </div>
          </div>
        )}

        {strategy === 'biweekly' && results && (
          <div className="bg-navy-50 border border-navy-100 rounded-lg p-4 text-sm text-navy-800">
            Paying{' '}
            <strong className="tabular-nums">
              {formatCurrency(results.accelerated.monthlyPI / 2)}
            </strong>{' '}
            every two weeks makes 26 half-payments a year — one extra full payment annually. No
            input needed.
          </div>
        )}
      </div>

      {results ? (
        <>
          {/* Hero */}
          <div className="bg-navy-900 rounded-xl p-6 text-white">
            <div className="grid grid-cols-2 divide-x divide-navy-700">
              <div className="text-center pr-6">
                <p className="text-navy-300 text-xs font-medium mb-1 uppercase tracking-wide">
                  Current Payoff
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold">
                  {payoffDate(results.baseline.months)}
                </p>
                <p className="text-navy-400 text-xs mt-1.5 tabular-nums">
                  {formatCurrency(results.baseline.totalInterest)} interest
                </p>
              </div>
              <div className="text-center pl-6">
                <p className="text-emerald-400 text-xs font-medium mb-1 uppercase tracking-wide">
                  New Payoff
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {payoffDate(results.accelerated.months)}
                </p>
                <p className="text-navy-400 text-xs mt-1.5 tabular-nums">
                  {formatCurrency(results.accelerated.totalInterest)} interest
                </p>
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
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="font-semibold text-emerald-800">
                {strategyLabel} savings vs. your current plan
              </h3>
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
                  {results.monthsSaved > 0 ? formatDuration(results.monthsSaved) : 'None yet'}
                </p>
              </div>
            </div>
            {results.monthsSaved === 0 && (
              <p className="mt-3 text-xs text-emerald-700">
                Add an extra payment above to see how much time and interest you could cut.
              </p>
            )}
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-navy-900">Current Plan vs. {strategyLabel}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/2">
                      <span className="sr-only">Metric</span>
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Current
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">
                      {strategyLabel}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      label: 'Scheduled Payment (P&I)',
                      current: formatCurrency(results.baseline.monthlyPI),
                      accel:
                        strategy === 'biweekly'
                          ? `${formatCurrency(results.accelerated.monthlyPI / 2)} / 2 wks`
                          : strategy === 'extra-monthly'
                            ? formatCurrency(
                                results.accelerated.monthlyPI + parseAmount(extraMonthly)
                              )
                            : formatCurrency(results.accelerated.monthlyPI),
                    },
                    {
                      label: 'Time to Payoff',
                      current: formatDuration(results.baseline.months),
                      accel: formatDuration(results.accelerated.months),
                    },
                    {
                      label: 'Payoff Date',
                      current: payoffDate(results.baseline.months),
                      accel: payoffDate(results.accelerated.months),
                    },
                    {
                      label: 'Total Interest',
                      current: formatCurrency(results.baseline.totalInterest),
                      accel: formatCurrency(results.accelerated.totalInterest),
                    },
                    {
                      label: 'Total Paid',
                      current: formatCurrency(results.baseline.totalPaid),
                      accel: formatCurrency(results.accelerated.totalPaid),
                    },
                  ].map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-600">{row.label}</td>
                      <td className="px-5 py-3 text-right font-medium text-slate-800 tabular-nums">
                        {row.current}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-700 tabular-nums bg-emerald-50/50">
                        {row.accel}
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
                      {results.monthsSaved > 0 && (
                        <span className="text-emerald-600 text-xs ml-1.5">
                          ({formatDuration(results.monthsSaved)} sooner)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-navy-900">Payoff Schedule</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                With your {strategyLabel.toLowerCase()} applied to principal.
              </p>
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
                      <td className="px-4 py-3 text-slate-700">{scheduleDate(row.payment)}</td>
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
            {schedule.length > 12 && (
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  {showFullTable ? 'Show fewer rows' : `Show all ${schedule.length} payments`}
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
                      aria-hidden="true"
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
                  <label
                    htmlFor="payoff-save-name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Save this calculation
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="payoff-save-name"
                      type="text"
                      placeholder="e.g. Payoff plan 2026"
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
                <p className="text-sm text-slate-600">
                  Sign in to save and revisit this payoff plan.
                </p>
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
            Enter your remaining balance, rate, and time left to see your payoff date.
          </p>
        </div>
      )}
    </div>
  )
}
