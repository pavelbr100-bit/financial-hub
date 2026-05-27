import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('car-loan-down-payment-guide')!
const related = [
  getArticle('new-vs-used-car-loan')!,
  getArticle('how-to-get-best-car-loan-rate')!,
  getArticle('how-to-pay-off-car-loan-early')!,
]

export const metadata: Metadata = {
  title: { absolute: `${meta.title} | FinWiser Learn` },
  description: meta.description,
  alternates: { canonical: `https://finwiser.net/learn/${meta.slug}` },
  openGraph: {
    title: meta.title,
    description: meta.description,
    type: 'article',
    url: `https://finwiser.net/learn/${meta.slug}`,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: meta.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta.title,
    description: meta.description,
  },
  keywords: [
    'car loan calculator',
    'auto loan payment',
    'car loan interest rate',
    'monthly car payment calculator',
    'car loan down payment',
    'how much to put down on a car',
    'used car loan rates',
  ],
}

const faq = [
  { q: "How much should I put down on a car?", a: "20% is the commonly recommended down payment for a new car. At 20% down you are less likely to become immediately upside-down due to depreciation after driving off the lot. For used cars, 10% is a reasonable starting point since much of the depreciation has already occurred. That said, any down payment is better than none. Even 5 to 10% meaningfully reduces your loan amount, monthly payment, and total interest paid over the life of the loan." },
  { q: "What happens if I put no money down on a car?", a: "A zero-down purchase means you immediately owe the full purchase price plus taxes and fees on an asset that starts depreciating the moment you drive it off the lot. New cars lose 15 to 20% of value in the first year. With no down payment you could quickly be $3,000 to $5,000 upside-down, meaning if the car is totaled or you need to sell, you would still owe money after the proceeds. Most financial advisors recommend against zero-down financing unless you are getting 0% APR or have exceptional financial stability." },
  { q: "How does a car down payment affect my monthly payment?", a: "A larger down payment directly reduces your loan amount, which lowers both the monthly payment and total interest. On a $30,000 car at 7% over 60 months with 10% down ($3,000), your payment is about $534 per month. With 20% down ($6,000), it drops to about $475 per month, roughly $59 less each month. Over 60 months that is $3,540 saved in total payments, plus you also pay interest on a smaller principal throughout the entire loan term." },
  { q: "Does the size of a car down payment affect the interest rate?", a: "Sometimes. A larger down payment reduces the loan-to-value ratio, which lowers lender risk, and some lenders offer slightly better rates for lower-LTV loans, particularly on used cars. The rate improvement is usually modest, around 0.25 to 0.5 percentage points, compared to the larger impact of credit score on rate. However, even a small rate improvement combined with a smaller loan balance produces meaningful total savings over the loan term." },
  { q: "Can I use a trade-in as a down payment on a car?", a: "Yes. Your trade-in's value is applied directly against the purchase price, reducing the amount you need to finance. This works the same as a cash down payment from a loan calculation perspective. Get your trade-in appraised independently at a third-party buyer or dealer before negotiating to ensure you receive fair market value. Dealers sometimes undervalue a trade-in on paper while adjusting the purchase price to compensate, so negotiate the sale price and trade-in value as separate transactions when possible." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        A larger down payment reduces your loan, your monthly payment, and your total interest
        paid. But it also requires cash upfront that could be deployed elsewhere. Here&apos;s how
        to think about the right amount for your situation.
      </p>

      <h2>The Standard Recommendation: 20% for New, 10% for Used</h2>
      <p>
        Financial advisors commonly suggest putting at least 20% down on a new car and 10%
        on a used car. These aren&apos;t arbitrary numbers — they reflect the rate at which cars
        depreciate versus the speed at which a loan balance decreases.
      </p>
      <p>
        A new $35,000 car loses roughly $5,000–$7,000 in value in year one. With a 0–5%
        down payment, you&apos;ll almost certainly owe more than the car is worth for the first
        two to three years. With 20% down ($7,000), you start at or near the car&apos;s market
        value — which means you have equity from day one.
      </p>

      <h2>What a Bigger Down Payment Actually Saves</h2>
      <p>
        On a $35,000 car at 7% over 60 months:
      </p>
      <ul>
        <li><strong>5% down ($1,750):</strong> Loan = $33,250, monthly = $657, total interest = $6,170</li>
        <li><strong>10% down ($3,500):</strong> Loan = $31,500, monthly = $623, total interest = $5,854</li>
        <li><strong>20% down ($7,000):</strong> Loan = $28,000, monthly = $554, total interest = $5,203</li>
      </ul>
      <p>
        The difference between 5% and 20% down is $103/month and $967 in total interest.
        Not dramatic — but the real value of the larger down payment is the protection
        against negative equity, not just the interest savings.
      </p>

      <h2>Sales Tax Complicates the Math</h2>
      <p>
        In most states, sales tax is applied to the vehicle&apos;s purchase price — before your
        down payment is subtracted. On a $35,000 car in a state with 8% sales tax, the tax
        is $2,800. That amount is typically financed as part of your loan, which means
        you&apos;re paying interest on the tax as well.
      </p>
      <p>
        Some buyers choose to pay the sales tax out of pocket (separate from the down payment)
        to keep it out of the financed amount. On a 60-month loan at 7%, financing $2,800
        costs an extra $469 in interest. Paying it upfront saves that amount.
      </p>

      <h2>Trade-In vs. Cash Down Payment</h2>
      <p>
        A trade-in works the same as a cash down payment in terms of reducing your loan
        balance. The difference is negotiating the trade-in value separately from the car
        price — dealers sometimes offer below-market trade-in values to offset a lower car
        price. Get your trade-in appraised independently (CarMax, Carvana, KBB Instant Cash
        Offer) before negotiating so you know its market value.
      </p>

      <h2>When to Put Down Less</h2>
      <p>
        A smaller down payment can be the right choice when:
      </p>
      <ul>
        <li>You have high-interest debt that would benefit more from the cash (paying off a 20% credit card beats saving 7% on a car loan)</li>
        <li>You have insufficient emergency savings — keeping 3–6 months of expenses accessible is more important than reducing a car loan</li>
        <li>You&apos;re buying a used car that has already absorbed most of its depreciation, reducing the underwater risk</li>
      </ul>
      <p>
        The decision isn&apos;t purely mathematical. Liquidity matters — a car loan at 7% is cheap
        debt relative to most alternatives, and depleting savings to avoid it can leave you
        financially exposed to unexpected expenses.
      </p>

      <h2>Running the Numbers for Your Situation</h2>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to
        model different down payment amounts alongside your vehicle price, rate, and term —
        and see exactly how each scenario affects your monthly payment and total interest.
      </p>

    </ArticleLayout>
  )
}
