import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('debt-payoff-strategies')!
const related = [
  getArticle('debt-avalanche-vs-snowball')!,
  getArticle('compound-interest-guide')!,
  getArticle('fixed-vs-variable-interest-rate')!,
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
  { q: "What is the fastest way to pay off debt?", a: "The fastest way is to maximize the amount you put toward your highest-interest debt each month while paying minimums on everything else. Speed depends primarily on how much extra you can direct toward debt monthly. Increasing income through a side job, cutting variable expenses, and applying windfalls like tax refunds and bonuses directly to debt all accelerate payoff. Consolidating multiple debts to a lower interest rate can also speed things up by reducing how much of each payment goes to interest." },
  { q: "How do I pay off $20,000 in debt quickly?", a: "Start by listing all debts with their balances, rates, and minimum payments. Calculate how much you can put toward debt above the minimums. Prioritize by interest rate for maximum savings. Reducing expenses to free up even $300 to $400 per month extra can pay off $20,000 in 4 to 5 years. Consider a balance transfer to a 0% APR card or a debt consolidation loan to reduce the rate. Avoid taking on any new debt while paying off existing balances." },
  { q: "Does debt consolidation help pay off debt faster?", a: "Consolidation helps if it reduces your interest rate, because more of each payment then goes to principal. Moving $15,000 from a 22% credit card to a 10% personal loan meaningfully accelerates payoff. However, if consolidation extends your loan term without reducing the monthly payment, it may cost more over time even with a lower rate. The key is to maintain or increase your monthly payment after consolidating — not use the lower required payment as an excuse to pay less each month." },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        Knowing <em>which</em> debt to target first is one decision. Actually building a plan
        you&apos;ll execute consistently for months or years is another. This article is about the
        second problem — turning the intent to pay off debt into a system that runs without
        willpower propping it up every month.
      </p>
      <p>
        For a detailed comparison of the two main payoff methods — avalanche (highest rate first)
        versus snowball (smallest balance first) — see{' '}
        <Link href="/learn/debt-avalanche-vs-snowball">Avalanche vs Snowball: Which Method Wins?</Link>.
        This article covers what to do before you pick a method, how to find money to accelerate
        payoff, and how to make the plan run on its own.
      </p>

      <h2>Start With a Complete Inventory</h2>
      <p>
        Before anything else, list every debt: creditor, current balance, interest rate, and
        minimum monthly payment. Most people have never looked at this all at once. The picture
        is sometimes better than expected, sometimes worse, but always clearer — and clarity is
        what makes planning possible.
      </p>
      <div className="callout">
        <p><strong>A sample inventory:</strong></p>
        <p>Credit card A — $4,200 at 24% APR, $84 minimum</p>
        <p>Credit card B — $1,800 at 19% APR, $36 minimum</p>
        <p>Car loan — $11,500 at 7% APR, $280 minimum</p>
        <p>Student loan — $18,000 at 5.5% APR, $195 minimum</p>
        <p><em>Total minimums: $595/month across $35,500 in debt.</em></p>
        <p>Next, calculate what you can send <em>above</em> minimums each month. That surplus is your accelerant. Even $200 extra directed consistently can cut years off a payoff timeline.</p>
      </div>
      <p>
        The rates in your inventory tell you which debts are most expensive. In this example,
        the two credit cards charge 7 to 11 times the student loan&apos;s rate — meaning most of
        each minimum payment goes to interest, not balance reduction.
      </p>

      <h2>Build the Emergency Buffer First</h2>
      <p>
        Before attacking debt aggressively, have at least $1,000–$2,000 in a separate savings
        account. Without it, the first car repair or medical bill sends you back to the credit
        card — potentially adding months of setback for a single unexpected expense. This is a
        one-time setup step. Once the buffer is in place, redirect everything to debt.
      </p>

      <h2>Choose Your Target Order and Stick to It</h2>
      <p>
        With your inventory and buffer in place, decide which debt gets the extra dollars each
        month. The <strong>avalanche</strong> method targets the highest interest rate first —
        mathematically optimal, saves the most money overall. The <strong>snowball</strong>
        targets the smallest balance first — generates quicker visible wins that keep you
        motivated. In the example above, avalanche attacks credit card A (24%) first; snowball
        attacks credit card B ($1,800) first.
      </p>
      <p>
        The financial difference between them depends on how far apart your rates are. What
        matters more than which you choose is that you pick one and stay with it long enough
        to see a debt eliminated. Switching methods every few months resets your momentum.
        See <Link href="/learn/debt-avalanche-vs-snowball">Avalanche vs Snowball</Link> for
        a full breakdown, including the hybrid approach and when switching methods mid-plan makes sense.
      </p>

      <h2>Rate Reduction: When It&apos;s Worth Doing First</h2>
      <p>
        Two tools can cut your cost before you start paying aggressively, if your credit supports it:
      </p>
      <p>
        A <strong>balance transfer</strong> to a 0% intro APR card freezes interest for 12–21
        months. On a $4,200 balance at 24%, you&apos;d normally pay about $1,000 in interest per year.
        A 3% transfer fee costs $126 upfront — then $0 in interest during the promotional window.
        The balance must be fully paid off before the promo period ends, or interest kicks in on
        whatever remains.
      </p>
      <p>
        A <strong>debt consolidation loan</strong> replaces multiple high-rate balances with one
        lower-rate installment loan. Moving $6,000 in credit card debt from 22% to a 10% personal
        loan saves roughly $720 per year in interest and gives you a fixed payoff date. The risk:
        treating the cleared credit cards as available to use again and rebuilding the balance.
        Consolidation only helps if the behavior that created the debt changes too.
      </p>

      <h2>The Income Side of the Equation</h2>
      <p>
        Most debt payoff plans focus entirely on spending cuts. Cuts have a floor — you can&apos;t
        reduce expenses below zero. Income has no ceiling, and even a modest temporary increase
        can dramatically accelerate payoff. A side job or freelance work bringing in $400/month,
        applied entirely to the credit card at 24%, pays off $4,200 in about 11 months. On
        minimum payments only, that same balance takes over three years and costs $1,400 in interest.
      </p>
      <p>
        This doesn&apos;t require permanent lifestyle change. Define a specific income target, a
        specific debt target, and a clear finish line. Treating it as a sprint — with a defined
        end point — is what makes it sustainable. Vague commitments to &quot;pay more when you can&quot;
        produce vague results.
      </p>

      <h2>Automate So the Plan Runs Itself</h2>
      <p>
        The single most effective thing you can do is make the extra payment automatic. Set up
        a recurring transfer on payday: minimum payments go out first, then the extra amount
        hits the target debt. What&apos;s automated gets done. What relies on monthly decision-making
        gets skipped when finances feel tight.
      </p>
      <p>
        Track one number each month: the balance on your current target debt. Watching a
        single number drop makes progress feel real and reinforces the behavior, especially in
        the early months before your first debt is fully eliminated.
      </p>
      <p>
        Use <Link href="/calculators/debt-payoff">FinWiser&apos;s free debt payoff calculator</Link> to
        map your timeline — enter your debts and extra payment amount to see when each balance
        hits zero and how much total interest you&apos;ll pay under the avalanche or snowball method.
      </p>

    </ArticleLayout>
  )
}
