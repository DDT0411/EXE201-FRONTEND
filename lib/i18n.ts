export const languages = {
  en: "English",
  vi: "Tiếng Việt",
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = "vi"

export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      menu: "Menu",
      favorites: "Favorites",
      about: "About",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      settings: "Settings",
      profile: "Profile",
      logout: "Logout",
      chatbot: "Chatbot",
    },
    // Home page
    home: {
      about: "About Us",
      aboutDesc:
        "EatIT is an application that helps you find and rate dining locations quickly and conveniently. From street food stalls to luxury restaurants, EatIT connects you with thousands of dining locations across Vietnam.",
      features: "We are here to help you choose",
      feature1: "Easy Search",
      feature1Desc: "Find restaurants and food stalls near you with interactive maps",
      feature2: "Real Reviews",
      feature2Desc: "See reviews from real users",
      feature3: "Smart Recommendations",
      feature3Desc: "Get food recommendations tailored to your preferences",
      cta: "Start exploring now",
      ctaDesc: "Join the EatIT community and discover amazing dining locations",
      exploreMenu: "Explore Menu",
    },
    // Auth
    auth: {
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      loginWith: "Login with",
      signupWith: "Sign up with",
      loginSuccess: "Login successful!",
      signupSuccess: "Account created successfully!",
    },
    // Pricing
    pricing: {
      selectPlan: "Choose Your Plan",
      selectPlanDesc: "Select a plan that suits your needs",
      free: "Free",
      premium: "Premium",
      freeDesc: "Perfect for casual users",
      premiumDesc: "For food enthusiasts",
      features: "Features",
      unlimited: "Unlimited",
      limited: "Limited",
      surprise: "Surprise Feature",
      surpriseDesc: "Get random food recommendations",
      choose: "Choose Plan",
      chosen: "Current Plan",
    },
    // Settings
    settings: {
      settings: "Settings",
      theme: "Theme",
      language: "Language",
      light: "Light",
      dark: "Dark",
      auto: "Auto",
      account: "Account",
      privacy: "Privacy",
      notifications: "Notifications",
      about: "About",
      logout: "Logout",
    },
    // Footer
    footer: {
      about: "About EatIT",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      followUs: "Follow Us",
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      previous: "Previous",
    },
  },
  vi: {
    // Navigation
    nav: {
      home: "Trang chủ",
      menu: "Menu",
      favorites: "Yêu thích",
      about: "Về chúng tôi",
      contact: "Liên hệ",
      login: "Đăng nhập",
      signup: "Đăng ký",
      settings: "Cài đặt",
      profile: "Hồ sơ",
      logout: "Đăng xuất",
      chatbot: "Chatbot",
    },
    // Home page
    home: {
      about: "Về chúng tôi",
      aboutDesc:
        "EatIT là ứng dụng giúp bạn tìm kiếm và đánh giá địa điểm ăn uống một cách nhanh chóng và tiện lợi. Từ quán ăn via hè đến nhà hàng sang trọng, EatIT kết nối bạn với hàng nghìn địa điểm ăn uống trên khắp Việt Nam.",
      features: "Chúng tôi ở đây để giúp bạn lựa chọn",
      feature1: "Tìm kiếm dễ dàng",
      feature1Desc: "Tìm kiếm nhà hàng, quán ăn gần bạn với bản đồ tương tác",
      feature2: "Đánh giá thực tế",
      feature2Desc: "Xem đánh giá từ những người dùng thực tế",
      feature3: "Gợi ý thông minh",
      feature3Desc: "Nhận gợi ý món ăn phù hợp với sở thích của bạn",
      cta: "Bắt đầu khám phá ngay",
      ctaDesc: "Tham gia cộng đồng EatIT và khám phá những địa điểm ăn uống tuyệt vời",
      exploreMenu: "Khám phá menu",
    },
    // Auth
    auth: {
      login: "Đăng nhập",
      signup: "Đăng ký",
      email: "Email",
      password: "Mật khẩu",
      confirmPassword: "Xác nhận mật khẩu",
      forgotPassword: "Quên mật khẩu?",
      noAccount: "Chưa có tài khoản?",
      haveAccount: "Đã có tài khoản?",
      loginWith: "Đăng nhập với",
      signupWith: "Đăng ký với",
      loginSuccess: "Đăng nhập thành công!",
      signupSuccess: "Tạo tài khoản thành công!",
    },
    // Pricing
    pricing: {
      selectPlan: "Chọn Gói Của Bạn",
      selectPlanDesc: "Chọn gói phù hợp với nhu cầu của bạn",
      free: "Miễn phí",
      premium: "Premium",
      freeDesc: "Hoàn hảo cho người dùng bình thường",
      premiumDesc: "Dành cho những người yêu thích ẩm thực",
      features: "Tính năng",
      unlimited: "Không giới hạn",
      limited: "Giới hạn",
      surprise: "Tính năng Surprise",
      surpriseDesc: "Nhận gợi ý món ăn ngẫu nhiên",
      choose: "Chọn Gói",
      chosen: "Gói Hiện Tại",
    },
    // Settings
    settings: {
      settings: "Cài đặt",
      theme: "Chủ đề",
      language: "Ngôn ngữ",
      light: "Sáng",
      dark: "Tối",
      auto: "Tự động",
      account: "Tài khoản",
      privacy: "Riêng tư",
      notifications: "Thông báo",
      about: "Về",
      logout: "Đăng xuất",
    },
    // Footer
    footer: {
      about: "Về EatIT",
      contact: "Liên hệ",
      terms: "Điều khoản dịch vụ",
      privacy: "Chính sách bảo mật",
      followUs: "Theo dõi chúng tôi",
    },
    // Common
    common: {
      loading: "Đang tải...",
      error: "Lỗi",
      success: "Thành công",
      cancel: "Hủy",
      save: "Lưu",
      delete: "Xóa",
      edit: "Chỉnh sửa",
      back: "Quay lại",
      next: "Tiếp theo",
      previous: "Trước đó",
    },
  },
} as const

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
