"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Package,
  Users,
  Settings,
  CreditCard,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Market Intelligence", icon: Search },
  { href: "/offers", label: "Offer Architect", icon: Package },
  { href: "/audience", label: "Audience Intelligence", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[#1E1E2E] bg-[#12121A] lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
          <Zap className="h-4 w-4 text-[#00F0FF]" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
        </div>
        <span className="text-lg font-bold tracking-tight text-[#F8FAFC]">
          FOUNDERA <span className="text-[#00F0FF]">OS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[#1E1E2E] p-4">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00F0FF] text-sm font-semibold text-white">
            F
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-[#F8FAFC]">
              Founder
            </p>
            <span className="inline-flex items-center rounded-full bg-[#1E1E2E] px-2 py-0.5 text-[10px] font-medium text-[#94A3B8]">
              Free Plan
            </span>
          </div>
        </div>
        <Link
          href="/billing"
          className="mt-3 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90"
        >
          Upgrade
        </Link>
      </div>
    </aside>
  );
}
