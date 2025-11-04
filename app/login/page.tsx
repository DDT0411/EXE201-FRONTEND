"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/lib/toast"

export default function LoginPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await loginUser({
        Email: email,
        Password: password,
      })

      // Save token and user info
      login(response.token, response.user)

      toast.success(
        language === "vi" ? "Đăng nhập thành công!" : "Login successful!"
      )

      // Always redirect to onboarding for demo/testing (removed onboarding_completed check)
      router.push("/onboarding")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        const errorMsg =
          language === "vi"
            ? "Đăng nhập thất bại. Vui lòng thử lại."
            : "Login failed. Please try again."
        setError(errorMsg)
        toast.error(errorMsg)
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
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 animate-fadeInUp backdrop-blur-sm bg-white/95 dark:bg-slate-800/95">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">{t("auth.login")}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {language === "vi" ? "Chào mừng bạn quay lại EatIT" : "Welcome back to EatIT"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-smooth focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "vi" ? "Ghi Nhớ tôi" : "Remember me"}
                  </span>
                </label>
                <Link href="/forgot-password" className="text-sm text-orange-600 dark:text-orange-400 hover:underline">
                  {language === "vi" ? "Quên mật khẩu?" : "Forgot password?"}
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold disabled:opacity-50 hover:shadow-lg hover:scale-105"
              >
                {isLoading
                  ? language === "vi"
                    ? "Đang đăng nhập..."
                    : "Logging in..."
                  : t("auth.login")}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">{language === "vi" ? "hoặc" : "or"}</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
              {t("auth.noAccount")}{" "}
              <Link href="/signup" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                {t("auth.signup")}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
