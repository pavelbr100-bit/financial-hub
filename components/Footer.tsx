import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 border-t border-navy-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-semibold">FinWiser</span>
            </div>
            <p className="text-navy-400 text-sm leading-relaxed">
              Your finances, only wiser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Calculators</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/calculators/loan-amortization" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Loan Amortization
                </Link>
              </li>
              <li>
                <Link href="/calculators/mortgage" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/compound-interest" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Compound Interest
                </Link>
              </li>
              <li>
                <Link href="/calculators/debt-payoff" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Debt Payoff Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-medium text-sm mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-navy-400 hover:text-emerald-400 text-sm transition-colors">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-navy-500 text-xs">
            © {currentYear} FinWiser. For informational purposes only — not financial advice.
          </p>
          <div className="flex gap-4">
            <Link href="/how-it-works" className="text-navy-500 hover:text-navy-300 text-xs transition-colors">How it works</Link>
            <Link href="/privacy" className="text-navy-500 hover:text-navy-300 text-xs transition-colors">Privacy</Link>
            <Link href="/terms" className="text-navy-500 hover:text-navy-300 text-xs transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
