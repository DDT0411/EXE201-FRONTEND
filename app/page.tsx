import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ChefHat, MapPin, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden animate-fadeInDown">
        <img src="/Headerimg.jpg" alt="Food banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            Về chúng tôi
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="flex justify-center animate-fadeInUp delay-100">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center transition-smooth hover:scale-105 hover:shadow-lg overflow-hidden">
              <img
                src="/Button3.png"
                alt="EatIT mascot"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="animate-fadeInUp delay-200">
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              EatIT là ứng dụng giúp bạn tìm kiếm và đánh giá địa điểm ăn uống một cách nhanh chóng và tiện lợi. Từ quán
              ăn via hè đến nhà hàng sang trọng, EatIT kết nối bạn với hàng nghìn địa điểm ăn uống trên khắp Việt Nam.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Sản phẩm làm ra với mục đích học tập
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-orange-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-fadeInUp">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Chúng tôi ở đây để giúp bạn lựa chọn
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2 animate-fadeInUp delay-100">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <MapPin className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">Tìm kiếm dễ dàng</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Tìm kiếm nhà hàng, quán ăn gần bạn với bản đồ tương tác
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2 animate-fadeInUp delay-200">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <ChefHat className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">Đánh giá thực tế</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Xem đánh giá từ những người dùng thực tế
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2 animate-fadeInUp delay-300 sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <Sparkles className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">Gợi ý thông minh</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Nhận gợi ý món ăn phù hợp với sở thích của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          Bắt đầu khám phá ngay
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Tham gia cộng đồng EatIT và khám phá những địa điểm ăn uống tuyệt vời
        </p>
        <Link
          href="/menu"
          className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-smooth hover:shadow-lg hover:scale-105 font-semibold text-base sm:text-lg"
        >
          Khám phá menu
        </Link>
      </section>

      <Footer />
    </div>
  )
}
