import { describe, it, expect } from 'vitest'
import { calculateDebtPayoff, type Debt } from '../debtPayoff'

/**
 * The avalanche page reuses the shared multi-debt engine (debtPayoff.ts); this
 * file pins only the figures quoted in
 * app/calculators/debt-avalanche/page.tsx. Engine behaviour itself is covered by
 * debtPayoff.test.ts.
 *
 * The example is chosen so the two orderings genuinely differ: the smallest
 * balance carries the lowest rate, so snowball and avalanche disagree about what
 * to attack first.
 */
const debts: Debt[] = [
  { id: 'medical', name: 'Medical bill', balance: 2_000, rate: 5, minPayment: 50 },
  { id: 'card', name: 'Credit card', balance: 9_000, rate: 24, minPayment: 180 },
  { id: 'car', name: 'Car loan', balance: 14_000, rate: 7, minPayment: 330 },
]

const EXTRA = 300

const avalanche = () =>
  calculateDebtPayoff({ debts, extraMonthly: EXTRA, strategy: 'avalanche' })
const snowball = () => calculateDebtPayoff({ debts, extraMonthly: EXTRA, strategy: 'snowball' })

function paidOff(result: ReturnType<typeof avalanche>, id: string) {
  return result.debtResults.find((d) => d.id === id)!.paidOffMonth
}

describe('page example values — $25,000 across three debts, $300 extra a month', () => {
  it('the debts total $25,000 with $560 in minimum payments', () => {
    expect(debts.reduce((s, d) => s + d.balance, 0)).toBe(25_000)
    expect(debts.reduce((s, d) => s + d.minPayment, 0)).toBe(560)
  })

  it('avalanche: debt free in 35 months having paid $4,360 in interest', () => {
    const r = avalanche()
    expect(r.payoffMonths).toBe(35)
    expect(Math.round(r.totalInterest)).toBe(4_360)
  })

  it('snowball: debt free in 36 months having paid $5,066 in interest', () => {
    const r = snowball()
    expect(r.payoffMonths).toBe(36)
    expect(Math.round(r.totalInterest)).toBe(5_066)
  })

  it('avalanche saves $706 and one month against snowball', () => {
    const a = avalanche()
    const s = snowball()
    expect(Math.round(s.totalInterest - a.totalInterest)).toBe(706)
    expect(s.payoffMonths - a.payoffMonths).toBe(1)
  })

  it('avalanche clears the 24% card first, at month 24', () => {
    const r = avalanche()
    expect(paidOff(r, 'card')).toBe(24)
    expect(paidOff(r, 'car')).toBe(34)
    expect(paidOff(r, 'medical')).toBe(35)
  })

  it('snowball clears its first debt at month 6 — 18 months sooner than avalanche', () => {
    const s = snowball()
    expect(paidOff(s, 'medical')).toBe(6)
    expect(paidOff(s, 'card')).toBe(27)
    expect(paidOff(s, 'car')).toBe(36)
    // The behavioural tradeoff the page describes
    expect(paidOff(avalanche(), 'card') - paidOff(s, 'medical')).toBe(18)
  })

  it('with $200 extra instead of $300, avalanche saves $831', () => {
    const a = calculateDebtPayoff({ debts, extraMonthly: 200, strategy: 'avalanche' })
    const s = calculateDebtPayoff({ debts, extraMonthly: 200, strategy: 'snowball' })
    expect(Math.round(s.totalInterest - a.totalInterest)).toBe(831)
  })

  it('paying only minimums, the gap shrinks to $108 and 68 vs 69 months', () => {
    const a = calculateDebtPayoff({ debts, extraMonthly: 0, strategy: 'avalanche' })
    const s = calculateDebtPayoff({ debts, extraMonthly: 0, strategy: 'snowball' })
    expect(a.payoffMonths).toBe(68)
    expect(s.payoffMonths).toBe(69)
    expect(Math.round(s.totalInterest - a.totalInterest)).toBe(108)
  })

  it('the two methods agree whenever the smallest balance is also the highest rate', () => {
    const aligned: Debt[] = [
      { id: 'a', name: 'Store card', balance: 2_500, rate: 27, minPayment: 60 },
      { id: 'b', name: 'Credit card', balance: 8_000, rate: 22, minPayment: 160 },
      { id: 'c', name: 'Car loan', balance: 12_000, rate: 6, minPayment: 290 },
    ]
    const a = calculateDebtPayoff({ debts: aligned, extraMonthly: EXTRA, strategy: 'avalanche' })
    const s = calculateDebtPayoff({ debts: aligned, extraMonthly: EXTRA, strategy: 'snowball' })
    expect(a.totalInterest).toBeCloseTo(s.totalInterest, 6)
    expect(a.payoffMonths).toBe(s.payoffMonths)
  })
})
