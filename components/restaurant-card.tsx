import Link from "next/link"
import { Star, MapPin } from "lucide-react"

interface Restaurant {
  id: number
  resName: string
  tagName: string
  restaurantImg: string
  resAddress: string
  starRating: number
  distanceDisplay?: string
  openingHours?: string
}

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={restaurant.restaurantImg || "/placeholder.svg"}
            alt={restaurant.resName}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">
              {restaurant.tagName}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{restaurant.resName}</h3>
          
          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2">{restaurant.resAddress}</p>
          </div>

          {/* Opening Hours */}
          {restaurant.openingHours && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 line-clamp-1">{restaurant.openingHours}</p>
          )}

          {/* Rating and Distance */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{restaurant.starRating}</span>
            </div>
            {restaurant.distanceDisplay && (
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                {restaurant.distanceDisplay}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

