"use client"

import { useState, use, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MapPin, Leaf } from "lucide-react"
import { getDishDetail, DishDetail } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { RestaurantMap } from "@/components/restaurant-map"

export default function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const foodId = Number.parseInt(id)
  const { token } = useAuth()

  // State for dish
  const [dish, setDish] = useState<DishDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for favorite
  const [isFavorite, setIsFavorite] = useState(false)

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch dish detail
        const dishData = await getDishDetail(foodId, token || undefined)
        setDish(dishData)
      } catch (err) {
        console.error("Failed to fetch data:", err)
        setError("Không thể tải thông tin món ăn")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [foodId, token])

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
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all hover:scale-110 z-10"
                  title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                  aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                >
                  <Heart 
                    size={24} 
                    className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"} 
                  />
                </button>
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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mô tả món ăn</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                      {dish.dishDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Restaurant Location Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-orange-600 dark:text-orange-400" size={24} />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vị trí quán ăn</h2>
                  </div>
                  
                  {dish.restaurantName && (
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                        {dish.restaurantName}
                      </p>
                      {dish.restaurantAddress && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {dish.restaurantAddress}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Map */}
                  <div className="h-64 lg:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <RestaurantMap
                      latitude={dish.latitude}
                      longitude={dish.longitude}
                      restaurantName={dish.restaurantName}
                      restaurantAddress={dish.restaurantAddress}
                    />
                  </div>
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
