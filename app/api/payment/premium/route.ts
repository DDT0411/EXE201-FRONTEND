import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// POST /api/payment/premium
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let ReturnUrl = searchParams.get("ReturnUrl") || undefined
    let CancelUrl = searchParams.get("CancelUrl") || undefined

    // Clean and validate URLs
    if (ReturnUrl) {
      // Remove any invalid prefixes (like "eat" that might be added by mistake)
      ReturnUrl = ReturnUrl.replace(/^eathttps?:\/\//, "https://")
      // Ensure URL is properly formatted
      if (!ReturnUrl.startsWith("http://") && !ReturnUrl.startsWith("https://")) {
        console.warn("Invalid ReturnUrl format:", ReturnUrl)
        ReturnUrl = undefined
      }
    }
    
    if (CancelUrl) {
      // Remove any invalid prefixes
      CancelUrl = CancelUrl.replace(/^eathttps?:\/\//, "https://")
      // Ensure URL is properly formatted
      if (!CancelUrl.startsWith("http://") && !CancelUrl.startsWith("https://")) {
        console.warn("Invalid CancelUrl format:", CancelUrl)
        CancelUrl = undefined
      }
    }

    console.log("Payment premium request:", { ReturnUrl, CancelUrl })

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const queryString = buildQuery({ ReturnUrl, CancelUrl })
    const upstreamUrl = `${API_BASE_URL}/Payment/premium${queryString}`
    
    console.log("Calling upstream:", upstreamUrl)

    const upstream = await fetch(upstreamUrl, { method: "POST", headers })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    
    console.log("Upstream response:", { status: upstream.status, data })

    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Create premium payment error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}

function buildQuery(params: Record<string, string | undefined>) {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v) p.append(k, v)
  })
  const qs = p.toString()
  return qs ? `?${qs}` : ""
}


