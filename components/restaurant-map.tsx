"use client"

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api"
import { MapPin } from "lucide-react"
import { useState, useCallback } from "react"

const defaultCenter = {
  lat: 10.8231, // Ho Chi Minh City coordinates as default
  lng: 106.6297,
}

const defaultZoom = 15

interface RestaurantMapProps {
  latitude?: number
  longitude?: number
  restaurantName?: string
  restaurantAddress?: string
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

export function RestaurantMap({ latitude, longitude, restaurantName, restaurantAddress }: RestaurantMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // Using provided Google Maps API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  })

  const center = latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (loadError || !apiKey) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {!apiKey ? "Google Maps API key chưa được cấu hình" : "Không thể tải bản đồ"}
          </p>
          {(restaurantName || restaurantAddress) && (
            <div className="mt-4 text-left bg-white dark:bg-slate-800 rounded-lg p-3">
              {restaurantName && (
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{restaurantName}</p>
              )}
              {restaurantAddress && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{restaurantAddress}</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            Đang tải bản đồ...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={defaultZoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "on" }],
            },
          ],
        }}
      >
        {(latitude && longitude) && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            title={restaurantName || "Vị trí quán ăn"}
          />
        )}
      </GoogleMap>
      
      {/* Map info overlay */}
      {(restaurantName || restaurantAddress) && (
        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-2">
            <MapPin className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1 min-w-0">
              {restaurantName && (
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{restaurantName}</p>
              )}
              {restaurantAddress && (
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{restaurantAddress}</p>
              )}
              {(!latitude || !longitude) && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Vị trí sẽ được cập nhật sớm
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
