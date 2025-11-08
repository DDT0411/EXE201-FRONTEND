"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"
import { getPremiumStatus } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function OnboardingPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()

  const [formData, setFormData] = useState({
    preference: "",
    dislike: "",
    allergy: "",
    diet: "",
    isVegetarian: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check if user needs onboarding (move redirect logic to useEffect)
  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) return
      
      // Check if user is not logged in
      if (!user || !token) {
        router.push("/login")
        return
      }

      try {
        // Check if user is premium
        const premiumStatus = await getPremiumStatus(token)
        if (!premiumStatus.hasPremium) {
          toast.error(language === "vi" 
            ? "Bạn cần nâng cấp tài khoản Premium để sử dụng tính năng này" 
            : "You need to upgrade to Premium to use this feature")
          router.push("/choose-plan")
          return
        }

        // Check if user already filled preferences before
        const hasFilledPrefs = localStorage.getItem(`preferences_completed_${user.userId}`)
        if (hasFilledPrefs === "true") {
          router.push("/")
          return
        }

        setIsChecking(false)

      } catch (error) {
        console.error("Error checking access:", error)
        toast.error(language === "vi"
          ? "Có lỗi xảy ra. Vui lòng thử lại sau."
          : "An error occurred. Please try again later.")
        router.push("/")
      }
    }

    checkAccess()
  }, [user, token, authLoading, router, language])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      toast.error(language === "vi" ? "Phiên đăng nhập đã hết hạn" : "Session expired")
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      // If all fields are empty and not vegetarian, skip API call
      const hasData = formData.preference || formData.dislike || formData.allergy || formData.diet || formData.isVegetarian
      
      if (!hasData) {
        // User skipped everything, mark onboarding as completed and go to choose plan
        if (user?.userId) {
          localStorage.setItem(`onboarding_completed_${user.userId}`, "true")
        }
        router.push("/choose-plan")
        setIsLoading(false)
        return
      }
      // Create FormData
      const formDataToSend = new FormData()
      formDataToSend.append("UserName", user?.userName || "")
      formDataToSend.append("UserAddress", "none") // Remove address field
      formDataToSend.append("Preference", formData.preference || "none")
      formDataToSend.append("Dislike", formData.dislike || "none")
      formDataToSend.append("Allergy", formData.allergy || "none")
      formDataToSend.append("Diet", formData.diet || "none")
      formDataToSend.append("IsVegetarian", formData.isVegetarian.toString())

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      const data = await response.json()

      if (response.ok) {
        // Mark onboarding as completed
        if (user?.userId) {
          localStorage.setItem(`onboarding_completed_${user.userId}`, "true")
        }
        toast.success(
          language === "vi"
            ? "Thông tin đã được lưu!"
            : "Information saved!"
        )
        // Redirect to choose plan page
        router.push("/choose-plan")
      } else {
        throw new Error(data.message || "Failed to update profile")
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          language === "vi"
            ? "Cập nhật thông tin thất bại. Vui lòng thử lại."
            : "Failed to update profile. Please try again."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (isChecking || authLoading || !user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "vi" ? "Đang tải..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Header />

      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Welcome Message */}
          <ScrollReveal direction="down" className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "vi"
                ? `Xin chào, ${user.userName}!`
                : `Hello, ${user.userName}!`}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              {language === "vi"
                ? "Chúng tôi cần một số thông tin nhằm tối ưu hóa quá trình gợi ý món ăn cho riêng bạn."
                : "We need some information to optimize the food recommendation process for you."}
            </p>
          </ScrollReveal>

          <form id="onboarding-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Question 1: Favorite Food */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === "vi"
                    ? "1. Món ăn yêu thích của bạn là gì?"
                    : "1. What is your favorite food?"}
                </label>
                <textarea
                  name="preference"
                  value={formData.preference}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Ví dụ: Phở, Bánh mì, Pizza..."
                      : "e.g., Pho, Bread, Pizza..."
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                />
              </div>
            </ScrollReveal>

            {/* Question 2: Disliked Food */}
            <ScrollReveal direction="up" delay={200}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === "vi"
                    ? "2. Có món nào bạn không thích (hoặc không ăn được) không?"
                    : "2. Are there any foods you don't like (or can't eat)?"}
                </label>
                <textarea
                  name="dislike"
                  value={formData.dislike}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Ví dụ: Đồ cay, Đồ ngọt, Hải sản..."
                      : "e.g., Spicy food, Sweet food, Seafood..."
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {language === "vi"
                    ? "(Để trống nếu không có)"
                    : "(Leave blank if none)"}
                </p>
              </div>
            </ScrollReveal>

            {/* Question 3: Allergies */}
            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === "vi"
                    ? "3. Bạn có bị dị ứng với loại thực phẩm nào không?"
                    : "3. Do you have any food allergies?"}
                </label>
                <textarea
                  name="allergy"
                  value={formData.allergy}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Ví dụ: Đậu phộng, Tôm, Sữa..."
                      : "e.g., Peanuts, Shrimp, Milk..."
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {language === "vi"
                    ? "(Để trống nếu không có)"
                    : "(Leave blank if none)"}
                </p>
              </div>
            </ScrollReveal>

            {/* Question 4: Special Diet */}
            <ScrollReveal direction="up" delay={400}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {language === "vi"
                    ? "4. Bạn có đang theo một chế độ ăn kiêng đặc biệt nào không?"
                    : "4. Are you following any special diet?"}
                </label>
                <textarea
                  name="diet"
                  value={formData.diet}
                  onChange={handleChange}
                  placeholder={
                    language === "vi"
                      ? "Ví dụ: Keto, Low-carb, Vegan..."
                      : "e.g., Keto, Low-carb, Vegan..."
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {language === "vi"
                    ? "(Để trống nếu không có)"
                    : "(Leave blank if none)"}
                </p>
              </div>
            </ScrollReveal>

            {/* Vegetarian Checkbox */}
            <ScrollReveal direction="up" delay={500}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    {language === "vi"
                      ? "Tôi là người ăn chay"
                      : "I am vegetarian"}
                  </span>
                </label>
              </div>
            </ScrollReveal>

          </form>

          {/* Action Button - Fixed at bottom */}
          <div className="mt-12 mb-8 flex justify-center items-center">
            {/* Submit/Continue Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                const form = document.getElementById("onboarding-form") as HTMLFormElement
                if (form) {
                  form.requestSubmit()
                }
              }}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? language === "vi"
                  ? "Đang lưu..."
                  : "Saving..."
                : language === "vi"
                ? "Tiếp theo"
                : "Continue"}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

