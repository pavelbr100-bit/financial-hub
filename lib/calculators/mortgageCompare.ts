import { buildSchedule } from './mortgage'

export interface CompareScenarioInputs {
  principal: number       // loan amount (home price minus down payment)
  annualRate: number      // e.g. 6.5
  termMonths: number      // e.g. 360
  propertyTaxRate: number // annual %, applied to home price: pass (homePrice * rate / 100) / 12 externally or homePrice here
  homePrice: number       // needed for property tax calculation
  annualInsurance: number // dollars/year, e.g. 1200
  pmiRate: number         // annual %, 0 if down >= 20%
  monthlyHOA: number      // dollars/month, 0 if none
  extraMonthly?: number
  extraYearly?: number
}

export interface CompareScenarioResult {
  monthlyPI: number
  monthlyTax: number
  monthlyInsurance: number
  monthlyPMI: number
  monthlyHOA: number
  totalMonthly: number
  totalInterest: number
  totalPaid: number
  actualMonths: number
  balances: number[]
  interestSaved: number | undefined
  monthsSaved: number | undefined
}

export function computeScenario(inputs: CompareScenarioInputs): CompareScenarioResult {
  const {
    principal,
    annualRate,
    termMonths,
    propertyTaxRate,
    homePrice,
    annualInsurance,
    pmiRate,
    monthlyHOA,
    extraMonthly = 0,
    extraYearly = 0,
  } = inputs

  const base = buildSchedule(principal, annualRate, termMonths)
  const withExtra =
    extraMonthly > 0 || extraYearly > 0
      ? buildSchedule(principal, annualRate, termMonths, extraMonthly, extraYearly)
      : null

  const { schedule, monthlyPI } = withExtra ?? base
  const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0)

  const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12
  const monthlyInsurance = annualInsurance / 12
  const monthlyPMI = (principal * (pmiRate / 100)) / 12
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + monthlyHOA

  return {
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthly,
    totalInterest,
    totalPaid: principal + totalInterest,
    actualMonths: schedule.length,
    balances: schedule.map((r) => r.balance),
    interestSaved: withExtra
      ? base.totalInterest - totalInterest
      : undefined,
    monthsSaved: withExtra
      ? base.schedule.length - schedule.length
      : undefined,
  }
}
