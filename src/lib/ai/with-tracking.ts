import { createClient } from "@/lib/supabase/server";
import { trackAIUsage } from "./track-usage";

export async function getUserAndTrack(tokensUsed: number) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await trackAIUsage(user.id, tokensUsed);
    }
  } catch {
    // Tracking is best-effort, don't fail the request
  }
}
