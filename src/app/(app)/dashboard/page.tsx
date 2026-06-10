"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
import {
  LayoutDashboard,
  Zap,
  FileText,
  Package,
  Search,
  Users,
  Filter,
  Sparkles,
  PenTool,
  ArrowRight,
  Crown,
} from "lucide-react";

const quickActionDefs = [
  { href: "/market", titleKey: "actions.market_title", descKey: "actions.market_desc", icon: Search },
  { href: "/offers", titleKey: "actions.offers_title", descKey: "actions.offers_desc", icon: Package },
  { href: "/audience", titleKey: "actions.audience_title", descKey: "actions.audience_desc", icon: Users },
  { href: "/funnels", titleKey: "actions.funnels_title", descKey: "actions.funnels_desc", icon: Filter },
  { href: "/strategy", titleKey: "actions.strategy_title", descKey: "actions.strategy_desc", icon: Sparkles },
  { href: "/copy", titleKey: "actions.copy_title", descKey: "actions.copy_desc", icon: PenTool },
];

export default function DashboardPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { plan, totalCredits, monthlyCredits, usedCredits, usagePercent, loading: subLoading } = useSubscription();
  const { language: lang } = useLanguage();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    "Founder";
  const firstName = displayName.split(" ")[0];
  const stage = t(`stages.${profile?.founder_stage || "explorer"}`, lang);
  const planLabel = lang === "zh"
    ? ({ starter: "入门", pro: "专业", business: "代理", elite: "企业" }[plan] || "入门")
    : ({ starter: "Starter", pro: "Pro", business: "Agency", elite: "Enterprise" }[plan] || "Starter");
  const aiCreditsDisplay = `${totalCredits.toLocaleString()}`;
  const aiUsagePercent = usagePercent;

  const isLoading = userLoading || subLoading;

  const stats = [
    {
      label: t("dashboard.founder_stage", lang),
      value: stage,
      icon: LayoutDashboard,
      color: "from-[#00F0FF]/10 to-[#8B5CF6]/10",
      iconColor: "text-[#00F0FF]",
    },
    {
      label: t("dashboard.ai_credits", lang),
      value: aiCreditsDisplay,
      icon: Zap,
      color: "from-[#8B5CF6]/10 to-[#00F0FF]/10",
      iconColor: "text-[#8B5CF6]",
      bar: aiUsagePercent,
    },
    {
      label: t("dashboard.current_plan", lang),
      value: planLabel,
      icon: Crown,
      color: "from-[#F59E0B]/10 to-[#EF4444]/10",
      iconColor: "text-[#F59E0B]",
    },
    {
      label: t("dashboard.tools_available", lang),
      value: "6",
      icon: FileText,
      color: "from-[#10B981]/10 to-[#00F0FF]/10",
      iconColor: "text-[#10B981]",
    },
  ];

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
            {isLoading
              ? t("dashboard.welcome", lang)
              : `${t("dashboard.welcome", lang)}, ${firstName}`}
          </span>
        </h1>
        <p className="mt-1 text-[#94A3B8]">
          {t("dashboard.command_center", lang)} — {planLabel} {t("plan_suffix", lang)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-5 backdrop-blur-sm transition-colors hover:border-[#00F0FF]/20"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-[#94A3B8]">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-[#F8FAFC]">
                    {isLoading ? "—" : stat.value}
                  </p>
                </div>
              </div>
              {stat.bar !== undefined && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] transition-all duration-500"
                    style={{ width: `${Math.min(stat.bar, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Onboarding CTA */}
      {!isLoading && profile && !profile.onboarding_completed && (
        <Link
          href="/onboarding"
          className="group flex items-center justify-between rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-5 transition-all hover:border-[#F59E0B]/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
              <Sparkles className="h-6 w-6 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">
                {t("dashboard.complete_blueprint", lang)}
              </p>
              <p className="text-xs text-[#94A3B8]">
                {t("dashboard.blueprint_desc", lang)}
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-[#F59E0B] transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">
          {t("dashboard.ai_tools", lang)}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActionDefs.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-[#00F0FF]/30 hover:shadow-[0_0_24px_rgba(0,240,255,0.06)]"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
                  <Icon className="h-5 w-5 text-[#00F0FF]" />
                </div>
                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  {t(action.titleKey, lang)}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                  {t(action.descKey, lang)}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#00F0FF] opacity-0 transition-opacity group-hover:opacity-100">
                  {t("get_started", lang)} <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
