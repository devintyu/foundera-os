import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function trackAIUsage(userId: string, tokensUsed: number) {
  const month = new Date().toISOString().slice(0, 7);
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("id, ai_calls_count, tokens_used")
    .eq("user_id", userId)
    .eq("month", month)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({
        ai_calls_count: existing.ai_calls_count + 1,
        tokens_used: existing.tokens_used + tokensUsed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      month,
      ai_calls_count: 1,
      tokens_used: tokensUsed,
    });
  }
}
