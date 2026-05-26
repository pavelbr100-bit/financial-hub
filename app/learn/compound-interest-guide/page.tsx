import type { Metadata } from 'next'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('compound-interest-guide')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        If you save $5,000 today and earn 8% per year, you&apos;ll have $10,795 in 10 years — not $9,000.
        That extra $1,795 came from interest earning interest. That&apos;s compound interest, and once you
        understand it, you&apos;ll look at every savings and investment decision differently.
      </p>
      <p>
        The same principle works in reverse: compound interest is why credit card debt spirals and why
        ignoring a loan for a few years can double what you owe. Understanding the mechanic gives you
        a decisive edge in both building wealth and avoiding debt traps.
      </p>

      <h2>How Compound Interest Actually Works</h2>
      <p>
        Simple interest is calculated only on the original principal. If you deposit $10,000 at 5%
        simple interest, you earn $500 every year — $5,000 total over ten years.
      </p>
      <p>
        Compound interest is calculated on the principal <em>plus</em> all previously earned interest.
        In year one you earn $500. In year two you earn 5% on $10,500 — that&apos;s $525. In year three,
        5% on $11,025 — that&apos;s $551. The numbers grow slowly at first, then accelerate sharply.
      </p>
      <div className="callout">
        <p><strong>The formula:</strong> A = P × (1 + r/n)<sup>nt</sup>, where P is principal,
        r is annual rate, n is compounding frequency per year, and t is years. At n = 12 (monthly
        compounding), $10,000 at 7% for 20 years grows to $40,064 — over four times the original amount.</p>
      </div>
      <p>
        Compounding frequency matters, but less than most people think. The difference between monthly
        and daily compounding on a $10,000 deposit over 20 years at 7% is about $90. The real lever
        is time, not frequency.
      </p>

      <h2>The Rule of 72</h2>
      <p>
        Divide 72 by your annual interest rate to estimate how many years it takes for money to double.
        At 6%, money doubles in roughly 12 years. At 9%, it doubles in 8. At 4%, it takes 18 years.
      </p>
      <p>
        This rule is useful because it makes the effect of rate differences visceral. A retirement
        account earning 8% per year doubles every 9 years. Over a 36-year career, that&apos;s four doublings
        — meaning $10,000 invested at 25 becomes $160,000 by 61, without contributing another dollar.
      </p>

      <h2>Why Starting Early Beats Starting Big</h2>
      <p>
        This is the most counterintuitive result in personal finance, and it&apos;s worth working through
        with real numbers.
      </p>
      <p>
        Investor A starts at 25, invests $300/month until age 35 (10 years), then stops completely.
        Total contributed: $36,000.
      </p>
      <p>
        Investor B starts at 35 and invests $300/month until age 65 (30 years). Total contributed: $108,000.
      </p>
      <p>
        Assuming 8% annual returns, who has more at 65?
      </p>
      <div className="callout">
        <p><strong>Investor A: ~$561,000. Investor B: ~$408,000.</strong> Investor A contributed
        one-third as much but ends up with 37% more — because the first decade of growth had 30
        additional years to compound. The early years are irreplaceable.</p>
      </div>

      <h2>Contribution Frequency Matters</h2>
      <p>
        Monthly contributions of $300 outperform a single annual contribution of $3,600 by a small
        but meaningful amount over long periods. This is because money invested in February has 10
        extra months of compounding over money invested in December.
      </p>
      <p>
        For practical purposes: automate regular contributions and don&apos;t wait to invest a lump sum.
        Time in the market almost always beats timing the market over long horizons.
      </p>

      <h2>Compound Interest Working Against You</h2>
      <p>
        Credit cards typically charge 20–29% APR, compounding daily. A $5,000 balance with no
        payments grows to $8,300 in 3 years. That&apos;s $3,300 in interest on debt that produced no
        lasting value.
      </p>
      <p>
        The same mechanic that builds wealth destroys it when you&apos;re on the wrong side of the
        equation. High-interest consumer debt is the most urgent thing to pay off before investing,
        because no investment reliably returns 25% annually — but credit card debt reliably costs it.
      </p>

      <h2>What Rate to Expect</h2>
      <p>
        A few realistic benchmarks for planning:
      </p>
      <ul>
        <li>High-yield savings accounts: 4–5% (fluctuates with Fed rate)</li>
        <li>US stock market (S&amp;P 500 historical average): ~10% nominal, ~7% inflation-adjusted</li>
        <li>Diversified retirement portfolio (60/40 stocks/bonds): ~6–7% long-term average</li>
        <li>Credit cards: 20–29% (working against you)</li>
        <li>Student loans: 5–8% for federal loans, higher for private</li>
      </ul>
      <p>
        When modeling retirement savings, using 6–7% is conservative and appropriate. Using 10%
        optimistically projects outcomes that require above-average returns — better to plan for
        the conservative case and be pleasantly surprised.
      </p>

      <h2>The Practical Takeaway</h2>
      <p>
        Compound interest rewards two things above all else: starting early and not interrupting the
        process. A 25-year-old who puts $100/month into a retirement account will likely end up
        wealthier than a 35-year-old who puts $300/month, even accounting for the late start.
      </p>
      <p>
        Run the numbers on your own timeline. The gap between starting today and starting in two
        years is larger than most people expect — and it only widens with time.
      </p>

      <p>
        Use FinWiser&apos;s free compound interest calculator to model your own timeline — enter your
        starting amount, monthly contribution, rate, and years to see exactly how your money
        compounds over time.
      </p>

      <table>
        <thead>
          <tr>
            <th>$10,000 invested at 7%</th>
            <th>After 10 years</th>
            <th>After 20 years</th>
            <th>After 30 years</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Simple interest</td><td>$17,000</td><td>$24,000</td><td>$31,000</td></tr>
          <tr><td>Compound (annual)</td><td>$19,672</td><td>$38,697</td><td>$76,123</td></tr>
          <tr><td>Compound (monthly)</td><td>$20,097</td><td>$40,388</td><td>$81,165</td></tr>
        </tbody>
      </table>

    </ArticleLayout>
  )
}
