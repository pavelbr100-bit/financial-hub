import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('biweekly-vs-monthly-mortgage-payments')!
const related = [
  getArticle('extra-mortgage-payments-how-much-can-you-save')!,
  getArticle('mortgage-payoff-strategies')!,
  getArticle('15-year-vs-30-year-mortgage')!,
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
  { q: 'How much do biweekly mortgage payments actually save?', a: 'On a $300,000 mortgage at 7% over 30 years, switching to biweekly payments saves approximately $62,000 in interest and pays off the loan about 4.5 years early. The savings are larger on bigger loans and higher interest rates. The mechanism is simple: 26 biweekly half-payments equal 13 full monthly payments per year instead of 12 — one extra payment per year applied entirely to principal.' },
  { q: 'Do biweekly mortgage payments actually work?', a: 'Yes, but only if extra payments go directly to reducing your principal. Some lenders hold biweekly payments and only credit the account once a full monthly payment accumulates, which eliminates the benefit. Before switching, confirm with your lender exactly how biweekly payments are processed — you want each payment credited immediately to reduce the principal on which interest is calculated.' },
  { q: 'Is it better to make biweekly payments or one extra payment per year?', a: 'They produce nearly identical results because they achieve the same thing: one extra monthly payment applied to principal each year. Making one extra lump-sum payment each January or December is mathematically equivalent to a biweekly schedule. The biweekly approach has a behavioral advantage — the extra payment happens automatically in small increments rather than requiring a conscious decision to write a large check once a year.' },
  { q: 'Can I set up biweekly payments on any mortgage?', a: 'Most lenders allow biweekly payments, but the process varies. Some lenders offer a formal biweekly program (occasionally with a setup fee), while others simply allow you to make half-payments every two weeks. A few lenders only accept payments on their standard monthly schedule. Contact your servicer to confirm what they support. If they only accept monthly payments, you can replicate the effect by adding 1/12 of your monthly payment as extra principal each month.' },
  { q: 'What is the difference between biweekly and semi-monthly mortgage payments?', a: 'Biweekly means every two weeks — 26 payments per year. Semi-monthly means twice per month — 24 payments per year. The distinction matters: biweekly gives you 13 full monthly equivalents per year, generating an extra payment. Semi-monthly gives you exactly 12 full monthly equivalents — the same as the standard monthly schedule. Semi-monthly payments spread your cash flow more evenly but provide no interest savings on their own.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        Switching from monthly to biweekly mortgage payments is one of the simplest ways to
        save tens of thousands of dollars on your mortgage — without refinancing, without a
        larger down payment, and without changing your lifestyle much at all.
      </p>
      <p>
        Here&apos;s exactly how much it saves, why it works, and what to watch out for.
      </p>

      <h2>How Biweekly Payments Work</h2>
      <p>
        With a standard monthly mortgage, you make 12 payments per year. With a biweekly
        schedule, you pay half your monthly payment every two weeks. Since there are 52 weeks
        in a year, that means 26 half-payments — equivalent to <strong>13 full monthly payments</strong>.
      </p>
      <p>
        That one extra monthly payment per year goes entirely to principal. It doesn&apos;t reduce
        your next month&apos;s payment — it shortens the loan and cuts the interest that accrues
        on the remaining balance.
      </p>

      <h2>The Savings: $300,000 Loan at 7% Over 30 Years</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Monthly payments</th>
            <th>Biweekly payments</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Payment amount</td><td>$1,996/month</td><td>$998 every 2 weeks</td></tr>
          <tr><td>Payments per year</td><td>12</td><td>26 (= 13 monthly)</td></tr>
          <tr><td>Loan payoff</td><td>30 years</td><td>~25.5 years</td></tr>
          <tr><td>Total interest paid</td><td>$418,600</td><td>$356,400</td></tr>
          <tr><td>Interest saved</td><td colSpan={2} style={{textAlign: 'center'}}>~$62,200</td></tr>
          <tr><td>Time saved</td><td colSpan={2} style={{textAlign: 'center'}}>~4.5 years</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>$62,200 in savings and 4.5 fewer years of payments</strong> — from making the
        same half-payment every two weeks instead of a full payment once a month. No refinancing,
        no extra cash required beyond what you&apos;re already paying.</p>
      </div>

      <h2>Why the Savings Are Real (Not a Trick)</h2>
      <p>
        The math works because mortgage interest is calculated on the outstanding balance. Every
        time you reduce principal faster, less interest accrues the following period. The one
        extra monthly payment per year creates a compounding effect: a slightly lower balance
        each month means slightly less interest, which means slightly more of every future
        payment goes to principal, which lowers the balance further.
      </p>
      <p>
        It&apos;s small in any given month but accumulates to over $62,000 across the life of the loan.
      </p>

      <h2>Biweekly vs Monthly: The Break-Even Timeline</h2>
      <p>
        The savings accelerate in the back half of the loan. In the early years, the difference
        in balance is small. By year 15, the biweekly borrower has a meaningfully lower balance —
        and is paying significantly less interest each month as a result. The time savings become
        visible around year 20 when the biweekly loan starts paying off while the monthly loan
        still has 10 years remaining.
      </p>

      <h2>The Right Way to Set It Up</h2>
      <p>
        Not all biweekly programs are equal. The key question to ask your lender:
        <em> "Are biweekly payments credited immediately to reduce my principal, or are they
        held until a full monthly payment accumulates?"</em>
      </p>
      <p>
        If payments are held and credited once a month, you get no benefit — it&apos;s the same
        as paying monthly. You want each half-payment applied to principal right away.
      </p>
      <p>
        If your lender only accepts monthly payments, you can replicate the biweekly benefit
        by adding <strong>1/12 of your monthly payment</strong> as extra principal each month.
        On a $1,996 payment, that&apos;s an extra $166/month — the same as one extra annual payment
        spread evenly.
      </p>

      <h2>Is Biweekly Right for Your Situation?</h2>
      <p>
        Biweekly payments make sense when you have a stable income and can handle the slightly
        higher annual outlay without stress. The total annual cost is the same as 13 monthly
        payments vs. 12 — about 8% more per year. For most homeowners, that&apos;s manageable and
        the long-term savings are well worth it.
      </p>
      <p>
        If cash flow is unpredictable, consider making a single extra principal payment when
        you have surplus funds rather than committing to a biweekly schedule.
      </p>

      <h2>See Your Numbers</h2>
      <p>
        The savings on your loan depend on your specific balance, rate, and remaining term.
        Use <Link href="/calculators/biweekly-mortgage">FinWiser&apos;s free biweekly mortgage calculator</Link> to
        enter your numbers and see exactly how much interest and time you&apos;d save — with a
        full side-by-side amortization schedule for both payment schedules.
      </p>

    </ArticleLayout>
  )
}
