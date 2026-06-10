import { detectLanguage, type Language } from "@/lib/i18n/language-detector";
import {
  routeAIRequest,
  InsufficientCreditsError,
  getTaskForAgent,
  type AgentType,
  type AIModel,
  type CostMode,
  type ModelRouterResponse,
} from "./model-router";

export type { AIModel, AgentType };
export { InsufficientCreditsError };

interface AIRequest {
  agentType: AgentType;
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  preferredLanguage?: Language;
  userId?: string;
  mode?: CostMode;
}

interface AIResponse {
  content: string;
  model: AIModel;
  tokensUsed: number;
  detectedLanguage: Language;
  creditsDeducted: number;
  remainingCredits: number;
}

export async function routeAI({
  agentType,
  systemPrompt,
  userMessage,
  maxTokens,
  preferredLanguage,
  userId,
  mode,
}: AIRequest): Promise<AIResponse> {
  if (!userId) {
    throw new Error("userId is required for AI routing");
  }

  const result = await routeAIRequest({
    userId,
    agentType,
    systemPrompt,
    userMessage,
    preferredLanguage,
    maxTokensOverride: maxTokens,
    mode,
  });

  return {
    content: result.content,
    model: result.modelUsed,
    tokensUsed: result.totalTokens,
    detectedLanguage: result.detectedLanguage,
    creditsDeducted: result.creditsDeducted,
    remainingCredits: result.remainingCredits,
  };
}

export function getModelForAgent(agentType: AgentType): AIModel {
  const taskType = getTaskForAgent(agentType);
  const taskModelMap: Record<string, AIModel> = {
    fast_response: "gemini-flash-lite",
    smart_conversation: "gemini-flash",
    copywriting: "gemini-flash",
    agent_workflow: "gemini-flash",
    strategy: "claude-sonnet",
    deep_thinking: "claude-opus",
  };
  return taskModelMap[taskType] ?? "gemini-flash";
}
