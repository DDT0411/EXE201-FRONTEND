"use client"

import InteractiveMap, { Marker } from '@goongmaps/goong-map-react'
import { MapPin } from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react"
import '@goongmaps/goong-js/dist/goong-js.css'

interface ViewState {
  longitude: number
  latitude: number
  zoom: number
  bearing?: number
  pitch?: number
}

const defaultCenter = {
  latitude: 10.8231, // Ho Chi Minh City coordinates as default
  longitude: 106.6297,
}

const defaultZoom = 17 // Increased zoom for better detail

interface RestaurantMapProps {
  latitude?: number
  longitude?: number
  restaurantName?: string
  restaurantAddress?: string
}

export function RestaurantMap({ latitude, longitude, restaurantName, restaurantAddress }: RestaurantMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOONG_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOONG_MAPS_KEY || ""
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMounted, setIsMounted] = useState(false)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  
  // Initialize viewState with restaurant coordinates if available, otherwise use default
  const initialLat = (latitude != null && !isNaN(latitude)) ? latitude : defaultCenter.latitude
  const initialLng = (longitude != null && !isNaN(longitude)) ? longitude : defaultCenter.longitude
  
  const [viewState, setViewState] = useState<ViewState>({
    latitude: initialLat,
    longitude: initialLng,
    zoom: defaultZoom,
    bearing: 0,
    pitch: 0,
  })

  // Update viewState when latitude/longitude change - Force update to ensure map centers correctly
  useEffect(() => {
    if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      const restaurantLat = Number(latitude)
      const restaurantLng = Number(longitude)
      
      console.log("RestaurantMap: Setting restaurant location:", { latitude: restaurantLat, longitude: restaurantLng })
      
      // Immediately update viewState to center map on restaurant
      setViewState({
        latitude: restaurantLat,
        longitude: restaurantLng,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0,
      })
      
      console.log("RestaurantMap: ViewState updated to center on restaurant:", { 
        latitude: restaurantLat, 
        longitude: restaurantLng, 
        zoom: defaultZoom 
      })
    } else {
      console.warn("RestaurantMap: Invalid coordinates:", { latitude, longitude })
    }
  }, [latitude, longitude])
  

  // Store map instance when it loads
  const handleMapLoad = useCallback((event: any) => {
    const map = event.target
    if (map) {
      // Get the underlying Goong Maps instance
      const goongMap = map.getMap ? map.getMap() : map
      mapRef.current = goongMap
      console.log("✅ Map instance stored")
      
      // Ensure map is centered on restaurant location
      if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
        const restaurantLat = Number(latitude)
        const restaurantLng = Number(longitude)
        
        // Force map to center on restaurant using setCenter (more reliable than flyTo)
        try {
          if (goongMap.setCenter) {
            goongMap.setCenter([restaurantLng, restaurantLat])
          }
          if (goongMap.setZoom) {
            goongMap.setZoom(defaultZoom)
          }
          console.log("✅ Map centered on restaurant:", { lat: restaurantLat, lng: restaurantLng })
        } catch (error) {
          console.warn("Failed to center map:", error)
        }
      }
      
      setMapLoaded(true)
      console.log("✅ Map fully loaded and ready")
    }
  }, [latitude, longitude])

  // Recenter map when coordinates change after load
  useEffect(() => {
    if (mapRef.current && latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      try {
        mapRef.current.setCenter([Number(longitude), Number(latitude)])
      } catch (error) {
        console.warn("Failed to recenter map:", error)
      }
    }
  }, [latitude, longitude])

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const width = rect.width || 800
        const height = rect.height || 600
        if (width > 0 && height > 0) {
          setDimensions({ width, height })
          setIsMounted(true)
        }
      }
    }

    // Initial update
    updateDimensions()
    
    // Use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(updateDimensions, 0)
    
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [])

  const onViewStateChange = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState)
  }, [])

  const getCursor = useCallback(({ isDragging, isHovering }: { isDragging: boolean; isHovering: boolean }) => {
    if (isDragging) return "grabbing"
    if (isHovering) return "pointer"
    return "grab"
  }, [])

  const onResize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      setDimensions({ width, height })
    }
  }, [])

  // Transition callbacks to prevent errors
  const onTransitionStart = useCallback(() => {}, [])
  const onTransitionInterrupt = useCallback(() => {}, [])
  const onTransitionEnd = useCallback(() => {}, [])

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <MapPin className="mx-auto mb-2 text-gray-400" size={32} />
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Goong Maps API key chưa được cấu hình
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

  // Handle map load errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("403") || event.message?.includes("tiles.goong.io") || 
          event.filename?.includes("tiles.goong.io")) {
        setMapLoadError("Map tiles API key bị chặn bởi URL restrictions")
      }
    }
    
    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  // Don't render map until dimensions are calculated
  if (!isMounted || dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div ref={containerRef} className="w-full h-full relative rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto mb-2 text-gray-400 animate-pulse" size={32} />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }

  // Show error if map tiles failed to load
  if (mapLoadError) {
    return (
      <div ref={containerRef} className="w-full h-full relative rounded-lg overflow-hidden shadow-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <MapPin className="mx-auto mb-2 text-red-400" size={32} />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-2">
            Không thể tải bản đồ
          </p>
          <p className="text-red-600 dark:text-red-400 text-xs mb-2">
            {mapLoadError}
          </p>
          <div className="text-red-600 dark:text-red-400 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded mt-2">
            <p className="font-medium mb-1">Hướng dẫn khắc phục:</p>
            <p>1. Vào Goong Maps Dashboard</p>
            <p>2. Chọn Map Tiles Key của bạn</p>
            <p>3. Thêm URL restrictions:</p>
            <p className="ml-2">• http*://localhost:3000/*</p>
            <p className="ml-2">• http*://*.vercel.app/*</p>
            <p className="ml-2">• http*://eatit-two.vercel.app/*</p>
          </div>
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

  // Use key to force re-render when coordinates change significantly
  const mapKey = latitude && longitude ? `map-${latitude.toFixed(6)}-${longitude.toFixed(6)}` : 'map-default'
  
  // Calculate initial center - ensure it's always the restaurant location if available
  const mapCenter = (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) 
    ? { latitude: Number(latitude), longitude: Number(longitude) }
    : defaultCenter

  return (
    <div ref={containerRef} className="w-full h-full relative rounded-lg overflow-hidden shadow-lg">
      <InteractiveMap
        key={mapKey}
        {...viewState}
        onViewStateChange={onViewStateChange}
        onLoad={handleMapLoad}
        getCursor={getCursor}
        onResize={onResize}
        onTransitionStart={onTransitionStart}
        onTransitionInterrupt={onTransitionInterrupt}
        onTransitionEnd={onTransitionEnd}
        width={dimensions.width}
        height={dimensions.height}
        mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
        goongApiAccessToken={apiKey}
        touchAction="none"
      >
        {/* Restaurant marker */}
        {mapLoaded && latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude) && (
          <Marker
            key={`restaurant-${Number(latitude).toFixed(6)}-${Number(longitude).toFixed(6)}`}
            longitude={Number(longitude)}
            latitude={Number(latitude)}
            offsetLeft={-24}
            offsetTop={-24}
          >
            <div
              className="relative pointer-events-auto"
              role="img"
              aria-label={`Marker for ${restaurantName || 'restaurant'}`}
            >
              <div className="w-12 h-12 rounded-full bg-orange-600 border-4 border-white shadow-2xl flex items-center justify-center">
                <MapPin className="text-white" size={28} fill="currentColor" aria-hidden="true" />
              </div>
              <div className="absolute inset-0 w-12 h-12 bg-orange-600 rounded-full animate-ping opacity-75" aria-hidden="true" />
              {restaurantName && (
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-orange-600 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap max-w-[200px] truncate shadow-lg font-medium pointer-events-none"
                  role="tooltip"
                >
                  {restaurantName}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-orange-600" />
                </div>
              )}
            </div>
          </Marker>
        )}
      </InteractiveMap>
    </div>
  )
}

