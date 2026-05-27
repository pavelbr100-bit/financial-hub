'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  user: { email?: string | null } | null
}

const calcLinks = [
  { href: '/calculators/mortgage', label: 'Mortgage Calculator' },
  { href: '/calculators/car-loan', label: 'Car Loan Calculator' },
  { href: '/calculators/loan-amortization', label: 'Loan Amortization' },
  { href: '/calculators/debt-payoff', label: 'Debt Payoff Planner' },
  { href: '/calculators/compound-interest', label: 'Compound Interest' },
  { href: '/calculators/mortgage/compare', label: 'Compare Mortgages' },
]

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!calcOpen) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCalcOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [calcOpen])

  // Close dropdown on route change
  useEffect(() => { setCalcOpen(false) }, [pathname])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isCalcActive = pathname.startsWith('/calculators')

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
              FinWiser
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/learn"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith('/learn')
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              Learn
            </Link>

            {/* Calculators dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCalcOpen(v => !v)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isCalcActive
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                Calculators
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${calcOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {calcOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl py-1.5 z-50">
                  {calcLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setCalcOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        pathname === link.href || (link.href !== '/calculators/mortgage' && pathname.startsWith(link.href))
                          ? 'text-white bg-navy-700'
                          : 'text-navy-200 hover:text-white hover:bg-navy-700/60'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <Link
                href="/saved"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/saved'
                    ? 'bg-navy-700 text-white'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                Saved
              </Link>
            )}
          </nav>

          {/* Auth buttons (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-navy-300 text-sm truncate max-w-[160px]">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-navy-200 hover:text-white border border-navy-600 rounded-md hover:border-navy-400 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-navy-200 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-navy-800 py-3 space-y-0.5">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-navy-700 text-white' : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              href="/learn"
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname.startsWith('/learn') ? 'bg-navy-700 text-white' : 'text-navy-200 hover:bg-navy-800 hover:text-white'
              }`}
            >
              Learn
            </Link>

            <p className="px-4 pt-3 pb-1 text-xs font-semibold text-navy-500 uppercase tracking-wider">
              Calculators
            </p>
            {calcLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href ? 'bg-navy-700 text-white' : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                href="/saved"
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/saved' ? 'bg-navy-700 text-white' : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                Saved
              </Link>
            )}

            <div className="pt-3 border-t border-navy-800 flex flex-col gap-2 px-4">
              {user ? (
                <button onClick={handleSignOut} className="text-left text-sm text-navy-300 hover:text-white py-2">
                  Sign out ({user.email})
                </button>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-sm text-navy-200 hover:text-white py-2">
                    Sign in
                  </Link>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)} className="text-sm text-center bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-md">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
