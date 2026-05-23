'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'architecture' | 'technologies' | 'features'

const technologies = [
  {
    name: 'Next.js 15',
    category: 'Frontend',
    why: 'Full-stack React framework with server-side rendering built in. The App Router lets us render pages on the server (so the user gets HTML immediately) while keeping interactive parts as client components.',
    how: 'Each calculator page is a server component that fetches the current user from Supabase, then passes it as a prop to the client-side calculator component. This means auth is verified server-side before any data is sent to the browser.',
    detail: 'We use async/await in page components, the cookies() API for session reading, and searchParams (as a Promise in Next.js 15) to pre-populate calculators from saved calculations.',
    color: 'bg-black text-white',
    icon: '▲',
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    why: 'Catches bugs at compile time rather than runtime. Without TypeScript, the mortgage interest-saved bug (where a component used the wrong formula) would have been harder to reason about and test.',
    how: 'Every function, prop, and state variable is typed. The shared calculation libs (lib/calculators/) export typed interfaces that both the components and tests rely on — if a type changes, the compiler flags every affected file.',
    detail: 'Strict mode is enabled. The Cloudflare build fails on any type error, which is how we caught the Recharts tooltip formatter type mismatch before it went live.',
    color: 'bg-blue-600 text-white',
    icon: 'TS',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    why: 'Utility-first CSS keeps styles co-located with markup, eliminating the "what does this class do?" problem of separate stylesheets. No CSS files to maintain.',
    how: 'The design system uses two custom color palettes — navy (dark blue range) and emerald (green accents) — defined in tailwind.config.ts. Every component uses these tokens directly.',
    detail: 'No CSS modules, no styled-components, no runtime style injection. Tailwind purges unused classes at build time so the shipped CSS bundle is tiny.',
    color: 'bg-teal-500 text-white',
    icon: '🌊',
  },
  {
    name: 'Recharts',
    category: 'Frontend',
    why: 'The most popular React-native charting library. It renders SVG, works with server-side rendering, and has a declarative API that fits naturally into JSX.',
    how: 'Three chart types are used: BarChart (P&I split), LineChart (balance over time), and AreaChart (equity growth). All charts are in AmortizationCharts.tsx and receive a pre-aggregated yearly dataset computed from the monthly schedule.',
    detail: 'Data is aggregated from monthly to yearly before being passed to Recharts — 360 data points would make bars too narrow to read. The yearly aggregation groups months into years and sums principal and interest.',
    color: 'bg-emerald-600 text-white',
    icon: '📊',
  },
  {
    name: 'Supabase',
    category: 'Backend',
    why: 'Managed PostgreSQL with a built-in auth system. We get email/password auth, session management, and a real database without running our own servers.',
    how: 'Two integration points: (1) @supabase/ssr for server-side session reading in Next.js middleware and server components — cookies are read and refreshed on every request. (2) The browser client is used inside client components (calculators) to save and delete calculations.',
    detail: 'Row Level Security (RLS) is enabled on the saved_calculations table. A policy ensures auth.uid() = user_id on every read/write — even if someone bypassed the app and hit the database API directly, they could only see their own rows.',
    color: 'bg-emerald-800 text-white',
    icon: '🔋',
  },
  {
    name: '@opennextjs/cloudflare',
    category: 'Infrastructure',
    why: 'Next.js is designed for Node.js servers. Cloudflare Workers run a different JavaScript runtime (workerd). This adapter re-bundles the Next.js output into a format the Workers runtime understands.',
    how: 'The build command (opennextjs-cloudflare build) runs next build first, then post-processes the output into .open-next/worker.js (the server function) and .open-next/assets (static files). Wrangler then uploads both to Cloudflare.',
    detail: 'We switched from @cloudflare/next-on-pages to @opennextjs/cloudflare because the older package required every route to explicitly export runtime = "edge", and had a known bug with the Next.js 15 /_not-found route.',
    color: 'bg-orange-500 text-white',
    icon: '⚡',
  },
  {
    name: 'Cloudflare Workers',
    category: 'Infrastructure',
    why: 'Edge computing — the server runs in the datacenter closest to the user, not in a fixed region. A user in Tokyo and a user in London both get low-latency responses.',
    how: 'Every page request hits a Worker that runs the Next.js server logic, reads the session cookie, queries Supabase if needed, and returns rendered HTML. Static assets (JS, CSS, images) are served directly from Cloudflare\'s CDN.',
    detail: 'The free tier covers 100,000 requests per day. Deployments are triggered automatically by every push to the main GitHub branch via the Cloudflare Git integration.',
    color: 'bg-orange-600 text-white',
    icon: '☁️',
  },
  {
    name: 'Vitest',
    category: 'Testing',
    why: 'Faster than Jest, native ESM support, and zero config for TypeScript projects. The entire test suite runs in under 200ms.',
    how: 'Tests live in lib/calculators/__tests__/ alongside the pure calculation functions they test. The calculation libs are framework-agnostic — no React, no browser APIs — so they run in a plain Node environment.',
    detail: 'The mortgage interest-saved bug was not caught by tests because the buggy formula lived inside the component, not in a tested lib. The fix was to extract buildSchedule() into lib/calculators/mortgage.ts and add a test that asserts: when extra payments are applied, totalInterest must be less than without them. If the formula had been wrong, this test would fail.',
    color: 'bg-yellow-400 text-black',
    icon: '🧪',
  },
]

