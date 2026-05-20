"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
import {
  Search,
  TrendingUp,
  Target,
  Users,
  Lightbulb,
  BarChart3,
  Plus,
  ArrowLeft,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface MarketResult {
  overview: string;
  opportunities: string[];
  competitors: string[];
  recommendations: string[];
  opportunity_score: number;
}

interface PastResearch {
  industry: string;
  niche: string;
  score: number;
  result: MarketResult;
}

export default function MarketPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState("");
  const [niche, setNiche] = useState("");
  const [questions, setQuestions] = useState("");
  const [currentResult, setCurrentResult] = useState<MarketResult | null>(null);
  const [pastResearch, setPastResearch] = useState<PastResearch[]>([]);
  const [error, setError] = useState(false);
  const { language: lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCurrentResult(null);
    setError(false);

    try {
      const res = await fetch("/api/ai/market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, niche, questions, language: lang }),
      });
      if (!res.ok) throw new Error("API error");
      const data: MarketResult = await res.json();
      if (!data.opportunities) throw new Error("Invalid response");
      setCurrentResult(data);
      setPastResearch((prev) => [
        { industry, niche, score: data.opportunity_score, result: data },
        ...prev,
      ]);
      setShowForm(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadPast = (item: PastResearch) => {
    setCurrentResult(item.result);
    setShowForm(false);
  };

  const scoreColor =
    currentResult && currentResult.opportunity_score >= 70
      ? "text-[#10B981]"
      : currentResult && currentResult.opportunity_score >= 40
        ? "text-[#F59E0B]"
        : "text-red-400";

  const scoreBarColor =
    currentResult && currentResult.opportunity_score >= 70
      ? "bg-[#10B981]"
      : currentResult && currentResult.opportunity_score >= 40
        ? "bg-[#F59E0B]"
        : "bg-red-400";

  return (
    <div className="space-y-6 p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] bg-clip-text text-transparent">
              {t("market.title", lang)}
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">
            {t("market.subtitle", lang)}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setCurrentResult(null);
          }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
        >
          {showForm ? (
            <>
              <ArrowLeft className="h-4 w-4" /> {t("back", lang)}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> {t("market.new_research", lang)}
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                  {t("market.industry", lang)}
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder={t("market.industry_placeholder", lang)}
                  required
                  className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                  {t("market.niche", lang)}
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder={t("market.niche_placeholder", lang)}
                  required
                  className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                  {t("market.key_questions", lang)}{" "}
                  <span className="text-[#94A3B8]">({t("optional", lang)})</span>
                </label>
                <textarea
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder={t("market.questions_placeholder", lang)}
                  rows={3}
                  className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {loading ? t("market.analyzing", lang) : t("market.analyze", lang)}
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
                {t("market.ai_researching", lang)}
              </p>
            </div>
          )}

          {/* Results */}
          {currentResult && !loading && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#00F0FF]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.opportunity_score", lang)}</h3>
                </div>
                <div className="flex items-end gap-3">
                  <span className={`text-4xl font-bold ${scoreColor}`}>{currentResult.opportunity_score}</span>
                  <span className="mb-1 text-sm text-[#94A3B8]">/ 100</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#1E1E2E]">
                  <div className={`h-full rounded-full ${scoreBarColor} transition-all duration-1000`} style={{ width: `${currentResult.opportunity_score}%` }} />
                </div>
              </div>

              <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#00F0FF]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.overview", lang)}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[#94A3B8]">{currentResult.overview}</p>
              </div>

              <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#F59E0B]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.opportunities", lang)}</h3>
                </div>
                <ul className="space-y-2">
                  {currentResult.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#8B5CF6]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.competitors", lang)}</h3>
                </div>
                <ul className="space-y-2">
                  {currentResult.competitors.map((comp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8B5CF6]" />
                      {comp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#10B981]" />
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.recommendations", lang)}</h3>
                </div>
                <ul className="space-y-2">
                  {currentResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#10B981]" />
                      {rec}
                    </li>
                  ))}
                </ul>
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
          {!currentResult && !loading && !showForm && !error && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#1E1E2E] bg-white/5 py-20 backdrop-blur-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10">
                <Search className="h-7 w-7 text-[#00F0FF]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t("market.empty_title", lang)}</h3>
              <p className="mt-1 text-sm text-[#94A3B8]">{t("market.empty_desc", lang)}</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
              >
                <Plus className="h-4 w-4" /> {t("market.new_research", lang)}
              </button>
            </div>
          )}
        </div>

        {/* Past Research Sidebar */}
        {pastResearch.length > 0 && (
          <div className="w-full lg:w-72">
            <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-4 backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#94A3B8]" />
                <h3 className="text-sm font-semibold text-[#F8FAFC]">{t("market.past_research", lang)}</h3>
              </div>
              <div className="space-y-2">
                {pastResearch.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => loadPast(item)}
                    className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F]/50 p-3 text-left transition-colors hover:border-[#00F0FF]/30"
                  >
                    <p className="truncate text-sm font-medium text-[#F8FAFC]">{item.industry} — {item.niche}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1E1E2E]">
                        <div
                          className={`h-full rounded-full ${item.score >= 70 ? "bg-[#10B981]" : item.score >= 40 ? "bg-[#F59E0B]" : "bg-red-400"}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#94A3B8]">{item.score}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
