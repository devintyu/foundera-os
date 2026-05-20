"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Users,
  DollarSign,
  Zap,
  BarChart3,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Crown,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";

interface Stats {
  totalUsers: number;
  admins: number;
  onboardedUsers: number;
  newUsersThisMonth: number;
  mrr: number;
  activeSubs: number;
  subStatusCounts: Record<string, number>;
  totalAICalls: number;
  totalTokens: number;
  totalConversations: number;
  planDistribution: Record<string, number>;
  stageDistribution: Record<string, number>;
  recentUsers: { id: string; full_name: string; plan: string; created_at: string }[];
}

const PLAN_COLORS: Record<string, string> = {
  starter: "bg-[#94A3B8]",
  pro: "bg-[#00F0FF]",
  business: "bg-[#8B5CF6]",
  elite: "bg-[#F59E0B]",
};

export default function AdminDashboardPage() {
  const { language: lang } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) {
          setError(res.status === 403 ? "access_denied" : "failed_stats");
          return;
        }
        setStats(await res.json());
      } catch {
        setError("failed_data");
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
        <p className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t(`admin.${error}`, lang)}</p>
      </div>
    );
  }

  if (!stats) return null;

  const STAGE_LABELS: Record<string, string> = {
    explorer: t("admin.explorer", lang),
    builder: t("admin.builder", lang),
    operator: t("admin.operator", lang),
    scaler: t("admin.scaler", lang),
    owner: t("admin.owner", lang),
  };

  const kpis = [
    { label: t("admin.total_users", lang), value: stats.totalUsers, icon: Users, color: "text-[#00F0FF]", bg: "from-[#00F0FF]/10 to-[#00F0FF]/5" },
    { label: t("admin.monthly_revenue", lang), value: `$${stats.mrr.toLocaleString()}`, icon: DollarSign, color: "text-[#10B981]", bg: "from-[#10B981]/10 to-[#10B981]/5" },
    { label: t("admin.active_subs", lang), value: stats.activeSubs, icon: Crown, color: "text-[#F59E0B]", bg: "from-[#F59E0B]/10 to-[#F59E0B]/5" },
    { label: t("admin.ai_calls_month", lang), value: stats.totalAICalls.toLocaleString(), icon: Zap, color: "text-[#8B5CF6]", bg: "from-[#8B5CF6]/10 to-[#8B5CF6]/5" },
    { label: t("admin.total_conversations", lang), value: stats.totalConversations.toLocaleString(), icon: MessageSquare, color: "text-[#EF4444]", bg: "from-[#EF4444]/10 to-[#EF4444]/5" },
    { label: t("admin.new_users_month", lang), value: stats.newUsersThisMonth, icon: UserPlus, color: "text-[#00F0FF]", bg: "from-[#00F0FF]/10 to-[#8B5CF6]/5" },
  ];

  const totalPlans = Object.values(stats.planDistribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              {t("admin.title", lang)}
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">{t("admin.subtitle", lang)}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-lg bg-[#1E1E2E] px-4 py-2 text-sm font-medium text-[#F8FAFC] transition-colors hover:bg-[#1E1E2E]/80"
          >
            <Users className="h-4 w-4" /> {t("admin.users_link", lang)}
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 rounded-lg bg-[#1E1E2E] px-4 py-2 text-sm font-medium text-[#F8FAFC] transition-colors hover:bg-[#1E1E2E]/80"
          >
            <BarChart3 className="h-4 w-4" /> {t("admin.analytics_link", lang)}
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-5 backdrop-blur-sm transition-colors hover:border-[#00F0FF]/20"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${kpi.bg}`}>
                  <Icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
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
        {/* Plan Distribution */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">{t("admin.plan_distribution", lang)}</h3>
          <div className="space-y-3">
            {Object.entries(stats.planDistribution).map(([plan, count]) => {
              const pct = Math.round((count / totalPlans) * 100);
              return (
                <div key={plan}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-[#F8FAFC]">{plan}</span>
                    <span className="text-[#94A3B8]">{count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                    <div
                      className={`h-full rounded-full ${PLAN_COLORS[plan] || "bg-[#94A3B8]"} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder Stage Distribution */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">{t("admin.founder_stages", lang)}</h3>
          <div className="space-y-3">
            {Object.entries(stats.stageDistribution).map(([stage, count]) => {
              const pct = Math.round((count / totalPlans) * 100);
              return (
                <div key={stage}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F8FAFC]">{STAGE_LABELS[stage] || stage}</span>
                    <span className="text-[#94A3B8]">{count} users ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription Status */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">{t("admin.sub_status", lang)}</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "active", label: t("admin.active", lang), color: "text-[#10B981]" },
              { key: "past_due", label: t("admin.past_due", lang), color: "text-[#F59E0B]" },
              { key: "canceled", label: t("admin.canceled", lang), color: "text-[#EF4444]" },
            ].map((s) => (
              <div key={s.key} className="text-center">
                <p className={`text-2xl font-bold ${s.color}`}>
                  {stats.subStatusCounts[s.key] || 0}
                </p>
                <p className="text-xs text-[#94A3B8]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Usage Summary */}
        <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#F8FAFC]">{t("admin.ai_usage_month", lang)}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#1E1E2E]/50 p-4 text-center">
              <p className="text-2xl font-bold text-[#00F0FF]">{stats.totalAICalls.toLocaleString()}</p>
              <p className="text-xs text-[#94A3B8]">{t("admin.api_calls", lang)}</p>
            </div>
            <div className="rounded-lg bg-[#1E1E2E]/50 p-4 text-center">
              <p className="text-2xl font-bold text-[#8B5CF6]">
                {stats.totalTokens > 1000000
                  ? `${(stats.totalTokens / 1000000).toFixed(1)}M`
                  : stats.totalTokens > 1000
                    ? `${(stats.totalTokens / 1000).toFixed(1)}K`
                    : stats.totalTokens.toLocaleString()}
              </p>
              <p className="text-xs text-[#94A3B8]">{t("admin.tokens_used", lang)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("admin.recent_signups", lang)}</h3>
          <Link href="/admin/users" className="flex items-center gap-1 text-xs font-medium text-[#00F0FF] hover:underline">
            {t("admin.view_all", lang)} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1E1E2E] text-xs text-[#94A3B8]">
                <th className="pb-3 font-medium">{t("admin.col_name", lang)}</th>
                <th className="pb-3 font-medium">{t("admin.col_plan", lang)}</th>
                <th className="pb-3 font-medium">{t("admin.col_joined", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-[#1E1E2E]/50 last:border-0">
                  <td className="py-3 text-[#F8FAFC]">{u.full_name || "—"}</td>
                  <td className="py-3">
                    <span className="inline-flex rounded-full bg-[#1E1E2E] px-2 py-0.5 text-xs capitalize text-[#94A3B8]">
                      {u.plan || "starter"}
                    </span>
                  </td>
                  <td className="py-3 text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
              {stats.recentUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-[#94A3B8]">{t("admin.no_users_yet", lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
