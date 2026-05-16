import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

const PLAN_PRICES: Record<string, number> = {
  starter: 29,
  pro: 79,
  business: 199,
  elite: 499,
};

export async function GET() {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const [
    profilesRes,
    subsRes,
    usageRes,
    recentUsersRes,
    conversationsRes,
  ] = await Promise.all([
    admin!.from("profiles").select("id, plan, role, founder_stage, created_at, onboarding_completed"),
    admin!.from("subscriptions").select("plan, status"),
    admin!.from("usage_tracking").select("ai_calls_count, tokens_used").eq("month", currentMonth),
    admin!.from("profiles").select("id, full_name, plan, created_at").order("created_at", { ascending: false }).limit(10),
    admin!.from("ai_conversations").select("id", { count: "exact", head: true }),
  ]);

  const profiles = profilesRes.data || [];
  const subs = subsRes.data || [];
  const usage = usageRes.data || [];
  const recentUsers = recentUsersRes.data || [];

  const totalUsers = profiles.length;
  const admins = profiles.filter((p) => p.role === "admin").length;
  const onboardedUsers = profiles.filter((p) => p.onboarding_completed).length;

  const activeSubs = subs.filter((s) => s.status === "active");
  const mrr = activeSubs.reduce((sum, s) => sum + (PLAN_PRICES[s.plan] || 0), 0);

  const planDistribution: Record<string, number> = {};
  for (const p of profiles) {
    const plan = p.plan || "starter";
    planDistribution[plan] = (planDistribution[plan] || 0) + 1;
  }

  const stageDistribution: Record<string, number> = {};
  for (const p of profiles) {
    const stage = p.founder_stage || "explorer";
    stageDistribution[stage] = (stageDistribution[stage] || 0) + 1;
  }

  const totalAICalls = usage.reduce((sum, u) => sum + (u.ai_calls_count || 0), 0);
  const totalTokens = usage.reduce((sum, u) => sum + (u.tokens_used || 0), 0);

  const newUsersThisMonth = profiles.filter(
    (p) => p.created_at >= `${currentMonth}-01`
  ).length;

  const subStatusCounts: Record<string, number> = {};
  for (const s of subs) {
    subStatusCounts[s.status] = (subStatusCounts[s.status] || 0) + 1;
  }

  return NextResponse.json({
    totalUsers,
    admins,
    onboardedUsers,
    newUsersThisMonth,
    mrr,
    activeSubs: activeSubs.length,
    subStatusCounts,
    totalAICalls,
    totalTokens,
    totalConversations: conversationsRes.count || 0,
    planDistribution,
    stageDistribution,
    recentUsers,
  });
}
