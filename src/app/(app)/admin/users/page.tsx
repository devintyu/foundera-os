"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";

interface UserRow {
  id: string;
  full_name: string;
  role: string;
  plan: string;
  founder_stage: string;
  industry: string | null;
  onboarding_completed: boolean;
  created_at: string;
  usage: { ai_calls_count: number; tokens_used: number };
  subscription: { status: string; current_period_end: string } | null;
}

interface UsersResponse {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

const PLAN_BADGES: Record<string, string> = {
  starter: "bg-[#94A3B8]/10 text-[#94A3B8]",
  pro: "bg-[#00F0FF]/10 text-[#00F0FF]",
  business: "bg-[#8B5CF6]/10 text-[#8B5CF6]",
  elite: "bg-[#F59E0B]/10 text-[#F59E0B]",
};

export default function AdminUsersPage() {
  const { language: lang } = useLanguage();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (planFilter) params.set("plan", planFilter);
      params.set("page", String(page));

      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) {
        setError(res.status === 403 ? "access_denied_short" : "failed_users");
        return;
      }
      setData(await res.json());
    } catch {
      setError("failed_users");
    } finally {
      setLoading(false);
    }
  }, [search, planFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, planFilter]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Shield className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t(`admin.${error}`, lang)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">{t("admin.user_management", lang)}</h1>
            <p className="text-sm text-[#94A3B8]">{data?.total || 0} {t("admin.total_users_count", lang)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder={t("admin.search_name", lang)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#1E1E2E] bg-[#12121A] py-2 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8] outline-none focus:border-[#00F0FF]/50"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-lg border border-[#1E1E2E] bg-[#12121A] px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#00F0FF]/50"
        >
          <option value="">{t("admin.all_plans", lang)}</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="business">Business</option>
          <option value="elite">Elite</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1E1E2E] bg-[#12121A]/80">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1E1E2E] text-xs text-[#94A3B8]">
                <th className="px-4 py-3 font-medium">{t("admin.col_user", lang)}</th>
                <th className="px-4 py-3 font-medium">{t("admin.col_plan", lang)}</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">{t("admin.col_stage", lang)}</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">{t("admin.col_ai_calls", lang)}</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">{t("admin.col_tokens", lang)}</th>
                <th className="px-4 py-3 font-medium">{t("admin.col_status", lang)}</th>
                <th className="px-4 py-3 font-medium">{t("admin.col_joined", lang)}</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(data?.users || []).map((u) => (
                <tr key={u.id} className="border-b border-[#1E1E2E]/50 transition-colors hover:bg-[#1E1E2E]/30 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00F0FF] text-xs font-semibold text-white">
                        {(u.full_name || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#F8FAFC]">{u.full_name || "—"}</p>
                        {u.role === "admin" && (
                          <span className="text-[10px] font-medium text-[#F59E0B]">ADMIN</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PLAN_BADGES[u.plan] || PLAN_BADGES.starter}`}>
                      {u.plan || "starter"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 capitalize text-[#94A3B8] md:table-cell">{u.founder_stage}</td>
                  <td className="hidden px-4 py-3 text-[#94A3B8] lg:table-cell">{u.usage.ai_calls_count}</td>
                  <td className="hidden px-4 py-3 text-[#94A3B8] lg:table-cell">
                    {u.usage.tokens_used > 1000
                      ? `${(u.usage.tokens_used / 1000).toFixed(1)}K`
                      : u.usage.tokens_used}
                  </td>
                  <td className="px-4 py-3">
                    {u.subscription ? (
                      <span className={`text-xs font-medium ${u.subscription.status === "active" ? "text-[#10B981]" : u.subscription.status === "past_due" ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                        {u.subscription.status.replace("_", " ")}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94A3B8]">{t("admin.free", lang)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="text-xs font-medium text-[#00F0FF] hover:underline"
                    >
                      {t("admin.view", lang)}
                    </Link>
                  </td>
                </tr>
              ))}
              {(data?.users || []).length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-[#94A3B8]">
                    <Users className="mx-auto h-8 w-8 text-[#1E1E2E]" />
                    <p className="mt-2">{t("admin.no_users_found", lang)}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#94A3B8]">
            {t("admin.page_of", lang)} {data.page} {t("admin.of_total", lang)} {data.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E1E2E] text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E1E2E] text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
