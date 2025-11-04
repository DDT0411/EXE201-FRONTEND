"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RestaurantCard } from "@/components/restaurant-card"
import { Search } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getTags, getNearbyRestaurants, Tag, Restaurant } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function MenuPage() {
  const { language } = useLanguage()
  const { token, isLoading: authLoading } = useAuth()
  const t = (key: string) => getTranslation(language, key)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [radiusSearch, setRadiusSearch] = useState("30")
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
          const radiusKm = parseFloat(radiusSearch) || 30
          const restaurantsData = await getNearbyRestaurants({ radiusKm }, token)
          setRestaurants(restaurantsData.restaurants || [])
        } else {
          setError("Vui lòng đăng nhập để xem các nhà hàng")
        }
      } catch (err) {
        console.error("Failed to fetch restaurants:", err)
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [token, radiusSearch, authLoading])

  // Build categories from tags
  const CATEGORIES = [
    { id: "all", name: t("menu.categories.all") },
    ...tags.map((tag) => ({ id: tag.tagID.toString(), name: tag.tagName })),
  ]

  const handleRadiusSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger useEffect to fetch restaurants with new radius
  }

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
          {/* Radius Search Bar */}
          <form onSubmit={handleRadiusSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="number"
                placeholder="30"
                value={radiusSearch}
                onChange={(e) => setRadiusSearch(e.target.value)}
                min="1"
                max="100"
                className="w-full pl-10 pr-16 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 font-medium">km</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Tìm kiếm quán ăn trong phạm vi {radiusSearch || "30"} km từ vị trí của bạn
            </p>
          </form>

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
