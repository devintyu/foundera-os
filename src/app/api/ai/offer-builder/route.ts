import { NextRequest, NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getOfferBuildingPrompt } from "@/lib/ai/prompts/offer-building";
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

    const { title, target_audience, problem, price_range, offer_type, language } =
      await req.json();

    if (!title || !target_audience || !problem) {
      return NextResponse.json(
        { error: "Title, target audience, and problem are required" },
        { status: 400 }
      );
    }

    const userMessage = `Design an irresistible offer:
Offer Title: ${title}
Target Audience: ${target_audience}
Core Problem: ${problem}
Price Range: ${price_range || "Flexible"}
Offer Type: ${offer_type || "Not specified"}

Create a complete offer with compelling name, value proposition, pricing, bonuses, guarantee, and sales angle.`;

    const aiResponse = await routeAI({
      agentType: "offer_builder",
      systemPrompt: getOfferBuildingPrompt({
        title,
        target_audience,
        problem,
        price_range: price_range || "Flexible",
        offer_type: offer_type || "Not specified",
      }),
      userMessage,
      maxTokens: 4096,
      preferredLanguage: language,
    });

    const parsed = JSON.parse(aiResponse.content);
    await getUserTrackAndSave(
      aiResponse.tokensUsed,
      "offer_builder",
      title,
      parsed,
      { title, target_audience, problem, price_range, offer_type },
      aiResponse.detectedLanguage
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Offer builder error:", error);
    return NextResponse.json(
      { error: "Failed to process offer builder request" },
      { status: 500 }
    );
  }
}
