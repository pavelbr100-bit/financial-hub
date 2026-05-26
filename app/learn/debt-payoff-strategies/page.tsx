import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('debt-payoff-strategies')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        Debt doesn&apos;t just drain money — it drains mental energy. Every month you carry a
        balance is a month you&apos;re paying interest instead of building wealth. The good news is
        that with the right strategy, most people can pay off debt significantly faster than
        they think — without dramatically changing their lifestyle.
      </p>
      <p>
        Here are five strategies that actually work, along with when each one makes the most sense.
      </p>

      <h2>1. The Debt Avalanche (Highest Rate First)</h2>
      <p>
        Pay minimums on everything, then throw every extra dollar at the debt with the highest
        interest rate. Once it&apos;s gone, roll that payment to the next-highest rate.
      </p>
      <p>
        This is the mathematically optimal approach. You&apos;re eliminating the most expensive debt
        first, which minimizes the total interest you pay across all accounts.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> $8,000 credit card at 22%, $5,000 personal loan at 10%,
        $12,000 car loan at 6%. With $300/month extra, the avalanche targets the credit card
        first. Result: all three paid off in about 42 months with roughly $5,200 in total
        interest — versus about $6,400 if you paid randomly.</p>
      </div>
      <p>
        Best for: people with at least one high-interest debt (typically credit cards) who
        are motivated by numbers rather than milestones.
      </p>

      <h2>2. The Debt Snowball (Smallest Balance First)</h2>
      <p>
        Pay minimums on everything, then put every extra dollar toward the debt with the
        smallest balance — regardless of rate. When it&apos;s paid off, roll that payment to the
        next-smallest.
      </p>
      <p>
        You&apos;ll pay slightly more in interest than the avalanche, but you get the psychological
        reward of eliminating accounts faster. That sense of momentum keeps many people on track
        when the process gets long.
      </p>
      <p>
        Best for: people who&apos;ve tried debt payoff before and struggled to stay motivated, or
        those with several small debts cluttering their financial picture.
      </p>

      <h2>3. Balance Transfer to a 0% Intro APR Card</h2>
      <p>
        Many credit cards offer 0% APR for 12–21 months on transferred balances, sometimes
        for a 3–5% transfer fee. If you have high-rate credit card debt and good enough credit
        to qualify, transferring the balance can freeze interest charges while you pay it down.
      </p>
      <p>
        On a $6,000 balance at 22%, you&apos;d normally pay about $1,320/year in interest. A 3%
        transfer fee costs $180 upfront — and then $0 in interest for the promotional period.
        If you can pay off the balance before the promo ends, the savings are substantial.
      </p>
      <p>
        The trap to avoid: spending on the new card, or not having the full balance paid off
        before the promotional period ends. Deferred interest provisions can retroactively
        charge interest on the original balance if a single dollar remains.
      </p>

      <h2>4. Debt Consolidation Loan</h2>
      <p>
        If you have multiple high-rate debts, a personal loan at a lower rate can consolidate
        them into a single monthly payment. Instead of juggling a 24% credit card, an 18%
        store card, and a 15% personal loan, you replace them all with one 10% consolidation
        loan.
      </p>
      <p>
        The benefits: simplified payments, a fixed payoff date, and potentially significant
        interest savings. A $15,000 balance at an average of 20% costs roughly $3,000/year
        in interest. At 10%, that&apos;s $1,500 — and you have a clear finish line.
      </p>
      <p>
        The risk: taking out the consolidation loan and then reloading the credit cards. The loan
        solves the debt, but only if the behavior that created it changes too.
      </p>

      <h2>5. Increase Income and Direct the Difference</h2>
      <p>
        The most aggressive path to debt payoff is increasing the gap between income and expenses.
        This sounds obvious, but many people approach debt exclusively from the spending-cuts
        side — which has hard limits — when adding income can be more effective.
      </p>
      <p>
        A side job earning $400/month applied entirely to a $10,000 credit card at 22% would
        pay it off in about 22 months instead of 7+ years on minimum payments alone. The
        difference in total interest is about $7,000.
      </p>
      <p>
        Options worth considering: freelance work in your field, selling unused possessions,
        seasonal work, or picking up extra shifts. The goal isn&apos;t permanent lifestyle change —
        it&apos;s a temporary sprint to create financial momentum.
      </p>

      <h2>Combining Strategies</h2>
      <p>
        The most effective approach often combines multiple strategies. Use a balance transfer
        to freeze interest on your largest credit card, apply the avalanche method to the
        remaining debts, and direct any income boost to the highest-rate balance. Each strategy
        multiplies the effect of the others.
      </p>
      <p>
        Before choosing, build a $1,000 emergency fund first. Without it, any unexpected expense
        sends you back to the credit card, potentially undoing months of progress.
      </p>
      <p>
        Use <Link href="/calculators/debt-payoff">FinWiser&apos;s free debt payoff calculator</Link> to build your personalized payoff plan in
        seconds — enter your debts, rates, and extra payment amount to see your exact payoff
        date and total interest under any strategy.
      </p>

    </ArticleLayout>
  )
}
