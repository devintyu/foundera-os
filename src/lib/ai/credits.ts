import { createClient } from "@supabase/supabase-js";
import type { TaskType } from "./model-router";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface CreditCheck {
  allowed: boolean;
  reason: string;
}

interface UsageLogEntry {
  agentId: string | null;
  taskType: TaskType;
  modelUsed: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  creditDeducted: number;
}

export async function getOrCreateBalance(userId: string) {
  const admin = getSupabaseAdmin();

  const { data: balance } = await admin
    .from("user_ai_balances")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (balance) {
    // Check if monthly reset is needed
    if (new Date(balance.monthly_reset_date) <= new Date()) {
      const { data: plan } = await admin
        .from("plans")
        .select("monthly_ai_credits, monthly_gemini_tokens, monthly_claude_tokens")
        .eq("id", balance.plan_id)
        .single();

      if (plan) {
        const nextReset = new Date();
        nextReset.setMonth(nextReset.getMonth() + 1);
        nextReset.setDate(1);
        nextReset.setHours(0, 0, 0, 0);

        const { data: updated } = await admin
          .from("user_ai_balances")
          .update({
            remaining_ai_credits: plan.monthly_ai_credits,
            remaining_gemini_tokens: plan.monthly_gemini_tokens,
            remaining_claude_tokens: plan.monthly_claude_tokens,
            monthly_reset_date: nextReset.toISOString(),
          })
          .eq("user_id", userId)
          .select("*")
          .single();

        return updated ?? balance;
      }
    }
    return balance;
  }

  // Create new balance for user
  const { data: profile } = await admin
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const planId = profile?.plan ?? "starter";

  const { data: plan } = await admin
    .from("plans")
    .select("monthly_ai_credits, monthly_gemini_tokens, monthly_claude_tokens")
    .eq("id", planId)
    .single();

  const nextReset = new Date();
  nextReset.setMonth(nextReset.getMonth() + 1);
  nextReset.setDate(1);
  nextReset.setHours(0, 0, 0, 0);

  const { data: newBalance } = await admin
    .from("user_ai_balances")
    .insert({
      user_id: userId,
      plan_id: planId,
      remaining_ai_credits: plan?.monthly_ai_credits ?? 1000,
      remaining_gemini_tokens: plan?.monthly_gemini_tokens ?? 1000000,
      remaining_claude_tokens: plan?.monthly_claude_tokens ?? 50000,
      remaining_topup_credits: 0,
      monthly_reset_date: nextReset.toISOString(),
    })
    .select("*")
    .single();

  return newBalance;
}

export async function checkCredits(
  userId: string,
  estimatedCredits: number,
  isClaude: boolean,
  taskType: TaskType
): Promise<CreditCheck> {
  const balance = await getOrCreateBalance(userId);
  if (!balance) {
    return { allowed: false, reason: "Unable to verify credit balance." };
  }

  const totalAvailable = balance.remaining_ai_credits + balance.remaining_topup_credits;

  if (totalAvailable < estimatedCredits) {
    if (isClaude) {
      return {
        allowed: false,
        reason: "You have reached your premium AI usage limit. Please top up AI Credits or switch to Economy Mode.",
      };
    }
    return {
      allowed: false,
      reason: "You have reached your monthly AI usage limit. Please top up AI Credits to continue.",
    };
  }

  // Check plan permission for Claude tasks
  if (isClaude) {
    const admin = getSupabaseAdmin();
    const { data: plan } = await admin
      .from("plans")
      .select("allow_claude_strategy, allow_deep_thinking")
      .eq("id", balance.plan_id)
      .single();

    if (plan) {
      if (taskType === "strategy" && !plan.allow_claude_strategy) {
        return {
          allowed: false,
          reason: "Your current plan does not include Claude Strategy access. Upgrade to Pro or higher.",
        };
      }
      if (taskType === "deep_thinking" && !plan.allow_deep_thinking) {
        return {
          allowed: false,
          reason: "Your current plan does not include Deep Thinking access. Upgrade to Agency or higher.",
        };
      }
    }
  }

  return { allowed: true, reason: "" };
}

