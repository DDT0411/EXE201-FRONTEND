"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RestaurantCard } from "@/components/restaurant-card"
import { Sparkles, RefreshCcw } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import {
  getTags,
  getNearbyRestaurants,
  updateUserLocation,
  Tag,
  Restaurant,
  type NearbyRestaurantsResponse,
} from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"
import { getCurrentLocation } from "@/lib/google-maps"

export default function MenuPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const { token, isLoading: authLoading, clearExpiredToken } = useAuth()
  const t = (key: string) => getTranslation(language, key)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [radiusSearch, setRadiusSearch] = useState(30)
  const [tags, setTags] = useState<Tag[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const locationRetryRef = useRef(false)
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false)
  const categoriesScrollRef = useRef<HTMLDivElement | null>(null)
  const [categoriesScrollProgress, setCategoriesScrollProgress] = useState(0)
  const [isCategoryScrollable, setIsCategoryScrollable] = useState(false)
  const [isSliderInteracting, setIsSliderInteracting] = useState(false)

  // Fetch tags on mount
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    const fetchTags = async () => {
      try {
        if (token) {
          const tagsData = await getTags(token)
          setTags(tagsData)
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err)
      }
    }

    fetchTags()
  }, [token, authLoading])

  const buildMissingLocationMessage = useCallback(
    () =>
      language === "vi"
        ? "Bạn chưa cho phép lấy vị trí. Vui lòng bật định vị rồi thử lại."
        : "Please enable location services before searching for nearby restaurants.",
    [language]
  )

  const shouldAttemptLocationSync = useCallback((err: unknown) => {
    if (!(err instanceof Error)) {
      return false
    }
    const normalized = err.message.toLowerCase()
    return normalized.includes("cập nhật vị trí") || normalized.includes("update your location")
  }, [])

  const refreshLocation = useCallback(
    async ({
      respectRetryGuard = false,
      showSuccessToast = true,
      showErrorToast = true,
    }: {
      respectRetryGuard?: boolean
      showSuccessToast?: boolean
      showErrorToast?: boolean
    } = {}) => {
      if (!token) {
        return { success: false, errorMessage: buildMissingLocationMessage() }
      }

      if (respectRetryGuard) {
        if (locationRetryRef.current) {
          return { success: false }
        }
        locationRetryRef.current = true
      }

      setIsRefreshingLocation(true)
      try {
        const location = await getCurrentLocation()
        const success = await updateUserLocation(
          {
            userLatitude: location.lat,
            userLongitude: location.lng,
          },
          token
        )

        if (success) {
          if (showSuccessToast) {
            toast.success(
              language === "vi"
                ? "Đã cập nhật vị trí, đang tìm nhà hàng gần bạn..."
                : "Location updated. Fetching nearby restaurants..."
            )
          }
          return { success: true }
        }

        const fallbackMessage =
          language === "vi"
            ? "Không thể đồng bộ vị trí. Vui lòng đăng xuất và đăng nhập lại."
            : "Unable to sync location. Please sign out and sign in again."

        if (showErrorToast) {
          toast.error(fallbackMessage)
        }
        return { success: false, errorMessage: fallbackMessage }
      } catch (locationError) {
        let errorMessage = buildMissingLocationMessage()

        if (locationError instanceof Error) {
          const lower = locationError.message.toLowerCase()

          if (lower.includes("denied") || lower.includes("permission")) {
            errorMessage =
              language === "vi"
                ? "Bạn đã từ chối quyền truy cập vị trí. Hãy cấp quyền trong cài đặt trình duyệt/thiết bị rồi thử lại."
                : "Location permission was denied. Please allow access in your browser/device settings."
          } else if (lower.includes("timeout")) {
            errorMessage =
              language === "vi"
                ? "Không thể lấy vị trí hiện tại (timeout). Hãy thử di chuyển tới nơi thoáng hoặc kiểm tra GPS."
                : "Location request timed out. Try moving to an open area or check your GPS."
          } else if (locationError.message.trim() !== "") {
            errorMessage =
              language === "vi"
                ? `Không thể lấy vị trí: ${locationError.message}`
                : `Unable to get location: ${locationError.message}`
          }
        }

        if (showErrorToast) {
          toast.error(errorMessage)
        }
        return { success: false, errorMessage }
      } finally {
        setIsRefreshingLocation(false)
      }
    },
    [token, language, buildMissingLocationMessage]
  )

  const fetchRestaurants = useCallback(async () => {
    locationRetryRef.current = false
    setIsLoading(true)
    setError(null)

    try {
      if (!token) {
        setRestaurants([])
        setError(language === "vi" ? "Vui lòng đăng nhập để xem các nhà hàng" : "Please login to view restaurants")
        return
      }

      const radiusKm = typeof radiusSearch === "number" ? radiusSearch : parseFloat(radiusSearch) || 30
      let restaurantsData: NearbyRestaurantsResponse | null = null

      try {
        restaurantsData = await getNearbyRestaurants({ radiusKm }, token)
      } catch (err) {
        if (shouldAttemptLocationSync(err)) {
          const syncResult = await refreshLocation({ respectRetryGuard: true, showSuccessToast: false, showErrorToast: false })

          if (!syncResult.success) {
            setRestaurants([])
            setError(syncResult.errorMessage ?? buildMissingLocationMessage())
            return
          }

          restaurantsData = await getNearbyRestaurants({ radiusKm }, token)
        } else {
          throw err
        }
      }

      if (!restaurantsData) {
        setRestaurants([])
        return
      }

      if (restaurantsData.restaurants && restaurantsData.restaurants.length === 0 && restaurantsData.totalItems === 0) {
        setRestaurants([])
      } else {
        setRestaurants(restaurantsData.restaurants || [])
      }
    } catch (err) {
      console.error("Failed to fetch restaurants:", err)
      if (err instanceof Error && (err.message.includes("Unauthorized") || err.message.includes("401"))) {
        clearExpiredToken()
        setError(
          language === "vi"
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Session expired. Please login again."
        )
        toast.error(
          language === "vi"
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : "Session expired. Please login again."
        )
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(
          language === "vi"
            ? "Không thể tải dữ liệu. Vui lòng thử lại sau."
            : "Failed to load data. Please try again later."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    token,
    radiusSearch,
    language,
    buildMissingLocationMessage,
    shouldAttemptLocationSync,
    refreshLocation,
    clearExpiredToken,
    router,
  ])

  useEffect(() => {
    if (!authLoading) {
      fetchRestaurants()
    }
  }, [authLoading, fetchRestaurants])

  const handleManualRefreshLocation = useCallback(async () => {
    if (!token) {
      toast.error(language === "vi" ? "Vui lòng đăng nhập để cập nhật vị trí" : "Please login to refresh your location")
      return
    }

    const result = await refreshLocation()
    if (result.success) {
      await fetchRestaurants()
    } else if (result.errorMessage) {
      setError(result.errorMessage)
    }
  }, [token, language, refreshLocation, fetchRestaurants])

  const updateCategoryScrollMetrics = useCallback(() => {
    const container = categoriesScrollRef.current
    if (!container) {
      setIsCategoryScrollable(false)
      setCategoriesScrollProgress(0)
      return
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth
    setIsCategoryScrollable(maxScrollLeft > 4)

    if (maxScrollLeft <= 0) {
      setCategoriesScrollProgress(0)
      return
    }

    const progress = (container.scrollLeft / maxScrollLeft) * 100
    setCategoriesScrollProgress(progress)
  }, [])

  const handleCategoryScroll = useCallback(() => {
    updateCategoryScrollMetrics()
  }, [updateCategoryScrollMetrics])

  const handleSliderChange = useCallback(
    (value: number) => {
      const container = categoriesScrollRef.current
      if (!container) {
        return
      }

      const maxScrollLeft = container.scrollWidth - container.clientWidth
      const nextScrollLeft = (value / 100) * maxScrollLeft
      container.scrollTo({
        left: nextScrollLeft,
        behavior: isSliderInteracting ? "auto" : "smooth",
      })
      setCategoriesScrollProgress(value)

      if (typeof window !== "undefined") {
        window.requestAnimationFrame(updateCategoryScrollMetrics)
      }
    },
    [updateCategoryScrollMetrics, isSliderInteracting]
  )

  const handleSliderInteractionStart = useCallback(() => {
    setIsSliderInteracting(true)
  }, [])

  const handleSliderInteractionEnd = useCallback(() => {
    setIsSliderInteracting(false)
  }, [])

  useEffect(() => {
    updateCategoryScrollMetrics()
    if (typeof window === "undefined") {
      return
    }
    const handleResize = () => updateCategoryScrollMetrics()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [tags, updateCategoryScrollMetrics])

  // Build categories from tags
  const CATEGORIES = [
    { id: "all", name: t("menu.categories.all") },
    ...tags.map((tag) => ({ id: tag.tagID.toString(), name: tag.tagName })),
  ]


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("menu.title")}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t("menu.subtitle")}</p>
        </ScrollReveal>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
        <ScrollReveal direction="up" className="max-w-7xl mx-auto">
          {/* Radius Selection Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              {language === "vi" ? "Chọn bán kính tìm kiếm" : "Select Search Radius"}
            </label>
            
            {/* Radius Buttons */}
            <div className="flex flex-wrap gap-3 mb-3">
              {[5, 10, 20, 30].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setRadiusSearch(radius)}
                  className={`relative py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    radiusSearch === radius
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-200 dark:ring-orange-800"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  }`}
                >
                  {radius}km
                  {radiusSearch === radius && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                      <Sparkles className="text-white" size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === "vi" 
                ? `Tìm kiếm quán ăn trong phạm vi ${radiusSearch} km từ vị trí của bạn`
                : `Search for restaurants within ${radiusSearch} km from your location`}
            </p>
            
            <div className="mt-4">
              <button
                onClick={handleManualRefreshLocation}
                disabled={!token || authLoading || isRefreshingLocation}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !token || authLoading
                    ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                    : "bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 dark:bg-slate-800 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-slate-700"
                }`}
              >
                {isRefreshingLocation ? (
                  <>
                    <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                    {language === "vi" ? "Đang cập nhật vị trí..." : "Refreshing location..."}
                  </>
                ) : (
                  <>
                    <RefreshCcw size={16} />
                    {language === "vi" ? "Cập nhật vị trí của tôi" : "Refresh my location"}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {language === "vi"
                  ? "Dùng khi bạn vừa di chuyển hoặc chưa bật quyền định vị."
                  : "Use this if you just moved or previously denied location access."}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div
              ref={categoriesScrollRef}
              onScroll={handleCategoryScroll}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
            >
              {CATEGORIES.map((category, index) => {
                const delayMap = [100, 200, 300, 400, 500] as const
                const delay = delayMap[index % delayMap.length]
                return (
                  <ScrollReveal key={category.id} direction="left" delay={delay}>
                    {category.id === "all" ? (
                      <button
                        onClick={() => setSelectedCategory(category.id)}
                        className={`inline-flex items-center px-4 py-2 rounded-full whitespace-nowrap transition ${
                          selectedCategory === category.id
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {category.name}
                      </button>
                    ) : (
                      <a
                        href={`/tag/${category.id}`}
                        className="inline-flex items-center px-4 py-2 rounded-full whitespace-nowrap transition bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white"
                      >
                        {category.name}
                      </a>
                    )}
                  </ScrollReveal>
                )
              })}
            </div>
            {isCategoryScrollable && (
              <div className="hidden md:flex items-center gap-3 mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {language === "vi" ? "Kéo để xem thêm" : "Slide to explore"}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={categoriesScrollProgress}
                  onChange={(event) => handleSliderChange(Number(event.target.value))}
                  onMouseDown={handleSliderInteractionStart}
                  onMouseUp={handleSliderInteractionEnd}
                  onMouseLeave={handleSliderInteractionEnd}
                  onTouchStart={handleSliderInteractionStart}
                  onTouchEnd={handleSliderInteractionEnd}
                  aria-label={language === "vi" ? "Thanh trượt danh mục" : "Category slider"}
                  className="flex-1 accent-orange-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Food Grid */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <ScrollReveal direction="up" className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                Đang tải...
              </div>
            </ScrollReveal>
          ) : error ? (
            <ScrollReveal direction="up" className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            </ScrollReveal>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant, index) => {
                const delayMap = [100, 200, 300] as const
                const delay = delayMap[index % delayMap.length]
                return (
                  <ScrollReveal key={restaurant.id} direction="up" delay={delay}>
                    <RestaurantCard
                      restaurant={{
                        id: restaurant.id,
                        resName: restaurant.resName,
                        tagName: restaurant.tagName,
                        restaurantImg: restaurant.restaurantImg,
                        resAddress: restaurant.resAddress,
                        starRating: restaurant.starRating,
                        distanceDisplay: restaurant.distanceDisplay,
                        openingHours: restaurant.openingHours,
                      }}
                    />
                  </ScrollReveal>
                )
              })}
            </div>
          ) : (
            <ScrollReveal direction="up" className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t("menu.noResults")}</p>
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
