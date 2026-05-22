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
}

export function calculateAmortization(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraMonthly = 0,
  extraYearly = 0
): AmortizationResult {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPayment =
    monthlyRate === 0
      ? principal / termMonths
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)

  const schedule: AmortizationRow[] = []
  let balance = principal

  for (let i = 1; i <= termMonths; i++) {
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

  const totalPayment = schedule.reduce((s, r) => s + r.paymentAmount, 0)

  return {
    monthlyPayment,
    totalPayment,
    totalInterest: totalPayment - principal,
    schedule,
  }
}
