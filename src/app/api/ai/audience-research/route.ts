import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getAudiencePrompt } from "@/lib/ai/prompts/audience";
import { getUserTrackAndSave } from "@/lib/ai/with-tracking";
import { checkAILimits } from "@/lib/ai/check-limits";

export async function POST(req: NextRequest) {
  try {
    const { allowed, remaining } = await checkAILimits();
    if (!allowed) {
      return NextResponse.json(
        { error: "AI credit limit reached. Upgrade your plan for more.", remaining },
        { status: 429 }
      );
    }

    const { persona_name, industry, ideal_customer, language } = await req.json();

    if (!persona_name || !industry || !ideal_customer) {
      return NextResponse.json(
        { error: "Persona name, industry, and ideal customer are required" },
        { status: 400 }
      );
    }

    const userMessage = `Build a detailed customer persona:
Persona Name: ${persona_name}
Industry/Niche: ${industry}
Ideal Customer Description: ${ideal_customer}

Create a comprehensive audience profile including demographics, psychographics, pain points, desires, objections, and emotional triggers.`;

    const aiResponse = await routeAI({
      agentType: "audience_analyst",
      systemPrompt: getAudiencePrompt({ persona_name, industry, ideal_customer }),
      userMessage,
      maxTokens: 4096,
      preferredLanguage: language,
    });

    const parsed = JSON.parse(aiResponse.content);
    await getUserTrackAndSave(
      aiResponse.tokensUsed,
      "audience_analyst",
      persona_name,
      parsed,
      { persona_name, industry, ideal_customer },
      aiResponse.detectedLanguage
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Audience research error:", error);
    return NextResponse.json(
      { error: "Failed to process audience research request" },
      { status: 500 }
    );
  }
}
