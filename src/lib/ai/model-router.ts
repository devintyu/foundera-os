import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import { detectLanguage, type Language } from "@/lib/i18n/language-detector";
import { checkCredits, deductCredits } from "./credits";
import { optimizePrompt } from "./token-optimizer";

let _gemini: GoogleGenerativeAI | null = null;
let _anthropic: Anthropic | null = null;

function getGemini() {
  if (!_gemini) _gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return _gemini;
}

function getAnthropic() {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _anthropic;
}

export type TaskType =
  | "fast_response"
  | "smart_conversation"
  | "copywriting"
  | "agent_workflow"
  | "strategy"
  | "deep_thinking";

export type AIModel =
  | "gemini-flash-lite"
  | "gemini-flash"
  | "claude-sonnet"
  | "claude-opus";

export type CostMode = "economy" | "balanced" | "premium";

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
  | "roadmap_generator"
  | "sales_reply"
  | "workflow"
  | "summarization"
  | "customer_support";

const TASK_MODEL_MAP: Record<TaskType, AIModel> = {
  fast_response: "gemini-flash-lite",
  smart_conversation: "gemini-flash",
  copywriting: "gemini-flash",
  agent_workflow: "gemini-flash",
  strategy: "claude-sonnet",
  deep_thinking: "claude-opus",
};

const AGENT_TASK_MAP: Record<AgentType, TaskType> = {
  copywriter: "copywriting",
  hook_generator: "fast_response",
  headline_generator: "fast_response",
  content_angle: "copywriting",
  market_researcher: "smart_conversation",
  offer_builder: "smart_conversation",
  audience_analyst: "smart_conversation",
  funnel_architect: "agent_workflow",
  strategy_advisor: "strategy",
  bottleneck_detector: "strategy",
  roadmap_generator: "deep_thinking",
  sales_reply: "fast_response",
  workflow: "agent_workflow",
  summarization: "fast_response",
  customer_support: "fast_response",
};

const MAX_OUTPUT_TOKENS: Record<TaskType, number> = {
  fast_response: 200,
  smart_conversation: 500,
  copywriting: 800,
  agent_workflow: 700,
  strategy: 1500,
  deep_thinking: 3000,
};

const CREDIT_COST_PER_1K: Record<AIModel, number> = {
  "gemini-flash-lite": 1,
  "gemini-flash": 2,
  "claude-sonnet": 10,
  "claude-opus": 25,
};

// USD cost per 1M tokens (input/output averaged estimate)
const USD_COST_PER_1M: Record<AIModel, number> = {
  "gemini-flash-lite": 0.075,
  "gemini-flash": 0.15,
  "claude-sonnet": 6.0,
  "claude-opus": 30.0,
};

function resolveModel(taskType: TaskType, mode: CostMode): AIModel {
  const base = TASK_MODEL_MAP[taskType];

  if (mode === "economy") {
    if (base === "claude-sonnet") return "gemini-flash";
    if (base === "claude-opus") return "gemini-flash";
    if (base === "gemini-flash") return "gemini-flash-lite";
    return "gemini-flash-lite";
  }

  if (mode === "premium") {
    return base;
  }

  // balanced: use Claude only for strategy/deep_thinking
  if (taskType === "strategy") return "claude-sonnet";
  if (taskType === "deep_thinking") return "claude-opus";
  return base;
}

export function getTaskForAgent(agentType: AgentType): TaskType {
  return AGENT_TASK_MAP[agentType] ?? "smart_conversation";
}

function getLanguageInstruction(lang: Language): string {
  if (lang === "zh") {
    return "\n\n**CRITICAL LANGUAGE RULE: The user is communicating in Chinese. You MUST respond ENTIRELY in Simplified Chinese (简体中文). Do not use English in your response unless it is a proper noun, brand name, or technical term with no standard Chinese equivalent.**";
  }
  return "\n\n**Respond in English.**";
}

export function calculateCredits(model: AIModel, totalTokens: number): number {
  return Math.ceil((totalTokens / 1000) * CREDIT_COST_PER_1K[model]);
}

export function estimateCostUsd(model: AIModel, totalTokens: number): number {
  return (totalTokens / 1_000_000) * USD_COST_PER_1M[model];
}

