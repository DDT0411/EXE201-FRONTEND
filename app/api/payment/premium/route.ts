import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// POST /api/payment/premium
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ReturnUrl = searchParams.get("ReturnUrl") || undefined
    const CancelUrl = searchParams.get("CancelUrl") || undefined

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Payment/premium${buildQuery({ ReturnUrl, CancelUrl })}`,
      { method: "POST", headers }
    )
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
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


