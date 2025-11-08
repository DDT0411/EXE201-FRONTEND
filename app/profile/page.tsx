"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Settings, LogOut, Heart, Globe, Sparkles, CreditCard } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { languages } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, updateUserProfile, logoutUser, changePassword, UserProfile, ChangePasswordParams, getPaymentHistory, PaymentHistoryItem } from "@/lib/api"
import { toast } from "@/lib/toast"

function ProfileContent() {
  const { language, changeLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user: authUser, token, logout } = useAuth()

  const [activeTab, setActiveTab] = useState("profile")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPersonalization, setIsLoadingPersonalization] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    userAddress: "",
    preference: "",
    dislike: "",
    allergy: "",
    diet: "",
  })

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "settings") {
      setActiveTab("profile")
    }
  }, [searchParams])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser || !token) {
        setIsFetching(false)
        return
      }

      try {
        const profile = await getUserProfile(authUser.userId, token)
        setUserProfile(profile)
        setFormData({
          userName: profile.userName || "",
          email: profile.email || "",
          phoneNumber: profile.phoneNumber || "",
          password: profile.password || "",
          userAddress: profile.userAddress || "",
          preference: profile.preference || "",
          dislike: profile.dislike || "",
          allergy: profile.allergy || "",
          diet: profile.diet || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error(
          language === "vi"
            ? "Không thể tải thông tin người dùng"
            : "Failed to load user information"
        )
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [authUser, token, language])

  // Fetch payment history
  useEffect(() => {
    const fetchPayments = async () => {
      if (!token) return
      try {
        setLoadingPayments(true)
        const res = await getPaymentHistory(token)
        setPaymentHistory(res.payments || [])
      } catch (e) {
        console.error("Failed to fetch payment history", e)
      } finally {
        setLoadingPayments(false)
      }
    }
    fetchPayments()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser || !token) {
      toast.error(
        language === "vi" ? "Bạn chưa đăng nhập" : "You are not logged in"
      )
      return
    }

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(
        language === "vi" ? "Mật khẩu mới không khớp" : "New passwords do not match"
      )
      return
    }

    setIsChangingPassword(true)
    try {
      await changePassword(passwordData, token)

      toast.success(
        language === "vi" ? "Đổi mật khẩu thành công!" : "Password changed successfully!"
      )
      
      // Clear password form and close
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordChange(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          language === "vi"
            ? "Đổi mật khẩu thất bại"
            : "Failed to change password"
        )
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser || !token) {
      toast.error(
        language === "vi" ? "Bạn chưa đăng nhập" : "You are not logged in"
      )
      return
    }

    setIsLoading(true)
    try {
      // Update profile info, keeping personalization data from formData
      await updateUserProfile(authUser.userId, {
        UserName: formData.userName,
        Email: formData.email,
        Password: formData.password,
        PhoneNumber: formData.phoneNumber,
        UserAddress: formData.userAddress || "none",
        // Keep personalization data unchanged
        Preference: formData.preference || "",
        Dislike: formData.dislike || "",
        Allergy: formData.allergy || "",
        Diet: formData.diet || "",
      }, token)

      toast.success(
        language === "vi" ? "Cập nhật thành công!" : "Update successful!"
      )
      
      // Refresh profile data
      const profile = await getUserProfile(authUser.userId, token)
      setUserProfile(profile)
      // Update formData with fresh data
      setFormData({
        userName: profile.userName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        password: profile.password || "",
        userAddress: profile.userAddress || "",
        preference: profile.preference || "",
        dislike: profile.dislike || "",
        allergy: profile.allergy || "",
        diet: profile.diet || "",
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          language === "vi"
            ? "Cập nhật thất bại"
            : "Update failed"
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitPersonalization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser || !token) {
      toast.error(
        language === "vi" ? "Bạn chưa đăng nhập" : "You are not logged in"
      )
      return
    }

    setIsLoadingPersonalization(true)
    try {
      // Update personalization info, keeping profile data from formData
      await updateUserProfile(authUser.userId, {
        // Keep profile data unchanged
        UserName: formData.userName,
        Email: formData.email,
        Password: formData.password,
        PhoneNumber: formData.phoneNumber,
        UserAddress: formData.userAddress || "none",
        // Update personalization data
        Preference: formData.preference || "",
        Dislike: formData.dislike || "",
        Allergy: formData.allergy || "",
        Diet: formData.diet || "",
      }, token)

      toast.success(
        language === "vi" ? "Cập nhật thành công!" : "Update successful!"
      )
      
      // Refresh profile data
      const profile = await getUserProfile(authUser.userId, token)
      setUserProfile(profile)
      // Update formData with fresh data
      setFormData({
        userName: profile.userName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        password: profile.password || "",
        userAddress: profile.userAddress || "",
        preference: profile.preference || "",
        dislike: profile.dislike || "",
        allergy: profile.allergy || "",
        diet: profile.diet || "",
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          language === "vi"
            ? "Cập nhật thất bại"
            : "Update failed"
        )
      }
    } finally {
      setIsLoadingPersonalization(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    if (!token) {
      // If no token, just logout locally
      logout()
      router.push("/login")
      return
    }

    try {
      // Call logout API
      await logoutUser(token)
      
      // Logout locally after API call succeeds
      logout()
      
      toast.success(
        language === "vi" ? "Đăng xuất thành công!" : "Logout successful!"
      )
      
      router.push("/login")
    } catch (error) {
      // Even if API fails, logout locally
      logout()
      
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          language === "vi" ? "Có lỗi xảy ra khi đăng xuất" : "An error occurred during logout"
        )
      }
      
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "vi" ? "Đang tải..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sticky top-20 animate-fadeInUp">
                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{userProfile?.userName || authUser?.userName}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{userProfile?.email || authUser?.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "profile" ? "bg-orange-100 text-orange-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <User size={20} />
                    <span>{language === "vi" ? "Hồ sơ" : "Profile"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("personalization")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "personalization" ? "bg-orange-100 text-orange-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Sparkles size={20} />
                    <span>{language === "vi" ? "Cá nhân hóa" : "Personalization"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "favorites" ? "bg-orange-100 text-orange-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Heart size={20} />
                    <span>{language === "vi" ? "Yêu thích" : "Favorites"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "settings" ? "bg-orange-100 text-orange-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Settings size={20} />
                    <span>{t("settings.settings")}</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut size={20} />
                    <span>
                      {isLoggingOut 
                        ? (language === "vi" ? "Đang đăng xuất..." : "Logging out...")
                        : t("nav.logout")
                      }
                    </span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === "vi" ? "Thông tin hồ sơ" : "Profile Information"}
                  </h2>

                  <form onSubmit={handleSubmitProfile} className="space-y-6">
                    <div>
                      <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Tên đầy đủ" : "Full Name"}
                      </label>
                      <input
                        id="userName"
                        name="userName"
                        type="text"
                        value={formData.userName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("auth.email")}</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Số điện thoại" : "Phone Number"}
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Mật khẩu" : "Password"}
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="userAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Địa chỉ" : "Address"}
                      </label>
                      <input
                        id="userAddress"
                        name="userAddress"
                        type="text"
                        value={formData.userAddress === "none" ? "" : formData.userAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        placeholder={language === "vi" ? "Nhập địa chỉ" : "Enter address"}
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading
                        ? language === "vi"
                          ? "Đang lưu..."
                          : "Saving..."
                        : language === "vi"
                        ? "Lưu thay đổi"
                        : "Save Changes"}
                    </button>
                  </form>

                  {/* Change Password Section - Collapsible */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="w-full flex items-center justify-between text-xl font-bold text-gray-900 dark:text-white mb-4 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      <span>{language === "vi" ? "Đổi mật khẩu" : "Change Password"}</span>
                      <svg
                        className={`w-5 h-5 transition-transform ${showPasswordChange ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showPasswordChange && (
                      <div className="mt-4 animate-fadeInUp">
                        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 bg-gray-50 dark:bg-slate-900 rounded-lg p-6">
                          <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {language === "vi" ? "Mật khẩu cũ" : "Old Password"}
                            </label>
                            <input
                              id="oldPassword"
                              name="oldPassword"
                              type="password"
                              value={passwordData.oldPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {language === "vi" ? "Mật khẩu mới" : "New Password"}
                            </label>
                            <input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {language === "vi" ? "Xác nhận mật khẩu mới" : "Confirm New Password"}
                            </label>
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                              required
                            />
                          </div>

                          <button 
                            type="submit"
                            disabled={isChangingPassword}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isChangingPassword
                              ? language === "vi"
                                ? "Đang đổi mật khẩu..."
                                : "Changing..."
                              : language === "vi"
                              ? "Đổi mật khẩu"
                              : "Change Password"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Personalization Tab */}
              {activeTab === "personalization" && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === "vi" ? "Cá nhân hóa" : "Personalization"}
                  </h2>
                  
                  {/* Premium Check */}
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-20 w-20 text-orange-500 mx-auto mb-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {language === "vi" 
                          ? "Tính năng dành cho người dùng Premium" 
                          : "Premium Feature"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {language === "vi"
                          ? "Bạn cần nâng cấp tài khoản Premium để sử dụng tính năng cá nhân hóa"
                          : "You need to upgrade to Premium to use personalization features"}
                      </p>
                    </div>
                    
                    <Link
                      href="/choose-plan"
                      className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105"
                    >
                      {language === "vi" ? "Nâng cấp Premium" : "Upgrade to Premium"}
                    </Link>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === "vi" ? "Món ăn yêu thích" : "Favorite Foods"}
                  </h2>
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {language === "vi"
                        ? "Bạn chưa lưu món ăn yêu thích nào"
                        : "You haven't saved any favorite foods yet"}
                    </p>
                    <Link
                      href="/menu"
                      className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105"
                    >
                      {t("home.exploreMenu")}
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("settings.settings")}</h2>

                  <div className="space-y-6">
                    {/* Language Setting */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-orange-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{t("settings.language")}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === "vi" ? "Chọn ngôn ngữ ưa thích" : "Choose your preferred language"}
                          </p>
                        </div>
                      </div>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value as "en" | "vi")}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        aria-label="Select language"
                      >
                        {Object.entries(languages).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment History in Settings */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={20} className="text-orange-500" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {language === "vi" ? "Lịch sử thanh toán" : "Payment History"}
                        </h3>
                      </div>

                      {loadingPayments ? (
                        <p className="text-gray-600 dark:text-gray-400">{language === "vi" ? "Đang tải lịch sử..." : "Loading history..."}</p>
                      ) : paymentHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 pr-4">OrderCode</th>
                                <th className="py-3 pr-4">{language === "vi" ? "Số tiền" : "Amount"}</th>
                                <th className="py-3 pr-4">{language === "vi" ? "Mô tả" : "Description"}</th>
                                <th className="py-3 pr-4">{language === "vi" ? "Trạng thái" : "Status"}</th>
                                <th className="py-3">{language === "vi" ? "Tạo lúc" : "Created"}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentHistory.map((p) => (
                                <tr key={p.paymentId} className="border-b border-gray-100 dark:border-gray-800">
                                  <td className="py-3 pr-4 font-mono">{p.orderCode}</td>
                                  <td className="py-3 pr-4 text-orange-600 dark:text-orange-400 font-semibold">{p.amount.toLocaleString("vi-VN")} ₫</td>
                                  <td className="py-3 pr-4">{p.description}</td>
                                  <td className="py-3 pr-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      p.status === "PAID"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                        : p.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
                                    }`}>
                                      {p.status}
                                    </span>
                                  </td>
                                  <td className="py-3">{new Date(p.createdAt).toLocaleString("vi-VN")}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">{language === "vi" ? "Chưa có giao dịch nào" : "No payments yet"}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
