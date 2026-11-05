'use client'

import { useEffect, useState } from 'react'
import { createClient } from './client'

export type SessionUser = { email?: string | null } | null

/**
 * Reads the signed-in user in the browser.
 *
 * The site is a static export (plain files on Cloudflare static assets), so there
 * is no server to read the session cookie. The session only drives UI (the Navbar
 * email, the "Save this calculation" box); writes go through `saveCalculation`,
 * which verifies the user with `getUser()`, and Row Level Security guards the rows.
 */
export function useUser(): SessionUser {
  const [user, setUser] = useState<SessionUser>(null)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setUser(session?.user ? { email: session.user.email } : null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { email: session.user.email } : null)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return user
}
