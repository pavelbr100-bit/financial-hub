import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('first-time-home-buyer-programs')!
const related = [
  getArticle('first-time-home-buyer-programs-nc')!,
  getArticle('first-time-home-buyer-programs-georgia')!,
  getArticle('first-time-home-buyer-programs-south-carolina')!,
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
  { q: 'Can I qualify as a first-time home buyer if I owned a home before?', a: 'Usually, yes. For Fannie Mae and Freddie Mac programs — and for most state assistance programs built on their definition — you are a first-time buyer if you have not held an ownership interest in a residential property in the past three years. The IRS uses a two-year test for its IRA withdrawal exception, and HUD\'s Good Neighbor Next Door uses twelve months. Owning a home years ago disqualifies you from almost nothing.' },
  { q: 'Is there a $15,000 or $25,000 first-time home buyer grant from the federal government?', a: 'No. The $15,000 tax credit and the $25,000 down payment grant that circulate in headlines are bills that have been introduced in Congress — most recently the First-Time Homebuyer Tax Credit Act of 2025 — but none has become law as of 2026. What actually exists at the federal level is cheaper entry (low or zero down payment loans), not cash. The cash comes from state housing finance agencies and city programs.' },
  { q: 'What credit score do first-time buyer programs require?', a: 'FHA insures loans down to a 580 score with 3.5% down, and technically to 500 with 10% down, though many lenders set their own floors higher. Conventional 3%-down programs generally need a 620 or better, with pricing that improves meaningfully as scores rise. State programs typically ask for 640. If your score is below 580, the practical path is usually a few months of credit repair before shopping, not a different program.' },
  { q: 'Is FHA or a 3%-down conventional loan better for a first home?', a: 'It usually comes down to mortgage insurance. FHA\'s premium runs for the life of the loan when you put down less than 10%, and getting rid of it later means refinancing. Conventional PMI cancels once you reach 20% equity, at no cost and with no refinance. Buyers with scores around 680 and up generally do better with conventional; FHA tends to win for lower scores or thinner credit, because its pricing does not penalize them as heavily.' },
  { q: 'Do VA and USDA loans really require no down payment at all?', a: 'Yes — both finance 100% of the purchase price. Neither charges monthly mortgage insurance, but each has its own fee: VA charges a one-time funding fee (2.15% of the loan for most first-time users, waived entirely for veterans receiving disability compensation), and USDA charges 1% upfront plus a 0.35% annual fee. You will still need cash for closing costs, though sellers can be negotiated into covering some of them.' },
  { q: 'Can I use my IRA or 401(k) for a first home without penalty?', a: 'An IRA, yes — up to $10,000 per person, lifetime, escapes the 10% early-withdrawal penalty if you qualify under the IRS two-year rule and use the money within 120 days. A married couple can take $10,000 each. Note that traditional IRA withdrawals still count as taxable income; only the penalty is waived. The exception does not extend to 401(k)s — pulling from one before 59½ still triggers the penalty, although some plans offer loans instead.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The most useful thing to know about first-time home buyer programs is what the phrase
        actually covers. At the federal level, there is no check waiting for you — no grant, no tax
        credit, despite what recycled headlines suggest. What the federal government offers instead
        is a cheaper way in: loan programs that cut the required down payment to 3.5%, 3%, or
        nothing at all, and that accept credit profiles a standard loan would price harshly. The
        actual cash — down payment assistance, forgivable seconds, tax credits — comes from state
        housing finance agencies, layered on top of these federal loans.
      </p>
      <p>
        This guide maps the federal layer. If you are buying in North Carolina, Georgia, or South
        Carolina, the state guides linked at the end cover the cash layer.
      </p>

      <div className="callout">
        <p><strong>You are probably a first-time buyer.</strong> The definition is looser than the
        name: for Fannie Mae and Freddie Mac, anyone with no ownership interest in a home in the
        past <strong>3 years</strong> qualifies. The IRS uses <strong>2 years</strong> for its IRA
        exception, and HUD&apos;s Good Neighbor Next Door uses <strong>12 months</strong>. Owning a
        house a decade ago rules out almost nothing.</p>
      </div>

      <h2>FHA: The Best-Known Route, With a Catch</h2>
      <p>
        An FHA loan is a regular mortgage from a regular lender, insured by the Federal Housing
        Administration. That insurance is why lenders accept 3.5% down with a credit score of 580
        or higher (500–579 requires 10% down). For 2026, FHA will insure single-family loans up to
        $541,287 in most of the country, and up to $1,249,125 in the most expensive markets.
      </p>
      <p>
        The catch is the insurance itself. You pay an upfront premium of 1.75% of the loan, then an
        annual premium — most commonly 0.55% for a 30-year loan with the minimum down payment —
        added to every monthly payment. On a $350,000 home with 3.5% down ($12,250), the loan is
        $337,750, the upfront premium is $5,911 (usually financed into the loan), and the annual
        premium starts at about $155 a month.
      </p>
      <p>
        And unlike conventional mortgage insurance, FHA&apos;s does not cancel when you build
        equity. Put down less than 10% and the premium runs for the life of the loan — the only
        exit is refinancing into a conventional loan later. FHA is often the right door to walk
        through and the wrong loan to keep for thirty years.
      </p>

      <h2>Conventional 3% Down: Often the Better Deal</h2>
      <p>
        Fannie Mae and Freddie Mac both back mortgages with just 3% down — less than FHA&apos;s
        minimum, a point many buyers never hear. The programs differ mainly in who qualifies:
      </p>
      <ul>
        <li><strong>Conventional 97</strong> (Fannie) and <strong>HomeOne</strong> (Freddie) — no
        income limits, but at least one borrower must be a first-time buyer under the 3-year
        rule.</li>
        <li><strong>HomeReady</strong> (Fannie) and <strong>Home Possible</strong> (Freddie) —
        income capped at 80% of your area&apos;s median, but open to repeat buyers, with cheaper
        mortgage insurance and more flexibility on co-borrowers and boarder income.</li>
      </ul>
      <p>
        The decisive advantage over FHA is that private mortgage insurance cancels. Once you reach
        20% equity — through payments, appreciation, or both — PMI goes away without a refinance.
        A buyer with a 680+ score usually pays less over time on a 3%-down conventional loan than
        on FHA; below that, FHA&apos;s flatter pricing tends to win. Run both against your own
        numbers rather than assuming.
      </p>

      <h2>VA and USDA: The Zero-Down Programs</h2>
      <p>
        Two federal programs eliminate the down payment entirely, each for a specific population.
      </p>
      <p>
        <strong>VA loans</strong> serve veterans, active service members, and many surviving
        spouses. Zero down, no monthly mortgage insurance, and consistently among the lowest rates
        available. The cost is a one-time funding fee: 2.15% of the loan for a first use with less
        than 5% down (on a $300,000 loan, $6,450, usually financed), falling with a larger down
        payment — and waived entirely for veterans receiving VA disability compensation and most
        surviving spouses. If you are eligible, a VA loan is very hard to beat.
      </p>
      <p>
        <strong>USDA loans</strong> finance 100% of homes in eligible rural and semi-rural areas —
        a map that covers more territory than the word &ldquo;rural&rdquo; implies, including the
        outer edges of many metro areas. Household income must stay under 115% of the area median
        (around $119,850 for a 1–4 person household in most areas as of 2026, higher in some
        counties). Instead of mortgage insurance there is a 1% upfront guarantee fee and a 0.35%
        annual fee — cheaper than FHA&apos;s equivalent. The USDA eligibility map on rd.usda.gov
        settles both the property and income questions in a few minutes.
      </p>

      <h2>The Narrow but Remarkable Ones</h2>
      <p>
        <strong>Good Neighbor Next Door</strong> sells HUD-owned homes in designated revitalization
        areas at 50% off list price to law-enforcement officers, pre-K–12 teachers, firefighters,
        and EMTs who commit to living there for 36 months. The discount is structured as a silent
        second mortgage that forgives itself after the three years. The honest caveat: inventory is
        tiny, because it depends on HUD foreclosures in specific neighborhoods. Worth a look if you
        are in an eligible profession; not worth building a plan around.
      </p>
      <p>
        <strong>Mortgage Credit Certificates</strong> convert 10–50% of your annual mortgage
        interest into a dollar-for-dollar federal tax credit (capped at $2,000 a year when the rate
        exceeds 20%), every year you live in the home. They are federal in mechanism but issued by
        state housing agencies through participating lenders, generally to first-time buyers within
        income limits — and not every state currently offers them, so this one is a question to ask
        your state agency, not your bank.
      </p>
      <p>
        <strong>The IRA exception</strong> lets each person withdraw up to $10,000 from an IRA,
        once per lifetime, without the 10% early-withdrawal penalty — under the IRS 2-year
        definition, with the money used within 120 days. Income tax still applies to traditional
        IRA withdrawals, and 401(k)s get no such exception. Useful at the margin; rarely a reason
        to drain retirement savings.
      </p>

      <div className="callout">
        <p><strong>Common mistake:</strong> waiting to buy until a federal grant arrives. The
        $15,000 tax credit and $25,000 down payment grant that surface in news feeds are
        <em> proposed bills</em>, introduced repeatedly since 2021 and never passed. The one real
        federal change for 2026 is quieter: mortgage insurance premiums — PMI, FHA MIP, the VA
        funding fee — became tax-deductible again for itemizers starting with the 2026 tax year.
        Helpful, but not a reason to time a purchase.</p>
      </div>

      <h2>How the Programs Compare</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Program</th><th>Down payment</th><th>Mortgage insurance</th><th>Who it&apos;s for</th></tr>
          </thead>
          <tbody>
            <tr><td>FHA</td><td>3.5% (580+ score)</td><td>1.75% upfront + ~0.55%/yr, usually life of loan</td><td>Lower scores, thin credit</td></tr>
            <tr><td>Conventional 97 / HomeOne</td><td>3%</td><td>PMI, cancels at 20% equity</td><td>First-time buyers, any income</td></tr>
            <tr><td>HomeReady / Home Possible</td><td>3%</td><td>Reduced PMI, cancels at 20% equity</td><td>Income ≤ 80% of area median</td></tr>
            <tr><td>VA</td><td>0%</td><td>None (one-time funding fee)</td><td>Veterans, service members, surviving spouses</td></tr>
            <tr><td>USDA</td><td>0%</td><td>1% upfront + 0.35%/yr</td><td>Eligible areas, income ≤ 115% of median</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Where the Actual Money Is</h2>
      <p>
        Every program above makes buying <em>cheaper to enter</em>; none of them hands you cash.
        Down payment assistance — deferred second mortgages, forgivable loans, occasionally
        outright grants — lives at the state level, run by housing finance agencies and layered on
        top of an FHA, VA, USDA, or conventional first mortgage from this list. The amounts are
        real: five figures in most states, with income and purchase-price limits attached.
      </p>
      <p>
        We cover the three states our calculators serve in detail:{' '}
        <Link href="/learn/first-time-home-buyer-programs-nc">North Carolina</Link>,{' '}
        <Link href="/learn/first-time-home-buyer-programs-georgia">Georgia</Link>, and{' '}
        <Link href="/learn/first-time-home-buyer-programs-south-carolina">South Carolina</Link>.
        Elsewhere, search your state&apos;s housing finance agency by name — every state has one.
      </p>
      <p>
        Before any of it, know your number. A program that stretches you into a payment you cannot
        carry is not assistance. The{' '}
        <Link href="/learn/how-much-house-can-you-afford">affordability guide</Link> walks through
        sizing the budget, and the{' '}
        <Link href="/calculators/mortgage">mortgage calculator</Link> turns any price, rate, and
        down payment into the full monthly payment — taxes, insurance, and PMI included.
      </p>

    </ArticleLayout>
  )
}
