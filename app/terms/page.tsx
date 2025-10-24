"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/hooks/use-language"
import Link from "next/link"

export default function TermsPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: October 2024",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content:
            "By accessing and using the EatIT application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        },
        {
          title: "2. Use License",
          content:
            "Permission is granted to temporarily download one copy of the materials (information or software) on EatIT for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on EatIT; remove any copyright or other proprietary notations from the materials; transfer the materials to another person or 'mirror' the materials on any other server.",
        },
        {
          title: "3. Disclaimer",
          content:
            "The materials on EatIT are provided on an 'as is' basis. EatIT makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
        },
        {
          title: "4. Limitations",
          content:
            "In no event shall EatIT or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EatIT, even if EatIT or an authorized representative has been notified orally or in writing of the possibility of such damage.",
        },
        {
          title: "5. Accuracy of Materials",
          content:
            "The materials appearing on EatIT could include technical, typographical, or photographic errors. EatIT does not warrant that any of the materials on EatIT are accurate, complete, or current. EatIT may make changes to the materials contained on EatIT at any time without notice.",
        },
        {
          title: "6. Links",
          content:
            "EatIT has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by EatIT of the site. Use of any such linked website is at the user's own risk.",
        },
        {
          title: "7. Modifications",
          content:
            "EatIT may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
        },
        {
          title: "8. Governing Law",
          content:
            "These terms and conditions are governed by and construed in accordance with the laws of Vietnam, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
        },
      ],
    },
    vi: {
      title: "Điều Khoản Dịch Vụ",
      lastUpdated: "Cập nhật lần cuối: Tháng 10 năm 2024",
      sections: [
        {
          title: "1. Chấp Nhận Điều Khoản",
          content:
            "Bằng cách truy cập và sử dụng ứng dụng EatIT, bạn chấp nhận và đồng ý tuân theo các điều khoản và quy định của thỏa thuận này. Nếu bạn không đồng ý tuân theo các điều khoản trên, vui lòng không sử dụng dịch vụ này.",
        },
        {
          title: "2. Giấy Phép Sử Dụng",
          content:
            "Chúng tôi cấp phép cho bạn tạm thời tải xuống một bản sao các tài liệu (thông tin hoặc phần mềm) trên EatIT chỉ để xem cá nhân, không thương mại. Đây là cấp phép, không phải chuyển nhượng quyền sở hữu. Dưới giấy phép này, bạn không được: sửa đổi hoặc sao chép tài liệu; sử dụng tài liệu cho bất kỳ mục đích thương mại nào; cố gắng dịch ngược hoặc phân tích bất kỳ phần mềm nào trên EatIT; xóa bất kỳ thông báo bản quyền nào; chuyển tài liệu cho người khác.",
        },
        {
          title: "3. Tuyên Bố Từ Chối Trách Nhiệm",
          content:
            "Các tài liệu trên EatIT được cung cấp 'nguyên trạng'. EatIT không đưa ra bất kỳ bảo đảm nào, rõ ràng hoặc ngụ ý, và từ chối mọi bảo đảm khác bao gồm bảo đảm về khả năng bán hàng, phù hợp cho một mục đích cụ thể, hoặc không vi phạm quyền sở hữu trí tuệ.",
        },
        {
          title: "4. Giới Hạn Trách Nhiệm",
          content:
            "EatIT không chịu trách nhiệm về bất kỳ thiệt hại nào (bao gồm mất dữ liệu, lợi nhuận hoặc gián đoạn kinh doanh) phát sinh từ việc sử dụng hoặc không thể sử dụng các tài liệu trên EatIT, ngay cả khi EatIT đã được thông báo về khả năng xảy ra thiệt hại.",
        },
        {
          title: "5. Độ Chính Xác Của Tài Liệu",
          content:
            "Các tài liệu trên EatIT có thể chứa lỗi kỹ thuật, chính tả hoặc hình ảnh. EatIT không bảo đảm rằng bất kỳ tài liệu nào trên EatIT là chính xác, đầy đủ hoặc hiện tại. EatIT có thể thay đổi các tài liệu bất kỳ lúc nào mà không cần thông báo.",
        },
        {
          title: "6. Liên Kết",
          content:
            "EatIT không chịu trách nhiệm về nội dung của bất kỳ trang web được liên kết nào. Việc bao gồm bất kỳ liên kết nào không có nghĩa là EatIT xác nhận trang web đó. Việc sử dụng bất kỳ trang web được liên kết nào là rủi ro của người dùng.",
        },
        {
          title: "7. Sửa Đổi",
          content:
            "EatIT có thể sửa đổi các điều khoản dịch vụ này bất kỳ lúc nào mà không cần thông báo. Bằng cách sử dụng trang web này, bạn đồng ý tuân theo phiên bản hiện tại của các điều khoản dịch vụ này.",
        },
        {
          title: "8. Luật Áp Dụng",
          content:
            "Các điều khoản này được điều chỉnh bởi luật pháp của Việt Nam, và bạn chịu sự quản lý độc quyền của các tòa án tại địa điểm đó.",
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
