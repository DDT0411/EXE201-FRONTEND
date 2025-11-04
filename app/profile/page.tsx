"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Settings, LogOut, Heart, Globe, Sparkles } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { languages } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, updateUserProfile, logoutUser, changePassword, UserProfile, ChangePasswordParams } from "@/lib/api"
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
      
      // Clear password form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
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

                  {/* Change Password Section */}
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {language === "vi" ? "Đổi mật khẩu" : "Change Password"}
                    </h3>
                    <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
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
                </div>
              )}

              {/* Personalization Tab */}
              {activeTab === "personalization" && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === "vi" ? "Cá nhân hóa" : "Personalization"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {language === "vi" 
                      ? "Tùy chỉnh sở thích của bạn để nhận được gợi ý món ăn phù hợp nhất" 
                      : "Customize your preferences to receive the most suitable food recommendations"}
                  </p>

                  <form onSubmit={handleSubmitPersonalization} className="space-y-6">
                    <div>
                      <label htmlFor="preference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Món ăn yêu thích" : "Food Preference"}
                      </label>
                      <textarea
                        id="preference"
                        name="preference"
                        value={formData.preference}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        placeholder={language === "vi" ? "Nhập món ăn yêu thích của bạn..." : "Enter your favorite foods..."}
                      />
                    </div>

                    <div>
                      <label htmlFor="dislike" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Không thích" : "Dislike"}
                      </label>
                      <textarea
                        id="dislike"
                        name="dislike"
                        value={formData.dislike}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        placeholder={language === "vi" ? "Nhập món ăn bạn không thích..." : "Enter foods you don't like..."}
                      />
                    </div>

                    <div>
                      <label htmlFor="allergy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Dị ứng" : "Allergy"}
                      </label>
                      <textarea
                        id="allergy"
                        name="allergy"
                        value={formData.allergy}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        placeholder={language === "vi" ? "Nhập thông tin dị ứng của bạn..." : "Enter your allergy information..."}
                      />
                    </div>

                    <div>
                      <label htmlFor="diet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === "vi" ? "Chế độ ăn" : "Diet"}
                      </label>
                      <textarea
                        id="diet"
                        name="diet"
                        value={formData.diet}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                        placeholder={
                          language === "vi"
                            ? "Nhập chế độ ăn của bạn (ví dụ: chay, keto, low-carb)..."
                            : "Enter your diet (e.g., vegetarian, keto, low-carb)..."
                        }
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoadingPersonalization}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingPersonalization
                        ? language === "vi"
                          ? "Đang lưu..."
                          : "Saving..."
                        : language === "vi"
                        ? "Lưu thay đổi"
                        : "Save Changes"}
                    </button>
                  </form>
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

                    {/* Notifications Setting */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("settings.notifications")}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {language === "vi"
                            ? "Nhận thông báo về gợi ý mới"
                            : "Receive notifications about new recommendations"}
                        </p>
                      </div>
                      <input 
                        id="notifications" 
                        type="checkbox" 
                        defaultChecked 
                        className="w-5 h-5 cursor-pointer" 
                        aria-label="Enable notifications"
                      />
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
