"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sparkles, RotateCw, MapPin, Star } from "lucide-react"
import Link from "next/link"

const SURPRISE_FOODS = [
  {
    id: 1,
    name: "Phở Bò",
    category: "Soup",
    rating: 4.8,
    price: "45,000",
    image: "/placeholder.svg?height=400&width=400",
    restaurant: "Phở Hà Nội",
    address: "123 Phố Cổ, Hà Nội",
    distance: "0.5 km",
  },
  {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    category: "Sandwich",
    rating: 4.6,
    price: "35,000",
    image: "/placeholder.svg?height=400&width=400",
    restaurant: "Bánh Mì Sài Gòn",
    address: "654 Bùi Viện, TP.HCM",
    distance: "0.8 km",
  },
  {
    id: 3,
    name: "Cơm Tấm Sườn Nướng",
    category: "Rice",
    rating: 4.7,
    price: "55,000",
    image: "/placeholder.svg?height=400&width=400",
    restaurant: "Cơm Tấm Sài Gòn",
    address: "987 Nguyễn Trãi, TP.HCM",
    distance: "1.5 km",
  },
  {
    id: 4,
    name: "Bún Chả Hà Nội",
    category: "Noodles",
    rating: 4.9,
    price: "50,000",
    image: "/placeholder.svg?height=400&width=400",
    restaurant: "Bún Chả Hà Nội",
    address: "222 Hàng Gà, Hà Nội",
    distance: "0.7 km",
  },
]

export default function SurprisePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const currentFood = SURPRISE_FOODS[currentIndex]

  const handleSurprise = () => {
    setIsSpinning(true)
    setTimeout(() => {
      setCurrentIndex(Math.floor(Math.random() * SURPRISE_FOODS.length))
      setIsSpinning(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-white" size={32} />
            <h1 className="text-4xl font-bold text-white">Surprise</h1>
          </div>
          <p className="text-orange-100 text-lg">Khám phá một món ăn ngẫu nhiên hôm nay</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Food Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Image */}
            <div className="relative h-96 overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={currentFood.image || "/placeholder.svg"}
                alt={currentFood.name}
                className={`w-full h-full object-cover transition-transform ${isSpinning ? "scale-110" : "scale-100"}`}
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-4">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">
                  {currentFood.category}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{currentFood.name}</h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={20} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{currentFood.rating}</span>
                </div>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentFood.price}</span>
              </div>

              {/* Restaurant Info */}
              <div className="bg-orange-50 dark:bg-slate-900 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{currentFood.restaurant}</h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin size={18} />
                  <span>{currentFood.address}</span>
                </div>
                <span className="text-orange-600 dark:text-orange-400 font-semibold">{currentFood.distance}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSurprise}
                  disabled={isSpinning}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RotateCw size={20} className={isSpinning ? "animate-spin" : ""} />
                  {isSpinning ? "Đang quay..." : "Quay lại"}
                </button>
                <Link
                  href={`/food/${currentFood.id}`}
                  className="flex-1 py-3 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition font-semibold text-center"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <p className="text-blue-900 dark:text-blue-100">
              Bạn là thành viên Premium? Bạn có thể sử dụng Surprise không giới hạn mỗi ngày!
            </p>
            <Link
              href="/premium"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Nâng cấp lên Premium
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
