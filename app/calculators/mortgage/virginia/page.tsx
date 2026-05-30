import { vaConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(vaConfig)

export default function VirginiaMortgagePage() {
  return <StateMortgageCalculatorPage config={vaConfig} />
}
