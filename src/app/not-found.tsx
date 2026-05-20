"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n/use-language";
import { t } from "@/lib/i18n/language-detector";

export default function NotFound() {
  const { language: lang } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00F0FF]/20 to-[#8B5CF6]/20">
            <Zap className="h-8 w-8 text-[#00F0FF]" />
          </div>
        </div>
        <h1 className="mb-2 text-6xl font-bold text-[#F8FAFC]">404</h1>
        <p className="mb-8 text-lg text-[#94A3B8]">
          {t("not_found.message", lang)}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-[#0A0A0F] transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("not_found.back_home", lang)}
        </Link>
      </div>
    </div>
  );
}
