"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { language: lang } = useLanguage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError(t("auth.access_denied", lang));
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="space-y-8">
      {/* Admin Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/20">
          <Shield className="h-6 w-6 text-[#F59E0B]" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
        </div>
        <div className="text-center">
          <span className="text-xl font-bold tracking-tight">
            FOUNDERA <span className="text-[#F59E0B]">ADMIN</span>
          </span>
          <p className="mt-1 text-xs text-[#94A3B8]">{t("auth.admin_subtitle", lang)}</p>
        </div>
      </div>

      {/* Card */}
      <div className="glass-card rounded-2xl p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-[#F8FAFC]">
          {t("auth.admin_access", lang)}
        </h1>
        <p className="mb-8 text-center text-sm text-[#94A3B8]">
          {t("auth.admin_credentials", lang)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-[#94A3B8]"
            >
              {t("auth.email", lang)}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#F59E0B]/50 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/30"
                placeholder="admin@foundera.biz"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-[#94A3B8]"
            >
              {t("auth.password", lang)}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] py-2.5 pl-10 pr-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#F59E0B]/50 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#EF4444] py-3 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              t("auth.verifying", lang)
            ) : (
              <>
                {t("auth.access_admin", lang)} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-[#94A3B8]">
        {t("auth.unauthorized_notice", lang)}
      </p>
    </div>
  );
}
