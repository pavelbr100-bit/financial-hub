import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How FinWiser collects, uses, and protects your information.',
  openGraph: {
    title: 'Privacy Policy | FinWiser',
    description: 'How FinWiser collects, uses, and protects your information.',
    type: 'website',
    url: 'https://finwiser.net/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-navy-600 transition-colors">Home</a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Privacy Policy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: May 2025</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6 sm:p-8 space-y-8 text-slate-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">What we collect</h2>
          <p>FinWiser is a free calculator tool. We collect minimal data to operate the service:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-500">
            <li><strong className="text-slate-700">Email address</strong> — only if you create a free account. Used solely to identify your account.</li>
            <li><strong className="text-slate-700">Saved calculations</strong> — if you choose to save a calculation while signed in, we store the inputs and results in your account.</li>
            <li><strong className="text-slate-700">Usage data</strong> — basic analytics (pages visited, browser type) collected via standard server logs and Cloudflare&apos;s infrastructure. No fingerprinting.</li>
          </ul>
          <p className="mt-3">
            <strong className="text-slate-700">You do not need an account to use any calculator.</strong> All calculations happen in your browser — nothing is sent to our servers unless you explicitly save it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">How we use your data</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>To authenticate your account and retrieve your saved calculations.</li>
            <li>To improve the site (understanding which calculators are used most).</li>
            <li>We do <strong className="text-slate-700">not</strong> sell your data to third parties.</li>
            <li>We do <strong className="text-slate-700">not</strong> use your data for advertising targeting.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Cookies and advertising</h2>
          <p>
            FinWiser displays ads through <strong className="text-slate-700">Google AdSense</strong>. Google may use cookies to serve ads based on your prior visits to websites. You can opt out of personalized advertising at{' '}
            <a href="https://www.google.com/settings/ads" className="text-navy-600 hover:underline" target="_blank" rel="noopener noreferrer">
              google.com/settings/ads
            </a>.
          </p>
          <p className="mt-2">
            We do not set our own tracking cookies beyond what is required for session authentication.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Third-party services</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li><strong className="text-slate-700">Supabase</strong> — authentication and database. Your account email and saved calculations are stored in Supabase&apos;s infrastructure.</li>
            <li><strong className="text-slate-700">Cloudflare</strong> — hosting and CDN. Cloudflare may log IP addresses and request metadata per their standard policies.</li>
            <li><strong className="text-slate-700">Google AdSense</strong> — advertising. Subject to Google&apos;s privacy policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Your rights</h2>
          <p>
            You can delete your account and all associated data at any time by signing in and using the account settings, or by contacting us directly. We will fulfill deletion requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-900 mb-3">Contact</h2>
          <p>
            Questions about this policy? Email us at{' '}
            <a href="mailto:hello@finwiser.net" className="text-navy-600 hover:underline">
              hello@finwiser.net
            </a>.
          </p>
        </section>

      </div>
    </div>
  )
}
