import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

export async function POST(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("Token")
    const email = searchParams.get("Email")

    if (!token || !email) {
      return NextResponse.json(
        { statuscodes: 400, message: "Token and Email are required" },
        { status: 400 }
      )
    }

    // Call external API (NO Authorization header)
    const response = await fetch(`${API_BASE_URL}/Auth/verify-reset-token?Token=${encodeURIComponent(token)}&Email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
      },
    })

    // Check if response has content
    const contentType = response.headers.get("content-type")
    let data
    try {
      if (contentType && contentType.includes("application/json")) {
        const text = await response.text()
        data = text ? JSON.parse(text) : null
      } else {
        const text = await response.text()
        data = text ? { message: text } : { message: "Token verification failed" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Token verification failed" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Verify reset token error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

