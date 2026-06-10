"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, AlertTriangle, CreditCard, Settings } from "lucide-react";

interface CreditsData {
  planName: string;
  planId: string;
  monthlyCredits: number;
  remainingMonthlyCredits: number;
  topupCredits: number;
  totalCredits: number;
  usedCredits: number;
  usagePercent: number;
  costMode: string;
  renewalDate: string;
  allowClaudeStrategy: boolean;
  allowDeepThinking: boolean;
  warnings: {
    near80: boolean;
    reached100: boolean;
    claudeLimited: boolean;
  };
}

interface TopupPackage {
  id: string;
  name: string;
  priceUsd: number;
  priceMyr: number;
  credits: number;
}

export default function CreditsPanel() {
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [packages, setPackages] = useState<TopupPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [topupLoading, setTopupLoading] = useState<string | null>(null);
  const [modeLoading, setModeLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [creditsRes, packagesRes] = await Promise.all([
          fetch("/api/ai/credits"),
          fetch("/api/stripe/topup"),
        ]);
        if (creditsRes.ok) setCredits(await creditsRes.json());
        if (packagesRes.ok) {
          const data = await packagesRes.json();
          setPackages(data.packages || []);
        }
      } catch {
        /* noop */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleTopup(packageId: string) {
    setTopupLoading(packageId);
    try {
      const res = await fetch("/api/stripe/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      /* noop */
    } finally {
      setTopupLoading(null);
    }
  }

  async function handleModeChange(mode: string) {
    setModeLoading(true);
    try {
      const res = await fetch("/api/ai/credits/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        setCredits((prev) => prev ? { ...prev, costMode: mode } : prev);
      }
    } catch {
      /* noop */
    } finally {
      setModeLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
      </div>
    );
  }

  if (!credits) return null;

  const progressColor = credits.usagePercent >= 100
    ? "bg-[#EF4444]"
    : credits.usagePercent >= 80
      ? "bg-[#F59E0B]"
      : "bg-[#00F0FF]";

  return (
    <div className="space-y-6">
      {/* Credit Summary */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
            <Zap className="h-4 w-4 text-[#00F0FF]" /> AI Credits
          </h3>
          <span className="rounded-full bg-[#1E1E2E] px-3 py-1 text-xs font-medium capitalize text-[#00F0FF]">
            {credits.planName} Plan
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">
              {credits.usedCredits.toLocaleString()} / {credits.monthlyCredits.toLocaleString()} credits used
            </span>
            <span className="text-[#94A3B8]">{credits.usagePercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
            <div
              className={`h-full rounded-full ${progressColor} transition-all duration-500`}
              style={{ width: `${Math.min(credits.usagePercent, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-[#1E1E2E]/50 p-3 text-center">
            <p className="text-lg font-bold text-[#00F0FF]">{credits.remainingMonthlyCredits.toLocaleString()}</p>
            <p className="text-[10px] text-[#94A3B8]">Monthly</p>
          </div>
          <div className="rounded-lg bg-[#1E1E2E]/50 p-3 text-center">
            <p className="text-lg font-bold text-[#10B981]">{credits.topupCredits.toLocaleString()}</p>
            <p className="text-[10px] text-[#94A3B8]">Top-Up</p>
          </div>
          <div className="rounded-lg bg-[#1E1E2E]/50 p-3 text-center">
            <p className="text-lg font-bold text-[#F8FAFC]">{credits.totalCredits.toLocaleString()}</p>
            <p className="text-[10px] text-[#94A3B8]">Total Available</p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-[#94A3B8]">
          Renews: {new Date(credits.renewalDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>

        {/* Warnings */}
        {credits.warnings.reached100 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Monthly credits exhausted. Top up to continue using AI features.
          </div>
        )}
        {credits.warnings.near80 && !credits.warnings.reached100 && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F59E0B]/10 p-3 text-xs text-[#F59E0B]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            You&apos;ve used 80% of your monthly credits. Consider topping up.
          </div>
        )}
      </div>

      {/* AI Cost Mode */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
          <Settings className="h-4 w-4 text-[#8B5CF6]" /> AI Cost Mode
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "economy", label: "Economy", desc: "Lowest cost, Gemini only" },
            { id: "balanced", label: "Balanced", desc: "Gemini + Claude strategy" },
            { id: "premium", label: "Premium", desc: "Full Claude access" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              disabled={modeLoading}
              className={`rounded-lg border p-3 text-left transition-all ${
                credits.costMode === mode.id
                  ? "border-[#00F0FF] bg-[#00F0FF]/10"
                  : "border-[#1E1E2E] bg-[#1E1E2E]/30 hover:border-[#94A3B8]/30"
              }`}
            >
              <p className="text-xs font-medium text-[#F8FAFC]">{mode.label}</p>
              <p className="mt-0.5 text-[10px] text-[#94A3B8]">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Top-Up Packages */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
          <CreditCard className="h-4 w-4 text-[#10B981]" /> Top Up Credits
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handleTopup(pkg.id)}
              disabled={topupLoading !== null}
              className="flex flex-col items-center rounded-lg border border-[#1E1E2E] bg-[#1E1E2E]/30 p-4 transition-all hover:border-[#00F0FF]/30 hover:bg-[#00F0FF]/5"
            >
              <p className="text-lg font-bold text-[#00F0FF]">
                {pkg.credits.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#94A3B8]">credits</p>
              <p className="mt-2 text-sm font-semibold text-[#F8FAFC]">
                ${pkg.priceUsd}
              </p>
              <p className="text-[10px] text-[#94A3B8]">RM {pkg.priceMyr}</p>
              {topupLoading === pkg.id && (
                <div className="mt-2 h-4 w-4 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan Features */}
      <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]">
          <TrendingUp className="h-4 w-4 text-[#F59E0B]" /> Plan Features
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Claude Strategy</span>
            <span className={credits.allowClaudeStrategy ? "text-[#10B981]" : "text-[#EF4444]"}>
              {credits.allowClaudeStrategy ? "Enabled" : "Upgrade Required"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#94A3B8]">Deep Thinking (Claude Opus)</span>
            <span className={credits.allowDeepThinking ? "text-[#10B981]" : "text-[#EF4444]"}>
              {credits.allowDeepThinking ? "Enabled" : "Upgrade Required"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
