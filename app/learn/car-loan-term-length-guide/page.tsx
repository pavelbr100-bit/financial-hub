import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('car-loan-term-length-guide')!
const related = [
  getArticle('how-car-loan-interest-works')!,
  getArticle('how-to-pay-off-car-loan-early')!,
  getArticle('how-to-get-best-car-loan-rate')!,
]

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
  keywords: [
    'car loan calculator',
    'monthly car payment calculator',
    'auto loan payment',
    'car loan interest rate',
    '72 month car loan',
    '84 month car loan',
    'car loan term length',
  ],
}

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related}>

      <p>
        Dealers know that buyers focus on the monthly payment, not the total cost. A longer
        loan term is the easiest way to make a car seem affordable — but it comes at a real
        price. Here&apos;s what the numbers actually look like across different term lengths.
      </p>

      <h2>The Trade-off in One Table</h2>
      <p>
        On a $30,000 loan at 7%:
      </p>
      <ul>
        <li><strong>48 months:</strong> $718/month — $4,450 total interest</li>
        <li><strong>60 months:</strong> $594/month — $5,640 total interest</li>
        <li><strong>72 months:</strong> $513/month — $6,928 total interest</li>
        <li><strong>84 months:</strong> $455/month — $8,209 total interest</li>
      </ul>
      <p>
        Going from 48 to 84 months saves $263/month in payments — but costs $3,759 more
        in total interest. That&apos;s the hidden price of the lower payment.
      </p>
      <p>
        And it&apos;s actually worse than this, because longer loan terms typically come with
        slightly higher interest rates (lenders charge more for the extended risk), so the
        real gap is often larger.
      </p>

      <h2>The Depreciation Problem</h2>
      <p>
        The other issue with long loan terms is depreciation. A new car loses 15–20% of its
        value in the first year and about 50% within five years. If you spread a $35,000 loan
        over 84 months at 7%, here&apos;s how your loan balance compares to the car&apos;s estimated
        value over time:
      </p>
      <ul>
        <li><strong>Year 1:</strong> Loan balance ~$32,000 / Car value ~$28,000 — underwater by $4,000</li>
        <li><strong>Year 2:</strong> Loan balance ~$29,000 / Car value ~$23,000 — underwater by $6,000</li>
        <li><strong>Year 3:</strong> Loan balance ~$25,500 / Car value ~$19,000 — underwater by $6,500</li>
      </ul>
      <p>
        Being &quot;underwater&quot; — owing more than the car is worth — means that if you need to
        sell or trade in the car, you&apos;ll owe money out of pocket to close the loan. It also
        creates risk if the car is totaled: your insurance pays market value, but you still
        owe the full loan balance.
      </p>

      <h2>When Longer Terms Make Sense</h2>
      <p>
        Longer terms aren&apos;t always wrong. They can make sense when:
      </p>
      <ul>
        <li>You have tight cash flow and need the lower monthly payment to avoid financial stress</li>
        <li>The rate difference between terms is small and you plan to pay extra when possible</li>
        <li>You&apos;re buying a high-quality vehicle you plan to keep for 10+ years, and the depreciation risk is lower</li>
      </ul>
      <p>
        The key is making the choice with full information — not because the payment seems
        manageable without looking at what you&apos;re actually paying over time.
      </p>

      <h2>A Simple Rule of Thumb</h2>
      <p>
        For most buyers, keeping the loan term at 60 months or under strikes the best balance
        between payment and total cost. If the payment isn&apos;t affordable at 60 months, that&apos;s
        often a signal to consider a less expensive vehicle — not a reason to extend to 72 or 84.
      </p>
      <div className="callout">
        <p>
          <strong>Quick check:</strong> If your car payment on a 60-month loan is more than
          15% of your gross monthly income, the car may be stretching your budget. At 20%+,
          it&apos;s putting real financial pressure on everything else.
        </p>
      </div>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to
        compare your loan across different terms — you can see the monthly payment and total
        interest side by side for 48, 60, 72, and 84 months in seconds.
      </p>

    </ArticleLayout>
  )
}
