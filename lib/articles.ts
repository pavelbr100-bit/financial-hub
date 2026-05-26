export interface ArticleMeta {
  slug: string
  title: string
  description: string
  date: string
  readMinutes: number
  category: string
  categoryColor: 'emerald' | 'sky' | 'amber' | 'purple'
  calculatorHref: string
  calculatorLabel: string
}

export const articles: ArticleMeta[] = [
  {
    slug: 'mortgage-payoff-strategies',
    title: '5 Ways to Pay Off Your Mortgage Early and Save Thousands',
    description: 'Small changes to your payment schedule can cut years off your mortgage and save tens of thousands in interest. Here\'s what actually works.',
    date: 'May 12, 2026',
    readMinutes: 7,
    category: 'Mortgage',
    categoryColor: 'emerald',
    calculatorHref: '/calculators/mortgage',
    calculatorLabel: 'Calculate your mortgage',
  },
  {
    slug: 'compound-interest-guide',
    title: 'How Compound Interest Works — and Why Starting Early Beats Starting Big',
    description: 'Compound interest is the closest thing to a financial superpower. Understanding it changes how you think about every dollar you save.',
    date: 'May 14, 2026',
    readMinutes: 6,
    category: 'Investing',
    categoryColor: 'sky',
    calculatorHref: '/calculators/compound-interest',
    calculatorLabel: 'See your money grow',
  },
  {
    slug: 'debt-avalanche-vs-snowball',
    title: 'Debt Avalanche vs. Debt Snowball: Which Method Gets You Debt-Free Faster?',
    description: 'Two proven strategies for paying off multiple debts. One saves the most money. The other keeps you motivated. Here\'s how to choose.',
    date: 'May 19, 2026',
    readMinutes: 8,
    category: 'Debt',
    categoryColor: 'amber',
    calculatorHref: '/calculators/debt-payoff',
    calculatorLabel: 'Build your payoff plan',
  },
  {
    slug: 'what-is-amortization',
    title: 'What Is an Amortization Schedule? (And Why You Should Look at Yours)',
    description: 'Most borrowers never look at their amortization schedule. The ones who do make smarter decisions about extra payments, refinancing, and total loan cost.',
    date: 'May 22, 2026',
    readMinutes: 6,
    category: 'Loans',
    categoryColor: 'purple',
    calculatorHref: '/calculators/loan-amortization',
    calculatorLabel: 'See your amortization schedule',
  },
]

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find(a => a.slug === slug)
}
