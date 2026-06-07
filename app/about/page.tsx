import type { Metadata } from 'next'
import Link from 'next/link'
import { siteAuthor } from '@/lib/author'

export const metadata: Metadata = {
  title: { absolute: 'About FinWiser — Free Financial Calculators & Guides' },
  description:
    'FinWiser provides free, accurate financial calculators and plain-English guides for mortgages, car loans, debt payoff, and investing. Learn who built the tools and how they work.',
  alternates: { canonical: 'https://finwiser.net/about' },
  openGraph: {
    title: 'About FinWiser — Free Financial Calculators & Guides',
    description: 'Free financial calculators and plain-English guides for mortgages, car loans, debt payoff, and investing.',
    type: 'website',
    url: 'https://finwiser.net/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'About FinWiser' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About FinWiser',
    description: 'Free financial calculators and plain-English guides for mortgages, car loans, debt payoff, and investing.',
  },
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FinWiser',
  url: 'https://finwiser.net',
  description: 'Free financial calculators and plain-English guides for mortgages, car loans, debt payoff, and investing.',
  foundingDate: '2026',
  founder: {
    '@type': 'Person',
    name: siteAuthor.name,
    url: siteAuthor.url,
  },
  knowsAbout: [
    'Mortgage calculators',
    'Car loan calculators',
    'Compound interest calculators',
    'Debt payoff planning',
    'Loan amortization',
    'Personal finance education',
  ],
}

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteAuthor.name,
  url: siteAuthor.url,
  description: siteAuthor.bio,
  worksFor: { '@type': 'Organization', name: 'FinWiser', url: 'https://finwiser.net' },
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <div className="min-h-screen bg-slate-50">

        {/* Hero */}
        <div className="bg-navy-900 py-14 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
              <Link href="/" className="hover:text-navy-200 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-navy-200">About</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About FinWiser</h1>
            <p className="text-navy-300 text-lg leading-relaxed max-w-2xl">
              Free, accurate financial calculators and plain-English guides so that anyone can understand their numbers before making a big money decision.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-14">

          {/* Who built this */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Who built this</h2>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0 text-white font-bold">
                PB
              </div>
              <div>
                <p className="font-semibold text-navy-900">{siteAuthor.name}</p>
                <p className="text-slate-600 leading-relaxed mt-1">
                  {siteAuthor.bio}
                </p>
                <p className="text-slate-600 leading-relaxed mt-3">
                  I built FinWiser because I kept running into the same problem: calculators that gave you a number but didn&apos;t explain the math, and articles that gave you advice but not the tools to act on it. FinWiser combines both in one place — every article links directly to the calculator it&apos;s explaining.
                </p>
              </div>
            </div>
          </section>

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Why it exists</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Financial decisions — buying a home, financing a car, paying off debt, starting to invest — are among the most consequential choices most people make. Yet the math behind these decisions is often buried in fine print, explained poorly, or hidden behind expensive advisors.
            </p>
            <p className="text-slate-600 leading-relaxed">
              FinWiser exists to fix that. Every calculator and every article is designed to help you understand <em>why</em> a number is what it is — not just what the number is.
            </p>
          </section>

          {/* How calculators are built */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">How the calculators are built</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              All calculators use standard financial formulas — the same formulas used by lenders, banks, and financial institutions. The mortgage calculator uses the standard amortization formula; the compound interest calculator uses the standard future-value formula; the debt payoff planner applies avalanche and snowball logic to actual payment schedules.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Each calculator shows full amortization or payment schedules so you can verify the math yourself, not just trust the output. I review formulas and spot-check results against published lender calculators to catch any drift.
            </p>
          </section>

          {/* Accuracy & editorial standards */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Accuracy & editorial standards</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Articles are researched using publicly available financial data and reflect widely accepted personal finance principles. Any averages cited (such as interest rate benchmarks) can change over time — I encourage you to verify current rates with your lender before making decisions.
            </p>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 px-5 py-4 rounded-r-lg">
              <p className="text-emerald-900 text-sm leading-relaxed">
                <strong>Important:</strong> FinWiser is an educational tool, not a licensed financial advisor. The information on this site is for informational purposes only and should not be construed as financial, tax, or legal advice. Always consult a qualified professional before making significant financial decisions.
              </p>
            </div>
          </section>

          {/* Calculators list */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">The calculators</h2>
            <ul className="space-y-3">
              {[
                { href: '/calculators/mortgage', label: 'Mortgage Calculator', desc: 'Full PITI payment with PMI, extra payments, and amortization schedule.' },
                { href: '/calculators/car-loan', label: 'Car Loan Calculator', desc: 'Monthly payment, total interest, sales tax, trade-in, and affordability check.' },
                { href: '/calculators/loan-amortization', label: 'Loan Amortization Calculator', desc: 'Complete amortization schedule for any loan amount, rate, and term.' },
                { href: '/calculators/debt-payoff', label: 'Debt Payoff Planner', desc: 'Avalanche vs. snowball comparison with custom extra payment.' },
                { href: '/calculators/compound-interest', label: 'Compound Interest Calculator', desc: 'Investment growth with monthly contributions and configurable compounding.' },
                { href: '/calculators/mortgage/compare', label: 'Compare Mortgages', desc: 'Side-by-side comparison of up to three mortgage scenarios.' },
                { href: '/calculators/biweekly-mortgage', label: 'Biweekly Mortgage Calculator', desc: 'See how biweekly payments reduce your mortgage term and total interest.' },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-4 group"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-navy-900 group-hover:text-navy-600 transition-colors text-sm">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-navy-400 group-hover:text-emerald-500 transition-colors text-sm mt-0.5">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Questions & corrections</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Found an error in a calculation or article? I want to know — accuracy matters on financial content and I take corrections seriously.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get in touch →
            </Link>
          </section>

        </div>
      </div>
    </>
  )
}
