import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'

const categoryStyles: Record<ArticleMeta['categoryColor'], string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky:     'bg-sky-100 text-sky-700',
  amber:   'bg-amber-100 text-amber-700',
  purple:  'bg-purple-100 text-purple-700',
}

interface Props {
  meta: ArticleMeta
  children: React.ReactNode
}

export default function ArticleLayout({ meta, children }: Props) {
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
    </div>
  )
}
