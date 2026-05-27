import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('fixed-vs-variable-interest-rate')!

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
  { q: "What is the difference between a fixed and variable interest rate?", a: "A fixed interest rate stays the same for the entire loan term, so your payment never changes. A variable rate, also called an adjustable rate, can change periodically based on a benchmark index like the prime rate or SOFR. Variable rates typically start lower than fixed rates but carry the risk of rising over time. Fixed rates offer payment predictability; variable rates offer potential savings if interest rates stay low or decline during the loan term." },
  { q: "When is a variable interest rate a better choice than a fixed rate?", a: "A variable rate makes more sense when you plan to pay off the debt quickly before rates can rise significantly, when rates are high overall and likely to fall, or when you have the financial flexibility to absorb a payment increase. Short-term loans like 5-year car loans carry less variable-rate risk than a 30-year mortgage. For long-term loans where rate uncertainty could have a major impact on your budget, the certainty of a fixed rate is usually worth the slightly higher starting cost." },
  { q: "Can a variable rate loan be converted to a fixed rate?", a: "Some variable-rate loans include an option to convert to a fixed rate at certain points in the term, usually with a fee, though the offered fixed rate may not always be competitive. Alternatively, you can refinance a variable-rate loan into a new fixed-rate loan, which closes out the old loan and opens a new one. Refinancing comes with closing costs, so it is worth calculating how long it takes for the savings to exceed the upfront cost before proceeding." },
  { q: "What is a rate cap on a variable rate loan?", a: "A rate cap limits how much a variable interest rate can increase, either per adjustment period or over the life of the loan. For example, a 2/6 cap on an adjustable-rate mortgage means the rate cannot increase more than 2% at any single adjustment and cannot exceed the starting rate by more than 6% in total. Caps protect borrowers from extreme payment increases, but a loan near its ceiling can still see substantial payment rises if rates increase sharply over a short period." },
  { q: "Is a fixed or variable rate better for a mortgage?", a: "For most homebuyers, especially those taking out 30-year mortgages, a fixed rate provides the most security because your payment is locked in for the life of the loan regardless of rate movements. Variable-rate mortgages, known as ARMs, can make sense if you plan to sell or refinance within 5 to 7 years and want to benefit from the lower initial rate. ARMs carry real risk on longer time horizons because even modest rate increases can significantly raise monthly payments on a large mortgage balance." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        When you apply for a mortgage, car loan, or personal loan, one of the first choices
        you&apos;ll face is whether to take a fixed or variable (adjustable) interest rate. Both
        have legitimate uses, but they behave very differently over time — and choosing the
        wrong one for your situation can cost thousands of dollars.
      </p>
      <p>
        Here&apos;s a plain-language breakdown of how each works, the trade-offs involved, and
        how to decide which fits your loan.
      </p>

      <h2>Fixed Interest Rate</h2>
      <p>
        A fixed rate stays the same for the entire life of the loan. Your monthly payment is
        identical in month one and month 360. The lender takes on the risk that market rates
        will rise — because even if they do, they can&apos;t charge you more.
      </p>
      <p>
        This predictability is the primary benefit. You can budget with certainty, plan your
        finances long-term, and never worry about a payment spike hitting at a bad time.
        Fixed-rate loans are especially valuable on long-term debt like 30-year mortgages,
        where market rates have decades to move in unpredictable directions.
      </p>
      <div className="callout">
        <p><strong>The trade-off:</strong> Fixed rates are usually slightly higher than variable
        rates at the time of origination. Lenders price in a risk premium for locking in your
        rate. You pay for certainty upfront — but that certainty is real and often worth it.</p>
      </div>

      <h2>Variable (Adjustable) Interest Rate</h2>
      <p>
        A variable rate changes periodically based on a benchmark index — typically the
        Secured Overnight Financing Rate (SOFR) or the prime rate — plus a lender margin.
        As the index moves, your rate and payment move with it.
      </p>
      <p>
        Adjustable-rate mortgages (ARMs) are described with notation like &quot;5/1 ARM&quot; or
        &quot;7/6 ARM.&quot; The first number is the fixed-rate period in years. The second is how
        often the rate adjusts after that. A 5/1 ARM keeps a fixed rate for 5 years, then
        adjusts every year after.
      </p>
      <p>
        Most ARMs have caps: a limit on how much the rate can change in a single adjustment
        and over the life of the loan. A common cap structure is 2/2/5 — up to 2% on the
        first adjustment, up to 2% on each subsequent adjustment, and up to 5% total over
        the life of the loan.
      </p>

      <h2>A Real Numbers Comparison</h2>
      <p>
        Suppose you&apos;re borrowing $350,000 for 30 years. Current market offers:
      </p>
      <ul>
        <li><strong>30-year fixed at 7%:</strong> $2,329/month, same for 30 years</li>
        <li><strong>5/1 ARM at 5.75%:</strong> $2,043/month for years 1–5</li>
      </ul>
      <p>
        The ARM saves $286/month — $17,160 over the initial 5-year period. But if the rate
        adjusts upward after year 5 (say, to 8%), your payment jumps to $2,508. If it rises
        to the cap (say, 10.75% with a 5% lifetime cap), you&apos;d be paying $3,200/month —
        $871 more than the fixed rate you could have locked in.
      </p>

      <h2>When Fixed Makes Sense</h2>
      <p>
        Choose a fixed rate if:
      </p>
      <ul>
        <li>You&apos;re taking a long-term loan (10 years or more) and rates are at or near
        historical norms</li>
        <li>Your budget is tight and you can&apos;t absorb a significant payment increase</li>
        <li>You plan to stay in the home or keep the loan for most of its term</li>
        <li>You value predictability more than the potential for short-term savings</li>
        <li>Current rates are low relative to historical averages (lock in the good rate)</li>
      </ul>

      <h2>When Variable Might Make Sense</h2>
      <p>
        A variable rate may be appropriate if:
      </p>
      <ul>
        <li>You have a short timeline — if you&apos;re certain you&apos;ll sell or refinance before
        the initial fixed period ends, you capture the lower starting rate without the risk</li>
        <li>Rates are unusually high and likely to fall — if rates drop, your ARM adjusts
        down automatically (fixed rates require refinancing)</li>
        <li>The loan is short-term and fully paid off before the rate adjusts</li>
      </ul>
      <p>
        The key condition for variable rates is timeline certainty. If there&apos;s any meaningful
        chance you&apos;ll keep the loan past the initial fixed period, the unpredictability of
        future payments is a genuine financial risk.
      </p>

      <h2>The Refinancing Option</h2>
      <p>
        One argument for starting with a variable rate is the ability to refinance to a fixed
        rate later if rates remain favorable. This strategy works, but comes with costs: closing
        costs on a new loan typically run 2–5% of the loan amount, and qualifying to refinance
        requires meeting lender requirements at the time.
      </p>
      <p>
        Don&apos;t assume refinancing will always be available when you need it — income changes,
        property value shifts, or credit events can make refinancing harder than expected.
      </p>
      <p>
        Use <Link href="/calculators/loan-amortization">FinWiser&apos;s free loan amortization calculator</Link> to model your loan with different
        rates in seconds — enter a fixed rate, then try a variable rate scenario to see how
        each affects your payment and total cost.
      </p>

    </ArticleLayout>
  )
}
