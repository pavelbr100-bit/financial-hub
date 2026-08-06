'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { saveCalculation } from '@/lib/supabase/calculations'
import { compareRentVsBuy } from '@/lib/calculators/rentVsBuy'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Props {
  user: { email?: string | null } | null
}

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

function formatYearsMonths(months: number): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  if (y === 0) return `${m} month${m === 1 ? '' : 's'}`
  if (m === 0) return `${y} year${y === 1 ? '' : 's'}`
  return `${y} yr ${m} mo`
}

/** Small labelled percent input — this calculator has a lot of them. */
function PercentField({
  id,
  label,
  value,
  onChange,
  step = '0.1',
  max = '100',
  help,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  step?: string
  max?: string
  help?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step={step}
          min="0"
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-4 pr-9 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
      </div>
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  )
}

/** Small labelled dollar input. */
function MoneyField({
  id,
  label,
  value,
  onChange,
  placeholder,
  help,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  help?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(formatCommas(e.target.value))}
          placeholder={placeholder}
          className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
        />
      </div>
      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  )
}

export default function RentVsBuyCalc({ user }: Props) {
  // Buying
  const [homePrice, setHomePrice] = useState('400,000')
  const [downPercent, setDownPercent] = useState('20')
  const [mortgageRate, setMortgageRate] = useState('6.5')
  const [closingPercent, setClosingPercent] = useState('3')
  const [taxRate, setTaxRate] = useState('1.1')
  const [insuranceRate, setInsuranceRate] = useState('0.5')
  const [maintenanceRate, setMaintenanceRate] = useState('1')
  const [hoa, setHoa] = useState('0')
  const [appreciation, setAppreciation] = useState('3')
  const [sellingPercent, setSellingPercent] = useState('6')

  // Renting
  const [rent, setRent] = useState('2,200')
  const [rentGrowth, setRentGrowth] = useState('3')
  const [rentersInsurance, setRentersInsurance] = useState('15')

  // Shared
  const [investReturn, setInvestReturn] = useState('6')
  const [years, setYears] = useState('10')

  const [showAssumptions, setShowAssumptions] = useState(false)
  const [calcName, setCalcName] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const horizon = parseInt(years || '0', 10) || 0

  const results = useMemo(() => {
    const price = parseAmount(homePrice)
    if (!price || price <= 0) return null
    if (!parseAmount(rent)) return null
    if (horizon < 1 || horizon > 40) return null

    return compareRentVsBuy({
      homePrice: price,
      downPaymentPercent: parseFloat(downPercent) || 0,
      mortgageRate: parseFloat(mortgageRate) || 0,
      mortgageTermYears: 30,
      closingCostPercent: parseFloat(closingPercent) || 0,
      propertyTaxRate: parseFloat(taxRate) || 0,
      homeInsuranceRate: parseFloat(insuranceRate) || 0,
      maintenanceRate: parseFloat(maintenanceRate) || 0,
      hoaMonthly: parseAmount(hoa),
      homeAppreciation: parseFloat(appreciation) || 0,
      sellingCostPercent: parseFloat(sellingPercent) || 0,
      monthlyRent: parseAmount(rent),
      rentGrowth: parseFloat(rentGrowth) || 0,
      rentersInsuranceMonthly: parseAmount(rentersInsurance),
      investmentReturn: parseFloat(investReturn) || 0,
      years: horizon,
    })
  }, [
    homePrice,
    downPercent,
    mortgageRate,
    closingPercent,
    taxRate,
    insuranceRate,
    maintenanceRate,
    hoa,
    appreciation,
    sellingPercent,
    rent,
    rentGrowth,
    rentersInsurance,
    investReturn,
    horizon,
  ])

  // The breakeven can sit beyond the chosen horizon, so look ahead 40 years for it.
  const longRun = useMemo(() => {
    const price = parseAmount(homePrice)
    if (!price || !parseAmount(rent)) return null
    return compareRentVsBuy({
      homePrice: price,
      downPaymentPercent: parseFloat(downPercent) || 0,
      mortgageRate: parseFloat(mortgageRate) || 0,
      mortgageTermYears: 30,
      closingCostPercent: parseFloat(closingPercent) || 0,
      propertyTaxRate: parseFloat(taxRate) || 0,
      homeInsuranceRate: parseFloat(insuranceRate) || 0,
      maintenanceRate: parseFloat(maintenanceRate) || 0,
      hoaMonthly: parseAmount(hoa),
      homeAppreciation: parseFloat(appreciation) || 0,
      sellingCostPercent: parseFloat(sellingPercent) || 0,
      monthlyRent: parseAmount(rent),
      rentGrowth: parseFloat(rentGrowth) || 0,
      rentersInsuranceMonthly: parseAmount(rentersInsurance),
      investmentReturn: parseFloat(investReturn) || 0,
      years: 40,
    })
  }, [
    homePrice,
    downPercent,
    mortgageRate,
    closingPercent,
    taxRate,
    insuranceRate,
    maintenanceRate,
    hoa,
    appreciation,
    sellingPercent,
    rent,
    rentGrowth,
    rentersInsurance,
    investReturn,
  ])

  async function handleSave() {
    if (!calcName.trim() || !results) return
    setSaveState('saving')
    try {
      await saveCalculation({
        name: calcName.trim(),
        type: 'rent-vs-buy',
        inputs: {
          homePrice,
          downPercent,
          mortgageRate,
          closingPercent,
          taxRate,
          insuranceRate,
          maintenanceRate,
          hoa,
          appreciation,
          sellingPercent,
          rent,
          rentGrowth,
          rentersInsurance,
          investReturn,
          years,
        },
        summary: {
          monthlyPayment: results.firstMonthBuyCost,
          totalPayment: results.buyerNetWorth,
          totalInterest: results.renterNetWorth,
        },
      })
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  const buyingWins = (results?.advantage ?? 0) > 0
  const breakeven = longRun?.breakevenMonth ?? null

  return (
    <div className="space-y-6">
      {/* Core inputs */}
      <div className="bg-white rounded-xl shadow-card border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-5">The Two Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <MoneyField
            id="rvb-price"
            label="Home Price"
            value={homePrice}
            onChange={setHomePrice}
            placeholder="400,000"
          />
          <MoneyField
            id="rvb-rent"
            label="Monthly Rent"
            value={rent}
            onChange={setRent}
            placeholder="2,200"
            help="What a comparable place would cost to rent."
          />
          <PercentField
            id="rvb-down"
            label="Down Payment"
            value={downPercent}
            onChange={setDownPercent}
            step="1"
          />
          <PercentField
            id="rvb-rate"
            label="Mortgage Rate"
            value={mortgageRate}
            onChange={setMortgageRate}
            step="0.01"
          />
          <div>
            <label htmlFor="rvb-years" className="block text-sm font-medium text-slate-700 mb-1.5">
              How Long You Stay
            </label>
            <div className="relative">
              <input
                id="rvb-years"
                type="number"
                min="1"
                max="40"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full pl-4 pr-16 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                years
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              The single input that changes the answer most.
            </p>
          </div>
          <PercentField
            id="rvb-invest"
            label="Investment Return"
            value={investReturn}
            onChange={setInvestReturn}
            step="0.1"
            help="What the money not spent on housing earns instead."
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAssumptions(!showAssumptions)}
          aria-expanded={showAssumptions}
          className="mt-5 text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors"
        >
          {showAssumptions ? '− Hide' : '+ Show'} the other assumptions
        </button>

        {showAssumptions && (
          <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <PercentField
              id="rvb-tax"
              label="Property Tax"
              value={taxRate}
              onChange={setTaxRate}
              step="0.05"
              max="10"
              help="Per year, of home value."
            />
            <PercentField
              id="rvb-ins"
              label="Home Insurance"
              value={insuranceRate}
              onChange={setInsuranceRate}
              step="0.05"
              max="10"
              help="Per year, of home value."
            />
            <PercentField
              id="rvb-maint"
              label="Maintenance"
              value={maintenanceRate}
              onChange={setMaintenanceRate}
              step="0.1"
              max="10"
              help="Per year, of home value."
            />
            <PercentField
              id="rvb-appr"
              label="Home Appreciation"
              value={appreciation}
              onChange={setAppreciation}
              step="0.1"
              max="20"
              help="Per year."
            />
            <PercentField
              id="rvb-closing"
              label="Closing Costs"
              value={closingPercent}
              onChange={setClosingPercent}
              step="0.5"
              max="15"
              help="One-time, when buying."
            />
            <PercentField
              id="rvb-selling"
              label="Selling Costs"
              value={sellingPercent}
              onChange={setSellingPercent}
              step="0.5"
              max="15"
              help="One-time, when you sell."
            />
            <PercentField
              id="rvb-rentgrowth"
              label="Rent Increases"
              value={rentGrowth}
              onChange={setRentGrowth}
              step="0.1"
              max="20"
              help="Per year."
            />
            <MoneyField id="rvb-hoa" label="HOA Dues" value={hoa} onChange={setHoa} help="Monthly." />
            <MoneyField
              id="rvb-rentins"
              label="Renters Insurance"
              value={rentersInsurance}
              onChange={setRentersInsurance}
              help="Monthly."
            />
          </div>
        )}
      </div>

      {results ? (
        <>
          {/* Verdict */}
          <div
            className={`rounded-xl p-6 text-white ${buyingWins ? 'bg-emerald-800' : 'bg-navy-900'}`}
          >
            <p
              className={`text-xs font-medium mb-1 uppercase tracking-wide ${
                buyingWins ? 'text-emerald-300' : 'text-navy-300'
              }`}
            >
              After {horizon} year{horizon === 1 ? '' : 's'}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold mb-2">
              {buyingWins ? 'Buying' : 'Renting'} comes out ahead by{' '}
              {formatCurrency(Math.abs(results.advantage))}
            </p>
            <p className={`text-sm ${buyingWins ? 'text-emerald-100' : 'text-navy-200'}`}>
              {breakeven === null
                ? 'On these assumptions, buying does not catch up within 40 years.'
                : breakeven <= horizon * 12
                  ? `Buying pulls ahead after ${formatYearsMonths(breakeven)} and stays ahead.`
                  : `Buying would pull ahead at ${formatYearsMonths(breakeven)} — longer than you plan to stay.`}
            </p>
          </div>

          {/* Net worth comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-1">If you buy</h3>
              <p className="text-2xl font-bold text-navy-900 tabular-nums mb-3">
                {formatCurrency(results.buyerNetWorth)}
              </p>
              <dl className="space-y-1.5 text-sm">
                {[
                  ['Cash needed upfront', formatCurrency(results.upfrontCost)],
                  ['Monthly cost, year 1', formatCurrency(results.firstMonthBuyCost)],
                  ['Mortgage payment only', formatCurrency(results.monthlyPI)],
                  ['Home value at the end', formatCurrency(results.years[horizon - 1].homeValue)],
                  ['Loan still owed', formatCurrency(results.years[horizon - 1].loanBalance)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-slate-800 font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-white rounded-xl shadow-card border border-slate-100 p-5">
              <h3 className="font-semibold text-navy-900 mb-1">If you rent and invest</h3>
              <p className="text-2xl font-bold text-navy-900 tabular-nums mb-3">
                {formatCurrency(results.renterNetWorth)}
              </p>
              <dl className="space-y-1.5 text-sm">
                {[
                  ['Cash needed upfront', formatCurrency(0)],
                  ['Monthly cost, year 1', formatCurrency(results.firstMonthRentCost)],
                  [
                    'Invested on day one',
                    formatCurrency(results.upfrontCost),
                  ],
                  [
                    'Monthly difference invested',
                    formatCurrency(
                      Math.max(0, results.firstMonthBuyCost - results.firstMonthRentCost)
                    ),
                  ],
                  ['Total rent paid', formatCurrency(results.years[horizon - 1].renterCashOut)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className="text-slate-800 font-medium tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Year by year */}
          <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-navy-900">Net Worth, Year by Year</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assumes the buyer sells at the end of each year and pays selling costs.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {['Year', 'If you buy', 'If you rent', 'Difference'].map((h, i) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide ${
                          i === 0 ? 'text-left' : 'text-right'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.years.map((y) => {
                    const diff = y.buyerNetWorth - y.renterNetWorth
                    return (
                      <tr key={y.year} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700">{y.year}</td>
                        <td className="px-4 py-3 text-right text-slate-800 font-mono text-xs">
                          {formatCurrency(y.buyerNetWorth)}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-800 font-mono text-xs">
                          {formatCurrency(y.renterNetWorth)}
                        </td>
                        <td
                          className={`px-4 py-3 text-right font-mono text-xs font-semibold ${
                            diff >= 0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {diff >= 0 ? '+' : '−'}
                          {formatCurrency(Math.abs(diff))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
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
                  <label htmlFor="rvb-save-name" className="block text-sm font-medium text-slate-700">
                    Save this comparison
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="rvb-save-name"
                      type="text"
                      placeholder="e.g. Austin, 5-year plan"
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
                <p className="text-sm text-slate-600">Sign in to save and revisit this comparison.</p>
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
            Enter a home price and a monthly rent to compare the two.
          </p>
        </div>
      )}
    </div>
  )
}
