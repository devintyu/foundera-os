"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  BarChart3,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

interface MonthlyUsage {
  month: string;
  totalCalls: number;
  totalTokens: number;
  activeUsers: number;
}

interface TopUser {
  user_id: string;
  ai_calls_count: number;
  tokens_used: number;
  profile: { id: string; full_name: string; plan: string } | null;
}

interface AnalyticsData {
  usageByMonth: MonthlyUsage[];
  agentDistribution: Record<string, number>;
  topUsers: TopUser[];
}

const AGENT_LABELS: Record<string, string> = {
  market_researcher: "Market Research",
  offer_builder: "Offer Architect",
  audience_analyst: "Audience Intel",
  funnel_architect: "Funnel Architect",
  copywriter: "AI Copywriter",
  strategy_advisor: "Strategy Advisor",
};

const AGENT_COLORS: Record<string, string> = {
  market_researcher: "bg-[#00F0FF]",
  offer_builder: "bg-[#8B5CF6]",
  audience_analyst: "bg-[#F59E0B]",
  funnel_architect: "bg-[#10B981]",
  copywriter: "bg-[#EF4444]",
  strategy_advisor: "bg-[#EC4899]",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) {
          setError(res.status === 403 ? "Access denied." : "Failed to load analytics.");
          return;
        }
        setData(await res.json());
      } catch {
        setError("Failed to load analytics.");
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Shield className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-[#F8FAFC]">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const maxCalls = Math.max(...data.usageByMonth.map((m) => m.totalCalls), 1);
  const totalAgentCalls = Object.values(data.agentDistribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">AI Analytics</h1>
          <p className="text-sm text-[#94A3B8]">Usage trends and insights</p>
        </div>
      </div>

      {/* Monthly Usage Chart */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
          <TrendingUp className="h-4 w-4 text-[#00F0FF]" /> Monthly AI Usage (6 months)
        </h3>
        <div className="flex items-end gap-3" style={{ height: 200 }}>
          {data.usageByMonth.map((m) => {
            const height = Math.max((m.totalCalls / maxCalls) * 100, 4);
            const monthLabel = new Date(m.month + "-01").toLocaleDateString("en-US", { month: "short" });
            return (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-[#F8FAFC]">{m.totalCalls}</span>
                <div className="w-full max-w-[48px] overflow-hidden rounded-t-lg">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#00F0FF] to-[#8B5CF6] transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: 8 }}
                  />
                </div>
                <span className="text-[10px] text-[#94A3B8]">{monthLabel}</span>
              </div>
            );
          })}
        </div>
        {/* Monthly Details Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E1E2E] text-[#94A3B8]">
                <th className="pb-2 font-medium">Month</th>
                <th className="pb-2 font-medium">AI Calls</th>
                <th className="pb-2 font-medium">Tokens Used</th>
                <th className="pb-2 font-medium">Active Users</th>
              </tr>
            </thead>
            <tbody>
              {data.usageByMonth.map((m) => (
                <tr key={m.month} className="border-b border-[#1E1E2E]/50 last:border-0">
                  <td className="py-2 text-[#F8FAFC]">{m.month}</td>
                  <td className="py-2 text-[#94A3B8]">{m.totalCalls.toLocaleString()}</td>
                  <td className="py-2 text-[#94A3B8]">
                    {m.totalTokens > 1000000
                      ? `${(m.totalTokens / 1000000).toFixed(1)}M`
                      : m.totalTokens > 1000
                        ? `${(m.totalTokens / 1000).toFixed(1)}K`
                        : m.totalTokens.toLocaleString()}
                  </td>
                  <td className="py-2 text-[#94A3B8]">{m.activeUsers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Agent Distribution */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <BarChart3 className="h-4 w-4 text-[#8B5CF6]" /> Usage by AI Tool
          </h3>
          <div className="space-y-3">
            {Object.entries(data.agentDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([agent, count]) => {
                const pct = Math.round((count / totalAgentCalls) * 100);
                return (
                  <div key={agent}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-[#F8FAFC]">{AGENT_LABELS[agent] || agent}</span>
                      <span className="text-[#94A3B8]">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                      <div
                        className={`h-full rounded-full ${AGENT_COLORS[agent] || "bg-[#94A3B8]"} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.keys(data.agentDistribution).length === 0 && (
              <p className="py-8 text-center text-sm text-[#94A3B8]">No AI usage data yet</p>
            )}
          </div>
        </div>

        {/* Top Users */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <Users className="h-4 w-4 text-[#F59E0B]" /> Top Users (This Month)
          </h3>
          {data.topUsers.length > 0 ? (
            <div className="space-y-2">
              {data.topUsers.map((u, i) => (
                <Link
                  key={u.user_id}
                  href={`/admin/users/${u.user_id}`}
                  className="flex items-center justify-between rounded-lg bg-[#1E1E2E]/50 px-4 py-2.5 transition-colors hover:bg-[#1E1E2E]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E1E2E] text-[10px] font-bold text-[#94A3B8]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#F8FAFC]">
                        {u.profile?.full_name || "Unknown"}
                      </p>
                      <p className="text-[10px] capitalize text-[#94A3B8]">{u.profile?.plan || "starter"} plan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#00F0FF]">
                      <Zap className="mr-1 inline h-3 w-3" />
                      {u.ai_calls_count}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">
                      {u.tokens_used > 1000
                        ? `${(u.tokens_used / 1000).toFixed(1)}K tokens`
                        : `${u.tokens_used} tokens`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[#94A3B8]">No usage data this month</p>
          )}
        </div>
      </div>
    </div>
  );
}
