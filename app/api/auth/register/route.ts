import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { UserName, Email, Password, ConfirmPassword } = body

    // Validate required fields
    if (!UserName || !Email || !Password || !ConfirmPassword) {
      return NextResponse.json(
        { statuscodes: 400, message: "All fields are required" },
        { status: 400 }
      )
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      UserName,
      Email,
      Password,
      ConfirmPassword,
    })

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Auth/register?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        data = text ? { message: text } : { message: "Registration failed" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 })
    } else {
      return NextResponse.json(data, { status: response.status })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

