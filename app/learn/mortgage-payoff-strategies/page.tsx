import type { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('mortgage-payoff-strategies')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        The average 30-year mortgage costs more than double the original loan amount by the time
        it&apos;s paid off — a $300,000 loan at 7% means you&apos;ll pay over $420,000 in interest alone.
        The good news is that even modest changes to how you pay can shave years off your timeline
        and save tens of thousands of dollars.
      </p>
      <p>
        You don&apos;t need to refinance or dramatically change your finances. Here are five strategies
        that work, ranked roughly by ease of implementation.
      </p>

      <h2>1. Make One Extra Payment Per Year</h2>
      <p>
        On a 30-year mortgage, making just one extra full payment per year — applied to principal —
        typically cuts the loan term by 4 to 6 years and saves a significant amount in interest.
      </p>
      <p>
        The mechanics are simple: an extra payment reduces your outstanding principal balance, which
        means less interest accrues the following month, which means more of every future payment goes
        toward principal. This compounding effect accelerates over time.
      </p>
      <p>
        The most practical way to do this is to divide your monthly payment by 12 and add that amount
        to each payment. It&apos;s less noticeable in your budget, but the math is equivalent to one full
        extra payment per year.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> On a $350,000 mortgage at 6.5% for 30 years, adding $244/month
        (one-twelfth of the monthly payment) cuts the loan to roughly 24 years and saves approximately
        $85,000 in total interest.</p>
      </div>

      <h2>2. Switch to Biweekly Payments</h2>
      <p>
        Instead of making 12 monthly payments, you make 26 biweekly half-payments. The math works in
        your favor because 26 half-payments equals 13 full monthly payments — one extra payment per
        year, automatically.
      </p>
      <p>
        Many mortgage servicers offer a biweekly payment program. Before enrolling, confirm two things:
        that the servicer applies the funds immediately (not held until month-end), and that there are
        no fees for the program. If there are fees, just implement the extra-payment strategy manually.
      </p>
      <p>
        This approach works well for people paid biweekly because the payments align with their income
        schedule, making it easier to manage cash flow.
      </p>

      <h2>3. Round Up Your Monthly Payment</h2>
      <p>
        This is the lowest-friction strategy. If your payment is $1,847/month, simply pay $1,900 or
        $2,000. Even $50 to $100 extra per month adds up considerably over decades.
      </p>
      <p>
        The key is to specify that the additional amount should be applied to <strong>principal</strong>,
        not to a future payment. Contact your servicer or use your payment portal to designate this,
        otherwise the servicer may treat it as an advance payment and not reduce your balance.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> On a $300,000 mortgage at 7% for 30 years, paying an extra
        $100/month cuts the term by about 4 years and saves roughly $44,000 in interest.</p>
      </div>

      <h2>4. Apply Windfalls to Principal</h2>
      <p>
        Tax refunds, bonuses, inheritance, and other one-time windfalls are an opportunity to make
        a lump-sum principal payment. Because mortgage interest is calculated on the remaining balance,
        a large one-time payment early in the loan has an outsized effect.
      </p>
      <p>
        A $5,000 lump-sum payment in year three of a 30-year mortgage saves far more in total interest
        than the same $5,000 paid in year 20 — because you&apos;ve avoided decades of interest that would
        have been charged on that $5,000 balance.
      </p>
      <p>
        Again, confirm with your servicer that lump-sum payments are applied to principal, not to
        future scheduled payments.
      </p>

      <h2>5. Refinance to a Shorter Term</h2>
      <p>
        Refinancing to a 15-year mortgage typically offers a lower interest rate than a 30-year
        loan and forces accelerated payoff through the higher required payment. For borrowers with
        stable income and adequate cash flow, this is the most aggressive path to eliminating mortgage debt.
      </p>
      <p>
        The trade-off is a meaningfully higher monthly payment. On a $300,000 balance, switching
        from a 30-year at 7% to a 15-year at 6.5% raises the monthly principal-and-interest payment
        from about $2,000 to about $2,613 — but you&apos;ll pay roughly $190,000 less in total interest
        and be debt-free 15 years sooner.
      </p>
      <p>
        Refinancing also comes with closing costs — typically 2–5% of the loan amount — so you need
        to calculate how long you&apos;ll stay in the home to make the math work. Use a mortgage
        calculator to model both scenarios before deciding.
      </p>

      <h2>Which Strategy Is Right for You?</h2>
      <p>
        The right choice depends on your budget flexibility and how aggressively you want to pay down
        the loan. These strategies can also be combined: make biweekly payments, apply your tax refund
        as a lump sum each spring, and consider a refi if rates drop below your current rate.
      </p>
      <p>
        The most important thing is to actually run the numbers. The difference between a 30-year
        mortgage with no extra payments and one where you add $200/month can easily exceed $100,000
        in total interest — money that stays in your pocket instead. Use FinWiser&apos;s free mortgage
        calculator to see exactly how each strategy plays out on your specific loan.
      </p>

      <table>
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Effort</th>
            <th>Typical interest saved</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Round up payment by $100</td><td>Very low</td><td>$30,000–$50,000</td></tr>
          <tr><td>One extra payment per year</td><td>Low</td><td>$50,000–$90,000</td></tr>
          <tr><td>Biweekly payments</td><td>Low</td><td>$50,000–$90,000</td></tr>
          <tr><td>Apply annual windfall</td><td>Medium</td><td>Varies widely</td></tr>
          <tr><td>Refinance to 15-year</td><td>High</td><td>$150,000–$200,000</td></tr>
        </tbody>
      </table>

    </ArticleLayout>
  )
}
