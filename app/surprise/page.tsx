"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Sparkles, RotateCw, MapPin, Lock, Utensils, ArrowRight, ChefHat } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { getFoodSuggestion, FoodSuggestion, getPremiumStatus } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"

export default function SurprisePage() {
  const { language } = useLanguage()
  const { token, user } = useAuth()
  const router = useRouter()
  const t = (key: string) => getTranslation(language, key)
  const [hasClicked, setHasClicked] = useState(false)
  const [recommendedFood, setRecommendedFood] = useState<FoodSuggestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [radiusKm, setRadiusKm] = useState(20)
  const [isPremium, setIsPremium] = useState(false)
  const [dailyUsage, setDailyUsage] = useState(0)
  const [checkingPremium, setCheckingPremium] = useState(true)

  // Check premium status on mount
  useEffect(() => {
    const checkPremium = async () => {
      if (!token) {
        setCheckingPremium(false)
        return
      }
      try {
        const status = await getPremiumStatus(token)
        setIsPremium(status.hasPremium)
      } catch (err) {
        console.error("Failed to check premium status:", err)
        setIsPremium(false)
      } finally {
        setCheckingPremium(false)
      }
    }
    checkPremium()
  }, [token])

  // Load daily usage from localStorage
  useEffect(() => {
    if (user?.userId) {
      const today = new Date().toDateString()
      const stored = localStorage.getItem(`ai_usage_${user.userId}_${today}`)
      if (stored) {
        setDailyUsage(parseInt(stored, 10))
      }
    }
  }, [user])

  const handleRecommendation = async () => {
    if (!token) {
      toast.error(language === "vi" ? "Vui lòng đăng nhập để sử dụng tính năng này" : "Please login to use this feature")
      return
    }

    // Check daily limit for free users
    if (!isPremium) {
      const today = new Date().toDateString()
      const stored = localStorage.getItem(`ai_usage_${user?.userId}_${today}`)
      const usage = stored ? parseInt(stored, 10) : 0
      
      if (usage >= 2) {
        toast.error(
          language === "vi" 
            ? "Bạn đã sử dụng hết 2 lần miễn phí hôm nay. Vui lòng nâng cấp lên Premium để sử dụng không giới hạn!"
            : "You've used all 2 free uses today. Please upgrade to Premium for unlimited access!"
        )
        return
      }
    }

    setIsLoading(true)
    setHasClicked(true)
    setError(null)

    try {
      const suggestion = await getFoodSuggestion(radiusKm, token)
      setRecommendedFood(suggestion)
      
      // Update daily usage for free users
      if (!isPremium && user?.userId) {
        const today = new Date().toDateString()
        const stored = localStorage.getItem(`ai_usage_${user.userId}_${today}`)
        const usage = stored ? parseInt(stored, 10) : 0
        const newUsage = usage + 1
        localStorage.setItem(`ai_usage_${user.userId}_${today}`, newUsage.toString())
        setDailyUsage(newUsage)
        
        if (newUsage === 2) {
          toast.info(
            language === "vi"
              ? "Bạn đã sử dụng hết lượt miễn phí hôm nay. Nâng cấp Premium để sử dụng không giới hạn!"
              : "You've used all free uses today. Upgrade to Premium for unlimited access!"
          )
        }
      }
    } catch (err) {
      console.error("Failed to get food suggestion:", err)
      const fallbackMessage =
        language === "vi"
          ? "Không thể lấy gợi ý. Vui lòng thử lại sau."
          : "We couldn't fetch a suggestion. Please try again later."

      let displayMessage = fallbackMessage

      if (err instanceof Error) {
        const rawMessage = err.message || ""
        const unexpectedShape = rawMessage.toLowerCase().includes("unexpected response shape")

        if (unexpectedShape) {
          displayMessage =
            language === "vi"
              ? "Oops! AI chưa tìm được món phù hợp lúc này. Bạn hãy thử lại sau một chút nhé."
              : "Oops! We couldn’t find a suitable dish right now. Please try again shortly."
        } else {
          displayMessage = rawMessage
        }
      }

      setError(displayMessage)
      toast.error(displayMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryAgain = () => {
    setHasClicked(false)
    setRecommendedFood(null)
    setError(null)
  }

  const radiusOptions = [5, 10, 20, 30]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <Header />

      {/* Header Section with animated background */}
      <section className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 dark:from-orange-600 dark:via-orange-700 dark:to-orange-600 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <ScrollReveal direction="down" className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-white animate-pulse" size={40} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">{t("surprise.title")}</h1>
          </div>
          <p className="text-orange-100 text-lg sm:text-xl mb-4 font-medium">{t("surprise.subtitle")}</p>
          <p className="text-orange-50 text-base sm:text-lg max-w-2xl mx-auto">{t("surprise.description")}</p>
        </ScrollReveal>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Center Image/Food Display */}
          <ScrollReveal direction="up" delay={200} className="mb-8">
            <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center">
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
                    {/* Food/Dish Section - Prominent */}
                    <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 p-8 sm:p-10 border-b-4 border-orange-500">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Utensils className="text-white" size={40} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <ChefHat className="text-orange-500" size={24} />
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                              {language === "vi" ? "Món ăn được đề xuất" : "Recommended Dish"}
                            </span>
                          </div>
                          {recommendedFood.dishId ? (
                            <Link 
                              href={`/food/${recommendedFood.dishId}`}
                              className="group block"
                            >
                              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                                {recommendedFood.suggestion}
                              </h2>
                              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold group-hover:gap-4 transition-all duration-300">
                                <span>{language === "vi" ? "Xem chi tiết món ăn" : "View dish details"}</span>
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                              </div>
                            </Link>
                          ) : (
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                              {recommendedFood.suggestion}
                            </h2>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Section - Secondary */}
                    <div className="p-6 sm:p-8">
                      <div className="bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md">
                              <img
                                src={recommendedFood.restaurantImg || "/placeholder.svg"}
                                alt={recommendedFood.resName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="text-orange-500" size={20} />
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                {language === "vi" ? "Tại quán ăn" : "At Restaurant"}
                              </span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {recommendedFood.resName}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                              <MapPin size={18} />
                              <span className="text-sm sm:text-base">{recommendedFood.resAddress}</span>
                            </div>
                            {recommendedFood.distanceDisplay && (
                              <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                                  📍 {recommendedFood.distanceDisplay}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                          onClick={handleTryAgain}
                          className="flex-1 py-3 px-6 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-full hover:bg-orange-50 dark:hover:bg-slate-700 transition font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                        >
                          <RotateCw size={20} />
                          {t("surprise.tryAgain")}
                        </button>
                        {recommendedFood.dishId && (
                          <Link
                            href={`/food/${recommendedFood.dishId}`}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                          >
                            <span>{language === "vi" ? "Xem chi tiết" : "View Details"}</span>
                            <ArrowRight size={20} />
                          </Link>
                        )}
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
                      className="inline-flex items-center gap-2 py-3 px-6 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold hover:scale-105 active:scale-95"
                    >
                      <RotateCw size={20} />
                      Thử lại
                    </button>
                  </div>
                </ScrollReveal>
              ) : null}
            </div>
          </ScrollReveal>

          {/* Radius Selection Buttons and Usage Info */}
          {!hasClicked && (
            <ScrollReveal direction="up" delay={300} className="mb-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto border border-orange-100 dark:border-orange-900">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
                  {language === "vi" ? "Chọn bán kính tìm kiếm" : "Select Search Radius"}
                </label>
                
                {/* Radius Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {radiusOptions.map((radius) => (
                    <button
                      key={radius}
                      onClick={() => setRadiusKm(radius)}
                      className={`relative py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        radiusKm === radius
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg ring-4 ring-orange-200 dark:ring-orange-800"
                          : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                      }`}
                    >
                      {radius}km
                      {radiusKm === radius && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                          <Sparkles className="text-white" size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {!checkingPremium && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800">
                    {isPremium ? (
                      <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold text-center">
                        {language === "vi" 
                          ? "✨ Bạn đang sử dụng gói Premium - Không giới hạn!" 
                          : "✨ You're using Premium - Unlimited!"}
                      </p>
                    ) : (
                      <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold text-center">
                        {language === "vi" 
                          ? `📊 Đã dùng ${dailyUsage}/2 lần miễn phí hôm nay` 
                          : `📊 Used ${dailyUsage}/2 free uses today`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Action Button - Chốt và Chill */}
          {!hasClicked && (
            <ScrollReveal direction="up" delay={400} className="text-center">
              <button
                onClick={handleRecommendation}
                disabled={isLoading || checkingPremium || (!isPremium && dailyUsage >= 2)}
                className="group relative px-12 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white rounded-full font-bold text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {!isPremium && dailyUsage >= 2 ? (
                    <>
                      <Lock size={28} />
                      {language === "vi" ? "Đã hết lượt - Nâng cấp Premium" : "Limit reached - Upgrade to Premium"}
                      <Lock size={28} />
                    </>
                  ) : (
                    <>
                      <Sparkles className="animate-pulse" size={28} />
                      {t("surprise.buttonText")}
                      <Sparkles className="animate-pulse" size={28} />
                    </>
                  )}
                </span>
                {/* Enhanced Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              </button>
            </ScrollReveal>
          )}

          {/* Premium Info Box */}
          {hasClicked && recommendedFood && !isPremium && (
            <ScrollReveal direction="up" delay={300} className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/20 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center shadow-lg">
                <p className="text-blue-900 dark:text-blue-100 mb-4 font-semibold text-lg">
                  {language === "vi" 
                    ? "Nâng cấp lên Premium để sử dụng tính năng này không giới hạn mỗi ngày!" 
                    : "Upgrade to Premium to use this feature unlimited times per day!"}
                </p>
                <Link
                  href="/choose-plan"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
