'use client'

import { formatDistanceToNow } from 'date-fns'

interface UsageHistoryProps {
  logs: {
    id: string
    agent_id: string | null
    task_type: string
    model_used: string
    total_tokens: number
    credit_deducted: number
    created_at: string
  }[] | null
  transactions: {
    id: string
    topup_package_name: string
    amount_usd: number
    ai_credits_added: number
    status: string
    created_at: string
  }[] | null
}

const MODEL_COLORS: Record<string, string> = {
  'gemini-flash-lite': 'text-[#10B981]',
  'gemini-flash': 'text-[#00F0FF]',
  'claude-sonnet': 'text-[#8B5CF6]',
  'claude-opus': 'text-[#F59E0B]',
}

export default function UsageHistory({ logs, transactions }: UsageHistoryProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Usage Logs */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">Recent AI Usage</h3>
        <div className="space-y-3">
          {logs && logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg bg-[#0A0A0F] p-3">
                <div>
                  <p className="text-sm font-medium text-[#F8FAFC]">
                    {(log.agent_id || log.task_type).replace(/_/g, ' ')}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-[#94A3B8]">
                    <span className={MODEL_COLORS[log.model_used] || 'text-[#94A3B8]'}>{log.model_used}</span>
                    <span>&middot;</span>
                    <span>{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#94A3B8]">{log.total_tokens.toLocaleString()} tokens</p>
                  <p className="text-sm font-medium text-[#EF4444]">-{log.credit_deducted} credits</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#94A3B8]">No usage yet</p>
              <p className="text-xs text-[#94A3B8]/60">Start using AI agents to see your history</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">Top-Up History</h3>
        <div className="space-y-3">
          {transactions && transactions.length > 0 ? (
            transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between rounded-lg bg-[#0A0A0F] p-3">
                <div>
                  <p className="text-sm font-medium text-[#10B981]">+{txn.ai_credits_added.toLocaleString()} Credits</p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    {formatDistanceToNow(new Date(txn.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#F8FAFC]">${txn.amount_usd}</p>
                  <p className={`text-xs ${
                    txn.status === 'completed' ? 'text-[#10B981]' :
                    txn.status === 'pending' ? 'text-[#F59E0B]' :
                    'text-[#EF4444]'
                  }`}>
                    {txn.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#94A3B8]">No transactions yet</p>
              <p className="text-xs text-[#94A3B8]/60">Top up credits to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
