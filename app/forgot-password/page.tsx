"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Mail } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { forgotPassword } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function ForgotPasswordPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsSuccess(true)
      toast.success(
        language === "vi" 
          ? "Email đặt lại mật khẩu đã được gửi!" 
          : "Password reset email sent!"
      )
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error(
          language === "vi"
            ? "Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại."
            : "Failed to send reset email. Please try again."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/loginsignupbackground.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 animate-fadeInUp">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                <Mail className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "vi" ? "Quên mật khẩu" : "Forgot Password"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "vi"
                  ? "Nhập email của bạn để nhận link đặt lại mật khẩu"
                  : "Enter your email to receive a password reset link"}
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-400 text-center">
                    {language === "vi"
                      ? "Chúng tôi đã gửi email chứa link đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư."
                      : "We've sent a password reset link to your email. Please check your inbox."}
                  </p>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105"
                >
                  {language === "vi" ? "Quay lại đăng nhập" : "Back to Login"}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("auth.email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold disabled:opacity-50 hover:shadow-lg hover:scale-105"
                >
                  {isLoading
                    ? language === "vi"
                      ? "Đang gửi..."
                      : "Sending..."
                    : language === "vi"
                    ? "Gửi email đặt lại mật khẩu"
                    : "Send Reset Email"}
                </button>
              </form>
            )}

            {/* Back to Login Link */}
            {!isSuccess && (
              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                  {language === "vi" ? "← Quay lại đăng nhập" : "← Back to Login"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

