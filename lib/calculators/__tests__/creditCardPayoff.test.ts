import { describe, it, expect } from 'vitest'
import {
  compareCardPayoff,
  paymentForTerm,
  simulateFixedPayment,
  simulateMinimumOnly,
  DEFAULT_MIN_FLOOR,
} from '../creditCardPayoff'

// Standard test case: a $6,000 balance at 22% APR
const BALANCE = 6_000
const APR = 22

describe('simulateFixedPayment', () => {
  it('drives the balance to exactly zero', () => {
    const plan = simulateFixedPayment(BALANCE, APR, 200)
    expect(plan.schedule[plan.schedule.length - 1].balance).toBe(0)
  })

  it('totalInterest equals the summed interest of every row', () => {
    const plan = simulateFixedPayment(BALANCE, APR, 200)
    const summed = plan.schedule.reduce((s, r) => s + r.interest, 0)
    expect(plan.totalInterest).toBeCloseTo(summed, 6)
  })

  it('totalPaid equals principal plus interest', () => {
    const plan = simulateFixedPayment(BALANCE, APR, 200)
    expect(plan.totalPaid).toBeCloseTo(BALANCE + plan.totalInterest, 6)
  })

  it('caps the final payment at the remaining balance', () => {
    const plan = simulateFixedPayment(BALANCE, APR, 200)
    const last = plan.schedule[plan.schedule.length - 1]
    expect(last.payment).toBeLessThan(200)
  })

  it('flags a payment that never covers the monthly interest', () => {
    // $6,000 at 22% accrues exactly $110 in month one
    expect(simulateFixedPayment(BALANCE, APR, 110).neverPaysOff).toBe(true)
    expect(simulateFixedPayment(BALANCE, APR, 109).neverPaysOff).toBe(true)
    expect(simulateFixedPayment(BALANCE, APR, 111).neverPaysOff).toBe(false)
  })

  it('degrades to straight-line principal at 0% APR', () => {
    const plan = simulateFixedPayment(1_200, 0, 100)
    expect(plan.months).toBe(12)
    expect(plan.totalInterest).toBeCloseTo(0, 6)
  })

  it('returns an empty plan for a zero balance', () => {
    const plan = simulateFixedPayment(0, APR, 200)
    expect(plan.months).toBe(0)
    expect(plan.schedule).toHaveLength(0)
  })
})

describe('simulateMinimumOnly', () => {
  it('shrinks the required payment every month as the balance falls', () => {
    const plan = simulateMinimumOnly(BALANCE, APR)
    expect(plan.schedule[11].payment).toBeLessThan(plan.schedule[0].payment)
    expect(plan.schedule[59].payment).toBeLessThan(plan.schedule[11].payment)
  })

  it('never drops the payment below the dollar floor while a balance remains', () => {
    const plan = simulateMinimumOnly(BALANCE, APR)
    for (const row of plan.schedule.slice(0, -1)) {
      expect(row.payment).toBeGreaterThanOrEqual(DEFAULT_MIN_FLOOR - 1e-9)
    }
  })

  it('still clears the balance — slowly', () => {
    const plan = simulateMinimumOnly(BALANCE, APR)
    expect(plan.neverPaysOff).toBe(false)
    expect(plan.schedule[plan.schedule.length - 1].balance).toBe(0)
  })
})

describe('paymentForTerm', () => {
  it('produces a payment that clears the balance in exactly that many months', () => {
    for (const months of [12, 18, 24, 36, 60]) {
      const payment = paymentForTerm(BALANCE, APR, months)
      expect(simulateFixedPayment(BALANCE, APR, payment).months).toBe(months)
    }
  })

  it('degrades to balance divided by term at 0% APR', () => {
    expect(paymentForTerm(1_200, 0, 12)).toBeCloseTo(100, 6)
  })

  it('returns 0 for a non-positive term', () => {
    expect(paymentForTerm(BALANCE, APR, 0)).toBe(0)
  })
})

describe('compareCardPayoff', () => {
  it('measures every mode against the minimum-only baseline', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'fixed-payment',
      monthlyPayment: 200,
    })
    expect(c.interestSaved).toBeCloseTo(c.minimumOnly.totalInterest - c.plan.totalInterest, 6)
    expect(c.monthsSaved).toBe(c.minimumOnly.months - c.plan.months)
  })

  it('reports no saving when the plan IS the minimum', () => {
    const c = compareCardPayoff({ balance: BALANCE, apr: APR, mode: 'minimum-only' })
    expect(c.interestSaved).toBe(0)
    expect(c.monthsSaved).toBe(0)
    expect(c.requiredPayment).toBeCloseTo(c.minimumOnly.firstPayment, 6)
  })

  it('target-date mode hits the requested term exactly', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'target-date',
      targetMonths: 24,
    })
    expect(c.plan.months).toBe(24)
  })
})

