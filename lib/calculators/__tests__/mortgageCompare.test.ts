import { describe, it, expect } from 'vitest'
import { computeScenario } from '../mortgageCompare'

// Standard scenario: $400k home, 20% down ($80k), 6.5% rate, 30yr, 1.2% tax, $1200 ins
const BASE = {
  principal: 320_000,
  annualRate: 6.5,
  termMonths: 360,
  homePrice: 400_000,
  propertyTaxRate: 1.2,
  annualInsurance: 1_200,
  pmiRate: 0,
  monthlyHOA: 0,
}

describe('computeScenario — monthly breakdown', () => {
  it('monthly P&I matches standard amortization formula', () => {
    const r = computeScenario(BASE)
    // $320k at 6.5% for 30yr ≈ $2,023/mo
    expect(r.monthlyPI).toBeCloseTo(2023, 0)
  })

  it('monthly tax = home price * rate / 100 / 12', () => {
    const r = computeScenario(BASE)
    expect(r.monthlyTax).toBeCloseTo((400_000 * 0.012) / 12, 1)
  })

  it('monthly insurance = annual / 12', () => {
    const r = computeScenario(BASE)
    expect(r.monthlyInsurance).toBeCloseTo(100, 1)
  })

  it('monthly PMI is zero when pmiRate is 0', () => {
    const r = computeScenario(BASE)
    expect(r.monthlyPMI).toBeCloseTo(0, 2)
  })

  it('monthly HOA is zero when not provided', () => {
    const r = computeScenario(BASE)
    expect(r.monthlyHOA).toBeCloseTo(0, 2)
  })

  it('total monthly = P&I + tax + insurance + PMI + HOA', () => {
    const r = computeScenario(BASE)
    const expected = r.monthlyPI + r.monthlyTax + r.monthlyInsurance + r.monthlyPMI + r.monthlyHOA
    expect(r.totalMonthly).toBeCloseTo(expected, 2)
  })
})

describe('computeScenario — PMI', () => {
  it('PMI is charged when pmiRate > 0', () => {
    const r = computeScenario({ ...BASE, pmiRate: 0.5 })
    // 0.5% of $320k / 12 ≈ $133/mo
    expect(r.monthlyPMI).toBeCloseTo((320_000 * 0.005) / 12, 0)
  })

  it('PMI increases total monthly payment', () => {
    const noPMI = computeScenario(BASE)
    const withPMI = computeScenario({ ...BASE, pmiRate: 0.5 })
    expect(withPMI.totalMonthly).toBeGreaterThan(noPMI.totalMonthly)
  })
})

describe('computeScenario — HOA', () => {
  it('HOA is included in total monthly', () => {
    const nHOA = computeScenario(BASE)
    const wHOA = computeScenario({ ...BASE, monthlyHOA: 300 })
    expect(wHOA.totalMonthly - nHOA.totalMonthly).toBeCloseTo(300, 1)
    expect(wHOA.monthlyHOA).toBeCloseTo(300, 1)
  })
})

describe('computeScenario — totals', () => {
  it('total paid = principal + total interest', () => {
    const r = computeScenario(BASE)
    expect(r.totalPaid).toBeCloseTo(r.totalInterest + BASE.principal, 0)
  })

  it('actual months matches a 30yr loan without extra payments', () => {
    const r = computeScenario(BASE)
    expect(r.actualMonths).toBe(360)
  })

  it('no extra payments: interestSaved and monthsSaved are undefined', () => {
    const r = computeScenario(BASE)
    expect(r.interestSaved).toBeUndefined()
    expect(r.monthsSaved).toBeUndefined()
  })
})

describe('computeScenario — balances', () => {
  it('returns a balance array of length equal to actualMonths', () => {
    const r = computeScenario(BASE)
    expect(r.balances.length).toBe(r.actualMonths)
  })

  it('final balance is approximately zero', () => {
    const r = computeScenario(BASE)
    expect(r.balances[r.balances.length - 1]).toBeCloseTo(0, 0)
  })

  it('balance decreases monotonically', () => {
    const r = computeScenario(BASE)
    for (let i = 1; i < r.balances.length; i++) {
      expect(r.balances[i]).toBeLessThan(r.balances[i - 1])
    }
  })
})

describe('computeScenario — extra payments', () => {
  it('extra monthly payments save interest', () => {
    const base = computeScenario(BASE)
    const withExtra = computeScenario({ ...BASE, extraMonthly: 300 })
    expect(withExtra.totalInterest).toBeLessThan(base.totalInterest)
  })

  it('extra monthly payments shorten the loan', () => {
    const base = computeScenario(BASE)
    const withExtra = computeScenario({ ...BASE, extraMonthly: 300 })
    expect(withExtra.actualMonths).toBeLessThan(base.actualMonths)
  })

  it('interestSaved is positive with extra payments', () => {
    const r = computeScenario({ ...BASE, extraMonthly: 300 })
    expect(r.interestSaved).toBeDefined()
    expect(r.interestSaved!).toBeGreaterThan(0)
  })

  it('monthsSaved is positive with extra payments', () => {
    const r = computeScenario({ ...BASE, extraMonthly: 300 })
    expect(r.monthsSaved).toBeDefined()
    expect(r.monthsSaved!).toBeGreaterThan(0)
  })

  it('larger extra payment saves more interest', () => {
    const extra200 = computeScenario({ ...BASE, extraMonthly: 200 })
    const extra500 = computeScenario({ ...BASE, extraMonthly: 500 })
    expect(extra500.totalInterest).toBeLessThan(extra200.totalInterest)
  })
})

