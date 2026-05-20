"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Mail,
  Building2,
  Target,
  Save,
  LogOut,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { language: lang } = useLanguage();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState("");
  const [founderStage, setFounderStage] = useState("explorer");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setIndustry(profile.industry || "");
      setFounderStage(profile.founder_stage || "explorer");
    } else if (user) {
      setFullName((user.user_metadata?.full_name as string) || "");
    }
  }, [profile, user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ full_name: fullName, industry, founder_stage: founderStage })
      .eq("id", user.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const stages = [
    { value: "explorer", label: t("stages.explorer", lang), desc: t("settings.explorer_desc", lang) },
    { value: "builder", label: t("stages.builder", lang), desc: t("settings.builder_desc", lang) },
    { value: "operator", label: t("stages.operator", lang), desc: t("settings.operator_desc", lang) },
    { value: "scaler", label: t("stages.scaler", lang), desc: t("settings.scaler_desc", lang) },
    { value: "owner", label: t("stages.owner", lang), desc: t("settings.owner_desc", lang) },
  ];

  if (userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E1E2E] border-t-[#00F0FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 pb-24 lg:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC]">{t("settings.title", lang)}</h1>
        <p className="mt-1 text-[#94A3B8]">{t("settings.subtitle", lang)}</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-lg font-semibold text-[#F8FAFC]">{t("settings.profile", lang)}</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <User className="h-4 w-4" /> {t("settings.full_name", lang)}
              </label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00F0FF]/50 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/30"
                placeholder={t("settings.name_placeholder", lang)} />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <Mail className="h-4 w-4" /> {t("settings.email", lang)}
              </label>
              <input type="email" disabled value={user?.email || ""}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F]/50 px-4 py-2.5 text-sm text-[#94A3B8] opacity-60" />
              <p className="mt-1 text-xs text-[#94A3B8]">{t("settings.email_note", lang)}</p>
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
                <Building2 className="h-4 w-4" /> {t("settings.industry", lang)}
              </label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:border-[#00F0FF]/50 focus:outline-none focus:ring-1 focus:ring-[#00F0FF]/30"
                placeholder={t("settings.industry_placeholder", lang)} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-[#F8FAFC]">
            <Target className="h-5 w-5 text-[#00F0FF]" /> {t("settings.founder_stage", lang)}
          </h2>
          <p className="mb-4 text-sm text-[#94A3B8]">{t("settings.stage_question", lang)}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => (
              <button key={stage.value} type="button" onClick={() => setFounderStage(stage.value)}
                className={`rounded-xl border p-4 text-left transition-all ${founderStage === stage.value ? "border-[#00F0FF]/40 bg-[#00F0FF]/10" : "border-[#1E1E2E] bg-[#12121A]/80 hover:border-[#1E1E2E]/80"}`}>
                <p className={`text-sm font-semibold ${founderStage === stage.value ? "text-[#00F0FF]" : "text-[#F8FAFC]"}`}>{stage.label}</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">{stage.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-50">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? t("settings.saving", lang) : saved ? t("settings.saved", lang) : t("settings.save_changes", lang)}
          </button>
          <button type="button" onClick={handleLogout} disabled={loggingOut}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50">
            <LogOut className="h-4 w-4" />
            {loggingOut ? t("settings.logging_out", lang) : t("settings.log_out", lang)}
          </button>
        </div>
      </form>
    </div>
  );
}
