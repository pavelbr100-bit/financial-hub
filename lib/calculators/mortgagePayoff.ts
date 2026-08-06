export type PayoffStrategy = 'extra-monthly' | 'lump-sum' | 'biweekly'

export interface PayoffRow {
  payment: number
  paymentAmount: number
  principal: number
  interest: number
  balance: number
}

export interface PayoffPlan {
  /** Scheduled principal & interest payment — identical for baseline and accelerated plans. */
  monthlyPI: number
  /** Months until the balance reaches zero. */
  months: number
  totalInterest: number
  /** Principal + interest actually paid, including any lump sum. */
  totalPaid: number
  schedule: PayoffRow[]
}

export interface PayoffInput {
  /** Current remaining balance, not the original loan amount. */
  balance: number
  annualRate: number
  remainingMonths: number
  strategy: PayoffStrategy
  extraMonthly?: number
  lumpSum?: number
  /** 1-indexed month the lump sum is applied. Defaults to the first payment. */
  lumpSumMonth?: number
}

export interface PayoffComparison {
  baseline: PayoffPlan
  accelerated: PayoffPlan
  interestSaved: number
  monthsSaved: number
}

/**
 * Standard amortizing payment. Rate 0 degrades to straight-line principal.
 */
export function monthlyPayment(balance: number, annualRate: number, months: number): number {
  if (months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return balance / months
  return (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

/**
 * Amortize `balance` at the scheduled payment, applying extra principal along the way.
 * The scheduled payment is always derived from the ORIGINAL remaining term, so extra
 * payments shorten the loan rather than lowering the monthly bill — which is how
 * lenders actually apply them.
 */
export function simulatePayoff(input: PayoffInput): PayoffPlan {
  const { balance, annualRate, remainingMonths, strategy } = input
  const r = annualRate / 100 / 12
  const monthlyPI = monthlyPayment(balance, annualRate, remainingMonths)

  const extraMonthly =
    strategy === 'extra-monthly'
      ? Math.max(0, input.extraMonthly ?? 0)
      : strategy === 'biweekly'
        ? monthlyPI / 12
        : 0
  const lumpSum = strategy === 'lump-sum' ? Math.max(0, input.lumpSum ?? 0) : 0
  const lumpSumMonth = Math.max(1, Math.round(input.lumpSumMonth ?? 1))

  let remaining = balance
  const schedule: PayoffRow[] = []

  for (let i = 1; i <= remainingMonths && remaining > 0; i++) {
    const interest = remaining * r
    const scheduledPrincipal = monthlyPI - interest
    const extra = extraMonthly + (i === lumpSumMonth ? lumpSum : 0)
    const principal = Math.min(scheduledPrincipal + extra, remaining)

    remaining = Math.max(0, remaining - principal)
    schedule.push({
      payment: i,
      paymentAmount: interest + principal,
      principal,
      interest,
      balance: remaining,
    })
  }

  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)

  return {
    monthlyPI,
    months: schedule.length,
    totalInterest,
    totalPaid: balance + totalInterest,
    schedule,
  }
}

/**
 * Accelerated plan vs. the untouched minimum-payment plan.
 */
export function comparePayoff(input: PayoffInput): PayoffComparison {
  const baseline = simulatePayoff({ ...input, strategy: 'extra-monthly', extraMonthly: 0 })
  const accelerated = simulatePayoff(input)

  return {
    baseline,
    accelerated,
    interestSaved: baseline.totalInterest - accelerated.totalInterest,
    monthsSaved: baseline.months - accelerated.months,
  }
}
