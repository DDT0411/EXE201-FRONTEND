import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { statuscodes: 401, message: "Authorization token required" },
        { status: 401 }
      )
    }

    const token = authHeader.replace("Bearer ", "")

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const oldPassword = searchParams.get("OldPassword")
    const newPassword = searchParams.get("NewPassword")
    const confirmPassword = searchParams.get("ConfirmPassword")

    if (!oldPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { statuscodes: 400, message: "OldPassword, NewPassword, and ConfirmPassword are required" },
        { status: 400 }
      )
    }

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Auth/change-password?OldPassword=${encodeURIComponent(oldPassword)}&NewPassword=${encodeURIComponent(newPassword)}&ConfirmPassword=${encodeURIComponent(confirmPassword)}`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
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
        data = text ? { message: text } : { message: "Change password failed" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Change password failed" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

