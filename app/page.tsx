"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, MapPin, Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getTags, Tag } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"

export default function Home() {
  const { language } = useLanguage()
  const { token, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const t = (key: string) => getTranslation(language, key)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const handleTagClick = (tagId: number) => {
    if (!token) {
      toast.error(
        language === "vi" ? "Vui lòng đăng nhập để xem quán ăn trong danh mục này" : "Please log in to view restaurants in this category"
      )
      router.push("/login")
      return
    }
    router.push(`/tag/${tagId}`)
  }

  // Fetch popular tags
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    const fetchTags = async () => {
      setIsLoadingTags(true)
      try {
        const tagsData = await getTags(token || undefined)
        // Show first 6 tags
        setTags(tagsData.slice(0, 6))
      } catch (err) {
        console.error("Failed to fetch tags:", err)
      } finally {
        setIsLoadingTags(false)
      }
    }

    fetchTags()
  }, [token, authLoading])

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
        <ScrollReveal direction="up" className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4">
            {t("home.about")}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <ScrollReveal direction="right" delay={100} className="flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 flex items-center justify-center transition-smooth hover:scale-105 hover:shadow-lg">
              <img
                src="/Button3.png"
                alt="EatIT mascot"
                className="w-full h-full object-contain"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={200}>
            <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              {t("home.aboutDesc")}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {t("home.aboutDesc2")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-orange-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.features")}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <ScrollReveal direction="up" delay={100}>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <MapPin className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">{t("home.feature1")}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t("home.feature1Desc")}
              </p>
            </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal direction="up" delay={200}>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <ChefHat className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">{t("home.feature2")}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t("home.feature2Desc")}
              </p>
            </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal direction="up" delay={300}>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center hover:shadow-xl transition-smooth hover:scale-105 hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center transition-smooth hover:scale-110">
                  <Sparkles className="text-orange-600 dark:text-orange-400" size={28} />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">{t("home.feature3")}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t("home.feature3Desc")}
              </p>
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      {tags.length > 0 && (
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "vi" ? "Khám phá theo loại món" : "Explore by Category"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "vi" ? "Chọn loại món ăn yêu thích của bạn" : "Choose your favorite food category"}
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {tags.map((tag, index) => {
                const delayMap = [100, 200, 300, 400, 500] as const
                const delay = delayMap[index % delayMap.length]
                return (
                  <ScrollReveal key={tag.tagID} direction="up" delay={delay}>
                    <button
                      type="button"
                      onClick={() => handleTagClick(tag.tagID)}
                      className="group w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={tag.tagImg || "/placeholder.svg"}
                          alt={tag.tagName}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                          {tag.tagName}
                        </h3>
                      </div>
                    </button>
                  </ScrollReveal>
                )
              })}
            </div>

            {!isLoadingTags && (
              <ScrollReveal direction="up" delay={300} className="text-center mt-8">
                <Link
                  href="/menu"
                  className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-smooth hover:shadow-lg hover:scale-105 font-semibold text-base sm:text-lg"
                >
                  {t("home.exploreMenu")}
                </Link>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
