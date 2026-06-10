import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    usageLogsRes,
    modelBreakdownRes,
    topUsersRes,
    topupHistoryRes,
    balancesRes,
    expensivePromptsRes,
  ] = await Promise.all([
    // Total usage this month
    admin!.from("ai_usage_logs")
      .select("model_used, total_tokens, estimated_cost_usd, credit_deducted")
      .gte("created_at", monthStart),

    // Usage by model
    admin!.from("ai_usage_logs")
      .select("model_used, total_tokens, estimated_cost_usd, credit_deducted")
      .gte("created_at", monthStart),

    // Top users by cost
    admin!.from("ai_usage_logs")
      .select("user_id, estimated_cost_usd, credit_deducted, model_used")
      .gte("created_at", monthStart),

    // Top-up history
    admin!.from("topup_transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),

    // Active balances
    admin!.from("user_ai_balances")
      .select("user_id, plan_id, remaining_ai_credits, remaining_topup_credits, remaining_gemini_tokens, remaining_claude_tokens, ai_cost_mode"),

    // Most expensive prompts
    admin!.from("ai_usage_logs")
      .select("user_id, agent_id, task_type, model_used, total_tokens, estimated_cost_usd, created_at")
      .gte("created_at", monthStart)
      .order("estimated_cost_usd", { ascending: false })
      .limit(10),
  ]);

  const logs = usageLogsRes.data || [];
  const topUsers = topUsersRes.data || [];
  const topups = topupHistoryRes.data || [];
  const balances = balancesRes.data || [];
  const expensivePrompts = expensivePromptsRes.data || [];

  // Aggregate totals
  let totalCreditsUsed = 0;
  let totalGeminiTokens = 0;
  let totalClaudeTokens = 0;
  let totalEstimatedCost = 0;

  const modelBreakdown: Record<string, { tokens: number; cost: number; calls: number }> = {};

  for (const log of logs) {
    totalCreditsUsed += log.credit_deducted || 0;
    totalEstimatedCost += parseFloat(log.estimated_cost_usd) || 0;

    const model = log.model_used;
    if (!modelBreakdown[model]) {
      modelBreakdown[model] = { tokens: 0, cost: 0, calls: 0 };
    }
    modelBreakdown[model].tokens += log.total_tokens || 0;
    modelBreakdown[model].cost += parseFloat(log.estimated_cost_usd) || 0;
    modelBreakdown[model].calls += 1;

    if (model.startsWith("gemini")) {
      totalGeminiTokens += log.total_tokens || 0;
    } else {
      totalClaudeTokens += log.total_tokens || 0;
    }
  }

  // Top users by cost
  const userCostMap: Record<string, { cost: number; credits: number; claudeTokens: number }> = {};
  for (const log of topUsers) {
    if (!userCostMap[log.user_id]) {
      userCostMap[log.user_id] = { cost: 0, credits: 0, claudeTokens: 0 };
    }
    userCostMap[log.user_id].cost += parseFloat(log.estimated_cost_usd) || 0;
    userCostMap[log.user_id].credits += log.credit_deducted || 0;
    if (!log.model_used.startsWith("gemini")) {
      userCostMap[log.user_id].claudeTokens += 1;
    }
  }

  const topUsersByCost = Object.entries(userCostMap)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 10);

  // Get user names for top users
  const topUserIds = topUsersByCost.map((u) => u.userId);
  const { data: profiles } = await admin!
    .from("profiles")
    .select("id, full_name, plan")
    .in("id", topUserIds);

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

  const topUsersWithNames = topUsersByCost.map((u) => ({
    ...u,
    fullName: profileMap.get(u.userId)?.full_name || "Unknown",
    plan: profileMap.get(u.userId)?.plan || "starter",
  }));

  return NextResponse.json({
    totalCreditsUsed,
    totalGeminiTokens,
    totalClaudeTokens,
    totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
    totalCalls: logs.length,
    modelBreakdown,
    topUsersByCost: topUsersWithNames,
    topupHistory: topups,
    balanceSummary: {
      totalUsers: balances.length,
      modeDistribution: balances.reduce((acc, b) => {
        acc[b.ai_cost_mode] = (acc[b.ai_cost_mode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    expensivePrompts,
  });
}
