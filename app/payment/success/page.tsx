"use client"

import { useEffect, useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getPaymentSuccess } from "@/lib/api"
import { toast } from "@/lib/toast"
import { Check, Home, FileText } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()

  const [statusText, setStatusText] = useState<string>("Đang kiểm tra thanh toán...")
  const [isProcessing, setIsProcessing] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)
  const [orderCode, setOrderCode] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        // Get query params from PayOS
        // PayOS redirect về với: code, id, status, cancel (KHÔNG có orderCode)
        const code = searchParams.get("code")
        const status = searchParams.get("status")
        const cancel = searchParams.get("cancel")
        const id = searchParams.get("id")
        
        // Lấy orderCode từ localStorage (đã lưu khi tạo thanh toán)
        // Hoặc từ query params nếu có (fallback)
        const orderCodeParam = searchParams.get("orderCode") || localStorage.getItem("pending_orderCode")
        
        // Xóa orderCode khỏi localStorage sau khi lấy
        if (orderCodeParam && localStorage.getItem("pending_orderCode")) {
          localStorage.removeItem("pending_orderCode")
        }

        setOrderCode(orderCodeParam)

        // Log all params for debugging
        console.log("Payment success page - Query params:", {
          orderCode: orderCodeParam,
          code,
          status,
          cancel,
          id,
          isAuthenticated,
          hasToken: !!token
        })

        // Check if payment was cancelled
        if (cancel === "true") {
          setStatusText("Thanh toán đã bị hủy.")
          setIsProcessing(false)
          setIsCancelled(true)
          toast.info("Thanh toán đã bị hủy.")
          setTimeout(() => {
            router.push("/choose-plan")
          }, 2000)
          return
        }

        // Check payment status from PayOS
        // PayOS trả về code="00" khi thanh toán thành công
        // Nếu không có status, dựa vào code để xác định
        const isPaid = (status === "PAID" && code === "00") || code === "00"
        
        if (isPaid) {
          // Payment successful according to PayOS
          if (!orderCodeParam) {
            setStatusText("Thiếu mã đơn hàng (orderCode). Vui lòng kiểm tra lại lịch sử thanh toán.")
            setIsProcessing(false)
            // Vẫn hiển thị thành công nhưng không verify được
            setIsSuccess(true)
            setTimeout(() => {
              router.push("/profile")
            }, 3000)
            return
          }

          // Verify with backend if user is authenticated
          if (isAuthenticated && token) {
            try {
              const res = await getPaymentSuccess(orderCodeParam, token)
              if (res.success) {
                setStatusText("Cảm ơn bạn đã hoàn tất thanh toán. Hệ thống đã ghi nhận giao dịch của bạn.")
                setIsSuccess(true)
                toast.success("Thanh toán thành công!")
                setIsProcessing(false)
                // Don't auto redirect, let user choose
                return
              } else {
                setStatusText(res.message || "Thanh toán không thành công.")
                toast.info(res.message || "Thanh toán không thành công.")
                setIsProcessing(false)
                setTimeout(() => {
                  router.push("/choose-plan")
                }, 3000)
                return
              }
            } catch (err: any) {
              console.error("Error verifying payment:", err)
              // Even if verification fails, if PayOS says PAID, we trust it
              setStatusText("Thanh toán thành công! Vui lòng đăng nhập để kích hoạt Premium.")
              setIsSuccess(true)
              toast.success("Thanh toán thành công!")
              setIsProcessing(false)
              setTimeout(() => {
                router.push("/login")
              }, 2000)
              return
            }
          } else {
            // User not authenticated, but payment was successful
            setStatusText("Thanh toán thành công! Vui lòng đăng nhập để kích hoạt Premium.")
            setIsSuccess(true)
            toast.success("Thanh toán thành công!")
            setIsProcessing(false)
            setTimeout(() => {
              router.push("/login")
            }, 2000)
            return
          }
        } else {
          // Payment not successful
          // Nếu có code nhưng không phải "00" hoặc cancel=true
          if (code && code !== "00") {
            setStatusText(`Thanh toán không thành công. Mã lỗi: ${code}`)
          } else {
            setStatusText("Thanh toán không thành công. Vui lòng thử lại.")
          }
          toast.error("Thanh toán không thành công.")
          setIsProcessing(false)
          setTimeout(() => {
            router.push("/choose-plan")
          }, 2000)
          return
        }
      } catch (err: any) {
        console.error("Payment success page error:", err)
        setStatusText(err?.message || "Không thể kiểm tra thanh toán.")
        setIsProcessing(false)
        setTimeout(() => {
          router.push("/choose-plan")
        }, 3000)
      }
    }
    
    run()
  }, [searchParams, token, isAuthenticated, router])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {isProcessing ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                <p className="text-gray-700 dark:text-gray-300">{statusText}</p>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl shadow-xl p-8 sm:p-10 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-12 h-12 text-white stroke-[3]" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white flex items-center justify-center gap-2">
                Thanh toán thành công
                <span className="text-2xl">🎉</span>
              </h1>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-base sm:text-lg">
                {statusText}
              </p>

              {/* Order Code if available */}
              {orderCode && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-mono">
                  Mã đơn hàng: {orderCode}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Home className="w-5 h-5" />
                  Về trang chủ
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-slate-700 border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold transition-all duration-200"
                >
                  <FileText className="w-5 h-5" />
                  Xem đơn hàng
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">{statusText}</p>
              <button
                onClick={() => router.push("/choose-plan")}
                className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  <p className="text-gray-700 dark:text-gray-300">Đang tải...</p>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  )
}


