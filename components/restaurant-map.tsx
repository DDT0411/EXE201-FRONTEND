"use client"

import InteractiveMap, { Marker, Source, Layer } from '@goongmaps/goong-map-react'
import { MapPin, Navigation, X } from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react"
import '@goongmaps/goong-js/dist/goong-js.css'
import { getDirections, DirectionsResponse, getUserLocation } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"

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

const defaultZoom = 15

interface RestaurantMapProps {
  latitude?: number
  longitude?: number
  restaurantName?: string
  restaurantAddress?: string
}

export function RestaurantMap({ latitude, longitude, restaurantName, restaurantAddress }: RestaurantMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOONG_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOONG_MAPS_KEY || ""
  const { token, isAuthenticated } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMounted, setIsMounted] = useState(false)
  
  // Directions state
  const [showDirections, setShowDirections] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [route, setRoute] = useState<DirectionsResponse | null>(null)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)
  const [directionsInfo, setDirectionsInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [mapLoadError, setMapLoadError] = useState<string | null>(null)
  
  const [viewState, setViewState] = useState<ViewState>({
    latitude: latitude || defaultCenter.latitude,
    longitude: longitude || defaultCenter.longitude,
    zoom: defaultZoom,
    bearing: 0,
    pitch: 0,
  })

  // Update viewState when latitude/longitude change - Force update to ensure map centers correctly
  useEffect(() => {
    if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      console.log("RestaurantMap: Setting restaurant location:", { latitude, longitude })
      setViewState({
        latitude,
        longitude,
        zoom: defaultZoom,
        bearing: 0,
        pitch: 0,
      })
    }
  }, [latitude, longitude])

  // Fetch user location when authenticated
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!isAuthenticated || !token) {
        return
      }
      
      try {
        const location = await getUserLocation(token)
        if (location.userLatitude && location.userLongitude) {
          setUserLocation({
            lat: location.userLatitude,
            lng: location.userLongitude,
          })
        }
      } catch (error) {
        console.warn("Failed to fetch user location:", error)
      }
    }
    
    fetchUserLocation()
  }, [isAuthenticated, token])

  // Fetch directions when showDirections is enabled
  useEffect(() => {
    const fetchDirections = async () => {
      if (!showDirections || !userLocation || !latitude || !longitude) {
        return
      }

      setIsLoadingDirections(true)
      try {
        console.log("Fetching directions from:", userLocation, "to:", { lat: latitude, lng: longitude })
        const directions = await getDirections(
          userLocation,
          { lat: latitude, lng: longitude },
          "car"
        )
        
        console.log("Directions received:", directions)
        setRoute(directions)
        
        // Extract distance and duration info
        if (directions.routes && directions.routes.length > 0) {
          const firstRoute = directions.routes[0]
          if (firstRoute.legs && firstRoute.legs.length > 0) {
            const leg = firstRoute.legs[0]
            setDirectionsInfo({
              distance: leg.distance?.text || "N/A",
              duration: leg.duration?.text || "N/A",
            })
          }
        }

        // Fit bounds to show both user location and restaurant
        if (userLocation && latitude && longitude) {
          const minLat = Math.min(userLocation.lat, latitude)
          const maxLat = Math.max(userLocation.lat, latitude)
          const minLng = Math.min(userLocation.lng, longitude)
          const maxLng = Math.max(userLocation.lng, longitude)
          
          const centerLat = (minLat + maxLat) / 2
          const centerLng = (minLng + maxLng) / 2
          
          // Calculate zoom level based on bounds
          const latDiff = maxLat - minLat
          const lngDiff = maxLng - minLng
          const maxDiff = Math.max(latDiff, lngDiff)
          let zoom = 15
          if (maxDiff > 0.1) zoom = 12
          else if (maxDiff > 0.05) zoom = 13
          else if (maxDiff > 0.02) zoom = 14
          
          setViewState(prev => ({
            ...prev,
            latitude: centerLat,
            longitude: centerLng,
            zoom,
          }))
        }
      } catch (error) {
        console.error("Failed to fetch directions:", error)
        let errorMessage = "Không thể lấy chỉ đường"
        
        if (error instanceof Error) {
          errorMessage = error.message
          // Provide user-friendly messages
          if (error.message.includes("not authorized") || error.message.includes("api_key")) {
            errorMessage = "API key chưa được kích hoạt cho Directions service. Vui lòng liên hệ admin."
          } else if (error.message.includes("Invalid")) {
            errorMessage = "Dữ liệu chỉ đường không hợp lệ. Vui lòng thử lại."
          }
        }
        
        toast.error(errorMessage)
        setShowDirections(false)
        setRoute(null)
        setDirectionsInfo(null)
      } finally {
        setIsLoadingDirections(false)
      }
    }

    fetchDirections()
  }, [showDirections, userLocation, latitude, longitude])

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

  const handleToggleDirections = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng chức năng chỉ đường")
      return
    }
    
    if (!userLocation) {
      toast.error("Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí.")
      return
    }
    
    setShowDirections(!showDirections)
    if (showDirections) {
      setRoute(null)
      setDirectionsInfo(null)
      // Reset view to restaurant location
      if (latitude && longitude) {
        setViewState(prev => ({
          ...prev,
          latitude,
          longitude,
          zoom: defaultZoom,
        }))
      }
    }
  }

  // Prepare route geometry for rendering
  // Try multiple formats from Goong API
  const routeGeometry = route?.routes?.[0]?.geometry?.coordinates || 
                       route?.routes?.[0]?.legs?.[0]?.steps?.[0]?.geometry?.coordinates ||
                       null
  
  // Log route data for debugging
  useEffect(() => {
    if (route) {
      console.log("Route data:", route)
      console.log("Route geometry:", routeGeometry)
    }
  }, [route, routeGeometry])

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

  return (
    <div ref={containerRef} className="w-full h-full relative rounded-lg overflow-hidden shadow-lg">
      <InteractiveMap
        {...viewState}
        onViewStateChange={onViewStateChange}
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
        {/* User location marker */}
        {showDirections && userLocation && (
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
            anchor="bottom"
          >
            <div className="relative">
              <div className="bg-blue-500 rounded-full p-2 shadow-lg">
                <MapPin className="text-white" size={24} fill="currentColor" />
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Vị trí của bạn
              </div>
            </div>
          </Marker>
        )}

        {/* Restaurant marker */}
        {(latitude && longitude) && (
          <Marker
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <div className="relative">
              <MapPin className="text-orange-600 dark:text-orange-400" size={32} fill="currentColor" />
              {restaurantName && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap max-w-[150px] truncate">
                  {restaurantName}
                </div>
              )}
            </div>
          </Marker>
        )}

        {/* Route line */}
        {showDirections && routeGeometry && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: routeGeometry,
              },
            }}
          >
            <Layer
              id="route-line"
              type="line"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "#f97316",
                "line-width": 4,
                "line-opacity": 0.8,
              }}
            />
          </Source>
        )}
      </InteractiveMap>
      
      {/* Directions button - Only show if user is authenticated and has location */}
      {isAuthenticated && userLocation && latitude && longitude && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleToggleDirections}
            disabled={isLoadingDirections}
            className={`px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-all flex items-center gap-2 ${
              showDirections
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isLoadingDirections ? "Đang tải chỉ đường..." : showDirections ? "Ẩn chỉ đường" : "Xem chỉ đường từ vị trí của bạn"}
          >
            {isLoadingDirections ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải...</span>
              </>
            ) : showDirections ? (
              <>
                <X size={18} />
                <span>Ẩn chỉ đường</span>
              </>
            ) : (
              <>
                <Navigation size={18} />
                <span>Chỉ đường</span>
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Info message if user is not authenticated */}
      {!isAuthenticated && latitude && longitude && (
        <div className="absolute top-4 right-4 z-10 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
          <p>Đăng nhập để xem chỉ đường</p>
        </div>
      )}

      {/* Directions info */}
      {showDirections && directionsInfo && (
        <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="text-orange-600 dark:text-orange-400" size={18} />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">Chỉ đường</span>
          </div>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p>Khoảng cách: <span className="font-medium text-gray-900 dark:text-white">{directionsInfo.distance}</span></p>
            <p>Thời gian: <span className="font-medium text-gray-900 dark:text-white">{directionsInfo.duration}</span></p>
          </div>
        </div>
      )}
      
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
