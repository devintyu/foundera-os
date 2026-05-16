import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type AIModel = "gpt-4o-mini" | "claude-sonnet" | "claude-opus";

export type AgentType =
  | "copywriter"
  | "hook_generator"
  | "headline_generator"
  | "content_angle"
  | "market_researcher"
  | "offer_builder"
  | "audience_analyst"
  | "funnel_architect"
  | "strategy_advisor"
  | "bottleneck_detector"
  | "roadmap_generator";

const MODEL_MAP: Record<AgentType, AIModel> = {
  copywriter: "gpt-4o-mini",
  hook_generator: "gpt-4o-mini",
  headline_generator: "gpt-4o-mini",
  content_angle: "gpt-4o-mini",
  market_researcher: "claude-sonnet",
  offer_builder: "claude-sonnet",
  audience_analyst: "claude-sonnet",
  funnel_architect: "claude-sonnet",
  strategy_advisor: "claude-opus",
  bottleneck_detector: "claude-opus",
  roadmap_generator: "claude-opus",
};

interface AIRequest {
  agentType: AgentType;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

interface AIResponse {
  content: string;
  model: AIModel;
  tokensUsed: number;
}

export async function routeAI({
  agentType,
  systemPrompt,
  userMessage,
  maxTokens = 4096,
}: AIRequest): Promise<AIResponse> {
  const model = MODEL_MAP[agentType];

  if (model === "gpt-4o-mini") {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
    });
    return {
      content: res.choices[0].message.content ?? "",
      model,
      tokensUsed: res.usage?.total_tokens ?? 0,
    };
  }

  const claudeModel =
    model === "claude-opus" ? "claude-opus-4-6" : "claude-sonnet-4-6";
  const res = await anthropic.messages.create({
    model: claudeModel,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = res.content.find((b) => b.type === "text");
  return {
    content: textBlock?.text ?? "",
    model,
    tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
  };
}

export function getModelForAgent(agentType: AgentType): AIModel {
  return MODEL_MAP[agentType];
}
