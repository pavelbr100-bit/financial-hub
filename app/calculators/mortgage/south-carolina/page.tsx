import { scConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(scConfig)

export default function SouthCarolinaMortgagePage() {
  return <StateMortgageCalculatorPage config={scConfig} />
}
