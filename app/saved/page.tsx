import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import SavedCalculationsList from '@/components/SavedCalculationsList'
import type { SavedCalculation } from '@/lib/supabase/calculations'

export const metadata: Metadata = {
  title: 'My Saved Calculations',
}

export default async function SavedPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data } = await supabase
    .from('saved_calculations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">My Saved Calculations</h1>
        <p className="text-slate-500">Load any saved calculation back into the calculator, or delete ones you no longer need.</p>
      </div>
      <SavedCalculationsList calculations={(data ?? []) as SavedCalculation[]} />
    </div>
  )
}
