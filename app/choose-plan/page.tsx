"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ChoosePlanPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free")

  const plans = [
    {
      id: "free",
      name: t("pricing.free"),
      description: t("pricing.freeDesc"),
      price: "0",
      features: [
        language === "vi" ? "Tìm kiếm nhà hàng" : "Restaurant search",
        language === "vi" ? "Xem đánh giá" : "View reviews",
        language === "vi" ? "Lưu yêu thích (5 mục)" : "Save favorites (5 items)",
        language === "vi" ? "Truy cập menu" : "Access menu",
        language === "vi" ? "Gợi ý hàng ngày (2 lần)" : "Daily recommendations (2x)",
      ],
    },
    {
      id: "premium",
      name: t("pricing.premium"),
      description: t("pricing.premiumDesc"),
      price: "29,000",
      period: language === "vi" ? "/tháng" : "/month",
      features: [
        language === "vi" ? "Tất cả tính năng Free" : "All Free features",
        language === "vi" ? "Lưu yêu thích không giới hạn" : "Unlimited favorites",
        language === "vi" ? "Gợi ý hàng ngày không giới hạn" : "Unlimited recommendations",
        language === "vi" ? "Tính năng Surprise" : "Surprise feature",
        language === "vi" ? "Ưu tiên hỗ trợ" : "Priority support",
        language === "vi" ? "Không quảng cáo" : "No ads",
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1 py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 animate-fadeInDown">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("pricing.selectPlan")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              {t("pricing.selectPlanDesc")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 animate-fadeInUp ${
                  selectedPlan === plan.id
                    ? "ring-2 ring-orange-500 shadow-2xl scale-105 sm:scale-100"
                    : "ring-1 ring-gray-200 dark:ring-gray-700 hover:shadow-lg"
                } ${
                  plan.id === "premium"
                    ? "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
                    : "bg-white dark:bg-slate-800"
                }`}
              >
                {plan.id === "premium" && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      {language === "vi" ? "Được Khuyến Nghị" : "Recommended"}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{plan.period}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id as "free" | "premium")}
                  className={`w-full py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 mb-8 text-sm sm:text-base ${
                    selectedPlan === plan.id
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {selectedPlan === plan.id ? t("pricing.chosen") : t("pricing.choose")}
                </button>

                <div className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center animate-fadeInUp">
            <Link
              href={`/profile?plan=${selectedPlan}`}
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
            >
              {language === "vi"
                ? `Tiếp tục với gói ${selectedPlan === "free" ? "Miễn phí" : "Premium"}`
                : `Continue with ${selectedPlan === "free" ? "Free" : "Premium"} plan`}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
