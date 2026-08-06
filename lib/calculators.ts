/**
 * SINGLE SOURCE OF TRUTH for calculator routes.
 *
 * Feeds the /calculators hub page and app/sitemap.ts, so a new calculator cannot
 * be added to the site and silently left out of the sitemap. When you add a
 * calculator, add it here first.
 *
 * `blurb` is written for the hub page's card — it should say what decision the
 * tool answers, not restate the title.
 */

import { stateConfigs } from './data/state-mortgage-configs'

export type CalculatorCategory =
  | 'Mortgage & Home'
  | 'Debt & Credit Cards'
  | 'Loans'
  | 'Saving & Investing'

export interface CalculatorEntry {
  href: string
  /** The full tool name, matching the page's H1. */
  name: string
  blurb: string
  category: CalculatorCategory
}

/** Order within each category is deliberate: most-searched first. */
export const calculators: CalculatorEntry[] = [
  // Mortgage & Home
  {
    href: '/calculators/mortgage',
    name: 'Mortgage Calculator',
    blurb:
      'Your full monthly payment including property taxes, homeowners insurance, PMI, and HOA dues — not just principal and interest.',
    category: 'Mortgage & Home',
  },
  {
    href: '/calculators/mortgage-payoff',
    name: 'Mortgage Payoff Calculator',
    blurb:
      'Already own? See how an extra monthly payment, a lump sum, or a biweekly schedule moves your payoff date and cuts total interest.',
    category: 'Mortgage & Home',
  },
  {
    href: '/calculators/biweekly-mortgage',
    name: 'Biweekly Mortgage Calculator',
    blurb:
      'Compare paying every two weeks against once a month, starting from a home price and down payment.',
    category: 'Mortgage & Home',
  },
  {
    href: '/calculators/mortgage/compare',
    name: 'Mortgage Comparison Calculator',
    blurb:
      'Put two or three loan scenarios side by side — a 15-year against a 30-year, or one rate against another.',
    category: 'Mortgage & Home',
  },
  {
    href: '/calculators/rent-vs-buy',
    name: 'Rent vs Buy Calculator',
    blurb:
      'Still deciding? Compares the two on net worth rather than monthly payment, and finds the year buying pulls ahead.',
    category: 'Mortgage & Home',
  },

  // Debt & Credit Cards
  {
    href: '/calculators/credit-card-payoff',
    name: 'Credit Card Payoff Calculator',
    blurb:
      'One card, modelled properly — including the shrinking minimum payment that stretches a balance out for decades.',
    category: 'Debt & Credit Cards',
  },
  {
    href: '/calculators/debt-snowball',
    name: 'Debt Snowball Calculator',
    blurb:
      'Order several debts smallest balance first, for the early wins that keep a payoff plan alive.',
    category: 'Debt & Credit Cards',
  },
  {
    href: '/calculators/debt-avalanche',
    name: 'Debt Avalanche Calculator',
    blurb:
      'Order the same debts by interest rate instead — the sequence that costs the least in total interest.',
    category: 'Debt & Credit Cards',
  },

  // Loans
  {
    href: '/calculators/car-loan',
    name: 'Car Loan Calculator',
    blurb:
      'Price a car before you sign: monthly payment, total interest, sales tax, and trade-in credit.',
    category: 'Loans',
  },
  {
    href: '/calculators/auto-loan-payoff',
    name: 'Auto Loan Payoff Calculator',
    blurb:
      'Already financed? See what extra payments save, and the month you stop owing more than the car is worth.',
    category: 'Loans',
  },
  {
    href: '/calculators/student-loan-payoff',
    name: 'Student Loan Payoff Calculator',
    blurb:
      'What an extra payment or a lump sum does to your payoff date — and why forgiveness changes the answer entirely.',
    category: 'Loans',
  },
  {
    href: '/calculators/loan-amortization',
    name: 'Loan Amortization Calculator',
    blurb:
      'The principal and interest split of every single payment on any fixed-rate loan, with a full schedule.',
    category: 'Loans',
  },

  // Saving & Investing
  {
    href: '/calculators/compound-interest',
    name: 'Compound Interest Calculator',
    blurb:
      'Watch a starting balance and a monthly contribution grow, and see the year interest overtakes what you put in.',
    category: 'Saving & Investing',
  },
]

/** Rendering order of the category sections on the hub page. */
export const calculatorCategories: CalculatorCategory[] = [
  'Mortgage & Home',
  'Debt & Credit Cards',
  'Loans',
  'Saving & Investing',
]

export interface StateCalculatorEntry {
  href: string
  name: string
  /** What is pre-loaded for that state — the reason to use it over the generic page. */
  note: string
}

/**
 * State mortgage variants, derived from the state configs so the quoted tax rate
 * can never drift from the rate the calculator actually loads.
 */
export const stateCalculators: StateCalculatorEntry[] = stateConfigs.map((config) => ({
  href: `/calculators/mortgage/${config.slug}`,
  name: config.stateName,
  note: `${config.avgPropertyTaxRate}% average property tax pre-loaded`,
}))

export function calculatorsByCategory(category: CalculatorCategory): CalculatorEntry[] {
  return calculators.filter((c) => c.category === category)
}

/** Every calculator URL on the site, main tools plus state variants. */
export function allCalculatorHrefs(): string[] {
  return [...calculators.map((c) => c.href), ...stateCalculators.map((s) => s.href)]
}
