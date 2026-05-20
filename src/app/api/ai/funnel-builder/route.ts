import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getFunnelPrompt } from "@/lib/ai/prompts/funnel";
import { getUserTrackAndSave } from "@/lib/ai/with-tracking";
import { checkAILimits } from "@/lib/ai/check-limits";

export async function POST(request: Request) {
  try {
    const { allowed, remaining } = await checkAILimits();
    if (!allowed) {
      return NextResponse.json(
        { error: "AI credit limit reached. Upgrade your plan for more.", remaining },
        { status: 429 }
      );
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
      maxTokens: 4096,
      preferredLanguage: language,
    });

    const parsed = JSON.parse(result.content);
    await getUserTrackAndSave(
      result.tokensUsed,
      "funnel_architect",
      offer,
      parsed,
      { offer, audience, pricePoint, goal },
      result.detectedLanguage
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Funnel builder error:", error);
    return NextResponse.json(
      { error: "Failed to generate funnel" },
      { status: 500 }
    );
  }
}
