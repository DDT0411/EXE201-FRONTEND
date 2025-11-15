import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { GeolocationRequest } from "@/components/geolocation-request"
import { GoongMapsLoader } from "@/components/goong-maps-loader"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

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
      <head>
        {/* Goong Maps CSS - Must be in Server Component */}
        <link
          href="https://cdn.goong.io/goong-js/v2.1.0/goong-js.css"
          rel="stylesheet"
        />
      </head>
      <body className={`font-sans antialiased`}>
        {/* Goong Maps JS - Loaded via Client Component */}
        <GoongMapsLoader />
        <GeolocationRequest />
        {children}
        <SonnerToaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
