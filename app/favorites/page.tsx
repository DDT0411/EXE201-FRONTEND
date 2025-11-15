"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Heart, MapPin, Utensils, X, Trash2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getFavorites, Favorite, deleteFavorite } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"
import Link from "next/link"

interface GroupedFavorite {
  restaurantName: string
  dishes: string[]
}

export default function FavoritesPage() {
  const { language } = useLanguage()
  const { token, isAuthenticated, isLoading: authLoading, user } = useAuth()
  const t = (key: string) => getTranslation(language, key)
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (authLoading) {
      return
    }

    const fetchFavorites = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (!isAuthenticated || !token || !user) {
          setError(language === "vi" ? "Vui lòng đăng nhập để xem danh sách yêu thích" : "Please log in to view favorites")
          return
        }
        const data = await getFavorites(user.userId, token)
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

  const handleDeleteFavorite = async (favoriteId: number) => {
    if (!token) {
      toast.error(language === "vi" ? "Vui lòng đăng nhập" : "Please login")
      return
    }

    setDeletingIds(prev => new Set(prev).add(favoriteId))
    try {
      await deleteFavorite(favoriteId, token)
      setFavorites(prev => prev.filter(f => f.id !== favoriteId))
      toast.success(language === "vi" ? "Đã xóa khỏi yêu thích" : "Removed from favorites")
    } catch (err) {
      console.error("Failed to delete favorite:", err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error(language === "vi" ? "Không thể xóa" : "Failed to delete")
      }
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(favoriteId)
        return newSet
      })
    }
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite, index) => {
                const delayMap = [100, 200, 300] as const
                const delay = delayMap[index % delayMap.length]
                const isDeleting = deletingIds.has(favorite.favoriteId || favorite.id)
                return (
                  <ScrollReveal key={favorite.id} direction="up" delay={delay}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                      {/* Dish Image */}
                      {favorite.dishImg && (
                        (favorite.dishId || (favorite.id && !favorite.favoriteId)) ? (
                          <Link 
                            href={`/food/${favorite.dishId || favorite.id}`} 
                            className="relative block h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 group"
                            onClick={(e) => {
                              // Debug: log the ID being used
                              const dishId = favorite.dishId || favorite.id
                              console.log("Navigating to food detail:", {
                                dishId,
                                favoriteId: favorite.favoriteId,
                                id: favorite.id,
                                dishName: favorite.dishName
                              })
                            }}
                          >
                          <img
                            src={favorite.dishImg}
                            alt={favorite.dishName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteFavorite(favorite.favoriteId || favorite.id)
                              }}
                              disabled={isDeleting}
                              className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                              title={language === "vi" ? "Xóa khỏi yêu thích" : "Remove from favorites"}
                            >
                              {isDeleting ? (
                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="w-5 h-5 text-red-500" />
                              )}
                            </button>
                          </div>
                        </Link>
                        ) : (
                          <div className="relative block h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 group cursor-not-allowed opacity-75">
                            <img
                              src={favorite.dishImg}
                              alt={favorite.dishName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <p className="text-white text-sm text-center px-4">
                                {language === "vi" ? "Không thể xem chi tiết (thiếu ID món ăn)" : "Cannot view details (missing dish ID)"}
                              </p>
                            </div>
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteFavorite(favorite.favoriteId || favorite.id)
                                }}
                                disabled={isDeleting}
                                className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                                title={language === "vi" ? "Xóa khỏi yêu thích" : "Remove from favorites"}
                              >
                                {isDeleting ? (
                                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-5 h-5 text-red-500" />
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      )}
                      
                      {/* Dish Info */}
                      <div className="p-4">
                        {(favorite.dishId || (favorite.id && !favorite.favoriteId)) ? (
                          <Link 
                            href={`/food/${favorite.dishId || favorite.id}`} 
                            className="block group"
                            onClick={(e) => {
                              // Debug: log the ID being used
                              const dishId = favorite.dishId || favorite.id
                              console.log("Navigating to food detail:", {
                                dishId,
                                favoriteId: favorite.favoriteId,
                                id: favorite.id,
                                dishName: favorite.dishName
                              })
                            }}
                          >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex-shrink-0 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30 transition">
                              <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                                {favorite.dishName}
                              </h3>
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{favorite.restaurantName}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        ) : (
                          <div className="flex items-start gap-3 mb-2">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
                              <Utensils className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                                {favorite.dishName}
                              </h3>
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{favorite.restaurantName}</span>
                              </div>
                              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                                {language === "vi" ? "⚠️ Không thể xem chi tiết (thiếu ID món ăn)" : "⚠️ Cannot view details (missing dish ID)"}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDeleteFavorite(favorite.favoriteId || favorite.id)}
                          disabled={isDeleting}
                          className="mt-3 w-full py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                              <span>{language === "vi" ? "Đang xóa..." : "Deleting..."}</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={16} />
                              <span>{language === "vi" ? "Xóa khỏi yêu thích" : "Remove from favorites"}</span>
                            </>
                          )}
                        </button>
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

