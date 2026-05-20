import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getCopywritingPrompt } from "@/lib/ai/prompts/copywriting";
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

    const { type, product, audience, tone, language } = await request.json();

    const result = await routeAI({
      agentType: "copywriter",
      systemPrompt: getCopywritingPrompt({ type, product, audience, tone }),
      userMessage: `Write high-converting ${type} copy for this product/service: "${product}" targeting "${audience}". ${tone ? `Tone: ${tone}.` : ""} Give me your best work.`,
      maxTokens: 4096,
      preferredLanguage: language,
    });

    const parsed = JSON.parse(result.content);
    await getUserTrackAndSave(
      result.tokensUsed,
      "copywriter",
      `${type} — ${product.slice(0, 50)}`,
      parsed,
      { type, product, audience, tone },
      result.detectedLanguage
    );
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Copywriter error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
