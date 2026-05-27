import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('new-car-vs-used-car-loan')!
const related = [
  getArticle('how-to-get-best-car-loan-rate')!,
  getArticle('dealer-financing-vs-bank-loan')!,
  getArticle('car-loan-term-length-guide')!,
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
  { q: 'Is it cheaper to finance a new or used car?', a: 'It depends on how you define "cheaper." A used car has a lower sticker price and a lower total loan cost in most cases. But new cars qualify for lower interest rates — often 1 to 3 percentage points below used car rates — and sometimes manufacturer promotional rates of 0 to 2.9%. A $40,000 new car at 7% and a $28,000 used car at 11% produce very similar total interest costs, but the used car has a lower total purchase price by $11,000. The better deal depends on which specific vehicles you are comparing.' },
  { q: 'Why are used car loan rates higher than new car rates?', a: 'Used cars carry more risk for lenders because their value is harder to appraise accurately, they depreciate less predictably, and they have more history of mechanical issues that could affect resale value. Lenders charge higher rates to compensate for that increased collateral risk. New car rates are lower because the vehicle\'s value is known precisely (MSRP), it comes with a manufacturer warranty, and it\'s backed by standardized dealer pricing.' },
  { q: 'How much do I save by buying used instead of new?', a: 'The savings come from the purchase price, not the financing. A $28,000 used car saves you $12,000 in loan principal compared to a $40,000 new car. Even with a higher interest rate (11% vs 7%), the used car\'s total loan cost is about $36,500 vs $47,600 for the new car — a savings of $11,100 on paper. However, that calculation doesn\'t include depreciation, maintenance costs, warranty coverage, or reliability differences, which can shift the true total cost significantly.' },
  { q: 'What interest rate should I expect on a used car loan in 2026?', a: 'Used car loan rates in 2026 typically range from 6% to 15%, depending on your credit score, the age of the vehicle, and your lender. Borrowers with excellent credit (720+) can often get rates in the 6–8% range from credit unions. Rates climb significantly for buyers with credit scores below 660, and vehicles older than 5 years or with high mileage attract higher rates from most lenders. Getting pre-approved by a credit union before shopping is the most reliable way to secure a competitive used car rate.' },
  { q: 'Does buying used make sense if the new car has a 0% APR offer?', a: 'A 0% APR offer on a new car is a significant financial advantage that often closes or reverses the used car savings gap. On a $40,000 car at 0% over 60 months, you pay exactly $40,000 in total — no interest whatsoever. A comparable used car at 11% over 60 months generates $8,500 in interest. Whether the new car is still the better total value depends on the price difference between the two vehicles, but 0% APR eliminates one of the main advantages of used car financing.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The new-vs-used car decision involves more than price. Loan rates, depreciation, warranty
        coverage, and total cost of ownership all play a role. Here&apos;s how to run the actual
        numbers on a real example and understand which option costs less for your situation.
      </p>

      <h2>Why the Comparison Isn&apos;t Simple</h2>
      <p>
        Used cars cost less upfront, which means a smaller loan. But lenders charge higher
        interest rates on used car loans — because used vehicles are harder to value, depreciate
        less predictably, and carry more mechanical risk. New cars come with lower rates
        (and sometimes 0% manufacturer financing) but significantly higher sticker prices.
      </p>
      <p>
        The net result: the total loan cost gap between new and used is narrower than the price
        gap suggests.
      </p>

      <h2>Side-by-Side: $40K New vs $28K Used, 60 Months</h2>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>New car ($40K at 7%)</th>
            <th>Used car ($28K at 11%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Loan amount</td><td>$40,000</td><td>$28,000</td></tr>
          <tr><td>Interest rate</td><td>7% APR</td><td>11% APR</td></tr>
          <tr><td>Monthly payment</td><td>$792</td><td>$609</td></tr>
          <tr><td>Total interest paid</td><td>$7,520</td><td>$8,540</td></tr>
          <tr><td>Total loan cost</td><td>$47,520</td><td>$36,540</td></tr>
          <tr><td>You pay less with used</td><td colSpan={2} style={{textAlign: 'center'}}>$10,980 less total</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>Interesting result:</strong> the used car actually costs <em>more in interest</em>
        ($8,540 vs $7,520) despite being cheaper overall. The higher rate on the used loan more
        than offsets the lower principal — but the lower purchase price still wins on total cost
        by nearly $11,000.</p>
      </div>

      <h2>What the Table Doesn&apos;t Show</h2>
      <p>
        Total loan cost is not the same as total cost of ownership. Several factors not captured
        in the financing comparison can shift the real-world outcome:
      </p>
      <p>
        <strong>Depreciation.</strong> New cars lose 15–25% of their value in the first year.
        A $40,000 car may be worth $30,000–$33,000 after 12 months. A used car that already
        went through its steepest depreciation loses value more slowly. If you plan to sell or
        trade in within 3–4 years, the used car&apos;s shallower depreciation curve can be a
        significant financial advantage.
      </p>
      <p>
        <strong>Warranty and repair costs.</strong> New cars come with full manufacturer warranties
        (typically 3 years / 36,000 miles bumper-to-bumper). A used car may be out of warranty,
        meaning maintenance and repair costs fall entirely on you. Over 5 years, the repair cost
        difference can range from negligible to several thousand dollars depending on the vehicle.
      </p>
      <p>
        <strong>Insurance.</strong> New cars are more expensive to insure — lenders require
        comprehensive coverage and the replacement value is higher. A used car with a paid-off
        loan can be carried with lower coverage.
      </p>

      <h2>When New Makes More Financial Sense</h2>
      <ul>
        <li>The manufacturer is offering 0% or sub-3% APR financing — this dramatically reduces the new car&apos;s total cost and may make it cheaper than used</li>
        <li>You plan to keep the car for 8–10+ years — warranty coverage and reliability reduce long-term cost uncertainty</li>
        <li>You&apos;re comparing a certified pre-owned (CPO) new car vs a non-CPO used car at similar prices</li>
      </ul>

      <h2>When Used Makes More Financial Sense</h2>
      <ul>
        <li>You&apos;re buying a 2–4 year old vehicle that has already absorbed its steepest depreciation</li>
        <li>You plan to own the car for only 3–5 years before selling — lower purchase price limits your downside</li>
        <li>The new car equivalent doesn&apos;t have a promotional rate offer and is priced $8,000+ above the used option</li>
        <li>Your budget requires a lower monthly payment — the $183/month difference in this example is $10,980 over 5 years</li>
      </ul>

      <h2>The Pre-Approval Advantage for Used Cars</h2>
      <p>
        Used car financing tends to have more rate variability than new car financing. The same
        buyer can see rates ranging from 7% to 14% depending on the lender, the vehicle&apos;s age,
        and how aggressively they shop. Getting pre-approved by a credit union before visiting
        dealerships or private sellers consistently produces the best rates for used car buyers.
      </p>

      <h2>Calculate Your Specific Comparison</h2>
      <p>
        The numbers above are examples. Your actual comparison depends on the specific vehicles
        you&apos;re looking at, current market rates, and your credit profile. Use
        <Link href="/calculators/car-loan"> FinWiser&apos;s free car loan calculator</Link> to enter
        both scenarios and see the exact monthly payment and total cost for each option.
      </p>

    </ArticleLayout>
  )
}
