import { describe, it, expect } from 'vitest'
import { compareRentVsBuy, type RentVsBuyInput } from '../rentVsBuy'
import { buildSchedule } from '../mortgage'

// Standard test case: $400,000 home at 6.5% with 20% down, against $2,200 rent
const base: RentVsBuyInput = {
  homePrice: 400_000,
  downPaymentPercent: 20,
  mortgageRate: 6.5,
  mortgageTermYears: 30,
  closingCostPercent: 3,
  propertyTaxRate: 1.1,
  homeInsuranceRate: 0.5,
  maintenanceRate: 1,
  hoaMonthly: 0,
  homeAppreciation: 3,
  sellingCostPercent: 6,
  monthlyRent: 2_200,
  rentGrowth: 3,
  rentersInsuranceMonthly: 15,
  investmentReturn: 6,
  years: 10,
}

describe('compareRentVsBuy — structure', () => {
  it('returns one row per year', () => {
    expect(compareRentVsBuy(base).years).toHaveLength(10)
    expect(compareRentVsBuy({ ...base, years: 30 }).years).toHaveLength(30)
  })

  it('charges the buyer the down payment plus closing costs upfront', () => {
    const r = compareRentVsBuy(base)
    expect(r.upfrontCost).toBe(400_000 * 0.2 + 400_000 * 0.03)
    expect(r.upfrontCost).toBe(92_000)
  })

  it('seeds the renter portfolio with exactly what the buyer paid upfront', () => {
    // One month at 0% return, 0% appreciation, and identical housing costs:
    // the renter should hold precisely the upfront cash.
    const r = compareRentVsBuy({
      ...base,
      years: 1 / 12,
      investmentReturn: 0,
      propertyTaxRate: 0,
      homeInsuranceRate: 0,
      maintenanceRate: 0,
      homeAppreciation: 0,
      rentersInsuranceMonthly: 0,
      monthlyRent: 2_022.62, // matches P&I to the cent
    })
    expect(r.renterNetWorth).toBeCloseTo(92_000, 0)
  })

  it('grows the home value at the stated annual rate', () => {
    const r = compareRentVsBuy({ ...base, years: 1 })
    expect(r.years[0].homeValue).toBeCloseTo(400_000 * 1.03, 2)
  })

  it('amortizes the loan down over time', () => {
    const r = compareRentVsBuy({ ...base, years: 10 })
    expect(r.years[0].loanBalance).toBeLessThan(320_000)
    expect(r.years[9].loanBalance).toBeLessThan(r.years[0].loanBalance)
  })

  it('counts the full cost of owning, not just the mortgage payment', () => {
    const r = compareRentVsBuy(base)
    expect(r.firstMonthBuyCost).toBeGreaterThan(r.monthlyPI)
    // P&I plus tax, insurance, and maintenance on a $400,000 home
    const carrying = (400_000 * (1.1 + 0.5 + 1)) / 100 / 12
    expect(r.firstMonthBuyCost).toBeCloseTo(r.monthlyPI + carrying, 2)
  })

  it('invests the difference for whichever household spends less', () => {
    // Rent far above the cost of owning, so the buyer is the one investing.
    const r = compareRentVsBuy({ ...base, monthlyRent: 6_000, years: 5 })
    expect(r.advantage).toBeGreaterThan(0)
  })

  it('raises the rent once a year, not every month', () => {
    const flat = compareRentVsBuy({ ...base, rentGrowth: 0, years: 2 })
    const rising = compareRentVsBuy({ ...base, rentGrowth: 10, years: 2 })
    expect(rising.years[0].renterCashOut).toBeCloseTo(flat.years[0].renterCashOut, 2)
    expect(rising.years[1].renterCashOut).toBeGreaterThan(flat.years[1].renterCashOut)
  })

  it('reports no breakeven when buying never pulls ahead', () => {
    expect(compareRentVsBuy({ ...base, monthlyRent: 1_200, years: 30 }).breakevenMonth).toBeNull()
  })

  it('finds a breakeven that holds for the rest of the horizon', () => {
    const r = compareRentVsBuy({ ...base, years: 30 })
    expect(r.breakevenMonth).not.toBeNull()
    // Buying is ahead at the end, since the breakeven is only recorded if it sticks
    expect(r.advantage).toBeGreaterThan(0)
  })
})

