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
