import type { Metadata } from 'next'
import Link from 'next/link'
import { siteAuthor } from '@/lib/author'

export const metadata: Metadata = {
  title: { absolute: 'Contact FinWiser' },
  description: 'Send a message to the team behind FinWiser — for corrections, questions, or feedback about the calculators and guides.',
  alternates: { canonical: 'https://finwiser.net/contact' },
  openGraph: {
    title: 'Contact FinWiser',
    description: 'Send a message to the team behind FinWiser — for corrections, questions, or feedback.',
    type: 'website',
    url: 'https://finwiser.net/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact FinWiser' }],
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="bg-navy-900 py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-6">
            <Link href="/" className="hover:text-navy-200 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Contact</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get in touch</h1>
          <p className="text-navy-300 text-lg leading-relaxed">
            Questions, corrections, or feedback about the calculators or guides.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 space-y-10">

        {/* Who you're reaching */}
        <div className="flex gap-4 items-start bg-white border border-slate-100 shadow-card rounded-xl p-6">
          <div className="w-11 h-11 rounded-full bg-navy-900 flex items-center justify-center flex-shrink-0 text-white font-bold">
            PB
          </div>
          <div>
            <p className="font-semibold text-navy-900">{siteAuthor.name}</p>
            <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{siteAuthor.bio}</p>
          </div>
        </div>

        {/* Ways to reach */}
        <section>
          <h2 className="text-xl font-bold text-navy-900 mb-5">Ways to reach me</h2>
          <div className="space-y-4">

            <div className="bg-white border border-slate-100 shadow-card rounded-xl p-5">
              <h3 className="font-semibold text-navy-900 text-sm mb-1">Calculation errors or article corrections</h3>
              <p className="text-slate-500 text-sm mb-3 leading-relaxed">
                If a calculator produces a wrong result, or an article contains an inaccurate number or outdated claim, please let me know. I take accuracy seriously on financial content.
              </p>
              <a
                href="mailto:hello@finwiser.net?subject=Correction"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                hello@finwiser.net
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="bg-white border border-slate-100 shadow-card rounded-xl p-5">
              <h3 className="font-semibold text-navy-900 text-sm mb-1">General questions or feedback</h3>
              <p className="text-slate-500 text-sm mb-3 leading-relaxed">
                Feature ideas, missing calculators, or anything else about the site.
              </p>
              <a
                href="mailto:hello@finwiser.net?subject=Feedback"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                hello@finwiser.net
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-emerald-50 border-l-4 border-emerald-500 px-5 py-4 rounded-r-lg">
          <p className="text-emerald-900 text-sm leading-relaxed">
            FinWiser is an educational resource, not a licensed financial advisor. We cannot provide personalized financial, tax, or legal advice. Please consult a qualified professional for advice specific to your situation.
          </p>
        </div>

        <div className="text-center">
          <Link href="/about" className="text-sm text-navy-500 hover:text-navy-700 transition-colors">
            ← Back to About
          </Link>
        </div>

      </div>
    </div>
  )
}
