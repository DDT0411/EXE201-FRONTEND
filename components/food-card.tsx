import Link from "next/link"
import { Star, Heart } from "lucide-react"

interface Food {
  id: number
  name: string
  category?: string
  rating?: number
  reviews?: number
  price: string | number
  image: string
  description: string
  tagName?: string
}

export function FoodCard({ food }: { food: Food }) {
  return (
    <Link href={`/food/${food.id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={food.image || "/placeholder.svg"}
            alt={food.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
          <button 
            className="absolute top-3 right-3 bg-white dark:bg-slate-800 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            title="Add to favorites"
            aria-label="Add to favorites"
          >
            <Heart size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            {(food.category || food.tagName) && (
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">
                {food.category || food.tagName}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{food.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">{food.description}</p>

          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            {food.rating && food.reviews && (
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{food.rating}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">({food.reviews})</span>
              </div>
            )}
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {typeof food.price === "number" ? food.price.toLocaleString("vi-VN") : food.price} ₫
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
