import { describe, it, expect } from 'vitest'
import { calculateAmortization } from '../amortization'

// Standard test case: $250,000 at 6.5% for 30 years
// Expected monthly payment (P&I): ~$1,580.17
const PRINCIPAL = 250_000
const RATE = 6.5
const TERM = 360

describe('calculateAmortization — basic', () => {
  it('calculates the correct monthly payment', () => {
    const { monthlyPayment } = calculateAmortization(PRINCIPAL, RATE, TERM)
    expect(monthlyPayment).toBeCloseTo(1580.17, 0)
  })

  it('produces the correct number of payments', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM)
    expect(schedule.length).toBe(TERM)
  })

  it('balance reaches zero at end of term', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0)
  })

  it('total payment equals sum of all schedule payments', () => {
    const result = calculateAmortization(PRINCIPAL, RATE, TERM)
    const sum = result.schedule.reduce((s, r) => s + r.paymentAmount, 0)
    expect(result.totalPayment).toBeCloseTo(sum, 1)
  })

  it('total interest equals total payment minus principal', () => {
    const { totalPayment, totalInterest } = calculateAmortization(PRINCIPAL, RATE, TERM)
    expect(totalInterest).toBeCloseTo(totalPayment - PRINCIPAL, 1)
  })

  it('first payment is mostly interest, last is mostly principal', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM)
    const first = schedule[0]
    const last = schedule[schedule.length - 1]
    expect(first.interest).toBeGreaterThan(first.principal)
    expect(last.principal).toBeGreaterThan(last.interest)
  })

  it('each payment reduces the balance', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM)
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].balance).toBeLessThan(schedule[i - 1].balance)
    }
  })
})

describe('calculateAmortization — zero interest', () => {
  it('splits principal evenly across all payments', () => {
    const { monthlyPayment, schedule } = calculateAmortization(120_000, 0, 120)
    expect(monthlyPayment).toBeCloseTo(1000, 1)
    expect(schedule.length).toBe(120)
  })

  it('total interest is zero', () => {
    const { totalInterest } = calculateAmortization(120_000, 0, 120)
    expect(totalInterest).toBeCloseTo(0, 1)
  })
})

describe('calculateAmortization — extra monthly payments', () => {
  it('pays off earlier than the full term', () => {
    const base = calculateAmortization(PRINCIPAL, RATE, TERM)
    const withExtra = calculateAmortization(PRINCIPAL, RATE, TERM, 200)
    expect(withExtra.schedule.length).toBeLessThan(base.schedule.length)
  })

  it('saves interest compared to no extra payments', () => {
    const base = calculateAmortization(PRINCIPAL, RATE, TERM)
    const withExtra = calculateAmortization(PRINCIPAL, RATE, TERM, 200)
    expect(withExtra.totalInterest).toBeLessThan(base.totalInterest)
  })

  it('balance still reaches zero', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM, 500)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0)
  })

  it('larger extra payment = more interest saved', () => {
    const extra100 = calculateAmortization(PRINCIPAL, RATE, TERM, 100)
    const extra500 = calculateAmortization(PRINCIPAL, RATE, TERM, 500)
    expect(extra500.totalInterest).toBeLessThan(extra100.totalInterest)
  })
})

describe('calculateAmortization — extra yearly payments', () => {
  it('pays off earlier than the full term', () => {
    const base = calculateAmortization(PRINCIPAL, RATE, TERM)
    const withExtra = calculateAmortization(PRINCIPAL, RATE, TERM, 0, 5000)
    expect(withExtra.schedule.length).toBeLessThan(base.schedule.length)
  })

  it('saves interest compared to no extra payments', () => {
    const base = calculateAmortization(PRINCIPAL, RATE, TERM)
    const withExtra = calculateAmortization(PRINCIPAL, RATE, TERM, 0, 5000)
    expect(withExtra.totalInterest).toBeLessThan(base.totalInterest)
  })
})

describe('calculateAmortization — combined extra payments', () => {
  it('combined extra saves more than either alone', () => {
    const monthly = calculateAmortization(PRINCIPAL, RATE, TERM, 200, 0)
    const yearly = calculateAmortization(PRINCIPAL, RATE, TERM, 0, 2400)
    const combined = calculateAmortization(PRINCIPAL, RATE, TERM, 200, 2400)
    expect(combined.totalInterest).toBeLessThan(monthly.totalInterest)
    expect(combined.totalInterest).toBeLessThan(yearly.totalInterest)
  })

  it('balance still reaches zero', () => {
    const { schedule } = calculateAmortization(PRINCIPAL, RATE, TERM, 300, 3000)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0)
  })
})

describe('calculateAmortization — short loan', () => {
  it('handles a 12-month loan correctly', () => {
    const { schedule, totalInterest } = calculateAmortization(12_000, 5, 12)
    expect(schedule.length).toBe(12)
    expect(totalInterest).toBeGreaterThan(0)
    expect(schedule[11].balance).toBeCloseTo(0, 0)
  })
})
