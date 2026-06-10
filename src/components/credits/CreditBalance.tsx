'use client'

import { Zap } from 'lucide-react'

interface CreditBalanceProps {
  credits: {
    remaining_ai_credits: number
    remaining_topup_credits: number
    plan_id: string
    ai_cost_mode: string
    monthly_reset_date: string
  } | null
}

export default function CreditBalance({ credits }: CreditBalanceProps) {
  const totalBalance = (credits?.remaining_ai_credits ?? 0) + (credits?.remaining_topup_credits ?? 0)

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#94A3B8]">Available Credits</p>
          <p className="flex items-center gap-2 text-4xl font-bold text-white">
            <Zap className="h-8 w-8 text-[#00F0FF]" />
            {totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[#94A3B8]">Monthly Credits</p>
          <p className="text-lg font-semibold text-[#00F0FF]">{(credits?.remaining_ai_credits ?? 0).toLocaleString()}</p>
          <p className="text-sm text-[#94A3B8]">Top-Up Credits</p>
          <p className="text-lg font-semibold text-[#10B981]">{(credits?.remaining_topup_credits ?? 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#94A3B8]">
        <span className="capitalize">Plan: {credits?.plan_id ?? 'starter'}</span>
        <span className="capitalize">Mode: {credits?.ai_cost_mode ?? 'balanced'}</span>
        {credits?.monthly_reset_date && (
          <span>Renews: {new Date(credits.monthly_reset_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        )}
      </div>

      {totalBalance < 100 && (
        <div className="mt-4 rounded-lg bg-[#F59E0B]/10 p-3 text-sm text-[#F59E0B]">
          Low credit balance. Top up to continue using AI features.
        </div>
      )}
    </div>
  )
}
