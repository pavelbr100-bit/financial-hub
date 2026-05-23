export interface AmortizationRow {
  payment: number
  paymentAmount: number
  principal: number
  interest: number
  balance: number
}

export interface AmortizationResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: AmortizationRow[]
  balloonPayment: number // 0 for standard loans
}

/**
 * @param amortMonths - used to calculate the monthly payment (the "amortization period")
 * @param loanTermMonths - how long the loan actually runs before payoff/balloon (defaults to amortMonths)
 * When loanTermMonths < amortMonths the remaining balance at the end is a balloon payment.
 */
export function calculateAmortization(
  principal: number,
  annualRate: number,
  amortMonths: number,
  extraMonthly = 0,
  extraYearly = 0,
  loanTermMonths = amortMonths
): AmortizationResult {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment =
    monthlyRate === 0
      ? principal / amortMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, amortMonths)) /
        (Math.pow(1 + monthlyRate, amortMonths) - 1)

  const schedule: AmortizationRow[] = []
  let balance = principal
  const runMonths = Math.min(loanTermMonths, amortMonths)

  for (let i = 1; i <= runMonths; i++) {
    const interest = balance * monthlyRate
    const principalPmt = monthlyPayment - interest
    const extra = extraMonthly + (i % 12 === 0 ? extraYearly : 0)
    const totalPrincipal = Math.min(principalPmt + extra, balance)
    balance = Math.max(0, balance - totalPrincipal)

    schedule.push({
      payment: i,
      paymentAmount: interest + totalPrincipal,
      principal: totalPrincipal,
      interest,
      balance,
    })

    if (balance === 0) break
  }

  const balloonPayment = balance // remaining balance after loan term
  const totalPayment = schedule.reduce((s, r) => s + r.paymentAmount, 0) + balloonPayment

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
    balloonPayment,
  }
}
