"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function PremiumPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("premium.title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t("premium.subtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Surprise Feature */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left - Feature Description */}
            <ScrollReveal direction="right" delay={100}>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <Sparkles className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t("premium.featureTitle")}</h2>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {t("premium.featureDesc")}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{t("premium.feature1")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{t("premium.feature2")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-orange-500" size={20} />
                    <span className="text-gray-700 dark:text-gray-300">{t("premium.feature3")}</span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="inline-block px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition font-semibold"
                >
                  {t("premium.startNow")}
                </Link>
              </div>
            </ScrollReveal>

            {/* Right - Image */}
            <ScrollReveal direction="left" delay={200}>
              <div className="flex justify-center">
                <div className="w-80 h-80 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=320&width=320"
                    alt="Surprise feature"
                    className="w-full h-full rounded-3xl object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Pricing Plans */}
          <ScrollReveal direction="up" className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              {t("premium.upgradeTitle")}
            </h2>
          </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <ScrollReveal direction="right" delay={100}>
                <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-8 hover:shadow-xl transition-smooth">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("premium.freePlan")}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t("premium.freePlanDesc")}</p>

                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("premium.freePrice")}<span className="text-lg">đ</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.freeFeature1")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.freeFeature2")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.freeFeature3")}</span>
                    </li>
                  </ul>

                  <button className="w-full py-2 border-2 border-orange-500 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-50 dark:hover:bg-slate-700 transition font-semibold">
                    {t("premium.current")}
                  </button>
                </div>
              </ScrollReveal>

              {/* Premium Plan */}
              <ScrollReveal direction="left" delay={200}>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border-2 border-orange-500 p-8 relative hover:shadow-xl transition-smooth">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                    {t("premium.popular")}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("premium.premiumPlan")}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t("premium.premiumPlanDesc")}</p>

                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    {t("premium.premiumPrice")}<span className="text-lg">đ</span>
                    <span className="text-lg text-gray-600 dark:text-gray-400">{t("premium.premiumPeriod")}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.premiumFeature1")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.premiumFeature2")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.premiumFeature3")}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="text-orange-500" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{t("premium.premiumFeature4")}</span>
                    </li>
                  </ul>

                  <button className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
                    {t("premium.upgradeNow")}
                  </button>
                </div>
              </ScrollReveal>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
