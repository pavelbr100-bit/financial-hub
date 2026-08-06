import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('how-to-pay-off-credit-card-debt')!
const related = [
  getArticle('debt-avalanche-vs-snowball')!,
  getArticle('debt-payoff-strategies')!,
  getArticle('fixed-vs-variable-interest-rate')!,
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
  { q: "Why does my minimum payment go down every month?", a: "Because it is calculated as a percentage of what you currently owe, typically around 2% with a floor of about $25. As the balance falls, the percentage produces a smaller number, so the required payment shrinks with it. This is why a minimum-only payoff stretches out so far: the payment retreats at almost exactly the rate the balance does, and the two chase each other down for years. Nothing is wrong with your account when this happens — it is how the minimum is defined." },
  { q: "What is a good monthly payment on a credit card?", a: "A useful benchmark is whatever clears the balance in about two to three years, because past that point interest starts to dominate what you have paid in. On a $6,000 balance at 22%, that is roughly $250 to $300 a month. If that is out of reach, the next best target is simply a fixed number above the current minimum that you never reduce — the fixed part matters more than the size, because it is what stops the shrinking-minimum effect." },
  { q: "Is it better to pay a credit card twice a month?", a: "It helps slightly, though far less than increasing the total amount. Card interest is usually assessed on an average daily balance, so money that arrives mid-cycle reduces the balance for the remaining days and shaves a little interest. The effect is small — a few dollars a month on a typical balance. Splitting your payment is worth doing if it fits your pay schedule and helps you actually send it, but it is not a substitute for paying more." },
  { q: "Does paying more than the minimum help my credit score?", a: "Indirectly and meaningfully, though not because lenders see the payment size. Scores respond to credit utilization — the share of your limit you are using — so a falling balance raises your score whether the balance fell by $25 or $250. Paying more simply moves utilization down faster. Payment history records whether you paid on time, not how much, so a minimum payment made on time and a large payment made on time look identical on that measure." },
  { q: "Should I close a credit card after I pay it off?", a: "Usually not. Closing the account removes its limit from your total available credit, which raises your utilization ratio across every remaining card and can lower your score even though you now owe less. It also eventually shortens your average account age. The exception worth making is a card with an annual fee you do not get value from, or one you genuinely cannot stop using — the behavioural risk of an open card can outweigh the scoring cost of closing it." },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        The reason a credit card can stay open for two decades is not the interest rate on its own.
        It is that the minimum payment is defined as a <em>percentage of the balance</em> — usually
        around 2%, with a floor near $25 — so the moment your balance starts falling, the required
        payment falls with it.
      </p>
      <p>
        That single design detail does more damage than most people realise, and it is worth seeing
        the size of it before deciding what to pay.
      </p>

      <h2>What the Shrinking Minimum Costs</h2>
      <p>
        Take a $5,000 balance at 24% APR. The opening minimum is $150. Pay exactly that every month
        and never let it drop, and the card clears in <strong>56 months</strong> with about{' '}
        <strong>$3,322</strong> in interest. Follow the minimum as the statement recalculates it
        each month, and the same balance takes <strong>234 months</strong> — nineteen and a half
        years — and costs <strong>$8,887</strong>.
      </p>
      <div className="callout">
        <p><strong>The comparison worth sitting with:</strong> both borrowers start by sending the
        same $150. One holds it steady, one lets it shrink. The difference is $5,565 in interest
        and roughly fifteen years. The rate is identical in both cases — the entire gap comes from
        allowing the payment to fall.</p>
      </div>
      <p>
        This is why &ldquo;always pay more than the minimum&rdquo; is slightly wrong as advice. The
        instruction that actually does the work is <em>pay a fixed amount and never reduce it</em>.
        Holding your first minimum steady, forever, captures most of the benefit on its own.
      </p>

      <h2>What Each Payment Level Buys You</h2>
      <p>
        Here is the same effect on a $6,000 balance at 22% APR, where the opening minimum is $170.
        Every row is the same debt — only the monthly payment changes.
      </p>
      <table>
        <thead>
          <tr>
            <th>Monthly payment</th>
            <th>Time to clear</th>
            <th>Total interest</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Minimum, as recalculated</td><td>249 months</td><td>$9,933</td></tr>
          <tr><td>$170 held fixed</td><td>58 months</td><td>$3,746</td></tr>
          <tr><td>$200</td><td>44 months</td><td>$2,791</td></tr>
          <tr><td>$250</td><td>32 months</td><td>$1,979</td></tr>
          <tr><td>$300</td><td>26 months</td><td>$1,543</td></tr>
        </tbody>
      </table>
      <p>
        Notice where the leverage sits. Going from the shrinking minimum to the same $170 held
        steady saves $6,187 and costs nothing extra in month one. Going from $170 to $200 — thirty
        dollars — saves another $955 and fourteen months. The early increases are worth far more per
        dollar than the later ones, which is the opposite of how most people plan a payoff.
      </p>
      <p>
        You can run this against your own balance and rate with the{' '}
        <Link href="/calculators/credit-card-payoff">credit card payoff calculator</Link>, which
        compares a fixed payment against the minimum-only path directly.
      </p>

      <h2>Choosing the Number</h2>
      <p>
        A reasonable target is whatever clears the balance in two to three years. Past roughly the
        three-year mark, interest starts consuming enough of each payment that progress feels
        invisible, and that is where payoff plans get abandoned. On the $6,000 balance above,
        $250 a month lands inside that window.
      </p>
      <p>
        If that number is not available this month, set the fixed payment at whatever you can
        genuinely sustain rather than an aspirational figure you will miss in week three. A $200
        payment you make twelve times beats a $350 payment you make twice.
      </p>
      <div className="callout">
        <p><strong>Common mistake:</strong> treating a windfall as a reason to skip the following
        month&apos;s payment. A $1,000 tax refund thrown at the card is worth far more if the regular
        payment continues on top of it. Sending the lump sum and then pausing simply converts the
        windfall into a month off, and on a 22% card that trade costs you money.</p>
      </div>

      <h2>When the Card Is Not the Right Target</h2>
      <p>
        Two situations change the answer. If you hold several balances, the order matters as much as
        the amount, and that is a different calculation — the{' '}
        <Link href="/calculators/debt-avalanche">debt avalanche calculator</Link> ranks them by rate
        for the cheapest total, while the{' '}
        <Link href="/calculators/debt-snowball">debt snowball calculator</Link> ranks by balance for
        faster visible wins.
      </p>
      <p>
        The other is having no cash buffer at all. Directing every spare dollar at the card while
        holding nothing back means the next unexpected expense goes straight back onto it, usually
        undoing several months of work. A small buffer first — one or two thousand dollars — is
        worth the interest it costs you, because it is what keeps the balance moving in one
        direction.
      </p>

    </ArticleLayout>
  )
}
