import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAI, InsufficientCreditsError } from "@/lib/ai/router";
import { getCopywritingPrompt } from "@/lib/ai/prompts/copywriting";
import { saveAIResult } from "@/lib/ai/save-result";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, product, audience, tone, language } = await request.json();

    const result = await routeAI({
      agentType: "copywriter",
      systemPrompt: getCopywritingPrompt({ type, product, audience, tone }),
      userMessage: `Write high-converting ${type} copy for this product/service: "${product}" targeting "${audience}". ${tone ? `Tone: ${tone}.` : ""} Give me your best work.`,
      preferredLanguage: language,
      userId: user.id,
    });

    const parsed = JSON.parse(result.content);
    await saveAIResult(user.id, "copywriter", `${type} — ${product.slice(0, 50)}`, parsed, { type, product, audience, tone }, result.detectedLanguage);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Copywriter error:", error);
    return NextResponse.json({ error: "Failed to generate copy" }, { status: 500 });
  }
}
