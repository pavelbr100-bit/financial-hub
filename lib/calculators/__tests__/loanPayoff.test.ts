import { describe, it, expect } from 'vitest'
import {
  comparePayoff,
  monthlyPayment,
  simulatePayoff,
  type PayoffInput,
} from '../loanPayoff'

// Standard test case: $300k remaining balance at 6.5% with 30 years left
const BALANCE = 300_000
const RATE = 6.5
const MONTHS = 360

const base: PayoffInput = {
  balance: BALANCE,
  annualRate: RATE,
  remainingMonths: MONTHS,
  strategy: 'extra-monthly',
  extraMonthly: 0,
}

describe('monthlyPayment', () => {
  it('matches the standard amortization formula', () => {
    expect(monthlyPayment(BALANCE, RATE, MONTHS)).toBeCloseTo(1896.2, 1)
  })

  it('degrades to straight-line principal at 0%', () => {
    expect(monthlyPayment(120_000, 0, 120)).toBeCloseTo(1000, 6)
  })

  it('returns 0 for a non-positive term', () => {
    expect(monthlyPayment(BALANCE, RATE, 0)).toBe(0)
  })
})

describe('simulatePayoff — baseline', () => {
  it('runs the full remaining term when no extra is paid', () => {
    const plan = simulatePayoff(base)
    expect(plan.months).toBe(MONTHS)
  })

  it('drives the balance to zero', () => {
    const plan = simulatePayoff(base)
    expect(plan.schedule[plan.schedule.length - 1].balance).toBeCloseTo(0, 6)
  })

  it('totalInterest equals the summed interest of every row', () => {
    const plan = simulatePayoff(base)
    const summed = plan.schedule.reduce((s, r) => s + r.interest, 0)
    expect(plan.totalInterest).toBeCloseTo(summed, 6)
  })

  it('totalPaid equals principal plus interest', () => {
    const plan = simulatePayoff(base)
    expect(plan.totalPaid).toBeCloseTo(BALANCE + plan.totalInterest, 6)
  })
})

describe('simulatePayoff — extra payments never exceed the balance', () => {
  it('final principal payment is capped at the remaining balance', () => {
    const plan = simulatePayoff({ ...base, extraMonthly: 5_000 })
    const last = plan.schedule[plan.schedule.length - 1]
    expect(last.balance).toBe(0)
    expect(last.principal).toBeLessThanOrEqual(BALANCE)
    expect(plan.schedule.every((r) => r.balance >= 0)).toBe(true)
  })

  it('a lump sum larger than the balance clears the loan in one payment', () => {
    const plan = simulatePayoff({
      ...base,
      strategy: 'lump-sum',
      lumpSum: 500_000,
    })
    expect(plan.months).toBe(1)
    expect(plan.totalPaid).toBeCloseTo(BALANCE + plan.totalInterest, 6)
  })
})

describe('simulatePayoff — strategy isolation', () => {
  it('ignores extraMonthly when the strategy is lump-sum', () => {
    const withExtra = simulatePayoff({
      ...base,
      strategy: 'lump-sum',
      lumpSum: 10_000,
      extraMonthly: 400,
    })
    const without = simulatePayoff({ ...base, strategy: 'lump-sum', lumpSum: 10_000 })
    expect(withExtra.months).toBe(without.months)
    expect(withExtra.totalInterest).toBeCloseTo(without.totalInterest, 6)
  })

  it('ignores lumpSum when the strategy is extra-monthly', () => {
    const withLump = simulatePayoff({ ...base, extraMonthly: 200, lumpSum: 25_000 })
    const without = simulatePayoff({ ...base, extraMonthly: 200 })
    expect(withLump.months).toBe(without.months)
  })

  it('applies the lump sum in the requested month', () => {
    const early = simulatePayoff({ ...base, strategy: 'lump-sum', lumpSum: 10_000, lumpSumMonth: 1 })
    const late = simulatePayoff({ ...base, strategy: 'lump-sum', lumpSum: 10_000, lumpSumMonth: 120 })
    // Same dollars, applied later, save less interest.
    expect(late.totalInterest).toBeGreaterThan(early.totalInterest)
  })

  it('biweekly adds one twelfth of the scheduled payment each month', () => {
    const bi = simulatePayoff({ ...base, strategy: 'biweekly' })
    const equivalent = simulatePayoff({
      ...base,
      extraMonthly: monthlyPayment(BALANCE, RATE, MONTHS) / 12,
    })
    expect(bi.months).toBe(equivalent.months)
    expect(bi.totalInterest).toBeCloseTo(equivalent.totalInterest, 6)
  })
})

