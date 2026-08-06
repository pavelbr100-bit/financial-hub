import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('what-is-amortization')!
const related = [
  getArticle('mortgage-amortization-explained')!,
  getArticle('fixed-vs-variable-interest-rate')!,
  getArticle('how-car-loan-interest-works')!,
]

export const metadata: Metadata = {
  title: { absolute: `${meta.metaTitle ?? meta.title} | FinWiser` },
  description: meta.metaDescription ?? meta.description,
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
}

const faq = [
  { q: "What is an amortization schedule?", a: "An amortization schedule is a table showing every payment on a loan, including how much goes to interest, how much reduces the principal balance, and the remaining balance after each payment. It maps the entire life of the loan from the first payment to the last. Reviewing your amortization schedule reveals the true cost of borrowing and shows exactly how extra payments change your payoff date and total interest cost." },
  { q: "How is an amortization schedule calculated?", a: "Each row uses the outstanding balance and the monthly interest rate. Interest for the period equals balance multiplied by the annual rate divided by 12. Principal paid equals the fixed monthly payment minus that interest. The new balance equals the previous balance minus the principal paid. This repeats for every period until the balance reaches zero. Because the balance is highest at the start, early payments are mostly interest and only a small portion reduces the principal." },
  { q: "Why do I pay so much interest at the beginning of a loan?", a: "Loan interest is calculated on the outstanding balance. At the start of the loan the balance is at its maximum, so the interest charge for that period is the highest it will ever be. As you pay down principal over time the balance drops, and each month's interest charge shrinks. This front-loading of interest is built into how amortization works and applies equally to mortgages, car loans, and personal loans." },
  { q: "Can I get an amortization schedule for my mortgage?", a: "Yes. Your lender is required to provide an amortization schedule on request, and most loan servicer portals display one online. You can also generate one instantly with an amortization calculator: enter your loan amount, interest rate, and term and the full payment-by-payment schedule is computed automatically. FinWiser's free loan amortization calculator generates a complete schedule for any loan type." },
  { q: "What happens to my amortization schedule if I make extra payments?", a: "Extra payments applied to principal shorten the amortization schedule: you reach a zero balance before the original end date. Each extra payment eliminates future interest charges from every remaining row in the schedule. The required monthly payment stays the same; what changes is the total number of payments you end up making. Use an amortization calculator to see exactly how much any extra payment shortens your specific loan." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

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
        &quot;Amortize&quot; comes from a Latin root meaning &quot;to kill off&quot; — as in, to gradually
        extinguish a debt. An amortizing loan is one where each payment covers both interest and
        some principal, so the balance decreases with every payment until it reaches zero. Not all
        loans work this way: interest-only loans don&apos;t reduce the balance at all — you pay
        interest each period and still owe the full principal at the end. Most mortgages, car loans,
        and personal loans are fully amortizing.
      </p>
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
        you pay more in interest than principal for approximately the first 20 years. It&apos;s only
        from around year 21 onward that principal payments exceed interest each month.</p>
      </div>

      <div className="callout">
        <p><strong>Common mistake:</strong> Assuming the loan balance drops linearly — that halfway
        through a 30-year mortgage, you&apos;ve paid off roughly half. You haven&apos;t. On a $300,000 mortgage
        at 7%, after 15 years (180 payments) you still owe about $230,000. Most of those payments
        went to interest. The balance drops slowly at first, then accelerates sharply in the final
        years. This surprises nearly every first-time homebuyer who looks at their statement and
        expects to see something closer to $150,000.</p>
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
        $300,000 mortgage at 7% for 30 years totals $718,527 in payments — $418,527 in interest
        alone, more than the original loan amount.</li>
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
        Mortgages get the most attention, but amortization applies to any installment loan. A car
        loan works the same way — the numbers are just smaller and the timeline shorter:
      </p>
      <div className="callout">
        <p><strong>Car loan example:</strong> $25,000 at 6% for 5 years. Monthly payment: $483.32.
        Month 1 interest: 6% ÷ 12 × $25,000 = $125.00. Principal paid: $483.32 − $125.00 = $358.32.
        New balance: $24,641.68. Month 2 interest is calculated on $24,641.68 — slightly less, so
        slightly more principal is repaid. This shift repeats every month until the balance reaches zero.</p>
      </div>
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
        Use <Link href="/calculators/loan-amortization">FinWiser&apos;s free loan amortization calculator</Link> to generate your full payment schedule
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
          <tr><td>Interest portion</td><td>$1,750</td><td>$1,504</td><td>$596</td></tr>
          <tr><td>Principal portion</td><td>$246</td><td>$492</td><td>$1,400</td></tr>
          <tr><td>Remaining balance</td><td>$299,754</td><td>$257,364</td><td>$100,793</td></tr>
        </tbody>
      </table>

    </ArticleLayout>
  )
}
