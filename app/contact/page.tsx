"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function ContactPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header */}
      <section className="bg-orange-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("contact.title")}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t("contact.subtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Content */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-6">
              {/* Email */}
              <ScrollReveal direction="right" delay={100}>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-smooth">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <Mail className="text-orange-600 dark:text-orange-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("contact.email")}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">support@eatit.com</p>
                  <p className="text-gray-600 dark:text-gray-400">info@eatit.com</p>
                </div>
              </ScrollReveal>

              {/* Phone */}
              <ScrollReveal direction="right" delay={200}>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-smooth">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <Phone className="text-orange-600 dark:text-orange-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("contact.phone")}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">+84 (0) 123 456 789</p>
                  <p className="text-gray-600 dark:text-gray-400">+84 (0) 987 654 321</p>
                </div>
              </ScrollReveal>

              {/* Address */}
              <ScrollReveal direction="right" delay={300}>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-smooth">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <MapPin className="text-orange-600 dark:text-orange-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("contact.address")}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">123 Phố Cổ, Hà Nội, Việt Nam</p>
                </div>
              </ScrollReveal>

              {/* Hours */}
              <ScrollReveal direction="right" delay={400}>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 hover:shadow-lg transition-smooth">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <Clock className="text-orange-600 dark:text-orange-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t("contact.hours")}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{t("contact.weekdays")}</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("contact.weekends")}</p>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <ScrollReveal direction="left" delay={100} className="md:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 hover:shadow-lg transition-smooth">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("contact.sendMessage")}</h2>

                {submitSuccess && (
                  <ScrollReveal direction="up">
                    <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-100">
                      {t("contact.successMessage")}
                    </div>
                  </ScrollReveal>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <ScrollReveal direction="up" delay={100}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("contact.nameLabel")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("contact.namePlaceholder")}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </ScrollReveal>

                  {/* Email */}
                  <ScrollReveal direction="up" delay={200}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("auth.email")}</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </ScrollReveal>

                  {/* Subject */}
                  <ScrollReveal direction="up" delay={300}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("contact.subjectLabel")}</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t("contact.subjectPlaceholder")}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </ScrollReveal>

                  {/* Message */}
                  <ScrollReveal direction="up" delay={400}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("contact.messageLabel")}</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t("contact.messagePlaceholder")}
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      ></textarea>
                    </div>
                  </ScrollReveal>

                  {/* Submit Button */}
                  <ScrollReveal direction="up" delay={500}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
                    >
                      {isSubmitting ? t("contact.sending") : t("contact.send")}
                    </button>
                  </ScrollReveal>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
