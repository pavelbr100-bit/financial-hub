export type DebtPayoffStrategy = 'avalanche' | 'snowball'

export interface Debt {
  id: string
  name: string
  balance: number
  rate: number       // annual %
  minPayment: number
}

export interface DebtResult {
  id: string
  name: string
  originalBalance: number
  totalInterest: number
  paidOffMonth: number
}

export interface MonthlySnapshot {
  month: number
  totalBalance: number
  balances: Record<string, number>
}

export interface DebtPayoffResult {
  totalInterest: number
  payoffMonths: number
  monthlyData: MonthlySnapshot[]
  debtResults: DebtResult[]
  interestSaved?: number
  monthsSaved?: number
}

function runSimulation(
  debts: Debt[],
  extraMonthly: number,
  strategy: DebtPayoffStrategy,
): Omit<DebtPayoffResult, 'interestSaved' | 'monthsSaved'> {
  const state = debts.map(d => ({
    id: d.id,
    name: d.name,
    minPayment: d.minPayment,
    rate: d.rate,
    bal: d.balance,
    interestPaid: 0,
    paidOffMonth: 0,
  }))
  const snapshots: MonthlySnapshot[] = []
  let cumulativeFreed = 0
  let month = 0

  while (month < 600) {
    month++

    // Apply monthly interest
    for (const d of state) {
      if (d.bal <= 0) continue
      const interest = d.bal * (d.rate / 100 / 12)
      d.bal += interest
      d.interestPaid += interest
    }

    // Pay minimums to all active debts
    let justFreed = 0
    for (const d of state) {
      if (d.bal <= 0) continue
      const payment = Math.min(d.minPayment, d.bal)
      d.bal = Math.max(0, d.bal - payment)
      if (d.bal < 0.01 && !d.paidOffMonth) {
        d.bal = 0
        d.paidOffMonth = month
        justFreed += d.minPayment
      }
    }

    // Apply extra to priority target (cumulativeFreed is from previous months only)
    const totalExtra = extraMonthly + cumulativeFreed
    const active = state.filter(d => d.bal > 0)
    if (totalExtra > 0 && active.length > 0) {
      const target =
        strategy === 'avalanche'
          ? active.reduce((best, d) => (d.rate > best.rate ? d : best))
          : active.reduce((best, d) => (d.bal < best.bal ? d : best))
      target.bal = Math.max(0, target.bal - Math.min(totalExtra, target.bal))
      if (target.bal < 0.01 && !target.paidOffMonth) {
        target.bal = 0
        target.paidOffMonth = month
        justFreed += target.minPayment
      }
    }

    // Freed minimums from this month are available next month
    cumulativeFreed += justFreed

    const totalBal = state.reduce((s, d) => s + d.bal, 0)
    if (month <= 24 || month % 3 === 0) {
      snapshots.push({
        month,
        totalBalance: totalBal,
        balances: Object.fromEntries(state.map(d => [d.id, d.bal])),
      })
    }
    if (totalBal < 0.01) break
  }

  return {
    totalInterest: state.reduce((s, d) => s + d.interestPaid, 0),
    payoffMonths: month,
    monthlyData: snapshots,
    debtResults: debts.map(d => {
      const s = state.find(x => x.id === d.id)!
      return {
        id: d.id,
        name: d.name,
        originalBalance: d.balance,
        totalInterest: s.interestPaid,
        paidOffMonth: s.paidOffMonth || month,
      }
    }),
  }
}

export function calculateDebtPayoff(inputs: {
  debts: Debt[]
  extraMonthly: number
  strategy: DebtPayoffStrategy
}): DebtPayoffResult {
  const { debts, extraMonthly, strategy } = inputs
  const result = runSimulation(debts, extraMonthly, strategy)
  if (extraMonthly > 0) {
    const baseline = runSimulation(debts, 0, strategy)
    return {
      ...result,
      interestSaved: baseline.totalInterest - result.totalInterest,
      monthsSaved: baseline.payoffMonths - result.payoffMonths,
    }
  }
  return result
}
