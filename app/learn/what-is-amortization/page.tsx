import type { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('what-is-amortization')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        When you take out a mortgage or car loan, you receive a fixed monthly payment amount. What
        most borrowers don&apos;t realize is that the split between interest and principal in that payment
        changes dramatically over the life of the loan — and understanding that split changes how
        you think about extra payments, refinancing, and total loan cost.
      </p>
      <p>
        An amortization schedule is the table that shows exactly how each payment is divided and
        how your balance decreases over time. It&apos;s one of the most useful things you can look at
        when making any loan decision.
      </p>

      <h2>How Amortization Works</h2>
      <p>
        Each month, your interest charge is calculated on your outstanding principal balance. At
        the start of the loan, that balance is at its highest — so a large portion of your payment
        goes to interest. As you pay down the principal, the interest portion shrinks and the
        principal portion grows.
      </p>
      <p>
        This is why the early years of a mortgage feel like you&apos;re barely making progress. On a
        30-year $300,000 mortgage at 7%, your first payment of $1,996 is split as: $1,750 interest,
        $246 principal. Two years in, it&apos;s still $1,729 interest and $267 principal. You&apos;ve made
        24 payments totaling $47,904 — but your balance has only dropped by about $6,000.
      </p>
      <div className="callout">
        <p><strong>The front-loading effect:</strong> On a $300,000 mortgage at 7% for 30 years,
        you pay more in interest than principal for the first 22 years of the loan. It&apos;s only in
        years 23–30 that principal payments exceed interest payments each month.</p>
      </div>

      <h2>Reading an Amortization Schedule</h2>
      <p>
        A standard amortization table has four columns: payment number, interest paid, principal
        paid, and remaining balance. Each row represents one payment period (usually a month).
      </p>
      <p>
        The key things to look for:
      </p>
      <ul>
        <li><strong>Total interest paid over the loan term</strong> — this is often a shock. A
        $300,000 mortgage at 7% for 30 years costs $418,527 in total payments — $118,527 more
        than the amount borrowed.</li>
        <li><strong>Balance at the midpoint</strong> — a 30-year mortgage at 7% still has over
        $230,000 outstanding after 15 years, despite 15 years of payments. This matters if you
        plan to sell or refinance.</li>
        <li><strong>The crossover point</strong> — the payment number where principal exceeds
        interest. Earlier crossovers mean less total interest.</li>
      </ul>

      <h2>Why Extra Payments Are So Powerful Early</h2>
      <p>
        When you make an extra principal payment, you eliminate not just that dollar of debt — you
        eliminate all the future interest that would have been charged on it. Because interest is
        front-loaded, an extra payment in year two prevents roughly 28 years of interest on that
        amount. The same payment in year 25 prevents only 5 years.
      </p>
      <p>
        This is why financial advisors emphasize making extra payments as early as possible rather
        than waiting. A $5,000 lump-sum payment in year one of a 30-year mortgage saves
        significantly more in total interest than the same $5,000 paid in year 15.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> On a $300,000 mortgage at 7%, a $5,000 extra principal
        payment in month 12 saves approximately $22,000 in total interest and cuts 14 months off
        the loan. The same payment at month 120 (year 10) saves about $11,000 and cuts 8 months.</p>
      </div>

      <h2>Amortization and Refinancing Decisions</h2>
      <p>
        One of the most misunderstood aspects of refinancing is that it resets your amortization
        schedule. If you refinance a 30-year mortgage after 10 years into a new 30-year mortgage,
        you&apos;re going back to the beginning — where most of your payment goes to interest again,
        and you&apos;ve extended your payoff date by 10 years.
      </p>
      <p>
        Refinancing to a lower rate still saves money if the rate drop is significant, but the
        total interest cost needs to account for the reset schedule. Use an amortization calculator
        to compare total interest paid on both scenarios — not just the monthly payment difference.
      </p>
      <p>
        A better option, if cash flow allows: refinance to a shorter term (15 years instead of
        30). The rate is lower, the schedule compresses, and you avoid adding years back onto
        your debt.
      </p>

      <h2>Fixed-Rate vs. Adjustable-Rate Amortization</h2>
      <p>
        Fixed-rate loans amortize on a predictable schedule — the payment amount never changes,
        and the interest/principal split follows a fixed curve. This makes planning straightforward.
      </p>
      <p>
        Adjustable-rate mortgages (ARMs) have the same amortization structure, but the interest
        rate can change at defined intervals (1 year, 5 years, etc.). When the rate adjusts, the
        remaining balance is re-amortized at the new rate, which changes both the payment and the
        schedule going forward. This makes long-term planning harder — which is one reason ARMs
        carry higher risk for borrowers planning to stay in a home long-term.
      </p>

      <h2>Other Loans That Amortize</h2>
      <p>
        Mortgages get the most attention, but amortization applies to any installment loan:
      </p>
      <ul>
        <li><strong>Auto loans</strong> — typically 3–7 years. Front-loaded like mortgages, but
        shorter term means the crossover happens faster (usually around the midpoint).</li>
        <li><strong>Personal loans</strong> — same structure, usually 2–7 years.</li>
        <li><strong>Student loans</strong> — amortize similarly, though income-driven repayment
        plans can change the effective schedule.</li>
      </ul>
      <p>
        Credit cards do not amortize — there&apos;s no fixed payment that eliminates the balance by
        a set date. This is one reason credit card debt is particularly dangerous: minimum payments
        can keep a balance alive indefinitely.
      </p>

      <h2>The Bottom Line</h2>
      <p>
        Looking at your amortization schedule once — really looking at it — changes how you feel
        about your loan. Seeing that you&apos;ll pay $118,000 in interest on a $300,000 mortgage
        makes the case for extra payments viscerally, not just theoretically.
      </p>
      <p>
        It also clarifies refinancing decisions, helps you understand your equity position at any
        point in the loan, and shows exactly how much each extra payment is worth. It takes two
        minutes to generate and gives you information that takes years to act on.
      </p>

      <p>
        Use FinWiser&apos;s free loan amortization calculator to generate your full payment schedule
        instantly — see every month&apos;s interest/principal split, your running balance, and the
        total cost of your loan before you commit to it.
      </p>

      <table>
        <thead>
          <tr>
            <th>$300,000 at 7% / 30 years</th>
            <th>Payment #1</th>
            <th>Payment #120 (yr 10)</th>
            <th>Payment #300 (yr 25)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monthly payment</td><td>$1,996</td><td>$1,996</td><td>$1,996</td></tr>
          <tr><td>Interest portion</td><td>$1,750</td><td>$1,598</td><td>$1,033</td></tr>
          <tr><td>Principal portion</td><td>$246</td><td>$398</td><td>$963</td></tr>
          <tr><td>Remaining balance</td><td>$299,754</td><td>$272,568</td><td>$175,710</td></tr>
        </tbody>
      </table>

    </ArticleLayout>
  )
}
