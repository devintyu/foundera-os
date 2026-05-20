import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { detectLanguage, type Language } from "@/lib/i18n/language-detector";

let _openai: OpenAI | null = null;
let _anthropic: Anthropic | null = null;

function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

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

function getLanguageInstruction(lang: Language): string {
  if (lang === "zh") {
    return "\n\n**CRITICAL LANGUAGE RULE: The user is communicating in Chinese. You MUST respond ENTIRELY in Simplified Chinese (简体中文). Do not use English in your response unless it is a proper noun, brand name, or technical term with no standard Chinese equivalent.**";
  }
  return "\n\n**Respond in English.**";
}

interface AIRequest {
  agentType: AgentType;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  preferredLanguage?: Language;
}

interface AIResponse {
  content: string;
  model: AIModel;
  tokensUsed: number;
  detectedLanguage: Language;
}

export async function routeAI({
  agentType,
  systemPrompt,
  userMessage,
  maxTokens = 4096,
  preferredLanguage,
}: AIRequest): Promise<AIResponse> {
  const model = MODEL_MAP[agentType];
  const detectedLanguage = preferredLanguage || detectLanguage(userMessage);
  const langInstruction = getLanguageInstruction(detectedLanguage);
  const enrichedPrompt = systemPrompt + langInstruction;

  if (model === "gpt-4o-mini") {
    const res = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: enrichedPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: maxTokens,
    });
    return {
      content: res.choices[0].message.content ?? "",
      model,
      tokensUsed: res.usage?.total_tokens ?? 0,
      detectedLanguage,
    };
  }

  const claudeModel =
    model === "claude-opus" ? "claude-opus-4-6" : "claude-sonnet-4-6";
  const res = await getAnthropic().messages.create({
    model: claudeModel,
    max_tokens: maxTokens,
    system: enrichedPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = res.content.find((b) => b.type === "text");
  return {
    content: textBlock?.text ?? "",
    model,
    tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
    detectedLanguage,
  };
}

export function getModelForAgent(agentType: AgentType): AIModel {
  return MODEL_MAP[agentType];
}
