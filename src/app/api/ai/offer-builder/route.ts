import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAI, InsufficientCreditsError } from "@/lib/ai/router";
import { getOfferBuildingPrompt } from "@/lib/ai/prompts/offer-building";
import { saveAIResult } from "@/lib/ai/save-result";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, target_audience, problem, price_range, offer_type, language } = await req.json();

    if (!title || !target_audience || !problem) {
      return NextResponse.json({ error: "Title, target audience, and problem are required" }, { status: 400 });
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
      systemPrompt: getOfferBuildingPrompt({ title, target_audience, problem, price_range: price_range || "Flexible", offer_type: offer_type || "Not specified" }),
      userMessage,
      preferredLanguage: language,
      userId: user.id,
    });

    const parsed = JSON.parse(aiResponse.content);
    await saveAIResult(user.id, "offer_builder", title, parsed, { title, target_audience, problem, price_range, offer_type }, aiResponse.detectedLanguage);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Offer builder error:", error);
    return NextResponse.json({ error: "Failed to process offer builder request" }, { status: 500 });
  }
}
