"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  FileText,
  Package,
  Search,
  Users,
  Filter,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    label: "Founder Stage",
    value: "Explorer",
    icon: LayoutDashboard,
  },
  {
    label: "AI Credits",
    value: "50/50",
    icon: Zap,
  },
  {
    label: "Research Reports",
    value: "0",
    icon: FileText,
  },
  {
    label: "Offers Created",
    value: "0",
    icon: Package,
  },
];

const quickActions = [
  {
    href: "/market",
    title: "Market Intelligence",
    description: "Research markets, competitors, and trends with AI analysis.",
    icon: Search,
  },
  {
    href: "/offers",
    title: "Offer Architect",
    description: "Build irresistible offers with AI-powered positioning.",
    icon: Package,
  },
  {
    href: "/audience",
    title: "Audience Intelligence",
    description: "Discover and understand your ideal customer profiles.",
    icon: Users,
  },
  {
    href: "/funnels",
    title: "Funnel Architect",
    description: "Design AI-powered sales funnels that convert cold traffic.",
    icon: Filter,
  },
  {
    href: "/strategy",
    title: "Strategy Advisor",
    description: "Get Opus-level strategic advice in a live chat session.",
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
            Welcome back, Founder
          </span>
        </h1>
        <p className="mt-1 text-[#94A3B8]">Your AI command center</p>
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
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00F0FF]/10">
                  <Icon className="h-5 w-5 text-[#00F0FF]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-[#F8FAFC]">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#F8FAFC]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
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
                  {action.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">
                  {action.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#00F0FF] opacity-0 transition-opacity group-hover:opacity-100">
                  Get started <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
