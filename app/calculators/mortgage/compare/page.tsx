import MortgageCompare, { type Scenario } from '@/components/calculators/MortgageCompare'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compare Mortgages',
  description:
    'Compare up to 3 mortgage scenarios side by side — different rates, terms, or down payments.',
}

export default async function MortgageComparePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialScenarios: Scenario[] | undefined
  if (params.saved) {
    const { data } = await supabase
      .from('saved_calculations')
      .select('inputs')
      .eq('id', params.saved)
      .single()
    if (data?.inputs?.scenarios) {
      try {
        initialScenarios = JSON.parse(data.inputs.scenarios) as Scenario[]
      } catch {
        // malformed JSON — fall through to defaults
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <a href="/" className="hover:text-navy-600 transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/calculators/mortgage"
            className="hover:text-navy-600 transition-colors"
          >
            Mortgage Calculator
          </a>
          <span>/</span>
          <span className="text-slate-700 font-medium">Compare</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Compare Mortgages
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Compare up to 3 mortgage scenarios side by side. Edit any field to
          instantly see how rate, term, or down payment changes affect your
          total cost.
        </p>
      </div>

      <MortgageCompare
        initialParams={params}
        initialScenarios={initialScenarios}
        user={user ? { email: user.email } : null}
      />
    </div>
  )
}
