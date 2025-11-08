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
        // Log error for debugging
        if (error instanceof Error) {
          if (error.message.includes("denied") || error.message.includes("permission")) {
            console.log("User denied geolocation permission")
          } else if (error.message.includes("timeout")) {
            console.warn("Geolocation request timed out")
          } else {
            console.error("Error getting user location:", error.message)
          }
        } else {
          console.error("Error getting user location:", error)
        }
        // Reset ref so we can retry later
        hasRequestedRef.current = false
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

