'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  calculateDebtPayoff,
  type DebtPayoffStrategy,
  type DebtPayoffResult,
} from '@/lib/calculators/debtPayoff'
import { saveCalculation } from '@/lib/supabase/calculations'

interface DebtInput {
  id: string
  name: string
  balance: string
  rate: string
  minPayment: string
}

interface Props {
  user: { email?: string | null } | null
  initialDebts?: DebtInput[]
  initialStrategy?: DebtPayoffStrategy
  initialExtra?: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const DEBT_COLORS = ['#1e3a5f', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#06b6d4']

const DEFAULT_DEBTS: DebtInput[] = [
  { id: 'debt-1', name: 'Credit Card', balance: '5,000', rate: '21', minPayment: '150' },
  { id: 'debt-2', name: 'Car Loan', balance: '12,000', rate: '6.5', minPayment: '250' },
]

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatY(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function parseMoney(s: string) {
  return parseFloat(s.replace(/,/g, '')) || 0
}

function formatMonths(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} month${m !== 1 ? 's' : ''}`
  if (m === 0) return `${y} year${y !== 1 ? 's' : ''}`
  return `${y}y ${m}m`
}

function payoffDate(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function DebtPayoffCalc({ user, initialDebts, initialStrategy, initialExtra }: Props) {
  const [debts, setDebts] = useState<DebtInput[]>(initialDebts ?? DEFAULT_DEBTS)
  const [strategy, setStrategy] = useState<DebtPayoffStrategy>(initialStrategy ?? 'avalanche')
  const [extraMonthly, setExtraMonthly] = useState(initialExtra ?? '')
  const [results, setResults] = useState<DebtPayoffResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  function updateDebt(id: string, field: keyof DebtInput, value: string) {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d))
    setResults(null)
    setSaveState('idle')
  }

  function addDebt() {
    if (debts.length >= 6) return
    setDebts(prev => [...prev, { id: `debt-${Date.now()}`, name: '', balance: '', rate: '', minPayment: '' }])
  }

  function removeDebt(id: string) {
    if (debts.length <= 1) return
    setDebts(prev => prev.filter(d => d.id !== id))
    setResults(null)
    setSaveState('idle')
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    for (const d of debts) {
      const balance = parseMoney(d.balance)
      const rate = parseFloat(d.rate)
      const min = parseMoney(d.minPayment)
      if (!d.balance || balance <= 0) errs[`balance-${d.id}`] = 'Enter a balance'
      if (!d.rate || isNaN(rate) || rate <= 0) errs[`rate-${d.id}`] = 'Enter a rate'
      if (!d.minPayment || min <= 0) errs[`min-${d.id}`] = 'Enter a minimum payment'
      if (balance > 0 && rate > 0 && min > 0) {
        const monthlyInterest = balance * rate / 100 / 12
        if (min <= monthlyInterest) {
          errs[`min-${d.id}`] = `Must exceed monthly interest (${formatCurrency(monthlyInterest)})`
        }
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleCalculate() {
    if (!validate()) return
    const parsedDebts = debts.map(d => ({
      id: d.id,
      name: d.name || 'Unnamed Debt',
      balance: parseMoney(d.balance),
      rate: parseFloat(d.rate),
      minPayment: parseMoney(d.minPayment),
    }))
    const extra = parseMoney(extraMonthly)
    const result = calculateDebtPayoff({ debts: parsedDebts, extraMonthly: extra, strategy })
    setResults(result)
    setSaveState('idle')
    setCalcName('')
  }

  // Build chart data from monthly snapshots
  const chartData = results
    ? (() => {
        const step = Math.max(1, Math.floor(results.monthlyData.length / 60))
        return results.monthlyData
          .filter((_, i) => i % step === 0)
          .map(snap => ({
            month: snap.month,
            ...Object.fromEntries(debts.map(d => [d.id, snap.balances[d.id] ?? 0])),
          }))
      })()
    : []

  const totalMinPayments = debts.reduce((s, d) => s + parseMoney(d.minPayment), 0)

  async function handleSave() {
    if (!calcName.trim() || !results) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'debt-payoff',
        inputs: {
          debts: JSON.stringify(debts),
          extraMonthly,
          strategy,
        },
        summary: {
          monthlyPayment: totalMinPayments + parseMoney(extraMonthly),
          totalInterest: results.totalInterest,
          totalPayment: debts.reduce((s, d) => s + parseMoney(d.balance), 0),
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
  }

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {([
          {
            value: 'avalanche' as const,
            title: 'Avalanche',
            subtitle: 'Saves the most money',
            desc: 'Targets the highest interest rate debt first. Mathematically optimal.',
          },
          {
            value: 'snowball' as const,
            title: 'Snowball',
            subtitle: 'Fastest wins',
            desc: 'Targets the lowest balance debt first. Psychological motivation booster.',
          },
        ]).map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => { setStrategy(opt.value); setResults(null) }}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              strategy === opt.value
                ? 'border-navy-600 bg-navy-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                strategy === opt.value ? 'border-navy-600' : 'border-slate-300'
              }`}>
                {strategy === opt.value && <div className="w-2 h-2 rounded-full bg-navy-600" />}
              </div>
              <div>
                <p className={`font-semibold text-sm ${strategy === opt.value ? 'text-navy-900' : 'text-slate-700'}`}>
                  {opt.title}
                </p>
                <p className="text-xs text-emerald-600 font-medium mb-0.5">{opt.subtitle}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Debts */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-900">Your Debts</h2>
          <span className="text-xs text-slate-400">{debts.length}/6 debts</span>
        </div>

        <div className="space-y-4">
          {debts.map((debt, i) => (
            <div
              key={debt.id}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: DEBT_COLORS[i % DEBT_COLORS.length] }}
                  />
                  <input
                    type="text"
                    placeholder={`Debt ${i + 1} name`}
                    value={debt.name}
                    onChange={e => updateDebt(debt.id, 'name', e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none placeholder-slate-400 w-full"
                  />
                </div>
                {debts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDebt(debt.id)}
                    className="text-slate-400 hover:text-red-400 transition-colors ml-2"
                    aria-label="Remove debt"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Balance</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={debt.balance}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, '')
                        updateDebt(debt.id, 'balance', raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                      }}
                      className={`w-full pl-5 pr-2 py-2 rounded-lg border text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                        errors[`balance-${debt.id}`] ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                      }`}
                      placeholder="5,000"
                    />
                  </div>
                  {errors[`balance-${debt.id}`] && (
                    <p className="mt-0.5 text-xs text-red-500">{errors[`balance-${debt.id}`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Interest Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={debt.rate}
                      onChange={e => updateDebt(debt.id, 'rate', e.target.value)}
                      className={`w-full pl-3 pr-6 py-2 rounded-lg border text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                        errors[`rate-${debt.id}`] ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                      }`}
                      placeholder="21"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                  </div>
                  {errors[`rate-${debt.id}`] && (
                    <p className="mt-0.5 text-xs text-red-500">{errors[`rate-${debt.id}`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Min Payment</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={debt.minPayment}
                      onChange={e => {
                        const raw = e.target.value.replace(/[^0-9]/g, '')
                        updateDebt(debt.id, 'minPayment', raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                      }}
                      className={`w-full pl-5 pr-2 py-2 rounded-lg border text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors ${
                        errors[`min-${debt.id}`] ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'
                      }`}
                      placeholder="150"
                    />
                  </div>
                  {errors[`min-${debt.id}`] && (
                    <p className="mt-0.5 text-xs text-red-500">{errors[`min-${debt.id}`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {debts.length < 6 && (
          <button
            type="button"
            onClick={addDebt}
            className="mt-3 w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-navy-400 text-slate-500 hover:text-navy-600 rounded-lg text-sm font-medium transition-colors"
          >
            + Add another debt
          </button>
        )}

        {/* Extra payment */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Extra Monthly Payment{' '}
            <span className="text-xs font-normal text-slate-400">— optional, applied to priority debt each month</span>
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={extraMonthly}
              onChange={e => {
                const raw = e.target.value.replace(/[^0-9]/g, '')
                setExtraMonthly(raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                setResults(null)
              }}
              className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full py-3 bg-navy-700 hover:bg-navy-600 active:bg-navy-800 text-white font-semibold rounded-lg transition-colors text-sm tracking-wide shadow-sm"
        >
          Calculate Payoff Plan
        </button>
      </div>

      {/* Results */}
      {results && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Debt-Free Date"
              value={payoffDate(results.payoffMonths)}
              sub={formatMonths(results.payoffMonths)}
              accent="emerald"
            />
            <ResultCard
              label="Total Interest"
              value={formatCurrency(results.totalInterest)}
              accent="amber"
            />
            <ResultCard
              label="Total Debt"
              value={formatCurrency(debts.reduce((s, d) => s + parseMoney(d.balance), 0))}
              accent="navy"
            />
          </div>

          {/* Savings banner */}
          {results.interestSaved !== undefined && results.monthsSaved !== undefined && results.interestSaved > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-semibold text-emerald-800">
                  Extra payment savings ({formatCurrency(parseMoney(extraMonthly))}/mo extra)
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
                    {formatMonths(results.monthsSaved)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Balance chart */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
              <h3 className="font-semibold text-navy-900 mb-5">Debt Balance Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={v => v >= 12 ? `${Math.floor(Number(v) / 12)}yr` : `${v}mo`}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                    />
                    <YAxis
                      tickFormatter={formatY}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                    />
                    <Tooltip
                      formatter={(val, name) => [
                        formatCurrency(Number(val)),
                        debts.find(d => d.id === name)?.name || String(name),
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Legend
                      formatter={name => debts.find(d => d.id === name)?.name || String(name)}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    {debts.map((debt, i) => (
                      <Line
                        key={debt.id}
                        type="monotone"
                        dataKey={debt.id}
                        stroke={DEBT_COLORS[i % DEBT_COLORS.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        name={debt.id}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Payoff order table */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-navy-900">Payoff Order</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {strategy === 'avalanche' ? 'Highest interest rate first' : 'Lowest balance first'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Debt</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest Paid</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Paid Off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[...results.debtResults]
                    .sort((a, b) => a.paidOffMonth - b.paidOffMonth)
                    .map((dr, rank) => {
                      const color = DEBT_COLORS[debts.findIndex(d => d.id === dr.id) % DEBT_COLORS.length]
                      return (
                        <tr key={dr.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-500 text-xs">{rank + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                              <span className="font-medium text-slate-800">{dr.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs tabular-nums">
                            {formatCurrency(dr.originalBalance)}
                          </td>
                          <td className="px-4 py-3 text-right text-amber-600 font-mono text-xs tabular-nums">
                            {formatCurrency(dr.totalInterest)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-xs text-emerald-700 font-medium">{payoffDate(dr.paidOffMonth)}</div>
                            <div className="text-xs text-slate-400">{formatMonths(dr.paidOffMonth)}</div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
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
                  <p className="text-sm font-medium text-slate-700">Save this payoff plan</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g. My debt payoff plan"
                      value={calcName}
                      onChange={e => setCalcName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSave()}
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
  accent: 'emerald' | 'navy' | 'amber'
}) {
  const borderMap = { emerald: 'border-emerald-500', navy: 'border-navy-500', amber: 'border-amber-400' }
  const textMap = { emerald: 'text-emerald-700', navy: 'text-navy-700', amber: 'text-amber-700' }
  return (
    <div className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}
