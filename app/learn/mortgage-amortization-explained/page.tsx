import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('mortgage-amortization-explained')!

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
  { q: "Why do I pay mostly interest at the start of my mortgage?", a: "Mortgage interest is charged on the outstanding balance each month. At the beginning of a 30-year mortgage the balance is at its full amount, so the interest portion of each payment is at its maximum. As you pay down principal over the years the balance shrinks, interest charges decrease, and more of each payment goes toward principal. This pattern is a mathematical consequence of how amortization works, not a fee or a penalty from the lender." },
  { q: "How does mortgage amortization work?", a: "Amortization spreads loan repayment evenly across a fixed number of payments. Each payment covers the month's interest, which is the balance multiplied by the monthly rate, plus a portion of principal. Because the balance decreases each month the interest portion gradually shrinks and the principal portion grows. Your payment amount stays the same throughout the loan, but its composition shifts from mostly interest at the start to mostly principal near the end." },
  { q: "How much of my mortgage payment goes to principal in the early years?", a: "In the first year of a 30-year mortgage at 7%, roughly 12 to 15 percent of each payment reduces the principal. The rest is interest. By year 10 about 25 to 30 percent goes to principal. By year 20 it is roughly 50 percent. In the final year nearly the entire payment is principal. The exact split depends on your interest rate and loan term; higher rates mean even more of early payments go to interest." },
  { q: "Does making extra payments change my amortization schedule?", a: "Yes. Extra principal payments shorten the amortization schedule by reducing the outstanding balance, which reduces future interest charges. The required monthly payment stays the same, but you reach payoff sooner. Even small consistent extras like $100 per month can cut several years off a 30-year mortgage. A mortgage calculator lets you see exactly how your specific extra payment amount changes your payoff date and total interest cost." },
  { q: "What is negative amortization on a mortgage?", a: "Negative amortization occurs when a monthly payment is too small to cover even the interest due, so the unpaid interest gets added to the loan balance. This means the balance grows over time instead of shrinking. Negative amortization loans were common in the early 2000s with certain adjustable-rate products but are now rare. They are risky for borrowers because you can end up owing more than you originally borrowed." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        You make your first mortgage payment — $1,800, say — and feel good about chipping away at
        that $300,000 balance. Then you check your statement and realize the balance only dropped
        by about $200. Where did the other $1,600 go?
      </p>
      <p>
        The answer is amortization, and understanding how it works is one of the most useful things
        you can do as a homeowner. Once you see the math clearly, you&apos;ll know exactly why extra
        payments are so powerful and when they matter most.
      </p>

      <h2>What Amortization Actually Means</h2>
      <p>
        Amortization is just a fancy word for spreading loan payments over time in a structured way.
        With a fixed-rate mortgage, you pay the same dollar amount every month for the life of the
        loan. But the split between interest and principal — the portion that actually reduces your
        balance — changes dramatically from payment to payment.
      </p>
      <p>
        Here&apos;s the key: interest is calculated on your <em>remaining balance</em>, not your
        original loan amount. In month one, that balance is at its highest, so interest takes the
        biggest bite. As the balance falls, so does the interest charge — which means more of each
        payment goes toward principal.
      </p>

      <h2>The Numbers in Year One</h2>
      <p>
        Take a $300,000 mortgage at 7% for 30 years. The monthly payment works out to $1,996.
        Here&apos;s how that first payment breaks down:
      </p>
      <ul>
        <li>Interest: $1,750 (7% ÷ 12 months × $300,000 balance)</li>
        <li>Principal: $246</li>
        <li>New balance: $299,754</li>
      </ul>
      <p>
        In month two, you owe slightly less, so the interest charge drops by about $1.44. That
        extra $1.44 goes to principal instead. The shift is tiny at first — but it compounds over
        the entire life of the loan.
      </p>
      <div className="callout">
        <p><strong>Reality check:</strong> After 12 months of $1,996 payments — $23,952 total
        paid — your balance has only dropped from $300,000 to roughly $297,000. You&apos;ve paid nearly
        $24,000 and eliminated less than $3,000 in debt. The rest went to interest.</p>
      </div>

      <h2>The Front-Loading Effect</h2>
      <p>
        This front-loading is by design, not a trick. Because your balance is highest at the start,
        that&apos;s when the lender&apos;s money is most at risk — so the interest charge is highest.
        It&apos;s mathematically consistent, but it means the early years of a mortgage feel like
        running on a treadmill.
      </p>
      <p>
        On a 30-year mortgage at 7%, the crossover point — where principal finally exceeds interest
        in each payment — doesn&apos;t happen until month 153, which is roughly the 13th year. For
        the first 12 and a half years, you&apos;re paying more interest than principal every single month.
      </p>

      <h2>Why the Total Cost Is So High</h2>
      <p>
        Over 30 years, that $300,000 mortgage costs $718,560 in total payments — meaning you pay
        $418,560 in interest alone. That&apos;s more than the original loan amount, paid back in full,
        in interest charges. It&apos;s not a rip-off; it&apos;s just the math of borrowing a large sum over
        a very long period.
      </p>
      <p>
        A 15-year mortgage at 6.5% on the same $300,000 costs $484,968 total — about $233,592
        less in interest. The monthly payment is higher ($2,139 vs $1,996), but the total savings
        are enormous. <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> lets you run both scenarios side by side
        in seconds.
      </p>

      <h2>What This Means for Extra Payments</h2>
      <p>
        Because interest is calculated on your remaining balance, every dollar of extra principal
        you pay eliminates future interest charges on that dollar for the rest of the loan. An
        extra $100/month in year one doesn&apos;t just save $100 — it saves $100 plus all the interest
        that would have accrued on it over the remaining 29 years.
      </p>
      <p>
        That same $100/month extra on a $300,000 mortgage at 7% saves approximately $44,000 in
        total interest and cuts the loan term by about 4 years. The earlier you start, the more
        powerful the effect.
      </p>

      <h2>How to Use Your Amortization Schedule</h2>
      <p>
        Your mortgage servicer is required to provide an amortization schedule at closing, or you
        can generate one yourself. Look for three things:
      </p>
      <ul>
        <li><strong>Total interest over the full term</strong> — this is your benchmark for how
        much you could save with extra payments.</li>
        <li><strong>Your balance at year 5 and year 10</strong> — useful if you&apos;re planning to
        sell or refinance.</li>
        <li><strong>The crossover point</strong> — the payment number where principal starts
        exceeding interest. Knowing this makes the front-loading feel less abstract.</li>
      </ul>
      <p>
        The schedule also helps you see exactly how much a refinance would cost in terms of
        resetting the clock — if you refinance a 30-year mortgage after year 10 into a new
        30-year loan, you&apos;re effectively starting over on the interest-heavy early years.
      </p>

      <h2>The Takeaway</h2>
      <p>
        Mortgage amortization isn&apos;t a scam — it&apos;s just how compound interest math works when
        you&apos;re on the borrowing side. The system is predictable and transparent, which means you
        can plan around it. Understanding where your payment goes each month transforms you from
        a passive payer into someone who can make strategic decisions about extra payments,
        refinancing, and total loan cost.
      </p>
      <p>
        Use <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> to run your own numbers in seconds — see your
        full payment breakdown, total interest, and how extra payments would change your timeline.
      </p>

    </ArticleLayout>
  )
}
