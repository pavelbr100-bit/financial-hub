/**
 * Single-card payoff engine.
 *
 * Deliberately distinct from lib/calculators/debtPayoff.ts, which orders several
 * debts by snowball/avalanche. This file models ONE revolving balance and the
 * thing that makes credit cards different from an installment loan: the minimum
 * payment is recalculated every month from the balance, so it shrinks as you pay
 * down and stretches the payoff out for decades.
 *
 * Interest is applied monthly (APR / 12). Issuers use a daily periodic rate
 * compounded daily, which runs a fraction of a percent higher over a full payoff;
 * the page prose says so.
 */

export type CardPayoffMode = 'fixed-payment' | 'minimum-only' | 'target-date'

/** Typical issuer minimum: a percent of the balance plus the month's interest, with a dollar floor. */
export const DEFAULT_MIN_PERCENT = 1
export const DEFAULT_MIN_FLOOR = 25

/** Simulations stop here; a balance still running at 50 years is reported as never paying off. */
const MAX_MONTHS = 600

/**
 * Anything under half a cent is a rounded-off balance, not a debt. Without this,
 * the exact annuity payment from paymentForTerm() leaves a floating-point residual
 * and a 12-month plan reports 13 months.
 */
const SETTLED = 0.005

export interface CardPayoffRow {
  month: number
  payment: number
  interest: number
  principal: number
  balance: number
}

export interface CardPayoffPlan {
  /** Months until the balance reaches zero. Equals MAX_MONTHS when `neverPaysOff` is true. */
  months: number
  totalInterest: number
  /** Principal plus interest actually paid. */
  totalPaid: number
  /** The first month's payment — the only one that is fixed under the minimum-only plan. */
  firstPayment: number
  /** True when the payment never covers the monthly interest, so the balance cannot fall. */
  neverPaysOff: boolean
  schedule: CardPayoffRow[]
}

export interface CardPayoffInput {
  balance: number
  /** Annual percentage rate, e.g. 22 for 22%. */
  apr: number
  mode: CardPayoffMode
  /** Used by 'fixed-payment'. */
  monthlyPayment?: number
  /** Used by 'target-date' — months in which the card should be clear. */
  targetMonths?: number
  /** Percent of balance in the issuer's minimum formula. Defaults to 1%. */
  minPercent?: number
  /** Dollar floor on the issuer's minimum. Defaults to $25. */
  minFloor?: number
}

export interface CardPayoffComparison {
  /** The plan the user chose. */
  plan: CardPayoffPlan
  /** Paying only the issuer's minimum every month — the baseline every mode is measured against. */
  minimumOnly: CardPayoffPlan
  /** The payment the chosen plan requires each month. For 'minimum-only' this is the first minimum. */
  requiredPayment: number
  interestSaved: number
  monthsSaved: number
}

function emptyPlan(balance: number): CardPayoffPlan {
  return {
    months: 0,
    totalInterest: 0,
    totalPaid: balance,
    firstPayment: 0,
    neverPaysOff: false,
    schedule: [],
  }
}

function finish(balance: number, schedule: CardPayoffRow[], neverPaysOff: boolean): CardPayoffPlan {
  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)
  return {
    months: schedule.length,
    totalInterest,
    totalPaid: neverPaysOff
      ? schedule.reduce((s, row) => s + row.payment, 0)
      : balance + totalInterest,
    firstPayment: schedule[0]?.payment ?? 0,
    neverPaysOff,
    schedule,
  }
}

/**
 * Pay the same dollar amount every month until the balance clears.
 * A payment at or below the first month's interest can never reduce the balance,
 * so the plan is flagged rather than silently running to the 600-month cap.
 */
export function simulateFixedPayment(
  balance: number,
  apr: number,
  monthlyPayment: number
): CardPayoffPlan {
  if (balance <= 0) return emptyPlan(balance)

  const r = apr / 100 / 12
  const schedule: CardPayoffRow[] = []
  let remaining = balance

  for (let month = 1; month <= MAX_MONTHS && remaining > 0; month++) {
    const interest = remaining * r
    if (monthlyPayment <= interest) {
      return finish(balance, schedule, true)
    }
    const principal = Math.min(monthlyPayment - interest, remaining)
    remaining = remaining - principal
    if (remaining < SETTLED) remaining = 0
    schedule.push({ month, payment: interest + principal, interest, principal, balance: remaining })
  }

  return finish(balance, schedule, remaining > 0)
}

/**
 * Pay only what the issuer asks: max(floor, percent of balance + this month's interest).
 * Because the percent applies to a shrinking balance, the payment falls every month —
 * this is what turns a few thousand dollars into a multi-decade balance.
 */
export function simulateMinimumOnly(
  balance: number,
  apr: number,
  minPercent: number = DEFAULT_MIN_PERCENT,
  minFloor: number = DEFAULT_MIN_FLOOR
): CardPayoffPlan {
  if (balance <= 0) return emptyPlan(balance)

  const r = apr / 100 / 12
  const schedule: CardPayoffRow[] = []
  let remaining = balance

  for (let month = 1; month <= MAX_MONTHS && remaining > 0; month++) {
    const interest = remaining * r
    const due = Math.max(minFloor, remaining * (minPercent / 100) + interest)
    const payment = Math.min(due, remaining + interest)
    if (payment <= interest) {
      return finish(balance, schedule, true)
    }
    const principal = payment - interest
    remaining = remaining - principal
    if (remaining < SETTLED) remaining = 0
    schedule.push({ month, payment, interest, principal, balance: remaining })
  }

  return finish(balance, schedule, remaining > 0)
}

/**
 * The level payment that clears `balance` in exactly `months` — the standard
 * annuity formula, identical to an installment loan's payment.
 */
export function paymentForTerm(balance: number, apr: number, months: number): number {
  if (balance <= 0 || months <= 0) return 0
  const r = apr / 100 / 12
  if (r === 0) return balance / months
  return (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

/**
 * Run the chosen plan and the minimum-only baseline side by side.
 */
export function compareCardPayoff(input: CardPayoffInput): CardPayoffComparison {
  const { balance, apr, mode, minPercent, minFloor } = input
  const minimumOnly = simulateMinimumOnly(balance, apr, minPercent, minFloor)

  let plan: CardPayoffPlan
  let requiredPayment: number

  if (mode === 'minimum-only') {
    plan = minimumOnly
    requiredPayment = minimumOnly.firstPayment
  } else if (mode === 'target-date') {
    requiredPayment = paymentForTerm(balance, apr, Math.max(1, Math.round(input.targetMonths ?? 12)))
    plan = simulateFixedPayment(balance, apr, requiredPayment)
  } else {
    requiredPayment = Math.max(0, input.monthlyPayment ?? 0)
    plan = simulateFixedPayment(balance, apr, requiredPayment)
  }

  return {
    plan,
    minimumOnly,
    requiredPayment,
    interestSaved: minimumOnly.totalInterest - plan.totalInterest,
    monthsSaved: minimumOnly.months - plan.months,
  }
}
