'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { computeScenario } from '@/lib/calculators/mortgageCompare'
import { saveCalculation } from '@/lib/supabase/calculations'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export interface Scenario {
  id: string
  label: string
  homePrice: string
  downPayment: string
  downType: '%' | '$'
  rate: string
  term: number
  propertyTax: string
  homeInsurance: string
  pmiRate: string
  hoa: string
  extraMonthly: string
  extraYearly: string
}

interface ScenarioResult {
  loanAmount: number
  downPct: number
  monthlyPI: number
  totalMonthly: number
  totalInterest: number
  totalPaid: number
  actualMonths: number
  interestSaved: number | undefined
  monthsSaved: number | undefined
  balances: number[]
}

const CHART_COLORS = ['#1e40af', '#059669', '#d97706']
const LABELS = ['Scenario A', 'Scenario B', 'Scenario C']
const IDS = ['s1', 's2', 's3']

const ACCENTS = [
  {
    border: 'border-blue-700',
    headerBg: 'bg-blue-700',
    activeTerm: 'bg-blue-700 border-transparent text-white',
    miniSummaryBg: 'bg-blue-50',
    miniSummaryText: 'text-blue-700',
    chartColor: CHART_COLORS[0],
  },
  {
    border: 'border-emerald-600',
    headerBg: 'bg-emerald-600',
    activeTerm: 'bg-emerald-600 border-transparent text-white',
    miniSummaryBg: 'bg-emerald-50',
    miniSummaryText: 'text-emerald-700',
    chartColor: CHART_COLORS[1],
  },
  {
    border: 'border-amber-500',
    headerBg: 'bg-amber-500',
    activeTerm: 'bg-amber-500 border-transparent text-white',
    miniSummaryBg: 'bg-amber-50',
    miniSummaryText: 'text-amber-700',
    chartColor: CHART_COLORS[2],
  },
]

