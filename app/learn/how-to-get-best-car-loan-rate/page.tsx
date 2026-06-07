import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('how-to-get-best-car-loan-rate')!
const related = [
  getArticle('how-car-loan-interest-works')!,
  getArticle('new-vs-used-car-loan')!,
  getArticle('how-to-pay-off-car-loan-early')!,
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
    'car loan interest rate',
    'used car loan rates',
    'auto loan payment',
    'best auto loan rate',
    'how to get low car loan rate',
    'monthly car payment calculator',
  ],
}

const faq = [
  { q: "Does getting pre-approved for a car loan hurt my credit score?", a: "Getting pre-approved triggers a hard inquiry, which may temporarily lower your score by 2 to 5 points. However, if you receive multiple pre-approvals within a 14 to 45 day window, depending on the scoring model, they are typically counted as a single inquiry for scoring purposes. The temporary impact is small and well worth it. Comparing rates from 3 to 5 lenders before committing can save you thousands of dollars over the life of the loan." },
  { q: "Should I get a car loan from a bank or a dealership?", a: "Get pre-approved from a bank or credit union before visiting the dealer. This gives you a benchmark rate and real negotiating leverage. Dealers often mark up rates from their lender partners, with the spread going to the dealership as profit, but they also have access to manufacturer incentive financing that can be very competitive. Walk in with your pre-approval in hand, and if the dealer can beat your rate, take the better offer. Never anchor the negotiation on your monthly payment target; focus on total cost and interest rate." },
  { q: "How much does credit score affect car loan interest rate?", a: "The impact is substantial. Borrowers with excellent credit above 750 average around 5 to 6% on new car loans nationally. With good credit between 700 and 749 it is typically 6 to 8%. Fair credit between 650 and 699 averages 8 to 12%. Poor credit below 600 can result in rates of 15 to 25% or even loan denial. The difference between excellent and poor credit on a $25,000 loan can exceed $8,000 to $10,000 in total interest cost over a 5-year loan term." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The rate you get on a car loan is rarely determined at the dealership. It&apos;s largely
        determined before you walk in — by your credit score, your preparation, and whether
        you showed up with a competing offer or without one. Here&apos;s the sequence that
        consistently produces the best rate.
      </p>

      <h2>Six Weeks Before You Buy: Pull Your Credit</h2>
      <p>
        Your credit score is the single biggest variable in the rate you&apos;ll be offered, and
        it&apos;s one of the few variables you can actually improve before applying. Lenders tier
        rates by credit range — the difference between a 680 and a 740 can be 3–5 percentage
        points, which translates to thousands of dollars on a typical car loan.
      </p>
      <p>
        Six weeks out is enough time to correct errors on your credit report. Pull your report
        from AnnualCreditReport.com, look for accounts that aren&apos;t yours, incorrect late payments,
        or balances that should be zero. Disputing an inaccurate negative item can improve your
        score within 30 days. Also pay down any credit card balances you can — credit utilization
        (balance-to-limit ratio) affects your score quickly when you reduce it.
      </p>

      <h2>Two Weeks Before: Get Pre-Approved, Starting With a Credit Union</h2>
      <p>
        Credit unions are member-owned nonprofits, and their auto loan rates consistently run
        1–2% below equivalent bank rates. If you&apos;re not a member of one, many allow you to join
        by making a small donation to an affiliated nonprofit. The paperwork takes 20 minutes and
        the rate savings can easily top $1,000–$2,000 over a 60-month loan.
      </p>
      <p>
        Apply to your credit union first, then your current bank, and one online lender. Multiple
        auto loan applications within a 14–45 day window count as a single credit inquiry under
        most scoring models, so shopping doesn&apos;t harm your score. Each pre-approval gives you
        a rate offer you can use as a benchmark — and a fallback if the dealer can&apos;t beat it.
      </p>

      <h2>At the Dealership: What&apos;s Actually Happening Behind the Counter</h2>
      <p>
        When you ask about financing, the dealer&apos;s finance and insurance (F&I) office submits
        your application to a network of lenders. Each responds with a <strong>buy rate</strong>
        — the actual rate you qualify for based on your credit. The dealer is then permitted to
        mark that rate up — typically up to 2–2.5 percentage points — and keep the difference
        as profit. You never see the buy rate. You only see the final number the F&I manager
        presents as if it were a fact.
      </p>
      <div className="callout">
        <p><strong>How the pre-approval changes this dynamic:</strong> When you hand the F&I
        manager a pre-approval at, say, 6.9%, they know their financing must beat 6.9% or lose
        the deal. That eliminates most of the markup — they can&apos;t pad the rate above what you
        already have. Even if you end up using dealer financing because they beat your rate,
        the pre-approval is what forced them to compete.</p>
      </div>
      <p>
        One more thing about the dealership conversation: always negotiate the car price
        completely — agree on a number — before financing comes up. Dealers trained in F&I
        often anchor buyers on a monthly payment target rather than a total price, because
        they can hide a rate increase inside a payment that still looks affordable. Know your
        price first. Then discuss the rate separately.
      </p>

      <h2>Manufacturer Financing: When It&apos;s Genuinely Good</h2>
      <p>
        Automakers sometimes subsidize financing rates to move inventory — especially at
        end of model year (September–November) or during slow sales periods. A 2.9% or 0%
        APR promotional offer on a new car is real money. On a $35,000 vehicle, 0% APR over
        60 months saves you the entire interest cost — $5,000 to $7,000 compared to a market rate.
      </p>
      <p>
        The catch: these rates typically require excellent credit (720+) and aren&apos;t combinable
        with other discounts. Dealers may also be less willing to negotiate the purchase price
        when they know you&apos;re using subsidized financing. Run both scenarios — the promotional
        rate with a higher price, versus a market rate with a better price — to see which total
        cost is actually lower.
      </p>

      <h2>The Number That Settles It</h2>
      <p>
        On a $30,000 loan over 60 months, the difference between 7% and 10% is $4,256 in total
        interest. Three hours of credit union applications, bank comparisons, and pre-approval
        paperwork routinely saves that amount. The rate you walk in with is almost always better
        than the rate you&apos;d get by walking in empty-handed.
      </p>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to model
        your loan at different rates and see the exact total interest cost before you sign anything.
      </p>

    </ArticleLayout>
  )
}
