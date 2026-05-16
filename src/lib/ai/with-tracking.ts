import { createClient } from "@/lib/supabase/server";
import { trackAIUsage } from "./track-usage";
import { saveAIResult } from "./save-result";

export async function getUserAndTrack(tokensUsed: number) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await trackAIUsage(user.id, tokensUsed);
    }
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function getUserTrackAndSave(
  tokensUsed: number,
  agentType: string,
  title: string,
  result: unknown,
  input: unknown
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await Promise.all([
        trackAIUsage(user.id, tokensUsed),
        saveAIResult(user.id, agentType, title, result, input),
      ]);
    }
    return user?.id ?? null;
  } catch {
    return null;
  }
}
