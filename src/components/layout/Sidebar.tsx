"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/lib/i18n/use-language";
import {
  LayoutDashboard,
  Search,
  Package,
  Users,
  Filter,
  Sparkles,
  PenTool,
  Clock,
  Settings,
  CreditCard,
  Zap,
  Shield,
} from "lucide-react";
import { t } from "@/lib/i18n/language-detector";
import type { Language } from "@/lib/i18n/language-detector";

const navItemDefs = [
  { href: "/dashboard", labelKey: "dashboard.title", icon: LayoutDashboard },
  { href: "/market", labelKey: "market.title", icon: Search },
  { href: "/offers", labelKey: "offers.title", icon: Package },
  { href: "/audience", labelKey: "audience.title", icon: Users },
  { href: "/funnels", labelKey: "funnels.title", icon: Filter },
  { href: "/copy", labelKey: "copy.title", icon: PenTool },
  { href: "/strategy", labelKey: "strategy.title", icon: Sparkles },
  { href: "/credits", labelKey: "credits.title", icon: Zap },
  { href: "/history", labelKey: "history.title", icon: Clock },
  { href: "/settings", labelKey: "settings.title", icon: Settings },
  { href: "/billing", labelKey: "billing.title", icon: CreditCard },
];

const PLAN_LABELS: Record<string, Record<Language, string>> = {
  starter: { en: "Starter", zh: "入门" },
  pro: { en: "Pro", zh: "专业" },
  business: { en: "Business", zh: "商业" },
  elite: { en: "Elite", zh: "精英" },
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, profile } = useUser();
  const { language } = useLanguage();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    "Founder";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const planKey = profile?.plan || "starter";
  const planLabel =
    PLAN_LABELS[planKey]?.[language] || PLAN_LABELS.starter[language];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[#1E1E2E] bg-[#12121A] lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
          <Zap className="h-4 w-4 text-[#00F0FF]" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
            FOUNDERA <span className="text-[#00F0FF]">OS</span>
          </span>
          <p className="text-[10px] text-[#94A3B8]">{t("subtitle", language)}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItemDefs.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-l-2 border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF]"
                  : "border-l-2 border-transparent text-[#94A3B8] hover:bg-[#1E1E2E] hover:text-[#F8FAFC]"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] shrink-0 ${
                  isActive
                    ? "text-[#00F0FF]"
                    : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                }`}
              />
              {t(item.labelKey, language)}
            </Link>
          );
        })}
      </nav>

      {/* Admin Link */}
      {profile?.role === "admin" && (
        <div className="px-3 pb-2">
          <Link
            href="/admin"
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              pathname?.startsWith("/admin")
                ? "border-l-2 border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]"
                : "border-l-2 border-transparent text-[#94A3B8] hover:bg-[#1E1E2E] hover:text-[#F8FAFC]"
            }`}
          >
            <Shield
              className={`h-[18px] w-[18px] shrink-0 ${
                pathname?.startsWith("/admin")
                  ? "text-[#F59E0B]"
                  : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
              }`}
            />
            {t("admin.title", language)}
          </Link>
        </div>
      )}

      {/* Bottom Section */}
      <div className="border-t border-[#1E1E2E] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00F0FF] text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-[#F8FAFC]">
              {displayName}
            </p>
            <span className="inline-flex items-center rounded-full bg-[#1E1E2E] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8]">
              {planLabel} {t("plan_suffix", language)}
            </span>
          </div>
        </div>
        {(profile?.plan === "starter" || !profile?.plan) && (
          <Link
            href="/billing"
            className="mt-3 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90"
          >
            {t("upgrade", language)}
          </Link>
        )}
      </div>
    </aside>
  );
}
