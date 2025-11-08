// Goong Maps utility functions

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
      (error) => {
        reject(error)
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

// Open Goong Maps with directions
export function openGoongMapsDirections(destination: Location, origin?: Location) {
  const goongMapsKey = process.env.NEXT_PUBLIC_GOONG_MAPS_KEY
  
  const destinationStr = `${destination.lat},${destination.lng}`
  const originStr = origin ? `${origin.lat},${origin.lng}` : ""

  let url = `https://map.goong.io/`
  if (originStr) {
    url += `?api_key=${goongMapsKey}&origin=${originStr}&destination=${destinationStr}`
  } else {
    url += `?api_key=${goongMapsKey}&destination=${destinationStr}`
  }

  window.open(url, "_blank")
}

// Get Goong Maps API key
export function getGoongMapsApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_GOONG_MAPS_KEY
  if (!apiKey) {
    throw new Error("Goong Maps API key is not configured")
  }
  return apiKey
}

// Load Goong Maps script
export function loadGoongMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.goongjs) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = `https://cdn.goong.io/goong-js/v2/goong-js.js?api_key=${getGoongMapsApiKey()}`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Goong Maps script"))
    document.head.appendChild(script)
  })
}