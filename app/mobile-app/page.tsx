"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Download, Apple, Smartphone } from "lucide-react"

export default function MobileAppPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">EatIT trên điện thoại của bạn</h1>
            <p className="text-orange-100 text-lg mb-8">
              Tải ứng dụng EatIT ngay hôm nay và khám phá những món ăn ngon nhất ở bất cứ đâu, bất cứ lúc nào.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                <Apple size={24} />
                <div className="text-left">
                  <div className="text-xs">Tải trên</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </button>

              <button className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                <Smartphone size={24} />
                <div className="text-left">
                  <div className="text-xs">Tải trên</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center shadow-2xl">
              <img
                src="/placeholder.svg?height=384&width=256"
                alt="Mobile app"
                className="w-full h-full rounded-3xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Tính năng ứng dụng di động
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Giao diện thân thiện</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Giao diện được thiết kế đặc biệt cho điện thoại di động, dễ sử dụng và trực quan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tải xuống ngoại tuyến</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tải xuống thông tin nhà hàng và menu để sử dụng khi không có kết nối internet.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Thông báo đẩy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nhận thông báo về các gợi ý mới, khuyến mãi, và cập nhật từ các nhà hàng yêu thích.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="bg-orange-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Ảnh chụp màn hình</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <img
                    src={`/placeholder.svg?height=300&width=200&query=app-screenshot-${i}`}
                    alt={`Screenshot ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Sẵn sàng để bắt đầu?</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Tải ứng dụng EatIT ngay hôm nay và bắt đầu khám phá những món ăn tuyệt vời.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
              <Apple size={24} />
              <div className="text-left">
                <div className="text-xs">Tải trên</div>
                <div className="text-lg font-bold">App Store</div>
              </div>
            </button>

            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
              <Smartphone size={24} />
              <div className="text-left">
                <div className="text-xs">Tải trên</div>
                <div className="text-lg font-bold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
