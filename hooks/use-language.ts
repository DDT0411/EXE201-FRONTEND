"use client"

import { useState, useEffect } from "react"
import { type Language, defaultLanguage } from "@/lib/i18n"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("language") as Language | null
    if (saved) {
      setLanguage(saved)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return { language, changeLanguage, mounted }
}
