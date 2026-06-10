import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreditBalance from '@/components/credits/CreditBalance'
import TopUpOptions from '@/components/credits/TopUpOptions'
import UsageHistory from '@/components/credits/UsageHistory'

export default async function CreditsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: credits } = await supabase
    .from('user_ai_balances')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: transactions } = await supabase
    .from('topup_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: usageLogs } = await supabase
    .from('ai_usage_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
            AI Credits
          </span>
        </h1>
        <p className="mt-1 text-[#94A3B8]">Manage your AI usage and top-up credits</p>
      </div>

      <CreditBalance credits={credits} />
      <TopUpOptions />
      <UsageHistory logs={usageLogs} transactions={transactions} />
    </div>
  )
}
