import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Về EatIT</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Khám phá câu chuyện đằng sau ứng dụng yêu thích của bạn
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            EatIT được sinh ra từ một ý tưởng đơn giản: giúp mọi người tìm kiếm những món ăn ngon mà không phải mất thời
            gian lâu để quyết định. Chúng tôi hiểu rằng việc chọn nơi ăn có thể là một thách thức, đặc biệt là khi bạn
            không biết bạn muốn ăn gì.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            Với EatIT, bạn có thể dễ dàng khám phá những nhà hàng và quán ăn tuyệt vời, xem đánh giá từ những người dùng
            khác, và thậm chí nhận được gợi ý ngẫu nhiên khi bạn không thể quyết định. Chúng tôi cam kết cung cấp trải
            nghiệm tốt nhất cho bạn.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-orange-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Giá trị của chúng tôi</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Đam mê</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi đam mê về ẩm thực và muốn chia sẻ niềm đam mê đó với bạn.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mục tiêu</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mục tiêu của chúng tôi là giúp bạn tìm kiếm những trải nghiệm ẩm thực tuyệt vời.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cộng đồng</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chúng tôi tin vào sức mạnh của cộng đồng và những đánh giá thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
