import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EatIT",
  description: "Ứng dụng giúp bạn tìm kiếm và đánh giá địa điểm ăn uống",
  generator: "v0.app",
  icons: {
    icon: "/Button2.png",
    shortcut: "/Button2.png",
    apple: "/Button2.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        {/* External AI Chatbot Integration */}
        <script
          src="https://ai.chatbotviet.com/api/chatbot.js?chatbotId=agent_94e296dbeaaa84ee&button=20&right=20"
          defer
        />
      </body>
    </html>
  )
}
