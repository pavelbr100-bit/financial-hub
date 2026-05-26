import type { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('what-is-loan-amortization')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        When you take out a car loan or mortgage, the lender hands you a single monthly payment
        number and you write that check every month. Simple. But behind that fixed number is a
        shifting split between interest and principal that changes every single month — and
        understanding that split changes how you make decisions about your loan.
      </p>
      <p>
        That split is captured in an amortization schedule. Here&apos;s what it is, how to read one,
        and what to do with the information.
      </p>

      <h2>What Loan Amortization Means</h2>
      <p>
        &quot;Amortize&quot; comes from a Latin root meaning &quot;to kill off&quot; — as in, to gradually
        extinguish a debt over time. An amortizing loan is one where each payment covers both
        interest and some principal, so the balance decreases with every payment until it reaches
        zero at the end of the term.
      </p>
      <p>
        Not all loans amortize. Interest-only loans, for instance, don&apos;t — you pay only interest
        each period and the balance never shrinks. Most personal loans, car loans, and mortgages
        are fully amortizing: each payment chips away at the balance until it&apos;s gone.
      </p>

      <h2>How a Loan Payment Is Calculated</h2>
      <p>
        Each month, your interest charge is calculated on the <em>remaining balance</em>, not the
        original loan amount. If you borrowed $25,000 at 6% for 5 years:
      </p>
      <ul>
        <li>Month 1 interest: 6% ÷ 12 × $25,000 = <strong>$125.00</strong></li>
        <li>Monthly payment: <strong>$483.32</strong></li>
        <li>Principal in month 1: $483.32 − $125.00 = <strong>$358.32</strong></li>
        <li>New balance: $25,000 − $358.32 = <strong>$24,641.68</strong></li>
      </ul>
      <p>
        In month 2, the interest is calculated on $24,641.68 instead — slightly less. So slightly
        more goes to principal. This shift continues every month for the life of the loan.
      </p>

      <h2>Reading an Amortization Schedule</h2>
      <p>
        An amortization schedule is a table, usually one row per payment period. Each row contains:
      </p>
      <ul>
        <li><strong>Payment number</strong> — which month this row represents</li>
        <li><strong>Payment amount</strong> — the fixed total (same every month for a fixed-rate loan)</li>
        <li><strong>Interest paid</strong> — how much of this payment is interest</li>
        <li><strong>Principal paid</strong> — how much reduces your balance</li>
        <li><strong>Remaining balance</strong> — what you still owe after this payment</li>
      </ul>
      <p>
        The first few rows show large interest amounts and small principal amounts. As you scroll
        toward the end of the schedule, the ratio flips: interest shrinks, principal grows, and
        the balance drops faster.
      </p>

      <h2>The Front-Loading Effect</h2>
      <p>
        Because early payments apply so much to interest, the first several years of a long loan
        feel financially slow. On a 30-year mortgage, roughly 75–80% of your first-year payments
        go to interest. You&apos;ve paid thousands of dollars and your balance barely moved.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> A $25,000 car loan at 6% for 5 years. Your monthly payment
        is $483.32. After 12 payments — $5,799 paid — your balance has dropped from $25,000 to
        about $20,800. You&apos;ve paid $4,200 in interest and reduced the balance by less than $4,200.
        The first year is front-loaded.</p>
      </div>

      <h2>Why This Matters for Extra Payments</h2>
      <p>
        Every dollar of extra principal you pay eliminates interest charges on that dollar for
        every remaining month of the loan. An extra $500 in month 6 isn&apos;t just worth $500 —
        it&apos;s worth $500 plus roughly 4.5 years of interest on $500 that would have otherwise accrued.
      </p>
      <p>
        This is why financial advisors recommend extra principal payments early in the loan rather
        than near the end. A payment in year one saves far more than the same payment in year four,
        because there are more months of future interest to avoid.
      </p>

      <h2>How to Get Your Amortization Schedule</h2>
      <p>
        For existing loans, your lender is required to provide an amortization schedule at closing.
        For new loan comparisons, FinWiser&apos;s free loan amortization calculator generates a full
        payment-by-payment schedule instantly — you can see how your entire loan breaks down
        before you ever sign anything.
      </p>

      <h2>What to Look For</h2>
      <p>
        When you pull up your amortization schedule, check three things:
      </p>
      <ul>
        <li><strong>Total interest over the full term</strong> — the sum of the interest column.
        This is how much you pay for the privilege of borrowing. For most people, this number
        is higher than expected.</li>
        <li><strong>Your balance at the midpoint</strong> — on a 5-year loan, check year 2.5.
        On a 30-year mortgage, check year 15. Most people are surprised how much balance remains
        at the halfway mark.</li>
        <li><strong>The crossover point</strong> — the row where principal paid exceeds interest
        paid in a single payment. Knowing this number makes the front-loading feel concrete
        rather than abstract.</li>
      </ul>
      <p>
        Use FinWiser&apos;s free loan amortization calculator to generate your full schedule in
        seconds — enter your loan amount, rate, and term to see every payment broken down and
        the total cost of your loan.
      </p>

    </ArticleLayout>
  )
}
