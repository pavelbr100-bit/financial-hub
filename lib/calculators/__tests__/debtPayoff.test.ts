import { describe, it, expect } from 'vitest'
import { calculateDebtPayoff, type Debt } from '../debtPayoff'

const DEBTS: Debt[] = [
  { id: 'cc1', name: 'Credit Card', balance: 5_000, rate: 22, minPayment: 100 },
  { id: 'car',  name: 'Car Loan',   balance: 8_000, rate: 7,  minPayment: 200 },
  { id: 'stu',  name: 'Student',    balance: 3_000, rate: 14, minPayment: 60  },
]

describe('calculateDebtPayoff — basic', () => {
  it('pays off all debts within a reasonable timeframe', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.payoffMonths).toBeGreaterThan(0)
    expect(r.payoffMonths).toBeLessThan(600)
  })

  it('totalInterest is positive', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.totalInterest).toBeGreaterThan(0)
  })

  it('returns a result entry for every debt', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.debtResults.length).toBe(DEBTS.length)
  })

  it('all debts have a paidOffMonth > 0', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    r.debtResults.forEach(d => expect(d.paidOffMonth).toBeGreaterThan(0))
  })

  it('interestSaved and monthsSaved are undefined when no extra payment', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.interestSaved).toBeUndefined()
    expect(r.monthsSaved).toBeUndefined()
  })

  it('monthlyData is non-empty', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.monthlyData.length).toBeGreaterThan(0)
  })
})

describe('calculateDebtPayoff — avalanche strategy', () => {
  it('highest-rate debt is paid off first', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 200, strategy: 'avalanche' })
    const cc = r.debtResults.find(d => d.id === 'cc1')!  // 22% — highest rate
    const car = r.debtResults.find(d => d.id === 'car')! // 7%
    expect(cc.paidOffMonth).toBeLessThan(car.paidOffMonth)
  })

  it('avalanche minimises total interest across strategies', () => {
    const avalanche = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'avalanche' })
    const snowball  = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0, strategy: 'snowball' })
    expect(avalanche.totalInterest).toBeLessThanOrEqual(snowball.totalInterest)
  })
})

describe('calculateDebtPayoff — snowball strategy', () => {
  it('smallest-balance debt is paid off first', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 200, strategy: 'snowball' })
    const stu = r.debtResults.find(d => d.id === 'stu')! // $3k — smallest
    const car = r.debtResults.find(d => d.id === 'car')! // $8k
    expect(stu.paidOffMonth).toBeLessThan(car.paidOffMonth)
  })
})

describe('calculateDebtPayoff — extra payments', () => {
  it('extra payments reduce total interest', () => {
    const base  = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0,   strategy: 'avalanche' })
    const extra = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 300, strategy: 'avalanche' })
    expect(extra.totalInterest).toBeLessThan(base.totalInterest)
  })

  it('extra payments shorten payoff period', () => {
    const base  = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 0,   strategy: 'avalanche' })
    const extra = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 300, strategy: 'avalanche' })
    expect(extra.payoffMonths).toBeLessThan(base.payoffMonths)
  })

  it('interestSaved is positive with extra payments', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 300, strategy: 'avalanche' })
    expect(r.interestSaved).toBeDefined()
    expect(r.interestSaved!).toBeGreaterThan(0)
  })

  it('monthsSaved is positive with extra payments', () => {
    const r = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 300, strategy: 'avalanche' })
    expect(r.monthsSaved).toBeDefined()
    expect(r.monthsSaved!).toBeGreaterThan(0)
  })

  it('larger extra payment saves more interest', () => {
    const low  = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 100, strategy: 'avalanche' })
    const high = calculateDebtPayoff({ debts: DEBTS, extraMonthly: 500, strategy: 'avalanche' })
    expect(high.totalInterest).toBeLessThan(low.totalInterest)
  })
})

