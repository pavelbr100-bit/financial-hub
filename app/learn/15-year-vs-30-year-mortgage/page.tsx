import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('15-year-vs-30-year-mortgage')!

export const metadata: Metadata = {
  title: `${meta.title} | FinWiser Learn`,
  description: meta.description,
}

export default function Page() {
  return (
    <ArticleLayout meta={meta}>

      <p>
        The two most common mortgage terms are 15 years and 30 years, and the choice between them
        has a larger financial impact than almost any other decision in the homebuying process.
        We&apos;re talking about hundreds of thousands of dollars in interest and a 15-year difference
        in when you&apos;re debt-free.
      </p>
      <p>
        Neither option is universally better. Here&apos;s a complete breakdown so you can make the
        choice with clear numbers in front of you.
      </p>

      <h2>Monthly Payment: The Immediate Difference</h2>
      <p>
        On a $300,000 mortgage, assuming a typical rate spread (15-year rates are usually 0.5–0.75%
        lower than 30-year):
      </p>

      <table>
        <thead>
          <tr>
            <th>Loan</th>
            <th>Rate</th>
            <th>Monthly payment</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>30-year</td><td>7.0%</td><td>$1,996</td></tr>
          <tr><td>15-year</td><td>6.35%</td><td>$2,588</td></tr>
          <tr><td>Difference</td><td></td><td>$592/month more</td></tr>
        </tbody>
      </table>

      <p>
        The 15-year payment is about 30% higher. That&apos;s a meaningful difference in monthly budget
        — nearly $600 less available each month for savings, investing, or living expenses.
      </p>

      <h2>Total Interest: Where the Real Gap Is</h2>
      <p>
        The monthly payment gap is where most buyers stop the comparison. The total interest
        picture is where the 15-year pulls dramatically ahead:
      </p>

      <table>
        <thead>
          <tr>
            <th>Loan</th>
            <th>Total paid</th>
            <th>Total interest</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>30-year at 7%</td><td>$718,560</td><td>$418,560</td></tr>
          <tr><td>15-year at 6.35%</td><td>$465,840</td><td>$165,840</td></tr>
          <tr><td>Savings</td><td>$252,720</td><td>$252,720</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>The 15-year saves $252,720 in interest</strong> on a $300,000 loan. That&apos;s
        not a typo. The lower rate plus the shorter term means you pay nearly $253,000 less over
        the life of the loan.</p>
      </div>

      <h2>Equity Build-Up: The 15-Year Advantage in Practice</h2>
      <p>
        Because the 15-year has a lower rate and a shorter term, it builds equity much faster.
        After 5 years on a $300,000 loan:
      </p>
      <ul>
        <li><strong>30-year:</strong> balance is approximately $277,000 — you&apos;ve paid off $23,000</li>
        <li><strong>15-year:</strong> balance is approximately $226,000 — you&apos;ve paid off $74,000</li>
      </ul>
      <p>
        That equity difference matters if you plan to sell, refinance, or use a home equity line.
        Faster equity build also provides a financial cushion that the 30-year borrower won&apos;t
        have for many years.
      </p>

      <h2>The Case for the 30-Year</h2>
      <p>
        Despite the higher interest cost, the 30-year mortgage has real advantages — and for many
        buyers, it&apos;s the right choice.
      </p>
      <p>
        <strong>Cash flow flexibility.</strong> The $592/month difference gives you room to build
        an emergency fund, max out retirement accounts, and handle unexpected expenses without
        stress. That flexibility has real value — especially for younger buyers whose income
        may be less stable.
      </p>
      <p>
        <strong>Voluntary extra payments beat forced higher payments.</strong> You can take a
        30-year mortgage and pay it like a 15-year by making extra principal payments. If your
        finances tighten, you can drop back to the minimum. The 15-year doesn&apos;t give you that
        option.
      </p>
      <p>
        <strong>Investment opportunity cost.</strong> If mortgage rates are low and investment
        returns are high, the $592/month difference invested instead could outpace the interest
        savings. This math changes with rates — it was more compelling at 3% mortgage rates
        than at 7%.
      </p>

      <h2>Who Should Choose Each</h2>
      <p>
        The <strong>15-year</strong> tends to make sense if:
      </p>
      <ul>
        <li>You have stable, high income and the higher payment fits comfortably</li>
        <li>You&apos;re buying later in life and want to be mortgage-free before retirement</li>
        <li>You have strong savings and no high-interest debt</li>
        <li>Eliminating the debt commitment is a priority over investment flexibility</li>
      </ul>
      <p>
        The <strong>30-year</strong> tends to make sense if:
      </p>
      <ul>
        <li>The lower payment frees up money for retirement contributions with an employer match</li>
        <li>Your income is variable or you&apos;re early in your career</li>
        <li>You plan to move or refinance within 7–10 years</li>
        <li>You value the option to pay extra when you can but need minimum flexibility</li>
      </ul>

      <h2>Run the Numbers for Your Situation</h2>
      <p>
        The best choice depends entirely on your purchase price, current rates, income, and
        financial goals. A $200,000 loan at today&apos;s rates looks very different from a $600,000
        loan, and your specific rate offers may differ from the averages used here.
      </p>
      <p>
        Use <Link href="/calculators/mortgage/compare">FinWiser&apos;s free mortgage comparison calculator</Link> to run your own numbers side by side
        in seconds — enter your loan amount and see the exact monthly payment, total interest,
        and equity timeline for both options.
      </p>

    </ArticleLayout>
  )
}