export async function deductCredits(
  userId: string,
  credits: number,
  claudeTokensUsed: number,
  geminiTokensUsed: number,
  logEntry: UsageLogEntry
): Promise<number> {
  const admin = getSupabaseAdmin();
  const balance = await getOrCreateBalance(userId);
  if (!balance) return 0;

  // Use monthly credits first, then top-up credits
  let monthlyDeduct = Math.min(credits, balance.remaining_ai_credits);
  let topupDeduct = credits - monthlyDeduct;

  const newMonthlyCredits = balance.remaining_ai_credits - monthlyDeduct;
  const newTopupCredits = balance.remaining_topup_credits - topupDeduct;
  const newClaudeTokens = Math.max(0, balance.remaining_claude_tokens - claudeTokensUsed);
  const newGeminiTokens = Math.max(0, balance.remaining_gemini_tokens - geminiTokensUsed);

  await admin
    .from("user_ai_balances")
    .update({
      remaining_ai_credits: Math.max(0, newMonthlyCredits),
      remaining_topup_credits: Math.max(0, newTopupCredits),
      remaining_claude_tokens: newClaudeTokens,
      remaining_gemini_tokens: newGeminiTokens,
    })
    .eq("user_id", userId);

  // Log detailed usage
  await admin.from("ai_usage_logs").insert({
    user_id: userId,
    agent_id: logEntry.agentId,
    task_type: logEntry.taskType,
    model_used: logEntry.modelUsed,
    input_tokens: logEntry.inputTokens,
    output_tokens: logEntry.outputTokens,
    total_tokens: logEntry.totalTokens,
    estimated_cost_usd: logEntry.estimatedCostUsd,
    credit_deducted: logEntry.creditDeducted,
    source: "api",
  });

  // Also update legacy usage_tracking for backwards compat
  const month = new Date().toISOString().slice(0, 7);
  const { data: existing } = await admin
    .from("usage_tracking")
    .select("id, ai_calls_count, tokens_used")
    .eq("user_id", userId)
    .eq("month", month)
    .single();

  if (existing) {
    await admin
      .from("usage_tracking")
      .update({
        ai_calls_count: existing.ai_calls_count + 1,
        tokens_used: existing.tokens_used + logEntry.totalTokens,
      })
      .eq("id", existing.id);
  } else {
    await admin.from("usage_tracking").insert({
      user_id: userId,
      month,
      ai_calls_count: 1,
      tokens_used: logEntry.totalTokens,
    });
  }

  return Math.max(0, newMonthlyCredits) + Math.max(0, newTopupCredits);
}

export async function addTopupCredits(userId: string, credits: number): Promise<void> {
  const admin = getSupabaseAdmin();
  const balance = await getOrCreateBalance(userId);
  if (!balance) return;

  await admin
    .from("user_ai_balances")
    .update({
      remaining_topup_credits: balance.remaining_topup_credits + credits,
    })
    .eq("user_id", userId);
}

export async function updatePlanBalance(userId: string, planId: string): Promise<void> {
  const admin = getSupabaseAdmin();

  const { data: plan } = await admin
    .from("plans")
    .select("monthly_ai_credits, monthly_gemini_tokens, monthly_claude_tokens")
    .eq("id", planId)
    .single();

  if (!plan) return;

  const nextReset = new Date();
  nextReset.setMonth(nextReset.getMonth() + 1);
  nextReset.setDate(1);
  nextReset.setHours(0, 0, 0, 0);

  await admin
    .from("user_ai_balances")
    .upsert({
      user_id: userId,
      plan_id: planId,
      remaining_ai_credits: plan.monthly_ai_credits,
      remaining_gemini_tokens: plan.monthly_gemini_tokens,
      remaining_claude_tokens: plan.monthly_claude_tokens,
      monthly_reset_date: nextReset.toISOString(),
    }, { onConflict: "user_id" });
}
