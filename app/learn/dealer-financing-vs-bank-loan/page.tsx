import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleLayout from '@/components/ArticleLayout'
import { getArticle } from '@/lib/articles'

const meta = getArticle('dealer-financing-vs-bank-loan')!
const related = [
  getArticle('how-to-get-best-car-loan-rate')!,
  getArticle('how-car-loan-interest-works')!,
  getArticle('new-car-vs-used-car-loan')!,
]

export const metadata: Metadata = {
  title: { absolute: `${meta.title} | FinWiser` },
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
  { q: 'Is dealer financing or a bank loan better for a car?', a: 'A bank loan is usually cheaper in total interest, but dealer financing can win if the dealer is offering a promotional rate like 0% or 1.9% APR. In normal market conditions without a promotional offer, a pre-approved bank or credit union loan gives you a competitive rate and, crucially, negotiating leverage at the dealership. With a bank approval in hand, you are a cash buyer from the dealer\'s perspective, which often results in a better deal on the car price itself.' },
  { q: 'How much higher is dealer financing compared to a bank loan?', a: 'The difference varies, but dealer financing often runs 1 to 3 percentage points higher than what your bank or credit union would offer for the same loan. On a $35,000 car over 60 months, a 2.5 percentage point difference (say 8.9% vs 6.4%) costs roughly $2,500 more in total interest. The gap tends to be wider for buyers with imperfect credit, as dealers have more room to mark up the rate.' },
  { q: 'What is dealer markup on a car loan?', a: 'When you finance through a dealership, the dealer submits your application to one or more lenders. The lender quotes a buy rate — the actual rate you qualify for. The dealer is then allowed to mark up that rate (typically up to 2–2.5 percentage points) and keep the difference as profit. This is called the dealer reserve or finance reserve. You never see the buy rate; you only see the marked-up rate the dealer presents. Having a competing bank offer prevents the dealer from applying a large markup.' },
  { q: 'Should I get pre-approved before going to a dealership?', a: 'Yes — getting pre-approved by a bank or credit union before visiting a dealership is one of the most effective ways to lower your car loan cost. Pre-approval gives you a concrete rate to beat, turns you into a de facto cash buyer (which simplifies price negotiation), and eliminates the pressure of financing decisions on the lot. Even if the dealer offers a better rate to compete, you benefit. The pre-approval costs you nothing and takes an hour at most.' },
  { q: 'Are credit union auto loans better than bank auto loans?', a: 'Credit unions typically offer the lowest auto loan rates available to consumers — often 0.5 to 1.5 percentage points below traditional banks. They are nonprofit cooperatives and return profits to members via lower rates. The catch is membership eligibility: you must belong to the credit union, though most have broad membership criteria. If you have a credit union available to you, it\'s worth checking their rates first before comparing banks and dealer financing.' },
]

export default function Page() {
  return (
    <ArticleLayout meta={meta} related={related} faq={faq}>

      <p>
        Dealer financing and bank loans both get you into the same car — but they don&apos;t cost
        the same. In most cases, dealer financing is more expensive. In some cases (0% APR
        promotions), it&apos;s a genuine deal. Knowing the difference can save you thousands.
      </p>

      <h2>How Each Option Works</h2>
      <p>
        <strong>Bank or credit union loan:</strong> You apply directly to a lender before visiting
        the dealership. If approved, you receive a check or commitment letter with a specific rate
        and loan amount. At the dealer, you pay as if you&apos;re a cash buyer and your lender
        funds the purchase.
      </p>
      <p>
        <strong>Dealer financing:</strong> The finance and insurance (F&I) office at the dealership
        submits your application to a network of lenders on your behalf. The dealer then presents
        you with a rate — which may be marked up above the actual rate you qualified for. The
        markup is the dealer&apos;s profit on the financing transaction.
      </p>

      <h2>Real Numbers: $35,000 Car, 60-Month Term</h2>
      <p>
        Using a typical scenario where a buyer qualifies for 6.4% through their bank but the
        dealer offers 8.9% (a 2.5 point markup):
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Bank loan (6.4%)</th>
            <th>Dealer financing (8.9%)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Loan amount</td><td>$35,000</td><td>$35,000</td></tr>
          <tr><td>Monthly payment</td><td>$683</td><td>$725</td></tr>
          <tr><td>Total interest paid</td><td>$5,980</td><td>$8,500</td></tr>
          <tr><td>Total cost</td><td>$40,980</td><td>$43,500</td></tr>
          <tr><td>Extra cost</td><td colSpan={2} style={{textAlign: 'center'}}>$2,520 more with dealer financing</td></tr>
        </tbody>
      </table>

      <div className="callout">
        <p><strong>$2,520 extra</strong> — for the convenience of financing at the dealership without
        a competing offer. That markup is the dealer&apos;s profit on the loan. You can eliminate most
        or all of it by arriving with a bank pre-approval.</p>
      </div>

      <h2>When Dealer Financing Actually Wins</h2>
      <p>
        Dealer financing isn&apos;t always the more expensive option. There are two scenarios where
        it genuinely beats a bank loan:
      </p>
      <p>
        <strong>Manufacturer promotional rates.</strong> Automakers regularly subsidize financing
        through their captive finance arms (Toyota Financial, Ford Motor Credit, etc.) to move
        inventory. Rates of 0%, 1.9%, or 2.9% APR are common during strong promotional periods.
        These rates are far below anything a bank will offer and represent a real financial advantage
        — often worth more than a cash rebate alternative.
      </p>
      <p>
        <strong>When you negotiate the rate.</strong> If you arrive with a bank approval at 6.4%
        and the dealer wants your financing business (because they profit from it), they may
        match or beat your rate. In this case, dealer financing becomes competitive because you
        forced them to compete.
      </p>

      <h2>The Pre-Approval Strategy</h2>
      <p>
        The most effective approach is to get pre-approved <em>before</em> you shop:
      </p>
      <ol>
        <li>Check your credit union first — they typically offer the lowest rates</li>
        <li>Get a rate from your bank as a comparison</li>
        <li>Check one or two online lenders (Lightstream, PenFed, etc.)</li>
        <li>Walk into the dealership with the best offer in hand</li>
        <li>Tell the F&I office you have outside financing but are open to hearing their best rate</li>
      </ol>
      <p>
        This positions the dealer as the one competing for your business, not the other way around.
        Even if you end up using dealer financing, competition drives down the rate.
      </p>

      <h2>Watch Out for the Monthly Payment Pitch</h2>
      <p>
        Dealers often focus negotiations on the monthly payment rather than the total loan cost.
        A $42 per month difference doesn&apos;t sound like much — but it&apos;s $2,520 over 60 months.
        Always evaluate financing decisions on <strong>total interest paid</strong>, not monthly payment,
        because extending the term lowers monthly payments while dramatically increasing total cost.
      </p>

      <h2>Calculate the Difference for Your Loan</h2>
      <p>
        Use <Link href="/calculators/car-loan">FinWiser&apos;s free car loan calculator</Link> to enter
        both rates side by side and see the exact monthly payment and total interest difference
        for your specific loan amount and term. The numbers often make the decision obvious.
      </p>

    </ArticleLayout>
  )
}
