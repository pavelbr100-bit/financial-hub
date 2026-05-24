import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions for using FinWiser financial calculators.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Terms of Use</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">Terms of Use</h1>
        <p className="text-slate-500 text-sm">Last updated: May 2025</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-8 text-slate-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">For informational purposes only</h2>
          <p>
            All calculators and results on FinWiser are provided <strong className="text-slate-700">for informational and educational purposes only</strong>. They do not constitute financial, tax, legal, or investment advice. The figures shown are estimates based on the inputs you provide and may not reflect your actual loan terms, tax obligations, or investment returns.
          </p>
          <p className="mt-2">
            Always consult a qualified financial advisor, lender, or tax professional before making any financial decision.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Accuracy</h2>
          <p>
            We make every effort to ensure our calculations are mathematically correct. However, FinWiser makes no warranty, express or implied, regarding the accuracy, completeness, or fitness for a particular purpose of any calculation result. We are not liable for any loss or damage arising from your use of this site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Use of the service</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>You may use FinWiser calculators freely, with or without an account.</li>
            <li>You may not use automated scripts or bots to scrape or stress-test the service.</li>
            <li>You may not attempt to reverse-engineer, copy, or redistribute the service for commercial purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Accounts</h2>
          <p>
            Creating an account is optional. If you create one, you are responsible for maintaining the confidentiality of your credentials. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms. We will update the &quot;Last updated&quot; date at the top of this page when changes are made.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Contact</h2>
          <p>
            Questions? Email us at{' '}
            <a href="mailto:hello@finwiser.net" className="text-navy-600 hover:underline">
              hello@finwiser.net
            </a>.
          </p>
        </section>

      </div>
    </div>
  )
}
