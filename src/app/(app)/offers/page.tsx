"use client";

import { useState } from "react";
import {
  Package,
  Sparkles,
  DollarSign,
  Gift,
  ShieldCheck,
  Megaphone,
  Plus,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

interface OfferResult {
  offer_name: string;
  value_proposition: string;
  pricing_structure: string;
  bonuses: string[];
  guarantee: string;
  sales_angle: string;
}

const OFFER_TYPES = [
  { value: "course", label: "Course" },
  { value: "consulting", label: "Consulting" },
  { value: "coaching", label: "Coaching" },
  { value: "saas", label: "SaaS" },
  { value: "service", label: "Service" },
  { value: "digital_product", label: "Digital Product" },
];

export default function OffersPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [offerType, setOfferType] = useState("");
  const [result, setResult] = useState<OfferResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/offer-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          target_audience: targetAudience,
          problem,
          price_range: priceRange,
          offer_type: offerType,
        }),
      });
      const data: OfferResult = await res.json();
      setResult(data);
      setShowForm(false);
    } catch {
      // Error is handled by showing no result
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
              Offer Architect
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">
            AI-powered offer design and positioning
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
              <Plus className="h-4 w-4" /> Create Offer
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                Offer Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Launch Accelerator"
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
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. First-time SaaS founders"
                required
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
              Core Problem You Solve
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the core problem your offer solves..."
              rows={3}
              required
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                Price Range{" "}
                <span className="text-[#94A3B8]">(optional)</span>
              </label>
              <input
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g. $497 - $2,497"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                Offer Type
              </label>
              <div className="relative">
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none transition-colors focus:border-[#00F0FF]/50"
                >
                  <option value="">Select type...</option>
                  {OFFER_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Building" : "Build Offer"}
          </button>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-16 backdrop-blur-xl">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0s_infinite] rounded-full bg-[#00F0FF]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.15s_infinite] rounded-full bg-[#8B5CF6]" />
            <span className="h-2.5 w-2.5 animate-[bounce_1s_ease-in-out_0.3s_infinite] rounded-full bg-[#00F0FF]" />
          </div>
          <p className="mt-4 text-sm text-[#94A3B8]">
            AI is crafting your offer...
          </p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Offer Name */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#00F0FF]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Offer Name
              </h3>
            </div>
            <p className="text-xl font-bold text-[#F8FAFC]">
              {result.offer_name}
            </p>
          </div>

          {/* Value Proposition */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Value Proposition
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {result.value_proposition}
            </p>
          </div>

          {/* Pricing Structure */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Pricing Structure
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {result.pricing_structure}
            </p>
          </div>

          {/* Bonus Stack */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#F59E0B]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Bonus Stack
              </h3>
            </div>
            <ul className="space-y-2">
              {result.bonuses.map((bonus, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#94A3B8]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />
                  {bonus}
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantee */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Guarantee
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {result.guarantee}
            </p>
          </div>

          {/* Sales Angle */}
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Sales Angle
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              {result.sales_angle}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !showForm && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
            <Package className="h-7 w-7 text-[#00F0FF]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">
            Design your first irresistible offer
          </h3>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Let AI architect a high-converting offer with pricing and bonuses
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
          >
            <Plus className="h-4 w-4" /> Create Offer
          </button>
        </div>
      )}
    </div>
  );
}
