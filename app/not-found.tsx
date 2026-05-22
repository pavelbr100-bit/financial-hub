export const runtime = 'edge'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-navy-900 mb-4">404</p>
        <h1 className="text-xl font-semibold text-slate-700 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-5 py-2.5 bg-navy-700 hover:bg-navy-600 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
