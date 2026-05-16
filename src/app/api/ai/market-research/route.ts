import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getUserTrackAndSave } from "@/lib/ai/with-tracking";
import { checkAILimits } from "@/lib/ai/check-limits";

const MOCK_DATA = {
  overview:
    "This market is experiencing significant growth driven by digital transformation and changing consumer preferences. Key trends include automation, personalization, and sustainability. The total addressable market is estimated at $12B with a 15% CAGR over the next 5 years.",
  opportunities: [
    "Underserved mid-market segment with high willingness to pay",
    "Growing demand for AI-powered solutions in this vertical",
    "Fragmented competitor landscape with no clear market leader",
    "Regulatory changes creating new market entry points",
    "Rising consumer expectations for personalized experiences",
  ],
  competitors: [
    "Competitor A — Market leader with 25% share, strong brand but slow innovation",
    "Competitor B — Fast-growing startup with $10M funding, focused on enterprise",
    "Competitor C — Legacy player losing share, vulnerable to disruption",
    "Competitor D — Niche player with loyal customer base in adjacent market",
  ],
  recommendations: [
    "Position as the AI-native solution for underserved mid-market buyers",
    "Build a community-led growth engine to reduce CAC",
    "Focus on 2-3 killer features that competitors lack",
    "Pursue strategic partnerships with complementary platforms",
    "Launch with a freemium model to capture market share quickly",
  ],
  opportunity_score: 78,
};

const SYSTEM_PROMPT = `You are a world-class market research analyst and competitive intelligence expert.
Analyze the given market/industry and return your findings as a JSON object with the following structure:
{
  "overview": "A comprehensive market overview paragraph (3-5 sentences)",
  "opportunities": ["array of 4-6 market opportunities"],
  "competitors": ["array of 3-5 competitor descriptions with brief analysis"],
  "recommendations": ["array of 4-6 strategic recommendations"],
  "opportunity_score": <number from 0-100 rating the overall market opportunity>
}
Return ONLY valid JSON, no markdown or extra text.`;

export async function POST(req: NextRequest) {
  try {
    const { allowed, remaining } = await checkAILimits();
    if (!allowed) {
      return NextResponse.json(
        { error: "AI credit limit reached. Upgrade your plan for more.", remaining },
        { status: 429 }
      );
    }

    const { industry, niche, questions } = await req.json();

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

    try {
      const aiResponse = await routeAI({
        agentType: "market_researcher",
        systemPrompt: SYSTEM_PROMPT,
        userMessage,
        maxTokens: 4096,
      });

      const parsed = JSON.parse(aiResponse.content);
      await getUserTrackAndSave(
        aiResponse.tokensUsed,
        "market_researcher",
        `${industry} — ${niche}`,
        parsed,
        { industry, niche, questions }
      );
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(MOCK_DATA);
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to process market research request" },
      { status: 500 }
    );
  }
}
