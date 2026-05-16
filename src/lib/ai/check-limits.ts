import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

const PLAN_LIMITS: Record<string, number> = {
  starter: 50,
  pro: 500,
  business: 2000,
  elite: Infinity,
};

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
}

export async function checkAILimits(): Promise<LimitCheck> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { allowed: false, userId: null, remaining: 0 };
    }

    const admin = getSupabaseAdmin();

    const [profileRes, usageRes] = await Promise.all([
      admin.from("profiles").select("plan").eq("id", user.id).single(),
      admin
        .from("usage_tracking")
        .select("ai_calls_count")
        .eq("user_id", user.id)
        .eq("month", new Date().toISOString().slice(0, 7))
        .single(),
    ]);

    const plan = (profileRes.data?.plan || "starter") as string;
    const limit = PLAN_LIMITS[plan] ?? 50;
    const used = usageRes.data?.ai_calls_count ?? 0;
    const remaining = Math.max(0, limit - used);

    return {
      allowed: used < limit,
      userId: user.id,
      remaining,
    };
  } catch {
    // If check fails, allow the request (don't block users due to infra issues)
    return { allowed: true, userId: null, remaining: 999 };
  }
}
