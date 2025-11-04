import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"

const API_BASE_URL = config.apiBaseUrl

// GET /api/dish/dishes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get token from Authorization header (optional)
    const authHeader = request.headers.get("authorization")
    let headers: HeadersInit = {
      Accept: "*/*",
    }

    if (authHeader) {
      headers.Authorization = authHeader
    }

    // Call external API
    const response = await fetch(`${API_BASE_URL}/Dish/dishes/${id}`, {
      method: "GET",
      headers,
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
        data = text ? { message: text } : { message: "Failed to fetch dish" }
      }
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      data = { message: "Invalid response from server" }
    }

    if (response.ok) {
      // Clean up image URLs
      if (data && data.dishImage) {
        data.dishImage = data.dishImage.replace(config.imageUrlPrefix, "")
      }
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { statuscodes: response.status, message: data?.message || "Failed to fetch dish" },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("Get dish error:", error)
    return NextResponse.json(
      { statuscodes: 500, message: "Internal server error" },
      { status: 500 }
    )
  }
}

