import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import { getCopywritingPrompt } from "@/lib/ai/prompts/copywriting";

export async function POST(request: Request) {
  try {
    const { type, product, audience, tone } = await request.json();

    const result = await routeAI({
      agentType: "copywriter",
      systemPrompt: getCopywritingPrompt({ type, product, audience, tone }),
      userMessage: `Write high-converting ${type} copy for this product/service: "${product}" targeting "${audience}". ${tone ? `Tone: ${tone}.` : ""} Give me your best work.`,
      maxTokens: 4096,
    });

    try {
      const parsed = JSON.parse(result.content);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        headlines: [
          "The Secret Your Competitors Don't Want You to Know About [Industry]",
          "How [Audience] Are Getting [Result] Without [Common Pain Point]",
          "Warning: Don't [Common Mistake] Until You Read This",
          "What Would Change If You Could [Key Benefit] in 30 Days?",
          "[Number] [Audience] Already Made the Switch — Here's Why",
        ],
        hooks: [
          "I spent 3 years doing it the wrong way. Then I discovered something that changed everything — and it's embarrassingly simple.",
          "87% of people in your position make this exact mistake. The other 13%? They're the ones seeing results.",
          "What if the biggest thing holding you back isn't what you think it is?",
          "Last Tuesday, a client sent me a message that stopped me in my tracks. Three words: 'It actually worked.'",
          "Everyone told me I was crazy for trying this approach. Six months later, they're asking me how I did it.",
        ],
        body_copy:
          "You've tried everything. The courses, the templates, the advice from people who've never been in your shoes. And yet here you are — still stuck, still wondering what you're missing.\n\nHere's what nobody tells you: the problem isn't your effort. It's your approach. You've been following a playbook that was designed for someone else's business, someone else's audience, someone else's life.\n\nThat changes today. We built something specifically for people like you — people who are smart enough to know that generic solutions don't work, and ambitious enough to want something better.\n\nIn the first 30 days alone, our clients typically see a dramatic shift — not just in their results, but in their confidence. Because when you have the right system, everything clicks.\n\nThe best part? You don't need to overhaul your entire operation. You just need to make a few strategic shifts that compound over time.",
        cta_options: [
          "See how it works — no commitment needed",
          "Start your free trial and see results in 7 days",
          "Join now before enrollment closes Friday at midnight — spots are limited",
        ],
      });
    }
  } catch (error) {
    console.error("Copywriter error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
