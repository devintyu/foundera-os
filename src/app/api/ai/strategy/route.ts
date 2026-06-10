import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeAIRequest, InsufficientCreditsError } from "@/lib/ai/model-router";
import { detectLanguage } from "@/lib/i18n/language-detector";

const SYSTEM_PROMPT = `You are the Foundera OS Strategy Advisor — a senior AI strategist with the depth of a McKinsey senior partner, the founder empathy of a Y Combinator group partner, and the operational clarity of a COO who has scaled multiple companies from $0 to $10M+.

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages, context, language } = await request.json();

    let systemPrompt = SYSTEM_PROMPT;
    if (context) {
      systemPrompt += `\n\nFOUNDER CONTEXT:\n- Name: ${context.name || "Unknown"}\n- Role: ${context.role || "Founder"}\n- Industry: ${context.industry || "Unknown"}\n- Stage: ${context.stage || "Unknown"}\n- Goals: ${context.goals?.join(", ") || "Not specified"}\n- Bottleneck: ${context.bottleneck || "Not specified"}`;
    }

    const uiLang = language || (() => {
      const lastUserMessage = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
      return lastUserMessage ? detectLanguage(lastUserMessage.content) : "en";
    })();

    const conversationHistory = (messages as ChatMessage[]).slice(0, -1);
    const lastMessage = messages[messages.length - 1];

    const result = await routeAIRequest({
      userId: user.id,
      taskType: "strategy",
      systemPrompt,
      userMessage: lastMessage.content,
      conversationHistory,
      preferredLanguage: uiLang,
      maxTokensOverride: 1500,
    });

    return NextResponse.json({
      message: result.content,
      tokensUsed: result.totalTokens,
      modelUsed: result.modelUsed,
      creditsDeducted: result.creditsDeducted,
      remainingCredits: result.remainingCredits,
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: error.message, type: "insufficient_credits" }, { status: 429 });
    }
    console.error("Strategy chat error:", error);
    return NextResponse.json({ error: "Failed to get strategy advice" }, { status: 500 });
  }
}
