"use client"

import { useEffect, useState, Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getPaymentSuccess } from "@/lib/api"
import { toast } from "@/lib/toast"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()

  const [statusText, setStatusText] = useState<string>("Đang kiểm tra thanh toán...")
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        // Get all query params from PayOS
        const orderCode = searchParams.get("orderCode")
        const code = searchParams.get("code")
        const status = searchParams.get("status")
        const cancel = searchParams.get("cancel")
        const id = searchParams.get("id")

        // Log all params for debugging
        console.log("Payment success page - Query params:", {
          orderCode,
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
          toast.info("Thanh toán đã bị hủy.")
          setTimeout(() => {
            router.push("/choose-plan")
          }, 2000)
          return
        }

        // Check payment status from PayOS
        if (status === "PAID" && code === "00") {
          // Payment successful according to PayOS
          if (!orderCode) {
            setStatusText("Thiếu mã đơn hàng (orderCode)")
            setIsProcessing(false)
            return
          }

          // Verify with backend if user is authenticated
          if (isAuthenticated && token) {
            try {
              const res = await getPaymentSuccess(orderCode, token)
              if (res.success) {
                setStatusText("Thanh toán thành công! Tài khoản Premium đã được kích hoạt.")
                toast.success("Thanh toán thành công!")
                setIsProcessing(false)
                // Redirect to home after 2 seconds
                setTimeout(() => {
                  window.location.href = "https://eatit-two.vercel.app/"
                }, 2000)
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
            toast.success("Thanh toán thành công!")
            setIsProcessing(false)
            setTimeout(() => {
              router.push("/login")
            }, 2000)
            return
          }
        } else {
          // Payment not successful
          setStatusText("Thanh toán không thành công. Vui lòng thử lại.")
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">Kết quả thanh toán</h1>
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <p className="text-gray-700 dark:text-gray-300">{statusText}</p>
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{statusText}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="px-5 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                >
                  Về trang chủ
                </button>
                <button
                  onClick={() => router.push("/profile")}
                  className="px-5 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold transition-colors"
                >
                  Về trang cá nhân
                </button>
              </div>
            </>
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
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
          <Header />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className="text-gray-700 dark:text-gray-300">Đang tải...</p>
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


