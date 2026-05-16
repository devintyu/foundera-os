"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STARTER_PROMPTS = [
  {
    label: "Diagnose my bottleneck",
    prompt:
      "I'm stuck and need help diagnosing my biggest bottleneck. Here's my situation: I have a [describe your business] and I'm struggling with [describe your challenge]. What's really going on and what should I do?",
  },
  {
    label: "Review my pricing",
    prompt:
      "I need help with my pricing strategy. I'm currently charging [your price] for [your offer] targeting [your audience]. Am I leaving money on the table? How should I think about pricing?",
  },
  {
    label: "90-day action plan",
    prompt:
      "I need a focused 90-day action plan. My business is [describe business], my revenue is [revenue level], and my #1 goal is [your goal]. What should I prioritize?",
  },
  {
    label: "Validate my idea",
    prompt:
      "I have a business idea I want to validate before investing time and money. The idea is: [describe your idea]. Who would buy this, what would they pay, and how do I test it fast?",
  },
];

export default function StrategyPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I encountered an error. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col p-0 lg:p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E2E] px-6 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              Strategy Advisor
            </span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Opus-level AI strategy sessions for founders
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 rounded-lg border border-[#1E1E2E] px-3 py-1.5 text-xs font-medium text-[#94A3B8] transition-colors hover:border-[#00F0FF]/30 hover:text-[#F8FAFC]"
          >
            <RotateCcw className="h-3 w-3" />
            New Session
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
              <Sparkles className="h-8 w-8 text-[#00F0FF]" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-[#F8FAFC]">
              Your AI Strategy Partner
            </h2>
            <p className="mb-8 max-w-md text-center text-sm text-[#94A3B8]">
              Get deep strategic advice on your business. Ask about
              positioning, pricing, growth, bottlenecks, or any
              founder challenge.
            </p>

            <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {STARTER_PROMPTS.map((sp) => (
                <button
                  key={sp.label}
                  onClick={() => setInput(sp.prompt)}
                  className="group flex items-start gap-3 rounded-xl border border-[#1E1E2E] bg-[#12121A]/60 p-4 text-left transition-all hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1E1E2E] transition-colors group-hover:bg-[#00F0FF]/10">
                    <Lightbulb className="h-4 w-4 text-[#94A3B8] transition-colors group-hover:text-[#00F0FF]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F8FAFC]">
                      {sp.label}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#94A3B8]">
                      {sp.prompt.slice(0, 80)}...
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
                      <Bot className="h-4 w-4 text-[#00F0FF]" />
                    </div>
                  )}

                  <div
                    className={`group relative max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#00F0FF]/15 to-[#8B5CF6]/15 text-[#F8FAFC]"
                        : "border border-[#1E1E2E] bg-[#12121A]/80 text-[#F8FAFC]"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>

                    {msg.role === "assistant" && (
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="absolute -right-2 top-2 rounded-md border border-[#1E1E2E] bg-[#12121A] p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-[#10B981]" />
                        ) : (
                          <Copy className="h-3 w-3 text-[#94A3B8]" />
                        )}
                      </button>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8B5CF6]/20">
                      <User className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
                  <Bot className="h-4 w-4 text-[#00F0FF]" />
                </div>
                <div className="rounded-2xl border border-[#1E1E2E] bg-[#12121A]/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_0s_infinite] rounded-full bg-[#00F0FF]" />
                    <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-[#8B5CF6]" />
                    <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-[#00F0FF]" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#1E1E2E] px-4 py-4 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-3"
        >
          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your strategy advisor anything..."
              rows={1}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-[#1E1E2E] bg-[#12121A] px-4 py-3 pr-12 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/25 disabled:opacity-50"
              style={{
                minHeight: "44px",
                maxHeight: "120px",
                height: "auto",
              }}
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = "auto";
                t.style.height = Math.min(t.scrollHeight, 120) + "px";
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-[#94A3B8]/50">
          Powered by Claude — advice is AI-generated, not professional counsel
        </p>
      </div>
    </div>
  );
}
