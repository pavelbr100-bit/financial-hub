import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('should-you-pay-off-student-loans-early')!
const related = [
  getArticle('debt-payoff-strategies')!,
  getArticle('fixed-vs-variable-interest-rate')!,
  getArticle('compound-interest-guide')!,
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
  { q: "Is it worth paying off student loans early?", a: "It depends almost entirely on whether any part of your balance is headed for forgiveness. If none of it is, early payoff is straightforward arithmetic: every extra dollar saves the interest that dollar would have accrued for the rest of the term, and on a 6.5% loan that is a guaranteed return most other uses of the money cannot match. If forgiveness is in play, extra payments reduce the amount that would have been cancelled, and you can end up paying money you were never going to owe." },
  { q: "Should I pay off student loans or invest instead?", a: "Compare your loan rate against what you would realistically earn after tax, and weight the loan side for certainty. Paying down a 6.5% loan is a risk-free 6.5% return; a diversified portfolio might average more over decades but with no guarantee in any given year. Two things usually outrank both: capturing a full employer retirement match, which is an immediate return no loan payoff can beat, and holding a basic emergency fund. Beyond those, higher-rate loans favour payoff and lower-rate loans favour investing." },
  { q: "Do federal and private student loans need different treatment?", a: "Yes, and it is the most useful distinction to draw early. Federal loans carry income-driven repayment, forbearance, and forgiveness programmes that all have real value, and paying them off early forfeits protections you cannot buy back. Private loans have none of that — they behave like any other fixed-rate installment loan, so there is no strategic reason to hold them longer than you need to. If you carry both, the private balance is almost always the better target for extra money." },
  { q: "Does paying off student loans early hurt my credit score?", a: "Only marginally, and usually temporarily. Closing an installment account can slightly reduce your credit mix and, over time, your average account age, which may cost a handful of points. Payment history and utilization matter far more, and neither is harmed by early payoff. A short dip of a few points is not a reason to keep paying interest, though it is worth knowing about if you are weeks away from applying for a mortgage." },
  { q: "What happens to my monthly payment if I pay extra?", a: "On most federal loans, nothing — the payment stays the same and the term gets shorter, which is what produces the interest savings. Some servicers instead treat a large extra payment as paying ahead and let you skip upcoming months, which quietly cancels the benefit. A few private lenders recast the loan to a lower payment over the original term, which also cancels it. Confirm which behaviour applies to your account before sending anything substantial." },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        Most debt questions have a single answer that holds for nearly everyone: high-rate debt
        should go first, and paying it down early saves money. Student loans are the exception. For
        one group of borrowers, extra payments are among the best uses of a spare dollar. For
        another, the same payments destroy money outright. The two groups are separated by one
        question, and it needs answering before any of the arithmetic matters.
      </p>

      <h2>First: Is Any of This Balance Going to Be Forgiven?</h2>
      <p>
        If you are pursuing Public Service Loan Forgiveness, or you are on an income-driven plan
        that cancels the remaining balance at the end of its term, then your loan balance is not
        really what you owe. What you owe is a stream of income-based payments for a fixed number of
        years, after which the rest disappears.
      </p>
      <p>
        In that situation an extra payment does not shorten anything. Your monthly payment is set by
        your income, not your balance, so paying more does not reduce it. All the extra dollar does
        is shrink the amount that was going to be cancelled for free. You are buying down a debt the
        programme was going to erase.
      </p>
      <div className="callout">
        <p><strong>The clearest version of the trap:</strong> a borrower with ten years of qualifying
        payments ahead of them sends an extra $200 a month throughout. At the end, the balance that
        would have been forgiven is smaller by roughly the amount they paid in. Their monthly cost
        was higher for a decade and their final outcome is identical — they simply funded part of
        the forgiveness themselves.</p>
      </div>
      <p>
        So the sequence matters. Confirm your forgiveness status first. If any meaningful part of
        the balance is on track to be cancelled, stop here — extra payments are not your best move,
        and the rest of this article does not apply to that portion of the debt.
      </p>

      <h2>If Forgiveness Is Not in Play, the Arithmetic Is Simple</h2>
      <p>
        Now the ordinary rules return. Consider $35,000 remaining at 6.5% with ten years left. The
        required payment is $397 a month, and staying on schedule costs <strong>$12,690</strong> in
        interest.
      </p>
      <table>
        <thead>
          <tr>
            <th>Extra per month</th>
            <th>Payoff</th>
            <th>Total interest</th>
            <th>Interest saved</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>None</td><td>120 months</td><td>$12,690</td><td>—</td></tr>
          <tr><td>$100</td><td>89 months</td><td>$9,186</td><td>$3,504</td></tr>
          <tr><td>$200</td><td>71 months</td><td>$7,219</td><td>$5,471</td></tr>
          <tr><td>$300</td><td>59 months</td><td>$5,955</td><td>$6,735</td></tr>
        </tbody>
      </table>
      <p>
        A one-time payment behaves differently from a recurring one, and the timing carries most of
        the weight. Putting a single $5,000 lump sum against this loan in month one cuts 22 months
        and saves $3,966 — close to what $100 a month achieves over the whole term, from a payment
        made once.
      </p>
      <p>
        The reason is that a lump sum removes principal that would otherwise have accrued interest
        for every remaining month. The same $5,000 applied in year eight has almost nothing left to
        save. If a windfall is coming and you have decided to use it here, early beats optimised.
        The{' '}
        <Link href="/calculators/student-loan-payoff">student loan payoff calculator</Link> will
        show both paths against your actual balance.
      </p>

      <h2>Where Extra Payments Rank Against Everything Else</h2>
      <p>
        Even with forgiveness ruled out, student loans rarely deserve the first spare dollar. Two
        things reliably outrank them.
      </p>
      <p>
        An employer retirement match comes first, because it is an immediate return on the money —
        often 50% or 100% — that no loan rate can compete with. Declining a match to pay down a 6.5%
        loan is giving up the larger number for the smaller one. A basic emergency fund comes next,
        for the same reason it does with any debt: without one, the next unexpected expense goes
        onto a credit card at three times the student loan rate, and the whole plan moves backwards.
      </p>
      <p>
        After those, the comparison is between your loan rate and what you would otherwise earn. A
        6.5% loan is a guaranteed 6.5% return with no volatility, which is genuinely attractive. A
        3% loan taken out years ago is a different matter, and there the case for investing instead
        is much stronger. This is the same trade-off covered in{' '}
        <Link href="/learn/compound-interest-guide">how compound interest works</Link>, viewed from
        the borrowing side.
      </p>

      <h2>Federal and Private Are Not the Same Decision</h2>
      <p>
        If you hold both, treat them separately. Private loans carry no forgiveness, no
        income-driven repayment, and no meaningful hardship protection — they are ordinary
        fixed-rate installment debt, and there is nothing to preserve by holding them longer. They
        are almost always the right target for extra money.
      </p>
      <p>
        Federal loans carry options that have real value even when you do not expect to use them.
        Paying one off early is also paying to give up income-driven repayment and forbearance,
        which are worth something to anyone whose income might fall. That is not a reason never to
        pay federal loans early. It is a reason to do the private balance first, and to think of the
        federal payoff as a decision with a cost attached rather than a free win.
      </p>

      <h2>The Order to Work Through</h2>
      <p>
        Check forgiveness. If any part of the balance is headed for cancellation, leave that part
        alone. Capture your employer match in full. Build a small emergency fund. Clear high-rate
        consumer debt, which almost always outranks student loans on rate — the{' '}
        <Link href="/learn/debt-payoff-strategies">debt payoff plan</Link> covers how to sequence
        that. Then, with what is left, attack private balances before federal ones, and use lump
        sums as early as you can rather than saving them for a tidier moment.
      </p>

    </ArticleLayout>
  )
}
