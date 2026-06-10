import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  routeAIRequest,
  InsufficientCreditsError,
  type TaskType,
  type CostMode,
  type AIModel,
  type AgentType,
} from "@/lib/ai/model-router";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      message,
      agentType,
      taskType,
      mode,
      manualModelOverride,
      systemPrompt,
      conversationHistory,
      language,
    } = body as {
      message: string;
      agentType?: AgentType;
      taskType?: TaskType;
      mode?: CostMode;
      manualModelOverride?: AIModel;
      systemPrompt?: string;
      conversationHistory?: { role: "user" | "assistant"; content: string }[];
      language?: "en" | "zh";
    };

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const result = await routeAIRequest({
      userId: user.id,
      agentType,
      taskType,
      systemPrompt: systemPrompt ?? "You are Foundera OS AI Assistant. Answer with practical, business-focused, conversion-driven advice. Keep the response concise, clear, and useful. Do not over-explain. Do not use generic AI language. Follow the requested format.",
      userMessage: message,
      conversationHistory,
      mode,
      manualModelOverride,
      preferredLanguage: language,
    });

    return NextResponse.json({
      reply: result.content,
      modelUsed: result.modelUsed,
      taskType: result.taskType,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      creditsDeducted: result.creditsDeducted,
      remainingCredits: result.remainingCredits,
      estimatedCostUsd: result.estimatedCostUsd,
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: error.message, type: "insufficient_credits", isClaude: error.isClaude },
        { status: 429 }
      );
    }
    console.error("AI respond error:", error);
    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
