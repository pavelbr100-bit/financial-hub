import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('avalanche-vs-snowball-comparison')!
const related = [
  getArticle('debt-avalanche-vs-snowball')!,
  getArticle('debt-payoff-strategies')!,
  getArticle('fixed-vs-variable-interest-rate')!,
]

export const metadata: Metadata = {
  title: { absolute: `${meta.title} | FinWiser` },
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
}

const faq = [
  { q: 'Which pays off debt faster — avalanche or snowball?', a: 'The debt avalanche pays off debt faster and for less money in almost every scenario because it targets the highest-interest debt first, minimizing the total interest that accrues across your debts. The snowball typically pays off debt for slightly more total interest and takes a bit longer, though the difference depends on the specific interest rates and balances involved. However, both methods pay off debt significantly faster than making only minimum payments.' },
  { q: 'How much more does the snowball method cost compared to the avalanche?', a: 'It depends on the interest rate gap between your debts. If your debts all have similar rates, the difference is small — maybe $200 to $300. If you have a wide spread (like 24% credit card debt alongside a 7% personal loan), the avalanche can save $1,000 to $2,000 or more. In the example in this article ($3K at 24%, $8K at 18%, $15K at 7%), the avalanche saves about $1,700 in total interest compared to the snowball.' },
  { q: 'Why does the snowball method work if it costs more?', a: 'The snowball works because psychology matters in debt payoff. When you eliminate a debt completely — even a small one — it creates a tangible win that reinforces the behavior of staying on the plan. Many people start the avalanche (which takes longer to show a clear victory) and abandon it when progress feels slow. Research shows that for many people, the snowball\'s smaller early wins produce better long-term adherence to the payoff plan, and a plan you stick with beats a mathematically superior one you abandon.' },
  { q: 'Can I switch between avalanche and snowball mid-plan?', a: 'Yes. The core requirement of either method is that you make minimum payments on all debts and put every dollar of extra payment toward one target debt at a time. You can change which debt you target at any point. Some people start with the snowball to build momentum, then switch to the avalanche once they have a few wins. The only thing that matters is that you never spread the extra payment across multiple debts simultaneously — concentrate it on one debt at a time until it\'s gone.' },
  { q: 'What if two debts have the same interest rate — which do I pay first?', a: 'If two debts have identical interest rates, the avalanche and snowball rules converge. In this case, pay off the smaller balance first — eliminating one account simplifies your finances, reduces the number of payments you manage, and can improve your credit utilization ratio faster. The interest cost difference between paying the smaller or larger balance first is negligible when rates are the same.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The debt avalanche and snowball are the two most common debt payoff strategies — and
        they&apos;ll both get you out of debt. The question is how much it costs and how long it takes.
        Here&apos;s a direct comparison using real numbers so you can choose the one that fits your
        situation.
      </p>

      <h2>How Each Method Works</h2>
      <p>
        Both strategies follow the same core rule: make minimum payments on all debts, then
        throw every extra dollar at one specific target debt until it&apos;s gone. They differ only
        in which debt you target first.
      </p>
      <ul>
        <li><strong>Avalanche:</strong> target the highest interest rate first, regardless of balance</li>
        <li><strong>Snowball:</strong> target the smallest balance first, regardless of interest rate</li>
      </ul>
      <p>
        Once the target debt is eliminated, you roll its minimum payment into the next target —
        creating an accelerating payoff effect in both methods.
      </p>

      <h2>Side-by-Side Comparison: Real Example</h2>
      <p>
        Using three debts with a total extra payment of $250/month above minimums:
      </p>

      <table>
        <thead>
          <tr>
            <th>Debt</th>
            <th>Balance</th>
            <th>Rate</th>
            <th>Min. payment</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Credit card</td><td>$3,000</td><td>24%</td><td>$75</td></tr>
          <tr><td>Personal loan</td><td>$8,000</td><td>18%</td><td>$175</td></tr>
          <tr><td>Car loan</td><td>$15,000</td><td>7%</td><td>$300</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>$26,000</strong></td><td></td><td><strong>$550 min + $250 extra = $800/mo</strong></td></tr>
        </tbody>
      </table>

      <h3>Avalanche Order</h3>
      <p>Target: Credit card (24%) → Personal loan (18%) → Car loan (7%)</p>

      <h3>Snowball Order</h3>
      <p>Target: Credit card ($3K) → Personal loan ($8K) → Car loan ($15K)</p>

      <p>
        In this example, both orders happen to start with the same debt (the credit card is both
        the smallest balance and the highest rate). The divergence happens on the second debt:
        avalanche stays on the highest rate (personal loan at 18%), which also happens to be next
        by balance anyway. In many real-world cases the order is more clearly different.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Avalanche</th>
            <th>Snowball</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total interest paid</td><td>~$3,600</td><td>~$5,300</td></tr>
          <tr><td>Time to debt-free</td><td>~37 months</td><td>~39 months</td></tr>
          <tr><td>First debt eliminated</td><td>Month 8</td><td>Month 8</td></tr>
          <tr><td>Avalanche advantage</td><td colSpan={2} style={{textAlign: 'center'}}>Saves ~$1,700 and 2 months</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>The avalanche saves $1,700 and 2 months</strong> on this set of debts. The gap
        grows when there&apos;s a wider spread between interest rates — particularly when high-rate
        credit card debt coexists with lower-rate installment loans.</p>
      </div>

      <h2>When the Snowball Makes More Sense</h2>
      <p>
        The snowball isn&apos;t the mathematically optimal strategy — but for many people, it&apos;s
        the practically better one.
      </p>
      <p>
        If you have multiple debts and have tried to pay them down before without success,
        the snowball&apos;s early wins matter. Eliminating an entire account — even a small one —
        creates a real psychological reward that reinforces the payoff habit. Research on
        debt repayment behavior consistently shows that small wins increase long-term adherence
        to a plan.
      </p>
      <p>
        A plan you stick with for 37 months beats a plan you abandon after 6 months — even if
        the abandoned plan was theoretically cheaper.
      </p>

      <h2>When the Avalanche Makes More Sense</h2>
      <p>
        The avalanche is clearly the right choice when:
      </p>
      <ul>
        <li>You have high-rate debt (20%+) alongside lower-rate debt — the interest savings are substantial</li>
        <li>You&apos;re motivated by numbers and financial efficiency rather than milestone wins</li>
        <li>Your debts are all similar in balance, making the snowball&apos;s psychological advantage smaller</li>
        <li>You&apos;ve successfully followed debt payoff plans before and have confidence you&apos;ll stay on track</li>
      </ul>

      <h2>The Hybrid Approach</h2>
      <p>
        Some people start with the snowball to build momentum — knock out one or two small debts
        to simplify their payment landscape and generate motivation — then switch to the avalanche
        for the larger, higher-rate debts where the math matters most. This isn&apos;t a compromise;
        it&apos;s a deliberate strategy to combine the behavioral benefits of the snowball with the
        financial efficiency of the avalanche.
      </p>

      <h2>Both Beat Minimums by a Wide Margin</h2>
      <p>
        Whatever method you choose, the crucial insight is that both the avalanche and snowball
        dramatically outperform paying only minimums. On these same three debts, paying minimums
        only would cost over $12,000 in total interest and take more than 7 years to pay off.
        Both strategies cut that to under $6,000 and under 40 months.
      </p>

      <h2>Run Your Own Comparison</h2>
      <p>
        The right method depends on your specific debts, rates, and psychology. Use
        <Link href="/calculators/debt-payoff"> FinWiser&apos;s free debt payoff calculator</Link> to
        enter your debts and see the exact avalanche vs. snowball payoff timeline and total interest
        for your situation.
      </p>

    </ArticleLayout>
  )
}
