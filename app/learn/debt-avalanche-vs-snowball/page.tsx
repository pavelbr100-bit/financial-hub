import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('debt-avalanche-vs-snowball')!

export const metadata: Metadata = {
  title: { absolute: `${meta.title} | FinWiser Learn` },
  description: meta.description,
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

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        Most people with multiple debts — a credit card, a car loan, a student loan — pay whatever
        the minimum is and put any extra money toward whichever bill feels most urgent. That approach
        works, but it leaves a surprising amount of money on the table.
      </p>
      <p>
        Two structured strategies — the debt avalanche and the debt snowball — consistently outperform
        the unstructured approach. They&apos;re simple, but the difference between them matters depending
        on how you&apos;re wired.
      </p>

      <h2>The Debt Avalanche</h2>
      <p>
        Pay minimums on all debts. Put every extra dollar toward the debt with the <strong>highest
        interest rate</strong>, regardless of balance size. Once that debt is paid off, redirect its
        minimum payment plus your extra money to the next-highest rate debt.
      </p>
      <p>
        The avalanche is mathematically optimal. You eliminate the most expensive debt first, which
        reduces the total interest you pay across all debts. Over a multi-year payoff timeline, the
        savings can be substantial.
      </p>
      <div className="callout">
        <p><strong>Example:</strong> Three debts — $8,000 credit card at 22%, $5,000 car loan at 7%,
        $12,000 student loan at 5%. With $500/month in extra payments, the avalanche pays off all
        three in ~38 months and costs ~$4,200 in total interest. The snowball takes the same time
        but costs ~$5,100 in interest — a $900 difference on the same income.</p>
      </div>

      <h2>The Debt Snowball</h2>
      <p>
        Pay minimums on all debts. Put every extra dollar toward the debt with the <strong>smallest
        balance</strong>, regardless of interest rate. Once that debt is gone, roll its payment to
        the next-smallest balance.
      </p>
      <p>
        The snowball is psychologically optimized. Eliminating a debt completely — even a small one —
        produces a measurable motivational boost. Research from the Harvard Business Review found
        that progress visible as &quot;accounts eliminated&quot; was more motivating than progress measured
        as &quot;total balance reduced.&quot;
      </p>
      <p>
        For people who have tried and abandoned debt payoff plans in the past, the snowball often
        produces better real-world outcomes than the avalanche — not because the math is better,
        but because they stick with it.
      </p>

      <h2>Which Saves More Money?</h2>
      <p>
        The avalanche almost always wins on total interest paid. The gap depends on the spread of
        interest rates across your debts. If all your debts have similar rates, the difference is
        minimal. If you have one high-rate credit card and several low-rate loans, the avalanche
        can save hundreds to thousands of dollars.
      </p>
      <p>
        The snowball saves time — not calendar time to payoff, but cognitive overhead. Fewer
        accounts means fewer bills to track, fewer minimum payment deadlines, and a simpler financial
        picture as you progress.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Debt Avalanche</th>
            <th>Debt Snowball</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Priority</td><td>Highest interest rate first</td><td>Smallest balance first</td></tr>
          <tr><td>Total interest paid</td><td>Lower (mathematically optimal)</td><td>Slightly higher</td></tr>
          <tr><td>Time to payoff</td><td>Same or slightly faster</td><td>Same or slightly slower</td></tr>
          <tr><td>Motivation style</td><td>Long-term, rate-focused</td><td>Short wins, momentum-based</td></tr>
          <tr><td>Best for</td><td>High-rate outlier debts (credit cards)</td><td>Many small debts, past burnout</td></tr>
        </tbody>
      </table>

      <h2>A Hybrid Approach</h2>
      <p>
        The strategies aren&apos;t mutually exclusive. A practical hybrid: use the avalanche for
        high-interest credit card debt (where the rate difference matters most), then switch to
        the snowball to knock out smaller, lower-rate debts quickly once the expensive debt is gone.
      </p>
      <p>
        This is a reasonable approach for many people because credit card rates (20–29%) are so
        far above typical loan rates (5–8%) that prioritizing them is almost always worth it.
        Once you&apos;re down to a car loan at 7% and a student loan at 5%, the difference between
        strategies is small — pick whichever keeps you on track.
      </p>

      <h2>What Both Methods Share</h2>
      <p>
        Both strategies assume one key behavior: you actually make consistent extra payments.
        That requires a defined &quot;extra payment&quot; amount, not a vague intent to pay more when you
        have money left over.
      </p>
      <p>
        The most effective way to do this is to treat the extra payment as a fixed bill. Calculate
        how much you can afford above minimums, set it up as an automatic transfer on payday, and
        don&apos;t give yourself the option to spend it first.
      </p>
      <p>
        If cash flow is tight, even $50–$100 extra per month applied consistently compounds into
        meaningful results. A $5,000 credit card balance at 22% with $200/month in payments takes
        30 months and costs $1,350 in interest. Adding $100 more per month cuts it to 20 months
        and $890 in interest — $460 saved for $2,000 of additional payments.
      </p>

      <h2>When Neither Method Is the Right Next Step</h2>
      <p>
        If your interest rates are very high (above 20%), consider whether debt consolidation or
        balance transfer to a lower rate makes sense first. Paying down 25% APR debt aggressively
        is good. Refinancing it to 12% and then paying it down aggressively is better.
      </p>
      <p>
        Also: build a small emergency fund ($1,000–$2,000) before aggressively paying off debt.
        Without it, an unexpected expense forces you onto a credit card, potentially undoing months
        of payoff progress. The math slightly favors paying down high-rate debt first, but the
        behavioral risk of having no buffer usually outweighs it.
      </p>
      <p>
        Use <Link href="/calculators/debt-payoff">FinWiser&apos;s free debt payoff calculator</Link> to run both methods against your actual debts
        in seconds — see the total interest and payoff date for each approach side by side.
      </p>

    </ArticleLayout>
  )
}
