"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Sparkles, RotateCw, MapPin } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getFoodSuggestion, FoodSuggestion } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function SurprisePage() {
  const { language } = useLanguage()
  const { token } = useAuth()
  const t = (key: string) => getTranslation(language, key)
  const [hasClicked, setHasClicked] = useState(false)
  const [recommendedFood, setRecommendedFood] = useState<FoodSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRecommendation = async () => {
    setIsLoading(true)
    setHasClicked(true)
    setError(null)

    try {
      const suggestion = await getFoodSuggestion(token || undefined)
      setRecommendedFood(suggestion)
    } catch (err) {
      console.error("Failed to get food suggestion:", err)
      setError("Không thể lấy gợi ý. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryAgain = () => {
    setHasClicked(false)
    setRecommendedFood(null)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Header />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-white animate-pulse" size={40} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{t("surprise.title")}</h1>
          </div>
          <p className="text-orange-100 text-lg sm:text-xl mb-4">{t("surprise.subtitle")}</p>
          <p className="text-orange-50 text-base sm:text-lg max-w-2xl mx-auto">{t("surprise.description")}</p>
        </ScrollReveal>
      </section>

      {/* Main Content - Image/Recommendation Display */}
      <section className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Center Image/Food Display */}
          <ScrollReveal direction="up" delay={200} className="mb-8">
            <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center">
              {/* Default Image or Recommended Food */}
              {!hasClicked ? (
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-900 rounded-3xl blur-3xl opacity-50 animate-pulse-slow"></div>
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl hover:shadow-orange-200 dark:hover:shadow-orange-900 transition-all duration-500 hover:scale-105">
                    <img
                      src="/Button2.png"
                      alt="Ready for recommendation"
                      className="w-full h-full object-contain animate-bounce-slow"
                    />
                  </div>
                </div>
              ) : isLoading ? (
                <div className="relative w-full max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-800 dark:to-orange-900 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
                    <RotateCw className="text-orange-500 animate-spin mb-4" size={48} />
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold text-center">
                      {t("surprise.buttonLoading")}
                    </p>
                    <div className="mt-6 flex gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              ) : recommendedFood ? (
                <ScrollReveal direction="scale" className="w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden hover:shadow-orange-200 dark:hover:shadow-orange-900 transition-all duration-500 animate-fadeInUp">
                    {/* Restaurant Image */}
                    <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 dark:from-slate-700 dark:to-slate-800">
                      <img
                        src={recommendedFood.restaurantImg || "/placeholder.svg"}
                        alt={recommendedFood.resName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    </div>

                    {/* Restaurant Details */}
                    <div className="p-6 sm:p-8">
                      <div className="mb-4">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                          {recommendedFood.suggestion}
                        </h2>
                      </div>

                      {/* Restaurant Info */}
                      <div className="bg-orange-50 dark:bg-slate-900 rounded-xl p-4 mb-6 border border-orange-200 dark:border-orange-800">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{recommendedFood.resName}</h3>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin size={18} />
                          <span>{recommendedFood.resAddress}</span>
                        </div>
                        {recommendedFood.distanceDisplay && (
                          <span className="text-orange-600 dark:text-orange-400 font-semibold">
                            {recommendedFood.distanceDisplay}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={handleTryAgain}
                          className="flex-1 py-3 px-6 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-50 dark:hover:bg-slate-700 transition font-semibold flex items-center justify-center gap-2"
                        >
                          <RotateCw size={20} />
                          {t("surprise.tryAgain")}
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ) : error ? (
                <ScrollReveal direction="scale" className="w-full">
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-12 text-center">
                    <p className="text-red-600 dark:text-red-400 text-lg mb-6">{error}</p>
                    <button
                      onClick={handleTryAgain}
                      className="inline-flex items-center gap-2 py-3 px-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                    >
                      <RotateCw size={20} />
                      Thử lại
                    </button>
                  </div>
                </ScrollReveal>
              ) : null}
            </div>
          </ScrollReveal>

          {/* Action Button - Chốt và Chill */}
          {!hasClicked && (
            <ScrollReveal direction="up" delay={400} className="text-center">
              <button
                onClick={handleRecommendation}
                className="group relative px-12 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-bold text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="animate-pulse" size={28} />
                  {t("surprise.buttonText")}
                  <Sparkles className="animate-pulse" size={28} />
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </button>
            </ScrollReveal>
          )}

          {/* Premium Info Box */}
          {hasClicked && recommendedFood && (
            <ScrollReveal direction="up" delay={300} className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                <p className="text-blue-900 dark:text-blue-100 mb-4">{t("surprise.premiumMessage")}</p>
                <Link
                  href="/premium"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {t("surprise.upgradePremium")}
                </Link>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
