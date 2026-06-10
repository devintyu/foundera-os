import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAI, InsufficientCreditsError } from "@/lib/ai/router";
import { getFunnelPrompt } from "@/lib/ai/prompts/funnel";
import { saveAIResult } from "@/lib/ai/save-result";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { offer, audience, pricePoint, goal, language } = await request.json();

    const userMessage = `Design a complete sales funnel for this business:

Offer: ${offer}
Target Audience: ${audience}
Price Point: ${pricePoint || "Not specified"}
Primary Goal: ${goal || "Generate sales"}

Design the most effective funnel to convert cold traffic into paying customers for this specific offer and audience.`;

    const result = await routeAI({
      agentType: "funnel_architect",
      systemPrompt: getFunnelPrompt(),
      userMessage,
      preferredLanguage: language,
      userId: user.id,
    });

    const parsed = JSON.parse(result.content);
    await saveAIResult(user.id, "funnel_architect", offer, parsed, { offer, audience, pricePoint, goal }, result.detectedLanguage);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Funnel builder error:", error);
    return NextResponse.json({ error: "Failed to generate funnel" }, { status: 500 });
  }
}
