import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { getOrCreateBalance } from "./credits";
import type { CostMode } from "./model-router";

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface LimitCheck {
  allowed: boolean;
  userId: string | null;
  remaining: number;
  costMode: CostMode;
}

export async function checkAILimits(): Promise<LimitCheck> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { allowed: false, userId: null, remaining: 0, costMode: "balanced" };
    }

    const balance = await getOrCreateBalance(user.id);
    if (!balance) {
      return { allowed: true, userId: user.id, remaining: 999, costMode: "balanced" };
    }

    const totalCredits = balance.remaining_ai_credits + balance.remaining_topup_credits;

    return {
      allowed: totalCredits > 0,
      userId: user.id,
      remaining: totalCredits,
      costMode: balance.ai_cost_mode ?? "balanced",
    };
  } catch {
    return { allowed: true, userId: null, remaining: 999, costMode: "balanced" };
  }
}
