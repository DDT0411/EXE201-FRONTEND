"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import Link from "next/link"

export default function PrivacyPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: October 2024",
      sections: [
        {
          title: "1. Introduction",
          content:
            "EatIT ('we', 'us', 'our', or 'Company') operates the EatIT application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
        },
        {
          title: "2. Information Collection and Use",
          content:
            "We collect several different types of information for various purposes to provide and improve our Service to you. Types of Data Collected: Personal Data (name, email address, phone number, cookies and usage data), Usage Data (pages visited, time spent, links clicked, search queries).",
        },
        {
          title: "3. Use of Data",
          content:
            "EatIT uses the collected data for various purposes: to provide and maintain our Service; to notify you about changes to our Service; to allow you to participate in interactive features of our Service; to provide customer support; to gather analysis or valuable information so that we can improve our Service; to monitor the usage of our Service; to detect, prevent and address technical issues.",
        },
        {
          title: "4. Security of Data",
          content:
            "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
        },
        {
          title: "5. Changes to This Privacy Policy",
          content:
            "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this Privacy Policy.",
        },
        {
          title: "6. Contact Us",
          content:
            "If you have any questions about this Privacy Policy, please contact us at: Email: privacy@eatit.com or visit our Contact page.",
        },
      ],
    },
    vi: {
      title: "Chính Sách Bảo Mật",
      lastUpdated: "Cập nhật lần cuối: Tháng 10 năm 2024",
      sections: [
        {
          title: "1. Giới Thiệu",
          content:
            "EatIT ('chúng tôi', 'của chúng tôi') vận hành ứng dụng EatIT. Trang này thông báo cho bạn về chính sách của chúng tôi liên quan đến việc thu thập, sử dụng và tiết lộ dữ liệu cá nhân khi bạn sử dụng Dịch vụ của chúng tôi.",
        },
        {
          title: "2. Thu Thập và Sử Dụng Thông Tin",
          content:
            "Chúng tôi thu thập nhiều loại thông tin khác nhau cho các mục đích khác nhau để cung cấp và cải thiện Dịch vụ của chúng tôi cho bạn. Các loại dữ liệu được thu thập: Dữ liệu cá nhân (tên, địa chỉ email, số điện thoại, cookie và dữ liệu sử dụng), Dữ liệu sử dụng (các trang được truy cập, thời gian dành, liên kết được nhấp, truy vấn tìm kiếm).",
        },
        {
          title: "3. Sử Dụng Dữ Liệu",
          content:
            "EatIT sử dụng dữ liệu được thu thập cho các mục đích khác nhau: cung cấp và duy trì Dịch vụ của chúng tôi; thông báo cho bạn về những thay đổi đối với Dịch vụ của chúng tôi; cho phép bạn tham gia các tính năng tương tác của Dịch vụ của chúng tôi; cung cấp hỗ trợ khách hàng; thu thập phân tích hoặc thông tin có giá trị để cải thiện Dịch vụ của chúng tôi.",
        },
        {
          title: "4. Bảo Mật Dữ Liệu",
          content:
            "Bảo mật dữ liệu của bạn rất quan trọng đối với chúng tôi, nhưng hãy nhớ rằng không có phương pháp truyền tải qua Internet hoặc phương pháp lưu trữ điện tử nào là 100% an toàn. Mặc dù chúng tôi cố gắng sử dụng các phương tiện được chấp nhận thương mại để bảo vệ Dữ liệu cá nhân của bạn, chúng tôi không thể đảm bảo bảo mật tuyệt đối của nó.",
        },
        {
          title: "5. Thay Đổi Chính Sách Bảo Mật Này",
          content:
            "Chúng tôi có thể cập nhật Chính sách bảo mật của chúng tôi theo thời gian. Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách bảo mật mới trên trang này và cập nhật ngày 'Cập nhật lần cuối' ở đầu Chính sách bảo mật này.",
        },
        {
          title: "6. Liên Hệ Với Chúng Tôi",
          content:
            "Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi tại: Email: privacy@eatit.com hoặc truy cập trang Liên hệ của chúng tôi.",
        },
      ],
    },
  }

  const data = content[language as keyof typeof content] || content.vi

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fadeInDown">
            <Link href="/" className="text-orange-500 hover:text-orange-600 mb-4 inline-block">
              ← Quay lại
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">{data.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{data.lastUpdated}</p>
          </div>

          <div className="space-y-8 animate-fadeInUp">
            {data.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-b-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
