"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RestaurantCard } from "@/components/restaurant-card"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getTags, getNearbyRestaurants, Tag, Restaurant } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"

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

  // Fetch restaurants based on radius search
  useEffect(() => {
    if (authLoading) {
      return
    }

    const fetchRestaurants = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (token) {
          const radiusKm = typeof radiusSearch === "number" ? radiusSearch : parseFloat(radiusSearch) || 30
          const restaurantsData = await getNearbyRestaurants({ radiusKm }, token)
          
          // Check if we got empty result - might be due to expired token
          if (restaurantsData.restaurants && restaurantsData.restaurants.length === 0 && restaurantsData.totalItems === 0) {
            // This could be either no restaurants found OR token expired
            // We'll show a message but not treat it as an error
            setRestaurants([])
          } else {
            setRestaurants(restaurantsData.restaurants || [])
          }
        } else {
          setError(language === "vi" ? "Vui lòng đăng nhập để xem các nhà hàng" : "Please login to view restaurants")
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err)
        // Check if it's an unauthorized error
        if (err instanceof Error && (err.message.includes("Unauthorized") || err.message.includes("401"))) {
          // Clear expired token
          clearExpiredToken()
          setError(language === "vi" 
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." 
            : "Session expired. Please login again.")
          // Show toast and redirect to login after a delay
          toast.error(language === "vi" 
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." 
            : "Session expired. Please login again.")
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } else {
          setError(language === "vi" 
            ? "Không thể tải dữ liệu. Vui lòng thử lại sau." 
            : "Failed to load data. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [token, radiusSearch, authLoading, language])

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
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
