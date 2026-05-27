import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('15-year-vs-30-year-mortgage')!
const related = [
  getArticle('mortgage-payoff-strategies')!,
  getArticle('extra-mortgage-payments-how-much-can-you-save')!,
  getArticle('how-much-house-can-you-afford')!,
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
  { q: 'What is the main difference between a 15-year and 30-year mortgage?', a: 'The core difference is the repayment term. You pay off the same loan in 15 years instead of 30, which means a higher required monthly payment but far less total interest. The 15-year mortgage also typically carries a lower interest rate — usually 0.5 to 0.75 percentage points below a 30-year — because shorter loans carry less risk for lenders. The 30-year offers a lower required payment and more budget flexibility but costs significantly more in total interest over the life of the loan.' },
  { q: 'Is a 15-year mortgage worth it?', a: 'A 15-year mortgage is worth it if you can comfortably afford the higher payment without straining your budget or sacrificing retirement savings. The interest savings are substantial — often $150,000 to $300,000 on a typical mortgage — and you build equity much faster. The risk is that the higher required payment leaves less flexibility if your income drops. If the payment difference is tight, a 30-year mortgage with voluntary extra payments offers similar benefits with more financial cushion.' },
  { q: 'How much more do you pay in total on a 30-year versus 15-year mortgage?', a: 'On a $350,000 mortgage at 7% (30-year) and 6.35% (15-year), the 30-year costs roughly $489,000 in total interest over the life of the loan. The 15-year costs about $194,000. That is a difference of nearly $295,000 in extra interest — despite the higher monthly payment on the 15-year. The 30-year monthly payment is about $693 less, but you pay it for twice as long.' },
  { q: 'What are the pros and cons of a 15-year mortgage?', a: 'Pros: dramatically less total interest paid, you own the home outright in half the time, a lower interest rate than a 30-year, faster equity building, and a natural savings discipline. Cons: the required monthly payment is typically 30 to 40 percent higher than the equivalent 30-year mortgage, there is less budget flexibility for unexpected income changes, and the higher payment can make qualifying more difficult. The 15-year is ideal when the payment fits comfortably within the 28/36 affordability guidelines.' },
  { q: 'Can I pay off a 30-year mortgage in 15 years by making extra payments?', a: 'Yes, and this is a popular strategy. You take the 30-year for its lower required payment and flexibility, but pay enough extra principal each month to match what a 15-year payment would be. If your income changes, you can reduce or stop the extra payments. The trade-off is that you lose the lower interest rate that comes with an actual 15-year loan, so you will pay somewhat more in total interest than a pure 15-year mortgage — but you gain the safety net of a lower minimum payment.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        On a $350,000 mortgage at today&apos;s rates, choosing a 30-year term over a 15-year term
        costs an extra <strong>$295,000 in interest</strong>. That&apos;s not a small rounding difference —
        it&apos;s the price of flexibility.
      </p>
      <p>
        Neither term is universally better. Here&apos;s the full picture so you can compare them
        clearly before you decide.
      </p>

      <h2>Side-by-Side Comparison: $350,000 Loan at 7%</h2>
      <p>
        Using a $350,000 loan with a 30-year rate of 7% and a 15-year rate of 6.35%
        (the typical rate spread between the two terms):
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>30-Year at 7%</th>
            <th>15-Year at 6.35%</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Monthly payment</td><td>$2,329</td><td>$3,022</td></tr>
          <tr><td>Total paid</td><td>$838,440</td><td>$543,960</td></tr>
          <tr><td>Total interest</td><td>$488,440</td><td>$193,960</td></tr>
          <tr><td>You save</td><td colSpan={2} style={{textAlign: 'center'}}>$294,480 with the 15-year</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>The monthly difference is $693.</strong> That&apos;s what the 15-year costs extra each month
        to save nearly $295,000 over the life of the loan. Whether that trade-off makes sense
        depends entirely on your financial situation.</p>
      </div>

      <h2>Why the Interest Gap Is So Large</h2>
      <p>
        Two forces compound together to create that $295,000 gap:
      </p>
      <ul>
        <li><strong>Shorter term</strong> — you pay interest for 15 years instead of 30, so there are 180 fewer months of compounding.</li>
        <li><strong>Lower rate</strong> — the 15-year mortgage typically comes with a rate 0.5–0.75% below a 30-year, because lenders take on less risk with a shorter loan.</li>
      </ul>
      <p>
        Remove either factor and the gap shrinks. Together, they make the 15-year dramatically
        cheaper in total cost.
      </p>

      <h2>Equity Build-Up: How Fast You Own Your Home</h2>
      <p>
        Beyond total interest, the two loans differ sharply in how fast you accumulate equity.
        On a $350,000 loan, after 5 years:
      </p>
      <ul>
        <li><strong>30-year:</strong> balance ~$323,000 — you&apos;ve paid off about $27,000</li>
        <li><strong>15-year:</strong> balance ~$264,000 — you&apos;ve paid off about $86,000</li>
      </ul>
      <p>
        The 15-year borrower has more than three times the equity after five years. That matters
        when you sell, refinance, or tap a home equity line.
      </p>

      <h2>The Case for the 30-Year</h2>
      <p>
        Despite the higher interest cost, the 30-year has genuine advantages that make it the
        right choice for many borrowers.
      </p>
      <p>
        <strong>Cash flow flexibility.</strong> The $693/month difference can fund an emergency reserve,
        max out retirement contributions, or simply prevent financial stress during slow months.
        That flexibility has real, measurable value — especially early in a career.
      </p>
      <p>
        <strong>Voluntary extra payments beat forced higher payments.</strong> You can take a 30-year
        mortgage and pay extra principal every month to approximate a 15-year payoff. If finances
        tighten, you drop back to the minimum. The 15-year gives no such option.
      </p>
      <p>
        <strong>Investment opportunity cost.</strong> If your mortgage rate is lower than what you
        can reliably earn investing, the $693/month deployed into the market may outpace the interest
        savings. At 7%, this math is closer than it was at 3%.
      </p>

      <h2>The Case for the 15-Year</h2>
      <p>
        The 15-year tends to make sense when:
      </p>
      <ul>
        <li>The higher payment fits comfortably — meaning you can make it even in a lean month</li>
        <li>You&apos;re buying later in life and want to be debt-free before retirement</li>
        <li>You have stable income and fully-funded retirement accounts already</li>
        <li>The forced paydown discipline is the point — you want the commitment to eliminate the debt</li>
      </ul>

      <h2>The 30-Year Tends to Make Sense When</h2>
      <ul>
        <li>The lower payment frees up money for retirement accounts with an employer match (that&apos;s guaranteed return)</li>
        <li>Your income is variable, you&apos;re early in your career, or you have other financial goals competing for the $693/month</li>
        <li>You plan to move or refinance within 7–10 years, reducing the interest advantage of the 15-year</li>
        <li>You want the flexibility to pay like a 15-year but need the safety net of a lower minimum</li>
      </ul>

      <h2>The Break-Even Point</h2>
      <p>
        If you plan to sell or refinance within a few years, the 15-year&apos;s interest savings shrink
        considerably. You need to hold the loan long enough to recoup the higher monthly payments
        through reduced interest. For most borrowers who stay in a home 7+ years, the 15-year
        clearly wins on total cost.
      </p>

      <h2>Run Your Own Numbers</h2>
      <p>
        The right answer depends on your exact loan amount, current rate offers, income, and goals.
        Use <Link href="/calculators/mortgage/compare">FinWiser&apos;s free mortgage comparison calculator</Link> to
        enter your numbers and see the exact monthly payment, total interest, and equity timeline
        for both options side by side.
      </p>

    </ArticleLayout>
  )
}
