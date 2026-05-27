import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('how-to-save-on-mortgage-interest')!

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
  { q: "How can I reduce the total interest I pay on my mortgage?", a: "The most impactful ways to reduce mortgage interest are to make extra principal payments regularly, refinance to a lower rate when rates drop meaningfully, make a larger down payment upfront to reduce the loan amount, choose a shorter loan term like 15 years instead of 30, and maintain excellent credit to qualify for the best available rates. Even small consistent extras like $100 to $200 per month toward principal can save tens of thousands over the life of a 30-year loan." },
  { q: "Does a higher down payment reduce mortgage interest?", a: "Yes, in two ways. First, a larger down payment means a smaller loan amount, so you pay interest on less money throughout the loan. Second, a down payment of 20% or more eliminates PMI, which reduces your monthly payment further. A higher down payment may also qualify you for a marginally lower interest rate, as lenders view lower loan-to-value loans as lower risk. The trade-off is the opportunity cost of that capital, since money used for a down payment cannot be invested elsewhere." },
  { q: "How does my credit score affect my mortgage interest rate?", a: "Your credit score has one of the largest single impacts on the rate you are offered. Borrowers with scores above 760 typically receive the best available rates. Each tier lower, at 740, 720, 700, and below 680, often adds 0.25 to 0.5 percentage points to the rate. On a $300,000 mortgage, a 1% rate difference amounts to roughly $60,000 to $70,000 in additional interest over 30 years. Improving your score before applying, even by 20 to 30 points, can meaningfully lower your lifetime interest cost." },
  { q: "Is it worth buying down your mortgage interest rate with points?", a: "Buying discount points means paying 1% of the loan amount upfront to reduce the interest rate by roughly 0.25%. Whether it is worth it depends on how long you will stay in the home. Divide the upfront cost by the monthly savings to find your break-even point, which is typically 5 to 8 years. If you plan to stay in the home longer than the break-even period, buying points saves money. If you might move or refinance before then, the upfront cost will not be recovered." },
  { q: "Can I negotiate a lower mortgage interest rate?", a: "Yes, and this is more common than most borrowers realize. Lenders have some discretion in rate setting, and presenting a competing offer from another lender often results in a match or a better offer. Working with a mortgage broker gives you access to rates from multiple lenders at once. You can also negotiate closing costs and point structures. Improving your credit score, reducing your debt-to-income ratio, and making a larger down payment all strengthen your position before applying." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        A 30-year mortgage at 7% on a $350,000 loan will cost you $488,000 in total interest
        over three decades. That&apos;s not a typo — you&apos;ll pay back the loan amount itself, plus
        an additional $488,000 just in interest charges. Most homeowners accept this as the
        unavoidable cost of homeownership. It doesn&apos;t have to be.
      </p>
      <p>
        Here are seven ways to reduce what you pay in mortgage interest — some you can act on
        today, others to consider at your next refinance.
      </p>

      <h2>1. Make One Extra Payment Per Year</h2>
      <p>
        Divide your monthly payment by 12 and add that amount to each month&apos;s payment. The
        practical effect is one full extra payment per year, applied entirely to principal.
      </p>
      <p>
        On a $350,000 mortgage at 7%, this cuts the loan from 30 years to about 24 and saves
        roughly $100,000 in total interest. The extra monthly cost is around $195 — less than
        most people spend on dining out.
      </p>

      <h2>2. Round Up Your Monthly Payment</h2>
      <p>
        If your payment is $2,329, pay $2,400 or $2,500. The extra $71–$171 per month goes
        directly to principal. It adds up faster than you&apos;d expect: an extra $150/month on a
        $350,000 loan at 7% saves approximately $60,000 over the life of the loan.
      </p>
      <p>
        Always confirm with your servicer that the extra amount is applied to principal, not
        held as a credit toward next month&apos;s payment. Most online payment portals allow you
        to designate this directly.
      </p>

      <h2>3. Apply Windfalls as Lump-Sum Principal Payments</h2>
      <p>
        Tax refunds, bonuses, and inheritances are an opportunity to make a large, one-time
        principal reduction. Because mortgage interest is front-loaded, every dollar you pay
        down early eliminates years of future interest on that amount.
      </p>
      <p>
        A $5,000 lump-sum payment in year two of a 30-year mortgage at 7% saves approximately
        $18,000 in total interest. The same $5,000 invested in a savings account earning 4.5%
        would generate about $6,750 in interest over 30 years. The mortgage paydown wins
        decisively at 7%.
      </p>

      <h2>4. Put 20% Down (or More)</h2>
      <p>
        A larger down payment reduces the loan balance from day one — meaning you pay interest
        on a smaller amount for the entire life of the loan. On a $400,000 home:
      </p>
      <ul>
        <li>10% down ($40,000): loan of $360,000 at 7% = $502,000 in total interest</li>
        <li>20% down ($80,000): loan of $320,000 at 7% = $446,000 in total interest</li>
      </ul>
      <p>
        The $40,000 extra down payment saves $56,000 in interest — a 140% return on the extra
        upfront money. And at 20% down, you avoid private mortgage insurance (PMI), which can
        add $100–$350/month on top of your payment.
      </p>

      <h2>5. Shop for a Lower Interest Rate</h2>
      <p>
        Even a 0.5% rate difference has enormous impact over 30 years. On a $350,000 mortgage:
      </p>
      <ul>
        <li>At 7.5%: total interest = $524,000</li>
        <li>At 7.0%: total interest = $488,000</li>
        <li>At 6.5%: total interest = $451,000</li>
      </ul>
      <p>
        Getting quotes from multiple lenders before committing is one of the easiest ways to
        save tens of thousands of dollars. Studies show that borrowers who get just one
        additional quote save an average of $1,500 over the life of the loan. Those who get
        five quotes save significantly more.
      </p>
      <p>
        <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> makes it easy to compare what different rates mean
        for your total cost — enter two rates side by side and see the lifetime difference instantly.
      </p>

      <h2>6. Refinance to a Shorter Term</h2>
      <p>
        Refinancing a 30-year mortgage to a 15-year term typically comes with a lower rate
        (usually 0.5–0.75% less) and forces faster payoff through the higher required payment.
        On a $300,000 balance:
      </p>
      <ul>
        <li>30-year at 7%: $1,996/month, $418,000 in total interest</li>
        <li>15-year at 6.35%: $2,588/month, $165,840 in total interest</li>
      </ul>
      <p>
        The $592/month increase in payment saves $252,000 in interest and eliminates 15 years
        of debt. Refinancing also comes with closing costs (typically 2–5% of the loan), so
        calculate your break-even point before committing.
      </p>

      <h2>7. Switch to Biweekly Payments</h2>
      <p>
        Instead of 12 monthly payments, you make 26 biweekly half-payments. Because 26 ÷ 2
        = 13, you end up making one extra full payment per year automatically — without
        it feeling like a budget sacrifice.
      </p>
      <p>
        Many mortgage servicers offer a biweekly payment program. Before enrolling, verify
        two things: that the payment is applied immediately (not held until month-end), and
        that there are no fees for the program. If there are fees, just add the extra amount
        to your monthly payment manually instead.
      </p>

      <h2>Where to Start</h2>
      <p>
        You don&apos;t need to do all seven. Pick one or two that fit your budget and start there.
        The most impactful combination for most people: shop for the lowest rate available,
        put 20% down if possible, and make one extra payment per year.
      </p>
      <p>
        Use <Link href="/calculators/mortgage">FinWiser&apos;s free mortgage calculator</Link> to run your own numbers in seconds — model
        different rates, terms, and extra payment amounts to see exactly how much you could
        save on your specific loan.
      </p>

    </ArticleLayout>
  )
}
