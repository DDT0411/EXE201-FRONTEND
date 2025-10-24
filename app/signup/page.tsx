"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function SignupPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert(language === "vi" ? "Mật khẩu không khớp" : "Passwords do not match")
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/choose-plan"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 animate-fadeInUp">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">{t("auth.signup")}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {language === "vi" ? "Tạo tài khoản EatIT của bạn ngay" : "Create your EatIT account now"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "vi" ? "Tên đầy đủ" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === "vi" ? "Nguyễn Văn A" : "John Doe"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-smooth"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.confirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-smooth"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 mt-1" required />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === "vi" ? "Tôi đồng ý với" : "I agree to"}{" "}
                  <Link href="/terms" className="text-orange-600 dark:text-orange-400 hover:underline">
                    {t("footer.terms")}
                  </Link>{" "}
                  {language === "vi" ? "và" : "and"}{" "}
                  <Link href="/privacy" className="text-orange-600 dark:text-orange-400 hover:underline">
                    {t("footer.privacy")}
                  </Link>
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold disabled:opacity-50 hover:shadow-lg hover:scale-105"
              >
                {isLoading ? (language === "vi" ? "Đang đăng ký..." : "Signing up...") : t("auth.signup")}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              {t("auth.haveAccount")}{" "}
              <Link href="/login" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
