'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

interface ScheduleRow {
  payment: number
  principal: number
  interest: number
  balance: number
}

interface Props {
  schedule: ScheduleRow[]
  homePrice?: number
}

type ChartTab = 'split' | 'balance' | 'equity'

function formatY(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toFixed(0)}`
}

function formatTooltip(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function buildYearlyData(schedule: ScheduleRow[], homePrice?: number) {
  const totalYears = Math.ceil(schedule.length / 12)
  return Array.from({ length: totalYears }, (_, i) => {
    const monthsInYear = schedule.slice(i * 12, (i + 1) * 12)
    const principal = monthsInYear.reduce((s, r) => s + r.principal, 0)
    const interest = monthsInYear.reduce((s, r) => s + r.interest, 0)
    const balance = monthsInYear[monthsInYear.length - 1]?.balance ?? 0
    const equity = homePrice ? homePrice - balance : undefined
    return { year: `Y${i + 1}`, principal, interest, balance, equity }
  })
}

const TABS: { id: ChartTab; label: string }[] = [
  { id: 'split', label: 'P&I Split' },
  { id: 'balance', label: 'Balance' },
  { id: 'equity', label: 'Equity' },
]

export default function AmortizationCharts({ schedule, homePrice }: Props) {
  const [tab, setTab] = useState<ChartTab>('split')
  const data = buildYearlyData(schedule, homePrice)

  const showEquity = !!homePrice

  const tooltipStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '12px',
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-navy-900">Payment Analysis</h3>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          {TABS.filter(t => t.id !== 'equity' || showEquity).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'bg-navy-700 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {tab === 'split' ? (
            <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 8)} />
              <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={52} />
              <Tooltip
                formatter={(val, name) => [formatTooltip(Number(val)), name === 'principal' ? 'Principal' : 'Interest']}
                contentStyle={tooltipStyle}
                cursor={{ fill: '#f8fafc' }}
              />
              <Legend
                formatter={(val) => val === 'principal' ? 'Principal' : 'Interest'}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="principal" stackId="a" fill="#1e3a5f" radius={[0, 0, 0, 0]} />
              <Bar dataKey="interest" stackId="a" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          ) : tab === 'balance' ? (
            <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 8)} />
              <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={52} />
              <Tooltip
                formatter={(val) => [formatTooltip(Number(val)), 'Remaining Balance']}
                contentStyle={tooltipStyle}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#1e3a5f"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: '#1e3a5f' }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 8)} />
              <YAxis tickFormatter={formatY} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={52} />
              <Tooltip
                formatter={(val, name) => [formatTooltip(Number(val)), name === 'equity' ? 'Equity' : 'Remaining Balance']}
                contentStyle={tooltipStyle}
              />
              <Legend
                formatter={(val) => val === 'equity' ? 'Equity' : 'Remaining Balance'}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Area type="monotone" dataKey="balance" stackId="1" stroke="#1e3a5f" fill="#e8eef5" strokeWidth={2} />
              <Area type="monotone" dataKey="equity" stackId="1" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {tab === 'split' && (
        <p className="mt-3 text-xs text-slate-400 text-center">
          Each bar shows one year of payments — notice how interest dominates early years
        </p>
      )}
      {tab === 'balance' && (
        <p className="mt-3 text-xs text-slate-400 text-center">
          Loan balance drops slowly at first, then accelerates as more of each payment hits principal
        </p>
      )}
      {tab === 'equity' && (
        <p className="mt-3 text-xs text-slate-400 text-center">
          Equity (green) grows as your balance falls — does not include home appreciation
        </p>
      )}
    </div>
  )
}
