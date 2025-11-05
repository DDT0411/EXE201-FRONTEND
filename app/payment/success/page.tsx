"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getPaymentSuccess } from "@/lib/api"
import { toast } from "@/lib/toast"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token } = useAuth()

  const [statusText, setStatusText] = useState<string>("Đang kiểm tra thanh toán...")

  useEffect(() => {
    const oc = searchParams.get("orderCode")
    if (!oc) {
      setStatusText("Thiếu mã đơn hàng (orderCode)")
      return
    }
    const run = async () => {
      try {
        if (!token) {
          setStatusText("Vui lòng đăng nhập để kiểm tra trạng thái.")
          return
        }
        const res = await getPaymentSuccess(oc, token)
        if (res.success) {
          setStatusText("Thanh toán thành công! Tài khoản Premium đã được kích hoạt.")
          toast.success("Thanh toán thành công!")
        } else {
          setStatusText(res.message || "Thanh toán không thành công.")
          toast.info(res.message || "Thanh toán không thành công.")
        }
      } catch (err: any) {
        setStatusText(err?.message || "Không thể kiểm tra thanh toán.")
      }
    }
    run()
  }, [searchParams, token])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Kết quả thanh toán</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{statusText}</p>
          <button
            onClick={() => router.push("/profile")}
            className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            Về trang cá nhân
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}


