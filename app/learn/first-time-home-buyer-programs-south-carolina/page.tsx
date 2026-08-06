import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('first-time-home-buyer-programs-south-carolina')!
const related = [
  getArticle('first-time-home-buyer-programs')!,
  getArticle('first-time-home-buyer-programs-nc')!,
  getArticle('first-time-home-buyer-programs-georgia')!,
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
  { q: 'Do you have to be a first-time buyer to get help in South Carolina?', a: 'It depends on the county — genuinely. SC Housing\'s main Homebuyer Program applies the classic first-time test (no ownership in the past three years) only in twelve counties, including Greenville, Richland, Lexington, Charleston, and York. In the other thirty-four "targeted" counties, prior ownership is fine as long as you don\'t own a home at the moment your new loan closes. And Palmetto Home Advantage, the state\'s other main program, has no first-time requirement anywhere.' },
  { q: 'How much down payment assistance does SC Housing offer, and is it forgiven?', a: 'The Homebuyer Program pairs its mortgage with $10,000 in assistance, structured as a 0% second mortgage with no monthly payment that is forgiven if you stay in the home through its 15-year term. Sell, refinance, or move out earlier and it becomes due. Palmetto Home Advantage instead offers 3% or 4% of the loan amount as a forgivable second on a shorter 10-year term. Unlike some states\' repayable assistance, both SC structures genuinely forgive.' },
  { q: 'What are the income and price limits for SC Housing programs?', a: 'The Homebuyer Program caps the purchase price at $450,000 in every county. Income limits vary by county and household size — as of mid-2026, roughly $95,800 for a one-to-two-person household in the Columbia-area counties, $106,400 in Greenville, and $117,500 in Charleston, with substantially higher caps like $141,000 in targeted counties such as Berkeley and Dorchester. Palmetto Home Advantage is simpler: $140,000 of borrower income statewide, regardless of household size, with no purchase price limit.' },
  { q: 'Is the South Carolina mortgage tax credit (MCC) still available?', a: 'No — the SC Mortgage Tax Credit program sunset on June 30, 2026, and is closed to new buyers. It had offered a federal tax credit worth 30% of annual mortgage interest, capped at $2,000 per year. Buyers who already hold a certificate keep their credit for the life of their loan; there is simply no way to get a new one in South Carolina right now. Plenty of older articles still list it as active, so date-check anything you read.' },
  { q: 'What credit score do SC Housing programs require?', a: 'A minimum of 640, across the board — the Homebuyer Program and Palmetto Home Advantage both apply it to every loan type they offer, whether FHA, VA, USDA, or conventional. Some older guides mention 620; current program documents say 640. Individual participating lenders can also layer their own, sometimes stricter, requirements on top, so a 640 is the floor, not a guarantee.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        South Carolina&apos;s buyer help runs on two parallel tracks, and which one fits you
        depends less on your income than on a map. SC Housing — the state&apos;s housing finance
        authority, now at schousing.sc.gov — offers a traditional, income-limited{' '}
        <strong>Homebuyer Program</strong> with forgivable down payment assistance, and a broader{' '}
        <strong>Palmetto Home Advantage</strong> program that skips the first-time-buyer test
        entirely. Both run through participating lenders rather than the agency itself.
      </p>
      <p>
        Figures below are current as of mid-2026; SC Housing updates its limits each June, so
        confirm against the agency&apos;s posted limits before planning around any single number.
      </p>

      <h2>The County Rule That Decides Who Counts</h2>
      <p>
        The Homebuyer Program splits the state&apos;s 46 counties into two groups, and the
        difference is not cosmetic. In twelve <em>non-targeted</em> counties — Aiken, Anderson,
        Charleston, Greenville, Greenwood, Lancaster, Lexington, Oconee, Pickens, Richland,
        Spartanburg, and York — you must be a first-time buyer, meaning no ownership interest in a
        principal residence in the past three years. In the other thirty-four <em>targeted</em>
        counties, that rule vanishes: you only need to not own a home on the day your new loan
        closes.
      </p>
      <p>
        The practical effect: someone who sold a house two years ago qualifies in Sumter, Florence,
        or Beaufort, and does not qualify a county over in Columbia&apos;s Richland. Targeted
        counties also carry higher income limits — the designation exists to pull investment into
        those areas, and the program is genuinely more generous there.
      </p>

      <h2>The Homebuyer Program</h2>
      <p>
        The core offer is a 30-year fixed-rate mortgage — FHA, VA, USDA, or conventional — with{' '}
        <strong>$10,000 of down payment assistance</strong> attached. The assistance is a 0%
        second mortgage with no monthly payment, <strong>forgiven if you stay through its 15-year
        term</strong>; leave, sell, or refinance earlier and it comes due. That structure is worth
        pausing on, because it is more generous than many states — Georgia&apos;s equivalent, for
        contrast, must be repaid in full no matter how long you stay.
      </p>
      <p>
        The requirements, as of mid-2026: a minimum 640 credit score for every loan type, a
        purchase price of <strong>$450,000 or less anywhere in the state</strong>, county-based
        income limits (roughly $95,800 for a 1–2 person household in the Columbia-area counties,
        $106,400 in Greenville, $117,500 in Charleston, and up to $141,000 in targeted counties
        like Berkeley and Dorchester — higher for larger households), and a homebuyer education
        course, which your lender arranges, before any assistance is approved.
      </p>

      <h2>Palmetto Home Advantage</h2>
      <p>
        The second track drops most of the gatekeeping. Palmetto Home Advantage has{' '}
        <strong>no first-time-buyer requirement in any county</strong>, no purchase price limit,
        and one statewide income test: $140,000 of borrower income — the borrower&apos;s, not the
        whole household&apos;s, and independent of family size. The same 640 score applies.
      </p>
      <p>
        Its assistance works differently: 3% or 4% of the loan amount (or none, in exchange for a
        lower rate) as a forgivable second mortgage on a <strong>10-year term</strong>. On a
        $300,000 loan, 4% is $12,000 — more than the bond program&apos;s flat $10,000, forgiven in
        two-thirds the time. For buyers who clear both programs&apos; doors, the comparison is
        worth running in both directions with a lender who writes both.
      </p>

      <div className="callout">
        <p><strong>Gone as of June 30, 2026:</strong> the SC Mortgage Tax Credit (MCC), which
        converted 30% of annual mortgage interest into a federal tax credit of up to $2,000 a
        year, has sunset and is closed to new buyers. Existing certificate holders keep their
        credit. A lot of &ldquo;South Carolina first-time buyer&rdquo; articles still list it —
        check the date on anything you read, including this page.</p>
      </div>

      <h2>The Programs With Windows</h2>
      <p>
        SC Housing also runs smaller initiatives that open, fill, and close. <strong>Palmetto
        Heroes</strong> offers teachers, nurses, first responders, EMS, corrections officers, and
        veterans $10,000 of forgivable assistance plus a below-market rate — the 2026 round opened
        in mid-March and was fully reserved within a month. A <strong>first-generation
        buyer</strong> initiative pairs $10,000 with a reduced rate for buyers whose parents never
        owned. <strong>Made It Home!</strong> reaches up to $25,000, forgiven after ten years.
        And <strong>County First</strong> extends special financing into 31 rural counties for
        first-time and move-up buyers alike. None of these is a plan you can count on being open
        the month you shop — they are a reason to ask a participating lender what currently has
        funding.
      </p>

      <h2>Putting It Together</h2>
      <p>
        Every SC Housing product rides on a standard federal loan, so the mechanics — FHA&apos;s
        insurance, VA&apos;s funding fee, conventional PMI — are the ones covered in the{' '}
        <Link href="/learn/first-time-home-buyer-programs">federal programs guide</Link>. The state
        adds the rate, the assistance, and the forgiveness clock.
      </p>
      <p>
        And before the assistance decides anything, look at the whole payment. The{' '}
        <Link href="/calculators/mortgage/south-carolina">South Carolina mortgage calculator</Link> carries the
        state&apos;s property tax and insurance defaults, so you can see what a $450,000-limit
        house actually costs per month versus the smaller one that leaves room to breathe.
      </p>

    </ArticleLayout>
  )
}
