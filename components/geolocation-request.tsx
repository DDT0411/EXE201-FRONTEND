"use client"

import { useEffect } from "react"
import { getCurrentLocation } from "@/lib/google-maps"
import { updateUserLocation } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export function GeolocationRequest() {
  const { isAuthenticated, token, user } = useAuth()

  useEffect(() => {
    // Only request geolocation if user is authenticated
    if (!isAuthenticated || !token || !user) {
      return
    }

    const requestLocation = async () => {
      try {
        const location = await getCurrentLocation()
        
        // Update user location on the server
        await updateUserLocation(
          {
            userLatitude: location.lat,
            userLongitude: location.lng,
          },
          token
        )

        console.log("User location updated successfully:", location)
      } catch (error) {
        // Silently fail - location update is optional
        // User might have denied permission or backend might not support it yet
      }
    }

    // Request location once when component mounts
    requestLocation()
  }, [isAuthenticated, token, user])

  return null // This component doesn't render anything
}