function parseAmt(val: string): number {
  return parseFloat(val.replace(/,/g, '')) || 0
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

function fmtCommas(raw: string): string {
  const d = raw.replace(/[^0-9]/g, '')
  return d === '' ? '' : new Intl.NumberFormat('en-US').format(parseInt(d, 10))
}

function months2str(months: number): string {
  const yrs = Math.floor(months / 12)
  const mos = months % 12
  if (mos === 0) return `${yrs} yr`
  return `${yrs} yr ${mos} mo`
}

function defaultScenario(idx: number, overrides: Partial<Scenario> = {}): Scenario {
  const defaultRates = ['6.5', '7.0', '7.5']
  return {
    id: IDS[idx],
    label: LABELS[idx],
    homePrice: '400,000',
    downPayment: '20',
    downType: '%',
    rate: defaultRates[idx] ?? '6.5',
    term: 30,
    propertyTax: '1.2',
    homeInsurance: '1,200',
    pmiRate: '0.5',
    hoa: '',
    extraMonthly: '',
    extraYearly: '',
    ...overrides,
  }
}

function computeResult(s: Scenario): ScenarioResult | null {
  const hp = parseAmt(s.homePrice)
  const dp =
    s.downType === '%'
      ? hp * (parseFloat(s.downPayment || '0') / 100)
      : parseAmt(s.downPayment)
  if (hp <= 0 || dp < 0 || dp >= hp) return null
  const rate = parseFloat(s.rate)
  if (isNaN(rate) || rate < 0) return null

  const loanAmount = hp - dp
  const downPct = (dp / hp) * 100
  const needsPMI = downPct < 20

  const computed = computeScenario({
    principal: loanAmount,
    annualRate: rate,
    termMonths: s.term * 12,
    homePrice: hp,
    propertyTaxRate: parseFloat(s.propertyTax || '0'),
    annualInsurance: parseAmt(s.homeInsurance),
    pmiRate: needsPMI ? parseFloat(s.pmiRate || '0') : 0,
    monthlyHOA: parseAmt(s.hoa),
    extraMonthly: parseAmt(s.extraMonthly),
    extraYearly: parseAmt(s.extraYearly),
  })

  return { loanAmount, downPct, ...computed }
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  initialParams: Record<string, string>
  initialScenarios?: Scenario[]
  user: { email?: string | null } | null
}

export default function MortgageCompare({ initialParams, initialScenarios, user }: Props) {
  const [scenarios, setScenarios] = useState<Scenario[]>(() => {
    if (initialScenarios && initialScenarios.length > 0) {
      return initialScenarios.slice(0, 3).map((s, i) => ({ ...s, id: IDS[i] }))
    }
    const hasInitial = !!initialParams.price
    const s0 = defaultScenario(
      0,
      hasInitial
        ? {
            homePrice: fmtCommas(initialParams.price ?? '400000'),
            downPayment: initialParams.down ?? '20',
            downType: (initialParams.down_type as '%' | '$') ?? '%',
            rate: initialParams.rate ?? '6.5',
            term: Number(initialParams.term ?? 30),
            propertyTax: initialParams.tax ?? '1.2',
            homeInsurance: initialParams.ins
              ? fmtCommas(initialParams.ins)
              : '1,200',
            pmiRate: initialParams.pmi ?? '0.5',
            hoa: initialParams.hoa ?? '',
            extraMonthly: initialParams.extra_m ?? '',
            extraYearly: initialParams.extra_y ?? '',
          }
        : {}
    )
    return [s0, defaultScenario(1)]
  })

  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const results = useMemo(() => scenarios.map(computeResult), [scenarios])
  const anyResults = results.some(Boolean)

  async function handleSave() {
    if (!calcName.trim()) return
    setSaveState('saving')
    try {
      const validResults = results.filter(Boolean)
      const avgMonthlyPI = validResults.length
        ? validResults.reduce((s, r) => s + r!.monthlyPI, 0) / validResults.length
        : 0
      const avgInterest = validResults.length
        ? validResults.reduce((s, r) => s + r!.totalInterest, 0) / validResults.length
        : 0
      await saveCalculation({
        name: calcName.trim(),
        type: 'mortgage-compare',
        inputs: {
          scenarios: JSON.stringify(scenarios),
          scenarioCount: String(scenarios.length),
        },
        summary: {
          monthlyPayment: Math.round(avgMonthlyPI),
          totalPayment: 0,
          totalInterest: Math.round(avgInterest),
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  function update(id: string, patch: Partial<Scenario>) {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    )
  }

  function addScenario() {
    if (scenarios.length >= 3) return
    setScenarios((prev) => [...prev, defaultScenario(prev.length)])
  }

  function removeScenario(id: string) {
    if (scenarios.length <= 1) return
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }

  // Yearly balance data for chart
  const chartData = useMemo(() => {
    const maxMonths = Math.max(...results.map((r) => r?.balances.length ?? 0), 1)
    const maxYears = Math.ceil(maxMonths / 12)
    return Array.from({ length: maxYears + 1 }, (_, yi) => {
      const pt: Record<string, number> = { year: yi }
      scenarios.forEach((s, i) => {
        const r = results[i]
        if (!r) return
        if (yi === 0) {
          pt[s.id] = r.loanAmount
        } else {
          const idx = Math.min(yi * 12 - 1, r.balances.length - 1)
          pt[s.id] = r.balances[idx] ?? 0
        }
      })
      return pt
    })
  }, [scenarios, results])

  // Find best numeric value across valid results for a metric
  function bestVal(extract: (r: ScenarioResult) => number, lowerIsBetter = true) {
    const vals = results.filter(Boolean).map((r) => extract(r!))
    if (vals.length === 0) return undefined
    return lowerIsBetter ? Math.min(...vals) : Math.max(...vals)
  }

  const gridCols =
    scenarios.length === 1
      ? 'grid-cols-1 max-w-sm'
      : scenarios.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="space-y-8">
      {/* Scenario cards */}
      <div className={`grid gap-5 ${gridCols}`}>
        {scenarios.map((s, idx) => {
          const acc = ACCENTS[idx % ACCENTS.length]
          const r = results[idx]
          const hp = parseAmt(s.homePrice)
          const dp =
            s.downType === '%'
              ? hp * (parseFloat(s.downPayment || '0') / 100)
              : parseAmt(s.downPayment)
          const downPct = hp > 0 ? (dp / hp) * 100 : 0
          const needsPMI = downPct < 20 && hp > 0

          return (
            <div
              key={s.id}
              className={`bg-white rounded-xl border-2 ${acc.border} shadow-sm overflow-hidden`}
            >
              {/* Header */}
              <div
                className={`${acc.headerBg} px-4 py-3 flex items-center justify-between gap-2`}
              >
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => update(s.id, { label: e.target.value })}
                  className="bg-transparent text-white font-semibold text-sm focus:outline-none w-full placeholder-white/60"
                />
                {scenarios.length > 1 && (
                  <button
                    onClick={() => removeScenario(s.id)}
                    className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                    title="Remove"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Inputs */}
              <div className="p-4 space-y-3">
                {/* Home price */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      $
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={s.homePrice}
                      onChange={(e) =>
                        update(s.id, { homePrice: fmtCommas(e.target.value) })
                      }
                      className="w-full pl-6 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                    />
                  </div>
                </div>

                {/* Down + Rate */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Down Payment
                    </label>
                    <div className="flex gap-1">
                      <div className="relative flex-1 min-w-0">
                        {s.downType === '$' && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            $
                          </span>
                        )}
                        <input
                          type="text"
                          inputMode="numeric"
                          value={s.downPayment}
                          onChange={(e) => {
                            const v =
                              s.downType === '$'
                                ? fmtCommas(e.target.value)
                                : e.target.value.replace(/[^0-9.]/g, '')
                            update(s.id, { downPayment: v })
                          }}
                          className={`w-full ${s.downType === '$' ? 'pl-5' : 'pl-2'} ${s.downType === '%' ? 'pr-5' : 'pr-2'} py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors`}
                        />
                        {s.downType === '%' && (
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            %
                          </span>
                        )}
                      </div>
                      <select
                        value={s.downType}
                        onChange={(e) =>
                          update(s.id, {
                            downType: e.target.value as '%' | '$',
                            downPayment: e.target.value === '%' ? '20' : '80,000',
                          })
                        }
                        className="px-1.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-navy-400 cursor-pointer"
                      >
                        <option>%</option>
                        <option>$</option>
                      </select>
                    </div>
                    {hp > 0 && dp > 0 && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        {s.downType === '%' ? fmt(dp) : `${downPct.toFixed(1)}%`}
                        {needsPMI && ' · PMI'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={s.rate}
                        onChange={(e) => update(s.id, { rate: e.target.value })}
                        className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loan term */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Loan Term
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[10, 15, 20, 30].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => update(s.id, { term: yr })}
                        className={`py-1.5 rounded-md text-xs font-medium border transition-colors ${
                          s.term === yr
                            ? acc.activeTerm
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {yr}yr
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tax + Insurance */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Property Tax
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={s.propertyTax}
                        onChange={(e) =>
                          update(s.id, { propertyTax: e.target.value })
                        }
                        className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Insurance/yr
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={s.homeInsurance}
                        onChange={(e) =>
                          update(s.id, {
                            homeInsurance: fmtCommas(e.target.value),
                          })
                        }
                        className="w-full pl-5 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* PMI (conditional) */}
                {needsPMI && (
                  <div>
                    <label className="block text-xs font-medium text-amber-600 mb-1">
                      PMI Rate (down &lt; 20%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={s.pmiRate}
                        onChange={(e) =>
                          update(s.id, { pmiRate: e.target.value })
                        }
                        className="w-full pl-3 pr-7 py-2 rounded-lg border border-amber-200 bg-amber-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400 text-xs">
                        %
                      </span>
                    </div>
                  </div>
                )}

                {/* Extra payments */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra/month
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={s.extraMonthly}
                        onChange={(e) =>
                          update(s.id, {
                            extraMonthly: fmtCommas(e.target.value),
                          })
                        }
                        className="w-full pl-5 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      Extra/year
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        $
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={s.extraYearly}
                        onChange={(e) =>
                          update(s.id, {
                            extraYearly: fmtCommas(e.target.value),
                          })
                        }
                        className="w-full pl-5 pr-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-400 hover:border-slate-300 transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Mini result summary */}
                {r && (
                  <div className={`${acc.miniSummaryBg} rounded-lg p-3 space-y-1.5`}>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Monthly P&amp;I</span>
                      <span className={`font-semibold ${acc.miniSummaryText}`}>
                        {fmt(r.monthlyPI)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total monthly</span>
                      <span className="font-semibold text-slate-700">
                        {fmt(r.totalMonthly)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total interest</span>
                      <span className="font-semibold text-slate-700">
                        {fmt(r.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Payoff</span>
                      <span className="font-semibold text-slate-700">
                        {months2str(r.actualMonths)}
                      </span>
                    </div>
                    {r.interestSaved !== undefined && r.interestSaved > 0 && (
                      <div className="flex justify-between text-xs border-t border-emerald-200 pt-1.5 mt-1">
                        <span className="text-emerald-600">Interest saved</span>
                        <span className="font-semibold text-emerald-600">
                          {fmt(r.interestSaved)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Add scenario button */}
        {scenarios.length < 3 && (
          <button
            onClick={addScenario}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-navy-400 hover:text-navy-600 transition-colors min-h-[200px]"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-medium">Add scenario</span>
          </button>
        )}
      </div>

      {/* Comparison table */}
      {anyResults && <ComparisonTable scenarios={scenarios} results={results} bestVal={bestVal} />}

      {/* Balance chart */}
      {anyResults && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-semibold text-navy-900 mb-1">Loan Balance Over Time</h2>
          <p className="text-xs text-slate-400 mb-5">Remaining balance at end of each year</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="year"
                tickFormatter={(v) => `Yr ${v}`}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
                width={60}
              />
              <Tooltip
                formatter={(val) => [fmt(Number(val)), '']}
                labelFormatter={(l) => `Year ${l}`}
              />
              <Legend />
              {scenarios.map((s, i) =>
                results[i] ? (
                  <Line
                    key={s.id}
                    type="monotone"
                    dataKey={s.id}
                    name={s.label}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Save */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        {user ? (
          saveState === 'saved' ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-sm">Comparison saved!</span>
              </div>
              <Link href="/saved" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">
                View saved →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Save this comparison</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="e.g. House on Elm St — rate options"
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
            <p className="text-sm text-slate-600">Sign in to save and revisit this comparison.</p>
            <Link href="/auth/login" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">
              Sign in →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ComparisonTable({
  scenarios,
  results,
  bestVal,
}: {
  scenarios: Scenario[]
  results: (ScenarioResult | null)[]
  bestVal: (extract: (r: ScenarioResult) => number, lowerIsBetter?: boolean) => number | undefined
}) {
  interface Row {
    label: string
    getValue: (s: Scenario, r: ScenarioResult) => string
    getNum?: (r: ScenarioResult) => number
    lowerIsBetter?: boolean
  }

  const rows: Row[] = [
    {
      label: 'Home Price',
      getValue: (s) => fmt(parseAmt(s.homePrice)),
    },
    {
      label: 'Loan Amount',
      getValue: (_, r) => fmt(r.loanAmount),
      getNum: (r) => r.loanAmount,
      lowerIsBetter: true,
    },
    {
      label: 'Down Payment',
      getValue: (s, r) => {
        const dp = parseAmt(s.homePrice) - r.loanAmount
        return `${fmt(dp)} (${r.downPct.toFixed(1)}%)`
      },
    },
    {
      label: 'Interest Rate',
      getValue: (s) => `${s.rate}%`,
    },
    {
      label: 'Loan Term',
      getValue: (s) => `${s.term} yr`,
    },
    {
      label: 'Monthly P&I',
      getValue: (_, r) => fmt(r.monthlyPI),
      getNum: (r) => r.monthlyPI,
      lowerIsBetter: true,
    },
    {
      label: 'Total Monthly',
      getValue: (_, r) => fmt(r.totalMonthly),
      getNum: (r) => r.totalMonthly,
      lowerIsBetter: true,
    },
    {
      label: 'Total Interest',
      getValue: (_, r) => fmt(r.totalInterest),
      getNum: (r) => r.totalInterest,
      lowerIsBetter: true,
    },
    {
      label: 'Total Paid',
      getValue: (_, r) => fmt(r.totalPaid),
      getNum: (r) => r.totalPaid,
      lowerIsBetter: true,
    },
    {
      label: 'Payoff',
      getValue: (_, r) => months2str(r.actualMonths),
      getNum: (r) => r.actualMonths,
      lowerIsBetter: true,
    },
  ]

  const HEADER_COLORS = ['text-blue-700', 'text-emerald-700', 'text-amber-700']

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-navy-900">Side-by-Side Comparison</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-6 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">
                Metric
              </th>
              {scenarios.map((s, i) => (
                <th
                  key={s.id}
                  className={`px-6 py-3 font-semibold text-center ${HEADER_COLORS[i % HEADER_COLORS.length]}`}
                >
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, ri) => {
              const best = row.getNum
                ? bestVal((r) => row.getNum!(r), row.lowerIsBetter ?? true)
                : undefined

              return (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                >
                  <td className="px-6 py-3 text-slate-600 font-medium text-xs">
                    {row.label}
                  </td>
                  {scenarios.map((s, i) => {
                    const r = results[i]
                    if (!r) {
                      return (
                        <td
                          key={s.id}
                          className="px-6 py-3 text-center text-slate-300 text-xs"
                        >
                          —
                        </td>
                      )
                    }
                    const val = row.getValue(s, r)
                    const num = row.getNum ? row.getNum(r) : undefined
                    const isBest =
                      best !== undefined && num !== undefined && num === best
                    return (
                      <td
                        key={s.id}
                        className={`px-6 py-3 text-center font-medium text-sm tabular-nums ${
                          isBest
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-800'
                        }`}
                      >
                        {isBest && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 mb-0.5" />
                        )}
                        {val}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-slate-50 bg-slate-50/50">
        <p className="text-xs text-slate-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 mb-0.5" />
          Best value highlighted in green
        </p>
      </div>
    </div>
  )
}
