import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateBalance } from "@/lib/ai/credits";
import { createClient as createAdmin } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balance = await getOrCreateBalance(user.id);
    if (!balance) {
      return NextResponse.json({ error: "Failed to load balance" }, { status: 500 });
    }

    const admin = getSupabaseAdmin();
    const { data: plan } = await admin
      .from("plans")
      .select("name, monthly_ai_credits, monthly_price_usd, monthly_price_myr, allow_claude_strategy, allow_deep_thinking")
      .eq("id", balance.plan_id)
      .single();

    const totalCredits = balance.remaining_ai_credits + balance.remaining_topup_credits;
    const monthlyTotal = plan?.monthly_ai_credits ?? 1000;
    const usedCredits = monthlyTotal - balance.remaining_ai_credits;
    const usagePercent = Math.round((usedCredits / monthlyTotal) * 100);

    return NextResponse.json({
      planName: plan?.name ?? "Starter",
      planId: balance.plan_id,
      monthlyCredits: monthlyTotal,
      remainingMonthlyCredits: balance.remaining_ai_credits,
      topupCredits: balance.remaining_topup_credits,
      totalCredits,
      usedCredits,
      usagePercent,
      costMode: balance.ai_cost_mode,
      renewalDate: balance.monthly_reset_date,
      allowClaudeStrategy: plan?.allow_claude_strategy ?? false,
      allowDeepThinking: plan?.allow_deep_thinking ?? false,
      warnings: {
        near80: usagePercent >= 80 && usagePercent < 100,
        reached100: usagePercent >= 100,
        claudeLimited: !plan?.allow_claude_strategy,
      },
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return NextResponse.json({ error: "Failed to load credits" }, { status: 500 });
  }
}
