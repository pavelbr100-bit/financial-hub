import { createClient } from './client'

export interface SavedCalculation {
  id: string
  name: string
  type: string
  inputs: {
    loanAmount: string
    interestRate: string
    loanTerm: string
    termUnit: 'years' | 'months'
    startDate: string
  }
  summary: {
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
  }
  created_at: string
}

export async function saveCalculation(data: Omit<SavedCalculation, 'id' | 'created_at'>) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('saved_calculations').insert({
    user_id: user.id,
    name: data.name,
    type: data.type,
    inputs: data.inputs,
    summary: data.summary,
  })
  if (error) throw error
}

export async function deleteCalculation(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('saved_calculations').delete().eq('id', id)
  if (error) throw error
}
