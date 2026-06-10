"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

interface AIBalance {
  remaining_ai_credits: number;
  remaining_topup_credits: number;
  remaining_gemini_tokens: number;
  remaining_claude_tokens: number;
  ai_cost_mode: string;
  plan_id: string;
  monthly_reset_date: string;
}

const PLAN_CREDITS = {
  starter: { monthlyCredits: 1000, allowClaudeStrategy: false, allowDeepThinking: false },
  pro: { monthlyCredits: 4000, allowClaudeStrategy: true, allowDeepThinking: false },
  business: { monthlyCredits: 12000, allowClaudeStrategy: true, allowDeepThinking: true },
  elite: { monthlyCredits: 50000, allowClaudeStrategy: true, allowDeepThinking: true },
} as const;

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [aiBalance, setAIBalance] = useState<AIBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [subRes, balanceRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single(),
        supabase
          .from("user_ai_balances")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (subRes.data) setSubscription(subRes.data);
      if (balanceRes.data) setAIBalance(balanceRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const plan = (subscription?.plan ?? aiBalance?.plan_id ?? "starter") as keyof typeof PLAN_CREDITS;
  const planConfig = PLAN_CREDITS[plan] ?? PLAN_CREDITS.starter;
  const totalCredits = (aiBalance?.remaining_ai_credits ?? 0) + (aiBalance?.remaining_topup_credits ?? 0);
  const monthlyCredits = planConfig.monthlyCredits;
  const usedCredits = monthlyCredits - (aiBalance?.remaining_ai_credits ?? monthlyCredits);

  return {
    subscription,
    aiBalance,
    loading,
    plan,
    costMode: (aiBalance?.ai_cost_mode ?? "balanced") as "economy" | "balanced" | "premium",
    totalCredits,
    monthlyCredits,
    usedCredits,
    topupCredits: aiBalance?.remaining_topup_credits ?? 0,
    renewalDate: aiBalance?.monthly_reset_date ?? null,
    allowClaudeStrategy: planConfig.allowClaudeStrategy,
    allowDeepThinking: planConfig.allowDeepThinking,
    isAtLimit: totalCredits <= 0,
    usagePercent: monthlyCredits > 0 ? Math.round((usedCredits / monthlyCredits) * 100) : 0,
    // Legacy compatibility
    limits: { aiCalls: monthlyCredits },
    aiCallsUsed: usedCredits,
    aiCallsRemaining: totalCredits,
    usage: null,
  };
}
