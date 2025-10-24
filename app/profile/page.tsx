"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { User, Settings, LogOut, Heart, Globe } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { languages } from "@/lib/i18n"

export default function ProfilePage() {
  const { language, changeLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState({
    name: language === "vi" ? "Nguyễn Văn A" : "John Doe",
    email: "user@example.com",
    phone: "0123456789",
    avatar: "/placeholder.svg?height=128&width=128",
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-20 animate-fadeInUp">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover hover:scale-110 transition-smooth"
                  />
                  <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                {/* Menu */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "profile" ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <User size={20} />
                    <span>{language === "vi" ? "Hồ sơ" : "Profile"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "favorites" ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Heart size={20} />
                    <span>{language === "vi" ? "Yêu thích" : "Favorites"}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth ${
                      activeTab === "settings" ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings size={20} />
                    <span>{t("settings.settings")}</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-smooth">
                    <LogOut size={20} />
                    <span>{t("nav.logout")}</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "vi" ? "Thông tin hồ sơ" : "Profile Information"}
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "vi" ? "Tên đầy đủ" : "Full Name"}
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        defaultValue={user.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t("auth.email")}</label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        {language === "vi" ? "Số điện thoại" : "Phone Number"}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
                      />
                    </div>

                    <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-smooth font-semibold hover:shadow-lg hover:scale-105">
                      {language === "vi" ? "Lưu thay đổi" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div className="bg-white rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "vi" ? "Món ăn yêu thích" : "Favorite Foods"}
                  </h2>
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
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
                <div className="bg-white rounded-lg p-8 animate-fadeInUp">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("settings.settings")}</h2>

                  <div className="space-y-6">
                    {/* Language Setting */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <Globe size={20} className="text-orange-500" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{t("settings.language")}</h3>
                          <p className="text-sm text-gray-600">
                            {language === "vi" ? "Chọn ngôn ngữ ưa thích" : "Choose your preferred language"}
                          </p>
                        </div>
                      </div>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value as "en" | "vi")}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-smooth"
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
                        <h3 className="font-semibold text-gray-900">{t("settings.notifications")}</h3>
                        <p className="text-sm text-gray-600">
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
