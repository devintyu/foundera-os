"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Language } from "./language-detector";

const STORAGE_KEY = "foundera-language";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(STORAGE_KEY) as Language) || "en";
}

export function useLanguage(): {
  language: Language;
  setLanguage: (lang: Language) => void;
} {
  const [language, setLang] = useState<Language>("en");

  useEffect(() => {
    const stored = getStoredLanguage();
    setLang(stored);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("profiles")
        .select("preferred_language")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.preferred_language) {
            const dbLang = data.preferred_language as Language;
            if (dbLang !== stored) {
              localStorage.setItem(STORAGE_KEY, dbLang);
              setLang(dbLang);
            }
          }
        });
    });
  }, []);

  const setLanguage = (newLang: Language) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLang(newLang);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .update({ preferred_language: newLang })
          .eq("id", user.id)
          .then(() => {});
      }
    });

    window.location.reload();
  };

  return { language, setLanguage };
}
