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

interface UsageTracking {
  ai_calls_count: number;
  tokens_used: number;
  month: string;
}

const PLAN_LIMITS = {
  starter: { aiCalls: 50, opusCalls: 0 },
  pro: { aiCalls: 500, opusCalls: 10 },
  business: { aiCalls: 2000, opusCalls: 50 },
  elite: { aiCalls: Infinity, opusCalls: Infinity },
} as const;

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageTracking | null>(null);
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

      const [subRes, usageRes] = await Promise.all([
        supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single(),
        supabase
          .from("usage_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq(
            "month",
            new Date().toISOString().slice(0, 7)
          )
          .single(),
      ]);

      if (subRes.data) setSubscription(subRes.data);
      if (usageRes.data) setUsage(usageRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  const plan = (subscription?.plan ?? "starter") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[plan];

  return {
    subscription,
    usage,
    loading,
    plan,
    limits,
    aiCallsUsed: usage?.ai_calls_count ?? 0,
    aiCallsRemaining: Math.max(0, limits.aiCalls - (usage?.ai_calls_count ?? 0)),
    isAtLimit: (usage?.ai_calls_count ?? 0) >= limits.aiCalls,
  };
}
