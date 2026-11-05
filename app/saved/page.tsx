import type { Metadata } from 'next'
import SavedCalculationsLoader from '@/components/SavedCalculationsLoader'

export const metadata: Metadata = {
  title: 'My Saved Calculations',
  robots: { index: false, follow: false },
}

export default function SavedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">My Saved Calculations</h1>
        <p className="text-slate-500">Load any saved calculation back into the calculator, or delete ones you no longer need.</p>
      </div>
      <SavedCalculationsLoader />
    </div>
  )
}
