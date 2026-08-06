import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('first-time-home-buyer-programs-nc')!
const related = [
  getArticle('first-time-home-buyer-programs')!,
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
  { q: 'Is the NC Home Advantage down payment assistance really forgiven?', a: 'Yes, on a clock. Both the 3% assistance and the $15,000 1st Home Advantage are 0% second mortgages with no payments, and nothing is forgiven for the first ten years. Then 20% of the balance forgives at the end of each of years 11 through 15, so after year 15 you owe nothing. Sell or refinance in year 8 and you repay all of it from your proceeds; sell after year 12 and you repay the 60% not yet forgiven. Stay long enough and it was free money.' },
  { q: 'Who qualifies for the $15,000 NC 1st Home Advantage Down Payment?', a: 'Three groups: first-time buyers (no ownership interest in a principal residence in the past three years), qualifying military veterans using the benefit once, and anyone buying in a designated targeted census tract. Because it is bond-funded, this program carries stricter rules than the base 3% option: county-specific household income limits, a $525,000 sales price cap, three years of tax returns in the file, and the possibility of federal recapture tax if you sell at a gain within nine years while your income has risen sharply.' },
  { q: 'Do you have to be a first-time buyer to get help in North Carolina?', a: 'No — and this is North Carolina\'s most unusual feature. The base NC Home Advantage Mortgage, including its 3% down payment assistance, is explicitly open to repeat buyers; the program guide states borrowers do not have to be first-time homebuyers. Only the $15,000 enhanced assistance reserves itself for first-timers, veterans, and targeted-tract buyers. A move-up buyer who fits the $158,000 income limit can still take the state\'s rate and the 3% help.' },
  { q: 'What income limit applies to NC Home Advantage?', a: 'A flat $158,000 statewide as of mid-2026 — the same in every county, with no adjustment for household size. It also counts only the qualifying income of borrowers actually on the loan, not total household income, so a working spouse who stays off the application does not count against it. The $15,000 1st Home Advantage program is different: county-by-county limits based on total family income, which you check with the lookup tool on nchfa.com.' },
  { q: 'Does North Carolina still offer a mortgage tax credit (MCC)?', a: 'No. The NC Home Advantage Tax Credit — worth up to $2,000 a year against federal taxes for first-time buyers — stopped accepting new applications in 2025 when its funding ran out, and NCHFA has removed it from its current program materials. Buyers who already hold a certificate keep claiming their credit for the life of their loan. Older articles still describe it as available; in 2026 it is history, not an option.' },
  { q: 'Can NC programs be combined with other assistance?', a: 'Yes, within limits. The Community Partners Loan Pool can stack up to 25% of the price (max $50,000) on top of an NC Home Advantage Mortgage — including alongside the $15,000 1st Home Advantage — for buyers under 80% of county median income, working through a nonprofit partner. City programs add another layer: Raleigh offers up to $45,000 (or $60,000 in its enhanced version), Durham up to $80,000 forgivable, and Charlotte runs House Charlotte through DreamKey Partners. Each has its own income caps and funding cycles, so current availability always needs a direct check.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        North Carolina&apos;s buyer help comes through the NC Housing Finance Agency, and its
        structure is easy to hold in your head: one base program almost any moderate-income buyer
        can use, one enhanced $15,000 layer reserved for first-timers, veterans, and buyers in
        targeted census tracts, and a forgiveness clock that turns both from loans into gifts if
        you stay put. Everything runs through participating lenders — the agency itself does not
        take applications.
      </p>
      <p>
        Figures here are current as of mid-2026 (NCHFA raised its limits in June 2026); the
        agency&apos;s site, nchfa.com, is the authority if you are reading this later.
      </p>

      <h2>The Base Program: NC Home Advantage Mortgage</h2>
      <p>
        The foundation is a 30-year fixed-rate mortgage — FHA, VA, USDA, or conventional — with
        optional down payment assistance of <strong>up to 3% of the loan amount</strong>. The
        surprise is who can use it: <strong>repeat buyers qualify</strong>, not just first-timers.
        The limits are generous and refreshingly simple — qualifying income up to{' '}
        <strong>$158,000 statewide</strong> (the same in every county, counting only borrowers on
        the loan, not the whole household), a minimum 640 credit score, a debt-to-income ratio no
        higher than 45%, and no agency cap on the home&apos;s price for the base program.
      </p>
      <p>
        The assistance is a second mortgage at 0% interest with no monthly payment — but not the
        repayable kind some states use. It forgives itself: nothing for ten years, then{' '}
        <strong>20% of the balance at the end of each of years 11 through 15</strong>. Stay the
        full fifteen and you owe nothing at all.
      </p>

      <div className="callout">
        <p><strong>How the clock plays out:</strong> take 3% on a $300,000 loan — $9,000. Sell in
        year 8 and the full $9,000 is repaid from your sale proceeds. Sell after year 12, with two
        forgiveness steps banked, and you repay $5,400. Stay past year 15 and the debt is simply
        gone. The assistance costs nothing to hold — the only question is whether your timeline
        outlasts the schedule.</p>
      </div>

      <h2>The $15,000 Layer: NC 1st Home Advantage</h2>
      <p>
        For buyers who pass a narrower gate, the 3% assistance is replaced by a flat{' '}
        <strong>$15,000</strong> — same 0% deferred structure, same years-11-through-15
        forgiveness. The gate: you are a first-time buyer under the three-year test, a qualifying
        veteran (a one-time use, with service and discharge requirements), or buying in a targeted
        census tract.
      </p>
      <p>
        Because this layer is funded by tax-exempt bonds, federal rules ride along. Income limits
        switch from the flat statewide figure to <strong>county-specific caps based on total
        family income</strong> — check yours with the tool on nchfa.com. The sales price is capped
        at <strong>$525,000</strong>. Three years of tax returns go in the file. And a federal{' '}
        <em>recapture tax</em> can apply if you sell within nine years at a gain after your income
        has risen substantially — it rarely bites in practice, but your lender must disclose it,
        and it is worth knowing the name when they do.
      </p>

      <h2>Stacking Deeper: CPLP and the City Programs</h2>
      <p>
        For lower incomes, North Carolina allows real stacking. The{' '}
        <strong>Community Partners Loan Pool</strong> adds up to 25% of the purchase price — capped
        at $50,000 — as another 0% deferred second for buyers under 80% of their county&apos;s
        median income, arranged through nonprofit partner organizations rather than lenders, and it
        can sit on top of the $15,000 1st Home Advantage. A first-time buyer in that income band
        can assemble five figures of assistance before touching savings.
      </p>
      <p>
        The big cities layer on again, with amounts that dwarf the state&apos;s:{' '}
        <strong>Raleigh</strong> lends up to $45,000 — $60,000 in its enhanced program with a
        ten-year deed restriction — to first-time buyers under 80% of area median income.{' '}
        <strong>Durham</strong> goes to $80,000, forgivable over fifteen years.{' '}
        <strong>Charlotte&apos;s</strong> House Charlotte program, administered by DreamKey
        Partners, tiers its help by income with a purchase price cap. City funding opens and
        closes with budget cycles, so treat these as leads to verify the week you shop, not
        standing offers.
      </p>

      <h2>What&apos;s Gone: The Tax Credit</h2>
      <p>
        Until recently North Carolina also issued Mortgage Credit Certificates — the NC Home
        Advantage Tax Credit, worth up to $2,000 a year against federal income tax. That program{' '}
        <strong>stopped taking new applications in 2025</strong> when its funds ran out, and the
        agency has scrubbed it from current materials. Certificate holders keep their credit;
        everyone else should ignore the older articles still promoting it.
      </p>

      <h2>Reading the Fine Print Against Your Plans</h2>
      <p>
        All of these ride on the standard federal loan types, so the trade-offs covered in the{' '}
        <Link href="/learn/first-time-home-buyer-programs">federal programs guide</Link> — FHA
        insurance that never cancels, conventional PMI that does, VA&apos;s funding fee — still
        decide most of your monthly cost. The state contributes the rate, the down payment, and
        the forgiveness clock; the loan underneath behaves exactly as it would anywhere.
      </p>
      <p>
        And the forgiveness clock is the piece to hold against your honest timeline. Assistance
        that forgives in year 15 is worth less to a buyer who expects to move in five — that
        buyer is really taking an interest-free loan, which is still a good deal, but a different
        one. To see what any of these homes costs per month with North Carolina&apos;s property
        taxes and insurance built in, the{' '}
        <Link href="/calculators/mortgage/nc">North Carolina mortgage calculator</Link> is
        pre-loaded with the state&apos;s figures.
      </p>

    </ArticleLayout>
  )
}
