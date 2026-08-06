'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'
import {
  compareCardPayoff,
  DEFAULT_MIN_FLOOR,
  DEFAULT_MIN_PERCENT,
  type CardPayoffMode,
} from '@/lib/calculators/creditCardPayoff'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
}

const MODES: { id: CardPayoffMode; label: string; short: string }[] = [
  { id: 'fixed-payment', label: 'A set amount each month', short: 'Fixed payment' },
  { id: 'target-date', label: 'Debt free by a date', short: 'Target date' },
  { id: 'minimum-only', label: 'Minimum payment only', short: 'Minimums only' },
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

export default function CreditCardPayoffCalc({ user }: Props) {
  const [balance, setBalance] = useState('6,000')
  const [apr, setApr] = useState('22')
  const [mode, setMode] = useState<CardPayoffMode>('fixed-payment')
  const [monthlyPayment, setMonthlyPayment] = useState('200')
  const [targetMonths, setTargetMonths] = useState('24')
  const [showFullTable, setShowFullTable] = useState(false)
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const results = useMemo(() => {
    const bal = parseAmount(balance)
    const r = parseFloat(apr)

    if (!bal || bal <= 0) return null
    if (!apr || isNaN(r) || r < 0 || r > 100) return null

    const target = parseInt(targetMonths || '0', 10) || 0
    if (mode === 'target-date' && (target < 1 || target > 360)) return null

    return compareCardPayoff({
      balance: bal,
      apr: r,
      mode,
      monthlyPayment: parseAmount(monthlyPayment),
      targetMonths: target,
    })
  }, [balance, apr, mode, monthlyPayment, targetMonths])

  async function handleSave() {
    if (!calcName.trim() || !results || results.plan.neverPaysOff) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'credit-card-payoff',
        inputs: { balance, apr, mode, monthlyPayment, targetMonths },
        summary: {
          monthlyPayment: results.requiredPayment,
          totalPayment: results.plan.totalPaid,
          totalInterest: results.plan.totalInterest,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const schedule = results?.plan.schedule ?? []
  const displayedRows = showFullTable ? schedule : schedule.slice(0, 12)
  const modeLabel = MODES.find((m) => m.id === mode)!.short
  const isMinimumOnly = mode === 'minimum-only'
  const stalled = results?.plan.neverPaysOff ?? false
  const monthOneInterest = parseAmount(balance) * ((parseFloat(apr) || 0) / 100 / 12)

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Your Card</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="card-balance" className="block text-sm font-medium text-slate-700 mb-1.5">
              Current Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                id="card-balance"
                type="text"
                inputMode="numeric"
                value={balance}
                onChange={(e) => setBalance(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="6,000"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              The statement balance you are carrying, not your credit limit.
            </p>
          </div>

          <div>
            <label htmlFor="card-apr" className="block text-sm font-medium text-slate-700 mb-1.5">
              Purchase APR
            </label>
            <div className="relative">
              <input
                id="card-apr"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="22"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                %
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              On your statement, usually next to &ldquo;interest charge calculation&rdquo;.
            </p>
          </div>
        </div>
      </div>

      {/* Mode */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-1">How Will You Pay It Off?</h2>
        <p className="text-sm text-slate-500 mb-4">
          Every option is compared against paying only the minimum your issuer asks for.
        </p>
        <div role="group" aria-label="Payoff approach" className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => {
                setMode(m.id)
                setShowFullTable(false)
              }}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                mode === m.id
                  ? 'bg-navy-700 border-navy-700 text-white'
                  : 'border-slate-300 text-slate-700 hover:border-navy-400 hover:text-navy-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'fixed-payment' && (
          <div className="sm:max-w-xs">
            <label htmlFor="card-payment" className="block text-sm font-medium text-slate-700 mb-1.5">
              Monthly Payment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                $
              </span>
              <input
                id="card-payment"
                type="text"
                inputMode="numeric"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(formatCommas(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="200"
              />
            </div>
          </div>
        )}

        {mode === 'target-date' && (
          <div className="sm:max-w-xs">
            <label htmlFor="card-target" className="block text-sm font-medium text-slate-700 mb-1.5">
              Clear the Balance In
            </label>
            <div className="relative">
              <input
                id="card-target"
                type="number"
                min="1"
                max="360"
                value={targetMonths}
                onChange={(e) => setTargetMonths(e.target.value)}
                className="w-full pl-4 pr-20 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
                placeholder="24"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                months
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              We work backwards to the payment this requires.
            </p>
          </div>
        )}

        {isMinimumOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
            Modelled as {DEFAULT_MIN_PERCENT}% of the balance plus that month&apos;s interest, with a
            ${DEFAULT_MIN_FLOOR} floor — the formula most major issuers use. Because the percentage
            applies to a shrinking balance, the amount due falls every month, which is exactly why
            this plan takes so long.
          </div>
        )}
      </div>

      {results ? (
        stalled ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-semibold text-red-800 mb-2">This payment never clears the balance</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              At {apr}% APR, {formatCurrency(parseAmount(balance))} accrues about{' '}
              <strong className="tabular-nums">{formatCurrency(monthOneInterest)}</strong> in interest
              in the first month alone. A payment of{' '}
              {formatCurrency(parseAmount(monthlyPayment))} does not cover that, so the balance grows
              instead of falling. Raise the payment above{' '}
              <strong className="tabular-nums">{formatCurrency(monthOneInterest)}</strong> to make any
              progress at all.
            </p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="bg-navy-900 rounded-xl p-6 text-white">
              <div className="grid grid-cols-2 divide-x divide-navy-700">
                <div className="text-center pr-6">
                  <p className="text-navy-300 text-xs font-medium mb-1 uppercase tracking-wide">
                    Paying Minimums
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold">
                    {payoffDate(results.minimumOnly.months)}
                  </p>
                  <p className="text-navy-400 text-xs mt-1.5 tabular-nums">
                    {formatCurrency(results.minimumOnly.totalInterest)} interest
                  </p>
                </div>
                <div className="text-center pl-6">
                  <p className="text-emerald-400 text-xs font-medium mb-1 uppercase tracking-wide">
                    {isMinimumOnly ? 'Same Plan' : 'Your Plan'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {payoffDate(results.plan.months)}
                  </p>
                  <p className="text-navy-400 text-xs mt-1.5 tabular-nums">
                    {formatCurrency(results.plan.totalInterest)} interest
                  </p>
                </div>
              </div>
            </div>

            {/* Headline number */}
            <div
              className={`rounded-xl p-5 border ${
                isMinimumOnly ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              {isMinimumOnly ? (
                <>
                  <h3 className="font-semibold text-amber-800 mb-3">
                    What minimum payments actually cost
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-amber-600 mb-0.5">Time to Clear</p>
                      <p className="text-2xl font-bold text-amber-700">
                        {formatDuration(results.plan.months)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 mb-0.5">Interest Paid</p>
                      <p className="text-2xl font-bold text-amber-700 tabular-nums">
                        {formatCurrency(results.plan.totalInterest)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-amber-700">
                    Your first minimum is {formatCurrency(results.plan.firstPayment)}. Switch to a set
                    amount above and hold it steady to see how much of that interest disappears.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <h3 className="font-semibold text-emerald-800">
                      Savings vs. paying the minimum
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-emerald-600 mb-0.5">
                        {mode === 'target-date' ? 'Payment Needed' : 'Your Payment'}
                      </p>
                      <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(results.requiredPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 mb-0.5">Interest Saved</p>
                      <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(results.interestSaved)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 mb-0.5">Time Saved</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {formatDuration(results.monthsSaved)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Comparison */}
            <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-navy-900">Minimum Payments vs. {modeLabel}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/2">
                        <span className="sr-only">Metric</span>
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Minimums
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">
                        {modeLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        label: 'Monthly Payment',
                        current: `${formatCurrency(results.minimumOnly.firstPayment)}, falling`,
                        accel: isMinimumOnly
                          ? `${formatCurrency(results.plan.firstPayment)}, falling`
                          : `${formatCurrency(results.requiredPayment)}, fixed`,
                      },
                      {
                        label: 'Time to Payoff',
                        current: formatDuration(results.minimumOnly.months),
                        accel: formatDuration(results.plan.months),
                      },
                      {
                        label: 'Payoff Date',
                        current: payoffDate(results.minimumOnly.months),
                        accel: payoffDate(results.plan.months),
                      },
                      {
                        label: 'Total Interest',
                        current: formatCurrency(results.minimumOnly.totalInterest),
                        accel: formatCurrency(results.plan.totalInterest),
                      },
                      {
                        label: 'Total Paid',
                        current: formatCurrency(results.minimumOnly.totalPaid),
                        accel: formatCurrency(results.plan.totalPaid),
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
                  Assumes no new purchases on the card.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      {['#', 'Date', 'Payment', 'Interest', 'Principal', 'Balance'].map((h, i) => (
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
                      <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{row.month}</td>
                        <td className="px-4 py-3 text-slate-700">{scheduleDate(row.month)}</td>
                        <td className="px-4 py-3 text-right font-medium text-slate-800 font-mono text-xs">
                          {formatCurrency(row.payment)}
                        </td>
                        <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs">
                          {formatCurrency(row.interest)}
                        </td>
                        <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs">
                          {formatCurrency(row.principal)}
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
                    {showFullTable ? 'Show fewer rows' : `Show all ${schedule.length} months`}
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
                      htmlFor="card-save-name"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Save this calculation
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="card-save-name"
                        type="text"
                        placeholder="e.g. Visa payoff plan"
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
                  <p className="text-sm text-slate-600">Sign in to save and revisit this plan.</p>
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
        )
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-8 text-center">
          <p className="text-slate-400 text-sm">
            Enter your balance and APR to see how long the card takes to clear.
          </p>
        </div>
      )}
    </div>
  )
}
