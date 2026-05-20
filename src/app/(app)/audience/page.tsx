"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
import {
  Users,
  Brain,
  AlertCircle,
  Heart,
  MessageSquare,
  Flame,
  UserCircle,
  Plus,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

interface AudienceResult {
  demographics: string;
  psychographics: string;
  pain_points: string[];
  desires: string[];
  objections: string[];
  emotional_triggers: string[];
}

export default function AudiencePage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personaName, setPersonaName] = useState("");
  const [industry, setIndustry] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [result, setResult] = useState<AudienceResult | null>(null);
  const [error, setError] = useState(false);
  const { language: lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(false);

    try {
      const res = await fetch("/api/ai/audience-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_name: personaName,
          industry,
          ideal_customer: idealCustomer,
          language: lang,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data: AudienceResult = await res.json();
      if (!data.pain_points) throw new Error("Invalid response");
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
              {t("audience.title", lang)}
            </span>
          </h1>
          <p className="mt-1 text-[#94A3B8]">{t("audience.subtitle", lang)}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); if (!showForm) setResult(null); }}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-4 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
        >
          {showForm ? (<><ArrowLeft className="h-4 w-4" /> {t("back", lang)}</>) : (<><Plus className="h-4 w-4" /> {t("audience.build_persona", lang)}</>)}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("audience.persona_name", lang)}</label>
              <input type="text" value={personaName} onChange={(e) => setPersonaName(e.target.value)} placeholder={t("audience.persona_placeholder", lang)} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("audience.industry_niche", lang)}</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder={t("audience.industry_placeholder", lang)} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">{t("audience.ideal_customer", lang)}</label>
            <textarea value={idealCustomer} onChange={(e) => setIdealCustomer(e.target.value)} placeholder={t("audience.ideal_placeholder", lang)} rows={4} required className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 outline-none transition-colors focus:border-[#00F0FF]/50" />
          </div>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] disabled:opacity-50">
            <Users className="h-4 w-4" />
            {loading ? t("audience.analyzing", lang) : t("audience.build_persona", lang)}
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
          <p className="mt-4 text-sm text-[#94A3B8]">{t("audience.ai_building", lang)}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20"><UserCircle className="h-6 w-6 text-[#00F0FF]" /></div>
              <div><h2 className="text-lg font-bold text-[#F8FAFC]">{personaName}</h2><p className="text-sm text-[#94A3B8]">{industry}</p></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Users className="h-5 w-5 text-[#00F0FF]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.demographics", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.demographics}</p>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Brain className="h-5 w-5 text-[#8B5CF6]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.psychographics", lang)}</h3></div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">{result.psychographics}</p>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><AlertCircle className="h-5 w-5 text-red-400" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.pain_points", lang)}</h3></div>
            <ul className="space-y-2">{result.pain_points.map((point, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />{point}</li>))}</ul>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Heart className="h-5 w-5 text-[#10B981]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.desires", lang)}</h3></div>
            <ul className="space-y-2">{result.desires.map((desire, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#10B981]" />{desire}</li>))}</ul>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[#F59E0B]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.objections", lang)}</h3></div>
            <ul className="space-y-2">{result.objections.map((obj, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#F59E0B]" />{obj}</li>))}</ul>
          </div>

          <div className="rounded-xl border border-[#1E1E2E] bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2"><Flame className="h-5 w-5 text-[#8B5CF6]" /><h3 className="text-sm font-semibold text-[#F8FAFC]">{t("audience.emotional_triggers", lang)}</h3></div>
            <ul className="space-y-2">{result.emotional_triggers.map((trigger, i) => (<li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8B5CF6]" />{trigger}</li>))}</ul>
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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#00F0FF]/10 to-[#8B5CF6]/10"><Users className="h-7 w-7 text-[#00F0FF]" /></div>
          <h3 className="mt-4 text-lg font-semibold text-[#F8FAFC]">{t("audience.empty_title", lang)}</h3>
          <p className="mt-1 text-sm text-[#94A3B8]">{t("audience.empty_desc", lang)}</p>
          <button onClick={() => setShowForm(true)} className="mt-5 flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:shadow-[0_0_24px_rgba(0,240,255,0.3)]">
            <Plus className="h-4 w-4" /> {t("audience.build_persona", lang)}
          </button>
        </div>
      )}
    </div>
  );
}
