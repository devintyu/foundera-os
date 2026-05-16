"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Package,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/market", label: "Market", icon: Search },
  { href: "/offers", label: "Offers", icon: Package },
  { href: "/strategy", label: "Strategy", icon: Sparkles },
  { href: "/settings", label: "More", icon: MoreHorizontal },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1E1E2E] bg-[#12121A] lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
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
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
