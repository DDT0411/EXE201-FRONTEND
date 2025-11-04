import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

export async function POST(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("Email")

    if (!email) {
      return NextResponse.json(
        { statuscodes: 400, message: "Email is required" },
        { status: 400 }
      )
    }

    // Call external API (NO Authorization header needed for forgot password)
    const response = await fetch(`${API_BASE_URL}/Auth/forgot-password?Email=${encodeURIComponent(email)}`, {
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
        data = text ? { message: text } : { message: "Failed to send reset email" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to send reset email" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

