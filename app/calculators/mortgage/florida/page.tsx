import { flConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(flConfig)

export default function FloridaMortgagePage() {
  return <StateMortgageCalculatorPage config={flConfig} />
}
