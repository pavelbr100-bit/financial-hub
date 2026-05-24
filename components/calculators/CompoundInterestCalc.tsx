'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  calculateCompoundInterest,
  type CompoundingFrequency,
} from '@/lib/calculators/compoundInterest'
import { saveCalculation } from '@/lib/supabase/calculations'

interface Props {
  user: { email?: string | null } | null
  initialValues?: {
    principal: string
    contribution: string
    rate: string
    freq: string
    years: string
  }
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

const FREQ_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
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

function formatMoney(raw: string): string {
  const n = parseInt(raw.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? '' : new Intl.NumberFormat('en-US').format(n)
}

export default function CompoundInterestCalc({ user, initialValues }: Props) {
  const [principal, setPrincipal] = useState(
    initialValues?.principal ? formatMoney(initialValues.principal) : '10,000'
  )
  const [contribution, setContribution] = useState(
    initialValues?.contribution ?? '200'
  )
  const [rate, setRate] = useState(initialValues?.rate ?? '7')
  const [freq, setFreq] = useState<CompoundingFrequency>(
    (initialValues?.freq as CompoundingFrequency) ?? 'monthly'
  )
  const [years, setYears] = useState(initialValues?.years ?? '20')
  const [showFullTable, setShowFullTable] = useState(false)
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const result = useMemo(() => {
    const p = parseMoney(principal)
    const c = parseMoney(contribution)
    const r = parseFloat(rate)
    const y = parseInt(years, 10)
    if (p < 0 || c < 0) return null
    if (p === 0 && c === 0) return null
    if (isNaN(r) || r < 0 || r > 100) return null
    if (isNaN(y) || y < 1 || y > 50) return null
    return calculateCompoundInterest({
      principal: p,
      monthlyContribution: c,
      annualRate: r,
      compoundingFrequency: freq,
      years: y,
    })
  }, [principal, contribution, rate, freq, years])

  const displayedRows = result
    ? showFullTable
      ? result.yearlyData
      : result.yearlyData.slice(0, 10)
    : []

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
  }

  async function handleSave() {
    if (!calcName.trim() || !result) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'compound-interest',
        inputs: { principal, contribution, rate, freq, years },
        summary: {
          monthlyPayment: parseMoney(contribution),
          totalInterest: result.totalInterestEarned,
          totalPayment: result.finalBalance,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">Investment Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Initial investment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Initial Investment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={principal}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '')
                  setPrincipal(raw === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                }}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="10,000"
              />
            </div>
          </div>

          {/* Monthly contribution */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Monthly Contribution
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={contribution}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, '')
                  setContribution(raw === '' ? '0' : new Intl.NumberFormat('en-US').format(parseInt(raw, 10)))
                }}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="200"
              />
            </div>
          </div>

          {/* Annual rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Annual Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 hover:border-slate-400 transition-colors"
                placeholder="7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>

          {/* Compounding frequency */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Compounding Frequency
            </label>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {FREQ_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFreq(opt.value)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                    freq === opt.value
                      ? 'bg-navy-700 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Years — full width with slider */}
          <div className="col-span-full">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Time Period</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={years}
                  onChange={e => {
                    const v = e.target.value
                    if (v === '' || (parseInt(v) >= 1 && parseInt(v) <= 50)) setYears(v)
                  }}
                  className="w-16 text-center px-2 py-1.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
                />
                <span className="text-sm text-slate-500">years</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={parseInt(years) || 1}
              onChange={e => setYears(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-navy-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 yr</span>
              <span>25 yrs</span>
              <span>50 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Final Balance"
              value={formatCurrency(result.finalBalance)}
              accent="emerald"
            />
            <ResultCard
              label="Total Contributed"
              value={formatCurrency(result.totalContributions)}
              accent="navy"
            />
            <ResultCard
              label="Interest Earned"
              value={formatCurrency(result.totalInterestEarned)}
              accent="amber"
            />
          </div>

          {/* Growth breakdown bar */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Where your balance comes from</h3>
            <div className="flex rounded-full overflow-hidden h-4 mb-3">
              <div
                className="bg-navy-600 transition-all"
                style={{
                  width: `${(result.totalContributions / result.finalBalance) * 100}%`,
                }}
              />
              <div className="bg-emerald-400 flex-1" />
            </div>
            <div className="flex gap-5 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-navy-600 inline-block" />
                Contributions ({((result.totalContributions / result.finalBalance) * 100).toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                Interest ({((result.totalInterestEarned / result.finalBalance) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Growth chart */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
            <h3 className="font-semibold text-navy-900 mb-5">Balance Growth Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={result.yearlyData}
                  margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="year"
                    tickFormatter={v => `Y${v}`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.max(0, Math.floor(result.yearlyData.length / 8) - 1)}
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
                      name === 'contributions' ? 'Contributions' : 'Interest Earned',
                    ]}
                    contentStyle={tooltipStyle}
                  />
                  <Legend
                    formatter={val => val === 'contributions' ? 'Contributions' : 'Interest Earned'}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stackId="1"
                    stroke="#1e3a5f"
                    fill="#1e3a5f"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    name="contributions"
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    name="interest"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-slate-400 text-center">
              Notice how interest (green) grows faster than contributions over time — this is compound growth
            </p>
          </div>

          {/* Year-by-year table */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-navy-900">Year-by-Year Growth</h3>
              <span className="text-xs text-slate-500">{result.yearlyData.length} years</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Year</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Balance</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contributed</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Interest %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayedRows.map(row => (
                    <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-700 font-medium">Year {row.year}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700 font-mono text-xs tabular-nums">
                        {formatCurrency(row.balance)}
                      </td>
                      <td className="px-4 py-3 text-right text-navy-700 font-mono text-xs tabular-nums">
                        {formatCurrency(row.contributions)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 font-mono text-xs tabular-nums">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 font-mono text-xs tabular-nums">
                        {row.balance > 0 ? ((row.interest / row.balance) * 100).toFixed(1) : '0.0'}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.yearlyData.length > 10 && (
              <div className="px-6 py-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
                >
                  {showFullTable
                    ? 'Show fewer years'
                    : `Show all ${result.yearlyData.length} years`}
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
                      placeholder="e.g. Retirement savings 2025"
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
  accent,
}: {
  label: string
  value: string
  accent: 'emerald' | 'navy' | 'amber'
}) {
  const borderMap = { emerald: 'border-emerald-500', navy: 'border-navy-500', amber: 'border-amber-400' }
  const textMap = { emerald: 'text-emerald-700', navy: 'text-navy-700', amber: 'text-amber-700' }
  return (
    <div className={`bg-white rounded-xl shadow-card border-t-4 ${borderMap[accent]} border-x border-b border-slate-100 p-5`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[accent]} tabular-nums`}>{value}</p>
    </div>
  )
}
