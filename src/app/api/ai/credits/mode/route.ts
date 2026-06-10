import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mode } = await request.json();

    if (!["economy", "balanced", "premium"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    await admin
      .from("user_ai_balances")
      .update({ ai_cost_mode: mode })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true, mode });
  } catch (error) {
    console.error("Cost mode update error:", error);
    return NextResponse.json({ error: "Failed to update cost mode" }, { status: 500 });
  }
}
