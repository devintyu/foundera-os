"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/use-language";
import {
  LayoutDashboard,
  Search,
  Package,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { t } from "@/lib/i18n/language-detector";

const mobileNavDefs = [
  { href: "/dashboard", labelKey: "dashboard.title", icon: LayoutDashboard },
  { href: "/market", labelKey: "market.title", icon: Search },
  { href: "/offers", labelKey: "offers.title", icon: Package },
  { href: "/strategy", labelKey: "strategy.title", icon: Sparkles },
  { href: "/settings", labelKey: "settings.title", icon: MoreHorizontal },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { language } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1E1E2E] bg-[#12121A] lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavDefs.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-[#00F0FF]" : "text-[#94A3B8]"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#00F0FF]" : "text-[#94A3B8]"
                }`}
              >
                {t(item.labelKey, language)}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
