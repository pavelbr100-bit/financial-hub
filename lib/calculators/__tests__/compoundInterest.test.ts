import { describe, it, expect } from 'vitest'
import { calculateCompoundInterest } from '../compoundInterest'

const BASE = {
  principal: 10_000,
  monthlyContribution: 0,
  annualRate: 7,
  compoundingFrequency: 'monthly' as const,
  years: 10,
}

describe('calculateCompoundInterest — basic invariants', () => {
  it('finalBalance equals totalContributions + totalInterestEarned', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.finalBalance).toBeCloseTo(r.totalContributions + r.totalInterestEarned, 1)
  })

  it('totalContributions equals principal when no monthly contribution', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.totalContributions).toBeCloseTo(BASE.principal, 1)
  })

  it('produces yearly snapshots equal to the number of years', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.yearlyData.length).toBe(BASE.years)
  })

  it('year labels are 1 through N', () => {
    const r = calculateCompoundInterest(BASE)
    r.yearlyData.forEach((snap, i) => expect(snap.year).toBe(i + 1))
  })

  it('balance in each yearly snapshot is positive and growing', () => {
    const r = calculateCompoundInterest(BASE)
    for (let i = 1; i < r.yearlyData.length; i++) {
      expect(r.yearlyData[i].balance).toBeGreaterThan(r.yearlyData[i - 1].balance)
    }
  })

  it('last snapshot balance matches finalBalance', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.yearlyData[r.yearlyData.length - 1].balance).toBeCloseTo(r.finalBalance, 1)
  })

  it('totalInterestEarned is positive', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.totalInterestEarned).toBeGreaterThan(0)
  })
})

describe('calculateCompoundInterest — known values', () => {
  it('$10k at 7% monthly compounding for 10 years ≈ $20,097', () => {
    const r = calculateCompoundInterest(BASE)
    expect(r.finalBalance).toBeCloseTo(20_097, -1)
  })

  it('$10k at 7% monthly compounding for 30 years ≈ $81,165', () => {
    const r = calculateCompoundInterest({ ...BASE, years: 30 })
    expect(r.finalBalance).toBeCloseTo(81_165, -1)
  })
})

describe('calculateCompoundInterest — zero interest rate', () => {
  it('finalBalance equals principal with no contributions and 0% rate', () => {
    const r = calculateCompoundInterest({ ...BASE, annualRate: 0 })
    expect(r.finalBalance).toBeCloseTo(BASE.principal, 1)
  })

  it('totalInterestEarned is zero', () => {
    const r = calculateCompoundInterest({ ...BASE, annualRate: 0 })
    expect(r.totalInterestEarned).toBeCloseTo(0, 1)
  })

  it('with monthly contributions at 0% rate: balance = principal + contributions', () => {
    const r = calculateCompoundInterest({ ...BASE, annualRate: 0, monthlyContribution: 500 })
    const expected = BASE.principal + 500 * BASE.years * 12
    expect(r.finalBalance).toBeCloseTo(expected, 0)
  })
})

describe('calculateCompoundInterest — monthly contributions', () => {
  it('final balance is higher with monthly contributions', () => {
    const noContrib = calculateCompoundInterest(BASE)
    const withContrib = calculateCompoundInterest({ ...BASE, monthlyContribution: 200 })
    expect(withContrib.finalBalance).toBeGreaterThan(noContrib.finalBalance)
  })

  it('totalContributions = principal + monthlyContribution * months', () => {
    const r = calculateCompoundInterest({ ...BASE, monthlyContribution: 200 })
    const expected = BASE.principal + 200 * BASE.years * 12
    expect(r.totalContributions).toBeCloseTo(expected, 1)
  })

  it('higher contribution = higher final balance', () => {
    const low = calculateCompoundInterest({ ...BASE, monthlyContribution: 100 })
    const high = calculateCompoundInterest({ ...BASE, monthlyContribution: 500 })
    expect(high.finalBalance).toBeGreaterThan(low.finalBalance)
  })

  it('interest earned still equals balance minus contributions', () => {
    const r = calculateCompoundInterest({ ...BASE, monthlyContribution: 300 })
    expect(r.totalInterestEarned).toBeCloseTo(r.finalBalance - r.totalContributions, 1)
  })
})

describe('calculateCompoundInterest — compounding frequency', () => {
  it('daily compounding yields more than annual compounding', () => {
    const daily = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'daily' })
    const annual = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'annually' })
    expect(daily.finalBalance).toBeGreaterThan(annual.finalBalance)
  })

  it('monthly compounding yields more than quarterly', () => {
    const monthly = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'monthly' })
    const quarterly = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'quarterly' })
    expect(monthly.finalBalance).toBeGreaterThan(quarterly.finalBalance)
  })

  it('quarterly compounding yields more than annual', () => {
    const quarterly = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'quarterly' })
    const annual = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'annually' })
    expect(quarterly.finalBalance).toBeGreaterThan(annual.finalBalance)
  })

  it('ordering: daily > monthly > quarterly > annually', () => {
    const daily = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'daily' })
    const monthly = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'monthly' })
    const quarterly = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'quarterly' })
    const annual = calculateCompoundInterest({ ...BASE, compoundingFrequency: 'annually' })
    expect(daily.finalBalance).toBeGreaterThan(monthly.finalBalance)
    expect(monthly.finalBalance).toBeGreaterThan(quarterly.finalBalance)
    expect(quarterly.finalBalance).toBeGreaterThan(annual.finalBalance)
  })
})

describe('calculateCompoundInterest — time', () => {
  it('longer investment period yields higher balance', () => {
    const short = calculateCompoundInterest({ ...BASE, years: 10 })
    const long = calculateCompoundInterest({ ...BASE, years: 30 })
    expect(long.finalBalance).toBeGreaterThan(short.finalBalance)
  })

  it('1-year investment produces 1 snapshot', () => {
    const r = calculateCompoundInterest({ ...BASE, years: 1 })
    expect(r.yearlyData.length).toBe(1)
  })
})
