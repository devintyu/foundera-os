"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
import {
  Clock,
  Search,
  Package,
  Users,
  Filter,
  PenTool,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HistoryItem {
  id: string;
  agent_type: string;
  title: string;
  messages: { role: string; content: string; timestamp: string }[];
  context: Record<string, unknown>;
  created_at: string;
}

export default function HistoryPage() {
  const [results, setResults] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { language: lang } = useLanguage();

  const AGENT_META: Record<string, { labelKey: string; icon: typeof Search; color: string }> = {
    market_researcher: { labelKey: "history.market_research", icon: Search, color: "text-[#00F0FF]" },
    offer_builder: { labelKey: "history.offer_architect", icon: Package, color: "text-[#8B5CF6]" },
    audience_analyst: { labelKey: "history.audience_intel", icon: Users, color: "text-[#F59E0B]" },
    funnel_architect: { labelKey: "history.funnel_architect", icon: Filter, color: "text-[#10B981]" },
    copywriter: { labelKey: "history.ai_copywriter", icon: PenTool, color: "text-[#EF4444]" },
    strategy_advisor: { labelKey: "history.strategy_advisor", icon: Sparkles, color: "text-[#8B5CF6]" },
  };

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/ai/history");
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        // No history available
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filtered = filter === "all" ? results : results.filter((r) => r.agent_type === filter);
  const agentTypes = [...new Set(results.map((r) => r.agent_type))];

  const dateLocale = lang === "zh" ? "zh-CN" : "en-US";

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
            {t("history.title", lang)}
          </span>
        </h1>
        <p className="mt-1 text-[#94A3B8]">{t("history.subtitle", lang)}</p>
      </div>

      {agentTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === "all" ? "bg-[#00F0FF]/10 text-[#00F0FF]" : "bg-[#1E1E2E] text-[#94A3B8] hover:text-[#F8FAFC]"}`}>
            {t("history.all", lang)} ({results.length})
          </button>
          {agentTypes.map((type) => {
            const meta = AGENT_META[type] || { labelKey: type, color: "text-[#94A3B8]" };
            const count = results.filter((r) => r.agent_type === type).length;
            return (
              <button key={type} onClick={() => setFilter(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === type ? "bg-[#00F0FF]/10 text-[#00F0FF]" : "bg-[#1E1E2E] text-[#94A3B8] hover:text-[#F8FAFC]"}`}>
                {t(meta.labelKey, lang)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((item) => {
            const meta = AGENT_META[item.agent_type] || { labelKey: item.agent_type, icon: Clock, color: "text-[#94A3B8]" };
            const Icon = meta.icon;
            const isExpanded = expandedId === item.id;
            const resultContent = item.messages?.[0]?.content;
            let parsedResult: Record<string, unknown> | null = null;
            try { if (resultContent) parsedResult = JSON.parse(resultContent); } catch { /* Not JSON */ }

            return (
              <div key={item.id} className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 transition-colors hover:border-[#1E1E2E]/80">
                <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="flex w-full items-center gap-4 p-4 text-left">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className={`h-4 w-4 ${meta.color}`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-[#F8FAFC]">{item.title}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {t(meta.labelKey, lang)} &middot;{" "}
                      {new Date(item.created_at).toLocaleDateString(dateLocale, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-[#94A3B8]" /> : <ChevronDown className="h-4 w-4 shrink-0 text-[#94A3B8]" />}
                </button>
                {isExpanded && parsedResult && (
                  <div className="border-t border-[#1E1E2E] p-4">
                    <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-[#0A0A0F] p-4 text-xs leading-relaxed text-[#94A3B8]">
                      {JSON.stringify(parsedResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10"><Clock className="h-7 w-7 text-[#00F0FF]" /></div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t("history.empty_title", lang)}</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">{t("history.empty_desc", lang)}</p>
        </div>
      )}
    </div>
  );
}
