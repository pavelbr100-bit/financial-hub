/**
 * Auto-loan-specific additions on top of the shared amortizing-payoff engine.
 *
 * The payoff arithmetic itself lives in loanPayoff.ts and is identical to a
 * mortgage. What is unique to a car is that the collateral loses value faster
 * than the loan amortizes early on, so the borrower can owe more than the car is
 * worth. That gap — and the month it closes — is what this file adds.
 */

import { simulatePayoff, type PayoffInput, type PayoffPlan } from './loanPayoff'

/** Typical straight-percentage depreciation after the first year. */
export const DEFAULT_DEPRECIATION = 15

export interface EquityPosition {
  /** Car value minus loan balance today. Negative means underwater. */
  equityNow: number
  /**
   * 1-indexed month the balance first drops below the car's value; 0 when already
   * above water. In practice this always resolves, because the balance reaches zero
   * by the final payment — null is only returned for an empty schedule.
   */
  crossoverMonth: number | null
  /** Value and balance at the crossover, for display. */
  crossoverValue: number | null
}

/**
 * Value after `months` of decline at `annualDepreciation` percent a year,
 * applied continuously rather than in annual steps.
 */
export function vehicleValue(
  currentValue: number,
  annualDepreciation: number,
  months: number
): number {
  const retained = 1 - annualDepreciation / 100
  if (retained <= 0) return 0
  return currentValue * Math.pow(retained, months / 12)
}

/**
 * Walk the payoff schedule and find the first month the loan balance falls below
 * the depreciating car value. Returns crossoverMonth 0 when already above water.
 */
export function equityPosition(
  plan: PayoffPlan,
  balance: number,
  currentValue: number,
  annualDepreciation: number = DEFAULT_DEPRECIATION
): EquityPosition {
  const equityNow = currentValue - balance
  if (equityNow >= 0) {
    return { equityNow, crossoverMonth: 0, crossoverValue: currentValue }
  }

  // PayoffRow.payment is the 1-indexed payment number; paymentAmount is the dollar figure.
  for (const row of plan.schedule) {
    const value = vehicleValue(currentValue, annualDepreciation, row.payment)
    if (row.balance <= value) {
      return { equityNow, crossoverMonth: row.payment, crossoverValue: value }
    }
  }

  return { equityNow, crossoverMonth: null, crossoverValue: null }
}

/**
 * Convenience wrapper: run a payoff plan and report the equity position alongside it.
 */
export function autoPayoffWithEquity(
  input: PayoffInput,
  currentValue: number,
  annualDepreciation: number = DEFAULT_DEPRECIATION
): { plan: PayoffPlan; equity: EquityPosition } {
  const plan = simulatePayoff(input)
  return {
    plan,
    equity: equityPosition(plan, input.balance, currentValue, annualDepreciation),
  }
}
