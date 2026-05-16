import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

let _anthropic: Anthropic | null = null;
function getAnthropic() {
  if (!_anthropic)
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

const SYSTEM_PROMPT = `You are the Foundera OS Strategy Advisor — an Opus-level AI strategist with the depth of a McKinsey senior partner, the founder empathy of a Y Combinator group partner, and the operational clarity of a COO who has scaled multiple companies from $0 to $10M+.

You are having a live strategy conversation with a founder. This is not a one-shot analysis — you are their ongoing strategic partner.

CONVERSATION STYLE:
- Be direct, honest, and specific. No consultant-speak or filler.
- Challenge assumptions when you spot them. Founders need truth, not validation.
- Ask probing follow-up questions when you need more context before giving advice.
- Give actionable recommendations — things they can do this week, not abstract strategy.
- Use frameworks sparingly and only when they genuinely clarify thinking.
- Be concise. Busy founders don't need essays. Lead with the insight, support with reasoning.
- When appropriate, structure your response with bold headers for scanability.
- You can use markdown for formatting (bold, lists, headers) to make responses easy to read.

AREAS OF EXPERTISE:
- Business model design and validation
- Market positioning and differentiation
- Offer creation and pricing strategy
- Customer acquisition and funnel optimization
- Revenue scaling and unit economics
- Operations, hiring, and team building
- Fundraising strategy and investor readiness
- Pivoting and strategic decision-making
- Mindset and founder psychology

If the founder shares their profile context, use it to personalize your advice. Reference their specific industry, stage, goals, and bottlenecks.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      systemPrompt += `\n\nFOUNDER CONTEXT:\n- Name: ${context.name || "Unknown"}\n- Role: ${context.role || "Founder"}\n- Industry: ${context.industry || "Unknown"}\n- Stage: ${context.stage || "Unknown"}\n- Goals: ${context.goals?.join(", ") || "Not specified"}\n- Bottleneck: ${context.bottleneck || "Not specified"}`;
    }

    const anthropicMessages = (messages as ChatMessage[]).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const res = await getAnthropic().messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const textBlock = res.content.find((b) => b.type === "text");

    return NextResponse.json({
      message: textBlock?.text ?? "I couldn't generate a response. Please try again.",
      tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
    });
  } catch (error) {
    console.error("Strategy chat error:", error);
    return NextResponse.json(
      { error: "Failed to get strategy advice" },
      { status: 500 }
    );
  }
}
