import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'

const categoryStyles: Record<ArticleMeta['categoryColor'], string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky:     'bg-sky-100 text-sky-700',
  amber:   'bg-amber-100 text-amber-700',
  purple:  'bg-purple-100 text-purple-700',
  blue:    'bg-blue-100 text-blue-700',
}

interface Props {
  meta: ArticleMeta
  children: React.ReactNode
  related?: ArticleMeta[]
}

export default function ArticleLayout({ meta, children, related }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-slate-600 transition-colors">Learn</Link>
          <span>/</span>
          <span className="text-slate-600 truncate">{meta.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-4 ${categoryStyles[meta.categoryColor]}`}>
            {meta.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 leading-tight mb-4">
            {meta.title}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-5">
            {meta.description}
          </p>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>{meta.date}</span>
            <span>·</span>
            <span>{meta.readMinutes} min read</span>
          </div>
        </header>

        {/* Article body */}
        <article className="article-body">
          {children}
        </article>

        {/* Calculator CTA */}
        <div className="mt-12 bg-navy-900 rounded-2xl p-7 text-center">
          <p className="text-navy-300 text-sm font-medium mb-2 uppercase tracking-wide">Put it into practice</p>
          <p className="text-white text-xl font-bold mb-5">{meta.calculatorLabel}</p>
          <Link
            href={meta.calculatorHref}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Open Calculator
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/learn" className="text-sm text-navy-500 hover:text-navy-700 transition-colors">
            ← Back to all articles
          </Link>
        </div>
      </div>

      {/* Related articles */}
      {related && related.length > 0 && (
        <div className="border-t border-slate-200 py-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-navy-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/learn/${r.slug}`}
                  className="group bg-white rounded-xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-5 flex flex-col"
                >
                  <span className={`self-start px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${categoryStyles[r.categoryColor]}`}>
                    {r.category}
                  </span>
                  <h3 className="text-sm font-bold text-navy-900 leading-snug mb-2 group-hover:text-navy-600 transition-colors flex-1">
                    {r.title}
                  </h3>
                  <span className="text-xs font-medium text-navy-500 group-hover:text-emerald-600 transition-colors mt-3">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
