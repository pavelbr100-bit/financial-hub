import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('how-car-loan-interest-works')!
const related = [
  getArticle('how-to-pay-off-car-loan-early')!,
  getArticle('how-to-get-best-car-loan-rate')!,
  getArticle('new-vs-used-car-loan')!,
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
  keywords: [
    'car loan calculator',
    'auto loan payment',
    'car loan interest rate',
    'monthly car payment calculator',
    'how car loan interest works',
    'auto loan amortization',
    'car loan total interest',
  ],
}

const faq = [
  { q: "How is interest calculated on a car loan?", a: "Most car loans use simple interest calculated on the outstanding principal balance each month. Interest for the period equals the balance multiplied by the annual rate divided by 12. The rest of your fixed monthly payment reduces the principal. Because the balance decreases with each payment, the interest portion shrinks over time. Early payments go mostly toward interest; later payments go mostly toward principal. This is why extra payments made early in the loan save more than the same payments made near the end." },
  { q: "Do car loans use simple or compound interest?", a: "Most standard car loans use simple interest, not compound interest. Interest accrues on the outstanding balance, and your fixed monthly payment covers that period's interest plus a portion of principal. There is no interest-on-interest mechanic the way compound interest works. However, if you miss a payment or your loan has a capitalization clause, unpaid interest may be added to your principal balance, which would then accrue more interest in future periods." },
  { q: "What happens if I make extra car loan payments?", a: "Extra payments applied to principal reduce your balance faster, which means less interest accrues each subsequent month. This shortens the total loan term and reduces total interest paid. On a $25,000 car loan at 7% over 60 months, adding $100 per month extra saves roughly $600 to $800 in interest and pays off the loan about 6 to 8 months early. Always confirm with your lender that extra payments are applied to principal and not held for future scheduled payments." },
  { q: "How much total interest will I pay on a $30,000 car loan?", a: "At a 7% rate over 60 months, a $30,000 car loan results in roughly $5,600 in total interest with a monthly payment of about $594. Stretched to 72 months the total interest rises to roughly $6,800 with a $512 monthly payment. At 84 months the total interest is about $8,100 with a $459 payment. A higher rate amplifies these numbers significantly. The same $30,000 loan at 12% over 60 months costs approximately $9,700 in total interest charges." },
  { q: "Does paying biweekly help with a car loan?", a: "Yes, though the benefit is smaller than with a 30-year mortgage because car loan terms are much shorter. Making a half-payment every two weeks instead of one full payment monthly results in 26 half-payments per year, which is equivalent to 13 full monthly payments. That one extra payment per year reduces principal faster and saves some interest. On a typical 5-year car loan the savings are a few hundred dollars and one to two months off the payoff date." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        When you take out a car loan, the lender quotes you a monthly payment and a rate. Most
        people focus on the payment — whether it fits the budget — and sign. But the rate
        determines something more important: how much of every dollar you send goes to the bank
        versus how much actually pays off your car.
      </p>
      <p>
        Understanding how car loan interest is calculated lets you make smarter decisions about
        the rate, the term, and when it makes sense to pay extra.
      </p>

      <h2>How Interest Is Calculated Each Month</h2>
      <p>
        Car loans use simple interest, not compound interest. Each month, your interest charge
        is calculated on the current outstanding balance:
      </p>
      <p>
        <strong>Monthly interest = balance × (annual rate ÷ 12)</strong>
      </p>
      <p>
        On a $30,000 loan at 7%, the first month&apos;s interest is $30,000 × (7% ÷ 12) = $175.
        Your total payment might be $594. So $175 goes to interest and $419 goes to principal,
        reducing your balance to $29,581.
      </p>
      <p>
        Month two: interest is $29,581 × 0.583% = $172.43. Slightly less interest, slightly
        more principal. This shift continues every month until the loan is paid off.
      </p>

      <h2>Why Early Payments Are Mostly Interest</h2>
      <p>
        Because interest is calculated on the remaining balance, the interest portion of each
        payment is highest at the start — when the balance is largest — and declines steadily
        over time. On a 60-month loan at 7%:
      </p>
      <ul>
        <li><strong>Month 1:</strong> $175 interest / $419 principal</li>
        <li><strong>Month 12:</strong> $148 interest / $446 principal</li>
        <li><strong>Month 30:</strong> $105 interest / $489 principal</li>
        <li><strong>Month 60:</strong> ~$3 interest / ~$591 principal</li>
      </ul>
      <p>
        This front-loading means that paying extra early in the loan — when the balance is
        high — eliminates future interest on that amount. A $1,000 extra payment in month 3
        saves significantly more than the same $1,000 in month 50.
      </p>

      <h2>The True Cost at Different Rates</h2>
      <p>
        The rate doesn&apos;t just affect your monthly payment — it determines the total amount
        you&apos;ll pay over the life of the loan. On a $30,000 loan over 60 months:
      </p>
      <ul>
        <li>At 5%: $566/month, $3,968 in total interest</li>
        <li>At 7%: $594/month, $5,640 in total interest</li>
        <li>At 10%: $637/month, $8,224 in total interest</li>
        <li>At 15%: $714/month, $12,819 in total interest</li>
      </ul>
      <p>
        The difference between 5% and 10% is $4,256 in total interest on the same car. That&apos;s
        not a small number — it&apos;s roughly 14% of the purchase price paid purely in financing
        costs.
      </p>

      <h2>Longer Terms Mean More Total Interest</h2>
      <p>
        Stretching a loan to 72 or 84 months lowers the monthly payment but keeps the balance
        high for longer — which means more interest accrues. On a $30,000 loan at 7%:
      </p>
      <ul>
        <li>48 months: $718/month, $4,450 total interest</li>
        <li>60 months: $594/month, $5,640 total interest</li>
        <li>72 months: $513/month, $6,928 total interest</li>
        <li>84 months: $455/month, $8,209 total interest</li>
      </ul>
      <p>
        An 84-month loan costs $3,759 more in interest than a 48-month loan — just to borrow
        the same $30,000 for an extra three years. And that&apos;s before you factor in depreciation,
        which can leave you owing more than the car is worth for much of the loan.
      </p>
      <div className="callout">
        <p><strong>The upside-down risk:</strong> New cars lose 15–25% of value in the first year. On
        a $30,000 car with no down payment and an 84-month loan, you could easily owe $28,000 after
        12 months while the car is worth $22,000 — $6,000 upside-down. If the car is totaled or you
        need to sell, you still owe the difference. 48- to 60-month terms minimize this risk. If you
        need an 84-month term to make the payment fit, the vehicle may be more than you can afford.</p>
      </div>

      <h2>How Your Down Payment Affects Total Cost</h2>
      <p>
        A larger down payment reduces your loan amount from day one, which cuts both the monthly
        payment and the total interest you pay. The standard guidance: <strong>20% down on a new
        car, 10% on used</strong>. At 20% down on a new car, you&apos;re also less likely to go
        immediately upside-down due to first-year depreciation.
      </p>
      <p>
        On a $30,000 car at 7% over 60 months:
      </p>
      <ul>
        <li>No down payment: $594/month, $5,640 total interest, loan starts at $30,000</li>
        <li>10% down ($3,000): $535/month, $5,076 total interest, loan starts at $27,000</li>
        <li>20% down ($6,000): $475/month, $4,512 total interest, loan starts at $24,000</li>
      </ul>
      <p>
        A trade-in counts as a down payment — its appraised value reduces the amount you need to
        finance. Get your trade-in appraised independently before negotiating, so you can evaluate
        the dealer&apos;s offer against a benchmark.
      </p>

      <h2>APR vs. Interest Rate</h2>
      <p>
        Lenders may advertise an interest rate but are legally required to disclose the APR
        (Annual Percentage Rate), which includes fees like origination charges and dealer
        markups. Always compare APRs — not just interest rates — when shopping loans from
        different lenders. Two loans with the same stated interest rate can have meaningfully
        different APRs depending on the fees baked in.
      </p>

      <h2>What This Means for Your Decision</h2>
      <div className="callout">
        <p><strong>Common mistake:</strong> Negotiating by monthly payment instead of total cost.
        A dealer who extends your loan from 60 to 72 months drops the payment by about $40–$50 —
        which feels like a win. But on a $30,000 loan at 7%, those 12 extra months cost you roughly
        $1,300 in additional interest. The dealer isn&apos;t lowering your cost; they&apos;re spreading it
        thinner and collecting more of it. Always evaluate a car loan on total interest paid, not
        the monthly number alone.</p>
      </div>
      <p>
        When evaluating a car loan, look at three numbers together: the monthly payment, the
        total interest paid, and the total cost of the vehicle including financing. A payment
        that looks affordable can still cost thousands more than necessary if the rate is high
        or the term is long.
      </p>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to
        model your loan with different rates and terms — and see exactly how each combination
        affects your total interest cost before you sign.
      </p>

    </ArticleLayout>
  )
}
