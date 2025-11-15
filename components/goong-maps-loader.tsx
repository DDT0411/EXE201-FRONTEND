"use client"

import Script from "next/script"
import { useEffect } from "react"

export function GoongMapsLoader() {
  useEffect(() => {
    // Check for Goong JS after script loads
    const checkGoongJS = () => {
      if (typeof window === 'undefined') return
      
      // Check multiple possible ways Goong JS might be exposed
      const goongjs = (window as any).goongjs || (window as any).goong || (window as any).Goong
      
      if (goongjs) {
        console.log("✅ Goong Maps JS API detected:", {
          hasMarker: !!goongjs.Marker,
          hasMap: !!goongjs.Map,
          keys: Object.keys(goongjs).slice(0, 10)
        })
        
        // Ensure it's available as window.goongjs
        if (!(window as any).goongjs) {
          (window as any).goongjs = goongjs
        }
        
        ;(window as any).__GOONG_JS_LOADED__ = true
        return true
      }
      return false
    }

    // Check immediately
    if (checkGoongJS()) return

    // Set up interval to check
    const interval = setInterval(() => {
      if (checkGoongJS()) {
        clearInterval(interval)
      }
    }, 100)

    // Cleanup after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Script
      id="goong-maps-js"
      src="https://cdn.goong.io/goong-js/v2.1.0/goong-js.js"
      strategy="beforeInteractive"
      onLoad={() => {
        console.log("✅ Goong Maps JS script loaded from CDN")
        if (typeof window !== 'undefined') {
          // Give it a moment to initialize
          setTimeout(() => {
            const goongjs = (window as any).goongjs || (window as any).goong || (window as any).Goong
            if (goongjs) {
              console.log("✅ Goong Maps JS API initialized")
              if (!(window as any).goongjs) {
                (window as any).goongjs = goongjs
              }
              ;(window as any).__GOONG_JS_LOADED__ = true
            } else {
              console.warn("⚠️ Script loaded but Goong JS API not found. Checking window object...")
              console.log("Window keys containing 'goong':", Object.keys(window).filter(k => k.toLowerCase().includes('goong')))
            }
          }, 500)
        }
      }}
      onError={(e) => {
        console.error("❌ Failed to load Goong Maps JS script:", e)
      }}
    />
  )
}

