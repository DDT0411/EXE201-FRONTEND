"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Heart, MapPin, Utensils } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getFavorites, Favorite } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface GroupedFavorite {
  restaurantName: string
  dishes: string[]
}

export default function FavoritesPage() {
  const { language } = useLanguage()
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const t = (key: string) => getTranslation(language, key)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) {
      return
    }

    const fetchFavorites = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (!isAuthenticated || !token) {
          setError(language === "vi" ? "Vui lòng đăng nhập để xem danh sách yêu thích" : "Please log in to view favorites")
          return
        }
        const data = await getFavorites(token)
        setFavorites(data)
      } catch (err) {
        console.error("Failed to fetch favorites:", err)
        setError(language === "vi" ? "Không thể tải danh sách yêu thích" : "Failed to load favorites")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [token, isAuthenticated, authLoading, language])

  // Group favorites by restaurant
  const groupedFavorites: GroupedFavorite[] = favorites.reduce((acc, favorite) => {
    const existing = acc.find((group) => group.restaurantName === favorite.restaurantName)
    if (existing) {
      if (!existing.dishes.includes(favorite.dishName)) {
        existing.dishes.push(favorite.dishName)
      }
    } else {
      acc.push({
        restaurantName: favorite.restaurantName,
        dishes: [favorite.dishName],
      })
    }
    return acc
  }, [] as GroupedFavorite[])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-orange-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {language === "vi" ? "Yêu thích" : "Favorites"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "vi"
              ? "Danh sách các món ăn và quán ăn bạn đã yêu thích"
              : "Your favorite dishes and restaurants"}
          </p>
        </ScrollReveal>
      </section>

      {/* Favorites List */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <ScrollReveal direction="up" className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                {language === "vi" ? "Đang tải..." : "Loading..."}
              </div>
            </ScrollReveal>
          ) : error ? (
            <ScrollReveal direction="up" className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    {language === "vi" ? "Đăng nhập" : "Login"}
                  </Link>
                )}
              </div>
            </ScrollReveal>
          ) : favorites.length === 0 ? (
            <ScrollReveal direction="up" className="text-center py-12">
              <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {language === "vi" ? "Chưa có món yêu thích" : "No favorites yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {language === "vi"
                    ? "Bắt đầu khám phá và thêm các món ăn yêu thích vào danh sách của bạn!"
                    : "Start exploring and add your favorite dishes to your list!"}
                </p>
                <Link
                  href="/menu"
                  className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                >
                  {language === "vi" ? "Khám phá Menu" : "Explore Menu"}
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-6">
              {groupedFavorites.map((group, index) => {
                const delayMap = [100, 200, 300] as const
                const delay = delayMap[index % delayMap.length]
                return (
                  <ScrollReveal key={group.restaurantName} direction="up" delay={delay}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition p-6">
                      {/* Restaurant Header */}
                      <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                          <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {group.restaurantName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {language === "vi"
                              ? `${group.dishes.length} món yêu thích`
                              : `${group.dishes.length} favorite ${group.dishes.length === 1 ? "dish" : "dishes"}`}
                          </p>
                        </div>
                      </div>

                      {/* Dishes List */}
                      <div className="space-y-2">
                        {group.dishes.map((dish, dishIndex) => (
                          <div
                            key={`${group.restaurantName}-${dish}-${dishIndex}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                          >
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                              <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{dish}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

