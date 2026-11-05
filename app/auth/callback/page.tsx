'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/** Only same-site paths — never `//evil.com` or an absolute URL. */
function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

/**
 * Landing page for Supabase email links (signup confirmation, password reset).
 *
 * The site is a static export, so this runs in the browser. The Supabase browser
 * client detects `?code=` on startup and exchanges it for a session itself (PKCE —
 * the code verifier was stored in a cookie when the email was requested), so we
 * only wait for that session rather than exchanging the one-time code a second time.
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const next = safeNext(new URLSearchParams(window.location.search).get('next'))

    createClient()
      .auth.getSession()
      .then(({ data: { session } }) => {
        router.replace(session ? next : '/auth/login?error=auth_callback_failed')
      })
  }, [router])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <p className="text-slate-500" role="status">Signing you in…</p>
    </div>
  )
}
