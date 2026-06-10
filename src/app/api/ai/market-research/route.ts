import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAI, InsufficientCreditsError } from "@/lib/ai/router";
import { getMarketResearchPrompt } from "@/lib/ai/prompts/market-research";
import { saveAIResult } from "@/lib/ai/save-result";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { industry, niche, questions, language } = await req.json();

    if (!industry || !niche) {
      return NextResponse.json({ error: "Industry and niche are required" }, { status: 400 });
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
      preferredLanguage: language,
      userId: user.id,
    });

    const parsed = JSON.parse(aiResponse.content);
    await saveAIResult(user.id, "market_researcher", `${industry} — ${niche}`, parsed, { industry, niche, questions }, aiResponse.detectedLanguage);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Market research error:", error);
    return NextResponse.json({ error: "Failed to process market research request" }, { status: 500 });
  }
}
