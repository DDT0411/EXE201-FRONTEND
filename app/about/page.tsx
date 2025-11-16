"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Users, Target, Heart } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function AboutPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fadeInDown">{t("about.title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t("about.subtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t("about.storyTitle")}</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            {t("about.story1")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
            {t("about.story2")}
          </p>
          
          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg mt-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông tin liên hệ</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h4>
                <p className="text-gray-600 dark:text-gray-400">Nhiptxss180835@fpt.edu.vn</p>
                  <p className="text-gray-600 dark:text-gray-400">Phuongnyss180679@fpt.edu.vn</p>
                  <p className="text-gray-600 dark:text-gray-400">theddse183048@fpt.edu.vn</p>
                  <p className="text-gray-600 dark:text-gray-400">MinhNHSE183472@fpt.edu.vn</p>
                  <p className="text-gray-600 dark:text-gray-400">huycgse183043@fpt.edu.vn</p>
                  <p className="text-gray-600 dark:text-gray-400">anhvplse172545@fpt.edu.vn</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Số điện thoại</h4>
                <p className="text-gray-600 dark:text-gray-400">0909090909</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Địa chỉ</h4>
                <p className="text-gray-600 dark:text-gray-400">7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh 700000</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Giờ làm việc</h4>
                <p className="text-gray-600 dark:text-gray-400">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                <p className="text-gray-600 dark:text-gray-400">Thứ 7 - Chủ nhật: 10:00 - 16:00</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section className="bg-orange-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{t("about.valuesTitle")}</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("about.value1Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("about.value1Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Value 2 */}
            <ScrollReveal direction="up" delay={200}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("about.value2Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("about.value2Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Value 3 */}
            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("about.value3Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("about.value3Desc")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
