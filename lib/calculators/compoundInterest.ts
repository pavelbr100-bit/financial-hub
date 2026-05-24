export type CompoundingFrequency = 'daily' | 'monthly' | 'quarterly' | 'annually'

export interface CompoundInterestInputs {
  principal: number
  monthlyContribution: number
  annualRate: number
  compoundingFrequency: CompoundingFrequency
  years: number
}

export interface YearlySnapshot {
  year: number
  balance: number
  contributions: number
  interest: number
}

export interface CompoundInterestResult {
  finalBalance: number
  totalContributions: number
  totalInterestEarned: number
  yearlyData: YearlySnapshot[]
}

function compoundsPerYear(freq: CompoundingFrequency): number {
  if (freq === 'daily') return 365
  if (freq === 'monthly') return 12
  if (freq === 'quarterly') return 4
  return 1
}

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, compoundingFrequency, years } = inputs
  const n = compoundsPerYear(compoundingFrequency)
  const r = annualRate / 100
  // Effective monthly rate for the given compounding frequency
  const monthlyRate = r === 0 ? 0 : Math.pow(1 + r / n, n / 12) - 1

  let balance = principal
  const yearlyData: YearlySnapshot[] = []
  const totalMonths = years * 12

  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution
    if (month % 12 === 0) {
      const contributions = principal + monthlyContribution * month
      yearlyData.push({
        year: month / 12,
        balance,
        contributions,
        interest: balance - contributions,
      })
    }
  }

  const totalContributions = principal + monthlyContribution * totalMonths
  return {
    finalBalance: balance,
    totalContributions,
    totalInterestEarned: balance - totalContributions,
    yearlyData,
  }
}
