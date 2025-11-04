"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { registerUser, validatePassword } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function SignupPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const router = useRouter()

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [passwordValidation, setPasswordValidation] = useState<ReturnType<typeof validatePassword>>({
    isValid: false,
    errors: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")

    // Validate password in real-time
    if (name === "password") {
      const validation = validatePassword(value)
      setPasswordValidation(validation)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(language === "vi" ? "Mật khẩu không khớp" : "Passwords do not match")
      return
    }

    // Validate password requirements
    if (!passwordValidation.isValid) {
      setError(
        language === "vi"
          ? "Mật khẩu không đáp ứng yêu cầu. Vui lòng kiểm tra lại."
          : "Password does not meet requirements. Please check again."
      )
      return
    }

    setIsLoading(true)

    try {
      await registerUser({
        UserName: formData.userName,
        Email: formData.email,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
      })

      // Success - show toast and redirect to login
      toast.success(
        language === "vi" ? "Đăng ký thành công!" : "Registration successful!"
      )
      router.push("/login")
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        toast.error(err.message)
      } else {
        const errorMsg =
          language === "vi"
            ? "Đăng ký thất bại. Vui lòng thử lại."
            : "Registration failed. Please try again."
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">{t("auth.signup")}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {language === "vi" ? "Tạo tài khoản EatIT của bạn ngay" : "Create your EatIT account now"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* UserName */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === "vi" ? "Tên người dùng" : "Username"}
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder={language === "vi" ? "Tên người dùng" : "Username"}
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
                    className={`w-full px-4 py-2 pr-11 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-smooth ${
                      formData.password && passwordValidation.isValid
                        ? "border-green-500 focus:ring-green-500"
                        : formData.password && !passwordValidation.isValid
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                    }`}
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
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                      {language === "vi" ? "Yêu cầu mật khẩu:" : "Password requirements:"}
                    </p>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${/^[A-Z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                        {/^[A-Z]/.test(formData.password) ? (
                          <CheckCircle size={14} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="flex-shrink-0" />
                        )}
                        <span>
                          {language === "vi"
                            ? "Bắt đầu bằng chữ in hoa"
                            : "Must start with an uppercase letter"}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${/\d/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
                        {/\d/.test(formData.password) ? (
                          <CheckCircle size={14} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="flex-shrink-0" />
                        )}
                        <span>
                          {language === "vi"
                            ? "Chứa ít nhất 1 số"
                            : "Must contain at least one number"}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500"
                        }`}
                      >
                        {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? (
                          <CheckCircle size={14} className="flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="flex-shrink-0" />
                        )}
                        <span>
                          {language === "vi"
                            ? "Chứa ít nhất 1 ký tự đặc biệt"
                            : "Must contain at least one special character"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
                    className={`w-full px-4 py-2 pr-11 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-smooth ${
                      formData.confirmPassword && formData.password === formData.confirmPassword
                        ? "border-green-500 focus:ring-green-500"
                        : formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-orange-500"
                    }`}
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
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {language === "vi" ? "Mật khẩu không khớp" : "Passwords do not match"}
                  </p>
                )}
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
