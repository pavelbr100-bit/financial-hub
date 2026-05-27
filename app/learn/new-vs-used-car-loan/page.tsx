import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('new-vs-used-car-loan')!
const related = [
  getArticle('how-to-get-best-car-loan-rate')!,
  getArticle('car-loan-down-payment-guide')!,
  getArticle('how-car-loan-interest-works')!,
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
    'used car loan rates',
    'car loan interest rate',
    'new vs used car loan',
    'monthly car payment calculator',
    'used car financing',
  ],
}

const faq = [
  { q: "Do new or used cars have lower interest rates?", a: "New cars almost always have lower interest rates than used cars. Lenders view new cars as less risky collateral because the value is well established and they carry manufacturer warranties. Interest rate differences of 1 to 3 percentage points between new and used financing are common. However, new cars also cost more upfront, so the total interest paid over the life of the loan may still be higher on a new car even with a lower rate, because the lower rate does not fully offset the larger loan amount." },
  { q: "How much more does it cost to finance a used car compared to a new one?", a: "The higher interest rate on used cars adds meaningful cost over the loan term. A $25,000 used car loan at 8% over 60 months costs about $5,450 in total interest. The same amount at 6%, which is more typical for new car financing with good credit, costs about $4,000, a difference of $1,450 over 5 years. On older used cars with higher rates of 10 to 15%, the interest cost on a $20,000 loan can easily exceed $7,000 to $8,000 over the loan term." },
  { q: "What credit score do I need to get a good new car loan rate?", a: "For the best new car loan rates you generally need a credit score of 720 or above. Borrowers with scores of 750 or higher typically qualify for manufacturer promotional rates, sometimes as low as 0 to 2% APR. Scores between 660 and 720 usually result in rates of 4 to 7%. Below 660 is considered subprime territory and typically means rates of 10 to 20% or more from some lenders. Improving your score before applying is one of the most cost-effective ways to reduce your car's true total cost." },
  { q: "Is it better to finance a new or used car?", a: "It depends on your priorities and financial situation. New cars offer lower interest rates, full warranties, and predictable reliability, but depreciate quickly and lose 15 to 25% of value in the first year. Used cars cost less upfront and depreciate more slowly, but carry higher rates and more uncertainty around condition and history. Many financial advisors suggest a lightly used certified pre-owned vehicle that is 2 to 4 years old as the sweet spot, where most depreciation has already occurred and the rate premium over new is usually small." },
  { q: "How long can you finance a used car?", a: "Most lenders will finance used cars up to 72 or 84 months for newer used vehicles under 5 years old. Older vehicles often have term restrictions, and many lenders cap financing at 60 months for cars over 5 years old. Some lenders decline financing entirely for very old or high-mileage vehicles. Longer terms on older used cars are particularly risky because the vehicle may need significant repairs or depreciate below the loan balance before you finish paying it off." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The choice between a new and used car isn&apos;t just about the sticker price. It involves
        interest rates, loan terms, depreciation, and total financing costs that play out very
        differently depending on which route you take. Here&apos;s a complete comparison with real
        numbers.
      </p>

      <h2>The Rate Difference</h2>
      <p>
        New car loans typically carry interest rates of 6–8% for buyers with good credit. Used
        car loans are usually 9–13% — sometimes more for older vehicles or buyers with
        lower credit scores. Lenders charge more for used cars because the collateral (the
        car) depreciates faster and is harder to value accurately.
      </p>
      <p>
        On the surface, used cars seem like the obvious choice since the price is lower. But
        a higher rate can partially or fully erase that advantage depending on how you finance.
      </p>

      <h2>A Real Numbers Comparison</h2>
      <p>
        Suppose you&apos;re choosing between a new $35,000 car at 7% and a used $22,000 car at 11%,
        both financed over 60 months:
      </p>
      <ul>
        <li><strong>New car at 7%:</strong> $693/month, $6,580 total interest, $41,580 total cost</li>
        <li><strong>Used car at 11%:</strong> $478/month, $6,680 total interest, $28,680 total cost</li>
      </ul>
      <p>
        Despite the higher rate, the used car costs $12,900 less in total. The monthly payment
        is $215 lower. In this scenario, used wins easily because the price difference is
        large enough to outweigh the rate gap.
      </p>
      <p>
        Now compare a new $35,000 car at 7% versus a used $30,000 car at 11%:
      </p>
      <ul>
        <li><strong>New car at 7%:</strong> $693/month, $6,580 total interest</li>
        <li><strong>Used car at 11%:</strong> $652/month, $9,120 total interest</li>
      </ul>
      <p>
        The used car&apos;s higher rate produces more total interest on a similar principal.
        The monthly savings is only $41. In this scenario, the gap narrows significantly.
      </p>

      <h2>Depreciation Changes the Equation</h2>
      <p>
        New cars lose roughly 15–25% of their value in the first year and 50–60% within five
        years. If you finance a new $35,000 car and it&apos;s worth $20,000 after three years, you
        may still owe more than the car is worth — a situation called being &quot;underwater&quot; or
        having negative equity.
      </p>
      <p>
        A used car that&apos;s already 3–4 years old has absorbed most of its depreciation. Its
        value declines more slowly from this point, which means you&apos;re less likely to owe more
        than it&apos;s worth.
      </p>

      <h2>Loan Terms: New Cars Get More Flexibility</h2>
      <p>
        Most lenders will finance new cars up to 84 months. For used cars — especially those
        over 5–6 years old or with high mileage — lenders may cap terms at 48–60 months.
        Shorter available terms can push monthly payments higher even on a lower balance.
      </p>

      <h2>Certified Pre-Owned: A Middle Ground</h2>
      <p>
        Many manufacturers offer certified pre-owned (CPO) programs on recent used vehicles.
        CPO cars come with manufacturer-backed warranties and sometimes access to new-car
        financing rates — sometimes as low as 3–5% through the automaker&apos;s financing arm.
        If you can get near-new-car rates on a used-car price, the total cost can be significantly
        lower than either a straight new or used loan.
      </p>

      <h2>How to Compare the Real Numbers</h2>
      <p>
        When comparing new vs. used financing, look at total interest paid and total cost
        over the life of the loan — not just the monthly payment. A lower payment that
        stretches over more months at a higher rate can easily cost more overall.
      </p>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to
        enter both scenarios side by side — different prices, rates, and terms — and see
        the full cost comparison before you decide.
      </p>

    </ArticleLayout>
  )
}
