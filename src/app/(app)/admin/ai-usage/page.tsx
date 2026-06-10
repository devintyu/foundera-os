"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Cpu,
  DollarSign,
  Zap,
  TrendingUp,
  Users,
  CreditCard,
} from "lucide-react";

interface AIUsageStats {
  totalCreditsUsed: number;
  totalGeminiTokens: number;
  totalClaudeTokens: number;
  totalEstimatedCost: number;
  totalCalls: number;
  modelBreakdown: Record<string, { tokens: number; cost: number; calls: number }>;
  topUsersByCost: {
    userId: string;
    fullName: string;
    plan: string;
    cost: number;
    credits: number;
    claudeTokens: number;
  }[];
  topupHistory: {
    id: string;
    user_id: string;
    topup_package_name: string;
    amount_usd: number;
    ai_credits_added: number;
    status: string;
    created_at: string;
  }[];
  balanceSummary: {
    totalUsers: number;
    modeDistribution: Record<string, number>;
  };
  expensivePrompts: {
    user_id: string;
    agent_id: string;
    task_type: string;
    model_used: string;
    total_tokens: number;
    estimated_cost_usd: number;
    created_at: string;
  }[];
}

const MODEL_COLORS: Record<string, string> = {
  "gemini-flash-lite": "text-[#10B981]",
  "gemini-flash": "text-[#00F0FF]",
  "claude-sonnet": "text-[#8B5CF6]",
  "claude-opus": "text-[#F59E0B]",
};

