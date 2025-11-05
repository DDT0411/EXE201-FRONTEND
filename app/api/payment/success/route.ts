import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/payment/success?orderCode=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderCode = searchParams.get("orderCode")
    if (!orderCode) {
      return NextResponse.json({ message: "Missing orderCode" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Payment/success?orderCode=${encodeURIComponent(orderCode)}`,
      { method: "GET", headers }
    )
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Check payment success error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}


