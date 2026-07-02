import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('fixed-vs-variable-interest-rate')!
const related = [
  getArticle('what-is-amortization')!,
  getArticle('how-car-loan-interest-works')!,
  getArticle('debt-payoff-strategies')!,
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
}

const faq = [
  { q: "Can a variable rate loan be converted to a fixed rate?", a: "Some variable-rate loans include an option to convert to a fixed rate at certain points in the term, usually with a fee, though the offered fixed rate may not always be competitive. Alternatively, you can refinance a variable-rate loan into a new fixed-rate loan, which closes out the old loan and opens a new one. Refinancing comes with closing costs, so it is worth calculating how long it takes for the savings to exceed the upfront cost before proceeding." },
  { q: "What is a rate cap on a variable rate loan?", a: "A rate cap limits how much a variable interest rate can increase, either per adjustment period or over the life of the loan. For example, a 2/6 cap on an adjustable-rate mortgage means the rate cannot increase more than 2% at any single adjustment and cannot exceed the starting rate by more than 6% in total. Caps protect borrowers from extreme payment increases, but a loan near its ceiling can still see substantial payment rises if rates increase sharply over a short period." },
  { q: "When is a variable interest rate a better choice than a fixed rate?", a: "A variable rate makes more sense when you plan to pay off the debt quickly before rates can rise significantly, when rates are high overall and likely to fall, or when you have the financial flexibility to absorb a payment increase. Short-term loans like 5-year car loans carry less variable-rate risk than a 30-year mortgage. For long-term loans where rate uncertainty could have a major impact on your budget, the certainty of a fixed rate is usually worth the slightly higher starting cost." },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

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
        A fixed rate is the right call for long-term loans — 10 years or more — especially when
        rates are at or near historical norms. If your budget doesn&apos;t have much room to absorb
        a payment increase, a fixed rate removes that risk entirely. The same applies if you plan
        to stay in the home or keep the loan through most of its term: locking in today&apos;s rate
        means market movements can never make your situation worse. When current rates are low
        relative to historical averages, fixing them is almost always the right choice — you&apos;re
        paying a modest premium over the variable rate to eliminate a risk that compounds over decades.
      </p>

      <h2>When Variable Might Make Sense</h2>
      <p>
        The scenario where a variable rate clearly wins is a short, certain timeline. If you know
        with high confidence that you&apos;ll sell or refinance before the initial fixed period of an
        ARM expires — typically 5 or 7 years — you capture the lower starting rate without ever
        facing an adjustment. The $286/month savings on a $350,000 5/1 ARM over 5 years represents
        $17,160 in genuine savings if you exit on schedule.
      </p>
      <p>
        Variable rates can also make sense when rates are unusually high and likely to fall. An
        ARM adjusts downward automatically when benchmark rates drop; a fixed-rate borrower would
        need to refinance to capture the same benefit. The catch: predicting the direction of rates
        is unreliable. &quot;Rates will likely fall&quot; has been wrong for multi-year stretches.
      </p>
      <p>
        The key test for any variable rate is timeline certainty. If there&apos;s meaningful probability
        you&apos;ll hold the loan past the initial fixed period, the unpredictability of future payments
        is a real financial risk — not a hypothetical one.
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
