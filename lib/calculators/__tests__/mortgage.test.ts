import { describe, it, expect } from 'vitest'
import { buildSchedule } from '../mortgage'

// Standard test case: $400k home, 20% down → $320k loan at 6.5% for 30 years
const PRINCIPAL = 320_000
const RATE = 6.5
const TERM = 360

describe('buildSchedule — basic', () => {
  it('calculates the correct monthly P&I payment', () => {
    const { monthlyPI } = buildSchedule(PRINCIPAL, RATE, TERM)
    expect(monthlyPI).toBeCloseTo(2022.62, 0)
  })

  it('produces the correct number of payments', () => {
    const { schedule } = buildSchedule(PRINCIPAL, RATE, TERM)
    expect(schedule.length).toBe(TERM)
  })

  it('balance reaches zero at end of term', () => {
    const { schedule } = buildSchedule(PRINCIPAL, RATE, TERM)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0)
  })

  it('totalInterest equals the sum of interest in every schedule row', () => {
    const { schedule, totalInterest } = buildSchedule(PRINCIPAL, RATE, TERM)
    const summed = schedule.reduce((s, r) => s + r.interest, 0)
    // This is the invariant that the bug violated — the component used
    // monthlyPI * termMonths - principal instead of summing the schedule.
    expect(totalInterest).toBeCloseTo(summed, 1)
  })

  it('totalInterest is positive', () => {
    const { totalInterest } = buildSchedule(PRINCIPAL, RATE, TERM)
    // On a 30-year loan at 6.5%, total interest exceeds the principal — that is correct
    expect(totalInterest).toBeGreaterThan(0)
  })
})

describe('buildSchedule — extra monthly payments', () => {
  it('pays off earlier than the full term', () => {
    const base = buildSchedule(PRINCIPAL, RATE, TERM)
    const withExtra = buildSchedule(PRINCIPAL, RATE, TERM, 300)
    expect(withExtra.schedule.length).toBeLessThan(base.schedule.length)
  })

  it('totalInterest is LESS than without extra payments', () => {
    // This is the exact test that would have caught the bug.
    // The buggy formula (monthlyPI * termMonths - principal) returns the same
    // value regardless of extra payments, so interestSaved would be 0.
    const base = buildSchedule(PRINCIPAL, RATE, TERM)
    const withExtra = buildSchedule(PRINCIPAL, RATE, TERM, 300)
    expect(withExtra.totalInterest).toBeLessThan(base.totalInterest)
  })

  it('totalInterest still equals sum of schedule interest rows', () => {
    const { schedule, totalInterest } = buildSchedule(PRINCIPAL, RATE, TERM, 300)
    const summed = schedule.reduce((s, r) => s + r.interest, 0)
    expect(totalInterest).toBeCloseTo(summed, 1)
  })

  it('interest saved is positive and meaningful', () => {
    const base = buildSchedule(PRINCIPAL, RATE, TERM)
    const withExtra = buildSchedule(PRINCIPAL, RATE, TERM, 300)
    const interestSaved = base.totalInterest - withExtra.totalInterest
    expect(interestSaved).toBeGreaterThan(10_000)
  })

  it('larger extra payment saves more interest', () => {
    const extra200 = buildSchedule(PRINCIPAL, RATE, TERM, 200)
    const extra600 = buildSchedule(PRINCIPAL, RATE, TERM, 600)
    expect(extra600.totalInterest).toBeLessThan(extra200.totalInterest)
  })

  it('balance still reaches zero', () => {
    const { schedule } = buildSchedule(PRINCIPAL, RATE, TERM, 500)
    expect(schedule[schedule.length - 1].balance).toBeCloseTo(0, 0)
  })
})

describe('buildSchedule — extra yearly payments', () => {
  it('totalInterest is less than without extra payments', () => {
    const base = buildSchedule(PRINCIPAL, RATE, TERM)
    const withExtra = buildSchedule(PRINCIPAL, RATE, TERM, 0, 5000)
    expect(withExtra.totalInterest).toBeLessThan(base.totalInterest)
  })

  it('totalInterest still equals sum of schedule interest rows', () => {
    const { schedule, totalInterest } = buildSchedule(PRINCIPAL, RATE, TERM, 0, 5000)
    const summed = schedule.reduce((s, r) => s + r.interest, 0)
    expect(totalInterest).toBeCloseTo(summed, 1)
  })
})

describe('buildSchedule — zero interest', () => {
  it('splits principal evenly and charges zero interest', () => {
    const { monthlyPI, totalInterest } = buildSchedule(120_000, 0, 120)
    expect(monthlyPI).toBeCloseTo(1000, 1)
    expect(totalInterest).toBeCloseTo(0, 1)
  })
})
