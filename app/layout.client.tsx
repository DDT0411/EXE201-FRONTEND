"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { useTheme } from "@/hooks/use-theme"
import { useEffect } from "react"

export function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { theme, mounted } = useTheme()

  useEffect(() => {
    if (mounted) {
      const html = document.documentElement
      if (theme === "auto") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        html.classList.toggle("dark", isDark)
      } else {
        html.classList.toggle("dark", theme === "dark")
      }
    }
  }, [theme, mounted])

  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