const MODEL_BAR_COLORS: Record<string, string> = {
  "gemini-flash-lite": "bg-[#10B981]",
  "gemini-flash": "bg-[#00F0FF]",
  "claude-sonnet": "bg-[#8B5CF6]",
  "claude-opus": "bg-[#F59E0B]",
};

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function AdminAIUsagePage() {
  const [stats, setStats] = useState<AIUsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/ai-usage");
        if (res.ok) setStats(await res.json());
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center text-[#94A3B8]">
        Failed to load AI usage data.
      </div>
    );
  }

  const totalCost = stats.totalEstimatedCost;
  const geminiPct = stats.totalCalls > 0
    ? Math.round(((stats.modelBreakdown["gemini-flash-lite"]?.calls ?? 0) + (stats.modelBreakdown["gemini-flash"]?.calls ?? 0)) / stats.totalCalls * 100)
    : 0;

  const kpis = [
    { label: "Total AI Credits Used", value: stats.totalCreditsUsed.toLocaleString(), icon: Zap, color: "text-[#00F0FF]" },
    { label: "Estimated API Cost", value: `$${totalCost.toFixed(2)}`, icon: DollarSign, color: "text-[#10B981]" },
    { label: "Total AI Calls", value: stats.totalCalls.toLocaleString(), icon: Cpu, color: "text-[#8B5CF6]" },
    { label: "Gemini Usage %", value: `${geminiPct}%`, icon: TrendingUp, color: "text-[#F59E0B]" },
    { label: "Gemini Tokens", value: formatTokens(stats.totalGeminiTokens), icon: Zap, color: "text-[#10B981]" },
    { label: "Claude Tokens", value: formatTokens(stats.totalClaudeTokens), icon: Zap, color: "text-[#8B5CF6]" },
  ];

  const maxModelCalls = Math.max(...Object.values(stats.modelBreakdown).map((m) => m.calls), 1);

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin" className="rounded-lg bg-[#1E1E2E] p-2 transition-colors hover:bg-[#1E1E2E]/80">
          <ArrowLeft className="h-5 w-5 text-[#94A3B8]" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              AI Usage &amp; Cost Dashboard
            </span>
          </h1>
          <p className="text-sm text-[#94A3B8]">This month&apos;s AI token usage, costs, and credit consumption</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-5">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${kpi.color}`} />
                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-[#F8FAFC]">{kpi.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Model Breakdown */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">Cost by Model</h3>
          <div className="space-y-4">
            {Object.entries(stats.modelBreakdown)
              .sort(([, a], [, b]) => b.cost - a.cost)
              .map(([model, data]) => (
                <div key={model}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={`font-medium ${MODEL_COLORS[model] || "text-[#F8FAFC]"}`}>{model}</span>
                    <span className="text-[#94A3B8]">
                      {data.calls} calls &middot; {formatTokens(data.tokens)} tokens &middot; ${data.cost.toFixed(4)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                    <div
                      className={`h-full rounded-full ${MODEL_BAR_COLORS[model] || "bg-[#94A3B8]"} transition-all`}
                      style={{ width: `${(data.calls / maxModelCalls) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Users by Cost */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <Users className="h-4 w-4" /> Top Users by Cost
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-[#94A3B8]">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Plan</th>
                  <th className="pb-2 font-medium text-right">Credits</th>
                  <th className="pb-2 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {stats.topUsersByCost.map((u) => (
                  <tr key={u.userId} className="border-b border-[#1E1E2E]/50">
                    <td className="py-2 text-[#F8FAFC]">{u.fullName || "—"}</td>
                    <td className="py-2">
                      <span className="rounded-full bg-[#1E1E2E] px-2 py-0.5 capitalize text-[#94A3B8]">{u.plan}</span>
                    </td>
                    <td className="py-2 text-right text-[#00F0FF]">{u.credits.toLocaleString()}</td>
                    <td className="py-2 text-right text-[#10B981]">${u.cost.toFixed(4)}</td>
                  </tr>
                ))}
                {stats.topUsersByCost.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-[#94A3B8]">No usage data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Expensive Prompts */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">Most Expensive Prompts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-[#94A3B8]">
                  <th className="pb-2 font-medium">Agent</th>
                  <th className="pb-2 font-medium">Model</th>
                  <th className="pb-2 font-medium text-right">Tokens</th>
                  <th className="pb-2 font-medium text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {stats.expensivePrompts.map((p) => (
                  <tr key={p.created_at} className="border-b border-[#1E1E2E]/50">
                    <td className="py-2 text-[#F8FAFC]">{p.agent_id || p.task_type}</td>
                    <td className="py-2">
                      <span className={MODEL_COLORS[p.model_used] || "text-[#94A3B8]"}>{p.model_used}</span>
                    </td>
                    <td className="py-2 text-right text-[#94A3B8]">{formatTokens(p.total_tokens)}</td>
                    <td className="py-2 text-right text-[#10B981]">${parseFloat(String(p.estimated_cost_usd)).toFixed(4)}</td>
                  </tr>
                ))}
                {stats.expensivePrompts.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-[#94A3B8]">No usage data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Up History */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <CreditCard className="h-4 w-4" /> Recent Top-Ups
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E1E2E] text-[#94A3B8]">
                  <th className="pb-2 font-medium">Package</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                  <th className="pb-2 font-medium text-right">Credits</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.topupHistory.map((t) => (
                  <tr key={t.id} className="border-b border-[#1E1E2E]/50">
                    <td className="py-2 text-[#F8FAFC]">{t.topup_package_name}</td>
                    <td className="py-2 text-right text-[#10B981]">${t.amount_usd}</td>
                    <td className="py-2 text-right text-[#00F0FF]">+{t.ai_credits_added.toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`rounded-full px-2 py-0.5 ${t.status === "completed" ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.topupHistory.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-[#94A3B8]">No top-ups yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mode Distribution */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">User AI Cost Mode Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          {["economy", "balanced", "premium"].map((mode) => (
            <div key={mode} className="rounded-lg bg-[#1E1E2E]/50 p-4 text-center">
              <p className="text-2xl font-bold text-[#F8FAFC]">
                {stats.balanceSummary.modeDistribution[mode] || 0}
              </p>
              <p className="text-xs capitalize text-[#94A3B8]">{mode}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
