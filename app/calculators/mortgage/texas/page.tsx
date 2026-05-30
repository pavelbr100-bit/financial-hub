import { txConfig, generateStateMortgageMetadata } from '@/lib/data/state-mortgage-configs'
import StateMortgageCalculatorPage from '@/components/StateMortgageCalculatorPage'

export const metadata = generateStateMortgageMetadata(txConfig)

export default function TexasMortgagePage() {
  return <StateMortgageCalculatorPage config={txConfig} />
}
