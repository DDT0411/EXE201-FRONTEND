import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/payment/history
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Payment/history`, { method: "GET", headers })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Get payment history error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}


