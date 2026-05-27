import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('avalanche-vs-snowball-debt-payoff')!

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
}

const faq = [
  { q: "What is the avalanche method for paying off debt?", a: "The debt avalanche method directs all extra payment money toward the debt with the highest interest rate first, while maintaining minimum payments on everything else. Once that debt is eliminated, the freed-up payment moves to the next highest-rate debt. This approach minimizes the total interest you pay, making it the mathematically optimal strategy for spending as little as possible to become debt-free." },
  { q: "What is the snowball method for paying off debt?", a: "The debt snowball method pays off the smallest balance first, regardless of interest rate, while maintaining minimums on all other debts. After the smallest debt is gone, that payment rolls into the next smallest. The strategy creates rapid wins early on, and seeing debts disappear completely provides a psychological boost that helps many people stay motivated and on track with their repayment plan." },
  { q: "Is the debt avalanche or debt snowball method better?", a: "It depends on your personality and financial situation. The avalanche saves more money on interest, often thousands of dollars, and is better if you can stay disciplined without quick wins. The snowball can cost more in interest but produces early victories that help many people maintain momentum. Research on behavioral economics suggests the snowball's psychological wins lead to better long-term outcomes for people who have struggled to pay off debt consistently in the past." },
  { q: "How do I start the debt avalanche method?", a: "List all your debts with their balances, minimum payments, and interest rates. Order them by interest rate from highest to lowest. Pay the minimum on every debt, then put every extra dollar toward the top of the list. When the highest-rate debt is paid off, add its former payment to the next debt on the list. Repeat until all debts are gone. A debt payoff calculator makes it easy to see your exact payoff date and total interest cost under this approach." },
  { q: "Can I switch from the snowball to the avalanche method mid-way?", a: "Yes, you can switch at any time with no penalty or reset. If you started with the snowball to build momentum but now want to focus on reducing interest costs, simply reorder your payoff list by interest rate and continue from there. Some people use a deliberate hybrid: snowball for the first two or three small debts to build confidence, then switch to avalanche for the remaining larger balances where the rate differences matter most." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        If you have more than one debt — a credit card, a car loan, a medical bill — you&apos;ve
        probably wondered: which one should I pay off first? The order you choose actually matters
        quite a bit. Two proven methods, the debt avalanche and the debt snowball, offer very
        different answers to that question.
      </p>
      <p>
        Neither is wrong. They just optimize for different things. Here&apos;s how each works and
        how to figure out which one fits you.
      </p>

      <h2>The Debt Avalanche: Pay the Highest Rate First</h2>
      <p>
        With the avalanche method, you make minimum payments on all your debts, then put every
        extra dollar toward the debt with the <strong>highest interest rate</strong> — regardless
        of the balance size. Once that debt is gone, you roll that payment into the next
        highest-rate debt, and so on.
      </p>
      <p>
        The logic is straightforward: the debt charging you the most interest is costing you the
        most money. Eliminating it first stops the bleeding as fast as possible.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> You have three debts — a $6,000 credit card at 24%, a $4,000
        personal loan at 11%, and a $10,000 car loan at 6%. With $400/month in extra payments,
        the avalanche targets the credit card first. Result: paid off in about 30 months, with
        roughly $3,800 in total interest paid across all three debts.</p>
      </div>

      <h2>The Debt Snowball: Pay the Smallest Balance First</h2>
      <p>
        With the snowball method, you make minimum payments on all debts, then put every extra
        dollar toward the debt with the <strong>smallest balance</strong> — regardless of its
        interest rate. Once it&apos;s cleared, that payment rolls to the next-smallest balance.
      </p>
      <p>
        The logic here is psychological. Paying off an entire account feels like a real win —
        one less bill, one fewer thing to track. That sense of progress keeps people motivated
        through what can be a multi-year process.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> Same three debts as above. The snowball targets the $4,000
        personal loan first (smallest balance), then the $6,000 credit card, then the car loan.
        Result: roughly the same payoff timeline, but about $4,600 in total interest — around
        $800 more than the avalanche.</p>
      </div>

      <h2>Which Method Saves More Money?</h2>
      <p>
        The avalanche almost always wins on total interest paid. The exact gap depends on how
        different your interest rates are. If one debt charges 24% and another charges 6%,
        the avalanche saves significantly. If all your rates are clustered around 8–10%, the
        difference is minimal.
      </p>
      <p>
        The snowball typically costs a little more in interest but delivers faster psychological
        rewards — which matters more than many people expect. Research on debt repayment behavior
        consistently finds that people who feel progress are more likely to stick with the plan.
        A slightly more expensive method you actually complete beats a cheaper one you abandon
        at month four.
      </p>

      <h2>How to Choose Between Them</h2>
      <p>
        A few questions to help you decide:
      </p>
      <ul>
        <li><strong>Do you have a high-interest credit card?</strong> If one debt is charging
        20%+ and the others are under 10%, the interest spread is large enough that the avalanche
        is hard to argue with. The savings can be thousands of dollars.</li>
        <li><strong>Have you tried paying off debt before and quit?</strong> If motivation has
        been the obstacle, the snowball&apos;s early wins might be what keeps you going this time.</li>
        <li><strong>How many debts do you have?</strong> If you have five or six accounts, the
        snowball&apos;s account elimination gives you visible milestones faster. If you have two or
        three, the difference between methods is less significant.</li>
      </ul>

      <h2>A Hybrid Approach</h2>
      <p>
        You don&apos;t have to commit to one method forever. A common hybrid: use the avalanche to
        knock out any credit card debt first (where rates are often 20–29% and the savings are
        largest), then switch to the snowball for the remaining lower-rate debts.
      </p>
      <p>
        This gives you the financial efficiency of the avalanche where it matters most, combined
        with the snowball&apos;s quick wins as your debt list gets shorter.
      </p>

      <h2>The One Thing Both Methods Require</h2>
      <p>
        Whichever method you choose, it only works if you consistently pay more than the minimum.
        The most effective way to do this is to treat the extra payment as a fixed expense —
        set up an automatic transfer on payday and don&apos;t give yourself the option to spend
        it on something else first.
      </p>
      <p>
        Even $100 extra per month applied consistently compounds into meaningful progress. A
        $5,000 credit card balance at 22% paid with $200/month takes 30 months and costs
        $1,350 in interest. Add $100 more and you&apos;re done in 20 months, paying $890 in
        interest — $460 saved for an extra $2,000 of effort.
      </p>
      <p>
        Use <Link href="/calculators/debt-payoff">FinWiser&apos;s free debt payoff calculator</Link> to model both the avalanche and snowball
        against your actual debts — see exactly how long each takes and what you&apos;ll pay
        in total interest.
      </p>

    </ArticleLayout>
  )
}
