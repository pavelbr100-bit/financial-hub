import { ncConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(ncConfig)

export default function NorthCarolinaMortgagePage() {
  return <StateMortgageCalculatorPage config={ncConfig} />
}
