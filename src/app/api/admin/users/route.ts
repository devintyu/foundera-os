import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const plan = searchParams.get("plan") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = (page - 1) * limit;

  let query = admin!
    .from("profiles")
    .select("id, full_name, role, plan, founder_stage, industry, experience_level, revenue_stage, onboarding_completed, created_at, updated_at", { count: "exact" });

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }
  if (plan) {
    query = query.eq("plan", plan);
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const users = data || [];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const userIds = users.map((u) => u.id);
  const [usageRes, subsRes] = await Promise.all([
    userIds.length > 0
      ? admin!.from("usage_tracking").select("user_id, ai_calls_count, tokens_used").eq("month", currentMonth).in("user_id", userIds)
      : Promise.resolve({ data: [] }),
    userIds.length > 0
      ? admin!.from("subscriptions").select("user_id, status, current_period_end").in("user_id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const usageMap = new Map((usageRes.data || []).map((u) => [u.user_id, u]));
  const subsMap = new Map((subsRes.data || []).map((s) => [s.user_id, s]));

  const enriched = users.map((u) => ({
    ...u,
    usage: usageMap.get(u.id) || { ai_calls_count: 0, tokens_used: 0 },
    subscription: subsMap.get(u.id) || null,
  }));

  return NextResponse.json({
    users: enriched,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}
