"use client"

import { useState, useEffect, Suspense, use } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RestaurantCard } from "@/components/restaurant-card"
import { useAuth } from "@/hooks/use-auth"
import { getTagWithRestaurants, TagWithRestaurants } from "@/lib/api"

function TagContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const tagId = Number.parseInt(id)
  const { token } = useAuth()

  const [tagData, setTagData] = useState<TagWithRestaurants | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getTagWithRestaurants(tagId, token || undefined)
        setTagData(data)
      } catch (err) {
        console.error("Failed to fetch tag data:", err)
        setError("Không thể tải dữ liệu")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [tagId, token])

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

  if (error || !tagData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">{error || "Không tìm thấy thông tin"}</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <img src={tagData.tagImg || "/placeholder.svg"} alt={tagData.tagName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">{tagData.tagName}</h1>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {tagData.restaurants && tagData.restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tagData.restaurants.map((restaurant, index) => {
                const delayMap = [100, 200, 300] as const
                const delay = delayMap[index % delayMap.length]
                return (
                  <ScrollReveal key={restaurant.id} direction="up" delay={delay}>
                    <RestaurantCard
                      restaurant={{
                        id: restaurant.id,
                        resName: restaurant.resName,
                        tagName: tagData.tagName,
                        restaurantImg: restaurant.restaurantImg,
                        resAddress: restaurant.resAddress,
                        starRating: restaurant.starRating,
                        openingHours: restaurant.openingHours,
                      }}
                    />
                  </ScrollReveal>
                )
              })}
            </div>
          ) : (
            <ScrollReveal direction="up" className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chưa có quán ăn nào trong danh mục này
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function TagPage({ params }: { params: Promise<{ id: string }> }) {
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
      <TagContent params={params} />
    </Suspense>
  )
}

