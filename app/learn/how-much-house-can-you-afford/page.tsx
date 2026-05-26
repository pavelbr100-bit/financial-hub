import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('how-much-house-can-you-afford')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        Before you start touring homes, you need a number — not a vague range, but an actual
        ceiling on what you can responsibly spend. Without it, it&apos;s easy to fall in love with
        a house that stretches your budget dangerously thin.
      </p>
      <p>
        Lenders use a rule called the 28/36 rule to evaluate your application, and understanding
        it gives you a reliable anchor before you ever talk to a bank.
      </p>

      <h2>What the 28/36 Rule Is</h2>
      <p>
        The 28/36 rule sets two limits based on your gross (pre-tax) monthly income:
      </p>
      <ul>
        <li><strong>28% front-end ratio:</strong> Your total monthly housing costs — mortgage
        principal, interest, property taxes, homeowner&apos;s insurance, and HOA fees if applicable —
        should not exceed 28% of your gross monthly income.</li>
        <li><strong>36% back-end ratio:</strong> Your total monthly debt payments — housing costs
        plus car loans, student loans, credit cards, and any other recurring debt — should not
        exceed 36% of your gross monthly income.</li>
      </ul>
      <p>
        Both limits must be satisfied. If your housing costs are under 28% but your total debt
        pushes you past 36%, lenders will flag that.
      </p>

      <h2>A Real-Numbers Example</h2>
      <p>
        Suppose your household earns $90,000 per year, or $7,500 per month gross.
      </p>
      <ul>
        <li>28% of $7,500 = <strong>$2,100/month</strong> maximum for housing costs</li>
        <li>36% of $7,500 = <strong>$2,700/month</strong> maximum for all debt payments</li>
      </ul>
      <p>
        If you have a $400/month car payment and $300/month in student loan payments, that&apos;s
        $700 already going to debt. Your maximum housing payment drops to $2,000/month
        ($2,700 − $700), even though the front-end limit says $2,100.
      </p>
      <div className="callout">
        <p><strong>The back-end ratio wins.</strong> Always calculate both. The binding constraint
        is whichever limit leaves you less room — and for buyers with existing debts, it&apos;s
        almost always the back-end ratio.</p>
      </div>

      <h2>How to Translate a Monthly Payment to a Purchase Price</h2>
      <p>
        Once you know your maximum monthly housing cost, you can work backwards to a purchase
        price. Assume your payment of $2,000 needs to cover principal and interest, leaving
        roughly $400/month for taxes and insurance. That gives you about $1,600 for the actual
        mortgage payment.
      </p>
      <p>
        At 7% interest on a 30-year mortgage, $1,600/month supports a loan of approximately
        $240,000. With a 20% down payment, that translates to a purchase price of around
        $300,000. With a 10% down payment, around $267,000.
      </p>
      <p>
        <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> lets you enter any purchase price and see the
        exact monthly payment — useful for testing different price points quickly.
      </p>

      <h2>Why 20% Down Still Matters</h2>
      <p>
        Putting less than 20% down triggers private mortgage insurance (PMI), which typically
        adds 0.5–1.5% of the loan amount to your annual costs. On a $280,000 loan, that&apos;s
        $1,400–$4,200 per year, or up to $350/month extra on top of your mortgage.
      </p>
      <p>
        PMI doesn&apos;t build equity — it&apos;s pure insurance for the lender. It cancels automatically
        once your loan-to-value ratio hits 80%, but that can take years. If you&apos;re near the
        20% threshold, it&apos;s often worth waiting a little longer to save the additional down payment.
      </p>

      <h2>What the Rule Doesn&apos;t Account For</h2>
      <p>
        The 28/36 rule is a lender&apos;s benchmark, not a personal financial plan. There are a few
        things it doesn&apos;t factor in:
      </p>
      <ul>
        <li><strong>Emergency fund:</strong> If buying the home wipes out your savings, you&apos;re
        one HVAC failure away from credit card debt. Most advisors recommend keeping 3–6 months
        of expenses liquid after closing.</li>
        <li><strong>Maintenance costs:</strong> Budget 1–2% of the home&apos;s value per year for
        repairs and upkeep. A $350,000 home could need $3,500–$7,000 in maintenance annually.</li>
        <li><strong>Future income changes:</strong> If one partner plans to stop working, if
        you&apos;re in a commission-based role, or if you&apos;re near retirement, the 28/36 limit at
        today&apos;s income may be too aggressive.</li>
      </ul>

      <h2>A More Conservative Starting Point</h2>
      <p>
        Many financial planners recommend targeting 25% or less of gross income for housing, not
        28%. That buffer gives you room for savings, investing, and the unexpected without
        constantly feeling squeezed. If you can comfortably stay below 25%, you&apos;ll have more
        flexibility than most homeowners.
      </p>
      <p>
        The 28/36 rule tells you the maximum a lender will typically approve. It doesn&apos;t tell
        you what will make you financially comfortable — that&apos;s a number only you can determine
        based on your lifestyle, goals, and risk tolerance.
      </p>
      <p>
        Use <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> to run your own numbers in seconds — enter your
        target home price, down payment, and rate to see your exact monthly payment and whether
        it fits within your 28% threshold.
      </p>

    </ArticleLayout>
  )
}