describe('calculateDebtPayoff — single debt', () => {
  const single: Debt[] = [
    { id: 'd1', name: 'Card', balance: 2_000, rate: 18, minPayment: 50 },
  ]

  it('pays off single debt', () => {
    const r = calculateDebtPayoff({ debts: single, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.payoffMonths).toBeGreaterThan(0)
    expect(r.debtResults[0].paidOffMonth).toBeGreaterThan(0)
  })

  it('extra payment shortens payoff for single debt', () => {
    const base  = calculateDebtPayoff({ debts: single, extraMonthly: 0,   strategy: 'avalanche' })
    const extra = calculateDebtPayoff({ debts: single, extraMonthly: 100, strategy: 'avalanche' })
    expect(extra.payoffMonths).toBeLessThan(base.payoffMonths)
  })
})

describe('calculateDebtPayoff — article example values', () => {
  it('single debt $5k@22% with $200/month → 34 months, ~$1,750 interest', () => {
    const r = calculateDebtPayoff({
      debts: [{ id: 'cc', name: 'CC', balance: 5000, rate: 22, minPayment: 200 }],
      extraMonthly: 0,
      strategy: 'avalanche',
    })
    expect(r.payoffMonths).toBe(34)
    expect(r.totalInterest).toBeCloseTo(1749.88, 0)
  })

  it('single debt $5k@22% with $300/month → 21 months, ~$1,022 interest', () => {
    const r = calculateDebtPayoff({
      debts: [{ id: 'cc', name: 'CC', balance: 5000, rate: 22, minPayment: 300 }],
      extraMonthly: 0,
      strategy: 'avalanche',
    })
    expect(r.payoffMonths).toBe(21)
    expect(r.totalInterest).toBeCloseTo(1021.60, 0)
  })

  it('3-debt avalanche: $8k@22%+$5k@7%+$12k@5%, mins 160+100+120, extra $500 → 33 months, ~$2,813 interest', () => {
    const debts: Debt[] = [
      { id: 'cc', name: 'CC', balance: 8000, rate: 22, minPayment: 160 },
      { id: 'car', name: 'Car', balance: 5000, rate: 7, minPayment: 100 },
      { id: 'stu', name: 'Student', balance: 12000, rate: 5, minPayment: 120 },
    ]
    const r = calculateDebtPayoff({ debts, extraMonthly: 500, strategy: 'avalanche' })
    expect(r.payoffMonths).toBe(33)
    expect(r.totalInterest).toBeCloseTo(2812.99, 0)
  })

  it('3-debt snowball: $8k@22%+$5k@7%+$12k@5%, mins 160+100+120, extra $500 → 34 months, ~$3,669 interest', () => {
    const debts: Debt[] = [
      { id: 'cc', name: 'CC', balance: 8000, rate: 22, minPayment: 160 },
      { id: 'car', name: 'Car', balance: 5000, rate: 7, minPayment: 100 },
      { id: 'stu', name: 'Student', balance: 12000, rate: 5, minPayment: 120 },
    ]
    const r = calculateDebtPayoff({ debts, extraMonthly: 500, strategy: 'snowball' })
    expect(r.payoffMonths).toBe(34)
    expect(r.totalInterest).toBeCloseTo(3668.96, 0)
  })

  it('Marcus avalanche: $6k@22%+$2.5k@10%+$9k@6%, total $525/month → 39 months, ~$2,574 interest, CC paid off month 13', () => {
    const debts: Debt[] = [
      { id: 'cc', name: 'CC', balance: 6000, rate: 22, minPayment: 0 },
      { id: 'pl', name: 'PL', balance: 2500, rate: 10, minPayment: 0 },
      { id: 'car', name: 'Car', balance: 9000, rate: 6, minPayment: 0 },
    ]
    const r = calculateDebtPayoff({ debts, extraMonthly: 525, strategy: 'avalanche' })
    expect(r.payoffMonths).toBe(39)
    expect(r.totalInterest).toBeCloseTo(2573.83, 0)
    expect(r.debtResults.find(d => d.id === 'cc')!.paidOffMonth).toBe(13)
  })

  it('Marcus snowball: $6k@22%+$2.5k@10%+$9k@6%, total $525/month → 40 months, ~$3,068 interest, PL paid off month 5', () => {
    const debts: Debt[] = [
      { id: 'cc', name: 'CC', balance: 6000, rate: 22, minPayment: 0 },
      { id: 'pl', name: 'PL', balance: 2500, rate: 10, minPayment: 0 },
      { id: 'car', name: 'Car', balance: 9000, rate: 6, minPayment: 0 },
    ]
    const r = calculateDebtPayoff({ debts, extraMonthly: 525, strategy: 'snowball' })
    expect(r.payoffMonths).toBe(40)
    expect(r.totalInterest).toBeCloseTo(3068.20, 0)
    expect(r.debtResults.find(d => d.id === 'pl')!.paidOffMonth).toBe(5)
  })
})

describe('calculateDebtPayoff — zero rate debt', () => {
  const zeroRate: Debt[] = [
    { id: 'z', name: 'Interest-free', balance: 1_200, rate: 0, minPayment: 100 },
  ]

  it('pays off in exactly 12 months with no extra', () => {
    const r = calculateDebtPayoff({ debts: zeroRate, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.payoffMonths).toBe(12)
  })

  it('total interest is zero', () => {
    const r = calculateDebtPayoff({ debts: zeroRate, extraMonthly: 0, strategy: 'avalanche' })
    expect(r.totalInterest).toBeCloseTo(0, 1)
  })
})
