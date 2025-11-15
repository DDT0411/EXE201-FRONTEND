"use client"

import { useEffect, useRef } from "react"
import { calculateHaversineDistance, getCurrentLocation, type Location } from "@/lib/google-maps"
import { updateUserLocation } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

const SIGNIFICANT_DISTANCE_KM = 0.1 // ~100m
const FORCE_SYNC_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const MIN_TIME_BETWEEN_SYNC_MS = 30 * 1000 // 30 seconds
const MANUAL_RETRY_DELAY_MS = 15 * 1000 // 15 seconds

export function GeolocationRequest() {
  const { isAuthenticated, token, user } = useAuth()
  const isSyncingRef = useRef(false)
  const lastLocationRef = useRef<Location | null>(null)
  const lastUpdateRef = useRef(0)
  const permissionDeniedRef = useRef(false)
  const watchIdRef = useRef<number | null>(null)
  const manualRetryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stopTracking = () => {
      if (typeof window !== "undefined" && "geolocation" in navigator && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      if (manualRetryTimeoutRef.current) {
        clearTimeout(manualRetryTimeoutRef.current)
        manualRetryTimeoutRef.current = null
      }
    }

    const handlePermissionDenied = () => {
      permissionDeniedRef.current = true
      stopTracking()
    }

    const scheduleManualRetry = (
      syncLocation: (options?: { location?: Location; force?: boolean }) => Promise<boolean>
    ) => {
      if (manualRetryTimeoutRef.current) {
        return
      }

      manualRetryTimeoutRef.current = setTimeout(() => {
        manualRetryTimeoutRef.current = null
        syncLocation({ force: true }).catch(() => {
          // Errors are handled inside syncLocation
        })
      }, MANUAL_RETRY_DELAY_MS)
    }

    const handleSyncError = (
      error: unknown,
      syncLocation: (options?: { location?: Location; force?: boolean }) => Promise<boolean>
    ) => {
      if (error && typeof error === "object" && "code" in error) {
        const errorCode = (error as any).code
        if (errorCode === 1) {
          handlePermissionDenied()
          return
        }
        if (errorCode === 2) {
          console.warn("Geolocation: Position unavailable")
          scheduleManualRetry(syncLocation)
          return
        }
        if (errorCode === 3) {
          console.warn("Geolocation: Request timed out")
          scheduleManualRetry(syncLocation)
          return
        }
      }

      if (error instanceof Error && error.message) {
        const lower = error.message.toLowerCase()
        if (lower.includes("not supported") || lower.includes("not available")) {
          console.warn("Geolocation: Not supported on this device")
          handlePermissionDenied()
          return
        }
        console.warn("Geolocation error:", error.message)
      }
    }

    const handleWatchError = (
      error: GeolocationPositionError,
      syncLocation: (options?: { location?: Location; force?: boolean }) => Promise<boolean>
    ) => {
      if (error.code === error.PERMISSION_DENIED) {
        handlePermissionDenied()
        return
      }

      if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
        console.warn("Geolocation watch error:", error.message)
        scheduleManualRetry(syncLocation)
        return
      }

      console.warn("Geolocation watch error:", error.message)
    }

    if (!isAuthenticated || !token || !user) {
      stopTracking()
      return
    }

    permissionDeniedRef.current = false

    const syncLocation = async ({ location, force = false }: { location?: Location; force?: boolean } = {}) => {
      if (!token || permissionDeniedRef.current || isSyncingRef.current) {
        return false
      }

      try {
        isSyncingRef.current = true

        const resolvedLocation = location ?? (await getCurrentLocation())
        const now = Date.now()
        const lastLocation = lastLocationRef.current
        const lastUpdate = lastUpdateRef.current

        const timeSinceLastUpdate = now - lastUpdate
        const movedDistance = lastLocation ? calculateHaversineDistance(lastLocation, resolvedLocation) : Infinity

        let shouldSync = force || !lastLocation

        if (lastLocation) {
          if (movedDistance >= SIGNIFICANT_DISTANCE_KM) {
            shouldSync = true
          } else if (timeSinceLastUpdate >= FORCE_SYNC_INTERVAL_MS) {
            shouldSync = true
          }
        }

        if (!force && lastLocation && timeSinceLastUpdate < MIN_TIME_BETWEEN_SYNC_MS) {
          shouldSync = false
        }

        if (!shouldSync) {
          return false
        }

        const success = await updateUserLocation(
          {
            userLatitude: resolvedLocation.lat,
            userLongitude: resolvedLocation.lng,
          },
          token
        )

        if (success) {
          lastLocationRef.current = resolvedLocation
          lastUpdateRef.current = now

          if (typeof window !== "undefined") {
            localStorage.setItem("lastLocationLat", resolvedLocation.lat.toString())
            localStorage.setItem("lastLocationLng", resolvedLocation.lng.toString())
            localStorage.setItem("lastLocationSyncedAt", now.toString())
          }
        } else {
          console.warn("Failed to update user location on server - token may be expired or backend may reject the update")
        }

        return success
      } catch (error) {
        handleSyncError(error, syncLocation)
        return false
      } finally {
        isSyncingRef.current = false
      }
    }

    const startTracking = async () => {
      await syncLocation({ force: true })

      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        console.warn("Geolocation is not supported by this browser")
        return
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          syncLocation({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        (error) => handleWatchError(error, syncLocation),
        {
          enableHighAccuracy: true,
          maximumAge: 10_000,
          timeout: 15_000,
        }
      )
    }

    startTracking()

    return () => {
      stopTracking()
    }
  }, [isAuthenticated, token, user])

  return null
}

