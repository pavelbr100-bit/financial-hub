'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SavedCalculationsList from '@/components/SavedCalculationsList'
import type { SavedCalculation } from '@/lib/supabase/calculations'

/**
 * Loads the signed-in user's saved calculations in the browser (the site is a
 * static export, so there is no server to do it). Row Level Security on
 * saved_calculations (auth.uid() = user_id) is what keeps rows private — this
 * component only decides what to show. Signed-out visitors go to the login page.
 */
export default function SavedCalculationsLoader() {
  const router = useRouter()
  const [calculations, setCalculations] = useState<SavedCalculation[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      if (!session) {
        router.replace('/auth/login')
        return
      }
      const { data, error } = await supabase
        .from('saved_calculations')
        .select('*')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) setFailed(true)
      else setCalculations((data ?? []) as SavedCalculation[])
    })

    return () => {
      cancelled = true
    }
  }, [router])

  if (failed) {
    return <p className="text-sm text-red-600" role="alert">Could not load your saved calculations. Please refresh the page.</p>
  }
  if (calculations === null) {
    return <p className="text-sm text-slate-500" role="status">Loading your saved calculations…</p>
  }
  return <SavedCalculationsList calculations={calculations} />
}
