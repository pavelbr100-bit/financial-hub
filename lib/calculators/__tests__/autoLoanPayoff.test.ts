import { describe, it, expect } from 'vitest'
import { comparePayoff, simulatePayoff, monthlyPayment, type PayoffInput } from '../loanPayoff'
import {
  autoPayoffWithEquity,
  equityPosition,
  vehicleValue,
  DEFAULT_DEPRECIATION,
} from '../autoLoanPayoff'

// Standard test case: $28,000 owed at 7.5% with 48 months left, car worth $24,000
const BALANCE = 28_000
const RATE = 7.5
const MONTHS = 48
const VALUE = 24_000

const base: PayoffInput = {
  balance: BALANCE,
  annualRate: RATE,
  remainingMonths: MONTHS,
  strategy: 'extra-monthly',
  extraMonthly: 0,
}

describe('vehicleValue', () => {
  it('returns the current value at month zero', () => {
    expect(vehicleValue(VALUE, 15, 0)).toBeCloseTo(VALUE, 6)
  })

  it('applies the annual rate continuously, not in yearly steps', () => {
    // Half a year of 15% decline is more than 0% and less than 7.5%
    const half = vehicleValue(VALUE, 15, 6)
    expect(half).toBeLessThan(VALUE)
    expect(half).toBeGreaterThan(vehicleValue(VALUE, 15, 12))
  })

  it('compounds to exactly the annual rate after 12 months', () => {
    expect(vehicleValue(VALUE, 15, 12)).toBeCloseTo(VALUE * 0.85, 6)
    expect(vehicleValue(VALUE, 15, 24)).toBeCloseTo(VALUE * 0.85 * 0.85, 6)
  })

  it('never returns a negative value at 100% depreciation', () => {
    expect(vehicleValue(VALUE, 100, 12)).toBe(0)
  })
})

describe('equityPosition', () => {
  it('reports positive equity and crossover month 0 when already above water', () => {
    const plan = simulatePayoff(base)
    const eq = equityPosition(plan, BALANCE, 32_000, 15)
    expect(eq.equityNow).toBe(4_000)
    expect(eq.crossoverMonth).toBe(0)
  })

  it('reports the shortfall when underwater', () => {
    const plan = simulatePayoff(base)
    expect(equityPosition(plan, BALANCE, VALUE, 15).equityNow).toBe(-4_000)
  })

  it('finds the month the balance first drops below the car value', () => {
    const plan = simulatePayoff(base)
    const eq = equityPosition(plan, BALANCE, VALUE, 15)
    expect(eq.crossoverMonth).not.toBeNull()
    const row = plan.schedule[eq.crossoverMonth! - 1]
    const value = vehicleValue(VALUE, 15, eq.crossoverMonth!)
    expect(row.balance).toBeLessThanOrEqual(value)
    // and the month before is still underwater
    const prev = plan.schedule[eq.crossoverMonth! - 2]
    expect(prev.balance).toBeGreaterThan(vehicleValue(VALUE, 15, eq.crossoverMonth! - 1))
  })

  it('pushes the crossover to the final payment when depreciation is severe', () => {
    // The balance always reaches zero, so the gap closes by the last month at worst.
    const plan = simulatePayoff(base)
    expect(equityPosition(plan, BALANCE, VALUE, 60).crossoverMonth).toBe(MONTHS)
  })

  it('returns a null crossover only when there is no schedule to walk', () => {
    const empty = { ...simulatePayoff(base), schedule: [] }
    expect(equityPosition(empty, BALANCE, VALUE, 15).crossoverMonth).toBeNull()
  })

  it('defaults to 15% a year', () => {
    const plan = simulatePayoff(base)
    expect(equityPosition(plan, BALANCE, VALUE).crossoverMonth).toBe(
      equityPosition(plan, BALANCE, VALUE, DEFAULT_DEPRECIATION).crossoverMonth
    )
  })
})

describe('autoPayoffWithEquity', () => {
  it('returns the plan and the equity position together', () => {
    const { plan, equity } = autoPayoffWithEquity(base, VALUE)
    expect(plan.months).toBe(MONTHS)
    expect(equity.equityNow).toBe(-4_000)
  })
})

// Every figure quoted in the prose and FAQs of app/calculators/auto-loan-payoff/page.tsx.
describe('page example values — $28,000 at 7.5%, 48 months left', () => {
  it('the scheduled payment is $677 and the loan costs $4,496 in interest', () => {
    expect(monthlyPayment(BALANCE, RATE, MONTHS)).toBeCloseTo(677.01, 2)
    expect(Math.round(simulatePayoff(base).totalInterest)).toBe(4_496)
  })

  it('+$100/mo: clears in 41 months, saving $673 and 7 months', () => {
    const c = comparePayoff({ ...base, extraMonthly: 100 })
    expect(c.accelerated.months).toBe(41)
    expect(Math.round(c.interestSaved)).toBe(673)
    expect(c.monthsSaved).toBe(7)
  })

  it('+$200/mo: clears in 36 months, saving $1,167 and a full year', () => {
    const c = comparePayoff({ ...base, extraMonthly: 200 })
    expect(c.accelerated.months).toBe(36)
    expect(Math.round(c.accelerated.totalInterest)).toBe(3_330)
    expect(Math.round(c.interestSaved)).toBe(1_167)
    expect(c.monthsSaved).toBe(12)
  })

  it('a $3,000 lump sum saves $960 and 5 months', () => {
    const c = comparePayoff({ ...base, strategy: 'lump-sum', lumpSum: 3_000 })
    expect(Math.round(c.interestSaved)).toBe(960)
    expect(c.monthsSaved).toBe(5)
  })

  it('biweekly payments save $407 and 4 months', () => {
    const c = comparePayoff({ ...base, strategy: 'biweekly' })
    expect(Math.round(c.interestSaved)).toBe(407)
    expect(c.monthsSaved).toBe(4)
  })

  it('$4,000 underwater today, above water at month 17 on the current schedule', () => {
    const { equity } = autoPayoffWithEquity(base, VALUE, 15)
    expect(equity.equityNow).toBe(-4_000)
    expect(equity.crossoverMonth).toBe(17)
  })

  it('+$200/mo pulls the above-water month forward to month 10', () => {
    const { equity } = autoPayoffWithEquity({ ...base, extraMonthly: 200 }, VALUE, 15)
    expect(equity.crossoverMonth).toBe(10)
  })
})
