import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getMarketResearchPrompt } from "@/lib/ai/prompts/market-research";
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

    const { industry, niche, questions, language } = await req.json();

    if (!industry || !niche) {
      return NextResponse.json(
        { error: "Industry and niche are required" },
        { status: 400 }
      );
    }

    const userMessage = `Analyze this market opportunity:
Industry: ${industry}
Niche: ${niche}
${questions ? `Key Questions: ${questions}` : ""}

Provide comprehensive market intelligence including overview, opportunities, competitors, recommendations, and an opportunity score (0-100).`;

    const aiResponse = await routeAI({
      agentType: "market_researcher",
      systemPrompt: getMarketResearchPrompt({ industry, niche, questions }),
      userMessage,
      maxTokens: 4096,
      preferredLanguage: language,
    });

    const parsed = JSON.parse(aiResponse.content);
    await getUserTrackAndSave(
      aiResponse.tokensUsed,
      "market_researcher",
      `${industry} — ${niche}`,
      parsed,
      { industry, niche, questions },
      aiResponse.detectedLanguage
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Market research error:", error);
    return NextResponse.json(
      { error: "Failed to process market research request" },
      { status: 500 }
    );
  }
}
