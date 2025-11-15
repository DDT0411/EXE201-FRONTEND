"use client"

import { useState, use, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MapPin, Leaf, Phone, Clock } from "lucide-react"
import { getDishDetail, DishDetail, addFavorite, getNearbyRestaurants } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"
import { useLanguage } from "@/hooks/use-language"

export default function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const foodId = Number.parseInt(id)
  const { token, user } = useAuth()
  const { language } = useLanguage()

  // State for dish
  const [dish, setDish] = useState<DishDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for favorite
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingFavorite, setIsAddingFavorite] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Log the ID being used for debugging
        console.log("Fetching dish detail for ID:", foodId)
        
        // Fetch dish detail
        const dishData = await getDishDetail(foodId, token || undefined)
        
        // If restaurantId is not in response, try to find it from nearby restaurants
        if (!dishData.restaurantId && token && dishData.resName) {
          try {
            const nearbyData = await getNearbyRestaurants({ radiusKm: 50 }, token)
            const matchingRestaurant = nearbyData.restaurants.find(
              r => r.resName === dishData.resName || r.resName === dishData.restaurantName
            )
            if (matchingRestaurant) {
              dishData.restaurantId = matchingRestaurant.id
            }
          } catch (err) {
            console.warn("Failed to find restaurant ID from nearby restaurants:", err)
          }
        }
        
        setDish(dishData)
      } catch (err) {
        console.error("Failed to fetch dish detail:", err)
        if (err instanceof Error) {
          console.error("Error message:", err.message)
          // Check if it's a "not found" error
          if (err.message.includes("not found") || err.message.includes("Không tìm thấy") || err.message.includes("Failed to fetch dish detail")) {
            setError(`Không tìm thấy món ăn với ID: ${foodId}. Có thể ID không đúng hoặc món ăn đã bị xóa.`)
          } else {
            setError(err.message || "Không thể tải thông tin món ăn")
          }
        } else {
          setError("Không thể tải thông tin món ăn")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [foodId, token])

  const handleAddFavorite = async () => {
    if (!token || !user) {
      toast.error(language === "vi" ? "Vui lòng đăng nhập để thêm vào yêu thích" : "Please login to add to favorites")
      return
    }

    if (!dish) {
      toast.error(language === "vi" ? "Thiếu thông tin món ăn" : "Missing dish information")
      return
    }

    // Note: restaurantId might not be in API response yet
    // For now, we'll need to get it from restaurant name or handle it differently
    // This is a temporary solution - API should provide restaurantId in future
    if (!dish.restaurantId) {
      toast.error(language === "vi" ? "Không thể xác định quán ăn. Vui lòng thử lại sau." : "Cannot identify restaurant. Please try again later.")
      return
    }

    setIsAddingFavorite(true)
    try {
      await addFavorite(
        {
          dishid: dish.id,
          restaurantid: dish.restaurantId,
        },
        token
      )
      setIsFavorite(true)
      toast.success(language === "vi" ? "Đã thêm vào yêu thích!" : "Added to favorites!")
    } catch (err) {
      console.error("Failed to add favorite:", err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error(language === "vi" ? "Không thể thêm vào yêu thích" : "Failed to add to favorites")
      }
    } finally {
      setIsAddingFavorite(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            Đang tải...
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">{error || "Không tìm thấy món ăn"}</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Food Image */}
            <div className="space-y-6">
              {/* Food Image with fixed aspect ratio */}
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img 
                    src={dish.dishImage || "/placeholder.svg"} 
                    alt={dish.dishName} 
                    className="w-full h-full object-contain p-4" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                </div>
                {/* Favorite Button */}
                {token && (
                  <button
                    onClick={handleAddFavorite}
                    disabled={isFavorite || isAddingFavorite}
                    className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all hover:scale-110 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isFavorite ? (language === "vi" ? "Đã thêm vào yêu thích" : "Added to favorites") : (language === "vi" ? "Thêm vào yêu thích" : "Add to favorites")}
                    aria-label={isFavorite ? (language === "vi" ? "Đã thêm vào yêu thích" : "Added to favorites") : (language === "vi" ? "Thêm vào yêu thích" : "Add to favorites")}
                  >
                    <Heart 
                      size={24} 
                      className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"} 
                    />
                  </button>
                )}
                {/* Vegan Badge */}
                {dish.isVegan && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-semibold shadow-lg z-10">
                    <Leaf size={16} />
                    <span>Vegan</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Food Details */}
            <div className="flex flex-col space-y-6">
              {/* Dish Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {dish.dishName}
                    </h1>
                    
                    {/* Price */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                        {dish.dishPrice.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === "vi" ? "Mô tả món ăn" : "Dish Description"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                      {dish.dishDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Restaurant Info Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-orange-600 dark:text-orange-400" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {language === "vi" ? "Thông tin quán ăn" : "Restaurant Information"}
                    </h2>
                  </div>
                  
                  {(dish.resName || dish.restaurantName) && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                        {dish.resName || dish.restaurantName}
                      </p>
                      {(dish.resAddress || dish.restaurantAddress) && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{dish.resAddress || dish.restaurantAddress}</span>
                        </div>
                      )}
                      {dish.resPhoneNumber && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                          <Phone size={16} />
                          <span>{dish.resPhoneNumber}</span>
                        </div>
                      )}
                      {dish.openingHours && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                          <Clock size={16} className="mt-0.5 flex-shrink-0" />
                          <span>{dish.openingHours}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