const features = [
  {
    name: 'Loan Amortization Calculator',
    how: 'Pure math in the browser. The standard amortization formula computes a fixed monthly payment from principal, rate, and term. Each row of the schedule is then derived by: interest = balance × monthly_rate, principal = payment − interest, new_balance = balance − principal. Extra payments reduce the balance faster, which lowers interest in subsequent rows and may end the schedule before the original term.',
    decisions: 'The schedule is computed entirely client-side on every Calculate click — no caching, no server round-trips. This keeps the UX instant and means no server cost per calculation.',
  },
  {
    name: 'Mortgage Calculator',
    how: 'Same P&I amortization math as the loan calculator, with four additional monthly costs layered on top: property tax (home price × annual rate ÷ 12), home insurance (annual cost ÷ 12), PMI (loan × rate ÷ 12, only when down payment < 20%), and optional HOA. The displayed monthly payment is the sum of all five components.',
    decisions: 'PMI is shown automatically when the down payment drops below 20% of home price — we detect this live as the user types. The user can adjust the PMI rate since actual rates vary by lender and credit score.',
  },
  {
    name: 'Save & Load Calculations',
    how: 'When a logged-in user clicks Save, the calculator inputs (not the full schedule) and the key result summary are written to the saved_calculations table in Supabase. The schedule is not stored — it\'s recalculated from the inputs when loaded. Load links use URL search params (?amount=250000&rate=6.5…) that the page reads via Next.js searchParams and passes as initialValues props to the calculator component.',
    decisions: 'Storing inputs rather than the full schedule keeps rows small (under 1KB each) and means the schedule is always recalculated fresh — no stale data.',
  },
  {
    name: 'Auth Flow',
    how: 'Signup calls supabase.auth.signUp() with emailRedirectTo pointing at /auth/callback. Supabase sends a confirmation email. The callback route exchanges the one-time code for a session using supabase.auth.exchangeCodeForSession(). Sessions are stored in cookies and refreshed by middleware on every request. Forgot password follows the same pattern: resetPasswordForEmail() → email link → callback → /auth/reset-password → supabase.auth.updateUser().',
    decisions: 'All auth logic uses @supabase/ssr rather than the plain JS client. The SSR package correctly handles cookies in both server components (via next/headers) and middleware (via NextRequest.cookies).',
  },
  {
    name: 'Charts',
    how: 'Monthly schedule data is aggregated into yearly buckets before being passed to Recharts. Each year sums the principal paid, interest paid, and takes the final balance of that year. Three views: P&I Split (stacked bar — shows how interest dominates early years), Balance (line — shows the slow-then-fast paydown curve), Equity (area — mortgage only, shows equity building as balance falls).',
    decisions: 'Yearly aggregation was chosen over monthly because 360 individual bars would be illegible. The chart component is shared between both calculators — the mortgage calculator passes homePrice to enable the Equity tab, which the loan calculator omits.',
  },
]

