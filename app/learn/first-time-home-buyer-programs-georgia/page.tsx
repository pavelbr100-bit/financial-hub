import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('first-time-home-buyer-programs-georgia')!
const related = [
  getArticle('first-time-home-buyer-programs')!,
  getArticle('first-time-home-buyer-programs-nc')!,
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
  { q: 'Is Georgia Dream down payment assistance a grant or a loan?', a: 'A loan — this is the detail that surprises the most buyers. The assistance is a 0% interest second mortgage with no monthly payment, but it is not forgiven over time. The full amount comes due when you sell, refinance, or stop living in the home as your primary residence. Because there is no interest, it never grows; but it never shrinks either. Several Atlanta-area local programs, by contrast, genuinely forgive their assistance after a set number of years.' },
  { q: 'What are the income limits for Georgia Dream in 2026?', a: 'They depend on where you buy and household size. As of mid-2026, the Atlanta metro area allows up to $137,555 for a household of one or two people and $158,188 for three or more; the Athens area allows $118,152 and $135,875; everywhere else in Georgia allows $101,700 and $116,955. These are total household income figures, not just the borrower\'s salary. The Peach Plus and Peach Advantage variants allow substantially higher incomes.' },
  { q: 'Do you have to be a first-time buyer to use Georgia Dream?', a: 'There are three ways in: being a true first-time buyer, having gone three years without owning a primary residence, or buying in a state-designated targeted area — economically distressed counties or census tracts where the first-time requirement is waived entirely. On top of that, the newer Peach Plus, Peach Select VA, and Peach Advantage variants drop the first-time requirement for everyone.' },
  { q: 'How much does Georgia Dream give you toward a down payment?', a: 'The standard tier is $10,000 or 5% of the purchase price, whichever is less. Two enhanced tiers pay $12,500 or 6%, whichever is less: PEN, for protectors, educators, healthcare workers and active military, and CHOICE, for households that include a member living with a disability. Note the percentage cap: on a $150,000 home, the standard tier pays $7,500, not $10,000, because 5% of the price is the binding limit.' },
  { q: 'What credit score does Georgia Dream require?', a: 'A minimum middle score of 640 — the middle of your three bureau scores, not the best one. If you are below that, Georgia DCA points applicants to its "Ready, Set, Go" counseling program, which pairs you with a counselor to repair credit specifically toward Georgia Dream eligibility, for a $50 fee. There is no path around the 640 floor within the program itself.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        Georgia concentrates nearly all of its home buyer help under one brand: <strong>Georgia
        Dream</strong>, run by the Department of Community Affairs. It has two parts that travel
        together — a 30-year fixed-rate first mortgage at a state-set rate, and down payment
        assistance layered on top. You cannot take the assistance without the state&apos;s first
        mortgage, and you get both through a participating lender, not from the state directly.
      </p>
      <p>
        The numbers below are current as of mid-2026, but limits and amounts change — Georgia
        raised them substantially in 2024 — so treat dca.georgia.gov as the final word before you
        plan around any figure here.
      </p>

      <h2>Who Qualifies</h2>
      <p>
        There are three doors into the core program, and you only need one: you are a first-time
        buyer, you have not owned a primary residence in the past three years, or you are buying in
        a <em>targeted area</em> — a county or census tract the state designates as economically
        distressed, where the first-time rule is waived.
      </p>
      <p>
        Past that door, the core requirements as of 2026:
      </p>
      <ul>
        <li><strong>Credit:</strong> a minimum middle score of 640.</li>
        <li><strong>Income</strong> (total household, tiered by area): up to $137,555 for 1–2
        people / $158,188 for 3+ in the Atlanta metro; $118,152 / $135,875 in the Athens area;
        $101,700 / $116,955 in the rest of the state.</li>
        <li><strong>Purchase price:</strong> up to $625,000 in the Atlanta metro, $525,000 around
        Athens, $475,000 elsewhere.</li>
        <li><strong>Your own money:</strong> at least $1,000 into the purchase, which can be
        documented gift funds.</li>
        <li><strong>Liquid assets:</strong> no more than $20,000 or 20% of the sales price
        (whichever is greater) at closing — retirement accounts don&apos;t count, but stocks and
        large gifts do. The program is means-tested on savings, not just income.</li>
        <li><strong>Education:</strong> a homebuyer course from a HUD-approved counselor, in a
        workshop, one-on-one, or online — typically $50–$100.</li>
      </ul>

      <h2>What You Actually Get</h2>
      <p>
        Down payment assistance comes in three tiers, each defined as the <em>lesser</em> of a
        dollar cap and a percentage of the purchase price:
      </p>
      <ul>
        <li><strong>Standard:</strong> $10,000 or 5% of the price, whichever is less.</li>
        <li><strong>PEN:</strong> $12,500 or 6% — for &ldquo;Protectors, Educators &amp;
        Nurses&rdquo;, which in practice covers public safety, education, and healthcare workers
        and their industries, plus active military.</li>
        <li><strong>CHOICE:</strong> $12,500 or 6% — for households that include a family member
        living with a disability.</li>
      </ul>
      <p>
        The lesser-of rule bites at the affordable end of the market: on a $150,000 home the
        standard tier pays 5% — $7,500 — not the $10,000 headline figure. From $200,000 up, the
        dollar cap is what binds.
      </p>

      <div className="callout">
        <p><strong>Common mistake:</strong> assuming the assistance is forgiven. Georgia
        Dream&apos;s DPA is a <strong>0% deferred loan, repaid in full</strong> when you sell,
        refinance, or move out. It costs nothing while you stay — no interest, no monthly payment —
        but it is a lien on the home, and it comes off your sale proceeds someday. Plan your
        eventual equity around it.</p>
      </div>

      <h2>The Variants Worth Knowing</h2>
      <p>
        Since 2024 the state has added three spin-offs for buyers the core program excludes.
        <strong> Peach Plus</strong> serves FHA and VA borrowers who earn too much for core Georgia
        Dream — income limits rise to roughly $206,000–$237,000 in the Atlanta metro and prices to
        $725,000, in exchange for a market interest rate and slightly leaner assistance.
        <strong> Peach Select VA</strong> offers veterans a below-market rate on a VA loan with no
        first-time requirement, though without down payment assistance. <strong>Peach
        Advantage</strong>, the newest, pairs conventional loans with assistance of 2–5% of the
        loan amount for incomes up to 150% of area median. All three drop the first-time-buyer
        test.
      </p>

      <h2>The Atlanta Layer</h2>
      <p>
        If you are buying inside the city of Atlanta, a second layer of local programs can stack on
        meaningfully larger sums — and unlike Georgia Dream, several are genuinely forgivable.
        Invest Atlanta&apos;s ATL HomeNOW offers up to $20,000, forgiven after ten years of
        occupancy. Atlanta Housing runs assistance up to $20,000 — $25,000 for public safety,
        healthcare, education, and military buyers — for incomes under 80% of area median. Gwinnett
        County&apos;s Homestretch program offers up to $10,000 that converts to no repayment after
        five years&apos; occupancy. Each has its own income caps, price caps, and education
        requirements, and funding comes and goes — verify directly with each program before
        counting on it.
      </p>

      <h2>How It Fits Together</h2>
      <p>
        Georgia Dream&apos;s first mortgage rides on a standard federal loan — FHA, VA, USDA, or
        conventional — so everything in the{' '}
        <Link href="/learn/first-time-home-buyer-programs">federal programs guide</Link> about how
        those loans price and insure still applies; the state supplies the rate and the down
        payment help. Expect roughly 30–60 days from application to closing, through a
        DCA-participating lender.
      </p>
      <p>
        Before you lean on the maximum the program allows, check what the payment actually looks
        like: the{' '}
        <Link href="/calculators/mortgage/ga">Georgia mortgage calculator</Link> has the
        state&apos;s property tax and insurance figures pre-loaded, so you can see the full monthly
        cost — not just principal and interest — for any price and rate you are considering.
      </p>

    </ArticleLayout>
  )
}
