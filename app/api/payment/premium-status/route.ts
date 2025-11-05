import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/payment/premium-status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const headers: HeadersInit = { Accept: "*/*" }
    if (authHeader) headers.Authorization = authHeader

    const upstream = await fetch(`${API_BASE_URL}/Payment/premium-status`, { method: "GET", headers })
    const data = await upstream.json().catch(() => ({ message: "Invalid JSON" }))
    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    console.error("Get premium status error:", error)
    return NextResponse.json({ statuscodes: 500, message: "Internal server error" }, { status: 500 })
  }
}


