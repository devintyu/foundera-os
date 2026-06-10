import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAI, InsufficientCreditsError } from "@/lib/ai/router";
import { getAudiencePrompt } from "@/lib/ai/prompts/audience";
import { saveAIResult } from "@/lib/ai/save-result";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { persona_name, industry, ideal_customer, language } = await req.json();

    if (!persona_name || !industry || !ideal_customer) {
      return NextResponse.json({ error: "Persona name, industry, and ideal customer are required" }, { status: 400 });
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
      preferredLanguage: language,
      userId: user.id,
    });

    const parsed = JSON.parse(aiResponse.content);
    await saveAIResult(user.id, "audience_analyst", persona_name, parsed, { persona_name, industry, ideal_customer }, aiResponse.detectedLanguage);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Audience research error:", error);
    return NextResponse.json({ error: "Failed to process audience research request" }, { status: 500 });
  }
}
