import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { GeolocationRequest } from "@/components/geolocation-request"

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
        <GeolocationRequest />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
