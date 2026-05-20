import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function saveAIResult(
  userId: string,
  agentType: string,
  title: string,
  result: unknown,
  input: unknown,
  detectedLanguage?: string
) {
  try {
    await getSupabaseAdmin().from("ai_conversations").insert({
      user_id: userId,
      agent_type: agentType,
      title,
      messages: [{ role: "assistant", content: JSON.stringify(result), timestamp: new Date().toISOString() }],
      context: input,
      ...(detectedLanguage ? { detected_language: detectedLanguage } : {}),
    });
  } catch {
    // Best-effort save
  }
}
