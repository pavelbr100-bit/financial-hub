import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'How FinWiser works — all calculations run in your browser using standard financial formulas. No data is sent to a server. Learn how your data is stored and kept private.',
}

const sections = [
  {
    title: 'The Calculators',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v12a1 1 0 001 1z" />
      </svg>
    ),
    items: [
      {
        heading: 'All calculations run in your browser',
        body: 'No data is sent to a server when you calculate. The math happens entirely on your device using standard financial formulas — the same ones used by banks and spreadsheets.',
      },
      {
        heading: 'Loan & mortgage math',
        body: 'Monthly payments are calculated using the standard amortization formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is the principal, r is the monthly rate, and n is the number of payments. Each row in the schedule is derived from this.',
      },
      {
        heading: 'Extra payments',
        body: 'When you add extra monthly or yearly payments, the schedule recalculates from scratch — each extra payment reduces the balance faster, which lowers the interest charged in subsequent months and shortens the loan.',
      },
      {
        heading: 'Results are estimates',
        body: 'Calculators use the inputs you provide. Real loans may include fees, rate adjustments, or rounding differences. Always verify with your lender before making financial decisions.',
      },
    ],
  },
  {
    title: 'Saving Your Work',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
    ),
    items: [
      {
        heading: 'Free account required',
        body: 'To save calculations you need a free account. Sign up with your email — no credit card, no paid plans. Your account exists solely to associate saved calculations with you.',
      },
      {
        heading: 'What gets saved',
        body: 'When you save a calculation we store the inputs (loan amount, rate, term, etc.) and the key results (monthly payment, total interest). The full amortization schedule is not stored — it is recalculated from the inputs when you load a saved entry.',
      },
      {
        heading: 'Loading a saved calculation',
        body: 'Clicking Load on a saved calculation takes you back to the calculator with all your original inputs pre-filled. You can then adjust any value and recalculate.',
      },
    ],
  },
  {
    title: 'Your Data & Privacy',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    items: [
      {
        heading: 'Authentication via Supabase',
        body: 'User accounts and sessions are managed by Supabase, a hosted Postgres database platform. Passwords are hashed — we never store them in plain text. Session tokens are stored in secure, HTTP-only cookies.',
      },
      {
        heading: 'Row-level security',
        body: 'Each saved calculation is linked to your user ID. Database-level row security policies ensure you can only read, create, or delete your own data — even if someone knew your record IDs.',
      },
      {
        heading: 'No tracking or analytics',
        body: 'We do not run third-party analytics scripts. The only external script that may load is Google AdSense for ads, which has its own privacy policy.',
      },
    ],
  },
  {
    title: 'Technology',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    items: [
      {
        heading: 'Next.js 15 + React',
        body: 'The site is built with Next.js 15 using the App Router. Pages that need user data (like /saved) are server-rendered — your session is verified on the server before any data is returned.',
      },
      {
        heading: 'Deployed on Cloudflare Workers',
        body: 'Every page is served from Cloudflare\'s global edge network, which means the server runs close to wherever you are in the world. Deployments happen automatically on every push to the main GitHub branch.',
      },
      {
        heading: 'Open source',
        body: 'The full source code is publicly available on GitHub. You can inspect every calculation, every database query, and every piece of UI.',
      },
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-4">How it works</h1>
        <p className="text-slate-500 text-lg leading-relaxed">
          A plain-language explanation of how the calculators work, how your data is handled, and what powers the site.
        </p>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-navy-100 text-navy-700">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold text-navy-900">{section.title}</h2>
            </div>
            <div className="space-y-5 pl-1">
              {section.items.map((item) => (
                <div key={item.heading} className="border-l-2 border-slate-200 pl-5">
                  <h3 className="font-semibold text-slate-800 mb-1">{item.heading}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-700 text-sm font-medium mb-1">Want the full technical breakdown?</p>
          <p className="text-slate-400 text-sm">Every technology, component, and design decision explained in depth.</p>
        </div>
        <Link
          href="/tech"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-700 hover:bg-navy-600 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          Technical deep dive
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
