"use client"

import { useState, useEffect, Suspense, use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Star, Phone, Clock, Leaf } from "lucide-react"
import { getRestaurantDetail, Restaurant, DishDetail } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { RestaurantMap } from "@/components/restaurant-map"
import Link from "next/link"

function RestaurantContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const restaurantId = Number.parseInt(id)
  const { token } = useAuth()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getRestaurantDetail(restaurantId, token || undefined)
        setRestaurant(data)
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err)
        setError("Không thể tải thông tin quán ăn")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [restaurantId, token])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
              <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              Đang tải...
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">{error || "Không tìm thấy quán ăn"}</p>
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
          {/* Hero Section */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-2xl shadow-xl mb-8">
            <img 
              src={restaurant.restaurantImg || "/placeholder.svg"} 
              alt={restaurant.resName} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-orange-600/90 text-white text-xs font-semibold uppercase rounded-full">
                  {restaurant.tagName}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{restaurant.resName}</h1>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="text-xl font-bold">{restaurant.starRating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Restaurant Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Địa chỉ</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.resAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Giờ mở cửa</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.openingHours}</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                {restaurant.resPhoneNumber && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-start gap-3">
                      <Phone className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Số điện thoại</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.resPhoneNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 lg:p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thực đơn</h2>
                {restaurant.dishes && restaurant.dishes.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {restaurant.dishes.map((dish) => (
                      <Link
                        key={dish.id}
                        href={`/food/${dish.id}`}
                        className="group bg-gray-50 dark:bg-slate-900 rounded-lg p-4 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                            <img
                              src={dish.dishImage || "/placeholder.svg"}
                              alt={dish.dishName}
                              className="w-full h-full object-cover group-hover:scale-110 transition"
                            />
                            {dish.isVegan && (
                              <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                                <Leaf size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                              {dish.dishName}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {dish.dishDescription}
                            </p>
                            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                              {dish.dishPrice.toLocaleString("vi-VN")} ₫
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    Quán này chưa có món ăn nào trong menu
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg sticky top-20">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-orange-600 dark:text-orange-400" size={24} />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vị trí</h2>
                </div>
                <div className="h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <RestaurantMap
                    latitude={restaurant.latitude}
                    longitude={restaurant.longitude}
                    restaurantName={restaurant.resName}
                    restaurantAddress={restaurant.resAddress}
                  />
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

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
              <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              Đang tải...
            </div>
          </div>
        </div>
      }
    >
      <RestaurantContent params={params} />
    </Suspense>
  )
}

