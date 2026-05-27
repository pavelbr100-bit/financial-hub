import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { absolute: 'About FinWiser — Free Financial Calculators & Guides' },
  description:
    'FinWiser provides free, accurate financial calculators and plain-English guides for mortgages, car loans, debt payoff, and investing. Learn who we are and how we build our tools.',
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
  knowsAbout: [
    'Mortgage calculators',
    'Car loan calculators',
    'Compound interest calculators',
    'Debt payoff planning',
    'Loan amortization',
    'Personal finance education',
  ],
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
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
              We build free, accurate financial calculators and plain-English guides so that anyone can understand their numbers before making a big money decision.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-14">

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Our mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Financial decisions — buying a home, financing a car, paying off debt, starting to invest — are among the most consequential choices most people make. Yet the math behind these decisions is often buried in fine print, explained poorly, or hidden behind expensive advisors.
            </p>
            <p className="text-slate-600 leading-relaxed">
              FinWiser exists to fix that. Every calculator we build and every article we write is designed to help you understand <em>why</em> a number is what it is — not just what the number is.
            </p>
          </section>

          {/* What we offer */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">What we offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Free calculators',
                  description: 'Six financial calculators covering mortgages, car loans, loan amortization, debt payoff, compound interest, and mortgage comparisons. No signup, no ads blocking your results.',
                },
                {
                  title: 'Plain-English guides',
                  description: 'Over 20 articles on personal finance topics written to explain the concepts behind the numbers — not just repeat common advice.',
                },
                {
                  title: 'Full amortization schedules',
                  description: 'Every loan calculator shows a complete payment-by-payment breakdown so you can see exactly where your money goes each month.',
                },
                {
                  title: 'Save your calculations',
                  description: 'Create a free account to save and revisit your calculations — useful when comparing scenarios over time.',
                },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
                  <h3 className="font-semibold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Accuracy & editorial standards */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Accuracy & editorial standards</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              All calculators use standard financial formulas — the same formulas used by lenders, banks, and financial institutions. We document the methodology behind each tool and review calculations regularly to ensure accuracy.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our articles are researched using publicly available financial data and reflect widely accepted personal finance principles. We cite averages (such as interest rate benchmarks) that can change over time and encourage readers to verify current rates with their lender.
            </p>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 px-5 py-4 rounded-r-lg">
              <p className="text-emerald-900 text-sm leading-relaxed">
                <strong>Important:</strong> FinWiser is an educational tool, not a licensed financial advisor. The information on this site is for informational purposes only and should not be construed as financial, tax, or legal advice. Always consult a qualified professional before making significant financial decisions.
              </p>
            </div>
          </section>

          {/* Calculators list */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Our calculators</h2>
            <ul className="space-y-3">
              {[
                { href: '/calculators/mortgage', label: 'Mortgage Calculator', desc: 'Full PITI payment with PMI, extra payments, and amortization schedule.' },
                { href: '/calculators/car-loan', label: 'Car Loan Calculator', desc: 'Monthly payment, total interest, sales tax, trade-in, and affordability check.' },
                { href: '/calculators/loan-amortization', label: 'Loan Amortization Calculator', desc: 'Complete amortization schedule for any loan amount, rate, and term.' },
                { href: '/calculators/debt-payoff', label: 'Debt Payoff Planner', desc: 'Avalanche vs. snowball comparison with custom extra payment.' },
                { href: '/calculators/compound-interest', label: 'Compound Interest Calculator', desc: 'Investment growth with monthly contributions and configurable compounding.' },
                { href: '/calculators/mortgage/compare', label: 'Compare Mortgages', desc: 'Side-by-side comparison of up to three mortgage scenarios.' },
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

          {/* Contact / feedback */}
          <section>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Feedback & corrections</h2>
            <p className="text-slate-600 leading-relaxed">
              Found an error in a calculation or article? We want to know. Accuracy matters on financial content and we take corrections seriously. You can reach us at{' '}
              <a href="mailto:hello@finwiser.net" className="text-emerald-600 hover:text-emerald-500 underline underline-offset-2 transition-colors">
                hello@finwiser.net
              </a>.
            </p>
          </section>

        </div>
      </div>
    </>
  )
}
