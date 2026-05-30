import { gaConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(gaConfig)

export default function GeorgiaMortgagePage() {
  return <StateMortgageCalculatorPage config={gaConfig} />
}
