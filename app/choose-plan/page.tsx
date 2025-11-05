"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Check } from "lucide-react"
import { useState } from "react"
import { toast } from "@/lib/toast"
import { useAuth } from "@/hooks/use-auth"
import { createPremiumPayment } from "@/lib/api"

export default function ChoosePlanPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<"free" | "premium">("free")
  const { token, isAuthenticated } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleContinue = async () => {
    if (selectedPlan === "free") {
      toast.success(language === "vi" ? "Chọn gói Miễn phí thành công!" : "Free plan selected successfully!")
      router.push("/profile")
      return
    }

    if (!isAuthenticated || !token) {
      toast.error(language === "vi" ? "Vui lòng đăng nhập để mua Premium" : "Please log in to purchase Premium")
      router.push("/login")
      return
    }

    try {
      setIsProcessing(true)
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const checkout = await createPremiumPayment(
        {
          ReturnUrl: `${origin}/payment/success`,
          CancelUrl: `${origin}/choose-plan`,
        },
        token
      )
      // Open PayOS checkout in a new tab as per your flow
      if (checkout.checkoutUrl) {
        window.open(checkout.checkoutUrl, "_blank")
        toast.info(language === "vi" ? "Đã mở trang thanh toán" : "Checkout opened in a new tab")
      }
    } catch (err: any) {
      toast.error(err?.message || (language === "vi" ? "Không thể tạo thanh toán" : "Failed to create payment"))
    } finally {
      setIsProcessing(false)
    }
  }

  const plans = [
    {
      id: "free",
      name: t("pricing.free"),
      description: t("pricing.freeDesc"),
      price: "0",
      features: [
        t("pricing.featureFree1"),
        t("pricing.featureFree2"),
        t("pricing.featureFree3"),
        t("pricing.featureFree4"),
        t("pricing.featureFree5"),
      ],
    },
    {
      id: "premium",
      name: t("pricing.premium"),
      description: t("pricing.premiumDesc"),
      price: "29,000",
      period: t("pricing.period"),
      features: [
        t("pricing.featurePremium1"),
        t("pricing.featurePremium2"),
        t("pricing.featurePremium3"),
        t("pricing.featurePremium4"),
        t("pricing.featurePremium5"),
        t("pricing.featurePremium6"),
      ],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1 py-8 sm:py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal direction="down" className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("pricing.selectPlan")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
              {t("pricing.selectPlanDesc")}
            </p>
          </ScrollReveal>

          {/* Pricing Cards */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {plans.map((plan, index) => {
              const delayMap = [100, 200] as const
              const delay = delayMap[index % delayMap.length]
              return (
                <ScrollReveal key={plan.id} direction="up" delay={delay}>
                  <div
                    className={`relative rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
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
                          {t("pricing.recommended")}
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
                </ScrollReveal>
              )
            })}
          </div>

          {/* CTA Button */}
          <ScrollReveal direction="up" delay={300} className="text-center">
            <button
              onClick={handleContinue}
              disabled={isProcessing}
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 hover:shadow-lg hover:scale-105 text-sm sm:text-base disabled:opacity-60"
            >
              {isProcessing
                ? (language === "vi" ? "Đang tạo thanh toán..." : "Creating payment...")
                : t("pricing.continueWith").replace("{plan}", selectedPlan === "free" ? t("pricing.free") : t("pricing.premium"))}
            </button>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  )
}
