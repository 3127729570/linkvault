// Language state management hook for LinkVault

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/lib/i18n";

type LanguageStore = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLanguage: () => void;
};

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      lang: "zh",
      setLang: (lang: Lang) => set({ lang }),
      toggleLanguage: () => set({ lang: get().lang === "zh" ? "en" : "zh" }),
    }),
    {
      name: "linkvault-language",
    }
  )
);

export function useLanguage() {
  const { lang, setLang, toggleLanguage } = useLanguageStore();
  return { lang, setLang, toggleLanguage };
}