// Google Maps utility functions

export interface Location {
  lat: number
  lng: number
}

// Get user's current location using browser geolocation API
export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error: GeolocationPositionError) => {
        // Convert GeolocationPositionError to a more descriptive Error
        const errorMessages: Record<number, string> = {
          1: "User denied geolocation permission",
          2: "Position unavailable - could not determine location",
          3: "Request timeout - location request took too long"
        }
        
        const errorMessage = errorMessages[error.code] || error.message || "Failed to get location"
        const finalError = new Error(errorMessage)
        
        // Preserve the original error code if needed
        ;(finalError as any).code = error.code
        
        reject(finalError)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

// Calculate distance between two points using Haversine formula (in km)
export function calculateHaversineDistance(origin: Location, destination: Location): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(destination.lat - origin.lat)
  const dLon = toRad(destination.lng - origin.lng)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(origin.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

// Convert degrees to radians
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Format distance to readable string
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`
  } else if (distanceInKm < 10) {
    return `${distanceInKm.toFixed(1)} km`
  } else {
    return `${Math.round(distanceInKm)} km`
  }
}

// Open Google Maps with directions
export function openGoogleMapsDirections(destination: Location, origin?: Location) {
  const destinationStr = `${destination.lat},${destination.lng}`
  const originStr = origin ? `${origin.lat},${origin.lng}` : ""

  let url = `https://www.google.com/maps/dir/`
  if (originStr) {
    url += `${originStr}/${destinationStr}`
  } else {
    url += destinationStr
  }

  window.open(url, "_blank")
}