describe('comparePayoff', () => {
  it('baseline is unaffected by the accelerated strategy', () => {
    const a = comparePayoff({ ...base, extraMonthly: 200 })
    const b = comparePayoff({ ...base, strategy: 'lump-sum', lumpSum: 50_000 })
    expect(a.baseline.totalInterest).toBeCloseTo(b.baseline.totalInterest, 6)
    expect(a.baseline.months).toBe(b.baseline.months)
  })

  it('reports zero savings when no extra is paid', () => {
    const { interestSaved, monthsSaved } = comparePayoff(base)
    expect(interestSaved).toBeCloseTo(0, 6)
    expect(monthsSaved).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Page example values — these are quoted verbatim in the prose and FAQs on
// /calculators/mortgage-payoff. Update both together.
// All assume a $300,000 balance at 6.5% with 30 years (360 months) remaining,
// where the baseline pays $1,896/mo and $382,633 in total interest.
// ---------------------------------------------------------------------------
describe('page example values — $300,000 at 6.5%, 30 years remaining', () => {
  it('baseline: $1,896/mo and $382,633 total interest', () => {
    const plan = simulatePayoff(base)
    expect(plan.monthlyPI).toBeCloseTo(1896, 0)
    expect(Math.round(plan.totalInterest)).toBe(382_633)
  })

  it('+$200/mo saves $103,449 and 6 years 11 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({ ...base, extraMonthly: 200 })
    expect(Math.round(interestSaved)).toBe(103_449)
    expect(monthsSaved).toBe(83)
  })

  it('+$300/mo saves $135,115 and 9 years 2 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({ ...base, extraMonthly: 300 })
    expect(Math.round(interestSaved)).toBe(135_115)
    expect(monthsSaved).toBe(110)
  })

  it('a $10,000 lump sum today saves $53,602 and 2 years 9 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({
      ...base,
      strategy: 'lump-sum',
      lumpSum: 10_000,
    })
    expect(Math.round(interestSaved)).toBe(53_602)
    expect(monthsSaved).toBe(33)
  })

  it('a one-time $1,000 extra payment saves $5,903 and 3 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({
      ...base,
      strategy: 'lump-sum',
      lumpSum: 1_000,
    })
    expect(Math.round(interestSaved)).toBe(5_903)
    expect(monthsSaved).toBe(3)
  })

  it('biweekly saves $87,256 and 5 years 10 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({ ...base, strategy: 'biweekly' })
    expect(Math.round(interestSaved)).toBe(87_256)
    expect(monthsSaved).toBe(70)
  })

  it('the 2% rule (+$500/mo) clears the loan in 17.5 years', () => {
    const { accelerated } = comparePayoff({ ...base, extraMonthly: 500 })
    expect(accelerated.months).toBe(210)
  })

  it('paying off in 5 years requires $5,870/mo', () => {
    expect(Math.round(monthlyPayment(BALANCE, RATE, 60))).toBe(5_870)
  })
})

// Secondary example used in the "when this helps" section.
describe('page example values — $250,000 at 7%, 25 years remaining', () => {
  it('+$150/mo saves $58,696 and 4 years 6 months', () => {
    const { interestSaved, monthsSaved } = comparePayoff({
      balance: 250_000,
      annualRate: 7,
      remainingMonths: 300,
      strategy: 'extra-monthly',
      extraMonthly: 150,
    })
    expect(Math.round(interestSaved)).toBe(58_696)
    expect(monthsSaved).toBe(54)
  })
})