// Every figure quoted in the prose and FAQs of app/calculators/credit-card-payoff/page.tsx.
// Minimum payment is 1% of the balance plus that month's interest, floored at $25.
describe('page example values — $6,000 at 22% APR', () => {
  it('minimums only: starts at $170, takes 20 years 9 months, costs $9,933 in interest', () => {
    const plan = simulateMinimumOnly(BALANCE, APR)
    expect(Math.round(plan.firstPayment)).toBe(170)
    expect(plan.months).toBe(249)
    expect(Math.round(plan.totalInterest)).toBe(9_933)
    expect(Math.round(plan.totalPaid)).toBe(15_933)
  })

  it('the minimum falls to $152 by month 12 and $94 by month 60', () => {
    const plan = simulateMinimumOnly(BALANCE, APR)
    expect(Math.round(plan.schedule[11].payment)).toBe(152)
    expect(Math.round(plan.schedule[59].payment)).toBe(94)
  })

  it('$200 a month: 3 years 8 months and $2,791 in interest, saving $7,142', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'fixed-payment',
      monthlyPayment: 200,
    })
    expect(c.plan.months).toBe(44)
    expect(Math.round(c.plan.totalInterest)).toBe(2_791)
    expect(Math.round(c.interestSaved)).toBe(7_142)
  })

  it('$300 a month: 2 years 2 months and $1,543 in interest', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'fixed-payment',
      monthlyPayment: 300,
    })
    expect(c.plan.months).toBe(26)
    expect(Math.round(c.plan.totalInterest)).toBe(1_543)
  })

  it('clear in 12 months: $562 a month and $739 in interest', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'target-date',
      targetMonths: 12,
    })
    expect(Math.round(c.requiredPayment)).toBe(562)
    expect(Math.round(c.plan.totalInterest)).toBe(739)
  })

  it('clear in 24 months: $311 a month and $1,470 in interest', () => {
    const c = compareCardPayoff({
      balance: BALANCE,
      apr: APR,
      mode: 'target-date',
      targetMonths: 24,
    })
    expect(Math.round(c.requiredPayment)).toBe(311)
    expect(Math.round(c.plan.totalInterest)).toBe(1_470)
  })

  it('a $110 payment exactly matches month one interest and never clears', () => {
    expect(BALANCE * (APR / 100 / 12)).toBeCloseTo(110, 6)
    expect(simulateFixedPayment(BALANCE, APR, 110).neverPaysOff).toBe(true)
  })

  it('balance transfer comparison: $343 a month clears the 22% card in 22 months for $1,300', () => {
    // A 3% transfer fee on $6,000 is $180, so $6,180 over 18 months is $343.33 a month.
    expect(6_000 * 0.03).toBe(180)
    expect(6_180 / 18).toBeCloseTo(343.33, 2)
    const plan = simulateFixedPayment(BALANCE, APR, 343.33)
    expect(plan.months).toBe(22)
    expect(Math.round(plan.totalInterest)).toBe(1_300)
  })
})

describe('page example values — $5,000 at 24% APR', () => {
  it('minimums only: 19 years 6 months and $8,887 in interest', () => {
    const plan = simulateMinimumOnly(5_000, 24)
    expect(plan.months).toBe(234)
    expect(Math.round(plan.totalInterest)).toBe(8_887)
  })

  it('$250 a month: 2 years 2 months and $1,449 in interest', () => {
    const plan = simulateFixedPayment(5_000, 24, 250)
    expect(plan.months).toBe(26)
    expect(Math.round(plan.totalInterest)).toBe(1_449)
  })
})

// ---------------------------------------------------------------------------
// article example values — every figure quoted in
// /learn/how-to-pay-off-credit-card-debt. The article's whole argument is the
// gap between a recalculated minimum and the same amount held fixed, so these
// pin both sides of that comparison.
// ---------------------------------------------------------------------------

describe('article example values — how-to-pay-off-credit-card-debt', () => {
  it('$5,000 at 24%: minimum-only takes 234 months and costs $8,887', () => {
    const r = simulateMinimumOnly(5_000, 24)
    expect(r.months).toBe(234)
    expect(r.totalInterest).toBeCloseTo(8_887, -1)
    expect(r.firstPayment).toBeCloseTo(150, 2)
  })

  it('$5,000 at 24%: the same $150 held fixed takes 56 months and costs $3,322', () => {
    const r = simulateFixedPayment(5_000, 24, 150)
    expect(r.months).toBe(56)
    expect(r.totalInterest).toBeCloseTo(3_322, -1)
  })

  it('$5,000 at 24%: letting the minimum shrink costs $5,565 and ~15 years', () => {
    const shrinking = simulateMinimumOnly(5_000, 24)
    const fixed = simulateFixedPayment(5_000, 24, 150)
    expect(shrinking.totalInterest - fixed.totalInterest).toBeCloseTo(5_565, -1)
    expect(shrinking.months - fixed.months).toBe(178)
  })

  it('$6,000 at 22%: minimum-only takes 249 months, costs $9,933, opens at $170', () => {
    const r = simulateMinimumOnly(6_000, 22)
    expect(r.months).toBe(249)
    expect(r.totalInterest).toBeCloseTo(9_933, -1)
    expect(r.firstPayment).toBeCloseTo(170, 2)
  })

  it('$6,000 at 22%: the payment table rows are correct', () => {
    const rows: Array<[number, number, number]> = [
      // [payment, months, totalInterest]
      [170, 58, 3_746],
      [200, 44, 2_791],
      [250, 32, 1_979],
      [300, 26, 1_543],
    ]
    for (const [payment, months, interest] of rows) {
      const r = simulateFixedPayment(6_000, 22, payment)
      expect(r.months, `payment ${payment} months`).toBe(months)
      expect(r.totalInterest, `payment ${payment} interest`).toBeCloseTo(interest, -1)
    }
  })

  it('$6,000 at 22%: holding $170 fixed saves $6,187 over the shrinking minimum', () => {
    const shrinking = simulateMinimumOnly(6_000, 22)
    const fixed = simulateFixedPayment(6_000, 22, 170)
    expect(shrinking.totalInterest - fixed.totalInterest).toBeCloseTo(6_187, -1)
  })

  it('$6,000 at 22%: moving $170 to $200 saves a further $955 and 14 months', () => {
    const at170 = simulateFixedPayment(6_000, 22, 170)
    const at200 = simulateFixedPayment(6_000, 22, 200)
    expect(at170.totalInterest - at200.totalInterest).toBeCloseTo(955, -1)
    expect(at170.months - at200.months).toBe(14)
  })
})
