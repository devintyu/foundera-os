"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/market": "Market Intelligence",
  "/offers": "Offer Architect",
  "/audience": "Audience Intelligence",
  "/settings": "Settings",
  "/billing": "Billing",
};

export default function TopBar() {
  const pathname = usePathname();

  const pageTitle =
    Object.entries(pageTitles).find(([path]) =>
      pathname?.startsWith(path)
    )?.[1] ?? "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E1E2E] bg-[#0A0A0F] px-6">
      {/* Left: Page title */}
      <h1 className="text-lg font-semibold text-[#F8FAFC]">{pageTitle}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        {/* Notification bell */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0A0A0F]" />
        </button>

        {/* User avatar */}
        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#00F0FF] text-xs font-semibold text-white">
          F
        </div>
      </div>
    </header>
  );
}
