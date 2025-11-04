"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Download, Apple, Smartphone } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function MobileAppPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right" delay={100}>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("mobileApp.title")}</h1>
              <p className="text-orange-100 text-lg mb-8">
                {t("mobileApp.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                  <Apple size={24} />
                  <div className="text-left">
                    <div className="text-xs">{t("mobileApp.downloadOn")}</div>
                    <div className="text-lg font-bold">{t("mobileApp.appStore")}</div>
                  </div>
                </button>

                <button className="flex items-center justify-center gap-3 px-8 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition font-semibold">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <div className="text-xs">{t("mobileApp.downloadOn")}</div>
                    <div className="text-lg font-bold">{t("mobileApp.googlePlay")}</div>
                  </div>
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={200}>
            <div className="flex justify-center">
              <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl flex items-center justify-center shadow-2xl">
                <img
                  src="/placeholder.svg?height=384&width=256"
                  alt="Mobile app"
                  className="w-full h-full rounded-3xl object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              {t("mobileApp.featuresTitle")}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <ScrollReveal direction="up" delay={100}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("mobileApp.feature1Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("mobileApp.feature1Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 2 */}
            <ScrollReveal direction="up" delay={200}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("mobileApp.feature2Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("mobileApp.feature2Desc")}
                </p>
              </div>
            </ScrollReveal>

            {/* Feature 3 */}
            <ScrollReveal direction="up" delay={300}>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 text-center hover:shadow-xl transition-smooth hover:scale-105">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-orange-600 dark:text-orange-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("mobileApp.feature3Title")}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("mobileApp.feature3Desc")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="bg-orange-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{t("mobileApp.screenshotsTitle")}</h2>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i, index) => {
              const delayMap = [100, 200, 300, 400] as const
              const delay = delayMap[index % delayMap.length]
              return (
                <ScrollReveal key={i} direction="up" delay={delay}>
                  <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-smooth">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={`/placeholder.svg?height=300&width=200&query=app-screenshot-${i}`}
                        alt={`Screenshot ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t("mobileApp.readyTitle")}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            {t("mobileApp.readyDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
              <Apple size={24} />
              <div className="text-left">
                <div className="text-xs">{t("mobileApp.downloadOn")}</div>
                <div className="text-lg font-bold">{t("mobileApp.appStore")}</div>
              </div>
            </button>

            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold">
              <Smartphone size={24} />
              <div className="text-left">
                <div className="text-xs">{t("mobileApp.downloadOn")}</div>
                <div className="text-lg font-bold">{t("mobileApp.googlePlay")}</div>
              </div>
            </button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
