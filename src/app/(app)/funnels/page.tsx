"use client";

import { useState } from "react";
import {
  Filter,
  ArrowRight,
  Target,
  Megaphone,
  BarChart3,
  Zap,
  Plus,
  ArrowLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Layers,
} from "lucide-react";

interface FunnelResult {
  funnel_type: string;
  stages: string[];
  traffic_channels: string[];
  conversion_optimizations: string[];
  metrics: {
    expected_opt_in_rate: string;
    expected_sales_conversion: string;
    estimated_cpl: string;
    estimated_cpa: string;
  };
  quick_wins: string[];
}

export default function FunnelsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [pricePoint, setPricePoint] = useState("");
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<FunnelResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/funnel-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, audience, pricePoint, goal }),
      });
      const data: FunnelResult = await res.json();
      setResult(data);
      setShowForm(false);
    } catch {
      // Error handled by showing no result
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              Funnel Architect
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">
            AI-designed sales funnels that convert cold traffic into customers
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setResult(null);
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
        >
          {showForm ? (
            <>
              <ArrowLeft className="h-4 w-4" /> Back
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Design Funnel
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Your Offer
            </label>
            <input
              type="text"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              placeholder="e.g. 12-week online fitness coaching program"
              required
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Busy professionals aged 30-45 who want to lose 20+ lbs"
              required
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                Price Point{" "}
                <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <input
                type="text"
                value={pricePoint}
                onChange={(e) => setPricePoint(e.target.value)}
                placeholder="e.g. $497"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                Primary Goal{" "}
                <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. 50 sales per month"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            <Filter className="h-4 w-4" />
            {loading ? "Designing..." : "Design My Funnel"}
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-16 backdrop-blur-xl">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0s_infinite] rounded-full bg-[#00F0FF]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-[#8B5CF6]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-[#00F0FF]" />
          </div>
          <p className="mt-4 text-sm text-[#94A3B8]">
            AI is designing your funnel...
          </p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Funnel Type */}
          <div className="rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00F0FF]/10">
                <Filter className="h-5 w-5 text-[#00F0FF]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Recommended Funnel Type
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {result.funnel_type}
            </p>
          </div>

          {/* Funnel Stages */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                <Layers className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Funnel Stages
              </h3>
            </div>
            <div className="space-y-3">
              {result.stages.map((stage, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-xs font-bold text-[#8B5CF6]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-[#94A3B8]">
                      {stage}
                    </p>
                    {i < result.stages.length - 1 && (
                      <div className="my-2 flex justify-center">
                        <ChevronRight className="h-4 w-4 rotate-90 text-[#1E1E2E]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Channels */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                <Megaphone className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Traffic Channels
              </h3>
            </div>
            <ul className="space-y-2.5">
              {result.traffic_channels.map((ch, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#94A3B8]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />
                  {ch}
                </li>
              ))}
            </ul>
          </div>

          {/* Conversion Optimizations */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EF4444]/10">
                <Target className="h-5 w-5 text-[#EF4444]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Conversion Optimizations
              </h3>
            </div>
            <ul className="space-y-2.5">
              {result.conversion_optimizations.map((opt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#94A3B8]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#EF4444]" />
                  {opt}
                </li>
              ))}
            </ul>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]/10">
                <TrendingUp className="h-4 w-4 text-[#10B981]" />
              </div>
              <p className="text-xs text-[#94A3B8]">Opt-in Rate</p>
              <p className="text-lg font-bold text-[#F8FAFC]">
                {result.metrics.expected_opt_in_rate}
              </p>
            </div>
            <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                <BarChart3 className="h-4 w-4 text-[#8B5CF6]" />
              </div>
              <p className="text-xs text-[#94A3B8]">Sales Conv.</p>
              <p className="text-lg font-bold text-[#F8FAFC]">
                {result.metrics.expected_sales_conversion}
              </p>
            </div>
            <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#00F0FF]/10">
                <DollarSign className="h-4 w-4 text-[#00F0FF]" />
              </div>
              <p className="text-xs text-[#94A3B8]">Est. CPL</p>
              <p className="text-lg font-bold text-[#F8FAFC]">
                {result.metrics.estimated_cpl}
              </p>
            </div>
            <div className="rounded-xl border border-[#1E1E2E] bg-[#12121A]/80 p-4">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B]/10">
                <DollarSign className="h-4 w-4 text-[#F59E0B]" />
              </div>
              <p className="text-xs text-[#94A3B8]">Est. CPA</p>
              <p className="text-lg font-bold text-[#F8FAFC]">
                {result.metrics.estimated_cpa}
              </p>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10">
                <Zap className="h-5 w-5 text-[#10B981]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Quick Wins — Do This Week
              </h3>
            </div>
            <ul className="space-y-2.5">
              {result.quick_wins.map((win, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[#94A3B8]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-[10px] font-bold text-[#10B981]">
                    {i + 1}
                  </span>
                  {win}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !showForm && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
            <Filter className="h-7 w-7 text-[#00F0FF]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">
            Design your first sales funnel
          </h3>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Let AI architect a complete funnel strategy for your offer
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
          >
            <Plus className="h-4 w-4" /> Design Funnel
          </button>
        </div>
      )}
    </div>
  );
}
