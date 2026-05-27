import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('extra-mortgage-payments-how-much-can-you-save')!

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
  { q: "How much do extra mortgage payments really save?", a: "The savings depend on your loan balance, rate, and how much extra you pay. On a $300,000 30-year mortgage at 7%, paying an extra $100 per month saves roughly $44,000 in interest and cuts about 4 years off the loan. Paying an extra $200 per month saves about $72,000 and cuts 7 years. Paying an extra $500 per month saves over $120,000 and cuts more than 12 years. Every dollar of extra principal payment saves multiple dollars in future interest." },
  { q: "Is it worth making extra mortgage payments?", a: "It depends on your interest rate and alternative uses for the money. Extra mortgage payments are effectively a guaranteed return equal to your mortgage rate. At 7%, every dollar you pay reduces future interest at 7%. If your mortgage rate is low and you can reliably earn more by investing, investing may come out ahead mathematically. At higher rates of 6 to 8% or above, extra mortgage payments often beat low-risk alternatives. There is also real non-financial value in owning your home free and clear sooner." },
  { q: "What happens when you pay extra on mortgage principal?", a: "When you designate a payment as extra principal, it reduces your outstanding balance immediately. Because mortgage interest is calculated on the balance each month, a lower balance means less interest accrues the next month and every month after. The required monthly payment stays fixed; what changes is that you reach payoff sooner. The extra principal also builds equity faster, which matters if you plan to sell or refinance." },
  { q: "Should I pay extra on my mortgage or invest the money?", a: "This is one of the most common personal finance dilemmas, and the answer depends on your mortgage rate and risk tolerance. At historically low rates like 3 to 4%, money invested in a diversified index fund has historically outperformed early mortgage payoff over long periods. At higher rates like 6 to 8%, paying down mortgage debt becomes more competitive. A practical approach: contribute to retirement accounts first, especially to capture any employer match, then direct remaining surplus toward the mortgage." },
  { q: "How much does $200 extra per month save on a mortgage?", a: "On a $300,000 30-year mortgage at 7%, adding $200 per month in extra principal payments saves approximately $72,000 in total interest and shortens the loan by about 7 years. On a $400,000 mortgage at the same rate the savings are roughly $85,000 to $90,000, cutting about 6 to 7 years. Use a mortgage calculator to enter your exact numbers. The savings on larger balances or higher-rate loans are proportionally greater." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        Most homeowners sign a 30-year mortgage and then pay exactly what the bank asks every
        month for three decades. It works, but it&apos;s the most expensive way to own a home.
        Even modest extra payments — $50, $100, $200 a month — can shave years off the loan
        and save tens of thousands of dollars in interest.
      </p>
      <p>
        Here&apos;s how the math works, with real numbers across different scenarios.
      </p>

      <h2>Why Extra Payments Have an Outsized Effect</h2>
      <p>
        Mortgage interest is calculated on your remaining balance. When you make an extra payment
        directly to principal, you immediately reduce the balance on which future interest is
        calculated — not just for next month, but for every remaining month of the loan.
      </p>
      <p>
        This creates a chain reaction: lower balance → less interest → more of every future
        payment goes to principal → balance drops faster → even less interest. The effect
        compounds over time.
      </p>
      <div className="callout">
        <p><strong>The baseline:</strong> A $300,000 mortgage at 7% for 30 years has a monthly
        payment of $1,996. Over 30 years, you&apos;ll make $718,560 in total payments — paying
        $418,560 in interest on a $300,000 loan.</p>
      </div>

      <h2>What $100/Month Extra Actually Does</h2>
      <p>
        Adding $100/month to that same $300,000 mortgage at 7%:
      </p>
      <ul>
        <li>Cuts the loan term from 30 years to about <strong>26 years</strong></li>
        <li>Saves approximately <strong>$44,000 in total interest</strong></li>
        <li>Costs you $100/month × 312 months = $31,200 in extra payments</li>
      </ul>
      <p>
        You spend $31,200 more and save $44,000. That&apos;s a $12,800 net gain — plus you&apos;re
        mortgage-free four years earlier.
      </p>

      <h2>What $200/Month Extra Does</h2>
      <p>
        Double the extra payment to $200/month on the same loan:
      </p>
      <ul>
        <li>Loan term drops from 30 years to about <strong>23 years</strong></li>
        <li>Total interest saved: approximately <strong>$76,000</strong></li>
        <li>Extra payments made: $200 × 276 months = $55,200</li>
      </ul>
      <p>
        Again, the net gain is over $20,000, plus 7 fewer years of mortgage payments. That&apos;s
        7 years of $1,996/month — about $167,000 in freed-up cash flow once the loan is paid off.
      </p>

      <h2>One Extra Payment Per Year</h2>
      <p>
        If a fixed extra monthly amount feels tight, try making one full extra payment per year
        instead. Practically, the easiest way is to divide your monthly payment by 12 and add
        that amount to each month&apos;s payment — the effect is the same as one extra annual payment.
      </p>
      <p>
        On a $300,000 mortgage at 7%, one extra full payment per year cuts the loan from 30
        years to roughly 24 years and saves around $80,000 in total interest. The extra monthly
        cost is about $167 — less than a streaming service and a gym membership combined.
      </p>

      <h2>Lump-Sum Payments: The Timing Effect</h2>
      <p>
        If you receive a tax refund, bonus, or inheritance, applying it as a lump sum to your
        principal is one of the highest-return things you can do with it — especially early
        in the loan.
      </p>
      <p>
        A $5,000 lump-sum payment applied in year two of a 30-year mortgage at 7% saves
        approximately $18,000 in total interest. The same payment in year 15 saves about
        $8,000 — still worthwhile, but less than half as effective, because the balance is lower
        and fewer years remain for the interest savings to accumulate.
      </p>

      <h2>One Rule to Always Follow</h2>
      <p>
        When making extra payments, always specify that the additional amount should be applied
        to <strong>principal</strong> — not to future payments. Contact your servicer or use
        your online payment portal to designate this. If you don&apos;t, some lenders treat extra
        funds as an advance on next month&apos;s payment, which doesn&apos;t reduce your balance the
        same way and costs you the compounding benefit.
      </p>

      <h2>Is It Always the Right Move?</h2>
      <p>
        Extra mortgage payments make the most sense when:
      </p>
      <ul>
        <li>Your mortgage rate is higher than what you could reliably earn investing</li>
        <li>You have no high-interest consumer debt (pay that off first)</li>
        <li>You have an emergency fund in place</li>
        <li>You&apos;re already contributing enough to capture any employer retirement match</li>
      </ul>
      <p>
        If your mortgage rate is 3.5% and you&apos;re not maxing out your 401(k), investing the
        extra money may produce better long-term results. The math depends on your specific rate
        versus expected investment returns — run both scenarios before deciding.
      </p>
      <p>
        Use <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> to run your own numbers in seconds — see exactly
        how much interest you save and how many years you cut with different extra payment amounts.
      </p>

    </ArticleLayout>
  )
}
