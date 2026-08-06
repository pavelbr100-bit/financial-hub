import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('is-renting-throwing-money-away')!
const related = [
  getArticle('how-much-house-can-you-afford')!,
  getArticle('mortgage-amortization-explained')!,
  getArticle('15-year-vs-30-year-mortgage')!,
]

export const metadata: Metadata = {
  title: { absolute: `${meta.metaTitle ?? meta.title} | FinWiser` },
  description: meta.metaDescription ?? meta.description,
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
  { q: "Is it cheaper to rent or buy?", a: "Month to month, renting is frequently cheaper than owning the equivalent home once you count property tax, insurance, and maintenance rather than just the mortgage payment. Over a long enough period, buying usually wins anyway, because a share of each payment builds equity and the property itself tends to appreciate. The honest answer is that neither is reliably cheaper — the comparison turns on how long you stay, what rents look like where you are, and what you would have done with the down payment." },
  { q: "How much of my mortgage payment goes to interest?", a: "Far more than most buyers expect at the start. On a $320,000 loan at 6.5%, about 85% of the first year's principal and interest goes to interest — $20,695 against $3,577 of principal. The split improves every month as the balance falls, but slowly: on that loan, the principal portion does not exceed the interest portion until month 233, more than nineteen years in. This is why equity accumulates so slowly in the early years of a mortgage." },
  { q: "Does renting build any wealth?", a: "Not through the property, but potentially through what renting frees up. A renter who pays less per month than the equivalent owner, and who invests the difference along with the down payment they did not spend, is accumulating wealth in a portfolio rather than a house. Whether that beats owning depends on the gap between the two monthly costs and on investment returns. Renting only destroys wealth relative to buying if the money it frees up gets spent instead of invested." },
  { q: "How much cash do I need before buying a house?", a: "More than the down payment alone. On a $400,000 home with 20% down, the down payment is $80,000 and closing costs at around 3% add roughly $12,000, so $92,000 leaves your account before anyone moves in. Moving costs, immediate repairs, and furnishing land on top of that. Selling later costs again — agent commission and fees commonly run about 6% of the sale price, which is why buying and selling within a couple of years rarely works out." },
  { q: "Is a house a good investment?", a: "It is a reasonable one with a caveat worth understanding: a home is a leveraged, undiversified asset that you also have to live in. Leverage magnifies gains, which is why appreciation on the full value of a house can produce strong returns on a much smaller down payment. It also magnifies losses. And because a home is illiquid and expensive to transact, you cannot rebalance it or exit quickly. Most owners do well from housing, but primarily through forced saving and long holding periods rather than exceptional returns." },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The phrase assumes that rent vanishes while a mortgage payment accumulates. The first half
        is true — rent buys you a place to live and nothing else. The second half is where it falls
        apart, because a large share of an early mortgage payment does exactly the same thing.
      </p>
      <p>
        It is worth looking at where an owner&apos;s money actually goes, because the answer is not
        the one the saying implies.
      </p>

      <h2>How Much of a Mortgage Payment Builds Anything</h2>
      <p>
        Take a $400,000 home bought with 20% down — a $320,000 loan at 6.5% over 30 years. The
        principal and interest payment is $2,022.62. In the very first month, $1,733.33 of that is
        interest and <strong>$289.28</strong> is principal.
      </p>
      <p>
        Interest is not saving. It is the price of borrowing, and it leaves as completely as rent
        does. So does the property tax, the homeowners insurance, and the money that goes into
        maintaining the building. On this house those run roughly $367, $167, and $333 a month
        respectively.
      </p>
      <div className="callout">
        <p><strong>Adding it up:</strong> the true first-month cost of owning this home is about
        $2,889. Of that, $289 builds equity and roughly <strong>$2,600 is simply gone</strong> —
        more than the $2,200 it would cost to rent something comparable. The owner is not
        throwing less money away than the renter. They are throwing away slightly more, and
        building $289 on the side.</p>
      </div>
      <p>
        Across the first full year, 85% of principal and interest goes to interest: $20,695 against
        $3,577 of principal. The ratio improves as the balance falls, but the pace is slower than
        almost anyone expects. On this loan the principal portion does not overtake the interest
        portion until <strong>month 233</strong> — more than nineteen years in. Over the full term
        the loan costs $408,142 in interest on $320,000 borrowed. The mechanics behind that curve
        are covered in{' '}
        <Link href="/learn/mortgage-amortization-explained">how mortgage amortization works</Link>.
      </p>

      <h2>The Money That Leaves Before You Move In</h2>
      <p>
        The monthly comparison also misses the largest single number in the decision. On that
        $400,000 home, the down payment is $80,000 and closing costs at around 3% add another
        $12,000. That is <strong>$92,000</strong> out of your account before the first payment is
        due.
      </p>
      <p>
        That money has not disappeared — most of it converts into equity. But it stops being
        available for anything else, and that is the cost the saying ignores entirely. A renter who
        does not spend $92,000 has $92,000 invested somewhere. Whether buying wins depends heavily
        on what that sum would have earned.
      </p>
      <p>
        Selling costs again. Agent commission and fees commonly total around 6% of the sale price,
        which on a home that has appreciated to $450,000 is $27,000. Round-tripping a purchase
        within two or three years usually means those two transaction costs consume more than the
        equity and appreciation combined.
      </p>

      <h2>So Why Does Buying Usually Win Eventually?</h2>
      <p>
        Three things, none of which is &ldquo;rent is wasted&rdquo;.
      </p>
      <p>
        The equity share of each payment grows every month, slowly at first and then steadily
        faster, so the portion of your housing cost that is genuinely saving keeps rising. The
        property itself appreciates, and because you control the whole asset while having paid only
        a fraction of it in cash, modest appreciation produces a large return on the money you
        actually put in. And a fixed-rate mortgage freezes your largest monthly cost while rents
        keep climbing — after fifteen or twenty years, the same payment that once looked expensive
        is well below the market rent for the same home.
      </p>
      <p>
        That last point is the quiet one. It is not that buying is cheap early; it is that buying is
        expensive early and cheap late, while renting is level in real terms and rises in nominal
        ones. The crossover is what the whole decision turns on.
      </p>

      <h2>The Question That Actually Decides It</h2>
      <p>
        Not &ldquo;is rent wasted&rdquo; but <em>how long will you stay, and what will the down
        payment do if you don&apos;t spend it</em>. Those two inputs move the answer more than
        anything else, and they vary enormously between people looking at identical houses.
      </p>
      <p>
        This is also why the comparison has to be run on net worth rather than monthly payment.
        Comparing $2,023 of mortgage against $2,200 of rent gets the wrong answer twice over — it
        omits the $866 a month of tax, insurance, and upkeep, and it ignores what the $92,000 would
        have earned elsewhere. The{' '}
        <Link href="/calculators/rent-vs-buy">rent vs buy calculator</Link> runs both paths forward
        year by year and reports the year buying pulls ahead, if it does at all for your numbers.
      </p>
      <p>
        If you have already decided to buy and the question is how much house to take on, the{' '}
        <Link href="/learn/how-much-house-can-you-afford">affordability guide</Link> is the more
        useful place to go next.
      </p>

    </ArticleLayout>
  )
}