// Every figure quoted in the prose and FAQs of app/calculators/rent-vs-buy/page.tsx.
describe('page example values — $400,000 home at 6.5% vs $2,200 rent', () => {
  it('the mortgage is $2,023 but owning costs $2,889 a month', () => {
    const r = compareRentVsBuy(base)
    expect(r.monthlyPI).toBeCloseTo(2_022.62, 2)
    expect(r.firstMonthBuyCost).toBeCloseTo(2_889.28, 2)
    expect(r.firstMonthRentCost).toBeCloseTo(2_215, 2)
  })

  it('needs $92,000 in cash on day one', () => {
    expect(compareRentVsBuy(base).upfrontCost).toBe(92_000)
  })

  it('buying breaks even at month 169 — a bit over 14 years', () => {
    expect(compareRentVsBuy({ ...base, years: 30 }).breakevenMonth).toBe(169)
  })

  it('at 10 years the renter is ahead by $17,660', () => {
    const r = compareRentVsBuy(base)
    expect(Math.round(r.buyerNetWorth)).toBe(234_029)
    expect(Math.round(r.renterNetWorth)).toBe(251_689)
    expect(Math.round(r.advantage)).toBe(-17_660)
  })

  it('at 5 years the renter is ahead by $30,270; at 15 the buyer leads by $5,163', () => {
    expect(Math.round(compareRentVsBuy({ ...base, years: 5 }).advantage)).toBe(-30_270)
    expect(Math.round(compareRentVsBuy({ ...base, years: 15 }).advantage)).toBe(5_163)
  })

  it('sensitivity table: each single change moves the breakeven as quoted', () => {
    const breakeven = (over: Partial<RentVsBuyInput>) =>
      compareRentVsBuy({ ...base, years: 30, ...over }).breakevenMonth

    expect(breakeven({ monthlyRent: 2_500 })).toBe(73) // year 6
    expect(breakeven({ homeAppreciation: 4 })).toBe(79) // year 6
    expect(breakeven({ mortgageRate: 5.5 })).toBe(84) // year 7
    expect(breakeven({ investmentReturn: 4 })).toBe(90) // year 7
    expect(breakeven({ sellingCostPercent: 4 })).toBe(140) // year 11
    expect(breakeven({ homeAppreciation: 2 })).toBe(289) // year 24
    expect(breakeven({ monthlyRent: 1_800 })).toBeNull()
    expect(breakeven({ investmentReturn: 7 })).toBeNull()
    expect(breakeven({ mortgageRate: 7.5 })).toBeNull()
  })

  it('carrying costs add $867 a month on top of the mortgage payment', () => {
    const r = compareRentVsBuy(base)
    expect(r.firstMonthBuyCost - r.monthlyPI).toBeCloseTo(866.67, 2)
  })

  it('first-year interest is $20,695 and carrying costs are $10,400', () => {
    const r = compareRentVsBuy(base)
    let balance = 320_000
    let interest = 0
    for (let m = 0; m < 12; m++) {
      const i = balance * (6.5 / 100 / 12)
      interest += i
      balance -= r.monthlyPI - i
    }
    expect(Math.round(interest)).toBe(20_695)
    expect((400_000 * (1.1 + 0.5 + 1)) / 100).toBe(10_400)
  })

  it('the 5% rule line is $1,667 while the true 10-year indifference rent is $2,295', () => {
    expect(Math.round((400_000 * 0.05) / 12)).toBe(1_667)

    // Bisect for the rent at which buying and renting tie after 10 years.
    let lo = 1_500
    let hi = 4_000
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2
      if (compareRentVsBuy({ ...base, monthlyRent: mid }).advantage < 0) lo = mid
      else hi = mid
    }
    expect(Math.round((lo + hi) / 2)).toBe(2_295)
  })

  it('flat or falling prices widen the renter’s lead to $126,362 and $183,114', () => {
    expect(Math.round(compareRentVsBuy({ ...base, homeAppreciation: 0 }).advantage)).toBe(-126_362)
    expect(Math.round(compareRentVsBuy({ ...base, homeAppreciation: -2 }).advantage)).toBe(-183_114)
  })

  it('the buyer spends $455,569 in cash over 10 years against the renter’s $304,446', () => {
    const r = compareRentVsBuy(base)
    expect(Math.round(r.years[9].buyerCashOut)).toBe(455_569)
    expect(Math.round(r.years[9].renterCashOut)).toBe(304_446)
  })
})

