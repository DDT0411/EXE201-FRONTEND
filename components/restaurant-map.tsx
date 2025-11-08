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

const defaultZoom = 15

interface RestaurantMapProps {
  latitude?: number
  longitude?: number
  restaurantName?: string
  restaurantAddress?: string
}

export function RestaurantMap({ latitude, longitude, restaurantName, restaurantAddress }: RestaurantMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOONG_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOONG_MAPS_KEY || ""
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMounted, setIsMounted] = useState(false)
  
  const [viewState, setViewState] = useState<ViewState>({
    latitude: latitude || defaultCenter.latitude,
    longitude: longitude || defaultCenter.longitude,
    zoom: defaultZoom,
    bearing: 0,
    pitch: 0,
  })

  // Update viewState when latitude/longitude change
  useEffect(() => {
    if (latitude && longitude) {
      setViewState(prev => ({
        ...prev,
        latitude,
        longitude,
      }))
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
        {(latitude && longitude) && (
          <Marker
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <div className="relative">
              <MapPin className="text-orange-600 dark:text-orange-400" size={32} fill="currentColor" />
            </div>
          </Marker>
        )}
      </InteractiveMap>
      
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
