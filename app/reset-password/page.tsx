"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { resetPassword, verifyResetToken } from "@/lib/api"
import { toast } from "@/lib/toast"

function ResetPasswordContent() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [token, setToken] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const tokenParam = searchParams.get("token")
      const emailParam = searchParams.get("email")

      if (!tokenParam || !emailParam) {
        toast.error(
          language === "vi"
            ? "Link đặt lại mật khẩu không hợp lệ"
            : "Invalid password reset link"
        )
        setIsValidToken(false)
        setIsVerifying(false)
        return
      }

      setToken(tokenParam)
      setEmail(emailParam)

      try {
        await verifyResetToken(tokenParam, emailParam)
        setIsValidToken(true)
      } catch (err) {
        setIsValidToken(false)
        if (err instanceof Error) {
          toast.error(err.message)
        }
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams, language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error(
        language === "vi" ? "Mật khẩu không khớp" : "Passwords do not match"
      )
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({
        token,
        email,
        newPassword,
        confirmPassword,
      })

      toast.success(
        language === "vi" ? "Đặt lại mật khẩu thành công!" : "Password reset successful!"
      )

      // Redirect to login after successful reset
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error(
          language === "vi"
            ? "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
            : "Password reset failed. Please try again."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "vi" ? "Đang xác minh..." : "Verifying..."}
          </p>
        </div>
      </div>
    )
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src="/loginsignupbackground.jpg" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 animate-fadeInUp text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mb-4">
                <Lock className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "vi" ? "Link không hợp lệ" : "Invalid Link"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {language === "vi"
                  ? "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới."
                  : "The reset link is invalid or expired. Please request a new one."}
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105"
              >
                {language === "vi" ? "Yêu cầu link mới" : "Request New Link"}
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                <Lock className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "vi" ? "Đặt lại mật khẩu" : "Reset Password"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === "vi"
                  ? "Nhập mật khẩu mới của bạn"
                  : "Enter your new password"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "vi" ? "Mật khẩu mới" : "New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "vi" ? "Xác nhận mật khẩu" : "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-smooth focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold disabled:opacity-50 hover:shadow-lg hover:scale-105"
              >
                {isLoading
                  ? language === "vi"
                    ? "Đang đặt lại..."
                    : "Resetting..."
                  : language === "vi"
                  ? "Đặt lại mật khẩu"
                  : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

