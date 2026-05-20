"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import type { Language } from "@/lib/i18n/language-detector";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onChangeLanguage: (lang: Language) => void;
}

export default function LanguageSwitcher({
  currentLanguage,
  onChangeLanguage,
}: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setOpen(false);
    if (lang !== currentLanguage) {
      onChangeLanguage(lang);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-[#94A3B8] transition-colors hover:bg-[#1E1E2E] hover:text-[#F8FAFC]"
      >
        <Globe className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">
          {currentLanguage === "zh" ? "中文" : "EN"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg border border-[#1E1E2E] bg-[#12121A] py-1 shadow-xl">
          <button
            type="button"
            onClick={() => handleSelect("en")}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#1E1E2E] ${
              currentLanguage === "en"
                ? "text-[#00F0FF]"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleSelect("zh")}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-[#1E1E2E] ${
              currentLanguage === "zh"
                ? "text-[#00F0FF]"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            中文
          </button>
        </div>
      )}
    </div>
  );
}
