"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

export default function PremiumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Hoặc có thể là một lựa chọn bất ngờ</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Khám phá tính năng Surprise - Gợi ý món ăn ngẫu nhiên dựa trên sở thích của bạn
          </p>
        </div>
      </section>

      {/* Surprise Feature */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Feature Description */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <Sparkles className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Surprise</h2>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Hôm nay dùng hỏi 'ăn gì', vì mình sẽ không trả lời đầu. Bữa ăn hôm nay không nằm trong mọi dự đoán của
                bạn. Nó có thể khiến bạn ngạc nhiên, khiến bạn tự hỏi: 'Ưa sao nơm dữ vậy?' Dù thế nào đi nữa, hãy chuẩn
                bị tinh thần cho tấm trăng của bạn bùng nổ như đang trưởng vị giác vậy!
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="text-orange-500" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Gợi ý ngẫu nhiên mỗi ngày</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-orange-500" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Dựa trên sở thích của bạn</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-orange-500" size={20} />
                  <span className="text-gray-700 dark:text-gray-300">Khám phá những món ăn mới</span>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
              >
                Bắt đầu ngay
              </Link>
            </div>

            {/* Right - Image */}
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=320&width=320"
                  alt="Surprise feature"
                  className="w-full h-full rounded-3xl object-cover"
                />
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Nâng cấp lên một phiên bản cao hơn
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Miễn phí</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Hoàn hảo để bắt đầu</p>

                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  0<span className="text-lg">đ</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Miễn phí 2 lần sử dụng mỗi ngày</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Xem menu và đánh giá</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Lưu yêu thích</span>
                  </li>
                </ul>

                <button className="w-full py-2 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition font-semibold">
                  Hiện tại
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-orange-500 p-8 relative">
                <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                  Phổ biến
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Được sử dụng Surprise không giới hạn sử dụng</p>

                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  29,000<span className="text-lg">đ</span>
                  <span className="text-lg text-gray-600 dark:text-gray-400">/tháng</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Surprise không giới hạn</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Gợi ý AI thông minh</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Ưu tiên hỗ trợ</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">Không quảng cáo</span>
                  </li>
                </ul>

                <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
                  Nâng cấp ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