export interface ModelRouterRequest {
  userId: string;
  agentType?: AgentType;
  taskType?: TaskType;
  systemPrompt: string;
  userMessage: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
  mode?: CostMode;
  manualModelOverride?: AIModel;
  preferredLanguage?: Language;
  maxTokensOverride?: number;
}

export interface ModelRouterResponse {
  content: string;
  modelUsed: AIModel;
  taskType: TaskType;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  creditsDeducted: number;
  remainingCredits: number;
  estimatedCostUsd: number;
  detectedLanguage: Language;
}

export async function routeAIRequest(req: ModelRouterRequest): Promise<ModelRouterResponse> {
  const taskType = req.taskType ?? (req.agentType ? getTaskForAgent(req.agentType) : "smart_conversation");
  const mode = req.mode ?? "balanced";
  const model = req.manualModelOverride ?? resolveModel(taskType, mode);
  const maxTokens = req.maxTokensOverride ?? MAX_OUTPUT_TOKENS[taskType];

  const isClaudeModel = model === "claude-sonnet" || model === "claude-opus";

  // Pre-flight credit check
  const estimatedTokens = Math.min(maxTokens * 2, 4000);
  const estimatedCredits = calculateCredits(model, estimatedTokens);
  const creditCheck = await checkCredits(req.userId, estimatedCredits, isClaudeModel, taskType);

  if (!creditCheck.allowed) {
    throw new InsufficientCreditsError(creditCheck.reason, isClaudeModel);
  }

  // Optimize prompt
  const optimized = optimizePrompt(req.systemPrompt, req.userMessage, req.conversationHistory, taskType);

  const detectedLanguage = req.preferredLanguage ?? detectLanguage(req.userMessage);
  const langInstruction = getLanguageInstruction(detectedLanguage);
  const enrichedPrompt = optimized.systemPrompt + langInstruction;

  let content: string;
  let inputTokens: number;
  let outputTokens: number;

  if (isClaudeModel) {
    const claudeModel = model === "claude-opus" ? "claude-opus-4-6" : "claude-sonnet-4-6";
    const messages = [
      ...optimized.history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user" as const, content: optimized.userMessage },
    ];
    const res = await getAnthropic().messages.create({
      model: claudeModel,
      max_tokens: maxTokens,
      system: enrichedPrompt,
      messages,
    });
    const textBlock = res.content.find((b) => b.type === "text");
    content = textBlock?.text ?? "";
    inputTokens = res.usage.input_tokens;
    outputTokens = res.usage.output_tokens;
  } else {
    const geminiModelName = model === "gemini-flash-lite" ? "gemini-2.0-flash-lite" : "gemini-2.0-flash";
    const geminiModel = getGemini().getGenerativeModel({
      model: geminiModelName,
      systemInstruction: enrichedPrompt,
    });
    const history = optimized.history.map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));
    const chat = geminiModel.startChat({ history });
    const res = await chat.sendMessage(optimized.userMessage);
    content = res.response.text();
    const usage = res.response.usageMetadata;
    inputTokens = usage?.promptTokenCount ?? 0;
    outputTokens = usage?.candidatesTokenCount ?? 0;
  }

  const totalTokens = inputTokens + outputTokens;
  const creditsDeducted = calculateCredits(model, totalTokens);
  const costUsd = estimateCostUsd(model, totalTokens);

  const remaining = await deductCredits(req.userId, creditsDeducted, isClaudeModel ? totalTokens : 0, !isClaudeModel ? totalTokens : 0, {
    agentId: req.agentType ?? null,
    taskType,
    modelUsed: model,
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCostUsd: costUsd,
    creditDeducted: creditsDeducted,
  });

  return {
    content,
    modelUsed: model,
    taskType,
    inputTokens,
    outputTokens,
    totalTokens,
    creditsDeducted,
    remainingCredits: remaining,
    estimatedCostUsd: costUsd,
    detectedLanguage,
  };
}

export class InsufficientCreditsError extends Error {
  public isClaude: boolean;
  constructor(message: string, isClaude: boolean) {
    super(message);
    this.name = "InsufficientCreditsError";
    this.isClaude = isClaude;
  }
}
