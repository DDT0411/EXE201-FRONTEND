"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FoodCard } from "@/components/food-card"
import { Search } from "lucide-react"

const FOOD_ITEMS = [
  {
    id: 1,
    name: "Phở Bò",
    category: "Soup",
    rating: 4.8,
    reviews: 245,
    price: "45,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Phở bò truyền thống với nước dùng được nấu từ xương bò suốt 12 tiếng",
  },
  {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    category: "Sandwich",
    rating: 4.6,
    reviews: 189,
    price: "35,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Bánh mì giòn với thịt nướng, pâté, và rau sống tươi mát",
  },
  {
    id: 3,
    name: "Cơm Tấm Sườn Nướng",
    category: "Rice",
    rating: 4.7,
    reviews: 312,
    price: "55,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Cơm tấm với sườn nướng, trứng ốp la, và nước mắm chua ngọt",
  },
  {
    id: 4,
    name: "Bún Chả Hà Nội",
    category: "Noodles",
    rating: 4.9,
    reviews: 428,
    price: "50,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Bún chả nổi tiếng Hà Nội với thịt nướng và nước mắm đặc biệt",
  },
  {
    id: 5,
    name: "Gỏi Cuốn Tôm",
    category: "Appetizer",
    rating: 4.5,
    reviews: 156,
    price: "40,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Gỏi cuốn tôm tươi với rau thơm và nước chấm đậu phộng",
  },
  {
    id: 6,
    name: "Mì Xào Hải Sản",
    category: "Noodles",
    rating: 4.6,
    reviews: 203,
    price: "65,000",
    image: "/placeholder.svg?height=300&width=300",
    description: "Mì xào với tôm, mực, và các loại hải sản tươi ngon",
  },
]

const CATEGORIES = ["Tất cả", "Soup", "Sandwich", "Rice", "Noodles", "Appetizer"]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFoods = FOOD_ITEMS.filter((food) => {
    const matchesCategory = selectedCategory === "Tất cả" || food.category === selectedCategory
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Menu</h1>
          <p className="text-gray-600 dark:text-gray-400">Khám phá những món ăn ngon nhất</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Food Grid */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Không tìm thấy món ăn nào</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
