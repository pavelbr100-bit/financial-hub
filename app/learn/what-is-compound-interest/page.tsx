import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('what-is-compound-interest')!

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
  { q: "What is compound interest in simple terms?", a: "Compound interest is interest that earns interest. When you save or invest money, you earn interest on your principal. In the next period, you earn interest on the principal plus the interest you already earned. Over time this snowball effect causes your balance to grow faster and faster. The same mechanic works in reverse for debt: unpaid interest gets added to your balance, and in the next period you owe interest on that larger amount." },
  { q: "How does compound interest grow over time?", a: "Compound interest grows slowly at first and then accelerates dramatically. The first few years of a $10,000 investment at 7% add only a few hundred dollars per year. But after 20 years the balance has grown to about $38,700, adding nearly $2,700 that year alone. After 30 years the balance reaches about $76,000, adding roughly $5,000 per year. The later years do most of the heavy lifting, which is why patience and time in the market matter so much." },
  { q: "What is the difference between compound and simple interest?", a: "Simple interest is calculated only on the original principal. Compound interest is calculated on principal plus all previously accumulated interest. For a $1,000 investment at 10% over 5 years: simple interest earns a flat $100 per year for $500 total. Compound interest earns $100, then $110, then $121, then $133, then $146, totaling $610. The gap between them grows larger every single year the money stays invested." },
  { q: "How does compound interest work on a savings account?", a: "Banks calculate and credit interest to your balance periodically, usually daily or monthly. The next calculation uses your new, slightly higher balance. Your annual percentage yield, or APY, reflects the effective annual return after compounding is factored in. A savings account with a 5% nominal rate compounding daily has an APY slightly above 5%. The practical difference is small on short timelines but adds up meaningfully over many years." },
  { q: "Can compound interest work against you?", a: "Yes, and it is just as powerful on debt as on investments. Credit card balances that carry unpaid interest have that interest added to the balance, which is then charged interest the next period. A $5,000 credit card balance at 22% APR with only minimum payments could take 15 or more years to pay off and cost $8,000 to $10,000 in total interest charges. This is why high-rate revolving debt is so financially destructive and should be paid off as aggressively as possible." }
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} faq={faq}>

      <p>
        Put $10,000 in a savings account that earns 7% per year. After one year, you have $10,700.
        Simple enough. But in year two, you earn 7% on $10,700 — not just the original $10,000.
        That extra $49 might seem trivial, but carry this forward for 30 years and you&apos;ll end up
        with $76,123 — without ever adding another dollar.
      </p>
      <p>
        That&apos;s compound interest. And understanding it changes how you think about every financial
        decision you make.
      </p>

      <h2>Simple Interest vs. Compound Interest</h2>
      <p>
        With <strong>simple interest</strong>, you earn a fixed return on your original deposit
        every period. $10,000 at 7% simple interest earns $700/year, every year. After 30 years:
        $31,000 total.
      </p>
      <p>
        With <strong>compound interest</strong>, you earn interest on your interest. Each period&apos;s
        earnings are added to the principal, so the base on which you earn grows continuously.
        After 30 years at 7% compounding annually: $76,123. The difference is $45,000 — purely
        from compounding, with no additional contributions.
      </p>
      <div className="callout">
        <p><strong>The compounding frequency matters too.</strong> Monthly compounding (where
        interest is calculated 12 times per year) produces slightly more than annual compounding.
        At 7%, $10,000 compounded monthly for 30 years grows to $81,165 vs. $76,123 annually —
        a $5,000 difference from compounding more frequently.</p>
      </div>

      <h2>The Rule of 72</h2>
      <p>
        A quick mental shortcut: divide 72 by your annual interest rate to estimate how many
        years it takes for money to double.
      </p>
      <ul>
        <li>At 6%: 72 ÷ 6 = 12 years to double</li>
        <li>At 8%: 72 ÷ 8 = 9 years to double</li>
        <li>At 10%: 72 ÷ 10 = 7.2 years to double</li>
      </ul>
      <p>
        This is why rate differences matter so much over long time horizons. An extra 2% per year
        may feel small, but it means money doubles in 9 years instead of 12 — a 3-year gap that
        compounds into a massive difference over a career.
      </p>

      <h2>Why Starting Early Beats Everything Else</h2>
      <p>
        The most powerful lever in compound interest isn&apos;t the rate or the contribution size —
        it&apos;s time. Every extra year at the start of your saving horizon is worth far more than
        extra years at the end, because early gains have the longest runway to compound.
      </p>
      <p>
        Consider two people both investing $300/month at 8%:
      </p>
      <ul>
        <li><strong>Person A</strong> starts at 25 and contributes until 35 (10 years), then
        stops completely. Total contributed: $36,000.</li>
        <li><strong>Person B</strong> starts at 35 and contributes until 65 (30 years). Total
        contributed: $108,000.</li>
      </ul>
      <p>
        At 65, Person A has roughly $561,000. Person B has roughly $408,000. Person A contributed
        one-third as much money and ends up with significantly more — because the first decade
        of compounding had 30 years to grow.
      </p>

      <h2>Compound Interest Working Against You</h2>
      <p>
        The same math applies to debt — but in reverse. Credit cards typically charge 20–29% APR,
        compounded daily. A $5,000 balance you&apos;re only paying the minimum on doesn&apos;t slowly
        disappear — it grows. At 24% APR with minimum payments, that $5,000 could take 17+ years
        to pay off and cost over $7,000 in interest alone.
      </p>
      <p>
        High-interest debt is compound interest working against you at an aggressive rate. No
        investment reliably returns 24% annually — which is why paying off high-rate debt is
        often the best &quot;investment&quot; you can make.
      </p>

      <h2>How Regular Contributions Amplify the Effect</h2>
      <p>
        A lump-sum deposit compounds well, but adding money regularly makes compound interest
        dramatically more powerful. Each new contribution immediately starts compounding on top
        of everything that&apos;s already there.
      </p>
      <p>
        $200/month invested at 7% for 30 years grows to approximately $227,000. The total
        contributed is $72,000. The other $155,000 came entirely from compounding — more than
        twice the money you actually put in.
      </p>
      <p>
        This is why automating a monthly contribution — even a modest one — is one of the most
        impactful financial habits you can build. The habit matters more than the amount, especially
        when you&apos;re starting out.
      </p>

      <h2>What to Do With This</h2>
      <p>
        The practical takeaway from compound interest is simple: start as early as possible, be
        consistent, and let time do the heavy lifting. The worst thing you can do is wait for
        conditions to be perfect — every year you delay is a year of compounding you can never
        recover.
      </p>
      <p>
        Use <Link href="/calculators/compound-interest">FinWiser&apos;s free compound interest calculator</Link> to run your own numbers in seconds —
        enter your starting amount, monthly contribution, rate, and time horizon to see exactly
        how your money grows year by year.
      </p>

    </ArticleLayout>
  )
}
