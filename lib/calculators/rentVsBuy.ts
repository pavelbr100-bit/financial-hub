/**
 * Rent vs. buy comparison over a chosen horizon.
 *
 * The comparison is net worth, not monthly payment. Comparing rent against a
 * mortgage payment alone is the mistake this calculator exists to correct: it
 * ignores the buyer's taxes, maintenance, and transaction costs on one side, and
 * what the renter's un-spent down payment earns on the other.
 *
 * Each month both households pay their housing costs. Whoever pays less that
 * month invests the difference at `investmentReturn`; the renter's portfolio also
 * starts with the down payment and closing costs the buyer handed over on day
 * one. At the end of the horizon the buyer sells, pays selling costs, and clears
 * the remaining loan.
 *
 * Deliberately NOT modelled — each would need assumptions most users cannot
 * supply, and all are stated on the page:
 *   - the mortgage interest and property tax deductions (most filers take the
 *     standard deduction, so for them the deduction is worth nothing)
 *   - capital gains treatment on either the home sale or the investment account
 *   - PMI below 20% down, and rate changes on anything but a fixed-rate loan
 */

export interface RentVsBuyInput {
  homePrice: number
  downPaymentPercent: number
  /** Annual mortgage rate, e.g. 6.5 for 6.5%. */
  mortgageRate: number
  mortgageTermYears: number
  /** One-time buying costs as a percent of price. */
  closingCostPercent: number
  /** Annual property tax as a percent of the home's current value. */
  propertyTaxRate: number
  /** Annual homeowners insurance as a percent of the home's current value. */
  homeInsuranceRate: number
  /** Annual upkeep as a percent of the home's current value. */
  maintenanceRate: number
  hoaMonthly: number
  /** Annual home appreciation, percent. */
  homeAppreciation: number
  /** Agent fees and other selling costs as a percent of the sale price. */
  sellingCostPercent: number

  monthlyRent: number
  /** Annual rent increase, percent. */
  rentGrowth: number
  rentersInsuranceMonthly: number

  /** Annual return on money neither household spends on housing, percent. */
  investmentReturn: number
  /** Horizon in years. */
  years: number
}

export interface RentVsBuyYear {
  year: number
  homeValue: number
  loanBalance: number
  /** Home value less selling costs and the remaining loan, plus invested savings. */
  buyerNetWorth: number
  /** Down payment, closing costs, and monthly savings, all invested. */
  renterNetWorth: number
  /** Cash out of pocket to date, both households. */
  buyerCashOut: number
  renterCashOut: number
}

export interface RentVsBuyResult {
  /** Principal and interest only. */
  monthlyPI: number
  /** Full first-month cost of owning: P&I, tax, insurance, maintenance, HOA. */
  firstMonthBuyCost: number
  /** Full first-month cost of renting, including renters insurance. */
  firstMonthRentCost: number
  /** Cash the buyer needs on day one. */
  upfrontCost: number
  /** 1-indexed month buying first pulls ahead and stays ahead, or null within the horizon. */
  breakevenMonth: number | null
  years: RentVsBuyYear[]
  buyerNetWorth: number
  renterNetWorth: number
  /** Positive means buying came out ahead over the horizon. */
  advantage: number
}

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export function compareRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const totalMonths = Math.max(1, Math.round(input.years * 12))
  const termMonths = Math.max(1, Math.round(input.mortgageTermYears * 12))

  const downPayment = input.homePrice * (input.downPaymentPercent / 100)
  const closingCosts = input.homePrice * (input.closingCostPercent / 100)
  const loanAmount = input.homePrice - downPayment
  const upfrontCost = downPayment + closingCosts

  const monthlyPI = monthlyPayment(loanAmount, input.mortgageRate, termMonths)
  const mortgageMonthlyRate = input.mortgageRate / 100 / 12
  const investMonthlyRate = input.investmentReturn / 100 / 12
  const appreciationMonthly = Math.pow(1 + input.homeAppreciation / 100, 1 / 12)

  let homeValue = input.homePrice
  let loanBalance = loanAmount
  let rent = input.monthlyRent

  // The renter starts with the cash the buyer just spent; the buyer starts with nothing spare.
  let renterPortfolio = upfrontCost
  let buyerPortfolio = 0

  let buyerCashOut = upfrontCost
  let renterCashOut = 0

  const years: RentVsBuyYear[] = []
  let firstMonthBuyCost = 0
  let firstMonthRentCost = 0
  let breakevenMonth: number | null = null

  for (let month = 1; month <= totalMonths; month++) {
    // Owning: P&I plus the carrying costs that scale with the home's value.
    const propertyTax = (homeValue * (input.propertyTaxRate / 100)) / 12
    const homeInsurance = (homeValue * (input.homeInsuranceRate / 100)) / 12
    const maintenance = (homeValue * (input.maintenanceRate / 100)) / 12
    const mortgageDue = loanBalance > 0 ? monthlyPI : 0
    const buyCost = mortgageDue + propertyTax + homeInsurance + maintenance + input.hoaMonthly

    const rentCost = rent + input.rentersInsuranceMonthly

    if (month === 1) {
      firstMonthBuyCost = buyCost
      firstMonthRentCost = rentCost
    }

    // Whoever spends less this month invests the difference.
    const difference = buyCost - rentCost
    renterPortfolio =
      renterPortfolio * (1 + investMonthlyRate) + (difference > 0 ? difference : 0)
    buyerPortfolio = buyerPortfolio * (1 + investMonthlyRate) + (difference < 0 ? -difference : 0)

    // Amortize one month.
    if (loanBalance > 0) {
      const interest = loanBalance * mortgageMonthlyRate
      const principal = Math.min(monthlyPI - interest, loanBalance)
      loanBalance = Math.max(0, loanBalance - principal)
    }

    homeValue *= appreciationMonthly
    buyerCashOut += buyCost
    renterCashOut += rentCost

    const saleProceeds = homeValue * (1 - input.sellingCostPercent / 100) - loanBalance
    const buyerNetWorth = saleProceeds + buyerPortfolio
    const renterNetWorth = renterPortfolio

    if (breakevenMonth === null && buyerNetWorth >= renterNetWorth) {
      breakevenMonth = month
    } else if (breakevenMonth !== null && buyerNetWorth < renterNetWorth) {
      // Buying only counts as ahead once it stays ahead.
      breakevenMonth = null
    }

    if (month % 12 === 0 || month === totalMonths) {
      years.push({
        year: Math.ceil(month / 12),
        homeValue,
        loanBalance,
        buyerNetWorth,
        renterNetWorth,
        buyerCashOut,
        renterCashOut,
      })
    }

    if (month % 12 === 0) {
      rent *= 1 + input.rentGrowth / 100
    }
  }

  const last = years[years.length - 1]

  return {
    monthlyPI,
    firstMonthBuyCost,
    firstMonthRentCost,
    upfrontCost,
    breakevenMonth,
    years,
    buyerNetWorth: last.buyerNetWorth,
    renterNetWorth: last.renterNetWorth,
    advantage: last.buyerNetWorth - last.renterNetWorth,
  }
}
