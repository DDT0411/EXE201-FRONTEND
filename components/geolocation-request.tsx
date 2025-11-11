"use client"

import { useEffect, useRef } from "react"
import { getCurrentLocation } from "@/lib/google-maps"
import { updateUserLocation } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export function GeolocationRequest() {
  const { isAuthenticated, token, user } = useAuth()
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    // Only request geolocation if user is authenticated
    if (!isAuthenticated || !token || !user) {
      return
    }

    // Prevent multiple requests
    if (hasRequestedRef.current) {
      return
    }

    const requestLocation = async () => {
      try {
        hasRequestedRef.current = true
        
        const location = await getCurrentLocation()
        
        console.log("Got user location:", location)
        
        // Update user location on the server
        const success = await updateUserLocation(
          {
            userLatitude: location.lat,
            userLongitude: location.lng,
          },
          token
        )

        if (success) {
          console.log("User location updated successfully:", location)
        } else {
          console.warn("Failed to update user location on server")
        }
      } catch (error) {
        // Handle errors silently for common cases
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase()
          const errorCode = (error as any).code
          
          // Handle based on error code first (most reliable)
          if (errorCode === 1) {
            // Permission denied - this is expected, don't log as error
            // Don't reset ref, so we don't keep retrying
            return
          } else if (errorCode === 2) {
            // Position unavailable
            console.warn("Geolocation: Position unavailable")
            hasRequestedRef.current = false
          } else if (errorCode === 3) {
            // Timeout
            console.warn("Geolocation: Request timed out")
            hasRequestedRef.current = false
          } else if (errorMessage.includes("denied") || errorMessage.includes("permission")) {
            // User denied permission - this is expected
            return
          } else if (errorMessage.includes("timeout")) {
            // Timeout - user might be in area with poor GPS signal
            console.warn("Geolocation: Request timed out")
            hasRequestedRef.current = false
          } else if (errorMessage.includes("not available") || errorMessage.includes("not supported")) {
            // Geolocation not available - device doesn't support it
            console.warn("Geolocation: Not available on this device")
            // Don't retry if not supported
            return
          } else if (errorMessage.trim() !== "") {
            // Only log if there's an actual error message
            console.warn("Geolocation error:", error.message)
            hasRequestedRef.current = false
          } else {
            // Silent fail for empty errors
            return
          }
        } else {
          // Silent fail for non-Error objects
          return
        }
      }
    }

    // Request location once when component mounts
    // Add a small delay to ensure auth is fully initialized
    const timeoutId = setTimeout(() => {
      requestLocation()
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isAuthenticated, token, user])

  return null // This component doesn't render anything
}