// ---------------------------------------------------------------------------
// article example values — every figure quoted in
// /learn/is-renting-throwing-money-away. The article's argument rests on the
// split between the equity and non-equity parts of an owner's monthly cost.
// ---------------------------------------------------------------------------

describe('article example values — is-renting-throwing-money-away', () => {
  const ARTICLE: RentVsBuyInput = {
    homePrice: 400_000,
    downPaymentPercent: 20,
    mortgageRate: 6.5,
    mortgageTermYears: 30,
    closingCostPercent: 3,
    propertyTaxRate: 1.1,
    homeInsuranceRate: 0.5,
    maintenanceRate: 1,
    hoaMonthly: 0,
    homeAppreciation: 3,
    sellingCostPercent: 6,
    monthlyRent: 2_200,
    rentGrowth: 3,
    rentersInsuranceMonthly: 15,
    investmentReturn: 6,
    years: 30,
  }

  it('the $320,000 loan at 6.5% costs $2,022.62 a month in P&I', () => {
    expect(compareRentVsBuy(ARTICLE).monthlyPI).toBeCloseTo(2022.62, 2)
  })

  it('true first-month cost of owning is about $2,889 against $2,200 rent', () => {
    const r = compareRentVsBuy(ARTICLE)
    expect(r.firstMonthBuyCost).toBeCloseTo(2_889, 0)
  })

  it('buying requires $92,000 up front — 20% down plus 3% closing', () => {
    expect(compareRentVsBuy(ARTICLE).upfrontCost).toBeCloseTo(92_000, 0)
  })

  it('month 1 splits $1,733.33 interest against $289.28 principal', () => {
    const i = (320_000 * (6.5 / 100)) / 12
    expect(i).toBeCloseTo(1733.33, 2)
    expect(compareRentVsBuy(ARTICLE).monthlyPI - i).toBeCloseTo(289.28, 2)
  })

  it('only ~$289 of the $2,889 builds equity, leaving ~$2,600 gone', () => {
    const r = compareRentVsBuy(ARTICLE)
    const principal = r.monthlyPI - (320_000 * (6.5 / 100)) / 12
    expect(principal).toBeCloseTo(289.28, 2)
    expect(r.firstMonthBuyCost - principal).toBeCloseTo(2_600, 0)
  })

  it('the quoted monthly tax, insurance, and maintenance figures are right', () => {
    expect((400_000 * 0.011) / 12).toBeCloseTo(367, 0)
    expect((400_000 * 0.005) / 12).toBeCloseTo(167, 0)
    expect((400_000 * 0.01) / 12).toBeCloseTo(333, 0)
  })
})

describe('article example values — amortization figures quoted in the same article', () => {
  const { schedule } = buildSchedule(320_000, 6.5, 360)

  it('year one is $20,695 interest against $3,577 principal — 85% interest', () => {
    const y1 = schedule.slice(0, 12)
    const interest = y1.reduce((s, r) => s + r.interest, 0)
    const principal = y1.reduce((s, r) => s + r.principal, 0)
    expect(interest).toBeCloseTo(20_695, -1)
    expect(principal).toBeCloseTo(3_577, -1)
    expect((interest / (interest + principal)) * 100).toBeCloseTo(85, 0)
  })

  it('principal first exceeds interest in month 233', () => {
    expect(schedule.findIndex(r => r.principal > r.interest) + 1).toBe(233)
  })

  it('the loan costs $408,142 in interest over the full term', () => {
    expect(schedule.reduce((s, r) => s + r.interest, 0)).toBeCloseTo(408_142, -1)
  })
})
