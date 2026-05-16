import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET() {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7));
  }

  const [usageRes, conversationsRes, topUsersRes] = await Promise.all([
    admin!.from("usage_tracking").select("user_id, month, ai_calls_count, tokens_used").in("month", months),
    admin!.from("ai_conversations").select("agent_type, created_at"),
    admin!
      .from("usage_tracking")
      .select("user_id, ai_calls_count, tokens_used")
      .eq("month", now.toISOString().slice(0, 7))
      .order("ai_calls_count", { ascending: false })
      .limit(10),
  ]);

  const usageByMonth = months.map((month) => {
    const rows = (usageRes.data || []).filter((u) => u.month === month);
    return {
      month,
      totalCalls: rows.reduce((s, r) => s + (r.ai_calls_count || 0), 0),
      totalTokens: rows.reduce((s, r) => s + (r.tokens_used || 0), 0),
      activeUsers: new Set(rows.map((r) => r.user_id)).size,
    };
  });

  const agentCounts: Record<string, number> = {};
  for (const c of conversationsRes.data || []) {
    agentCounts[c.agent_type] = (agentCounts[c.agent_type] || 0) + 1;
  }

  const topUserIds = (topUsersRes.data || []).map((u) => u.user_id);
  let topUsersEnriched: Array<Record<string, unknown>> = [];
  if (topUserIds.length > 0) {
    const { data: profiles } = await admin!
      .from("profiles")
      .select("id, full_name, plan")
      .in("id", topUserIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
    topUsersEnriched = (topUsersRes.data || []).map((u) => ({
      ...u,
      profile: profileMap.get(u.user_id) || null,
    }));
  }

  return NextResponse.json({
    usageByMonth,
    agentDistribution: agentCounts,
    topUsers: topUsersEnriched,
  });
}
