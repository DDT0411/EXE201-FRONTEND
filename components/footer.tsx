"use client"

import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export function Footer() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  return (
    <footer className="bg-orange-100 dark:bg-slate-900 border-t border-orange-200 dark:border-gray-800 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div className="animate-fadeInUp delay-100">
            <div className="flex items-center gap-3 font-bold text-lg sm:text-xl mb-4 transition-smooth hover:scale-105">
              <img 
                src="/new_logo.png" 
                alt="EatIT Logo" 
                className="w-10 h-10"
              />
              <span className="text-orange-600 dark:text-orange-400">EatIT</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              {language === "vi"
                ? "Giúp bạn tìm kiếm và đánh giá địa điểm ăn uống tốt nhất"
                : "Help you find and rate the best dining locations"}
            </p>
          </div>

          {/* Links */}
          <div className="animate-fadeInUp delay-200">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              {language === "vi" ? "Liên kết" : "Links"}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("nav.menu")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fadeInUp delay-300">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              {language === "vi" ? "Hỗ trợ" : "Support"}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors-smooth"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="animate-fadeInUp delay-400">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm sm:text-base">
              {t("footer.followUs")}
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61582094917117"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-smooth hover:scale-125"
                title="Facebook"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/eatit.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-smooth hover:scale-125"
                title="Instagram"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 dark:border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 EatIT. {language === "vi" ? "Tất cả quyền được bảo lưu." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  )
}
