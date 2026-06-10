import type { TaskType } from "./model-router";

interface OptimizedPrompt {
  systemPrompt: string;
  userMessage: string;
  history: { role: "user" | "assistant"; content: string }[];
}

const MAX_HISTORY_MESSAGES = 5;
const MAX_HISTORY_SUMMARY_WORDS = 150;

export function optimizePrompt(
  systemPrompt: string,
  userMessage: string,
  conversationHistory?: { role: "user" | "assistant"; content: string }[],
  _taskType?: TaskType
): OptimizedPrompt {
  const optimizedSystem = compressSystemPrompt(systemPrompt);
  const trimmedMessage = userMessage.trim();

  if (!conversationHistory || conversationHistory.length === 0) {
    return { systemPrompt: optimizedSystem, userMessage: trimmedMessage, history: [] };
  }

  // Keep only last N relevant messages
  const recent = conversationHistory.slice(-MAX_HISTORY_MESSAGES);

  // If there were older messages, summarize them
  if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
    const older = conversationHistory.slice(0, -MAX_HISTORY_MESSAGES);
    const summary = summarizeMessages(older);
    if (summary) {
      return {
        systemPrompt: optimizedSystem + `\n\nPrevious conversation summary: ${summary}`,
        userMessage: trimmedMessage,
        history: deduplicateHistory(recent),
      };
    }
  }

  return {
    systemPrompt: optimizedSystem,
    userMessage: trimmedMessage,
    history: deduplicateHistory(recent),
  };
}

function compressSystemPrompt(prompt: string): string {
  return prompt
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function summarizeMessages(messages: { role: string; content: string }[]): string {
  const keyPoints: string[] = [];

  for (const msg of messages) {
    if (msg.role === "user") {
      const firstSentence = msg.content.split(/[.!?]\s/)[0];
      if (firstSentence && firstSentence.length < 100) {
        keyPoints.push(`User asked: ${firstSentence}`);
      }
    }
  }

  const summary = keyPoints.join(". ").slice(0, MAX_HISTORY_SUMMARY_WORDS * 6);
  return summary || "";
}

function deduplicateHistory(
  messages: { role: "user" | "assistant"; content: string }[]
): { role: "user" | "assistant"; content: string }[] {
  const seen = new Set<string>();
  const result: { role: "user" | "assistant"; content: string }[] = [];

  for (const msg of messages) {
    const key = `${msg.role}:${msg.content.slice(0, 100)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(msg);
    }
  }

  return result;
}
