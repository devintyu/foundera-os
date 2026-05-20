"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
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
  AlertTriangle,
} from "lucide-react";

interface OfferResult {
  offer_name: string;
  value_proposition: string;
  pricing_structure: string;
  bonuses: string[];
  guarantee: string;
  sales_angle: string;
}

export default function OffersPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [problem, setProblem] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [offerType, setOfferType] = useState("");
  const [result, setResult] = useState<OfferResult | null>(null);
  const [error, setError] = useState(false);
  const { language: lang } = useLanguage();

  const OFFER_TYPES = [
    { value: "course", label: t("offers.type_course", lang) },
    { value: "consulting", label: t("offers.type_consulting", lang) },
    { value: "coaching", label: t("offers.type_coaching", lang) },
    { value: "saas", label: t("offers.type_saas", lang) },
    { value: "service", label: t("offers.type_service", lang) },
    { value: "digital_product", label: t("offers.type_digital", lang) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(false);

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
          language: lang,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data: OfferResult = await res.json();
      if (!data.bonuses) throw new Error("Invalid response");
      setResult(data);
      setShowForm(false);
    } catch {
      setError(true);
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
              {t("offers.title", lang)}
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">{t("offers.subtitle", lang)}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (!showForm) setResult(null); }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
        >
          {showForm ? (<><ArrowLeft className="h-4 w-4" /> {t("back", lang)}</>) : (<><Plus className="h-4 w-4" /> {t("offers.create", lang)}</>)}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("offers.offer_title", lang)}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("offers.title_placeholder", lang)} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("offers.target_audience", lang)}</label>
              <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder={t("offers.audience_placeholder", lang)} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("offers.core_problem", lang)}</label>
            <textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder={t("offers.problem_placeholder", lang)} rows={3} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("offers.price_range", lang)} <span className="text-[#94A3B8]">({t("optional", lang)})</span></label>
              <input type="text" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder={t("offers.price_placeholder", lang)} className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("offers.offer_type", lang)}</label>
              <div className="relative">
                <select value={offerType} onChange={(e) => setOfferType(e.target.value)} className="w-full appearance-none rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] outline-none transition-colors focus:border-[#00F0FF]/50">
                  <option value="">{t("select_type", lang)}</option>
                  {OFFER_TYPES.map((ot) => (<option key={ot.value} value={ot.value}>{ot.label}</option>))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50">
            <Sparkles className="h-4 w-4" />
            {loading ? t("offers.building", lang) : t("offers.build", lang)}
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
          <p className="mt-4 text-sm text-[#94A3B8]">{t("offers.ai_crafting", lang)}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#00F0FF]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.offer_name", lang)}</h3></div>
            <p className="text-xl font-bold text-[#F8FAFC]">{result.offer_name}</p>
          </div>
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Package className="h-5 w-5 text-[#8B5CF6]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.value_prop", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.value_proposition}</p>
          </div>
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><DollarSign className="h-5 w-5 text-[#10B981]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.pricing", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.pricing_structure}</p>
          </div>
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Gift className="h-5 w-5 text-[#F59E0B]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.bonuses", lang)}</h3></div>
            <ul className="space-y-2">{result.bonuses.map((bonus, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />{bonus}</li>))}</ul>
          </div>
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#10B981]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.guarantee", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.guarantee}</p>
          </div>
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Megaphone className="h-5 w-5 text-[#8B5CF6]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("offers.sales_angle", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.sales_angle}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-16 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t("ai_error_title", lang)}</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">{t("ai_error_desc", lang)}</p>
          <button onClick={() => { setError(false); setShowForm(true); }} className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]">
            {t("ai_error_retry", lang)}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && !showForm && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10"><Package className="h-7 w-7 text-[#00F0FF]" /></div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t("offers.empty_title", lang)}</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">{t("offers.empty_desc", lang)}</p>
          <button onClick={() => setShowForm(true)} className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]">
            <Plus className="h-4 w-4" /> {t("offers.create", lang)}
          </button>
        </div>
      )}
    </div>
  );
}
