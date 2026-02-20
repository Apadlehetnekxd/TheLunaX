"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type LanguageCode, translations } from "./translations"

type LanguageContextType = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("lunax-lang") : null
    if (stored && stored in translations) {
      setLanguageState(stored as LanguageCode)
    }
    setIsHydrated(true)
  }, [])

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lunax-lang", lang)
    }
  }, [])

  const t = useCallback(
    (key: string): string => {
      const lang = isHydrated ? language : "en"
      return translations[lang]?.[key] ?? translations.en[key] ?? key
    },
    [language, isHydrated]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
