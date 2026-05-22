export interface MortgageRow {
  payment: number
  paymentAmount: number
  principal: number
  interest: number
  balance: number
}

export interface MortgageScheduleResult {
  schedule: MortgageRow[]
  monthlyPI: number
  totalInterest: number
}

export function buildSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraMonthly = 0,
  extraYearly = 0
): MortgageScheduleResult {
  const r = annualRate / 100 / 12
  const monthlyPI =
    r === 0
      ? principal / termMonths
      : (principal * r * Math.pow(1 + r, termMonths)) /
        (Math.pow(1 + r, termMonths) - 1)

  let balance = principal
  const schedule: MortgageRow[] = []

  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * r
    const principalPmt = monthlyPI - interest
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

  // Sum actual interest paid — NOT monthlyPI * termMonths - principal,
  // which would overstate interest when extra payments shorten the loan.
  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)

  return { schedule, monthlyPI, totalInterest }
}
