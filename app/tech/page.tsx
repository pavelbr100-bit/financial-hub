import TechPageContent from '@/components/TechPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Deep Dive',
  description:
    'How FinWiser is built — Next.js 15, Supabase, Cloudflare Workers, Recharts, and Vitest. Architecture diagrams, technology choices, and implementation details.',
}

export default function TechPage() {
  return <TechPageContent />
}
