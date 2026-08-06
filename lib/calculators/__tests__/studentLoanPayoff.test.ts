import { describe, it, expect } from 'vitest'
import { comparePayoff, monthlyPayment, simulatePayoff, type PayoffInput } from '../loanPayoff'

/**
 * The student loan page reuses the shared amortizing-payoff engine (loanPayoff.ts);
 * this file pins only the figures quoted in
 * app/calculators/student-loan-payoff/page.tsx. Engine behaviour itself is covered
 * by loanPayoff.test.ts.
 */

// Standard test case: $35,000 at 6.5% on the standard 10-year plan
const BALANCE = 35_000
const RATE = 6.5
const MONTHS = 120

const base: PayoffInput = {
  balance: BALANCE,
  annualRate: RATE,
  remainingMonths: MONTHS,
  strategy: 'extra-monthly',
  extraMonthly: 0,
}

describe('page example values — $35,000 at 6.5%, 10-year standard plan', () => {
  it('the scheduled payment is $397 and the plan costs $12,690 in interest', () => {
    expect(monthlyPayment(BALANCE, RATE, MONTHS)).toBeCloseTo(397.42, 2)
    const plan = simulatePayoff(base)
    expect(Math.round(plan.totalInterest)).toBe(12_690)
    expect(Math.round(plan.totalPaid)).toBe(47_690)
  })

  it('+$100/mo: clears in 7 years 5 months, saving $3,504 and 2 years 7 months', () => {
    const c = comparePayoff({ ...base, extraMonthly: 100 })
    expect(c.accelerated.months).toBe(89)
    expect(Math.round(c.interestSaved)).toBe(3_504)
    expect(c.monthsSaved).toBe(31)
  })

  it('+$200/mo: clears in 5 years 11 months, saving $5,471 and 4 years 1 month', () => {
    const c = comparePayoff({ ...base, extraMonthly: 200 })
    expect(c.accelerated.months).toBe(71)
    expect(Math.round(c.interestSaved)).toBe(5_471)
    expect(c.monthsSaved).toBe(49)
  })

  it('a $5,000 lump sum today saves $3,966 and 1 year 10 months', () => {
    const c = comparePayoff({ ...base, strategy: 'lump-sum', lumpSum: 5_000 })
    expect(Math.round(c.interestSaved)).toBe(3_966)
    expect(c.monthsSaved).toBe(22)
  })

  it('the same $5,000 paid in month 37 saves only $2,459', () => {
    const c = comparePayoff({
      ...base,
      strategy: 'lump-sum',
      lumpSum: 5_000,
      lumpSumMonth: 37,
    })
    expect(Math.round(c.interestSaved)).toBe(2_459)
    // roughly $1,500 less than paying it today
    const now = comparePayoff({ ...base, strategy: 'lump-sum', lumpSum: 5_000 })
    expect(Math.round(now.interestSaved - c.interestSaved)).toBe(1_507)
  })

  it('biweekly payments of $199 save $1,430 and a full year', () => {
    expect(monthlyPayment(BALANCE, RATE, MONTHS) / 2).toBeCloseTo(198.71, 2)
    const c = comparePayoff({ ...base, strategy: 'biweekly' })
    expect(Math.round(c.interestSaved)).toBe(1_430)
    expect(c.monthsSaved).toBe(12)
  })

  it('refinancing to 4.5% drops the payment to $363 and saves $4,162', () => {
    expect(monthlyPayment(BALANCE, 4.5, MONTHS)).toBeCloseTo(362.73, 2)
    const current = simulatePayoff(base)
    const refinanced = simulatePayoff({ ...base, annualRate: 4.5 })
    expect(Math.round(current.totalInterest - refinanced.totalInterest)).toBe(4_162)
  })
})

// ---------------------------------------------------------------------------
// article example values — every figure quoted in
// /learn/should-you-pay-off-student-loans-early.
// ---------------------------------------------------------------------------

describe('article example values — should-you-pay-off-student-loans-early', () => {
  const BASE = { balance: 35_000, annualRate: 6.5, remainingMonths: 120 }

  it('$35,000 at 6.5% over 10 years: $397/mo and $12,690 of interest', () => {
    expect(monthlyPayment(35_000, 6.5, 120)).toBeCloseTo(397.42, 2)
    const c = comparePayoff({ ...BASE, strategy: 'extra-monthly', extraMonthly: 100 })
    expect(c.baseline.months).toBe(120)
    expect(c.baseline.totalInterest).toBeCloseTo(12_690, -1)
  })

  it('the extra-payment table rows are correct', () => {
    const rows: Array<[number, number, number, number]> = [
      // [extraMonthly, months, totalInterest, interestSaved]
      [100, 89, 9_186, 3_504],
      [200, 71, 7_219, 5_471],
      [300, 59, 5_955, 6_735],
    ]
    for (const [extra, months, interest, saved] of rows) {
      const c = comparePayoff({ ...BASE, strategy: 'extra-monthly', extraMonthly: extra })
      expect(c.accelerated.months, `extra ${extra} months`).toBe(months)
      expect(c.accelerated.totalInterest, `extra ${extra} interest`).toBeCloseTo(interest, -1)
      expect(c.interestSaved, `extra ${extra} saved`).toBeCloseTo(saved, -1)
    }
  })

  it('a $5,000 lump sum in month 1 cuts 22 months and saves $3,966', () => {
    const c = comparePayoff({
      ...BASE, strategy: 'lump-sum', lumpSum: 5_000, lumpSumMonth: 1,
    })
    expect(c.monthsSaved).toBe(22)
    expect(c.interestSaved).toBeCloseTo(3_966, -1)
  })

  it('the early lump sum roughly matches $100/mo sustained for the whole term', () => {
    const lump = comparePayoff({ ...BASE, strategy: 'lump-sum', lumpSum: 5_000, lumpSumMonth: 1 })
    const drip = comparePayoff({ ...BASE, strategy: 'extra-monthly', extraMonthly: 100 })
    // article claims "close to" — within $500 of each other
    expect(Math.abs(lump.interestSaved - drip.interestSaved)).toBeLessThan(500)
  })
})
