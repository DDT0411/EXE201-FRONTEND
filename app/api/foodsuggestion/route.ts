import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// POST /api/foodsuggestion
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header (optional)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Get request body
    const body = await request.json().catch(() => ({}))
    const radiusKm = body.radiusKm || 20

    // Call external API
    const response = await fetch(`${API_BASE_URL}/FoodSuggestion`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ radiusKm }),
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
        data = text ? { message: text } : { message: "Failed to get food suggestion" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs
      if (data && data.restaurantImg) {
  data.restaurantImg = data.restaurantImg.replace(config.imageUrlPrefix, "")
      }
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to get food suggestion" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get food suggestion error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