describe('computeScenario — different rates and terms', () => {
  it('higher rate = more total interest', () => {
    const low = computeScenario(BASE)
    const high = computeScenario({ ...BASE, annualRate: 8 })
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest)
  })

  it('15yr loan has lower total interest than 30yr at same rate', () => {
    const yr30 = computeScenario(BASE)
    const yr15 = computeScenario({ ...BASE, termMonths: 180 })
    expect(yr15.totalInterest).toBeLessThan(yr30.totalInterest)
  })

  it('15yr loan has higher monthly P&I than 30yr', () => {
    const yr30 = computeScenario(BASE)
    const yr15 = computeScenario({ ...BASE, termMonths: 180 })
    expect(yr15.monthlyPI).toBeGreaterThan(yr30.monthlyPI)
  })
})

describe('computeScenario — zero interest rate', () => {
  it('total interest is zero', () => {
    const r = computeScenario({ ...BASE, annualRate: 0 })
    expect(r.totalInterest).toBeCloseTo(0, 1)
  })

  it('total paid equals principal', () => {
    const r = computeScenario({ ...BASE, annualRate: 0 })
    expect(r.totalPaid).toBeCloseTo(BASE.principal, 0)
  })
})

// ---------------------------------------------------------------------------
// page example values — every figure quoted in the /calculators/mortgage/compare
// FAQ prose. If one of these fails, the page copy is wrong, not the engine.
// ---------------------------------------------------------------------------

const NO_ESCROW = {
  homePrice: 0,
  propertyTaxRate: 0,
  annualInsurance: 0,
  pmiRate: 0,
  monthlyHOA: 0,
}

describe('page example values — /calculators/mortgage/compare FAQs', () => {
  it('FAQ 1: $300k 30yr at 7% is $1,996/mo and $418,527 interest', () => {
    const r = computeScenario({
      ...NO_ESCROW,
      principal: 300_000,
      annualRate: 7,
      termMonths: 360,
    })
    expect(r.monthlyPI).toBeCloseTo(1996, 0)
    expect(r.totalInterest).toBeCloseTo(418_527, -1)
  })

  it('FAQ 1: $300k 15yr at 6.375% is $2,593/mo and $166,695 interest', () => {
    const r = computeScenario({
      ...NO_ESCROW,
      principal: 300_000,
      annualRate: 6.375,
      termMonths: 180,
    })
    expect(r.monthlyPI).toBeCloseTo(2593, 0)
    expect(r.totalInterest).toBeCloseTo(166_695, -1)
  })

  it('FAQ 1: the 15yr costs ~$597 more per month and saves ~$251,800', () => {
    const yr30 = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 7, termMonths: 360,
    })
    const yr15 = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 6.375, termMonths: 180,
    })
    expect(yr15.monthlyPI - yr30.monthlyPI).toBeCloseTo(597, 0)
    expect(yr30.totalInterest - yr15.totalInterest).toBeCloseTo(251_800, -2)
  })

  it('FAQ 2: at the same rate a 15yr costs about 44% of the 30yr interest', () => {
    const yr30 = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 7, termMonths: 360,
    })
    const yr15 = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 7, termMonths: 180,
    })
    const ratio = yr15.totalInterest / yr30.totalInterest
    expect(ratio).toBeGreaterThan(0.43)
    expect(ratio).toBeLessThan(0.45)
  })

  it('FAQ 3: a quarter point on $300k 30yr costs ~$50/mo and ~$17,850 total', () => {
    const lo = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 6.5, termMonths: 360,
    })
    const hi = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 6.75, termMonths: 360,
    })
    expect(lo.monthlyPI).toBeCloseTo(1896.2, 1)
    expect(hi.monthlyPI).toBeCloseTo(1945.79, 1)
    expect(hi.totalInterest - lo.totalInterest).toBeCloseTo(17_850, -2)
  })

  it('FAQ 3: the same quarter point on $400k costs ~$66/mo and ~$23,800 total', () => {
    const lo = computeScenario({
      ...NO_ESCROW, principal: 400_000, annualRate: 6.5, termMonths: 360,
    })
    const hi = computeScenario({
      ...NO_ESCROW, principal: 400_000, annualRate: 6.75, termMonths: 360,
    })
    expect(hi.monthlyPI - lo.monthlyPI).toBeCloseTo(66, 0)
    expect(hi.totalInterest - lo.totalInterest).toBeCloseTo(23_800, -2)
  })

  it('FAQ 4: $350k at 6% for 30yr is $2,098.43/mo, $755,434 paid, $405,434 interest', () => {
    const r = computeScenario({
      ...NO_ESCROW, principal: 350_000, annualRate: 6, termMonths: 360,
    })
    expect(r.monthlyPI).toBeCloseTo(2098.43, 2)
    expect(r.totalPaid).toBeCloseTo(755_434, -1)
    expect(r.totalInterest).toBeCloseTo(405_434, -1)
  })

  it('FAQ 8: $300k at 7% over 30yr totals $718,528 in P&I payments', () => {
    const r = computeScenario({
      ...NO_ESCROW, principal: 300_000, annualRate: 7, termMonths: 360,
    })
    expect(r.monthlyPI).toBeCloseTo(1995.91, 2)
    expect(r.monthlyPI * 360).toBeCloseTo(718_528, -2)
    // plus the $60,000 down payment on a $360,000 home
    expect(r.monthlyPI * 360 + 60_000).toBeCloseTo(778_528, -2)
  })
})
