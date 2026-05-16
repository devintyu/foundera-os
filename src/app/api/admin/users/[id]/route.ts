import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [profileRes, subRes, usageRes, conversationsRes] = await Promise.all([
    admin!.from("profiles").select("*").eq("id", id).single(),
    admin!.from("subscriptions").select("*").eq("user_id", id).order("created_at", { ascending: false }).limit(1).single(),
    admin!.from("usage_tracking").select("*").eq("user_id", id).order("month", { ascending: false }).limit(6),
    admin!.from("ai_conversations").select("id, agent_type, title, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  return NextResponse.json({
    profile: profileRes.data,
    subscription: subRes.data,
    usageHistory: usageRes.data || [],
    recentConversations: conversationsRes.data || [],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, admin } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const allowedFields = ["role", "plan", "founder_stage", "experience_level", "revenue_stage"];
  const updates: Record<string, string> = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error: updateError } = await admin!
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
