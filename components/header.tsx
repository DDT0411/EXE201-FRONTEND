"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Crown } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { useAuth } from "@/hooks/use-auth"
import { getPremiumStatus } from "@/lib/api"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const { user, isAuthenticated, token } = useAuth()
  const [isPremium, setIsPremium] = useState(false)
  const [isCheckingPremium, setIsCheckingPremium] = useState(true)

  // Check premium status
  useEffect(() => {
    const checkPremium = async () => {
      if (!isAuthenticated || !token) {
        setIsPremium(false)
        setIsCheckingPremium(false)
        return
      }
      try {
        const status = await getPremiumStatus(token)
        setIsPremium(status.hasPremium)
      } catch (err) {
        console.error("Failed to check premium status:", err)
        setIsPremium(false)
      } finally {
        setIsCheckingPremium(false)
      }
    }
    checkPremium()
  }, [isAuthenticated, token])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 animate-fadeInDown">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 font-bold text-3xl transition-smooth hover:scale-105">
          <img 
            src="/new_logo.png" 
            alt="EatIT Logo" 
            className="w-16 h-16"
          />
          <span className="text-orange-600">{language === "vi" ? "EatIT" : "EatIT"}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors-smooth relative group text-lg font-medium py-2">
            {t("nav.home")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/menu" className="text-gray-700 hover:text-orange-600 transition-colors-smooth relative group text-lg font-medium py-2">
            {t("nav.menu")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/favorites" className="text-gray-700 hover:text-orange-600 transition-colors-smooth relative group text-lg font-medium py-2">
            {t("nav.favorites")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors-smooth relative group text-lg font-medium py-2">
            {t("nav.about")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors-smooth relative group text-lg font-medium py-2">
            {t("nav.contact")}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/surprise"
            className="p-2 rounded-full hover:bg-orange-100 transition-smooth hover:scale-110 relative group"
            title={t("nav.surprise")}
          >
            <img 
              src="/Button.png" 
              alt="Food Recommendation" 
              className="w-9 h-9 object-contain"
            />
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {t("nav.surprise")}
            </span>
          </Link>

          {/* Premium Plan Button - Only show if authenticated and NOT premium */}
          {isAuthenticated && user && !isCheckingPremium && !isPremium && (
            <Link
              href="/choose-plan"
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-smooth hover:shadow-lg hover:scale-105 font-medium text-sm flex items-center gap-2"
              title={language === "vi" ? "Nâng cấp Premium" : "Upgrade to Premium"}
            >
              <Crown size={16} />
              {language === "vi" ? "Premium" : "Premium"}
            </Link>
          )}
          
          {/* Premium Badge - Show if user has premium */}
          {isAuthenticated && user && !isCheckingPremium && isPremium && (
            <div
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-medium text-sm flex items-center gap-2 cursor-default"
              title={language === "vi" ? "Bạn đang sử dụng Premium" : "You are using Premium"}
            >
              <Crown size={16} className="fill-white" />
              {language === "vi" ? "Premium" : "Premium"}
            </div>
          )}

          {/* Login Button / User Name */}
          {isAuthenticated && user ? (
            <Link
              href="/profile?tab=settings"
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-smooth hover:shadow-lg hover:scale-105 font-medium text-lg"
            >
              {user.userName}
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-smooth hover:shadow-lg hover:scale-105 font-medium text-lg"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden transition-transform hover:scale-110" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3 animate-slideUp">
          <Link href="/" className="block text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth">
            {t("nav.home")}
          </Link>
          <Link href="/menu" className="block text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth">
            {t("nav.menu")}
          </Link>
          <Link href="/favorites" className="block text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth">
            {t("nav.favorites")}
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth">
            {t("nav.about")}
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth">
            {t("nav.contact")}
          </Link>
          <Link
            href="/surprise"
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 py-2 transition-colors-smooth"
          >
            <img 
              src="/Button.png" 
              alt="Food Recommendation" 
              className="w-5 h-5 object-contain"
            />
            {t("nav.surprise")}
          </Link>
          {/* Premium Plan Button - Only show if authenticated and NOT premium */}
          {isAuthenticated && user && !isCheckingPremium && !isPremium && (
            <Link
              href="/choose-plan"
              className="block w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 text-center font-medium transition-smooth flex items-center justify-center gap-2"
            >
              <Crown size={16} />
              {language === "vi" ? "Premium" : "Premium"}
            </Link>
          )}
          
          {/* Premium Badge - Show if user has premium */}
          {isAuthenticated && user && !isCheckingPremium && isPremium && (
            <div
              className="block w-full px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-center font-medium flex items-center justify-center gap-2"
            >
              <Crown size={16} className="fill-white" />
              {language === "vi" ? "Premium" : "Premium"}
            </div>
          )}
          {isAuthenticated && user ? (
            <Link
              href="/profile?tab=settings"
              className="block w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-center font-medium transition-smooth"
            >
              {user.userName}
            </Link>
          ) : (
            <Link
              href="/login"
              className="block w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-center font-medium transition-smooth"
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