function TechCard({ tech, isOpen, onToggle }: {
  tech: typeof technologies[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-lg ${tech.color} flex items-center justify-center font-bold text-sm flex-shrink-0`}>
          {tech.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-navy-900">{tech.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tech.category}</span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{tech.why.split('.')[0]}.</p>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4 bg-slate-50">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Why we chose it</p>
            <p className="text-sm text-slate-700 leading-relaxed">{tech.why}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">How we use it</p>
            <p className="text-sm text-slate-700 leading-relaxed">{tech.how}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Detail</p>
            <p className="text-sm text-slate-700 leading-relaxed">{tech.detail}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ feature, isOpen, onToggle }: {
  feature: typeof features[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-navy-900">{feature.name}</span>
        <svg
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4 bg-slate-50">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">How it works</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feature.how}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Design decisions</p>
            <p className="text-sm text-slate-700 leading-relaxed">{feature.decisions}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TechPage() {
  const [tab, setTab] = useState<Tab>('architecture')
  const [openTech, setOpenTech] = useState<string | null>(null)
  const [openFeature, setOpenFeature] = useState<string | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-2">
        <Link href="/how-it-works" className="text-sm text-slate-400 hover:text-navy-600 transition-colors">
          ← How it works
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-3 mt-4">Technical deep dive</h1>
      <p className="text-slate-500 text-lg leading-relaxed mb-8">
        Every component, every technology choice, and the reasoning behind each decision.
      </p>

      {/* Tab bar */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden mb-8">
        {([
          { id: 'architecture', label: 'Architecture' },
          { id: 'technologies', label: 'Technologies' },
          { id: 'features', label: 'Features' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-navy-700 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Architecture tab */}
      {tab === 'architecture' && (
        <div className="space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            A request from a user&apos;s browser flows through three layers before returning HTML: Cloudflare&apos;s edge network, the Next.js server (running in a Worker), and Supabase for auth and data.
          </p>

          {/* Diagram */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            {/* Browser */}
            <div className="flex justify-center">
              <div className="bg-slate-100 border border-slate-300 rounded-lg px-6 py-3 text-sm font-medium text-slate-700 text-center">
                🌐 Browser
                <p className="text-xs font-normal text-slate-400 mt-0.5">React client components</p>
              </div>
            </div>

            <div className="flex justify-center"><div className="w-px h-6 bg-slate-300" /></div>

            {/* Cloudflare */}
            <div className="flex justify-center">
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-6 py-3 text-sm font-medium text-orange-800 text-center">
                ☁️ Cloudflare Edge Network
                <p className="text-xs font-normal text-orange-500 mt-0.5">CDN + Workers runtime · global PoPs</p>
              </div>
            </div>

            <div className="flex justify-center"><div className="w-px h-6 bg-slate-300" /></div>

            {/* Next.js Worker */}
            <div className="flex justify-center">
              <div className="bg-black text-white rounded-lg px-6 py-3 text-sm font-medium text-center">
                ▲ Next.js 15 Worker
                <p className="text-xs font-normal text-slate-300 mt-0.5">Server components · middleware · API routes</p>
              </div>
            </div>

            <div className="flex justify-center gap-12">
              <div className="flex flex-col items-center gap-0">
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-24 h-px bg-slate-300" />
              </div>
              <div className="flex flex-col items-center gap-0">
                <div className="w-px h-6 bg-slate-300" />
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-medium text-emerald-800 text-center">
                🔋 Supabase
                <p className="text-xs font-normal text-emerald-600 mt-0.5">Auth · PostgreSQL · RLS</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm font-medium text-blue-800 text-center">
                📊 Recharts
                <p className="text-xs font-normal text-blue-500 mt-0.5">Client-side SVG charts</p>
              </div>
            </div>
          </div>

          {/* Request flow */}
          <div className="space-y-3">
            <h2 className="font-semibold text-navy-900">Request flow — loading /saved</h2>
            {[
              { step: '1', text: 'Browser requests /saved. Request hits the nearest Cloudflare PoP.' },
              { step: '2', text: 'Cloudflare routes the request to the financial-hub Worker.' },
              { step: '3', text: 'Next.js middleware reads the session cookie and calls supabase.auth.getUser() to verify it.' },
              { step: '4', text: 'The /saved page (server component) awaits createClient(), then queries saved_calculations filtered by user_id via RLS.' },
              { step: '5', text: 'Next.js renders the full HTML server-side and streams it back through Cloudflare to the browser.' },
              { step: '6', text: 'React hydrates the page. The delete buttons become interactive client-side without a full page reload.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-navy-700 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Deploy flow */}
          <div className="space-y-3">
            <h2 className="font-semibold text-navy-900">Deploy flow</h2>
            {[
              { step: '1', text: 'Developer pushes to the main branch on GitHub.' },
              { step: '2', text: 'Cloudflare Git integration detects the push and starts a build.' },
              { step: '3', text: 'Build runs: npm ci → opennextjs-cloudflare build (which runs next build internally) → opennextjs-cloudflare deploy.' },
              { step: '4', text: 'The .open-next/worker.js bundle and .open-next/assets are uploaded to Cloudflare\'s global network.' },
              { step: '5', text: 'New Worker version is deployed with zero downtime. Old version handles requests until the new one is live.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies tab */}
      {tab === 'technologies' && (
        <div className="space-y-3">
          <p className="text-slate-500 text-sm mb-5">Click any technology to see why it was chosen and exactly how it&apos;s used.</p>
          {technologies.map((tech) => (
            <TechCard
              key={tech.name}
              tech={tech}
              isOpen={openTech === tech.name}
              onToggle={() => setOpenTech(openTech === tech.name ? null : tech.name)}
            />
          ))}
        </div>
      )}

      {/* Features tab */}
      {tab === 'features' && (
        <div className="space-y-3">
          <p className="text-slate-500 text-sm mb-5">How each feature is implemented under the hood.</p>
          {features.map((feature) => (
            <FeatureCard
              key={feature.name}
              feature={feature}
              isOpen={openFeature === feature.name}
              onToggle={() => setOpenFeature(openFeature === feature.name ? null : feature.name)}
            />
          ))}
        </div>
      )}

      <div className="mt-12 pt-6 border-t border-slate-100">
        <Link
          href="/how-it-works"
          className="text-sm text-navy-600 hover:text-navy-800 font-medium transition-colors"
        >
          ← Back to how it works
        </Link>
      </div>
    </div>
  )
}
