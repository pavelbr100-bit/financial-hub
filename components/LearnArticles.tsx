'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'

const categoryStyles: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky:     'bg-sky-100 text-sky-700',
  amber:   'bg-amber-100 text-amber-700',
  purple:  'bg-purple-100 text-purple-700',
  blue:    'bg-blue-100 text-blue-700',
}

const FILTERS = ['All', 'Mortgage', 'Investing', 'Debt', 'Loans', 'Auto Loans']

interface Props {
  articles: ArticleMeta[]
}

export default function LearnArticles({ articles }: Props) {
  const [active, setActive] = useState('All')

  const counts: Record<string, number> = {
    All: articles.length,
    ...Object.fromEntries(
      FILTERS.slice(1).map(f => [f, articles.filter(a => a.category === f).length])
    ),
  }

  const filtered = active === 'All' ? articles : articles.filter(a => a.category === active)

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              active === filter
                ? 'bg-navy-800 text-white border-navy-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-navy-300 hover:text-navy-700'
            }`}
          >
            {filter}
            <span className={`ml-1.5 text-xs ${active === filter ? 'text-white/70' : 'text-slate-400'}`}>
              {counts[filter]}
            </span>
          </button>
        ))}
      </div>

      {/* Article grid — key triggers remount + fade-in on filter change */}
      <div key={active} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {filtered.map(article => (
          <Link
            key={article.slug}
            href={`/learn/${article.slug}`}
            className="group bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all p-7 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyles[article.categoryColor]}`}>
                {article.category}
              </span>
              <span className="text-xs text-slate-400">{article.readMinutes} min read</span>
            </div>
            <h2 className="text-lg font-bold text-navy-900 leading-snug mb-3 group-hover:text-navy-600 transition-colors">
              {article.title}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed flex-1">
              {article.description}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-xs text-slate-400">{article.date}</span>
              <span className="text-sm font-medium text-navy-600 group-hover:text-emerald-600 transition-colors">
                Read article →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-400 text-center py-16">No articles in this category yet.</p>
      )}
    </>
  )
}
