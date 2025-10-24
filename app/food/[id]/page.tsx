"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, Heart, MapPin } from "lucide-react"

const FOOD_DETAILS: Record<
  number,
  {
    id: number
    name: string
    category: string
    rating: number
    reviews: number
    price: string
    image: string
    description: string
    fullDescription: string
    ingredients: string[]
    restaurants: Array<{ name: string; address: string; distance: string }>
    reviews_list: Array<{ author: string; rating: number; text: string; date: string }>
  }
> = {
  1: {
    id: 1,
    name: "Phở Bò",
    category: "Soup",
    rating: 4.8,
    reviews: 245,
    price: "45,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Phở bò truyền thống với nước dùng được nấu từ xương bò suốt 12 tiếng",
    fullDescription:
      "Phở bò là một trong những món ăn truyền thống nổi tiếng nhất của Việt Nam. Với nước dùng được nấu từ xương bò suốt 12 tiếng, kết hợp với bánh phở mềm mại và thịt bò tươi ngon, phở bò mang lại hương vị đặc biệt khó quên.",
    ingredients: ["Xương bò", "Bánh phở", "Thịt bò", "Hành", "Gừng", "Quế", "Hồi"],
    restaurants: [
      { name: "Phở Hà Nội", address: "123 Phố Cổ, Hà Nội", distance: "0.5 km" },
      { name: "Phở Sài Gòn", address: "456 Nguyễn Huệ, TP.HCM", distance: "1.2 km" },
      { name: "Phở Đặc Biệt", address: "789 Lê Lợi, Đà Nẵng", distance: "2.1 km" },
    ],
    reviews_list: [
      {
        author: "Nguyễn Văn A",
        rating: 5,
        text: "Phở rất ngon, nước dùng đậm đà, thịt tươi. Nhân viên phục vụ rất tốt!",
        date: "2 ngày trước",
      },
      {
        author: "Trần Thị B",
        rating: 4,
        text: "Ngon nhưng hơi mắc. Phần bánh phở hơi ít.",
        date: "1 tuần trước",
      },
    ],
  },
  2: {
    id: 2,
    name: "Bánh Mì Thịt Nướng",
    category: "Sandwich",
    rating: 4.6,
    reviews: 189,
    price: "35,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Bánh mì giòn với thịt nướng, pâté, và rau sống tươi mát",
    fullDescription:
      "Bánh mì Việt Nam là sự kết hợp hoàn hảo giữa ẩm thực Pháp và Việt. Với bánh giòn bên ngoài, mềm bên trong, kết hợp với thịt nướng thơm ngon, pâté béo ngậy, và rau sống tươi mát, bánh mì thịt nướng là lựa chọn hoàn hảo cho bữa sáng.",
    ingredients: ["Bánh mì", "Thịt nướng", "Pâté", "Rau sống", "Ớt", "Nước mắm"],
    restaurants: [
      { name: "Bánh Mì Hà Nội", address: "321 Tràng Tiền, Hà Nội", distance: "0.3 km" },
      { name: "Bánh Mì Sài Gòn", address: "654 Bùi Viện, TP.HCM", distance: "0.8 km" },
    ],
    reviews_list: [
      {
        author: "Lê Văn C",
        rating: 5,
        text: "Bánh mì rất ngon, giòn vừa phải, nhân đầy đủ!",
        date: "3 ngày trước",
      },
    ],
  },
  3: {
    id: 3,
    name: "Cơm Tấm Sườn Nướng",
    category: "Rice",
    rating: 4.7,
    reviews: 312,
    price: "55,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Cơm tấm với sườn nướng, trứng ốp la, và nước mắm chua ngọt",
    fullDescription:
      "Cơm tấm là một trong những đặc sản của TP.HCM. Với cơm tấm thơm ngon, sườn nướng mềm, trứng ốp la chín vừa, và nước mắm chua ngọt đặc biệt, cơm tấm sườn nướng là một bữa cơm hoàn hảo.",
    ingredients: ["Cơm tấm", "Sườn lợn", "Trứng gà", "Nước mắm", "Ớt", "Hành"],
    restaurants: [
      { name: "Cơm Tấm Sài Gòn", address: "987 Nguyễn Trãi, TP.HCM", distance: "1.5 km" },
      { name: "Cơm Tấm Đặc Biệt", address: "111 Lý Thường Kiệt, TP.HCM", distance: "2.0 km" },
    ],
    reviews_list: [
      {
        author: "Phạm Thị D",
        rating: 5,
        text: "Cơm tấm rất ngon, sườn nướng mềm, trứng chín vừa!",
        date: "1 ngày trước",
      },
    ],
  },
  4: {
    id: 4,
    name: "Bún Chả Hà Nội",
    category: "Noodles",
    rating: 4.9,
    reviews: 428,
    price: "50,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Bún chả nổi tiếng Hà Nội với thịt nướng và nước mắm đặc biệt",
    fullDescription:
      "Bún chả Hà Nội là một trong những món ăn nổi tiếng nhất của Hà Nội. Với bún tươi, thịt nướng thơm ngon, và nước mắm chua ngọt đặc biệt, bún chả Hà Nội mang lại hương vị độc đáo khó quên.",
    ingredients: ["Bún", "Thịt nướng", "Nước mắm", "Ớt", "Hành", "Rau sống"],
    restaurants: [
      { name: "Bún Chả Hà Nội", address: "222 Hàng Gà, Hà Nội", distance: "0.7 km" },
      { name: "Bún Chả Cổ", address: "333 Phố Cổ, Hà Nội", distance: "1.0 km" },
    ],
    reviews_list: [
      {
        author: "Hoàng Văn E",
        rating: 5,
        text: "Bún chả rất ngon, thịt nướng thơm, nước mắm đặc biệt!",
        date: "2 ngày trước",
      },
    ],
  },
  5: {
    id: 5,
    name: "Gỏi Cuốn Tôm",
    category: "Appetizer",
    rating: 4.5,
    reviews: 156,
    price: "40,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Gỏi cuốn tôm tươi với rau thơm và nước chấm đậu phộng",
    fullDescription:
      "Gỏi cuốn tôm là một món khai vị tuyệt vời. Với tôm tươi, rau thơm, và nước chấm đậu phộng đặc biệt, gỏi cuốn tôm mang lại hương vị tươi mát và ngon miệng.",
    ingredients: ["Tôm tươi", "Bánh tráng", "Rau thơm", "Nước chấm đậu phộng"],
    restaurants: [{ name: "Gỏi Cuốn Hà Nội", address: "444 Tràng Tiền, Hà Nội", distance: "0.4 km" }],
    reviews_list: [
      {
        author: "Võ Thị F",
        rating: 5,
        text: "Gỏi cuốn rất tươi, tôm to, nước chấm ngon!",
        date: "5 ngày trước",
      },
    ],
  },
  6: {
    id: 6,
    name: "Mì Xào Hải Sản",
    category: "Noodles",
    rating: 4.6,
    reviews: 203,
    price: "65,000",
    image: "/placeholder.svg?height=500&width=500",
    description: "Mì xào với tôm, mực, và các loại hải sản tươi ngon",
    fullDescription:
      "Mì xào hải sản là một món ăn ngon và bổ dưỡng. Với mì giòn, tôm tươi, mực mềm, và các loại hải sản khác, mì xào hải sản mang lại hương vị đặc biệt và hấp dẫn.",
    ingredients: ["Mì", "Tôm", "Mực", "Cua", "Rau xanh", "Tương ớt"],
    restaurants: [{ name: "Mì Xào Hải Sản", address: "555 Nguyễn Huệ, TP.HCM", distance: "1.3 km" }],
    reviews_list: [
      {
        author: "Trương Văn G",
        rating: 5,
        text: "Mì xào hải sản rất ngon, hải sản tươi, mì giòn!",
        date: "1 tuần trước",
      },
    ],
  },
}

export default function FoodDetailPage({ params }: { params: { id: string } }) {
  const foodId = Number.parseInt(params.id)
  const food = FOOD_DETAILS[foodId]
  const [isFavorite, setIsFavorite] = useState(false)

  if (!food) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Không tìm thấy món ăn</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img src={food.image || "/placeholder.svg"} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-full p-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={24} className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 dark:text-gray-400"} />
        </button>
      </section>

      {/* Content */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase">
              {food.category}
            </span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">{food.name}</h1>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{food.rating}</span>
                <span className="text-gray-600 dark:text-gray-400">({food.reviews} đánh giá)</span>
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{food.price}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-lg">{food.fullDescription}</p>
          </div>

          {/* Ingredients */}
          <div className="mb-12 bg-orange-50 dark:bg-slate-900 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thành phần</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {food.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurants */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nơi bán</h2>
            <div className="space-y-4">
              {food.restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin size={18} />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">{restaurant.distance}</span>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                      Xem trên bản đồ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đánh giá</h2>
            <div className="space-y-4">
              {food.reviews_list.map((review, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{review.author}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
